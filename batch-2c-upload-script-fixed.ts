/**
 * Batch 2C Upload Script - Articles 7-10 (FIXED)
 *
 * Enhanced articles ready for Convex upload:
 * - Article 7: Vercel (3,987 words)
 * - Article 8: Turso (3,364 words)
 * - Article 9: React Native + Expo Router
 * - Article 10: Playwright
 *
 * Run: npx tsx batch-2c-upload-script-fixed.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Article 7: Vercel - Enhanced
const article7 = {
  id: "vercel-modern-deployment-edge-computing",
  title: "Vercel: The Ultimate Platform for Modern Web Deployment and Edge Computing",
  description: "Master Vercel's revolutionary deployment platform with edge functions, instant scaling, and integrated CI/CD that delivers unmatched performance for Next.js and full-stack applications.",
  category: "Deployment/Infrastructure",
  date: "2025-09-12",
  content: fs.readFileSync(path.join(__dirname, 'article-7-vercel-enhanced.md'), 'utf-8'),
  urls: [
    { title: "Vercel Official Website", url: "https://vercel.com" },
    { title: "Vercel Documentation", url: "https://vercel.com/docs" },
    { title: "Next.js Documentation", url: "https://nextjs.org/docs" },
    { title: "Vercel AI SDK", url: "https://sdk.vercel.ai" }
  ],
  keyFeatures: [
    { title: "Global Edge Network", description: "100+ edge locations worldwide for sub-50ms latency" },
    { title: "Zero-Config Deployments", description: "Automatic CI/CD with Git integration" },
    { title: "Edge Functions", description: "Serverless compute at the edge with instant scaling" },
    { title: "AI-First Platform", description: "Built-in AI SDK for streaming LLM responses" },
    { title: "Comprehensive Storage", description: "Postgres, KV, and Blob storage solutions" },
    { title: "Enterprise Security", description: "Advanced threat protection and firewall" }
  ],
  tags: ["Vercel", "Edge Computing", "Deployment", "Next.js", "CI/CD", "Serverless"],
  wordCount: 3987,
  qualityScore: 92,
  published: true,
  slug: "vercel-modern-deployment-edge-computing",
  readingTime: 20,
};

// Article 8: Turso - Enhanced
const article8 = {
  id: "turso-edge-native-database-libsql-revolution",
  title: "Turso: The Edge-Native Database Revolution with LibSQL",
  description: "Explore Turso's groundbreaking edge-native database platform built on LibSQL, delivering millisecond latency worldwide with SQLite compatibility and distributed architecture.",
  category: "Database/Backend",
  date: "2025-09-11",
  content: fs.readFileSync(path.join(__dirname, 'article-8-turso-enhanced.md'), 'utf-8'),
  urls: [
    { title: "Turso Official Website", url: "https://turso.tech" },
    { title: "Turso Documentation", url: "https://docs.turso.tech" },
    { title: "LibSQL GitHub", url: "https://github.com/tursodatabase/libsql" },
    { title: "Drizzle ORM", url: "https://orm.drizzle.team" }
  ],
  keyFeatures: [
    { title: "Edge-Native Architecture", description: "Distributed SQLite at the edge with global replication" },
    { title: "LibSQL Open Source", description: "Fork of SQLite with modern enhancements" },
    { title: "Multi-Tenancy Support", description: "Isolated databases per tenant at massive scale" },
    { title: "Drizzle Integration", description: "Type-safe ORM with automatic migrations" },
    { title: "Embedded Replicas", description: "Local-first development with global sync" },
    { title: "Cost-Effective Pricing", description: "Pay-per-row model with generous free tier" }
  ],
  tags: ["Turso", "LibSQL", "SQLite", "Edge Database", "Drizzle ORM", "Multi-tenancy"],
  wordCount: 3364,
  qualityScore: 90,
  published: true,
  slug: "turso-edge-native-database-libsql-revolution",
  readingTime: 17,
};

// Article 9: React Native + Expo Router
const article9 = {
  id: "react-native-expo-router-ultimate-mobile-development",
  title: "React Native with Expo Router: The Ultimate Cross-Platform Mobile Development Stack",
  description: "Master the most powerful mobile development combination with React Native, Expo Router, and modern tooling that delivers native performance across iOS and Android with web-grade developer experience.",
  category: "Mobile Development",
  date: "2025-09-10",
  content: `# React Native with Expo Router: The Ultimate Cross-Platform Mobile Development Stack

The mobile development landscape has undergone a revolutionary transformation with the emergence of React Native and Expo as the dominant force in cross-platform development. With the introduction of Expo Router, this powerful combination now offers a development experience that rivals native iOS and Android development while maintaining the productivity and code sharing benefits of web technologies.

## Executive Summary

React Native with Expo Router represents the pinnacle of cross-platform mobile development in 2025. This stack combines the performance and native capabilities of React Native with Expo's comprehensive tooling ecosystem and the file-system based routing paradigm that has proven successful in Next.js and other modern web frameworks.

What makes this stack revolutionary is its ability to deliver truly native performance across iOS and Android while maintaining a single codebase that can optionally extend to web platforms. The integration of Expo Router brings familiar web development patterns to mobile, enabling developers to create complex navigation hierarchies with the same mental model used in modern web applications.

Key advantages include:
- Native performance with JavaScript flexibility
- File-system based routing with type safety and deep linking
- Over-the-air updates for instant bug fixes without app store delays
- Comprehensive development tools with hot reload and debugging
- Seamless integration with native platform APIs and device features
- Universal app architecture supporting iOS, Android, and Web simultaneously
- Automatic deep linking for every screen in your application

## Advanced Expo Router Features in 2025

### Automatic Deep Linking

Every screen in your app is automatically deep linkable, making any route shareable with links. Built-in deep linking means each route created in the file structure is automatically available as a URL both in the mobile version and in a browser, allowing users to be directed to specific screens from links without writing custom logic.

\`\`\`typescript
// Automatic URL generation for all routes
// app/(tabs)/profile/[id].tsx automatically generates:
// myapp://profile/123
// https://myapp.com/profile/123

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Profile {id}</Text>
      <Link href="/settings">Go to Settings</Link>
    </View>
  );
}
\`\`\`

### Performance Optimization Best Practices

To improve performance and cause fewer renders, reduce the scope of your providers to only the routes that need them. In production mode, routes are loaded dynamically, only when needed.

\`\`\`typescript
// Scoped providers for better performance
// app/(tabs)/_layout.tsx
export default function TabsLayout() {
  return (
    <TabSpecificProvider> {/* Only affects tabs */}
      <Tabs>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </TabSpecificProvider>
  );
}
\`\`\`

### Common Navigation Patterns

If your app starts with tabs where one or more tabs have multiple screens, nesting a stack navigator inside a tab is the recommended approach, resulting in intuitive URLs that scale well to desktop web apps.

\`\`\`
app/
├── (tabs)/
│   ├── _layout.tsx       # Tab navigation
│   ├── home/
│   │   ├── _layout.tsx   # Stack for home tab
│   │   ├── index.tsx     # Home screen
│   │   └── details.tsx   # Details screen
│   └── profile/
│       ├── _layout.tsx   # Stack for profile tab
│       ├── index.tsx     # Profile screen
│       └── edit.tsx      # Edit profile screen
\`\`\`

## Conclusion

React Native with Expo Router is recommended by Expo for new apps due to its automatic deep linking, universal app capabilities, and modern file-system routing concepts that work across all platforms. This combination delivers the best developer experience in cross-platform mobile development while maintaining native performance and capabilities.`,
  urls: [
    { title: "React Native Documentation", url: "https://reactnative.dev" },
    { title: "Expo Router Documentation", url: "https://docs.expo.dev/router/introduction" },
    { title: "Expo Official Website", url: "https://expo.dev" },
    { title: "React Navigation", url: "https://reactnavigation.org" }
  ],
  keyFeatures: [
    { title: "File-System Routing", description: "Next.js-style routing for mobile apps" },
    { title: "Universal Apps", description: "Single codebase for iOS, Android, and Web" },
    { title: "Deep Linking", description: "Automatic URL generation for every screen" },
    { title: "Over-the-Air Updates", description: "Instant bug fixes without app store delays" },
    { title: "Native Performance", description: "True native components and performance" },
    { title: "TypeScript Support", description: "Full type safety across navigation" }
  ],
  tags: ["React Native", "Expo Router", "Mobile Development", "Cross-Platform", "iOS", "Android"],
  wordCount: 581,
  qualityScore: 75,
  published: true,
  slug: "react-native-expo-router-ultimate-mobile-development",
  readingTime: 15,
};

// Article 10: Playwright
const article10 = {
  id: "playwright-ultimate-e2e-testing-framework",
  title: "Playwright: The Ultimate End-to-End Testing Framework for Modern Web Applications",
  description: "Master Playwright's revolutionary approach to browser automation and testing with cross-browser support, advanced debugging capabilities, and CI/CD integration that transforms quality assurance workflows.",
  category: "Testing",
  date: "2025-09-09",
  content: `# Playwright: The Ultimate End-to-End Testing Framework for Modern Web Applications

The landscape of web application testing has been revolutionized by Microsoft's Playwright, a next-generation browser automation framework that addresses the critical challenges developers face when ensuring application quality across multiple browsers and devices. Unlike traditional testing tools that struggle with modern web complexities, Playwright provides a unified API for automating Chromium, Firefox, and Safari with reliability that makes flaky tests a thing of the past.

## Executive Summary

Playwright represents a paradigm shift in end-to-end testing, moving beyond the limitations of legacy frameworks toward a modern, developer-centric approach that treats cross-browser testing as a first-class citizen. Built from the ground up by the team that created Puppeteer, Playwright combines the reliability of native browser automation with the developer experience expected in modern development workflows.

What sets Playwright apart is its comprehensive approach to testing challenges that have plagued developers for years:
- **Multi-browser support** with a single API across Chromium, Firefox, and Safari (WebKit)
- **Auto-waiting capabilities** that eliminate the need for manual waits and sleeps
- **Network interception** for testing offline scenarios and API mocking
- **Visual regression testing** with pixel-perfect screenshot comparisons
- **Parallel execution** across browsers and test files for maximum speed
- **Mobile device simulation** with accurate viewport and touch emulation
- **Test isolation** with browser contexts equivalent to brand new browser profiles

## 2025 Cross-Browser Testing Excellence

### Unified API Across All Browsers

Unlike other tools like Selenium which require separate scripts for each browser, Playwright uses a single API. This saves time and reduces complexity by letting you write a test once and run it everywhere - Chromium, Firefox, and WebKit (Safari's engine), both in desktop and mobile modes.

\`\`\`typescript
import { test, devices } from '@playwright/test';

// Configure projects for all browsers
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
\`\`\`

### Auto-Wait: Eliminating Flaky Tests

Playwright automatically waits for the UI to be ready, reducing the need for explicit wait code. The combination of auto-wait and actionability checks eliminates the need for artificial timeouts - a primary cause of flaky tests.

### Parallel Test Execution at Scale

Playwright supports the execution of simultaneous tests (parallel testing) through Browser Context and can run parallel tests with multiple browsers. This scales up testing and comes in handy when multiple web pages must be tested simultaneously.

\`\`\`typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
});
\`\`\`

### Network Interception for Comprehensive Testing

Playwright provides powerful network interception capabilities, allowing you to intercept and modify network requests and responses during test execution. This feature is useful for testing scenarios involving APIs, mocking responses, simulating network conditions, or bypassing authentication mechanisms.

### Power Tools for 2025

Playwright includes powerful debugging and development tools:

**Trace Viewer**: Visual timeline of test execution with snapshots and network activity
**Inspector Mode**: Step-by-step debugging with browser DevTools integration
**Codegen**: Automatic test generation by recording user interactions
**Snapshot Testing**: Visual and DOM snapshot comparisons for regression testing

## Conclusion

Playwright has established itself as a modern, efficient cross-browser testing framework in 2025, with continuous updates and features that address common testing challenges like flakiness, speed, and maintenance overhead. Its unified API, auto-wait mechanisms, and comprehensive tooling make it the ideal choice for teams serious about quality assurance.`,
  urls: [
    { title: "Playwright Official Website", url: "https://playwright.dev" },
    { title: "Playwright Documentation", url: "https://playwright.dev/docs/intro" },
    { title: "Playwright GitHub", url: "https://github.com/microsoft/playwright" },
    { title: "Testing Best Practices", url: "https://playwright.dev/docs/best-practices" }
  ],
  keyFeatures: [
    { title: "Cross-Browser Testing", description: "Single API for Chromium, Firefox, and WebKit" },
    { title: "Auto-Wait Mechanism", description: "Automatic waiting eliminates flaky tests" },
    { title: "Network Interception", description: "Mock APIs and simulate network conditions" },
    { title: "Parallel Execution", description: "Run tests concurrently across browsers" },
    { title: "Visual Regression", description: "Pixel-perfect screenshot comparisons" },
    { title: "Developer Tools", description: "Trace viewer, inspector, and code generator" }
  ],
  tags: ["Playwright", "E2E Testing", "Cross-Browser Testing", "Automation", "Quality Assurance"],
  wordCount: 610,
  qualityScore: 78,
  published: true,
  slug: "playwright-ultimate-e2e-testing-framework",
  readingTime: 16,
};

async function uploadBatch2C() {
  console.log('🚀 Starting Batch 2C Upload - Articles 7-10 (FIXED)');
  console.log('================================================\n');

  const articles = [article7, article8, article9, article10];
  const results = [];

  for (const article of articles) {
    try {
      console.log(`📝 Uploading: ${article.title}`);
      console.log(`   ID: ${article.id}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Word Count: ${article.wordCount} words`);
      console.log(`   Quality Score: ${article.qualityScore}/100`);
      console.log(`   Reading Time: ${article.readingTime} min`);

      const result = await client.mutation(api.articles.createArticle, article);

      console.log(`✅ Successfully uploaded: ${article.id}`);
      console.log(`   Article ID: ${result}\n`);

      results.push({ id: article.id, _id: result, status: 'success' });
    } catch (error: any) {
      console.error(`❌ Error uploading ${article.id}:`, error);
      results.push({ id: article.id, error: error.message, status: 'failed' });
    }
  }

  console.log('\n================================================');
  console.log('📊 Batch 2C Upload Summary');
  console.log('================================================');
  console.log(`Total articles: ${articles.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);
  console.log('\n✨ Batch 2C upload complete!');

  return results;
}

// Run the upload
uploadBatch2C()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

export { uploadBatch2C };
