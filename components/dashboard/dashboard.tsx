'use client'

import { useState, useEffect } from 'react'
import { TopNavigation } from './top-navigation'
import { UploadArea } from './upload-area'
import { FileList } from './file-list'
import { hashFileWithWorker } from '@/lib/fileService'
import { CHUNK_SIZE, MAX_CONCURRENT_CHUNK_UPLOAD_S3 } from '@/constants/constant'
import { chunk } from '@/lib/types'

interface DashboardProps {
  user: { username: string } | null
  onLogout: () => void
}

export interface FileVersion {
  id: string
  versionNumber: number
  size: number | string
  createdAt: Date | string
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  uploadProgress?: number
  versions?: FileVersion[]
  selectedVersion?: number
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [showFileList, setShowFileList] = useState(false)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/v1/files')
        if (res.ok) {
          const data = await res.json()
          const mappedFiles: UploadedFile[] = data.map((f: any) => {
            const sortedVersions = f.versions?.sort((a: any, b: any) => b.versionNumber - a.versionNumber) || []
            const latestVersion = sortedVersions[0]
            return {
              id: f.id,
              name: f.filename,
              size: Number(latestVersion?.size || 0),
              type: 'unknown',
              uploadedAt: new Date(latestVersion?.createdAt || Date.now()),
              versions: sortedVersions,
              selectedVersion: latestVersion?.versionNumber
            }
          })
          setFiles(mappedFiles)
        }
      } catch (error) {
        console.error("Failed to fetch files:", error)
      }
    }
    fetchFiles()
  }, [])

  const handleVersionChange = (fileId: string, versionNumber: number) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId && f.versions) {
        const selectedV = f.versions.find(v => v.versionNumber === versionNumber)
        if (selectedV) {
          return {
            ...f,
            selectedVersion: versionNumber,
            size: Number(selectedV.size),
            uploadedAt: new Date(selectedV.createdAt)
          }
        }
      }
      return f
    }))
  }


  const handleFileUpload = async (uploadedFiles: File[]) => {
    const initialFiles: UploadedFile[] = uploadedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      uploadProgress: 0,
    }))

    setFiles((prev) => [...initialFiles, ...prev])

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      const fileId = initialFiles[i].id

      setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, uploadProgress: 5 } : f))
      const rawChunks: chunk[] = await hashFileWithWorker(file) as chunk[];
      const chunks: chunk[] = rawChunks.map(c => ({
        ...c,
        abortController: new AbortController()  // created on main thread
      }))
      setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, uploadProgress: 10 } : f))
      const response = await fetch('/api/v1/upload/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          chunkHashes: chunks.map((chunk) => chunk.hash),
        }),
      });
      if (!response.ok) {
        console.error('Failed to initialize upload');
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, uploadProgress: -1 } : f))
        throw new Error('Failed to initialize upload');
      }
      const data = await response.json();
      console.log(data);
      const chunksHashToBlobwithAbortController: { hash: string, blob: Blob, abortController?: AbortController }[] = chunks.map((chunk) => {
        return {
          hash: chunk.hash,
          blob: file.slice(chunk.start, chunk.end + 1),
          abortController: chunk.abortController,
        }
      })

      const { uploads } = data;
      let completedChunks = 0;
      const totalUploads = uploads.length;

      if (totalUploads === 0) {
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, uploadProgress: 90 } : f))
      } else {
        const uploadTasks = uploads.map((upload: { presignedUrl: string, hash: string, base64EncodedHash: string }) => async () => {
          const { presignedUrl, hash, base64EncodedHash } = upload;
          const blob = chunksHashToBlobwithAbortController.find((chunk) => chunk.hash === hash)?.blob;
          const abortController = chunksHashToBlobwithAbortController.find((chunk) => chunk.hash === hash)?.abortController;
          if (blob) {
            await uploadChunkToS3(presignedUrl, blob, abortController!, base64EncodedHash);
            completedChunks++;
            const progress = 10 + Math.floor((completedChunks / totalUploads) * 80);
            setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, uploadProgress: progress } : f))
          }
        })
        const activeUploadTaks: Set<Promise<void>> = new Set();
        for (const task of uploadTasks) {
          const promise = task();
          activeUploadTaks.add(promise);
          promise.finally(() => {
            activeUploadTaks.delete(promise);
          });
          if (activeUploadTaks.size >= MAX_CONCURRENT_CHUNK_UPLOAD_S3) {
            await Promise.race(activeUploadTaks);
          }
        }
        await Promise.all(activeUploadTaks);
      }
      console.log('Uploaded file:', file.name);

      const completeResponse = await fetch('/api/v1/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: data.sessionId,
        }),
      });
      if (!completeResponse.ok) {
        console.error('Failed to complete upload');
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, uploadProgress: -1 } : f))
        throw new Error('Failed to complete upload');
      }
      const completeData = await completeResponse.json();
      console.log(completeData);

      setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, uploadProgress: 100 } : f))
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleDownloadFile = (file: UploadedFile) => {
    console.log('Downloading:', file.name)
  }

  // XHR upload (needed for progress later) 
  const uploadChunkToS3 = (presignedUrl: string, blob: Blob, abortController: AbortController, base64EncodedHash: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.addEventListener('load', () => {
        xhr.status === 200 ? resolve() : reject(new Error(`S3 error: ${xhr.status}`))
      })
      xhr.addEventListener('error', () => reject(new Error('Network error')))
      xhr.open('PUT', presignedUrl)
      xhr.setRequestHeader('Content-Type', 'application/octet-stream')
      xhr.setRequestHeader('x-amz-checksum-sha256', base64EncodedHash)
      xhr.send(blob)
      abortController.signal.addEventListener('abort', () => {
        xhr.abort()
      })
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 font-sans">
      <TopNavigation
        user={user}
        fileCount={files.length}
        onLogout={onLogout}
        onShowFiles={() => setShowFileList(!showFileList)}
        showingFiles={showFileList}
      />

      <main className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10" />

        {!showFileList ? (
          <div className="space-y-8">
            <div className="text-center mb-14">
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 mb-4 tracking-tight">
                Welcome, {user?.username}!
              </h1>
              <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                Securely store, organize, and share your most important files with lightning speed.
              </p>
            </div>

            <UploadArea onFilesSelected={handleFileUpload} />

            {files.length > 0 && (
              <div className="mt-16 pt-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <span className="bg-gradient-to-tr from-blue-500 to-purple-500 text-transparent bg-clip-text">Recent Uploads</span>
                </h2>
                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-white/50">
                  <FileList
                    files={files.slice(0, 5)}
                    onDownload={handleDownloadFile}
                    onDelete={handleDeleteFile}
                    onVersionChange={handleVersionChange}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-blue-200/50 pb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight">All Files</h1>
                <p className="text-slate-500 font-medium mt-2">
                  You have <span className="text-blue-600 font-bold">{files.length}</span> file{files.length !== 1 ? 's' : ''} stored securely
                </p>
              </div>
            </div>

            {files.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-16 text-center transform transition-all">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No files yet</h3>
                <p className="text-slate-500">Go to the dashboard to upload your first file.</p>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-6">
                <FileList
                  files={files}
                  onDownload={handleDownloadFile}
                  onDelete={handleDeleteFile}
                  onVersionChange={handleVersionChange}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
