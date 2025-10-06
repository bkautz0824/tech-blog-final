import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

/**
 * Convex Query and Mutation Functions for Articles
 *
 * This file contains all the database operations for articles including:
 * - Queries: Reading and searching articles
 * - Mutations: Creating, updating, and deleting articles
 */

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all published articles
 * Returns articles sorted by date (newest first)
 */
export const getAllArticles = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_published_date", (q) => q.eq("published", true))
      .order("desc")
      .collect();

    return articles;
  },
});

/**
 * Get all articles (including unpublished)
 * Admin function for content management
 */
export const getAllArticlesAdmin = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_date")
      .order("desc")
      .collect();

    return articles;
  },
});

/**
 * Get a single article by ID
 */
export const getArticleById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_article_id", (q) => q.eq("id", args.id))
      .first();

    return article;
  },
});

/**
 * Get articles by category
 * Returns published articles in a specific category, sorted by date
 */
export const getArticlesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_category_date", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .collect();

    return articles;
  },
});

/**
 * Get articles by tag
 * Returns published articles containing a specific tag
 */
export const getArticlesByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("articles")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    // Filter articles that contain the specified tag
    return articles.filter((article) => article.tags.includes(args.tag));
  },
});

/**
 * Search articles by content
 * Full-text search across article content
 */
export const searchArticles = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("articles")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.query).eq("published", true)
      )
      .collect();

    return results;
  },
});

/**
 * Search articles by title
 * Full-text search across article titles
 */
export const searchArticlesByTitle = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("articles")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.query).eq("published", true)
      )
      .collect();

    return results;
  },
});

/**
 * Get recent articles
 * Returns the most recent N published articles
 */
export const getRecentArticles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    const articles = await ctx.db
      .query("articles")
      .withIndex("by_published_date", (q) => q.eq("published", true))
      .order("desc")
      .take(limit);

    return articles;
  },
});

/**
 * Get article count by category
 * Returns statistics about articles per category
 */
export const getArticleStats = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    const categoryCount: Record<string, number> = {};
    const tagCount: Record<string, number> = {};

    articles.forEach((article) => {
      // Count categories
      categoryCount[article.category] =
        (categoryCount[article.category] || 0) + 1;

      // Count tags
      article.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return {
      total: articles.length,
      byCategory: categoryCount,
      byTag: tagCount,
    };
  },
});

/**
 * Get all unique categories
 */
export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    const categories = [...new Set(articles.map((a) => a.category))];
    return categories.sort();
  },
});

/**
 * Get all unique tags
 */
export const getAllTags = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    const tags = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  },
});

// ============================================================================
// MUTATION FUNCTIONS
// ============================================================================

/**
 * Create a new article
 */
export const createArticle = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    date: v.string(),
    content: v.string(),
    urls: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
      })
    ),
    keyFeatures: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
    tags: v.array(v.string()),
    wordCount: v.number(),
    qualityScore: v.optional(v.number()),
    published: v.optional(v.boolean()),
    slug: v.optional(v.string()),
    readingTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const articleId = await ctx.db.insert("articles", {
      ...args,
      published: args.published !== undefined ? args.published : true,
      createdAt: now,
      updatedAt: now,
      views: 0,
    });

    return articleId;
  },
});

/**
 * Update an existing article
 */
export const updateArticle = mutation({
  args: {
    id: v.string(),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
      date: v.optional(v.string()),
      content: v.optional(v.string()),
      urls: v.optional(
        v.array(
          v.object({
            title: v.string(),
            url: v.string(),
          })
        )
      ),
      keyFeatures: v.optional(
        v.array(
          v.object({
            title: v.string(),
            description: v.string(),
          })
        )
      ),
      tags: v.optional(v.array(v.string())),
      wordCount: v.optional(v.number()),
      qualityScore: v.optional(v.number()),
      published: v.optional(v.boolean()),
      slug: v.optional(v.string()),
      readingTime: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_article_id", (q) => q.eq("id", args.id))
      .first();

    if (!article) {
      throw new Error(`Article with id "${args.id}" not found`);
    }

    await ctx.db.patch(article._id, {
      ...args.updates,
      updatedAt: Date.now(),
    });

    return article._id;
  },
});

/**
 * Delete an article
 */
export const deleteArticle = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_article_id", (q) => q.eq("id", args.id))
      .first();

    if (!article) {
      throw new Error(`Article with id "${args.id}" not found`);
    }

    await ctx.db.delete(article._id);
    return { success: true, deletedId: args.id };
  },
});

/**
 * Batch upload articles
 * For migration purposes - uploads multiple articles at once
 */
export const batchUploadArticles = mutation({
  args: {
    articles: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        category: v.string(),
        date: v.string(),
        content: v.string(),
        urls: v.array(
          v.object({
            title: v.string(),
            url: v.string(),
          })
        ),
        keyFeatures: v.array(
          v.object({
            title: v.string(),
            description: v.string(),
          })
        ),
        tags: v.array(v.string()),
        wordCount: v.number(),
        qualityScore: v.optional(v.number()),
        published: v.optional(v.boolean()),
        slug: v.optional(v.string()),
        readingTime: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = [];

    for (const article of args.articles) {
      // Check if article already exists
      const existing = await ctx.db
        .query("articles")
        .withIndex("by_article_id", (q) => q.eq("id", article.id))
        .first();

      if (existing) {
        // Update existing article
        await ctx.db.patch(existing._id, {
          ...article,
          updatedAt: now,
        });
        results.push({ id: article.id, action: "updated", _id: existing._id });
      } else {
        // Insert new article
        const articleId = await ctx.db.insert("articles", {
          ...article,
          published: article.published !== undefined ? article.published : true,
          createdAt: now,
          updatedAt: now,
          views: 0,
        });
        results.push({ id: article.id, action: "created", _id: articleId });
      }
    }

    return {
      success: true,
      processed: results.length,
      results,
    };
  },
});

/**
 * Increment article view count
 */
export const incrementViews = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_article_id", (q) => q.eq("id", args.id))
      .first();

    if (!article) {
      throw new Error(`Article with id "${args.id}" not found`);
    }

    const currentViews = article.views || 0;
    await ctx.db.patch(article._id, {
      views: currentViews + 1,
      updatedAt: Date.now(),
    });

    return { views: currentViews + 1 };
  },
});

/**
 * Bulk delete articles by IDs
 * For cleanup and migration purposes
 */
export const bulkDeleteArticles = mutation({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, args) => {
    const results = [];

    for (const id of args.ids) {
      const article = await ctx.db
        .query("articles")
        .withIndex("by_article_id", (q) => q.eq("id", id))
        .first();

      if (article) {
        await ctx.db.delete(article._id);
        results.push({ id, success: true });
      } else {
        results.push({ id, success: false, error: "Not found" });
      }
    }

    return {
      processed: results.length,
      deleted: results.filter((r) => r.success).length,
      results,
    };
  },
});
