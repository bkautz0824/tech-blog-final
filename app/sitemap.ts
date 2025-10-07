import type { MetadataRoute } from 'next'
import { getSitemapData } from '@/lib/articles-convex'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
  const data = await getSitemapData()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Article pages
  const articlePages = data.articles.map((article) => ({
    url: `${baseUrl}/articles/${article.id}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Category pages
  const categoryPages = data.categories.map((category) => ({
    url: `${baseUrl}/categories/${category.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...articlePages, ...categoryPages]
}