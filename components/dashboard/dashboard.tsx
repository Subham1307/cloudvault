'use client'

import { useState } from 'react'
import { TopNavigation } from './top-navigation'
import { UploadArea } from './upload-area'
import { FileList } from './file-list'

interface DashboardProps {
  user: { username: string } | null
  onLogout: () => void
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [showFileList, setShowFileList] = useState(false)

  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles: UploadedFile[] = uploadedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }))

    setFiles((prev) => [...newFiles, ...prev])
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleDownloadFile = (file: UploadedFile) => {
    console.log('Downloading:', file.name)
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
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
