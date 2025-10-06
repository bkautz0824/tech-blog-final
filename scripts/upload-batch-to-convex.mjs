#!/usr/bin/env node

/**
 * Extract articles from articles-data.ts and upload to Convex
 * Usage: node upload-batch-to-convex.mjs 5 6 7 8
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const articlesFilePath = join(__dirname, '../lib/articles-data.ts');

// Read the file
const fileContent = readFileSync(articlesFilePath, 'utf-8');

// Extract the articles array using regex
const articlesMatch = fileContent.match(/export const articles: Article\[\] = \[([\s\S]*)\];/);

if (!articlesMatch) {
  console.error('Could not find articles array');
  process.exit(1);
}

// Get the indices from command line args
const indices = process.argv.slice(2).map(n => parseInt(n));

if (indices.length === 0) {
  console.error('Please provide article indices as arguments');
  console.error('Example: node upload-batch-to-convex.mjs 5 6 7 8');
  process.exit(1);
}

// Parse articles by finding object boundaries
const articlesContent = articlesMatch[1];
const articles = [];
let currentArticle = '';
let braceDepth = 0;
let inArticle = false;

for (let i = 0; i < articlesContent.length; i++) {
  const char = articlesContent[i];

  if (char === '{' && braceDepth === 0) {
    inArticle = true;
    currentArticle = char;
    braceDepth = 1;
  } else if (inArticle) {
    currentArticle += char;

    if (char === '{') {
      braceDepth++;
    } else if (char === '}') {
      braceDepth--;

      if (braceDepth === 0) {
        articles.push(currentArticle);
        currentArticle = '';
        inArticle = false;
      }
    }
  }
}

// Convert TypeScript object string to proper JavaScript object
function parseTypeScriptObject(tsStr) {
  // Create a safe eval environment
  const cleanedStr = 'module.exports = ' + tsStr;

  // Write to temp file and require it
  const tmpFile = join(__dirname, '../.temp-article.cjs');
  writeFileSync(tmpFile, cleanedStr);

  // Clear require cache
  delete require.cache[tmpFile];

  // Import it
  const obj = require(tmpFile);

  // Clean up
  const { unlinkSync } = await import('fs');
  try {
    unlinkSync(tmpFile);
  } catch (e) {
    // Ignore cleanup errors
  }

  return obj;
}

// Extract and convert requested articles
const uploadArticles = [];

for (const idx of indices) {
  const article = articles[idx - 1]; // Convert to 0-indexed
  if (!article) {
    console.error(`Article ${idx} not found (total articles: ${articles.length})`);
    continue;
  }

  try {
    const articleObj = parseTypeScriptObject(article);
    uploadArticles.push(articleObj);
  } catch (error) {
    console.error(`Error parsing article ${idx}:`, error.message);
  }
}

if (uploadArticles.length === 0) {
  console.error('No articles to upload');
  process.exit(1);
}

console.log(`\n📦 Uploading ${uploadArticles.length} articles to Convex...\n`);

// Upload each article
let successCount = 0;
let failCount = 0;

for (const article of uploadArticles) {
  try {
    // Prepare the article data - escape for shell
    const articleData = {
      id: article.id,
      title: article.title,
      description: article.description,
      category: article.category,
      date: article.date,
      content: article.content,
      urls: article.urls || [],
      keyFeatures: article.keyFeatures || [],
      tags: article.tags || [],
      readTime: article.readTime || 8,
      difficulty: article.difficulty || 'intermediate',
      qualityScore: article.qualityScore || 75,
      wordCount: article.wordCount || article.content?.split(' ').length || 0,
      featured: article.featured || false,
      status: 'published'
    };

    // Write to temp file for Convex
    const dataFile = join(__dirname, '../.temp-upload.json');
    writeFileSync(dataFile, JSON.stringify(articleData));

    // Execute Convex upload using the temp file
    const cmd = `cat "${dataFile}" | npx convex run articles:createArticle --json`;
    execSync(cmd, { stdio: 'inherit', shell: '/bin/bash' });

    // Clean up
    const { unlinkSync } = await import('fs');
    try {
      unlinkSync(dataFile);
    } catch (e) {
      // Ignore
    }

    console.log(`✅ Uploaded: ${article.id}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to upload ${article.id}:`, error.message);
    failCount++;
  }
}

console.log(`\n📊 Upload Summary:`);
console.log(`   ✅ Success: ${successCount}`);
console.log(`   ❌ Failed: ${failCount}`);
console.log(`   📈 Total: ${uploadArticles.length}\n`);
