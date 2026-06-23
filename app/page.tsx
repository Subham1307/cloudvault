'use client'

import { useState } from 'react'
import { LoginPage } from '@/components/auth/login-page'
import { Dashboard } from '@/components/dashboard/dashboard'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string } | null>(null)

  const handleLogin = (username: string) => {
    setUser({ username })
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
