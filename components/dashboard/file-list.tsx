'use client'

import { DownloadIcon, TrashIcon, FileTextIcon, FileIcon } from 'lucide-react'
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
  if (type.startsWith('text')) {
    return <FileTextIcon className="w-5 h-5 text-blue-500" />
  }
  return <FileIcon className="w-5 h-5 text-slate-400" />
}

export function FileList({ files, onDownload, onDelete }: FileListProps) {
  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all p-4 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              {getFileIcon(file.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate text-sm hover:text-primary transition-colors">
                {file.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDownload(file)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-all"
              aria-label={`Download ${file.name}`}
              title="Download file"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(file.id)}
              className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-all"
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
