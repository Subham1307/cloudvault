import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cloudvault.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login'],
        disallow: ['/dashboard', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
