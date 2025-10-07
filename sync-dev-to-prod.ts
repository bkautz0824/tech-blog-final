/**
 * Sync articles from dev to production Convex deployment
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";

const devClient = new ConvexHttpClient("https://different-vole-632.convex.cloud");
const prodClient = new ConvexHttpClient("https://cool-goshawk-0.convex.cloud");

async function syncDevToProduction() {
  console.log('🔄 Syncing articles from dev to production...\n');

  try {
    // Get all articles from dev
    console.log('📥 Fetching articles from dev deployment...');
    const devArticles = await devClient.query(api.articles.getAllArticlesAdmin);
    console.log(`✅ Found ${devArticles.length} articles in dev\n`);

    if (devArticles.length === 0) {
      console.log('⚠️  No articles found in dev deployment');
      return;
    }

    // Upload each article to production
    console.log('📤 Uploading articles to production...\n');
    let successCount = 0;
    let failCount = 0;

    for (const article of devArticles) {
      try {
        // Remove Convex-specific fields
        const { _id, _creationTime, ...articleData } = article;

        console.log(`  Uploading: ${article.title} (${article.id})`);

        await prodClient.mutation(api.articles.createArticle, articleData);
        successCount++;
        console.log(`  ✅ Success\n`);
      } catch (error) {
        failCount++;
        console.error(`  ❌ Failed for ${article.id}:`);
        console.error(`     ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof Error && error.stack) {
          console.error(`     Stack: ${error.stack.split('\n')[0]}`);
        }
        console.log();
      }
    }

    console.log('================================================');
    console.log('📊 Sync Summary');
    console.log('================================================');
    console.log(`Total articles: ${devArticles.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log('\n✨ Sync complete!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

syncDevToProduction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
