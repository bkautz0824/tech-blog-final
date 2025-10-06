#!/usr/bin/env node

/**
 * Extract specific articles from articles-data.ts by index
 * Usage: node extract-articles.mjs 5 6 7 8
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
  console.error('Example: node extract-articles.mjs 5 6 7 8');
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

// Extract requested articles
const requestedArticles = indices.map(idx => {
  const article = articles[idx - 1]; // Convert to 0-indexed
  if (!article) {
    console.error(`Article ${idx} not found`);
    return null;
  }
  return article;
}).filter(Boolean);

// Output as JSON array
console.log(JSON.stringify(requestedArticles, null, 2));
