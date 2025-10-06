#!/usr/bin/env node

/**
 * Upload Huxe Article Separately
 * (Has complex nested template literals that confuse the parser)
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
console.log("Uploading Huxe Article");
console.log("=".repeat(70));
console.log("");

// Read the file
const filePath = join(__dirname, "../../dev_tools_content/article-huxe.ts");
const fileContent = readFileSync(filePath, "utf-8");

// More robust extraction that handles nested backticks
// Find content field and extract until the last backtick before the next field
const contentStart = fileContent.indexOf("content: `");
if (contentStart === -1) {
  console.error("❌ Could not find content field");
  process.exit(1);
}

// Find the end by looking for the pattern: backtick, comma, newline, space, field name
// This is more reliable than counting backticks
const searchStart = contentStart + 10;
const endPattern = /`,\s*urls:/;
const match = fileContent.slice(searchStart).match(endPattern);

if (!match) {
  console.error("❌ Could not find end of content field");
  process.exit(1);
}

const contentEnd = searchStart + match.index;
const articleContent = fileContent.slice(contentStart + 10, contentEnd);

const wordCount = articleContent.trim().split(/\s+/).length;

console.log(`✓ Extracted Huxe article content`);
console.log(`  Word Count: ${wordCount.toLocaleString()}`);
console.log(`  First 200 chars: ${articleContent.substring(0, 200)}...\n`);

// Calculate quality score
const keyFeaturesCount = 6;
const urlsCount = 2;
const headingCount = (articleContent.match(/^#{1,6}\s/gm) || []).length;
const codeBlockCount = (articleContent.match(/```/g) || []).length / 2;
const listCount = (articleContent.match(/^[-*+]\s/gm) || []).length;

let qualityScore = 0;

// Word count (0-30)
if (wordCount >= 3000) qualityScore += 30;
else if (wordCount >= 2000) qualityScore += 25;
else if (wordCount >= 1500) qualityScore += 20;
else qualityScore += 15;

// Key features (0-20)
if (keyFeaturesCount >= 6) qualityScore += 20;

// URLs (0-15)
if (urlsCount >= 2) qualityScore += 12;

// Content structure (0-35)
if (headingCount >= 10) qualityScore += 15;
else if (headingCount >= 5) qualityScore += 10;

if (codeBlockCount >= 5) qualityScore += 10;
else if (codeBlockCount >= 3) qualityScore += 7;

if (listCount >= 10) qualityScore += 10;
else if (listCount >= 5) qualityScore += 7;

qualityScore = Math.min(qualityScore, 100);

const article = {
  id: "huxe-proactive-ai-content-platform",
  title: "Huxe: The Proactive AI Content Platform That Comes to You Instead of Waiting for Prompts",
  description: "Huxe revolutionizes AI interaction by proactively pushing personalized intelligence to users through contextual audio content. Built by former NotebookLM creators, Huxe transforms your calendar, inbox, and interests into interactive podcasts that deliver insights before you ask for them. Experience the future of context-aware AI that works for you 24/7.",
  category: "AI Tools",
  date: "2025-09-25",
  content: articleContent,
  urls: [
    { title: "huxe.com", url: "https://www.huxe.com" },
    { title: "App Store", url: "https://apps.apple.com/us/app/huxe/id6743417504" }
  ],
  keyFeatures: [
    { title: "Daily Briefings", description: "Auto-generated audio overviews of calendar and inbox" },
    { title: "Live Stations", description: "Persistent topic stations with continuous updates" },
    { title: "DeepCasts", description: "Instant podcast generation on any topic in under 2 minutes" },
    { title: "Interactive Audio", description: "Interrupt and ask questions in real-time" },
    { title: "Context-Aware Intelligence", description: "Proactively surfaces relevant information" },
    { title: "Privacy-First Architecture", description: "Secure OAuth with granular controls" }
  ],
  tags: ["AI Tools", "Voice AI", "Productivity", "NotebookLM", "Audio", "Personal Assistant"],
  wordCount,
  qualityScore,
  readingTime: Math.ceil(wordCount / 200),
  slug: "huxe-proactive-ai-content-platform",
  published: true
};

console.log("Article prepared:");
console.log(`  Quality Score: ${qualityScore}/100`);
console.log(`  Reading Time: ${article.readingTime} min`);
console.log(`  Headings: ${headingCount}`);
console.log(`  Code Blocks: ${codeBlockCount}`);
console.log(`  Lists: ${listCount}`);
console.log("");

console.log("Uploading to Convex...\n");

try {
  const result = await client.mutation(api.articles.batchUploadArticles, {
    articles: [article]
  });

  console.log("=".repeat(70));
  console.log("Upload Result");
  console.log("=".repeat(70));
  console.log("");
  console.log(`Action: ${result.results[0].action.toUpperCase()}`);
  console.log(`Convex ID: ${result.results[0]._id}`);
  console.log("");
  console.log("✅ Huxe article uploaded successfully!\n");

  process.exit(0);

} catch (error) {
  console.error("❌ Error:", error.message);
  if (error.data) {
    console.error("Details:", JSON.stringify(error.data, null, 2));
  }
  process.exit(1);
}
