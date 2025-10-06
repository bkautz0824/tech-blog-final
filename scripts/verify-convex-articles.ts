#!/usr/bin/env tsx

/**
 * Verification Script: Query all articles from Convex
 *
 * Shows current state of Convex database with statistics
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

const client = new ConvexHttpClient(convexUrl);

async function main() {
  console.log("=".repeat(60));
  console.log("CONVEX DATABASE VERIFICATION");
  console.log("=".repeat(60));
  console.log("");
  console.log(`Connected to: ${convexUrl}`);
  console.log("");

  try {
    // Query all articles
    const articles = await client.query(api.articles.getAllArticles);

    console.log(`Total Articles in Convex: ${articles.length}`);
    console.log("");

    // Calculate statistics
    const totalWords = articles.reduce((sum: number, a: any) => sum + (a.wordCount || 0), 0);
    const avgWords = articles.length > 0 ? Math.round(totalWords / articles.length) : 0;
    const avgQuality = articles.length > 0
      ? (articles.reduce((sum: number, a: any) => sum + (a.qualityScore || 0), 0) / articles.length).toFixed(1)
      : 0;

    // Group by category
    const byCategory: Record<string, number> = {};
    articles.forEach((a: any) => {
      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    });

    console.log("STATISTICS");
    console.log("-".repeat(60));
    console.log(`Total Words: ${totalWords.toLocaleString()}`);
    console.log(`Average Words per Article: ${avgWords.toLocaleString()}`);
    console.log(`Average Quality Score: ${avgQuality}/100`);
    console.log("");

    console.log("ARTICLES BY CATEGORY");
    console.log("-".repeat(60));
    Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} articles`);
      });
    console.log("");

    console.log("ALL ARTICLES");
    console.log("-".repeat(60));
    articles
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((article: any, index: number) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   ID: ${article.id}`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Date: ${article.date}`);
        console.log(`   Words: ${article.wordCount?.toLocaleString() || 'N/A'}`);
        console.log(`   Quality: ${article.qualityScore?.toFixed(1) || 'N/A'}/100`);
        console.log(`   Tags: ${article.tags?.join(', ') || 'None'}`);
        console.log("");
      });

    console.log("=".repeat(60));
    console.log("✅ Verification complete!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error querying Convex:");
    console.error(error);
    process.exit(1);
  }
}

// Run verification
main().catch((error) => {
  console.error("💥 Verification failed:");
  console.error(error);
  process.exit(1);
});
