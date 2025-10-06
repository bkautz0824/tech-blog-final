/**
 * Batch 2F Upload Script - Articles 18-19
 *
 * These articles are close to target word count:
 * - Article 18: AI-Powered Development Tools (1,990 words)
 * - Article 19: Modern Frontend Development (2,384 words)
 *
 * Run: npx tsx batch-2f-upload-script.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";
import { articles } from "./lib/articles-data.js";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Get articles 18 and 19 (indices 17 and 18)
const article18 = articles[17];
const article19 = articles[18];

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

const article18Transformed = transformArticle(article18, 80);  // 1,990 words
const article19Transformed = transformArticle(article19, 85);  // 2,384 words

async function uploadBatch2F() {
  console.log('🚀 Starting Batch 2F Upload - Articles 18-19');
  console.log('================================================\n');

  const articlesToUpload = [
    { data: article18Transformed, label: "Article 18" },
    { data: article19Transformed, label: "Article 19" }
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
  console.log('📊 Batch 2F Upload Summary');
  console.log('================================================');
  console.log(`Total articles: ${articlesToUpload.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);
  console.log('\n✨ Batch 2F upload complete!');

  return results;
}

// Run the upload
uploadBatch2F()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

export { uploadBatch2F };
