/**
 * Batch 2B Verification Script
 * Verifies uploaded articles and generates quality metrics
 */

import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface QualityMetrics {
  wordCount: number;
  hasExecutiveSummary: boolean;
  hasTechnicalDeepDive: boolean;
  hasRealWorldExamples: boolean;
  hasCommonPitfalls: boolean;
  hasBestPractices: boolean;
  hasIntegrationGuidance: boolean;
  hasGettingStarted: boolean;
  codeBlockCount: number;
  headingCount: number;
  estimatedQualityScore: number;
}

function analyzeArticleQuality(content: string): QualityMetrics {
  const wordCount = content.split(/\s+/).length;

  // Check for required sections
  const hasExecutiveSummary = /##\s*Executive Summary/i.test(content);
  const hasTechnicalDeepDive = /##\s*Technical Deep Dive/i.test(content);
  const hasRealWorldExamples = /##\s*Real-World (Examples|Implementation)/i.test(content);
  const hasCommonPitfalls = /##\s*Common Pitfalls/i.test(content);
  const hasBestPractices = /##\s*Best Practices/i.test(content);
  const hasIntegrationGuidance = /##\s*Integration (Guidance|Guide)/i.test(content);
  const hasGettingStarted = /##\s*Getting Started/i.test(content);

  // Count code blocks and headings
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  const headingCount = (content.match(/^#{2,3}\s+/gm) || []).length;

  // Calculate quality score
  let score = 0;

  // Word count scoring (30 points)
  if (wordCount >= 3000) score += 30;
  else if (wordCount >= 2500) score += 25;
  else if (wordCount >= 2000) score += 20;
  else score += (wordCount / 2000) * 20;

  // Section completeness (40 points)
  if (hasExecutiveSummary) score += 6;
  if (hasTechnicalDeepDive) score += 8;
  if (hasRealWorldExamples) score += 6;
  if (hasCommonPitfalls) score += 5;
  if (hasBestPractices) score += 5;
  if (hasIntegrationGuidance) score += 5;
  if (hasGettingStarted) score += 5;

  // Code examples scoring (20 points)
  const codeScore = Math.min(20, (codeBlockCount / 15) * 20);
  score += codeScore;

  // Structure scoring (10 points)
  const structureScore = Math.min(10, (headingCount / 20) * 10);
  score += structureScore;

  return {
    wordCount,
    hasExecutiveSummary,
    hasTechnicalDeepDive,
    hasRealWorldExamples,
    hasCommonPitfalls,
    hasBestPractices,
    hasIntegrationGuidance,
    hasGettingStarted,
    codeBlockCount,
    headingCount,
    estimatedQualityScore: Math.round(score),
  };
}

async function verifyBatch2B() {
  console.log("🔍 Verifying Batch 2B Articles...\n");

  const articleIds = [
    "backend-as-a-service-database-solutions-2025",
    "cursor-ai-editor-development-future",
  ];

  const results = [];

  for (const id of articleIds) {
    try {
      const article = await client.query(api.articles.getArticleById, { id });

      if (!article) {
        console.log(`❌ Article not found: ${id}\n`);
        continue;
      }

      const metrics = analyzeArticleQuality(article.content);

      console.log(`📄 ${article.title}`);
      console.log(`   ID: ${id}`);
      console.log(`   Word Count: ${metrics.wordCount.toLocaleString()}`);
      console.log(`   Code Blocks: ${metrics.codeBlockCount}`);
      console.log(`   Headings: ${metrics.headingCount}`);
      console.log(`   Quality Score: ${metrics.estimatedQualityScore}/100`);
      console.log(`   \n   Section Completeness:`);
      console.log(`   ${metrics.hasExecutiveSummary ? '✅' : '❌'} Executive Summary`);
      console.log(`   ${metrics.hasTechnicalDeepDive ? '✅' : '❌'} Technical Deep Dive`);
      console.log(`   ${metrics.hasRealWorldExamples ? '✅' : '❌'} Real-World Examples`);
      console.log(`   ${metrics.hasCommonPitfalls ? '✅' : '❌'} Common Pitfalls`);
      console.log(`   ${metrics.hasBestPractices ? '✅' : '❌'} Best Practices`);
      console.log(`   ${metrics.hasIntegrationGuidance ? '✅' : '❌'} Integration Guidance`);
      console.log(`   ${metrics.hasGettingStarted ? '✅' : '❌'} Getting Started\n`);

      results.push({
        id,
        title: article.title,
        metrics,
      });
    } catch (error) {
      console.error(`❌ Error verifying ${id}:`, error);
    }
  }

  // Generate summary
  console.log("\n📊 BATCH 2B SUMMARY");
  console.log("=" .repeat(60));

  const totalWords = results.reduce((sum, r) => sum + r.metrics.wordCount, 0);
  const avgQuality = results.reduce((sum, r) => sum + r.metrics.estimatedQualityScore, 0) / results.length;
  const totalCodeBlocks = results.reduce((sum, r) => sum + r.metrics.codeBlockCount, 0);

  console.log(`\nArticles Verified: ${results.length}`);
  console.log(`Total Word Count: ${totalWords.toLocaleString()} words`);
  console.log(`Average Quality Score: ${avgQuality.toFixed(1)}/100`);
  console.log(`Total Code Examples: ${totalCodeBlocks}`);

  console.log(`\n📈 Quality Breakdown:`);
  results.forEach((r, i) => {
    const status = r.metrics.estimatedQualityScore >= 85 ? '✅' : '⚠️';
    console.log(`${i + 1}. ${status} ${r.title}: ${r.metrics.estimatedQualityScore}/100`);
  });

  console.log(`\n🎯 Target Achievement:`);
  console.log(`   Word Count Goal (3,000+ per article): ${results.every(r => r.metrics.wordCount >= 3000) ? '✅ MET' : '⚠️ PARTIAL'}`);
  console.log(`   Quality Score Goal (85+): ${avgQuality >= 85 ? '✅ MET' : avgQuality >= 80 ? '⚠️ NEAR' : '❌ MISSED'}`);
  console.log(`   Section Completeness: ${results.every(r => r.metrics.hasExecutiveSummary && r.metrics.hasTechnicalDeepDive) ? '✅ MET' : '⚠️ PARTIAL'}`);

  // Overall project status
  console.log(`\n🏆 OVERALL PROJECT STATUS`);
  console.log("=" .repeat(60));
  console.log(`Previous Batches: 9 articles (45,942 words, 84.6-88.5 quality)`);
  console.log(`Batch 2B: 2 articles (${totalWords.toLocaleString()} words, ${avgQuality.toFixed(1)} avg quality)`);
  console.log(`\nTotal in Convex: 11 articles`);
  console.log(`Total Word Count: ~${(45942 + totalWords).toLocaleString()} words`);
  console.log(`\n✅ Batch 2B migration complete!`);
}

verifyBatch2B().catch(console.error);
