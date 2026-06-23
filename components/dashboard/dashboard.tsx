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
    // Placeholder for download functionality
    console.log('Downloading:', file.name)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      <TopNavigation
        user={user}
        fileCount={files.length}
        onLogout={onLogout}
        onShowFiles={() => setShowFileList(!showFileList)}
        showingFiles={showFileList}
      />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {!showFileList ? (
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome, {user?.username}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Upload and manage your files securely in one place
              </p>
            </div>

            <UploadArea onFilesSelected={handleFileUpload} />

            {files.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Recent Uploads</h2>
                <FileList
                  files={files.slice(0, 5)}
                  onDownload={handleDownloadFile}
                  onDelete={handleDeleteFile}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">All Files</h1>
              <p className="text-muted-foreground">
                You have {files.length} file{files.length !== 1 ? 's' : ''} stored
              </p>
            </div>

            {files.length === 0 ? (
              <div className="bg-card rounded-2xl shadow-lg p-12 text-center">
                <p className="text-muted-foreground text-lg">No files uploaded yet</p>
              </div>
            ) : (
              <FileList
                files={files}
                onDownload={handleDownloadFile}
                onDelete={handleDeleteFile}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
