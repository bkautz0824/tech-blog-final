#!/usr/bin/env node

/**
 * Upload Existing Articles from articles-data.ts
 * Batch 2: 20+ existing articles from the old system
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

console.log("=".repeat(70));
console.log("BATCH 2: Existing Articles Migration");
console.log("=".repeat(70));
console.log("");

// Helper functions
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function calculateQualityScore(content, wordCount, keyFeaturesCount, urlsCount) {
  let score = 0;

  // Word count (0-30)
  if (wordCount >= 3000) score += 30;
  else if (wordCount >= 2000) score += 25;
  else if (wordCount >= 1500) score += 20;
  else if (wordCount >= 1000) score += 15;
  else score += 10;

  // Key features (0-20)
  if (keyFeaturesCount >= 6) score += 20;
  else if (keyFeaturesCount >= 4) score += 15;
  else if (keyFeaturesCount >= 2) score += 10;
  else score += 5;

  // URLs (0-15)
  if (urlsCount >= 5) score += 15;
  else if (urlsCount >= 3) score += 12;
  else if (urlsCount >= 1) score += 8;

  // Content structure (0-35)
  const headingCount = (content.match(/^#{1,6}\s/gm) || []).length;
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  const listCount = (content.match(/^[-*+]\s/gm) || []).length;

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

function convertArticle(article) {
  // Calculate word count
  const wordCount = countWords(article.content);

  // Extract tags from category and title
  const tags = [article.category];
  const titleLower = article.title.toLowerCase();

  // Add relevant tags based on content
  if (titleLower.includes('react') || article.category.includes('React')) tags.push('React');
  if (titleLower.includes('next') || titleLower.includes('nextjs')) tags.push('Next.js', 'Framework');
  if (titleLower.includes('ai') || titleLower.includes('artificial intelligence')) tags.push('AI');
  if (titleLower.includes('typescript') || article.content.includes('TypeScript')) tags.push('TypeScript');
  if (titleLower.includes('database') || titleLower.includes('db')) tags.push('Database');
  if (titleLower.includes('testing') || titleLower.includes('test')) tags.push('Testing', 'QA');
  if (titleLower.includes('deployment') || titleLower.includes('hosting')) tags.push('Deployment', 'DevOps');
  if (titleLower.includes('mobile') || titleLower.includes('ios') || titleLower.includes('android')) tags.push('Mobile');
  if (article.category === 'Developer Tools') tags.push('DevTools', 'Productivity');

  // Convert URLs to proper format
  const urls = (article.urls || []).map((url) => {
    if (typeof url === 'string') {
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      return { title: domain, url };
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
      return { title: feature, description: feature };
    }
    return feature;
  });

  // Calculate quality score
  const qualityScore = calculateQualityScore(
    article.content,
    wordCount,
    keyFeatures.length,
    urls.length
  );

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
    readingTime: Math.ceil(wordCount / 200),
    slug: article.id,
    published: true
  };
}

// Read and parse articles-data.ts
console.log("Reading articles from articles-data.ts...\n");

try {
  const filePath = join(__dirname, "../lib/articles-data.ts");
  const fileContent = readFileSync(filePath, "utf-8");

  // Extract the articles array
  const arrayStart = fileContent.indexOf("export const articles: Article[] = [");
  if (arrayStart === -1) {
    console.error("❌ Could not find articles array export");
    process.exit(1);
  }

  // Find the closing bracket of the array
  let bracketCount = 0;
  let inArray = false;
  let arrayContent = "";
  let pos = arrayStart;

  while (pos < fileContent.length) {
    const char = fileContent[pos];

    if (char === '[' && !inArray) {
      inArray = true;
      bracketCount = 1;
      pos++;
      continue;
    }

    if (inArray) {
      if (char === '[') bracketCount++;
      if (char === ']') bracketCount--;

      if (bracketCount === 0) {
        break;
      }

      arrayContent += char;
    }

    pos++;
  }

  // Parse articles by finding each object
  const articles = [];
  const articleMatches = arrayContent.split(/\},\s*\{/).map((match, index, arr) => {
    if (index === 0) return match + '}';
    if (index === arr.length - 1) return '{' + match;
    return '{' + match + '}';
  });

  console.log(`Found ${articleMatches.length} articles to process\n`);

  for (const articleText of articleMatches) {
    try {
      // Extract individual fields manually (safer than eval)
      const idMatch = articleText.match(/id: "([^"]+)"/);
      const titleMatch = articleText.match(/title: "([^"]+)"/);
      const descriptionMatch = articleText.match(/description: "([^"]+)"/);
      const categoryMatch = articleText.match(/category: "([^"]+)"/);
      const dateMatch = articleText.match(/date: "([^"]+)"/);

      if (!idMatch || !titleMatch || !descriptionMatch || !categoryMatch || !dateMatch) {
        console.error("⚠️  Skipping article - missing required fields");
        continue;
      }

      // Extract content between backticks
      const contentMatch = articleText.match(/content: `([\s\S]*?)`(?:,|\})/);
      if (!contentMatch) {
        console.error(`⚠️  Skipping ${idMatch[1]} - could not extract content`);
        continue;
      }

      // Extract keyFeatures array
      const keyFeaturesMatch = articleText.match(/keyFeatures: \[([\s\S]*?)\]/);
      const keyFeatures = [];
      if (keyFeaturesMatch) {
        const featuresText = keyFeaturesMatch[1];
        const featureMatches = featuresText.match(/"([^"]+)"/g) || [];
        keyFeatures.push(...featureMatches.map(f => f.slice(1, -1)));
      }

      // Extract urls array
      const urlsMatch = articleText.match(/urls: \[([\s\S]*?)\]/) || articleText.match(/urls\?: \[([\s\S]*?)\]/);
      const urls = [];
      if (urlsMatch) {
        const urlsText = urlsMatch[1];
        const urlMatches = urlsText.match(/"([^"]+)"/g) || [];
        urls.push(...urlMatches.map(u => u.slice(1, -1)));
      }

      const article = {
        id: idMatch[1],
        title: titleMatch[1],
        description: descriptionMatch[1],
        category: categoryMatch[1],
        date: dateMatch[1],
        content: contentMatch[1],
        urls,
        keyFeatures
      };

      const converted = convertArticle(article);
      articles.push(converted);

      console.log(`✓ ${converted.title}`);
      console.log(`  Word Count: ${converted.wordCount.toLocaleString()}`);
      console.log(`  Quality Score: ${converted.qualityScore}/100`);
      console.log("");

    } catch (error) {
      console.error(`⚠️  Error parsing article:`, error.message);
    }
  }

  console.log("=".repeat(70));
  console.log(`Uploading ${articles.length} articles to Convex in batches...`);
  console.log("=".repeat(70));
  console.log("");

  // Upload in batches of 10
  const BATCH_SIZE = 10;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(articles.length / BATCH_SIZE);

    console.log(`\nBatch ${batchNum}/${totalBatches}: Uploading ${batch.length} articles...`);

    try {
      const result = await client.mutation(api.articles.batchUploadArticles, {
        articles: batch
      });

      result.results.forEach((r) => {
        if (r.action === "created") totalCreated++;
        if (r.action === "updated") totalUpdated++;
      });

      console.log(`  ✓ Batch ${batchNum} complete`);

    } catch (error) {
      console.error(`  ❌ Batch ${batchNum} failed:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Migration Results");
  console.log("=".repeat(70));
  console.log("");
  console.log(`Total Articles Processed: ${articles.length}`);
  console.log(`Created: ${totalCreated}`);
  console.log(`Updated: ${totalUpdated}`);
  console.log("");

  // Summary stats
  const totalWords = articles.reduce((sum, a) => sum + a.wordCount, 0);
  const avgQuality = articles.reduce((sum, a) => sum + a.qualityScore, 0) / articles.length;
  const avgWords = totalWords / articles.length;

  console.log("Summary Statistics:");
  console.log(`  Total Words: ${totalWords.toLocaleString()}`);
  console.log(`  Average Word Count: ${Math.round(avgWords).toLocaleString()}`);
  console.log(`  Average Quality Score: ${avgQuality.toFixed(1)}/100`);
  console.log("");
  console.log("✅ Batch 2 migration complete!\n");

  process.exit(0);

} catch (error) {
  console.error("\n💥 Migration failed:");
  console.error(error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}
