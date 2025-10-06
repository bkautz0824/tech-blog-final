import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema for Tech Blog
 *
 * This schema defines the structure for articles, tags, and categories
 * with comprehensive indexing for optimal query performance.
 */

export default defineSchema({
  // Articles Table
  articles: defineTable({
    // Core Identifiers
    id: v.string(), // Unique article identifier (e.g., "react-19-features")

    // Metadata
    title: v.string(),
    description: v.string(),
    category: v.string(),
    date: v.string(), // ISO date string (YYYY-MM-DD)

    // Content
    content: v.string(), // Full article content in markdown

    // References and Resources
    urls: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
      })
    ),

    // Features and Highlights
    keyFeatures: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),

    // Classification
    tags: v.array(v.string()),

    // Quality Metrics
    wordCount: v.number(),
    qualityScore: v.optional(v.number()), // 0-100 score for article quality

    // Timestamps
    createdAt: v.optional(v.number()), // Unix timestamp
    updatedAt: v.optional(v.number()), // Unix timestamp

    // Publication Status
    published: v.optional(v.boolean()), // Default true

    // SEO and Analytics
    slug: v.optional(v.string()), // URL-friendly version of ID
    readingTime: v.optional(v.number()), // Estimated reading time in minutes
    views: v.optional(v.number()), // View count
  })
    // Indexes for optimal query performance
    .index("by_article_id", ["id"])
    .index("by_category", ["category"])
    .index("by_date", ["date"])
    .index("by_published", ["published"])
    .index("by_category_date", ["category", "date"])
    .index("by_published_date", ["published", "date"])
    // Search index for full-text search
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["category", "published"],
    })
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["category", "published"],
    }),

  // Tags Table
  tags: defineTable({
    name: v.string(), // Tag name (e.g., "React", "TypeScript")
    slug: v.string(), // URL-friendly version (e.g., "react", "typescript")
    count: v.number(), // Number of articles using this tag
    description: v.optional(v.string()), // Optional tag description
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_slug", ["slug"])
    .index("by_count", ["count"]),

  // Categories Table
  categories: defineTable({
    name: v.string(), // Category name (e.g., "Frontend", "Backend")
    slug: v.string(), // URL-friendly version
    count: v.number(), // Number of articles in this category
    description: v.optional(v.string()), // Optional category description
    color: v.optional(v.string()), // Hex color for UI display
    icon: v.optional(v.string()), // Icon name or emoji
    order: v.optional(v.number()), // Display order
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_slug", ["slug"])
    .index("by_count", ["count"])
    .index("by_order", ["order"]),

  // Analytics Table (Optional - for tracking article performance)
  analytics: defineTable({
    articleId: v.string(),
    views: v.number(),
    uniqueViews: v.number(),
    averageReadTime: v.number(), // In seconds
    completionRate: v.number(), // Percentage (0-100)
    date: v.string(), // Date of the analytics entry (YYYY-MM-DD)
    createdAt: v.optional(v.number()),
  })
    .index("by_article", ["articleId"])
    .index("by_date", ["date"])
    .index("by_article_date", ["articleId", "date"]),
});
