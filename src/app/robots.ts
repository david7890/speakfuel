import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://speakfuel.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard*',  // Bloquear dashboard privado
          '/lesson*',     // Bloquear lecciones privadas
          '/api*',        // Bloquear APIs
          '/_next*',      // Bloquear archivos Next.js
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard*',
          '/lesson*',
          '/api*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 