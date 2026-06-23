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

    // Demo credentials
    if (!isSignUp && username === 'User' && password === '1234') {
      onLogin(username)
    } else if (isSignUp && username && password.length >= 4) {
      onLogin(username)
    } else if (!isSignUp) {
      setError('Invalid credentials. Try username: User, password: 1234')
    } else {
      setError('Password must be at least 4 characters')
    }

    setPassword('')
  }

  const handleGoogleAuth = () => {
    // Google auth placeholder
    setError('Google authentication coming soon')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-2xl p-4 shadow-lg">
              <CloudIcon className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">CloudVault</h1>
          <p className="text-muted-foreground text-sm">
            Secure cloud storage for your important files
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isSignUp
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isSignUp
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {!isSignUp && (
                <p className="text-xs text-muted-foreground mt-1">Demo: User</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {!isSignUp && (
                <p className="text-xs text-muted-foreground mt-1">Demo: 1234</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full px-4 py-3 rounded-lg border-2 border-border hover:bg-secondary transition-all flex items-center justify-center gap-2 font-medium text-foreground"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold">✓</span> Enterprise Security
          </div>
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold">✓</span> 99.9% Uptime
          </div>
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold">✓</span> Zero Knowledge
          </div>
        </div>
      </div>
    </div>
  )
}
