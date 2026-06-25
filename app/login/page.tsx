'use client'

import { useRouter } from 'next/navigation'
import { LoginPage } from '@/components/auth/login-page'

export default function LoginRoute() {
  const router = useRouter()

  const handleLogin = (username: string) => {
    // Store user in sessionStorage for the demo
    sessionStorage.setItem('cloudvault_user', JSON.stringify({ username }))
    router.push('/dashboard')
  }

  return <LoginPage onLogin={handleLogin} />
}
