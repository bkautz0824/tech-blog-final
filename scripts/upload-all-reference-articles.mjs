#!/usr/bin/env node

/**
 * Upload All 5 Reference Quality Articles
 * Batch upload for Phase 2 migration
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
console.log("BATCH 1: Reference Quality Articles Migration");
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

function extractArticleContent(fileContent) {
  const contentStart = fileContent.indexOf("content: `");
  if (contentStart === -1) return null;

  let pos = contentStart + 10;
  let backtickCount = 1;
  let articleContent = "";

  while (pos < fileContent.length && backtickCount > 0) {
    if (fileContent[pos] === '`' && fileContent[pos - 1] !== '\\') {
      backtickCount--;
      if (backtickCount === 0) break;
    }
    articleContent += fileContent[pos];
    pos++;
  }

  return backtickCount === 0 ? articleContent : null;
}

// Article definitions
const articleDefinitions = [
  {
    filename: "article-axiom.ts",
    metadata: {
      id: "axiom-ai-monitoring-observability",
      title: "Axiom: Petabyte-Scale Monitoring for AI Applications",
      description: "Axiom revolutionizes AI observability with purpose-built monitoring for LLM applications, offering automatic cost tracking, trace visualization, and petabyte-scale data handling. Built on OpenTelemetry standards, it provides immediate insights into AI performance, token usage, and complex multi-step workflows with minimal integration code.",
      category: "Monitoring",
      date: "2025-09-21",
      urls: [
        { title: "axiom.co", url: "https://axiom.co" },
        { title: "Documentation", url: "https://axiom.co/docs" }
      ],
      keyFeatures: [
        { title: "AI-Native Monitoring", description: "Purpose-built for LLM application observability" },
        { title: "Automatic Cost Tracking", description: "Real-time token cost calculation across 200+ models" },
        { title: "OpenTelemetry Standard", description: "Built on industry-standard telemetry" },
        { title: "Petabyte-Scale Ingestion", description: "Handle massive volumes with 95% compression" },
        { title: "AI Agent Tracing", description: "Visualize complex multi-step workflows" },
        { title: "One-Line Integration", description: "Single wrapper function for instant instrumentation" }
      ],
      tags: ["Monitoring", "Observability", "AI Tools", "LLM", "OpenTelemetry", "DevOps"]
    }
  },
  {
    filename: "article-elevenlabs-ui.ts",
    metadata: {
      id: "elevenlabs-ui-voice-navigation-components",
      title: "ElevenLabs UI Voice Nav: Building the Future of Voice-First Web Navigation",
      description: "ElevenLabs UI introduces voice navigation components that transform how users interact with web applications. This open-source library enables developers to build accessible, voice-controlled interfaces with natural language processing, hands-free navigation, and seamless integration into React applications—bringing the future of conversational UI to the modern web.",
      category: "React/Frontend",
      date: "2025-09-22",
      urls: [
        { title: "elevenlabs.com", url: "https://elevenlabs.com" },
        { title: "GitHub", url: "https://github.com/elevenlabs/ui-voice-nav" }
      ],
      keyFeatures: [
        { title: "Voice-First Navigation", description: "Natural language interface for web navigation" },
        { title: "React Components", description: "Prebuilt components for voice integration" },
        { title: "Accessibility", description: "WCAG-compliant voice interfaces" },
        { title: "Real-time Processing", description: "Low-latency voice command processing" },
        { title: "Custom Commands", description: "Extensible command system" },
        { title: "Multi-language Support", description: "Voice recognition in multiple languages" }
      ],
      tags: ["React", "Voice UI", "Frontend", "Accessibility", "UI/UX", "ElevenLabs"]
    }
  },
  {
    filename: "article-huxe.ts",
    metadata: {
      id: "huxe-proactive-ai-content-platform",
      title: "Huxe: The Proactive AI Content Platform That Comes to You Instead of Waiting for Prompts",
      description: "Huxe revolutionizes AI interaction by proactively pushing personalized intelligence to users through contextual audio content. Built by former NotebookLM creators, Huxe transforms your calendar, inbox, and interests into interactive podcasts that deliver insights before you ask for them. Experience the future of context-aware AI that works for you 24/7.",
      category: "AI Tools",
      date: "2025-09-25",
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
      tags: ["AI Tools", "Voice AI", "Productivity", "NotebookLM", "Audio", "Personal Assistant"]
    }
  },
  {
    filename: "article-n8n.ts",
    metadata: {
      id: "n8n-workflow-automation-ai-agents",
      title: "n8n: Building Production-Grade AI Agents with Visual Workflow Automation",
      description: "n8n transforms AI development with a unique blend of visual workflow design and code-level control, enabling technical teams to build complex multi-agent systems without sacrificing flexibility. From autonomous AI agents to enterprise automation, n8n provides 400+ integrations, human-in-the-loop controls, and LangChain integration for building intelligent workflows at scale.",
      category: "Automation",
      date: "2025-09-23",
      urls: [
        { title: "n8n.io", url: "https://n8n.io" },
        { title: "GitHub", url: "https://github.com/n8n-io/n8n" },
        { title: "Documentation", url: "https://docs.n8n.io" }
      ],
      keyFeatures: [
        { title: "Visual Workflow Builder", description: "Drag-and-drop interface for complex automations" },
        { title: "400+ Integrations", description: "Connect to virtually any service or API" },
        { title: "AI Agent Framework", description: "Build multi-agent systems with LangChain" },
        { title: "Human-in-the-Loop", description: "Approval gates and manual intervention" },
        { title: "Self-Hosted Option", description: "Full data control and privacy" },
        { title: "Code-Level Customization", description: "JavaScript for advanced logic" }
      ],
      tags: ["Automation", "Workflow", "AI Agents", "No-Code", "LangChain", "Integration"]
    }
  },
  {
    filename: "article-openai-cookbook.ts",
    metadata: {
      id: "openai-cookbook-essential-ai-resource",
      title: "OpenAI Cookbook: The Definitive Resource for Production AI Engineering",
      description: "OpenAI Cookbook is the essential knowledge repository for building production-ready AI applications, offering battle-tested code examples, architectural patterns, and best practices directly from OpenAI's engineering team. From basic API integration to advanced RAG systems and fine-tuning pipelines, the Cookbook provides practical, copy-paste solutions that accelerate development while ensuring security, performance, and cost optimization.",
      category: "AI Tools",
      date: "2025-09-24",
      urls: [
        { title: "OpenAI Cookbook", url: "https://cookbook.openai.com" },
        { title: "GitHub", url: "https://github.com/openai/openai-cookbook" }
      ],
      keyFeatures: [
        { title: "Production-Ready Examples", description: "Battle-tested code from OpenAI engineers" },
        { title: "RAG Architecture Patterns", description: "Complete retrieval-augmented generation systems" },
        { title: "Fine-Tuning Guides", description: "Model customization best practices" },
        { title: "Cost Optimization", description: "Strategies to reduce API costs" },
        { title: "Security Best Practices", description: "Prompt injection prevention and safety" },
        { title: "Performance Optimization", description: "Latency reduction techniques" }
      ],
      tags: ["OpenAI", "AI Tools", "Documentation", "RAG", "Fine-Tuning", "Best Practices"]
    }
  }
];

// Process articles
const articles = [];

console.log("Processing articles...\n");

for (const def of articleDefinitions) {
  try {
    const filePath = join(__dirname, "../../dev_tools_content", def.filename);
    const fileContent = readFileSync(filePath, "utf-8");
    const articleContent = extractArticleContent(fileContent);

    if (!articleContent) {
      console.error(`❌ Could not extract content from ${def.filename}`);
      continue;
    }

    const wordCount = countWords(articleContent);
    const qualityScore = calculateQualityScore(
      articleContent,
      wordCount,
      def.metadata.keyFeatures.length,
      def.metadata.urls.length
    );

    const article = {
      ...def.metadata,
      content: articleContent,
      wordCount,
      qualityScore,
      readingTime: Math.ceil(wordCount / 200),
      slug: def.metadata.id,
      published: true
    };

    articles.push(article);

    console.log(`✓ ${def.metadata.title}`);
    console.log(`  Word Count: ${wordCount.toLocaleString()}`);
    console.log(`  Quality Score: ${qualityScore}/100`);
    console.log(`  Reading Time: ${article.readingTime} min`);
    console.log("");

  } catch (error) {
    console.error(`❌ Error processing ${def.filename}:`, error.message);
  }
}

// Upload to Convex
console.log("=".repeat(70));
console.log(`Uploading ${articles.length} articles to Convex...`);
console.log("=".repeat(70));
console.log("");

try {
  const result = await client.mutation(api.articles.batchUploadArticles, {
    articles
  });

  console.log("=".repeat(70));
  console.log("Migration Results");
  console.log("=".repeat(70));
  console.log("");
  console.log(`Total Articles: ${articles.length}`);
  console.log(`Processed: ${result.processed}`);
  console.log("");

  console.log("Article Actions:");
  result.results.forEach((r, i) => {
    const status = r.action === "created" ? "📄 CREATED" : "🔄 UPDATED";
    console.log(`  ${status}: ${articles[i].title}`);
    console.log(`           ID: ${articles[i].id}`);
    console.log(`           Convex ID: ${r._id}`);
    console.log("");
  });

  console.log("=".repeat(70));
  console.log("✅ All reference articles migrated successfully!");
  console.log("=".repeat(70));
  console.log("");

  // Summary stats
  const totalWords = articles.reduce((sum, a) => sum + a.wordCount, 0);
  const avgQuality = articles.reduce((sum, a) => sum + a.qualityScore, 0) / articles.length;

  console.log("Summary Statistics:");
  console.log(`  Total Words: ${totalWords.toLocaleString()}`);
  console.log(`  Average Quality Score: ${avgQuality.toFixed(1)}/100`);
  console.log(`  Average Word Count: ${(totalWords / articles.length).toLocaleString()}`);
  console.log("");

  process.exit(0);

} catch (error) {
  console.error("\n💥 Migration failed:");
  console.error(error.message);
  if (error.data) {
    console.error("Details:", JSON.stringify(error.data, null, 2));
  }
  process.exit(1);
}
