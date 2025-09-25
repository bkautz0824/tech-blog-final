import type { Article } from './articles-data'
import { unstable_cache } from 'next/cache'

// Re-export types for backward compatibility
export type { Article } from './articles-data'

// Server-side article operations with caching
export const getArticlesCached = unstable_cache(
  async (): Promise<Article[]> => {
    // Import articles dynamically to prevent client-side loading
    const { articles } = await import('./articles-data')
    return articles
  },
  ['articles-list'],
  {
    revalidate: 60 * 60, // Cache for 1 hour
    tags: ['articles']
  }
)

export const getArticleByIdCached = unstable_cache(
  async (id: string): Promise<Article | undefined> => {
    const { getArticleById } = await import('./articles-data')
    return getArticleById(id)
  },
  ['article-by-id'],
  {
    revalidate: 60 * 60, // Cache for 1 hour
    tags: ['articles']
  }
)

export const getCategoriesCached = unstable_cache(
  async (): Promise<string[]> => {
    const { getAllCategories } = await import('./articles-data')
    return getAllCategories()
  },
  ['categories-list'],
  {
    revalidate: 60 * 60 * 24, // Cache for 24 hours
    tags: ['categories']
  }
)

export const getArticlesByCategoryCached = unstable_cache(
  async (category: string): Promise<Article[]> => {
    const { getArticlesByCategory } = await import('./articles-data')
    return getArticlesByCategory(category)
  },
  ['articles-by-category'],
  {
    revalidate: 60 * 60, // Cache for 1 hour
    tags: ['articles', 'categories']
  }
)

// Preload functions for RSC optimization
export async function preloadArticles() {
  void getArticlesCached()
}

export async function preloadArticle(id: string) {
  void getArticleByIdCached(id)
}

export async function preloadCategories() {
  void getCategoriesCached()
}

// Get featured articles (optimized for homepage)
export const getFeaturedArticles = unstable_cache(
  async (limit: number = 6): Promise<{
    latest: Article | null
    featured: Article[]
  }> => {
    const articles = await getArticlesCached()
    return {
      latest: articles[0] || null,
      featured: articles.slice(1, limit)
    }
  },
  ['featured-articles'],
  {
    revalidate: 60 * 30, // Cache for 30 minutes
    tags: ['articles', 'featured']
  }
)

// Article metadata for SEO optimization
export interface ArticleMetadata {
  title: string
  description: string
  category: string
  date: string
  keywords: string[]
  readingTime: number
}

export const getArticleMetadata = unstable_cache(
  async (id: string): Promise<ArticleMetadata | null> => {
    const article = await getArticleByIdCached(id)
    if (!article) return null

    // Calculate reading time (rough estimation)
    const wordsPerMinute = 200
    const wordCount = article.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    // Extract keywords from key features and content
    const keywords = [
      article.category,
      ...(article.keyFeatures || []),
      'development', 'tools', 'programming'
    ]

    return {
      title: article.title,
      description: article.description,
      category: article.category,
      date: article.date,
      keywords: Array.from(new Set(keywords)), // Remove duplicates
      readingTime
    }
  },
  ['article-metadata'],
  {
    revalidate: 60 * 60 * 24, // Cache for 24 hours
    tags: ['articles', 'metadata']
  }
)

// Sitemap generation helper
export const getSitemapData = unstable_cache(
  async (): Promise<{
    articles: Array<{ id: string; date: string }>
    categories: string[]
    lastModified: string
  }> => {
    const articles = await getArticlesCached()
    const categories = await getCategoriesCached()

    return {
      articles: articles.map(article => ({
        id: article.id,
        date: article.date
      })),
      categories,
      lastModified: new Date().toISOString()
    }
  },
  ['sitemap-data'],
  {
    revalidate: 60 * 60 * 24, // Cache for 24 hours
    tags: ['articles', 'categories', 'sitemap']
  }
)