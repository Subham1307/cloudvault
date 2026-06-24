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
    <nav className="sticky top-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg shadow-blue-900/5 px-6 py-3 flex items-center justify-between transition-all">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
            <CloudIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight">CloudVault</h2>
            <p className="text-xs text-blue-600 font-semibold tracking-wide uppercase">Secure</p>
          </div>
        </div>

        {/* Center - File count badge */}
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-blue-50 border border-blue-100 rounded-full px-5 py-2 text-sm font-bold text-blue-700 shadow-inner">
            {fileCount} <span className="font-medium text-blue-500">file{fileCount !== 1 ? 's' : ''} stored</span>
          </div>
        </div>

        {/* Right side - Navigation and User */}
        <div className="flex items-center gap-5">
          {/* View toggle */}
          <button
            onClick={onShowFiles}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm ${
              showingFiles
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-slate-200'
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
          <div className="h-10 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{user?.username}</p>
              <p className="text-xs font-semibold text-emerald-500">Pro Member</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors shadow-sm"
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
