import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cloudvault.app'),
  title: {
    default: 'CloudVault — Secure, Encrypted Cloud File Storage',
    template: '%s | CloudVault',
  },
  description:
    'Upload, store, and share files with enterprise-grade SHA-256 encryption, smart deduplication, and lightning-fast chunked uploads. Your data, your control.',
  keywords: [
    'cloud storage',
    'file upload',
    'encrypted storage',
    'file sharing',
    'secure files',
    'deduplication',
    'chunked upload',
  ],
  authors: [{ name: 'CloudVault' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CloudVault',
    title: 'CloudVault — Secure, Encrypted Cloud File Storage',
    description:
      'Upload, store, and share files with enterprise-grade encryption and smart deduplication.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudVault' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudVault — Secure Cloud Storage',
    description:
      'Enterprise-grade encrypted file storage with smart deduplication.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8fafc',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
