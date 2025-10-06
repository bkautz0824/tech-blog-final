#!/usr/bin/env tsx

/**
 * Migration Script: Reference Quality Articles (Batch 1)
 *
 * Migrates 5 high-quality reference articles from dev_tools_content/
 * - article-axiom.ts
 * - article-elevenlabs-ui.ts
 * - article-huxe.ts
 * - article-n8n.ts
 * - article-openai-cookbook.ts
 */

import { migrate } from "../lib/migrate-to-convex.js";

// Import reference articles
import { axiomArticle } from "../../dev_tools_content/article-axiom.js";
import { elevenlabsUiArticle } from "../../dev_tools_content/article-elevenlabs-ui.js";
import { huxeArticle } from "../../dev_tools_content/article-huxe.js";
import { n8nArticle } from "../../dev_tools_content/article-n8n.js";
import { openaiCookbookArticle } from "../../dev_tools_content/article-openai-cookbook.js";

// Convert article format to match Convex schema
function convertArticle(article: any) {
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

  // Convert URLs to proper format
  const urls = (article.urls || []).map((url: string | { title: string; url: string }) => {
    if (typeof url === 'string') {
      // Extract domain name as title
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      return {
        title: domain,
        url: url
      };
    }
    return url;
  });

  // Convert keyFeatures to proper format
  const keyFeatures = (article.keyFeatures || []).map((feature: string | { title: string; description: string }) => {
    if (typeof feature === 'string') {
      // Split on colon or use as title
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
    tags: [...new Set(tags)], // Remove duplicates
    wordCount
  };
}

// Progress callback
function showProgress(processed: number, total: number) {
  const percentage = ((processed / total) * 100).toFixed(1);
  const barLength = 40;
  const filled = Math.floor((processed / total) * barLength);
  const bar = "█".repeat(filled) + "░".repeat(barLength - filled);

  process.stdout.write(
    `\r[${bar}] ${processed}/${total} (${percentage}%) articles processed`
  );

  if (processed === total) {
    process.stdout.write("\n");
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("BATCH 1: Reference Quality Articles Migration");
  console.log("=".repeat(60));
  console.log("");

  // Convert articles to proper format
  const referenceArticles = [
    axiomArticle,
    elevenlabsUiArticle,
    huxeArticle,
    n8nArticle,
    openaiCookbookArticle
  ].map(convertArticle);

  console.log(`Preparing to migrate ${referenceArticles.length} reference articles:\n`);

  referenceArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   ID: ${article.id}`);
    console.log(`   Category: ${article.category}`);
    console.log(`   Word Count: ${article.wordCount.toLocaleString()}`);
    console.log(`   Tags: ${article.tags.join(", ")}`);
    console.log(`   URLs: ${article.urls.length}`);
    console.log(`   Key Features: ${article.keyFeatures.length}`);
    console.log("");
  });

  console.log("Starting migration to Convex...\n");

  // Upload to Convex
  const stats = await migrate.batchUploadArticles(referenceArticles, showProgress);

  // Generate report
  console.log("\n" + migrate.generateMigrationReport(stats));

  // Exit with appropriate code
  if (stats.failed > 0) {
    console.error("\n❌ Migration completed with errors");
    process.exit(1);
  } else {
    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  }
}

// Run migration
main().catch((error) => {
  console.error("\n💥 Migration failed with error:");
  console.error(error);
  process.exit(1);
});
