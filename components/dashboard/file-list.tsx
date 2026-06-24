'use client'

import { DownloadIcon, TrashIcon, FileTextIcon, FileIcon, ImageIcon, VideoIcon, CodeIcon } from 'lucide-react'
import type { UploadedFile } from './dashboard'

interface FileListProps {
  files: UploadedFile[]
  onDownload: (file: UploadedFile) => void
  onDelete: (fileId: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getFileIcon(type: string) {
  if (type.startsWith('image')) return <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center"><ImageIcon className="w-6 h-6 text-pink-600" /></div>
  if (type.startsWith('video')) return <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center"><VideoIcon className="w-6 h-6 text-purple-600" /></div>
  if (type.includes('javascript') || type.includes('json') || type.includes('html')) return <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><CodeIcon className="w-6 h-6 text-amber-600" /></div>
  if (type.startsWith('text') || type.includes('pdf')) return <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><FileTextIcon className="w-6 h-6 text-blue-600" /></div>
  
  return <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center"><FileIcon className="w-6 h-6 text-slate-500" /></div>
}

export function FileList({ files, onDownload, onDelete }: FileListProps) {
  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <div
          key={file.id}
          className="bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex items-center justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              {getFileIcon(file.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 truncate text-base group-hover:text-blue-600 transition-colors">
                {file.name}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {formatDate(file.uploadedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onDownload(file)}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors shadow-sm"
              aria-label={`Download ${file.name}`}
              title="Download file"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(file.id)}
              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors shadow-sm"
              aria-label={`Delete ${file.name}`}
              title="Delete file"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
