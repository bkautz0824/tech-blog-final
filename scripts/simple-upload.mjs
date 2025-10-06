#!/usr/bin/env node

/**
 * Simple Direct Upload Script
 * Manually create article objects and upload to Convex
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
console.log("Direct Article Upload to Convex");
console.log("=".repeat(60));
console.log("");

// Helper function to calculate word count
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

// Helper function to calculate quality score
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

// Read article content from files
const articlesDir = join(__dirname, "../../dev_tools_content");
const articleFiles = {
  elevenlabs: join(articlesDir, "article-elevenlabs-ui.ts"),
};

// Try to read one article to test
try {
  const content = readFileSync(articleFiles.elevenlabs, "utf-8");
  console.log("✓ Successfully read ElevenLabs article file");
  console.log(`  File size: ${(content.length / 1024).toFixed(1)} KB\n`);

  // Extract content between backticks (handle template literals properly)
  const contentStart = content.indexOf("content: `");
  if (contentStart === -1) {
    console.error("❌ Could not find content field in article");
    process.exit(1);
  }

  // Find the matching closing backtick by counting
  let pos = contentStart + 10; // Skip "content: `"
  let backtickCount = 1;
  let articleContent = "";

  while (pos < content.length && backtickCount > 0) {
    if (content[pos] === '`' && content[pos - 1] !== '\\') {
      backtickCount--;
      if (backtickCount === 0) break;
    }
    articleContent += content[pos];
    pos++;
  }

  if (backtickCount !== 0) {
    console.error("❌ Could not find matching closing backtick");
    process.exit(1);
  }
  const wordCount = countWords(articleContent);

  console.log(`  Word count: ${wordCount.toLocaleString()}`);
  console.log(`  First 200 chars: ${articleContent.substring(0, 200)}...\n`);

  // Manual article data for ElevenLabs (as a test)
  const article = {
    id: "elevenlabs-ui-voice-navigation-components",
    title: "ElevenLabs UI Voice Nav: Building the Future of Voice-First Web Navigation",
    description: "ElevenLabs UI introduces voice navigation components that transform how users interact with web applications. This open-source library enables developers to build accessible, voice-controlled interfaces with natural language processing, hands-free navigation, and seamless integration into React applications—bringing the future of conversational UI to the modern web.",
    category: "React/Frontend",
    date: "2025-09-22",
    content: articleContent,
    urls: [
      { title: "elevenlabs.com", url: "https://elevenlabs.com" },
      { title: "GitHub Repository", url: "https://github.com/elevenlabs/ui-voice-nav" }
    ],
    keyFeatures: [
      { title: "Voice-First Navigation", description: "Natural language interface for web navigation" },
      { title: "React Components", description: "Prebuilt components for voice integration" },
      { title: "Accessibility", description: "WCAG-compliant voice interfaces" },
      { title: "Real-time Processing", description: "Low-latency voice command processing" },
      { title: "Custom Commands", description: "Extensible command system" },
      { title: "Multi-language Support", description: "Voice recognition in multiple languages" }
    ],
    tags: ["React", "Voice UI", "Frontend", "Accessibility", "UI/UX"],
    wordCount: wordCount,
    qualityScore: calculateQualityScore(articleContent, wordCount, 6, 2),
    readingTime: Math.ceil(wordCount / 200),
    slug: "elevenlabs-ui-voice-navigation-components",
    published: true
  };

  console.log("Article prepared:");
  console.log(`  ID: ${article.id}`);
  console.log(`  Title: ${article.title}`);
  console.log(`  Category: ${article.category}`);
  console.log(`  Word Count: ${article.wordCount.toLocaleString()}`);
  console.log(`  Quality Score: ${article.qualityScore}/100`);
  console.log(`  Reading Time: ${article.readingTime} min`);
  console.log(`  Tags: ${article.tags.join(", ")}`);
  console.log("");

  console.log("Uploading to Convex...\n");

  const result = await client.mutation(api.articles.batchUploadArticles, {
    articles: [article]
  });

  console.log("=".repeat(60));
  console.log("Upload Result");
  console.log("=".repeat(60));
  console.log("");
  console.log(`Success: ${result.success}`);
  console.log(`Processed: ${result.processed}`);
  console.log(`Action: ${result.results[0].action}`);
  console.log(`Convex ID: ${result.results[0]._id}`);
  console.log("");
  console.log("✅ Article uploaded successfully!\n");

} catch (error) {
  console.error("❌ Error:", error.message);
  if (error.data) {
    console.error("Details:", JSON.stringify(error.data, null, 2));
  }
  process.exit(1);
}
