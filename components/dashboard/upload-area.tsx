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
      className={`relative rounded-[2.5rem] transition-all duration-300 cursor-pointer overflow-hidden group ${
        isDragging
          ? 'scale-105 shadow-2xl shadow-blue-500/20 bg-blue-50/80 border-4 border-blue-500'
          : 'bg-white/60 backdrop-blur-md border-[3px] border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Dynamic Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-teal-400/10 transition-opacity duration-500 ${isDragging ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'}`} />

      {/* Content */}
      <div className="relative p-20 text-center">
        {uploadProgress !== null ? (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/40 animate-bounce">
                <FileIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-700 mb-4 tracking-wide">Uploading to Vault...</p>
              <div className="w-full max-w-sm mx-auto bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full relative"
                  style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite]" />
                </div>
              </div>
              <p className="text-sm font-bold text-blue-600 mt-3">
                {Math.round(Math.min(uploadProgress, 100))}%
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <CloudUploadIcon className="w-12 h-12 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
                Drag & Drop files to upload
              </h3>
              <p className="text-slate-500 font-medium">
                or <span className="text-blue-600 underline decoration-2 underline-offset-4 cursor-pointer hover:text-blue-800">browse from your device</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm font-semibold text-slate-400 pt-6 max-w-xs mx-auto">
              <span className="h-0.5 flex-1 bg-slate-200 rounded-full" />
              <span className="bg-slate-100 px-3 py-1 rounded-lg">All files supported</span>
              <span className="h-0.5 flex-1 bg-slate-200 rounded-full" />
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
