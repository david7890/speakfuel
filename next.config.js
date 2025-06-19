/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para producción
  poweredByHeader: false, // Ocultar header "X-Powered-By"
  compress: true, // Habilitar compresión gzip
  
  // Configuración experimental
  experimental: {
    // optimizeCss: true, // Temporalmente deshabilitado debido a error con critters
    optimizePackageImports: ['lucide-react'], // Optimizar imports
  },

  // Configuración de imágenes
  images: {
    formats: ['image/webp', 'image/avif'], // Formatos modernos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Breakpoints responsive
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tamaños de imagen
    domains: ['speakfuel.com', 'res.cloudinary.com'], // Dominios permitidos (agregado Cloudinary)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers de seguridad
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Deshabilitar caché en desarrollo
          ...(isDevelopment ? [{
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          }] : []),
        ],
      },
      {
        // Caché optimizado para assets estáticos (solo en producción)
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: isDevelopment 
              ? 'no-cache, no-store, must-revalidate'
              : 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/inicio',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimizaciones para el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },

  // Configuración de output para SSG
  output: 'standalone', // Para deploy optimizado
  trailingSlash: false, // URLs sin slash final
  
  // ESLint durante build
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript durante build
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig 