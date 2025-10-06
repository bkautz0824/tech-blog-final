/**
 * Migration Helper Script for Convex
 *
 * This script helps migrate articles from the file system to Convex.
 * It includes utilities for:
 * - Batch processing articles
 * - Quality validation
 * - Progress tracking
 * - Error handling and retry logic
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

const client = new ConvexHttpClient(convexUrl);

// Types
interface Article {
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
}

interface MigrationResult {
  success: boolean;
  articleId: string;
  action: "created" | "updated" | "failed";
  error?: string;
}

interface MigrationStats {
  total: number;
  successful: number;
  failed: number;
  updated: number;
  created: number;
  errors: Array<{ id: string; error: string }>;
}

/**
 * Calculate article quality score based on various metrics
 */
export function calculateQualityScore(article: Article): number {
  let score = 0;

  // Word count score (0-30 points)
  if (article.wordCount >= 2000) score += 30;
  else if (article.wordCount >= 1500) score += 25;
  else if (article.wordCount >= 1000) score += 20;
  else if (article.wordCount >= 500) score += 15;
  else score += 10;

  // Key features score (0-20 points)
  const featureCount = article.keyFeatures.length;
  if (featureCount >= 5) score += 20;
  else if (featureCount >= 3) score += 15;
  else if (featureCount >= 1) score += 10;
  else score += 5;

  // URLs/References score (0-15 points)
  const urlCount = article.urls.length;
  if (urlCount >= 5) score += 15;
  else if (urlCount >= 3) score += 12;
  else if (urlCount >= 1) score += 8;
  else score += 0;

  // Tags score (0-10 points)
  const tagCount = article.tags.length;
  if (tagCount >= 5) score += 10;
  else if (tagCount >= 3) score += 7;
  else if (tagCount >= 1) score += 5;

  // Content quality indicators (0-25 points)
  const contentScore = assessContentQuality(article.content);
  score += contentScore;

  return Math.min(score, 100);
}

/**
 * Assess content quality based on structure and formatting
 */
function assessContentQuality(content: string): number {
  let score = 0;

  // Check for headings
  const headingCount = (content.match(/^#{1,6}\s/gm) || []).length;
  if (headingCount >= 5) score += 8;
  else if (headingCount >= 3) score += 5;
  else if (headingCount >= 1) score += 3;

  // Check for code blocks
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  if (codeBlockCount >= 3) score += 8;
  else if (codeBlockCount >= 1) score += 5;

  // Check for lists
  const listCount = (content.match(/^[-*+]\s/gm) || []).length;
  if (listCount >= 5) score += 5;
  else if (listCount >= 2) score += 3;

  // Check for links
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount >= 5) score += 4;
  else if (linkCount >= 2) score += 2;

  return score;
}

/**
 * Calculate estimated reading time (words per minute = 200)
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

/**
 * Generate URL-friendly slug from article ID or title
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Validate article data before migration
 */
export function validateArticle(article: Article): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!article.id || article.id.trim() === "") {
    errors.push("Article ID is required");
  }

  if (!article.title || article.title.trim() === "") {
    errors.push("Article title is required");
  }

  if (!article.description || article.description.trim() === "") {
    errors.push("Article description is required");
  }

  if (!article.category || article.category.trim() === "") {
    errors.push("Article category is required");
  }

  if (!article.date || article.date.trim() === "") {
    errors.push("Article date is required");
  }

  if (!article.content || article.content.trim() === "") {
    errors.push("Article content is required");
  }

  if (article.wordCount <= 0) {
    errors.push("Article word count must be positive");
  }

  if (!Array.isArray(article.tags)) {
    errors.push("Article tags must be an array");
  }

  if (!Array.isArray(article.urls)) {
    errors.push("Article URLs must be an array");
  }

  if (!Array.isArray(article.keyFeatures)) {
    errors.push("Article key features must be an array");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prepare article for migration by adding computed fields
 */
export function prepareArticle(article: Article): Article {
  const qualityScore = calculateQualityScore(article);
  const readingTime = calculateReadingTime(article.wordCount);
  const slug = generateSlug(article.id);

  return {
    ...article,
    qualityScore,
    readingTime,
    slug,
    published: article.published !== undefined ? article.published : true,
  };
}

/**
 * Upload a single article to Convex
 */
export async function uploadArticle(
  article: Article
): Promise<MigrationResult> {
  try {
    // Validate article
    const validation = validateArticle(article);
    if (!validation.valid) {
      return {
        success: false,
        articleId: article.id,
        action: "failed",
        error: validation.errors.join(", "),
      };
    }

    // Prepare article with computed fields
    const preparedArticle = prepareArticle(article);

    // Upload to Convex
    const result = await client.mutation(api.articles.createArticle, {
      id: preparedArticle.id,
      title: preparedArticle.title,
      description: preparedArticle.description,
      category: preparedArticle.category,
      date: preparedArticle.date,
      content: preparedArticle.content,
      urls: preparedArticle.urls,
      keyFeatures: preparedArticle.keyFeatures,
      tags: preparedArticle.tags,
      wordCount: preparedArticle.wordCount,
      qualityScore: preparedArticle.qualityScore,
      published: preparedArticle.published,
      slug: preparedArticle.slug,
      readingTime: preparedArticle.readingTime,
    });

    return {
      success: true,
      articleId: article.id,
      action: "created",
    };
  } catch (error) {
    return {
      success: false,
      articleId: article.id,
      action: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Batch upload articles to Convex with progress tracking
 */
export async function batchUploadArticles(
  articles: Article[],
  onProgress?: (processed: number, total: number) => void
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    total: articles.length,
    successful: 0,
    failed: 0,
    updated: 0,
    created: 0,
    errors: [],
  };

  // Process in batches of 10 for better performance
  const BATCH_SIZE = 10;
  const batches: Article[][] = [];

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    batches.push(articles.slice(i, i + BATCH_SIZE));
  }

  let processed = 0;

  for (const batch of batches) {
    try {
      // Prepare articles
      const preparedArticles = batch.map(prepareArticle);

      // Upload batch
      const result = await client.mutation(api.articles.batchUploadArticles, {
        articles: preparedArticles.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          category: a.category,
          date: a.date,
          content: a.content,
          urls: a.urls,
          keyFeatures: a.keyFeatures,
          tags: a.tags,
          wordCount: a.wordCount,
          qualityScore: a.qualityScore,
          published: a.published,
          slug: a.slug,
          readingTime: a.readingTime,
        })),
      });

      // Update stats
      result.results.forEach((r: any) => {
        stats.successful++;
        if (r.action === "created") stats.created++;
        if (r.action === "updated") stats.updated++;
      });

      processed += batch.length;
      if (onProgress) {
        onProgress(processed, articles.length);
      }
    } catch (error) {
      // Handle batch failure
      batch.forEach((article) => {
        stats.failed++;
        stats.errors.push({
          id: article.id,
          error: error instanceof Error ? error.message : String(error),
        });
      });

      processed += batch.length;
      if (onProgress) {
        onProgress(processed, articles.length);
      }
    }
  }

  return stats;
}

/**
 * Generate migration report
 */
export function generateMigrationReport(stats: MigrationStats): string {
  const report = `
Migration Report
================

Total Articles: ${stats.total}
Successful: ${stats.successful} (${((stats.successful / stats.total) * 100).toFixed(1)}%)
Failed: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)

Details:
- Created: ${stats.created}
- Updated: ${stats.updated}

${
  stats.errors.length > 0
    ? `
Errors:
${stats.errors.map((e) => `- ${e.id}: ${e.error}`).join("\n")}
`
    : "No errors encountered."
}
`;

  return report;
}

/**
 * Export all functions for CLI usage
 */
export const migrate = {
  uploadArticle,
  batchUploadArticles,
  validateArticle,
  prepareArticle,
  calculateQualityScore,
  calculateReadingTime,
  generateSlug,
  generateMigrationReport,
};
