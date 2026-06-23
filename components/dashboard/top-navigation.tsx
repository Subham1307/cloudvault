'use client'

import { CloudIcon, LogOutIcon, ListIcon, HomeIcon } from 'lucide-react'

interface TopNavigationProps {
  user: { username: string } | null
  fileCount: number
  onLogout: () => void
  onShowFiles: () => void
  showingFiles: boolean
}

export function TopNavigation({
  user,
  fileCount,
  onLogout,
  onShowFiles,
  showingFiles,
}: TopNavigationProps) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <CloudIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">CloudVault</h2>
            <p className="text-xs text-muted-foreground">Secure Storage</p>
          </div>
        </div>

        {/* Center - File count badge */}
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-secondary rounded-full px-4 py-2 text-sm font-medium text-foreground">
            {fileCount} file{fileCount !== 1 ? 's' : ''} stored
          </div>
        </div>

        {/* Right side - Navigation and User */}
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <button
            onClick={onShowFiles}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              showingFiles
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            {showingFiles ? (
              <>
                <ListIcon className="w-4 h-4" />
                <span className="hidden sm:inline">All Files</span>
              </>
            ) : (
              <>
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </>
            )}
          </button>

          {/* User info */}
          <div className="h-10 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="ml-2 p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
