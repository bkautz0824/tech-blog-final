/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Next.js 15+ optimizations
  experimental: {
    // Optimize package imports for RSC
    optimizePackageImports: ['@heroicons/react', 'clsx', 'tailwind-merge'],
  },

  // Turbopack configuration (Next.js 15+)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Server external packages configuration removed to avoid conflicts with optimizePackageImports

  // Static generation settings (Next.js 15+)
  trailingSlash: false,
  poweredByHeader: false,

  // Enable React 19 features
  reactStrictMode: true,

  // Build-time optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enhanced image optimization (Next.js 15+)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/articles/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },

  // Webpack optimizations for faster builds
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          articles: {
            name: 'articles-data',
            test: /[\\/]lib[\\/]articles/,
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }

    return config
  },
}

export default nextConfig