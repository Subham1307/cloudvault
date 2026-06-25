'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import { Dashboard } from '@/components/dashboard/dashboard'
import { LoadingSpinner } from '@/components/dashboard/loading'

export default function DashboardRoute() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <Dashboard
      user={{
        username: session?.user?.name ?? '',
      }}
      onLogout={() => signOut()}
    />
  )
}