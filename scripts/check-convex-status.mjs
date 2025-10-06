#!/usr/bin/env node

/**
 * Check Current Convex Database Status
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convexUrl = "https://different-vole-632.convex.cloud";
const client = new ConvexHttpClient(convexUrl);

console.log("=" * 70);
console.log("Convex Database Status Check");
console.log("=" * 70);
console.log("");

try {
  // Get all articles (including unpublished)
  const articles = await client.query(api.articles.getAllArticlesAdmin);

  console.log(`Total Articles in Convex: ${articles.length}\n`);

  // Sort by date
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Display summary
  console.log("Articles in Database:");
  console.log("=" * 70);

  articles.forEach((article, index) => {
    console.log(`\n${index + 1}. ${article.title}`);
    console.log(`   ID: ${article.id}`);
    console.log(`   Category: ${article.category}`);
    console.log(`   Date: ${article.date}`);
    console.log(`   Words: ${article.wordCount?.toLocaleString() || 'N/A'}`);
    console.log(`   Quality: ${article.qualityScore || 'N/A'}/100`);
    console.log(`   Published: ${article.published ? 'Yes' : 'No'}`);
  });

  // Calculate stats
  console.log("\n" + "=" * 70);
  console.log("Statistics");
  console.log("=" * 70);

  const totalWords = articles.reduce((sum, a) => sum + (a.wordCount || 0), 0);
  const avgWords = totalWords / articles.length;
  const withQuality = articles.filter(a => a.qualityScore);
  const avgQuality = withQuality.length > 0
    ? withQuality.reduce((sum, a) => sum + a.qualityScore, 0) / withQuality.length
    : 0;

  console.log(`\nTotal Articles: ${articles.length}`);
  console.log(`Total Words: ${totalWords.toLocaleString()}`);
  console.log(`Average Word Count: ${Math.round(avgWords).toLocaleString()}`);
  console.log(`Average Quality Score: ${avgQuality.toFixed(1)}/100`);

  // Categories
  const categories = {};
  articles.forEach(a => {
    categories[a.category] = (categories[a.category] || 0) + 1;
  });

  console.log("\nArticles by Category:");
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  console.log("");

} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
