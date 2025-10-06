#!/usr/bin/env tsx

/**
 * CLI Script for Migrating Articles to Convex
 *
 * Usage:
 *   npm run migrate:test     - Migrate 2 test articles
 *   npm run migrate:batch    - Migrate articles in batches
 *   npm run migrate:all      - Migrate all articles
 *   npm run migrate:validate - Validate articles without uploading
 */

import { migrate } from "../lib/migrate-to-convex";
import * as fs from "fs";
import * as path from "path";

// Sample test articles for initial testing
const testArticles = [
  {
    id: "react-19-concurrent-features",
    title: "React 19: Mastering Concurrent Features",
    description:
      "A comprehensive guide to React 19's concurrent rendering capabilities, including transitions, suspense, and performance optimization strategies.",
    category: "Frontend",
    date: "2024-03-15",
    content: `# React 19: Mastering Concurrent Features

React 19 introduces powerful concurrent rendering features that transform how we build performant applications.

## Understanding Concurrent Rendering

Concurrent rendering allows React to interrupt rendering work to handle high-priority updates. This means your app stays responsive even during expensive operations.

### Key Concepts

1. **Transitions**: Mark updates as non-urgent
2. **Suspense**: Handle async operations declaratively
3. **Streaming SSR**: Send HTML to the client progressively

## Using Transitions

\`\`\`jsx
import { useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  return (
    <div>
      <input onChange={handleChange} />
      {isPending ? <Spinner /> : <Results query={query} />}
    </div>
  );
}
\`\`\`

## Suspense for Data Fetching

React 19 makes Suspense work seamlessly with data fetching:

\`\`\`jsx
function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
      <UserPosts />
    </Suspense>
  );
}
\`\`\`

## Performance Best Practices

- Use transitions for filtering, sorting, and navigation
- Combine Suspense with streaming SSR for faster perceived load times
- Profile your app with React DevTools Profiler

## Conclusion

React 19's concurrent features enable building highly responsive applications that feel instant to users.`,
    urls: [
      {
        title: "React 19 Official Documentation",
        url: "https://react.dev/blog/2024/02/15/react-19",
      },
      {
        title: "Concurrent Rendering Deep Dive",
        url: "https://react.dev/learn/concurrent-rendering",
      },
      {
        title: "useTransition Hook Reference",
        url: "https://react.dev/reference/react/useTransition",
      },
    ],
    keyFeatures: [
      {
        title: "Concurrent Rendering",
        description:
          "Interruptible rendering for responsive applications even during expensive updates",
      },
      {
        title: "Automatic Batching",
        description:
          "React automatically batches multiple state updates for optimal performance",
      },
      {
        title: "Improved Suspense",
        description:
          "Enhanced Suspense boundaries with better data fetching integration",
      },
      {
        title: "Streaming SSR",
        description:
          "Send HTML progressively for faster perceived load times",
      },
    ],
    tags: ["React", "JavaScript", "Performance", "Frontend", "Concurrent"],
    wordCount: 487,
  },
  {
    id: "typescript-5-decorators",
    title: "TypeScript 5: ECMAScript Decorators Guide",
    description:
      "Learn how to use ECMAScript decorators in TypeScript 5 for elegant meta-programming patterns.",
    category: "TypeScript",
    date: "2024-03-10",
    content: `# TypeScript 5: ECMAScript Decorators Guide

TypeScript 5 brings official support for ECMAScript decorators, enabling powerful meta-programming capabilities.

## What are Decorators?

Decorators are special functions that can modify classes, methods, properties, and parameters at design time.

## Class Decorators

\`\`\`typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}
\`\`\`

## Method Decorators

\`\`\`typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${propertyKey} with:\`, args);
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
\`\`\`

## Common Use Cases

1. **Logging and debugging**
2. **Validation**
3. **Dependency injection**
4. **Authentication and authorization**

## Best Practices

- Keep decorators simple and focused
- Document decorator behavior clearly
- Consider performance implications`,
    urls: [
      {
        title: "TypeScript 5.0 Release Notes",
        url: "https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/",
      },
      {
        title: "Decorators Proposal",
        url: "https://github.com/tc39/proposal-decorators",
      },
    ],
    keyFeatures: [
      {
        title: "ECMAScript Decorators",
        description:
          "Official support for the stage 3 ECMAScript decorators proposal",
      },
      {
        title: "Type Safety",
        description:
          "Full type checking for decorator parameters and return values",
      },
    ],
    tags: ["TypeScript", "Decorators", "Meta-programming"],
    wordCount: 298,
  },
];

/**
 * Display progress bar
 */
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

/**
 * Test migration with sample articles
 */
async function testMigration() {
  console.log("Starting test migration...\n");
  console.log(`Uploading ${testArticles.length} test articles:\n`);

  testArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   Category: ${article.category}`);
    console.log(`   Word Count: ${article.wordCount}`);
    console.log(`   Tags: ${article.tags.join(", ")}\n`);
  });

  const stats = await migrate.batchUploadArticles(testArticles, showProgress);

  console.log("\n" + migrate.generateMigrationReport(stats));
}

/**
 * Validate articles without uploading
 */
async function validateArticles() {
  console.log("Validating test articles...\n");

  testArticles.forEach((article) => {
    const validation = migrate.validateArticle(article);
    const prepared = migrate.prepareArticle(article);

    console.log(`Article: ${article.id}`);
    console.log(`Valid: ${validation.valid ? "✓" : "✗"}`);

    if (!validation.valid) {
      console.log(`Errors:`);
      validation.errors.forEach((error) => console.log(`  - ${error}`));
    } else {
      console.log(`Quality Score: ${prepared.qualityScore}/100`);
      console.log(`Reading Time: ${prepared.readingTime} min`);
      console.log(`Slug: ${prepared.slug}`);
    }
    console.log("");
  });
}

/**
 * Main CLI handler
 */
async function main() {
  const command = process.argv[2] || "help";

  switch (command) {
    case "test":
      await testMigration();
      break;

    case "validate":
      await validateArticles();
      break;

    case "help":
    default:
      console.log(`
Tech Blog Convex Migration Tool
================================

Commands:
  test      - Upload 2 test articles to Convex
  validate  - Validate test articles without uploading

Usage:
  npm run migrate:test
  npm run migrate:validate

Make sure you have:
1. Set up Convex with 'npx convex dev'
2. Added NEXT_PUBLIC_CONVEX_URL to .env.local
      `);
      break;
  }
}

// Run CLI
main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
