'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CloudIcon, ArrowRightIcon } from 'lucide-react'

interface LoginPageProps {
  onLogin: (username: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!isSignUp && username === 'User' && password === '1234') {
      onLogin(username)
    } else if (isSignUp && username && password.length >= 4) {
      onLogin(username)
    } else if (!isSignUp) {
      setError('Invalid credentials. Try username: User, password: 1234')
    } else {
      setError('Password must be at least 4 characters')
    }
  }

  const handleGoogleAuth = () => {
    setError('Google authentication coming soon')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl p-4 shadow-xl transform transition hover:scale-110 hover:rotate-3">
              <CloudIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">CloudVault</h1>
          <p className="text-slate-500 text-base">
            Beautiful, secure cloud storage
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-8 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-slate-100/50 p-1 rounded-xl">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                !isSignUp
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isSignUp
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3.5 rounded-xl border-none bg-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 rounded-xl border-none bg-white/60 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2 transform transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 mt-4 text-lg"
            >
              {isSignUp ? 'Get Started' : 'Welcome Back'}
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 font-semibold text-slate-700 shadow-sm hover:shadow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2 hover:text-blue-600 transition-colors bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <span className="text-blue-500">✨</span> Encrypted
          </div>
          <div className="flex items-center gap-2 hover:text-blue-600 transition-colors bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <span className="text-purple-500">⚡</span> Lightning Fast
          </div>
        </div>
      </div>
    </div>
  )
}
