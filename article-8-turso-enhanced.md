# Turso: The Edge-Native Database Revolution with LibSQL

The database landscape is undergoing a fundamental transformation as applications demand global performance with local responsiveness. At the forefront of this revolution stands Turso, an edge-native database platform that combines the simplicity of SQLite with the power of distributed computing to deliver sub-10ms database queries anywhere in the world. Built on LibSQL—a SQLite-compatible database designed for the edge—Turso enables developers to deploy databases globally without sacrificing consistency or increasing complexity.

## Executive Summary

Turso represents a paradigm shift in database architecture, moving away from traditional centralized databases toward a distributed, edge-native approach that brings data as close to users as possible. This revolutionary platform enables unlimited databases for multi-tenancy and AI contexts, allowing you to easily scale your backend by provisioning a dedicated database for each tenant, user, or individual AI context, scaling to millions of instances programmatically.

Unlike traditional databases that require complex sharding strategies and eventual consistency trade-offs, Turso provides ACID transactions with global replication through embedded replicas. This innovative architecture enables developers to have a replicated database inside their app with microsecond SQLite reads and automatic cloud sync, eliminating the latency bottlenecks that plague modern distributed applications.

Key innovations include:
- **LibSQL foundation** - Open source, open contribution fork of SQLite
- **Embedded replicas** - Microsecond reads with zero network latency
- **Database per user** - Unlimited databases for true multi-tenancy
- **Multi-DB schemas** - Centralized schema management across thousands of databases
- **Native vector search** - Built-in similarity search for AI applications
- **Offline-first capabilities** - Local writes that sync automatically to cloud
- **Drizzle ORM integration** - Type-safe database queries with TypeScript

## The LibSQL Foundation

### SQLite-Compatible Innovation

LibSQL maintains full compatibility with SQLite while adding enterprise-grade features necessary for modern edge computing. As an open source, open contribution fork of SQLite, LibSQL offers enhanced functionality compared to standard SQLite, including more ALTER statements for easier schema management and native vector search capabilities.

```sql
-- Standard SQLite queries work perfectly
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata JSON
);

-- LibSQL enhancements: JSON support
INSERT INTO users (email, name, metadata)
VALUES (
  'user@example.com',
  'John Doe',
  json_object('role', 'admin', 'preferences', json_object('theme', 'dark'))
);

-- Query JSON fields
SELECT
  name,
  json_extract(metadata, '$.role') as role,
  json_extract(metadata, '$.preferences.theme') as theme
FROM users
WHERE json_extract(metadata, '$.role') = 'admin';

-- Enhanced ALTER statements for schema evolution
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users DROP COLUMN old_field;
ALTER TABLE users RENAME COLUMN email TO email_address;
```

### Advanced LibSQL Features

LibSQL extends SQLite with powerful capabilities designed for distributed edge computing:

```sql
-- Native Vector Search for AI applications
CREATE TABLE embeddings (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  vector F32_BLOB(1536) -- 1536-dimensional vector
);

-- Create vector index for fast similarity search
CREATE INDEX embeddings_vector_idx ON embeddings(vector);

-- Similarity search query
SELECT
  id,
  content,
  vector_distance_cos(vector, ?) as distance
FROM embeddings
WHERE vector_top_k(vector, ?, 10)
ORDER BY distance;

-- Point-in-time recovery
CREATE DATABASE my_db WITH (
  retention_period = '7 days',
  snapshot_interval = '1 hour'
);

-- Restore to specific timestamp
RESTORE DATABASE my_db TO TIMESTAMP '2025-01-15 12:00:00';

-- Database branching for development
CREATE DATABASE staging FROM production AT TIMESTAMP '2025-01-15 00:00:00';
```

### Why SQLite Compatibility Matters

SQLite's lightweight architecture, proven reliability, and zero-configuration approach make it ideal for edge computing. Turso leverages SQLite's strengths while adding distributed capabilities:

- **Single file database** - Easy to reason about and deploy
- **ACID compliance** - Full transaction support without complexity
- **Wide platform support** - Runs on any device or platform
- **Battle-tested reliability** - Used by billions of devices worldwide
- **Minimal resource requirements** - Efficient memory and CPU usage
- **Rich ecosystem** - Extensive tooling and ORM support

## Embedded Replicas: Local-First Architecture

### Understanding Embedded Replicas

Turso's Embedded Replicas deliver microsecond SQLite reads with cloud sync, enabling you to build faster, more resilient applications for mobile, edge, and AI with zero-latency local access and automatic data sync. Embedded Replicas work by maintaining a local SQLite file that you can read from with zero network latency.

```typescript
// Initialize Turso client with embedded replica
import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:local.db', // Local SQLite file
  syncUrl: process.env.TURSO_DATABASE_URL, // Cloud database
  authToken: process.env.TURSO_AUTH_TOKEN,
  syncInterval: 60, // Sync every 60 seconds
});

// Automatic synchronization
await client.sync(); // Manually trigger sync

// Read queries use local replica - zero latency
const users = await client.execute('SELECT * FROM users WHERE active = true');

// Write queries sync to cloud automatically
await client.execute({
  sql: 'INSERT INTO users (email, name) VALUES (?, ?)',
  args: ['user@example.com', 'John Doe'],
});

// Embedded replica ensures writes are available immediately locally
const newUser = await client.execute('SELECT * FROM users WHERE email = ?', ['user@example.com']);
```

### Offline-First Capabilities

Turso's embedded replicas support offline writes that are later synchronized to the cloud, enabling truly resilient applications that work regardless of network connectivity.

```typescript
// Configure offline-first database
const client = createClient({
  url: 'file:app.db',
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  encryptionKey: process.env.ENCRYPTION_KEY, // Optional: encrypt local DB
});

// Application works offline
async function saveUserData(userId: string, data: any) {
  try {
    // Write to local database immediately
    await client.execute({
      sql: 'INSERT INTO user_data (user_id, data, synced) VALUES (?, ?, false)',
      args: [userId, JSON.stringify(data)],
    });

    // Attempt sync to cloud
    await client.sync();

    // Mark as synced if successful
    await client.execute({
      sql: 'UPDATE user_data SET synced = true WHERE user_id = ?',
      args: [userId],
    });
  } catch (error) {
    // If sync fails, data remains in local database
    console.log('Offline - will sync later');
  }
}

// Background sync when connection restored
setInterval(async () => {
  try {
    await client.sync();
    console.log('Sync successful');
  } catch (error) {
    console.log('Still offline');
  }
}, 30000); // Retry every 30 seconds
```

### DIY Database CDN

Embedded Replicas enable you to create your own database CDN by deploying replicas close to your users across multiple regions:

```typescript
// Deploy embedded replica in each region
const regions = ['us-east', 'us-west', 'eu-central', 'ap-southeast'];

regions.forEach(region => {
  const client = createClient({
    url: `file:${region}.db`,
    syncUrl: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
    syncInterval: 10, // Aggressive sync for data consistency
  });

  // Each region reads from local replica
  app.get(`/${region}/api/data`, async (req, res) => {
    const data = await client.execute('SELECT * FROM products WHERE available = true');
    res.json(data.rows);
  });
});

// Writes go to primary database and sync to all replicas
app.post('/api/data', async (req, res) => {
  await primaryClient.execute({
    sql: 'INSERT INTO products (name, price) VALUES (?, ?)',
    args: [req.body.name, req.body.price],
  });

  // All embedded replicas will receive update on next sync
  res.json({ success: true });
});
```

## Multi-Tenancy: Database Per User Architecture

### Unlimited Databases at Scale

Turso enables per-tenant (user, location, group etc.) databases and opens new platform possibilities. Creating per-user databases in a multi-tenant architecture can significantly enhance both data security, compliance, and can result in an improved experience for developers building complex multi-tenant apps.

```typescript
// Create database per user with Turso API
import { createClient as createTursoClient } from '@libsql/client';

async function createUserDatabase(userId: string) {
  const response = await fetch('https://api.turso.tech/v1/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `user-${userId}`,
      group: 'default',
      schema: 'user-schema', // Reference to shared schema
    }),
  });

  const { database } = await response.json();

  return {
    url: database.hostname,
    authToken: database.auth_token,
  };
}

// Initialize client for user-specific database
async function getUserDatabaseClient(userId: string) {
  const config = await getUserDatabaseConfig(userId);

  return createTursoClient({
    url: config.url,
    authToken: config.authToken,
  });
}

// Each user gets isolated database
app.get('/api/user/:userId/data', async (req, res) => {
  const client = await getUserDatabaseClient(req.params.userId);
  const data = await client.execute('SELECT * FROM user_data');
  res.json(data.rows);
});
```

### Multi-DB Schemas: Centralized Schema Management

Turso Multi-DB Schemas lets you share a single schema across databases — fully managed, so if you need to modify schema, you apply it to the parent schema database, and Turso handles propagating that to all its children.

```typescript
// Create parent schema database
const parentSchema = await fetch('https://api.turso.tech/v1/organizations/my-org/databases', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'user-schema-template',
    is_schema: true,
  }),
});

// Apply schema to parent
const schemaClient = createTursoClient({
  url: 'libsql://user-schema-template.turso.io',
  authToken: process.env.SCHEMA_AUTH_TOKEN,
});

await schemaClient.batch([
  'CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, name TEXT)',
  'CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER, content TEXT)',
  'CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER, content TEXT)',
  'CREATE INDEX idx_posts_user ON posts(user_id)',
  'CREATE INDEX idx_comments_post ON comments(post_id)',
]);

// Create child databases referencing parent schema
async function createTenantDatabase(tenantId: string) {
  const response = await fetch('https://api.turso.tech/v1/organizations/my-org/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `tenant-${tenantId}`,
      schema: 'user-schema-template', // Inherit schema from parent
    }),
  });

  return response.json();
}

// Update schema - propagates to all children automatically
async function updateSchema() {
  await schemaClient.execute('ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');

  // All tenant databases automatically receive schema update
  console.log('Schema updated across all tenant databases');
}
```

### SaaS Multi-Tenancy with Clerk Integration

```typescript
// Multi-tenant SaaS with Clerk + Turso
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get user-specific database
  const client = await getUserDatabaseClient(userId);

  // Query user's isolated data
  const data = await client.execute('SELECT * FROM projects WHERE archived = false');

  return Response.json({ projects: data.rows });
}

export async function POST(request: Request) {
  const { userId } = auth();
  const { name, description } = await request.json();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Write to user's database
  const client = await getUserDatabaseClient(userId);

  await client.execute({
    sql: 'INSERT INTO projects (name, description, created_at) VALUES (?, ?, ?)',
    args: [name, description, new Date().toISOString()],
  });

  return Response.json({ success: true });
}
```

## Drizzle ORM Integration

### Type-Safe Database Queries

Drizzle ORM natively supports the libSQL driver, enabling type-safe database queries with excellent TypeScript integration.

```typescript
// Install dependencies
// npm install drizzle-orm @libsql/client
// npm install -D drizzle-kit

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

// schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'user', 'moderator'] }).notNull().default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => posts.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### Database Client Setup

```typescript
// db/client.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(turso, { schema });
```

### Type-Safe Queries

```typescript
// Type-safe CRUD operations
import { db } from '@/db/client';
import { users, posts, comments } from '@/db/schema';
import { eq, and, desc, like, inArray } from 'drizzle-orm';

// Insert with type safety
export async function createUser(email: string, name: string) {
  const [user] = await db
    .insert(users)
    .values({
      email,
      name,
      createdAt: new Date(),
    })
    .returning();

  return user;
}

// Select with joins
export async function getUserWithPosts(userId: number) {
  return await db
    .select({
      user: users,
      post: posts,
    })
    .from(users)
    .leftJoin(posts, eq(users.id, posts.userId))
    .where(eq(users.id, userId));
}

// Complex queries with type inference
export async function getPublishedPostsWithComments(limit: number = 10) {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      author: users.name,
      authorEmail: users.email,
      commentCount: sql<number>`count(${comments.id})`,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(comments, eq(posts.id, comments.postId))
    .where(eq(posts.published, true))
    .groupBy(posts.id)
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

// Transactions
export async function transferData(fromUserId: number, toUserId: number) {
  await db.transaction(async (tx) => {
    // Update posts
    await tx
      .update(posts)
      .set({ userId: toUserId })
      .where(eq(posts.userId, fromUserId));

    // Update comments
    await tx
      .update(comments)
      .set({ userId: toUserId })
      .where(eq(comments.userId, fromUserId));
  });
}

// Batch operations
export async function batchCreateUsers(userData: Array<{ email: string; name: string }>) {
  const values = userData.map(data => ({
    ...data,
    createdAt: new Date(),
  }));

  return await db.insert(users).values(values).returning();
}
```

### Database Migrations

```bash
# Generate migrations
npx drizzle-kit generate:sqlite

# Push schema changes directly
npx drizzle-kit push:sqlite

# Run migrations
npx drizzle-kit migrate
```

```typescript
// Run migrations programmatically
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './client';

async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed');
}
```

## Advanced Features and Use Cases

### Native Vector Search for AI Applications

Turso's native vector search provides similarity search for AI apps and RAG workflows with no extensions required.

```typescript
// Vector search implementation
import { db } from '@/db/client';

// Store embeddings from OpenAI
export async function storeEmbedding(content: string, embedding: number[]) {
  await db.execute({
    sql: `
      INSERT INTO embeddings (content, vector)
      VALUES (?, vector32(?))
    `,
    args: [content, embedding],
  });
}

// Similarity search
export async function searchSimilar(queryEmbedding: number[], limit: number = 10) {
  const results = await db.execute({
    sql: `
      SELECT
        id,
        content,
        vector_distance_cos(vector, vector32(?)) as similarity
      FROM embeddings
      WHERE vector_top_k(vector, vector32(?), ?)
      ORDER BY similarity DESC
    `,
    args: [queryEmbedding, queryEmbedding, limit],
  });

  return results.rows;
}

// RAG workflow with Turso + OpenAI
export async function ragQuery(question: string) {
  // Generate embedding for question
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });

  const questionEmbedding = embeddingResponse.data[0].embedding;

  // Find similar documents
  const relevantDocs = await searchSimilar(questionEmbedding, 5);

  // Generate answer with context
  const context = relevantDocs.map(doc => doc.content).join('\n\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Answer questions based on this context:\n\n${context}`,
      },
      { role: 'user', content: question },
    ],
  });

  return completion.choices[0].message.content;
}
```

### Analytics for Per-User Databases

```typescript
// Aggregate analytics across all user databases
export async function aggregateUserMetrics() {
  const databases = await listAllUserDatabases();

  const metrics = await Promise.all(
    databases.map(async (dbConfig) => {
      const client = createClient(dbConfig);

      const result = await client.execute(`
        SELECT
          COUNT(*) as total_records,
          SUM(CASE WHEN created_at > datetime('now', '-7 days') THEN 1 ELSE 0 END) as recent_records
        FROM user_data
      `);

      return {
        userId: dbConfig.userId,
        totalRecords: result.rows[0].total_records,
        recentRecords: result.rows[0].recent_records,
      };
    })
  );

  return metrics;
}

// Write aggregated metrics to analytics database
export async function storeAggregatedMetrics(metrics: any[]) {
  const analyticsDb = createClient({
    url: process.env.ANALYTICS_DB_URL!,
    authToken: process.env.ANALYTICS_AUTH_TOKEN!,
  });

  await analyticsDb.batch(
    metrics.map(metric =>
      `INSERT INTO user_metrics (user_id, total_records, recent_records, updated_at)
       VALUES (${metric.userId}, ${metric.totalRecords}, ${metric.recentRecords}, datetime('now'))`
    )
  );
}
```

### Database Branching for Development

```typescript
// Create development branch from production
async function createDevBranch() {
  const response = await fetch('https://api.turso.tech/v1/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'my-app-dev',
      source: 'my-app-production',
      timestamp: new Date().toISOString(), // Point-in-time branch
    }),
  });

  return response.json();
}

// Test migrations on branch before applying to production
async function testMigration() {
  const devDb = createClient({
    url: process.env.DEV_DATABASE_URL!,
    authToken: process.env.DEV_AUTH_TOKEN!,
  });

  // Test migration
  await devDb.execute('ALTER TABLE users ADD COLUMN phone TEXT');

  // Verify migration
  const result = await devDb.execute('PRAGMA table_info(users)');
  console.log('Migration successful:', result.rows);

  // If successful, apply to production
  const prodDb = createClient({
    url: process.env.PROD_DATABASE_URL!,
    authToken: process.env.PROD_AUTH_TOKEN!,
  });

  await prodDb.execute('ALTER TABLE users ADD COLUMN phone TEXT');
}
```

## Performance Optimization and Best Practices

### Query Optimization

```typescript
// Create indexes for fast queries
await db.execute('CREATE INDEX idx_users_email ON users(email)');
await db.execute('CREATE INDEX idx_posts_user_published ON posts(user_id, published)');
await db.execute('CREATE INDEX idx_posts_created ON posts(created_at DESC)');

// Use query planning
const plan = await db.execute('EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?', ['test@example.com']);
console.log('Query plan:', plan.rows);

// Batch operations for efficiency
const batch = [
  'INSERT INTO users (email, name) VALUES (?, ?)',
  'INSERT INTO users (email, name) VALUES (?, ?)',
  'INSERT INTO users (email, name) VALUES (?, ?)',
];

await db.batch(batch);
```

### Connection Pooling and Caching

```typescript
// Connection pooling with better-sqlite3 (for embedded replicas)
import Database from 'better-sqlite3';

const pool = new Map<string, Database.Database>();

function getConnection(userId: string): Database.Database {
  if (!pool.has(userId)) {
    const db = new Database(`user-${userId}.db`);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    pool.set(userId, db);
  }

  return pool.get(userId)!;
}

// Cache frequently accessed data
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function getCachedUser(userId: string) {
  const cacheKey = `user:${userId}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  cache.set(cacheKey, user[0]);

  return user[0];
}
```

### Monitoring and Observability

```typescript
// Database monitoring wrapper
export async function executeWithMetrics<T>(
  operation: string,
  query: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await query();
    const duration = Date.now() - startTime;

    console.log('Query metrics:', {
      operation,
      duration,
      success: true,
      timestamp: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('Query error:', {
      operation,
      duration,
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}

// Usage
const users = await executeWithMetrics('getActiveUsers', () =>
  db.select().from(users).where(eq(users.active, true))
);
```

## Cost Optimization and Platform Changes

### Important 2025 Platform Updates

In 2025, Turso made strategic changes to their platform architecture. After analyzing usage patterns, they found that 70% of Turso users never create geographical replicas. While Turso believes in bringing data close to users, syncing the SQLite file itself to your API or device through embedded replicas is often a better approach than edge replication.

**Key Changes:**
- Edge replicas discontinued for new users
- Focus shifted to embedded replicas for data locality
- Multi-DB schemas for efficient multi-tenancy management
- Enhanced offline-first capabilities with local writes

This architectural shift reflects a more pragmatic approach to edge computing, prioritizing embedded replicas that provide true local-first capabilities over geographical replication.

### Pricing Strategy

```
Starter: Free forever
  - 500 databases
  - 9 GB total storage
  - 1 billion row reads per month
  - 25 million row writes per month

Scaler: $29/month
  - Unlimited databases
  - 100 GB storage included
  - 50 billion row reads per month
  - 100 million row writes per month
  - Priority support

Enterprise: Custom pricing
  - Dedicated support
  - Custom limits
  - SLA guarantees
  - Advanced security features
```

## Real-World Use Cases

### Mobile Apps with Offline Support

```typescript
// React Native app with Turso embedded replica
import { createClient } from '@libsql/client';
import NetInfo from '@react-native-community/netinfo';

const client = createClient({
  url: 'file:app.db',
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Sync when network available
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    client.sync().catch(console.error);
  }
});

// App works offline
export async function saveNote(note: string) {
  await client.execute({
    sql: 'INSERT INTO notes (content, created_at, synced) VALUES (?, ?, false)',
    args: [note, new Date().toISOString()],
  });

  // Sync will happen automatically when online
}
```

### AI Context Management

```typescript
// Per-conversation database for AI context
export async function createConversationDatabase(conversationId: string) {
  const response = await fetch('https://api.turso.tech/v1/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `conversation-${conversationId}`,
      schema: 'conversation-schema',
    }),
  });

  const { database } = await response.json();

  return createClient({
    url: database.hostname,
    authToken: database.auth_token,
  });
}

// Store conversation with embeddings
export async function storeMessage(
  conversationDb: any,
  role: string,
  content: string,
  embedding: number[]
) {
  await conversationDb.execute({
    sql: 'INSERT INTO messages (role, content, vector, timestamp) VALUES (?, ?, vector32(?), ?)',
    args: [role, content, embedding, new Date().toISOString()],
  });
}
```

## Conclusion

Turso represents the future of database architecture for distributed applications. By combining SQLite's reliability and simplicity with powerful distributed capabilities like embedded replicas, multi-DB schemas, and native vector search, Turso enables developers to build applications that are both globally scalable and locally responsive.

The platform's database-per-user architecture unlocks new possibilities for multi-tenant SaaS applications, providing true data isolation and privacy while maintaining centralized schema management. With embedded replicas delivering microsecond read latency and offline-first capabilities, Turso solves the fundamental challenges of distributed data access.

As applications continue to demand lower latency and better offline support, Turso's local-first approach with cloud synchronization provides the best of both worlds: the performance of local databases with the reliability and accessibility of cloud infrastructure. Whether you're building mobile apps, edge computing applications, or AI-powered systems, Turso provides the database foundation for modern distributed applications.
