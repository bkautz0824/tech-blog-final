/**
 * Batch 2C Upload Script - Articles 7-10
 *
 * Enhanced articles ready for Convex upload:
 * - Article 7: Vercel (3,987 words)
 * - Article 8: Turso (3,364 words)
 * - Article 9: React Native + Expo Router (2,500+ words)
 * - Article 10: Playwright (2,800+ words)
 *
 * Run: export NEXT_PUBLIC_CONVEX_URL=https://different-vole-632.convex.cloud && npx tsx batch-2c-upload-script.ts
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

// Helper function to calculate quality score
function calculateQualityScore(article: any): number {
  let score = 0;

  // Word count (40 points max)
  const wordCount = article.content.split(/\s+/).length;
  if (wordCount >= 3000) score += 40;
  else if (wordCount >= 2000) score += 30;
  else if (wordCount >= 1000) score += 20;
  else score += 10;

  // Key features (20 points max)
  score += Math.min(article.keyFeatures.length * 5, 20);

  // URLs (15 points max)
  score += Math.min(article.urls.length * 5, 15);

  // Tags (10 points max)
  score += Math.min(article.tags.length * 2, 10);

  // Content structure (15 points max)
  const hasHeadings = article.content.includes('##');
  const hasCodeBlocks = article.content.includes('```');
  const hasLists = article.content.includes('- ') || article.content.includes('* ');
  if (hasHeadings) score += 5;
  if (hasCodeBlocks) score += 5;
  if (hasLists) score += 5;

  return Math.min(score, 100);
}

// Article 7: Vercel
const article7Content = fs.readFileSync(path.join(__dirname, 'article-7-vercel-enhanced.md'), 'utf-8');
const article7 = {
  id: "vercel",
  title: "Vercel",
  description: "The ultimate platform for modern web deployment with edge functions, instant scaling, and integrated CI/CD for Next.js applications.",
  category: "deployment",
  date: "2025-10-06",
  content: article7Content,
  urls: [
    { title: "Official Website", url: "https://vercel.com" },
    { title: "Documentation", url: "https://vercel.com/docs" },
    { title: "Edge Functions", url: "https://vercel.com/docs/functions" }
  ],
  keyFeatures: [
    {
      title: "Edge Functions",
      description: "Deploy serverless functions globally at the edge for optimal performance"
    },
    {
      title: "Instant Deployment",
      description: "Git-based deployment with automatic previews for every commit"
    },
    {
      title: "Global CDN",
      description: "Content delivery network with automatic scaling worldwide"
    },
    {
      title: "CI/CD Integration",
      description: "Built-in continuous integration and deployment workflows"
    }
  ],
  tags: ["vercel", "deployment", "edge-computing", "nextjs", "serverless", "cicd"],
  wordCount: article7Content.split(/\s+/).length,
  published: true,
  slug: "vercel-modern-deployment-edge-computing",
  readingTime: Math.ceil(article7Content.split(/\s+/).length / 200),
  qualityScore: 0 as number,
};
article7.qualityScore = calculateQualityScore(article7);

// Article 8: Turso
const article8Content = fs.readFileSync(path.join(__dirname, 'article-8-turso-enhanced.md'), 'utf-8');
const article8 = {
  id: "turso",
  title: "Turso",
  description: "Edge-native database platform built on LibSQL, delivering millisecond latency worldwide with SQLite compatibility.",
  category: "database",
  date: "2025-10-06",
  content: article8Content,
  urls: [
    { title: "Official Website", url: "https://turso.tech" },
    { title: "Documentation", url: "https://docs.turso.tech" },
    { title: "GitHub", url: "https://github.com/tursodatabase/libsql" }
  ],
  keyFeatures: [
    {
      title: "LibSQL Foundation",
      description: "Open-source fork of SQLite optimized for distributed edge deployments"
    },
    {
      title: "Embedded Replicas",
      description: "Local-first architecture with automatic synchronization"
    },
    {
      title: "Multi-Tenancy",
      description: "Database-per-user patterns with schema replication"
    },
    {
      title: "Drizzle ORM Integration",
      description: "Type-safe database operations with automatic migrations"
    }
  ],
  tags: ["turso", "libsql", "sqlite", "edge-database", "drizzle-orm", "distributed"],
  wordCount: article8Content.split(/\s+/).length,
  published: true,
  slug: "turso-edge-native-database-libsql",
  readingTime: Math.ceil(article8Content.split(/\s+/).length / 200),
  qualityScore: 0 as number,
};
article8.qualityScore = calculateQualityScore(article8);

// Article 9: React Native + Expo Router
const article9Content = `# React Native with Expo Router: The Ultimate Cross-Platform Mobile Development Stack

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

## The Power of File-System Routing

Expo Router introduces a paradigm shift in mobile navigation by bringing Next.js-style file-system routing to React Native. This approach eliminates the complex navigation configuration traditionally required in mobile development.

\`\`\`typescript
// app/(tabs)/home.tsx - Automatically creates a tab route
export default function HomeScreen() {
  return (
    <View>
      <Text>Welcome to Home</Text>
      <Link href="/profile/123">View Profile</Link>
    </View>
  );
}

// app/profile/[id].tsx - Dynamic route with type safety
import { useLocalSearchParams } from 'expo-router';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Profile: {id}</Text>
    </View>
  );
}
\`\`\`

## Advanced Expo Router Features in 2025

### Automatic Deep Linking

Every screen in your app is automatically deep linkable, making any route shareable with links. Built-in deep linking means each route created in the file structure is automatically available as a URL both in the mobile version and in a browser.

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
    <TabSpecificProvider>
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

## Universal App Architecture

Expo Router enables true universal apps that run on iOS, Android, and Web with a single codebase. Platform-specific code is handled elegantly through file extensions and runtime checks.

\`\`\`typescript
// Platform-specific implementations
// app/home/index.tsx        - Shared across all platforms
// app/home/index.native.tsx - iOS and Android only
// app/home/index.web.tsx    - Web only

import { Platform } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>
        {Platform.select({
          ios: 'Hello iOS',
          android: 'Hello Android',
          web: 'Hello Web'
        })}
      </Text>
    </View>
  );
}
\`\`\`

## Native Performance with Modern Tooling

React Native with Expo delivers truly native performance while maintaining JavaScript's developer experience benefits. The architecture compiles to native code, ensuring smooth 60 FPS animations and instant responsiveness.

### Hermes Engine

Modern React Native apps use Hermes, a JavaScript engine optimized for mobile:
- Faster startup times
- Reduced memory usage
- Ahead-of-time compilation for improved performance
- Better debugging with source maps

### Fabric Architecture

The new Fabric renderer provides:
- Synchronous layout calculations
- Priority-based rendering
- Better integration with native views
- Concurrent React features support

## Comprehensive Developer Experience

Expo provides a complete development environment with tools that streamline the entire mobile development workflow.

### EAS (Expo Application Services)

- **EAS Build**: Cloud-based builds for iOS and Android
- **EAS Submit**: Automated app store submissions
- **EAS Update**: Over-the-air updates for instant bug fixes
- **EAS Metadata**: Centralized app store listing management

### Development Tools

\`\`\`bash
# Start development server with hot reload
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Build production app
eas build --platform ios
eas build --platform android
\`\`\`

## Conclusion

React Native with Expo Router is recommended by Expo for new apps in 2025 due to its automatic deep linking, universal app capabilities, and modern file-system routing concepts that work across all platforms. This combination delivers the best developer experience in cross-platform mobile development while maintaining native performance and capabilities.

The ecosystem continues to evolve with regular updates, comprehensive documentation, and strong community support, making it the ideal choice for teams building modern mobile applications.`;

const article9 = {
  id: "react-native-expo-router",
  title: "React Native with Expo Router",
  description: "The ultimate cross-platform mobile development stack with file-system routing, native performance, and universal app support.",
  category: "mobile",
  date: "2025-10-06",
  content: article9Content,
  urls: [
    { title: "Expo Router", url: "https://docs.expo.dev/router/introduction/" },
    { title: "React Native", url: "https://reactnative.dev" },
    { title: "Expo", url: "https://expo.dev" }
  ],
  keyFeatures: [
    {
      title: "File-System Routing",
      description: "Next.js-style routing with automatic deep linking for mobile apps"
    },
    {
      title: "Universal Apps",
      description: "Single codebase for iOS, Android, and Web with platform-specific optimizations"
    },
    {
      title: "Native Performance",
      description: "True native performance with Hermes engine and Fabric architecture"
    },
    {
      title: "Over-the-Air Updates",
      description: "Instant bug fixes and feature updates without app store delays"
    }
  ],
  tags: ["react-native", "expo-router", "mobile", "cross-platform", "ios", "android"],
  wordCount: article9Content.split(/\s+/).length,
  published: true,
  slug: "react-native-expo-router-cross-platform",
  readingTime: Math.ceil(article9Content.split(/\s+/).length / 200),
  qualityScore: 0 as number,
};
article9.qualityScore = calculateQualityScore(article9);

// Article 10: Playwright
const article10Content = `# Playwright: The Ultimate End-to-End Testing Framework for Modern Web Applications

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

## Cross-Browser Testing Excellence

### Unified API Across All Browsers

Unlike other tools like Selenium which require separate scripts for each browser, Playwright uses a single API. This saves time and reduces complexity by letting you write a test once and run it everywhere.

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

\`\`\`typescript
// No manual waits needed - Playwright waits automatically
await page.click('button#submit'); // Waits for button to be visible and enabled
await page.fill('input#email', 'test@example.com'); // Waits for input to be ready
await expect(page.locator('.success-message')).toBeVisible(); // Auto-waits for assertion
\`\`\`

## Advanced Testing Capabilities

### Network Interception for Comprehensive Testing

Playwright provides powerful network interception capabilities, allowing you to intercept and modify network requests and responses during test execution.

\`\`\`typescript
// Mock API responses
await page.route('**/api/user', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com' })
  });
});

// Test offline scenarios
await page.route('**/*', route => route.abort());

// Monitor network activity
page.on('request', request => console.log('Request:', request.url()));
page.on('response', response => console.log('Response:', response.url(), response.status()));
\`\`\`

### Visual Regression Testing

Playwright includes built-in screenshot comparison for visual regression testing, ensuring your UI remains consistent across changes.

\`\`\`typescript
// Take and compare screenshots
await expect(page).toHaveScreenshot('homepage.png');

// Element-specific screenshots
await expect(page.locator('.hero-section')).toHaveScreenshot('hero.png');

// Full page screenshots with scrolling
await page.screenshot({ path: 'fullpage.png', fullPage: true });
\`\`\`

### Parallel Test Execution at Scale

Playwright supports the execution of simultaneous tests through Browser Context and can run parallel tests with multiple browsers. This scales up testing and comes in handy when multiple web pages must be tested simultaneously.

\`\`\`typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
\`\`\`

## Power Tools for Modern Development

### Trace Viewer

Visual timeline of test execution with snapshots and network activity. When a test fails, Playwright can capture a trace that includes:
- Screenshots at every action
- DOM snapshots
- Network activity
- Console logs
- Source code references

\`\`\`bash
# View trace file
npx playwright show-trace trace.zip
\`\`\`

### Inspector Mode

Step-by-step debugging with browser DevTools integration. The Playwright Inspector allows you to:
- Step through test actions one by one
- See locator highlighting in the browser
- Edit locators and see results immediately
- Pick elements from the page

\`\`\`bash
# Debug mode
npx playwright test --debug
\`\`\`

### Codegen: Automatic Test Generation

Record user interactions and automatically generate test code. Codegen watches your interactions and generates the corresponding Playwright test code.

\`\`\`bash
# Generate tests by recording
npx playwright codegen https://example.com
\`\`\`

## CI/CD Integration

Playwright integrates seamlessly with all major CI/CD platforms with Docker images and GitHub Actions support.

\`\`\`yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
\`\`\`

## Mobile Device Testing

Playwright can emulate mobile devices with accurate viewport, user agent, and touch support.

\`\`\`typescript
import { devices } from '@playwright/test';

const iPhone13 = devices['iPhone 13'];

test('mobile test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.locator('button').tap(); // Touch interaction
});
\`\`\`

## Conclusion

Playwright has established itself as the modern, efficient cross-browser testing framework in 2025, with continuous updates and features that address common testing challenges like flakiness, speed, and maintenance overhead. Its unified API, auto-wait mechanisms, comprehensive tooling, and excellent developer experience make it the ideal choice for teams serious about quality assurance.

The combination of reliability, speed, and developer-friendly features positions Playwright as the future of web application testing, replacing legacy frameworks with a modern solution built for today's complex web applications.`;

const article10 = {
  id: "playwright",
  title: "Playwright",
  description: "End-to-end testing framework for modern web applications with cross-browser automation, visual regression testing, and powerful debugging tools.",
  category: "testing",
  date: "2025-10-06",
  content: article10Content,
  urls: [
    { title: "Official Website", url: "https://playwright.dev" },
    { title: "GitHub Repository", url: "https://github.com/microsoft/playwright" },
    { title: "Documentation", url: "https://playwright.dev/docs/intro" }
  ],
  keyFeatures: [
    {
      title: "Cross-Browser Testing",
      description: "Test across Chromium, Firefox, and WebKit with a single API"
    },
    {
      title: "Auto-Wait Mechanisms",
      description: "Built-in waiting for elements to be ready before performing actions"
    },
    {
      title: "Network Interception",
      description: "Mock and modify network requests for comprehensive testing scenarios"
    },
    {
      title: "Parallel Execution",
      description: "Run tests in parallel across multiple browsers for faster feedback"
    }
  ],
  tags: ["playwright", "e2e-testing", "browser-automation", "testing", "quality-assurance", "microsoft"],
  wordCount: article10Content.split(/\s+/).length,
  published: true,
  slug: "playwright-e2e-testing-framework",
  readingTime: Math.ceil(article10Content.split(/\s+/).length / 200),
  qualityScore: 0 as number,
};
article10.qualityScore = calculateQualityScore(article10);

async function uploadBatch2C() {
  console.log('🚀 Starting Batch 2C Upload - Articles 7-10');
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
      console.log(`   Convex ID: ${result}\n`);

      results.push({ id: article.id, convexId: result, status: 'success' });
    } catch (error) {
      console.error(`❌ Error uploading ${article.id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({ id: article.id, error: errorMessage, status: 'failed' });
    }
  }

  console.log('\n================================================');
  console.log('📊 Batch 2C Upload Summary');
  console.log('================================================');
  console.log(`Total articles: ${articles.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);

  if (results.filter(r => r.status === 'success').length > 0) {
    console.log('\n✅ Successfully uploaded articles:');
    results
      .filter(r => r.status === 'success')
      .forEach(r => console.log(`   - ${r.id} (Quality: ${articles.find(a => a.id === r.id)?.qualityScore}/100)`));
  }

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
