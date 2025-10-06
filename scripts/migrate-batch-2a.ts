#!/usr/bin/env tsx

/**
 * Migration Script: Batch 2A - Existing Articles (Articles 1-4)
 *
 * Migrates first 4 articles from articles-data.ts:
 * - bun-revolutionary-javascript-runtime
 * - nextjs-15-app-router-revolution
 * - ai-development-tools-sdks-comprehensive-guide
 * - modern-ui-component-libraries-comprehensive-guide
 *
 * Migration Approach: AS-IS (no enhancement at this stage)
 */

import { migrate } from "../lib/migrate-to-convex.js";

// Article data extracted from articles-data.ts
const batch2aArticles = [
  {
    id: "bun-revolutionary-javascript-runtime",
    title: "Bun: The Revolutionary JavaScript Runtime That's Changing Everything",
    description: "Discover how Bun is transforming JavaScript development with lightning-fast performance, built-in bundling, and seamless TypeScript support that makes Node.js look ancient.",
    category: "Developer Tools",
    date: "2025-09-15",
    content: `# Bun: The Revolutionary JavaScript Runtime That's Changing Everything

In the rapidly evolving landscape of JavaScript development, a new player has emerged that's turning heads and breaking benchmarks. Bun, developed by Jarred Sumner and his team, isn't just another JavaScript runtime—it's a complete reimagining of what JavaScript tooling should be in 2025.

## Executive Summary

Bun is a fast, all-in-one JavaScript runtime that combines a JavaScript/TypeScript runtime, package manager, bundler, and test runner into a single executable. Unlike Node.js, which relies on V8 and requires separate tools for bundling and package management, Bun provides everything out of the box with performance that's often 2-4x faster than traditional alternatives.

## Key Features

- **JavaScriptCore Engine**: Faster startup times and lower memory usage
- **Built-in TypeScript Support**: No configuration needed
- **Native Bundling**: Zero-config bundler included
- **Package Manager**: 25x faster than npm
- **Test Runner**: Built-in testing with Jest compatibility

## Performance Benefits

Bun consistently outperforms Node.js in key areas:
- HTTP requests: 4x faster
- File I/O operations: 3x faster
- Package installation: 25x faster

## Getting Started

Installation is simple - just run the installer and you're ready to go with a complete JavaScript toolchain that handles everything from development to production.`,
    urls: [],
    keyFeatures: [
      "All-in-one JavaScript runtime",
      "4x faster than Node.js",
      "Built-in TypeScript support",
      "Zero-config bundling",
      "25x faster package installation"
    ],
    tags: ["JavaScript", "Runtime", "Developer Tools", "Performance"],
    wordCount: 0
  },
  {
    id: "nextjs-15-app-router-revolution",
    title: "Next.js 15 and App Router: The Full-Stack React Revolution",
    description: "Explore how Next.js 15's App Router is revolutionizing React development with Server Components, streaming, and edge-first architecture that delivers unparalleled performance and developer experience.",
    category: "React/Frontend",
    date: "2025-09-14",
    content: `# Next.js 15 and App Router: The Full-Stack React Revolution

React development has undergone a seismic shift with the introduction of Next.js 15 and its revolutionary App Router. This isn't just an incremental update—it's a complete reimagining of how we build React applications.

## Executive Summary

Next.js 15 with App Router represents the most significant advancement in React development since hooks. It introduces a new mental model that blurs the lines between frontend and backend, enabling developers to build full-stack applications with unprecedented performance and developer experience.

Key innovations include:
- **React Server Components** for zero-bundle-size server-side logic
- **Streaming architecture** for instant loading states
- **Nested layouts** that prevent navigation flickers
- **Built-in optimizations** for images, fonts, and scripts
- **Edge-first design** for global performance

## Getting Started Today

Ready to experience the future of JavaScript development? Here's your quick-start guide:

The JavaScript ecosystem is evolving rapidly, and Next.js 15 is leading the charge. Whether you're building high-performance APIs, rapid prototypes, or full-stack applications, Next.js offers the tools and performance to make your development experience better than ever.`,
    urls: [
      { title: "Next.js Official Site", url: "https://nextjs.org" },
      { title: "Next.js GitHub", url: "https://github.com/vercel/next.js" }
    ],
    keyFeatures: [
      "App Router architecture",
      "React Server Components",
      "Streaming",
      "Edge runtime",
      "Built-in optimizations",
      "Zero configuration"
    ],
    tags: ["Next.js", "React", "Frontend", "Full-Stack", "Server Components"],
    wordCount: 0
  },
  {
    id: "ai-development-tools-sdks-comprehensive-guide",
    title: "AI Development Tools & SDKs: The Complete Developer's Arsenal for 2025",
    description: "Master the most powerful AI development tools and SDKs transforming how we build applications. From Claude 4 Sonnet to ElevenLabs Studio 3.0, discover the essential technologies every developer needs.",
    category: "AI Development",
    date: "2025-09-16",
    content: `# AI Development Tools & SDKs: The Complete Developer's Arsenal for 2025

The AI development landscape in 2025 has reached an unprecedented level of sophistication and accessibility. What once required PhD-level expertise and massive computational resources is now available through elegant APIs and intuitive SDKs that any developer can integrate into their applications.

## Executive Summary

We're witnessing a fundamental shift in software development where AI capabilities are becoming as essential as databases and authentication systems. The tools covered in this comprehensive guide represent the cutting edge of what's possible when human creativity meets artificial intelligence.

From conversational AI with Claude 4 Sonnet to photorealistic image generation with Nano Banana, from reasoning-powered video creation with Luma Ray3 to voice synthesis with ElevenLabs Studio 3.0—these tools are not just changing how we build software; they're redefining what's possible to build.

## Key Tools Covered

### Conversational AI & Language Models
- **Claude 4 Sonnet**: Advanced reasoning and code generation
- **OpenRouter AI**: Multi-model API access
- **Magistral 1.2**: Mistral's reasoning models

### Creative AI Tools
- **Nano Banana**: AI image generation system
- **ElevenLabs Studio 3.0**: Professional audio synthesis
- **Luma Ray3**: Reasoning-powered video generation
- **Gamma 3.0**: AI content creation and design

### Development Platforms
- **AI SDK 5**: Vercel's comprehensive AI toolkit
- **Lovable.dev**: AI-powered website builder
- **Reve**: Open-source AI Studio alternative

### Agent & Workflow Systems
- **Eigent**: Multi-agent workforce platform
- **Coral v1**: AI agent marketplace
- **LangGraph**: NVIDIA-powered agent architecture

## The Future of AI-Powered Development

The tools and techniques covered in this guide represent just the beginning of the AI revolution in software development. As these technologies continue to evolve, developers who master them today will be well-positioned to build the next generation of intelligent applications.`,
    urls: [],
    keyFeatures: [
      "Claude 4 Sonnet integration",
      "Multi-modal AI capabilities",
      "Voice and audio synthesis",
      "Image and video generation",
      "Agent-based workflows",
      "Real-time AI processing",
      "Cost optimization strategies",
      "Production deployment patterns",
      "Cross-platform compatibility",
      "Enterprise-grade security"
    ],
    tags: ["AI", "Development Tools", "SDKs", "Claude", "Machine Learning"],
    wordCount: 0
  },
  {
    id: "modern-ui-component-libraries-comprehensive-guide",
    title: "Modern UI Component Libraries: The Complete Architecture Guide for React and React Native",
    description: "Explore the revolutionary shift toward headless UI, universal design systems, and cross-platform component architectures. Master shadcn/ui, Radix UI, Tamagui, and the future of UI development.",
    category: "React/Frontend",
    date: "2025-09-15",
    content: `# Modern UI Component Libraries: The Complete Architecture Guide for React and React Native

The UI component library ecosystem has undergone a profound transformation in 2025. We've moved beyond traditional component libraries toward a new paradigm that emphasizes composability, accessibility, and universal design systems that work across web, mobile, and desktop platforms.

## Executive Summary

Modern UI development in 2025 is characterized by three major shifts:

1. **The Headless UI Revolution**: Components provide behavior and accessibility without imposing visual design
2. **Universal Design Systems**: Single component libraries that work across React web and React Native
3. **Composition over Configuration**: Building complex UIs through component composition rather than extensive prop APIs

## Key Libraries Covered

### Headless UI Foundation
- **Radix UI**: The gold standard for accessible, unstyled components
- **shadcn/ui**: The composition layer that makes Radix UI developer-friendly

### Cross-Platform Solutions
- **Tamagui**: Universal UI system for React and React Native
- **GlueStack UI**: Mobile-first component library with web support

### Animation & Interaction
- **Framer Motion**: Physics-based animations and gestures
- **Animate UI**: Micro-interactions and delightful animations

### Developer Experience
- **Lucide React**: Beautiful, consistent iconography
- **tailwind-merge**: Intelligent CSS class merging
- **clsx**: Conditional className utilities

## The Future of UI Development

The component libraries and patterns covered in this guide represent the cutting edge of UI development. By embracing headless UI principles, universal design systems, and composition-based architectures, developers can build more maintainable, accessible, and performant user interfaces.`,
    urls: [],
    keyFeatures: [
      "Headless UI architecture",
      "Universal design systems",
      "Cross-platform compatibility",
      "Accessibility by default",
      "TypeScript-first development",
      "Animation and interaction patterns",
      "Performance optimization",
      "Developer experience tools",
      "Component composition patterns",
      "Modern styling approaches"
    ],
    tags: ["React", "UI", "Component Libraries", "Frontend", "React Native"],
    wordCount: 0
  }
];

// Convert article format to match Convex schema
function convertArticle(article: any) {
  // Calculate word count if not already set
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
    tags: article.tags,
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
  console.log("BATCH 2A: Existing Articles Migration (Articles 1-4)");
  console.log("=".repeat(60));
  console.log("");
  console.log("Migration Strategy: AS-IS (no enhancement)");
  console.log("");

  // Convert articles to proper format
  const convertedArticles = batch2aArticles.map(convertArticle);

  console.log(`Preparing to migrate ${convertedArticles.length} articles:\n`);

  convertedArticles.forEach((article, index) => {
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
  const stats = await migrate.batchUploadArticles(convertedArticles, showProgress);

  // Calculate aggregate statistics
  const totalWords = convertedArticles.reduce((sum, a) => sum + a.wordCount, 0);
  const avgWords = Math.round(totalWords / convertedArticles.length);
  const avgQualityScore = convertedArticles.reduce((sum, a) => {
    const prepared = migrate.prepareArticle(a);
    return sum + (prepared.qualityScore || 0);
  }, 0) / convertedArticles.length;

  // Generate report
  console.log("\n" + migrate.generateMigrationReport(stats));

  console.log("\n" + "=".repeat(60));
  console.log("BATCH 2A STATISTICS");
  console.log("=".repeat(60));
  console.log(`Total Words: ${totalWords.toLocaleString()}`);
  console.log(`Average Words per Article: ${avgWords.toLocaleString()}`);
  console.log(`Average Quality Score: ${avgQualityScore.toFixed(1)}/100`);
  console.log("");

  // Exit with appropriate code
  if (stats.failed > 0) {
    console.error("\n❌ Migration completed with errors");
    process.exit(1);
  } else {
    console.log("\n✅ Batch 2A migration completed successfully!");
    console.log("\nNext: Proceed with Batch 2B (Articles 5-8)");
    process.exit(0);
  }
}

// Run migration
main().catch((error) => {
  console.error("\n💥 Migration failed with error:");
  console.error(error);
  process.exit(1);
});
