'use client'

import { useRef, useState } from 'react'
import { CloudUploadIcon, FileIcon } from 'lucide-react'

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void
}

export function UploadArea({ onFilesSelected }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      simulateUpload(droppedFiles)
      onFilesSelected(droppedFiles)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      simulateUpload(selectedFiles)
      onFilesSelected(selectedFiles)
    }
  }

  const simulateUpload = (files: File[]) => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setUploadProgress(null), 1000)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 200)
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group ${
        isDragging
          ? 'border-primary bg-primary/5 scale-105'
          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/2.5'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/5 group-hover:opacity-100 opacity-0 transition-opacity" />

      {/* Content */}
      <div className="relative p-16 text-center">
        {uploadProgress !== null ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                <FileIcon className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Uploading...</p>
              <div className="w-full max-w-xs mx-auto bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
                  style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(Math.min(uploadProgress, 100))}%
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CloudUploadIcon className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                Drag & drop your files here
              </h3>
              <p className="text-muted-foreground text-sm">
                or click to browse from your computer
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
              <span className="h-px flex-1 bg-border" />
              <span>Support any file type</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload files"
      />
    </div>
  )
}
