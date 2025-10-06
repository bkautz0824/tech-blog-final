/**
 * Batch 2E Upload Script - Articles 20-21 (Already at 3,000+ words)
 *
 * These articles are already high quality and at target word count:
 * - Article 20: Design Tools & Resources (3,432 words)
 * - Article 21: Developer Productivity AI Assistants (4,083 words)
 *
 * Run: npx tsx batch-2e-upload-script.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";
import { articles } from "./lib/articles-data.js";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Get articles 20 and 21 (indices 19 and 20)
const article20 = articles[19];
const article21 = articles[20];

// Transform to Convex schema format
function transformArticle(article: typeof articles[0], qualityScore: number) {
  // Parse URLs if they're strings
  const urls = Array.isArray(article.urls)
    ? article.urls.map(url => typeof url === 'string'
        ? { title: "Official Website", url }
        : url)
    : [];

  // Parse key features
  const keyFeatures = Array.isArray(article.keyFeatures)
    ? article.keyFeatures.map(feature => typeof feature === 'string'
        ? { title: feature, description: feature }
        : feature)
    : [];

  const wordCount = article.content.split(/\s+/).length;

  return {
    id: article.id,
    title: article.title,
    description: article.description,
    category: article.category,
    date: article.date,
    content: article.content,
    urls,
    keyFeatures,
    tags: [], // Add tags later if needed
    wordCount,
    qualityScore,
    published: true,
    slug: article.id,
    readingTime: Math.ceil(wordCount / 200),
  };
}

const article20Transformed = transformArticle(article20, 94);
const article21Transformed = transformArticle(article21, 96);

async function uploadBatch2E() {
  console.log('🚀 Starting Batch 2E Upload - Articles 20-21');
  console.log('================================================\n');

  const articlesToUpload = [
    { data: article20Transformed, label: "Article 20" },
    { data: article21Transformed, label: "Article 21" }
  ];

  const results = [];

  for (const { data, label } of articlesToUpload) {
    try {
      console.log(`📝 Uploading: ${data.title}`);
      console.log(`   ID: ${data.id}`);
      console.log(`   Category: ${data.category}`);
      console.log(`   Word Count: ${data.wordCount} words`);
      console.log(`   Quality Score: ${data.qualityScore}/100`);
      console.log(`   Reading Time: ${data.readingTime} min`);

      const result = await client.mutation(api.articles.createArticle, data);

      console.log(`✅ Successfully uploaded: ${data.id}`);
      console.log(`   Article ID: ${result}\n`);

      results.push({ id: data.id, _id: result, status: 'success' });
    } catch (error: any) {
      console.error(`❌ Error uploading ${data.id}:`, error);
      results.push({ id: data.id, error: error.message, status: 'failed' });
    }
  }

  console.log('\n================================================');
  console.log('📊 Batch 2E Upload Summary');
  console.log('================================================');
  console.log(`Total articles: ${articlesToUpload.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);
  console.log('\n✨ Batch 2E upload complete!');

  return results;
}

// Run the upload
uploadBatch2E()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

export { uploadBatch2E };
