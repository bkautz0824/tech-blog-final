/**
 * Convex-based Article Server Operations with ISR
 *
 * This module provides server-side article operations that fetch from Convex
 * database instead of the static articles-data.ts file. It uses Next.js 15
 * ISR (Incremental Static Regeneration) with fetchQuery for optimal performance.
 */

import { fetchQuery } from "convex/nextjs";
import { api } from "../convex/_generated/api";
import { unstable_cache } from 'next/cache';

// Type definitions matching Convex schema
export interface Article {
  _id: string;
  _creationTime: number;
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  content: string;
  urls: Array<{ title: string; url: string }>;
  keyFeatures: Array<{ title: string; description: string }>;
  tags: string[];
  wordCount: number;
  qualityScore?: number;
  published?: boolean;
  slug?: string;
  readingTime?: number;
  views?: number;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Get all published articles from Convex
 * Uses Next.js cache with ISR revalidation
 */
export const getArticlesCached = unstable_cache(
  async (): Promise<Article[]> => {
    const articles = await fetchQuery(api.articles.getAllArticles);
    return articles as Article[];
  },
  ['convex-articles-list'],
  {
    revalidate: 3600, // Revalidate every 1 hour
    tags: ['articles', 'convex']
  }
);

/**
 * Get a specific article by ID from Convex
 * Uses Next.js cache with ISR revalidation
 */
export const getArticleByIdCached = unstable_cache(
  async (id: string): Promise<Article | undefined> => {
    const article = await fetchQuery(api.articles.getArticleById, { id });
    return article ? (article as Article) : undefined;
  },
  ['convex-article-by-id'],
  {
    revalidate: 3600, // Revalidate every 1 hour
    tags: ['articles', 'convex']
  }
);

/**
 * Get all unique categories from Convex
 */
export const getCategoriesCached = unstable_cache(
  async (): Promise<string[]> => {
    const articles = await getArticlesCached();
    const categories = new Set(articles.map(article => article.category));
    return Array.from(categories).sort();
  },
  ['convex-categories-list'],
  {
    revalidate: 86400, // Revalidate every 24 hours
    tags: ['categories', 'convex']
  }
);

/**
 * Get articles by category from Convex
 */
export const getArticlesByCategoryCached = unstable_cache(
  async (category: string): Promise<Article[]> => {
    const articles = await fetchQuery(api.articles.getArticlesByCategory, { category });
    return articles as Article[];
  },
  ['convex-articles-by-category'],
  {
    revalidate: 3600, // Revalidate every 1 hour
    tags: ['articles', 'categories', 'convex']
  }
);

/**
 * Get recent articles from Convex
 */
export const getRecentArticles = unstable_cache(
  async (limit: number = 10): Promise<Article[]> => {
    const articles = await fetchQuery(api.articles.getRecentArticles, { limit });
    return articles as Article[];
  },
  ['convex-recent-articles'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['articles', 'convex']
  }
);

// Preload functions for RSC optimization
export async function preloadArticles() {
  void getArticlesCached();
}

export async function preloadArticle(id: string) {
  void getArticleByIdCached(id);
}

export async function preloadCategories() {
  void getCategoriesCached();
}

/**
 * Get featured articles (optimized for homepage)
 */
export const getFeaturedArticles = unstable_cache(
  async (limit: number = 6): Promise<{
    latest: Article | null;
    featured: Article[];
  }> => {
    const articles = await getArticlesCached();
    return {
      latest: articles[0] || null,
      featured: articles.slice(1, limit)
    };
  },
  ['convex-featured-articles'],
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['articles', 'featured', 'convex']
  }
);

/**
 * Article metadata for SEO optimization
 */
export interface ArticleMetadata {
  title: string;
  description: string;
  category: string;
  date: string;
  keywords: string[];
  readingTime: number;
}

export const getArticleMetadata = unstable_cache(
  async (id: string): Promise<ArticleMetadata | null> => {
    const article = await getArticleByIdCached(id);
    if (!article) return null;

    // Use existing readingTime if available, otherwise calculate
    const readingTime = article.readingTime || Math.ceil(article.wordCount / 200);

    // Extract keywords from tags, category, and key features
    const keywords = [
      article.category,
      ...article.tags,
      ...article.keyFeatures.map(f => f.title),
      'development',
      'tools',
      'programming'
    ];

    return {
      title: article.title,
      description: article.description,
      category: article.category,
      date: article.date,
      keywords: Array.from(new Set(keywords)), // Remove duplicates
      readingTime
    };
  },
  ['convex-article-metadata'],
  {
    revalidate: 86400, // Revalidate every 24 hours
    tags: ['articles', 'metadata', 'convex']
  }
);

/**
 * Sitemap generation helper
 */
export const getSitemapData = unstable_cache(
  async (): Promise<{
    articles: Array<{ id: string; date: string }>;
    categories: string[];
    lastModified: string;
  }> => {
    const articles = await getArticlesCached();
    const categories = await getCategoriesCached();

    return {
      articles: articles.map(article => ({
        id: article.id,
        date: article.date
      })),
      categories,
      lastModified: new Date().toISOString()
    };
  },
  ['convex-sitemap-data'],
  {
    revalidate: 86400, // Revalidate every 24 hours
    tags: ['articles', 'categories', 'sitemap', 'convex']
  }
);

/**
 * Get article statistics
 */
export const getArticleStats = unstable_cache(
  async (): Promise<{
    totalArticles: number;
    totalCategories: number;
    averageWordCount: number;
    totalWordCount: number;
  }> => {
    const articles = await getArticlesCached();
    const categories = await getCategoriesCached();

    const totalWordCount = articles.reduce((sum, article) => sum + article.wordCount, 0);
    const averageWordCount = Math.round(totalWordCount / articles.length);

    return {
      totalArticles: articles.length,
      totalCategories: categories.length,
      averageWordCount,
      totalWordCount
    };
  },
  ['convex-article-stats'],
  {
    revalidate: 3600, // Revalidate every 1 hour
    tags: ['articles', 'stats', 'convex']
  }
);
