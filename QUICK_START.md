# Convex Quick Start Guide

## 1. Initialize Convex (First Time Only)

```bash
cd /Users/bennettkautz/Desktop/projects/tech-blog/tech-blog-app
npm run convex:dev
```

Follow the prompts to:
- Log in or create a Convex account
- Create a new project
- Copy the deployment URL

## 2. Configure Environment Variables

Create `.env.local` file:

```env
CONVEX_DEPLOYMENT=your-deployment-name:xxxxx
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
REVALIDATION_SECRET=your-random-secret
```

## 3. Validate Test Articles

```bash
npm run migrate:validate
```

Expected output:
- 2 test articles validated
- Quality scores displayed
- No errors

## 4. Upload Test Articles

```bash
npm run migrate:test
```

Expected output:
- Progress bar showing upload
- Migration report with 2 successful uploads

## 5. Verify in Dashboard

Visit: https://dashboard.convex.dev
- Navigate to your project
- Click "Data" tab
- Verify 2 articles in "articles" table

## 6. Update Next.js App

Add ConvexClientProvider to your layout:

```tsx
// app/layout.tsx
import { ConvexClientProvider } from "@/components/convex-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

## 7. Test Queries

Create a test component:

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function TestArticles() {
  const articles = useQuery(api.articles.getAllArticles);

  return (
    <div>
      <h2>Articles: {articles?.length || 0}</h2>
      {articles?.map(a => <div key={a.id}>{a.title}</div>)}
    </div>
  );
}
```

## Troubleshooting

**Can't find convex/_generated**
→ Make sure `npm run convex:dev` is running

**Environment variable not set**
→ Check `.env.local` exists with correct URLs

**Migration fails**
→ Check Convex dashboard is accessible
→ Verify network connection

## Next Steps

Once test articles are working:
1. Read CONVEX_SETUP.md for detailed documentation
2. Prepare remaining 56 articles for migration
3. Create production migration script
4. Execute full migration (Phase 2)

## Useful Commands

```bash
# Development
npm run convex:dev        # Start Convex dev server
npm run dev               # Start Next.js dev server

# Migration
npm run migrate:validate  # Validate articles
npm run migrate:test      # Upload test articles

# Deployment
npm run convex:deploy     # Deploy to production
```

## File Structure

```
tech-blog-app/
├── convex/
│   ├── _generated/       # Auto-generated (do not edit)
│   ├── schema.ts         # Database schema
│   ├── articles.ts       # Query & mutation functions
│   └── tsconfig.json     # Convex TypeScript config
├── lib/
│   └── migrate-to-convex.ts  # Migration utilities
├── scripts/
│   └── migrate-articles.ts   # CLI migration script
├── components/
│   └── convex-provider.tsx   # React provider
├── .env.local           # Environment variables
├── CONVEX_SETUP.md      # Detailed documentation
└── QUICK_START.md       # This file
```

## Support

- Full Documentation: See CONVEX_SETUP.md
- Convex Docs: https://docs.convex.dev
- Discord: https://convex.dev/community
