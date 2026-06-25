import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your CloudVault account or create a new one to start uploading files securely.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
