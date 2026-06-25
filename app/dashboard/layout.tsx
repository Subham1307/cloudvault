import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your securely uploaded files in your CloudVault dashboard.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
