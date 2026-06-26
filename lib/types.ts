export type chunk = {
    start: number
    end: number
    hash: string
    status: 'pending' | 'uploading' | 'completed' | 'failed'
    preSignedUrl: string
    abortController?: AbortController
  }