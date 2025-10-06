#!/usr/bin/env node

/**
 * Migration Script: Reference Quality Articles (Batch 1)
 *
 * Migrates 5 high-quality reference articles from dev_tools_content/
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Convex client
const convexUrl = "https://different-vole-632.convex.cloud";
const client = new ConvexHttpClient(convexUrl);

console.log("=".repeat(60));
console.log("BATCH 1: Reference Quality Articles Migration");
console.log("=".repeat(60));
console.log("");

// Read article files
const articleFiles = [
  "article-axiom.ts",
  "article-elevenlabs-ui.ts",
  "article-huxe.ts",
  "article-n8n.ts",
  "article-openai-cookbook.ts"
];

// Extract article data from .ts files
const articles = [];

for (const filename of articleFiles) {
  try {
    const filePath = join(__dirname, "../../dev_tools_content", filename);
    const content = readFileSync(filePath, "utf-8");

    // Extract the export statement
    const exportMatch = content.match(/export const \w+Article = ({[\s\S]*?^});$/m);
    if (!exportMatch) {
      console.error(`❌ Could not parse ${filename}`);
      continue;
    }

    // Parse the article object (using eval for simplicity)
    // In production, you'd use a proper parser
    const articleCode = `(${exportMatch[1]})`;
    const article = eval(articleCode);

    // Convert to Convex format
    const converted = convertArticle(article);
    articles.push(converted);

    console.log(`✓ Loaded: ${article.title}`);
    console.log(`  - ID: ${article.id}`);
    console.log(`  - Word Count: ${converted.wordCount.toLocaleString()}`);
    console.log("");

  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error.message);
  }
}

function convertArticle(article) {
  // Extract tags from content and category
  const tags = [article.category];

  // Add tags from title keywords
  const titleWords = article.title.toLowerCase().split(/\s+/);
  if (titleWords.includes('ai')) tags.push('AI');
  if (titleWords.includes('monitoring') || article.category === 'Monitoring') tags.push('Monitoring', 'Observability');
  if (titleWords.includes('voice') || titleWords.includes('ui')) tags.push('UI/UX', 'Voice');
  if (titleWords.includes('automation')) tags.push('Automation', 'Workflow');
  if (titleWords.includes('openai')) tags.push('OpenAI', 'AI Tools');

  // Calculate word count
  const wordCount = article.content.split(/\s+/).length;

  // Calculate quality score
  const qualityScore = calculateQualityScore(article, wordCount);

  // Calculate reading time
  const readingTime = Math.ceil(wordCount / 200);

  // Generate slug
  const slug = article.id;

  // Convert URLs to proper format
  const urls = (article.urls || []).map((url) => {
    if (typeof url === 'string') {
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      return {
        title: domain,
        url: url
      };
    }
    return url;
  });

  // Convert keyFeatures to proper format
  const keyFeatures = (article.keyFeatures || []).map((feature) => {
    if (typeof feature === 'string') {
      const parts = feature.split(':');
      if (parts.length > 1) {
        return {
          title: parts[0].trim(),
          description: parts.slice(1).join(':').trim()
        };
      }
      return {
        title: feature,
        description: feature
      };
    }
    return feature;
  });

  return {
    id: article.id,
    title: article.title,
    description: article.description,
    category: article.category,
    date: article.date,
    content: article.content,
    urls,
    keyFeatures,
    tags: [...new Set(tags)],
    wordCount,
    qualityScore,
    readingTime,
    slug,
    published: true
  };
}

function calculateQualityScore(article, wordCount) {
  let score = 0;

  // Word count score (0-30 points)
  if (wordCount >= 3000) score += 30;
  else if (wordCount >= 2000) score += 25;
  else if (wordCount >= 1500) score += 20;
  else if (wordCount >= 1000) score += 15;
  else score += 10;

  // Key features score (0-20 points)
  const featureCount = (article.keyFeatures || []).length;
  if (featureCount >= 6) score += 20;
  else if (featureCount >= 4) score += 15;
  else if (featureCount >= 2) score += 10;
  else score += 5;

  // URLs/References score (0-15 points)
  const urlCount = (article.urls || []).length;
  if (urlCount >= 5) score += 15;
  else if (urlCount >= 3) score += 12;
  else if (urlCount >= 1) score += 8;

  // Content structure score (0-35 points)
  const headingCount = (article.content.match(/^#{1,6}\s/gm) || []).length;
  const codeBlockCount = (article.content.match(/```/g) || []).length / 2;
  const listCount = (article.content.match(/^[-*+]\s/gm) || []).length;

  if (headingCount >= 10) score += 15;
  else if (headingCount >= 5) score += 10;
  else if (headingCount >= 3) score += 5;

  if (codeBlockCount >= 5) score += 10;
  else if (codeBlockCount >= 3) score += 7;
  else if (codeBlockCount >= 1) score += 5;

  if (listCount >= 10) score += 10;
  else if (listCount >= 5) score += 7;
  else if (listCount >= 2) score += 4;

  return Math.min(score, 100);
}

// Upload articles
console.log(`\nPreparing to upload ${articles.length} articles to Convex...\n`);

try {
  const result = await client.mutation(api.articles.batchUploadArticles, {
    articles: articles
  });

  console.log("\n" + "=".repeat(60));
  console.log("Migration Results");
  console.log("=".repeat(60));
  console.log("");
  console.log(`Total Articles: ${articles.length}`);
  console.log(`Successful: ${result.successful}`);
  console.log(`Failed: ${result.failed}`);
  console.log("");

  if (result.failed > 0) {
    console.log("Errors:");
    result.results.forEach((r) => {
      if (!r.success) {
        console.log(`  - ${r.articleId}: ${r.error}`);
      }
    });
    console.log("");
  }

  if (result.successful === articles.length) {
    console.log("✅ All articles migrated successfully!\n");
    process.exit(0);
  } else {
    console.error("⚠️  Migration completed with errors\n");
    process.exit(1);
  }

} catch (error) {
  console.error("\n💥 Migration failed:");
  console.error(error.message);
  if (error.data) {
    console.error("Details:", error.data);
  }
  process.exit(1);
}
