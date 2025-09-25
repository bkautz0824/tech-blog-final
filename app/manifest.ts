import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tech Blog - Modern Development Tools & Insights',
    short_name: 'Tech Blog',
    description: 'Discover cutting-edge development tools, frameworks, and resources that elevate your productivity and craft.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#d97706',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}