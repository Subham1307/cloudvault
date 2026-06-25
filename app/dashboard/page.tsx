'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dashboard } from '@/components/dashboard/dashboard'

export default function DashboardRoute() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('cloudvault_user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      router.replace('/login')
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('cloudvault_user')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return <Dashboard user={user} onLogout={handleLogout} />
}
