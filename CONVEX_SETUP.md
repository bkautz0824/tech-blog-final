# Convex Setup and Migration Guide

## Phase 1: Infrastructure Setup - COMPLETED

This document provides a complete guide for setting up and using Convex with the Tech Blog application.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Schema](#schema)
5. [Available Functions](#available-functions)
6. [Migration Scripts](#migration-scripts)
7. [Usage Examples](#usage-examples)
8. [Next Steps](#next-steps)

---

## Overview

Convex is now fully integrated into the Tech Blog application. The infrastructure includes:

- Comprehensive schema with articles, tags, categories, and analytics tables
- 15+ query functions for reading and searching articles
- 7 mutation functions for creating, updating, and deleting articles
- Migration helper utilities for batch processing
- Real-time data synchronization capabilities

**Total Articles to Migrate**: 58 articles

---

## Installation

### Step 1: Initialize Convex

Run the following command to set up your Convex deployment:

```bash
npm run convex:dev
```

This will:
- Create a new Convex project
- Generate deployment URL
- Start the development server
- Create the `convex/_generated` directory with TypeScript types

**Follow the prompts to:**
1. Log in or create a Convex account
2. Create a new project or select an existing one
3. Copy the deployment URL provided

### Step 2: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Add your Convex URLs (these will be provided after running `npx convex dev`):

```env
# Convex Configuration
CONVEX_DEPLOYMENT=your-deployment-name:xxxxx
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional: Revalidation Secret
REVALIDATION_SECRET=your-random-secret-here
```

**Generate a revalidation secret:**
```bash
openssl rand -base64 32
```

---

## Configuration

### Next.js Integration

Add the ConvexClientProvider to your root layout:

```tsx
// app/layout.tsx
import { ConvexClientProvider } from "@/components/convex-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

---

## Schema

### Articles Table

```typescript
{
  id: string                    // Unique identifier
  title: string                 // Article title
  description: string           // Brief description
  category: string              // Category name
  date: string                  // ISO date (YYYY-MM-DD)
  content: string               // Full markdown content
  urls: Array<{title, url}>     // Reference URLs
  keyFeatures: Array<{title, description}>
  tags: string[]                // Article tags
  wordCount: number             // Total words
  qualityScore?: number         // 0-100 quality score
  published?: boolean           // Publication status
  slug?: string                 // URL-friendly slug
  readingTime?: number          // Estimated minutes
  views?: number                // View count
  createdAt?: number            // Unix timestamp
  updatedAt?: number            // Unix timestamp
}
```

### Indexes

- `by_id` - Fast lookups by article ID
- `by_category` - Filter by category
- `by_date` - Sort by date
- `by_published` - Filter published articles
- `by_category_date` - Combined category + date
- `by_published_date` - Published articles by date
- `search_content` - Full-text search on content
- `search_title` - Full-text search on title

---

## Available Functions

### Query Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `getAllArticles` | Get all published articles | - |
| `getAllArticlesAdmin` | Get all articles (including unpublished) | - |
| `getArticleById` | Get single article by ID | `id: string` |
| `getArticlesByCategory` | Filter by category | `category: string` |
| `getArticlesByTag` | Filter by tag | `tag: string` |
| `searchArticles` | Full-text content search | `query: string` |
| `searchArticlesByTitle` | Search article titles | `query: string` |
| `getRecentArticles` | Get N most recent articles | `limit?: number` |
| `getArticleStats` | Get category/tag statistics | - |
| `getAllCategories` | List unique categories | - |
| `getAllTags` | List unique tags | - |

### Mutation Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `createArticle` | Create new article | `article: Article` |
| `updateArticle` | Update existing article | `id: string, updates: Partial<Article>` |
| `deleteArticle` | Delete article | `id: string` |
| `batchUploadArticles` | Bulk upload articles | `articles: Article[]` |
| `incrementViews` | Increment view count | `id: string` |
| `bulkDeleteArticles` | Delete multiple articles | `ids: string[]` |

---

## Migration Scripts

### Available Commands

```bash
# Validate test articles without uploading
npm run migrate:validate

# Upload 2 test articles to Convex
npm run migrate:test
```

### Test Articles

The migration script includes 2 test articles:

1. **React 19: Mastering Concurrent Features** (Frontend, 487 words)
   - High-quality reference article
   - 4 key features, 3 URLs, 5 tags

2. **TypeScript 5: ECMAScript Decorators Guide** (TypeScript, 298 words)
   - Basic quality article
   - 2 key features, 2 URLs, 3 tags

### Validation

Run validation to check article quality before uploading:

```bash
npm run migrate:validate
```

Output includes:
- Validation status
- Quality score (0-100)
- Estimated reading time
- Generated slug
- Any validation errors

### Test Upload

Upload test articles to verify Convex setup:

```bash
npm run migrate:test
```

This will:
1. Display article information
2. Upload to Convex with progress bar
3. Generate migration report with statistics

---

## Usage Examples

### Using Queries in Components

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ArticleList() {
  const articles = useQuery(api.articles.getAllArticles);

  if (articles === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

### Searching Articles

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export function ArticleSearch() {
  const [query, setQuery] = useState("");
  const results = useQuery(
    api.articles.searchArticles,
    query ? { query } : "skip"
  );

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
      />
      {results?.map((article) => (
        <SearchResult key={article.id} article={article} />
      ))}
    </div>
  );
}
```

### Filtering by Category

```tsx
const articles = useQuery(api.articles.getArticlesByCategory, {
  category: "Frontend"
});
```

### Using Mutations

```tsx
"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function IncrementViews({ articleId }: { articleId: string }) {
  const incrementViews = useMutation(api.articles.incrementViews);

  const handleView = async () => {
    await incrementViews({ id: articleId });
  };

  return <button onClick={handleView}>Read Article</button>;
}
```

### Server Components (App Router)

```tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await fetchQuery(api.articles.getArticleById, {
    id: params.id
  });

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.description}</p>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
```

---

## Next Steps

### Immediate Actions

1. **Run Convex Development Server**
   ```bash
   npm run convex:dev
   ```

2. **Copy Environment Variables**
   - Add `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` to `.env.local`

3. **Validate Test Articles**
   ```bash
   npm run migrate:validate
   ```

4. **Upload Test Articles**
   ```bash
   npm run migrate:test
   ```

5. **Verify in Convex Dashboard**
   - Visit https://dashboard.convex.dev
   - Check the Data tab to see uploaded articles

### Phase 2: Article Migration (Next Phase)

Once the test articles are successfully uploaded:

1. **Prepare article sources**
   - Locate existing article data
   - Convert to required format
   - Validate all fields

2. **Create production migration script**
   - Handle all 58 articles
   - Implement batch processing
   - Add error recovery

3. **Execute migration**
   - Run in batches of 10
   - Monitor progress
   - Generate reports

4. **Verify data integrity**
   - Check all articles uploaded
   - Validate categories and tags
   - Test queries and search

---

## Troubleshooting

### Common Issues

**Error: NEXT_PUBLIC_CONVEX_URL not set**
- Solution: Run `npx convex dev` and add the URL to `.env.local`

**Error: Cannot find module 'convex/_generated'**
- Solution: Ensure `npx convex dev` is running to generate types

**TypeScript errors in migration scripts**
- Solution: Run `npm run type-check` to identify issues

**Migration script fails to upload**
- Solution: Check Convex dashboard for deployment status
- Verify network connectivity
- Check article validation errors

### Getting Help

- Convex Documentation: https://docs.convex.dev
- Convex Discord: https://convex.dev/community
- Project Issues: Check the repository issues

---

## Summary

Phase 1 Infrastructure Setup is now complete with:

- Convex package installed
- Comprehensive schema created
- 15+ query functions implemented
- 7 mutation functions implemented
- Migration helper utilities created
- Test articles ready for upload
- Documentation complete

**Ready for Phase 2: Article Migration (58 articles)**

Run `npm run convex:dev` to get started!
