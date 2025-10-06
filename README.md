# Tech Blog - Modern Development Tools & Insights

A professional Next.js 15 blog showcasing comprehensive technical articles about modern development tools, frameworks, and best practices.

## Features

- **17 Comprehensive Technical Articles** - In-depth guides covering the latest development tools
- **Professional UI/UX** - Retro-futuristic design with theme-aware video backgrounds
- **Optimized Performance** - React Server Components, edge caching, and streaming
- **Fully Responsive** - Mobile-first design with beautiful animations
- **SEO Optimized** - Automatic sitemap, robots.txt, and Open Graph metadata
- **Type-Safe** - Full TypeScript coverage with strict mode

## Tech Stack

- **Framework**: Next.js 15.5+ with App Router & Turbopack
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS 3.4+ with custom design system
- **Typography**: Geist Sans & Geist Mono fonts
- **UI Components**: Custom retro-themed component library
- **Animations**: Framer Motion with CSS animations
- **Deployment**: Optimized for Vercel Edge

## Article Categories

1. **Developer Tools** - Build tools, runtimes, and CLI utilities
2. **React/Frontend** - Modern React frameworks and libraries
3. **AI Tools** - AI-powered development assistants
4. **DevOps/Infrastructure** - Deployment and hosting platforms
5. **Database/Backend** - Modern database solutions
6. **Mobile Development** - Cross-platform mobile frameworks
7. **Testing/Quality** - Testing frameworks and tools
8. **UI/UX** - Component libraries and design systems
9. **3D Graphics** - WebGL and 3D animation tools
10. **Media Processing** - Audio/video AI tools

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/bkautz0824/tech-blog-final.git
cd tech-blog-final

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Available Scripts

```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint with auto-fix
npm run lint:check       # Check linting without fixing
npm run type-check       # Run TypeScript type checking
npm run build:analyze    # Build with bundle analysis
```

## Project Structure

```
tech-blog-app/
├── app/                          # Next.js App Router
│   ├── articles/                # Articles listing & detail pages
│   ├── categories/              # Category browsing page
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles & animations
│   ├── manifest.ts              # PWA manifest
│   ├── robots.ts                # Robots.txt generation
│   └── sitemap.ts               # XML sitemap generation
├── components/                   # React components
│   ├── articles/                # Article-related components
│   ├── hero-section.tsx         # Homepage hero
│   ├── video-background.tsx     # Theme-aware video backgrounds
│   ├── retro-button.tsx         # Custom button components
│   └── theme-provider.tsx       # Theme management
├── lib/                         # Core libraries
│   ├── articles-data.ts         # Article data and utilities
│   ├── articles-server.ts       # Server-side caching layer
│   └── utils.ts                 # Utility functions
├── hooks/                       # Custom React hooks
│   └── use-theme-detection.ts   # Theme detection logic
├── public/                      # Static assets
│   └── videos/                  # Background videos
└── .claude/                     # Claude Code agents
    └── agents/                  # Custom subagents
```

## Adding New Articles

### Using the Technical Content Expander Agent

This project uses a custom Claude Code subagent to generate comprehensive technical articles. Here's how to add new articles:

#### 1. Prepare Your Tool List

Create a markdown file with tools to write about:

```markdown
# Tools Batch [N]

## Tool Name
- Category: [Category Name]
- Target Date: YYYY-MM-DD
- URLs: [Official site, docs, GitHub]
- Description: Brief overview
```

#### 2. Run the Technical Content Expander

```bash
# In Claude Code terminal
/agents technical-content-expander
```

Provide the agent with:
- Tool name and category
- Target date for the article
- Word count requirement (2,000-3,000 words)
- Key topics to cover
- Code example requirements

#### 3. Agent Output Format

The agent will generate articles in this format:

```typescript
{
  id: "unique-slug-for-url",
  title: "Full Article Title",
  description: "Brief 2-3 sentence description",
  category: "Category Name",
  date: "YYYY-MM-DD",
  content: `# Full markdown content...`,
  urls: ["https://...", "https://..."],
  keyFeatures: ["feature1", "feature2", "..."]
}
```

#### 4. Add to articles-data.ts

Copy the generated article object into the `articles` array in `/lib/articles-data.ts`:

```typescript
export const articles: Article[] = [
  // ... existing articles
  {
    // ... new article from agent
  }
]
```

#### 5. Verify and Deploy

```bash
# Type check
npm run type-check

# Build to verify
npm run build

# Deploy
git add .
git commit -m "Add [Tool Name] article"
git push origin main
```

## Batch Processing Workflow

### Processing Multiple Tools at Once

For maximum efficiency when adding multiple articles:

#### Step 1: Organize Your Tool List

Create a structured list of 5-10 tools per batch:

```markdown
# Batch 1: Frontend Tools (5 articles)
1. Vite - Build Tool
2. Astro - Framework
3. Svelte - UI Framework
4. Solid.js - Reactive Framework
5. Qwik - Resumable Framework

# Batch 2: Backend Tools (5 articles)
1. Hono - Edge Framework
2. tRPC - Type-safe APIs
3. Prisma - ORM
4. Drizzle - TypeScript ORM
5. Supabase - Backend Platform
```

#### Step 2: Run Agent in Parallel

Process tools in batches using parallel agent execution:

```bash
# Claude Code can run multiple agents simultaneously
# Provide 3-5 tools at once for the agent to process
```

#### Step 3: Batch Insert Articles

After agent completes, insert all articles at once:

1. Open `lib/articles-data.ts`
2. Add all new articles before the closing `]`
3. Run type-check to verify
4. Commit and push

#### Step 4: Quality Assurance

```bash
# Check all articles render correctly
npm run dev

# Visit these URLs:
# - http://localhost:3000
# - http://localhost:3000/articles
# - http://localhost:3000/categories
# - Individual article pages

# Run production build
npm run build
npm run start
```

### Article Quality Checklist

Each article should include:

- ✅ **Executive Summary** - 200-300 words overview
- ✅ **Technical Deep Dive** - Architecture and performance details
- ✅ **Real-World Examples** - 3+ practical code examples
- ✅ **Common Pitfalls** - Problems and solutions
- ✅ **Best Practices** - Implementation guidelines
- ✅ **Getting Started** - Setup instructions
- ✅ **2,000-3,000 words** - Comprehensive coverage
- ✅ **Code Snippets** - TypeScript/JavaScript examples
- ✅ **External Links** - Official docs and resources

## Scaling Strategy

### Current State (17 Articles)

The blog currently contains 17 comprehensive articles across 10 categories.

### Future Growth Plan

#### Phase 1: Complete Core Categories (Target: 30 articles)
- Add 3 articles per major category
- Focus on trending tools from 2025-2026
- Prioritize tools with active communities

#### Phase 2: Expand Emerging Categories (Target: 50 articles)
- WebAssembly tools
- Edge computing platforms
- AI/ML frameworks
- Web3 development tools
- No-code/low-code platforms

#### Phase 3: Weekly Updates (Target: 100+ articles)
- Add 1-2 new articles weekly
- Update existing articles quarterly
- Track trending tools via GitHub stars, NPM downloads

### Article Generation Efficiency

**Estimated Time per Batch:**
- 5 articles with agent: ~30-45 minutes
- 10 articles with agent: ~60-90 minutes
- Manual review per article: ~5 minutes
- Total per 10 articles: ~2 hours

**Optimization Tips:**
1. Prepare tool lists in advance
2. Run multiple agents in parallel (Claude Code supports this)
3. Use consistent category naming
4. Keep template prompts ready
5. Batch commits for multiple articles

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
out/
```

### Docker

```bash
# Build image
docker build -t tech-blog .

# Run container
docker run -p 3000:3000 tech-blog
```

## Performance Optimization

### Current Optimizations

- React Server Components for zero client-side JavaScript on article pages
- Edge caching with `unstable_cache` for instant page loads
- Automatic static generation for all article routes
- Image optimization with Next.js Image component
- CSS purging with Tailwind for minimal bundle size
- Turbopack for 700ms+ faster builds

### Performance Metrics

**Lighthouse Scores (Target):**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Core Web Vitals:**
- LCP: <1.5s
- FID: <100ms
- CLS: <0.1

## Content Management

### Article Metadata Standards

```typescript
{
  id: "kebab-case-url-slug",           // URL-friendly, unique
  title: "Title Case Article Name",    // Compelling, descriptive
  description: "2-3 sentences...",     // SEO-optimized summary
  category: "Exact Category Name",     // Matches existing categories
  date: "YYYY-MM-DD",                  // ISO format, future-dated OK
  content: `# Markdown content...`,    // Full article in markdown
  urls: ["https://..."],               // Official links only
  keyFeatures: ["6 key features"]      // Exactly 6 features
}
```

### Category Guidelines

**Naming Conventions:**
- Use title case: "Developer Tools" not "developer-tools"
- Be specific: "React/Frontend" not just "Frontend"
- Group related topics: "Testing/Quality" combines testing + QA

**Category Limits:**
- Aim for 5-10 articles per major category
- Create new categories when you have 3+ related tools
- Merge sparse categories if <3 articles

## Contributing

### Adding a New Article Manually

1. Create your article content in markdown
2. Add article object to `lib/articles-data.ts`
3. Follow the metadata standards above
4. Run type-check: `npm run type-check`
5. Test locally: `npm run dev`
6. Build for production: `npm run build`
7. Commit and push changes

### Using the Content Expander Agent

For best results with the technical-content-expander agent:

**Prompt Template:**
```
Create a comprehensive 2,500+ word technical article about [TOOL NAME] for [CATEGORY].

Requirements:
- Title: Compelling, includes tool name
- Category: [Exact Category Name]
- Date: [YYYY-MM-DD]
- Word Count: 2,500+ words
- Technical Depth: Architecture, performance, real examples

Include:
- Executive Summary
- Technical Deep Dive
- 3+ Real-World Examples with code
- Common Pitfalls & Solutions
- Best Practices
- Integration Guide
- Getting Started

Format as TypeScript object ready for articles-data.ts.
```

## Maintenance

### Regular Updates

**Monthly Tasks:**
- Update tool versions in articles
- Check for broken external links
- Review and update code examples
- Add new trending tools

**Quarterly Tasks:**
- Refresh article rankings
- Archive outdated content
- Update screenshots and demos
- Performance audit

### Monitoring

Track these metrics:
- Article page views
- Time on page (target: 3+ minutes)
- Bounce rate (target: <40%)
- External link clicks
- Category distribution

## License

MIT

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Last Updated**: 2025-09-25
**Total Articles**: 17
**Total Categories**: 10
**Average Article Length**: 2,800 words