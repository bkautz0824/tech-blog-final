# Article Creation Workflow Guide

Complete step-by-step guide for adding new technical articles to the blog using the technical-content-expander Claude Code agent.

## Quick Start

```bash
# 1. Prepare your tool list
# 2. Run: /agents in Claude Code
# 3. Select: technical-content-expander
# 4. Provide tool details
# 5. Copy output to lib/articles-data.ts
# 6. Test and deploy
```

## Detailed Workflow

### Phase 1: Planning & Research

#### Step 1.1: Identify Tools to Cover

Research trending tools from these sources:
- GitHub trending repositories
- NPM weekly downloads
- Reddit r/webdev, r/javascript
- Twitter/X developer community
- Dev.to trending posts
- Product Hunt launches

**Selection Criteria:**
- Active development (commits within 3 months)
- Strong community (1,000+ GitHub stars)
- Clear documentation
- Real-world adoption
- Unique value proposition

#### Step 1.2: Organize Into Batches

Group tools by category for efficient processing:

```markdown
# Example: Frontend Batch (5 tools)

## Vite
- Category: Build Tools
- Date: 2024-12-20
- Why: Lightning-fast dev server, HMR
- URLs: https://vitejs.dev

## Astro
- Category: React/Frontend
- Date: 2024-12-19
- Why: Islands architecture, multi-framework
- URLs: https://astro.build

## Solid.js
- Category: React/Frontend
- Date: 2024-12-18
- Why: Fine-grained reactivity, no VDOM
- URLs: https://solidjs.com

## Qwik
- Category: React/Frontend
- Date: 2024-12-17
- Why: Resumability, instant apps
- URLs: https://qwik.builder.io

## Svelte 5
- Category: React/Frontend
- Date: 2024-12-16
- Why: Runes, native reactivity
- URLs: https://svelte.dev
```

### Phase 2: Agent Execution

#### Step 2.1: Launch Technical Content Expander

In Claude Code terminal:
```bash
/agents
# Select: technical-content-expander
```

#### Step 2.2: Provide Tool Details

Use this optimized prompt template:

```
Create a comprehensive 2,500+ word technical article about [TOOL NAME] for [CATEGORY].

Tool Details:
- Name: [Tool Name]
- Category: [Exact Category]
- Target Date: [YYYY-MM-DD]
- Official URLs: [URLs]
- Key Value Props: [What makes it unique]

Requirements:
1. Title: Compelling, includes tool name
2. Word Count: 2,500-3,000 words
3. Technical Depth: Architecture, performance, implementation

Include:
- Executive Summary (300 words)
- Technical Deep Dive (architecture, performance)
- 3+ Real-World Examples (full code, TypeScript)
- Common Pitfalls & Solutions (with fixes)
- Best Practices (implementation tips)
- Integration Guide (CI/CD, workflows)
- Getting Started (setup, basic usage)

Format as TypeScript object for articles-data.ts.

Focus on:
- Practical implementation examples
- Performance benchmarks
- Migration guides
- Production best practices
- Common gotchas developers face
```

#### Step 2.3: Process Agent Output

The agent returns articles in this format:

```typescript
{
  id: "tool-name-slug",
  title: "Tool Name: Compelling Subtitle",
  description: "Brief overview in 2-3 sentences",
  category: "Category Name",
  date: "2024-12-XX",
  content: `# Full markdown content...`,
  urls: ["https://..."],
  keyFeatures: ["feature1", "feature2", ...]
}
```

**Verification Checklist:**
- [ ] ID is kebab-case and unique
- [ ] Title is compelling and descriptive
- [ ] Description is 2-3 sentences
- [ ] Category matches existing categories exactly
- [ ] Date is ISO format
- [ ] Content has all required sections
- [ ] URLs are official sources only
- [ ] KeyFeatures has 6 items

### Phase 3: Integration

#### Step 3.1: Add to articles-data.ts

```bash
# Open the file
code lib/articles-data.ts

# Find the closing bracket of articles array: ]
# Insert new article object BEFORE the ]
# Ensure proper comma separation
```

**Important:**
- Add comma after previous article's closing `}`
- Maintain consistent indentation (2 spaces)
- Place newest articles at the top of array
- Keep array sorted by date (newest first)

#### Step 3.2: Verify TypeScript

```bash
# Run type checking
npm run type-check

# Expected output: No errors
# If errors, check:
# - Missing commas
# - Unclosed backticks in content
# - Invalid characters in strings
```

#### Step 3.3: Local Testing

```bash
# Start dev server
npm run dev

# Test these pages:
# 1. Homepage (should show latest article)
http://localhost:3000

# 2. All articles page (new article should appear)
http://localhost:3000/articles

# 3. Category page (verify category filtering)
http://localhost:3000/categories

# 4. Individual article page (verify markdown rendering)
http://localhost:3000/articles/[new-article-id]
```

**Testing Checklist:**
- [ ] Article appears on homepage if latest
- [ ] Article shows in /articles grid
- [ ] Category filtering works
- [ ] Article detail page renders markdown correctly
- [ ] Code blocks have syntax highlighting
- [ ] External links work
- [ ] Mobile responsive layout works
- [ ] Theme switching works

### Phase 4: Quality Assurance

#### Step 4.1: Content Review

**Quick Review (5 minutes per article):**
- Read executive summary for clarity
- Scan code examples for correctness
- Check external links are valid
- Verify dates and metadata

**Deep Review (15 minutes per article):**
- Test code examples locally
- Verify technical accuracy
- Check for typos and grammar
- Ensure consistent tone

#### Step 4.2: Production Build Test

```bash
# Build for production
npm run build

# Check for errors:
# - TypeScript compilation errors
# - Missing dependencies
# - Route generation issues
# - Image optimization failures

# Start production server
npm run start

# Test production build at http://localhost:3000
```

### Phase 5: Deployment

#### Step 5.1: Commit Changes

```bash
# Stage changes
git add lib/articles-data.ts

# Create descriptive commit
git commit -m "Add [Tool Name] article ([Category])"

# Or for batch additions:
git commit -m "Add batch: [5 frontend framework articles]

- Vite - Lightning-fast build tool
- Astro - Islands architecture
- Solid.js - Fine-grained reactivity
- Qwik - Resumable framework
- Svelte 5 - Runes and signals
"
```

#### Step 5.2: Push to Repository

```bash
# Push to main branch
git push origin main

# Vercel will auto-deploy from main branch
# Check deployment at: https://vercel.com/dashboard
```

## Batch Processing Strategies

### Small Batch (3-5 articles)

**Timeline: 1 hour**

1. Prepare tool list (10 min)
2. Run agent for each tool (30 min)
3. Add to articles-data.ts (10 min)
4. Test and verify (10 min)

**Best For:**
- Weekly content updates
- Single category expansion
- Quick turnaround needed

### Medium Batch (6-10 articles)

**Timeline: 2-3 hours**

1. Organize by category (15 min)
2. Run agent with parallel prompts (60 min)
3. Batch insert all articles (20 min)
4. Comprehensive testing (30 min)
5. Review and polish (30 min)

**Best For:**
- Monthly content pushes
- New category launches
- Themed collections

### Large Batch (11-20 articles)

**Timeline: 4-6 hours**

1. Strategic planning (30 min)
2. Category organization (20 min)
3. Parallel agent execution (120 min)
4. Batch processing (45 min)
5. Quality assurance (60 min)
6. Performance testing (30 min)

**Best For:**
- Quarterly content refreshes
- Major platform updates
- Comprehensive coverage initiatives

## Optimization Tips

### Agent Prompt Optimization

**Generic Prompt (Slower):**
```
Write an article about Vite
```

**Optimized Prompt (Faster, Better Results):**
```
Create 2,500+ word article about Vite (build tool) for Build Tools category.

Date: 2024-12-20
URLs: https://vitejs.dev, https://github.com/vitejs/vite

Focus on:
- Instant dev server with native ESM
- HMR in <50ms
- Optimized production builds
- Plugin ecosystem

Include:
- Performance benchmarks vs webpack/parcel
- Vite config examples
- React/Vue/Svelte integration
- Build optimization techniques

Format as TypeScript object for articles-data.ts.
```

### Parallel Processing

**Sequential Processing (Slower):**
```
Tool 1 → Wait → Tool 2 → Wait → Tool 3
Total: 60 min for 3 articles
```

**Parallel Processing (Faster):**
```
Tool 1 ┐
Tool 2 ├─→ All complete
Tool 3 ┘
Total: 20 min for 3 articles
```

**How to Execute:**
- Prepare all prompts in advance
- Run multiple agent instances
- Process outputs concurrently
- Batch insert all articles

### Template Reuse

Save successful prompts as templates:

```bash
# Create templates directory
mkdir -p docs/templates

# Save category-specific templates
docs/templates/
├── frontend-framework-template.md
├── build-tool-template.md
├── database-template.md
└── ai-tool-template.md
```

Example template:

```markdown
# [Category] Article Template

Create 2,500+ word article about [TOOL] for [CATEGORY].

Date: [AUTO_DATE]
URLs: [TOOL_URLS]

Focus: [CATEGORY_SPECIFIC_FOCUS]

Include:
- [CATEGORY_SPECIFIC_SECTIONS]

Format as TypeScript object.
```

## Common Issues & Solutions

### Issue: Agent Output Incomplete

**Problem:** Agent stops mid-article or truncates content

**Solution:**
- Request "executive summary only" first
- Then request "full technical content"
- Combine outputs manually

### Issue: Duplicate Article IDs

**Problem:** New article ID conflicts with existing

**Solution:**
```bash
# Check existing IDs
grep 'id: "' lib/articles-data.ts

# Use unique, descriptive IDs:
# Good: "vite-lightning-fast-build-tool"
# Bad: "vite" or "build-tool-1"
```

### Issue: TypeScript Errors After Adding Articles

**Problem:** Type errors after inserting new articles

**Solution:**
```bash
# Common fixes:
# 1. Check for unclosed backticks in content
# 2. Verify comma placement
# 3. Escape special characters in strings
# 4. Run: npm run type-check for details
```

### Issue: Markdown Not Rendering

**Problem:** Article content appears as plain text

**Solution:**
- Verify content is wrapped in backticks: \`...\`
- Check for escaped backticks in code blocks
- Ensure proper markdown syntax

## Article Quality Standards

### Minimum Requirements

- **Length**: 2,000+ words
- **Code Examples**: 3+ complete, working examples
- **External Links**: 2+ official sources
- **Sections**: All 7 required sections
- **Grammar**: Professional, error-free
- **Technical Accuracy**: Verified and tested

### Excellence Criteria

- **Length**: 2,500-3,500 words
- **Code Examples**: 5+ with explanations
- **Real-World Scenarios**: Production use cases
- **Performance Data**: Benchmarks, comparisons
- **Best Practices**: Actionable recommendations
- **Visuals**: Architecture diagrams (future)
- **Updates**: Quarterly refresh plan

## Future Enhancements

### Planned Features

1. **Automated Tool Discovery**
   - GitHub API integration
   - Trending tool detection
   - Auto-categorization

2. **AI-Powered Updates**
   - Quarterly article refreshes
   - Version update detection
   - Broken link checking

3. **Content Analytics**
   - Most viewed articles
   - Category performance
   - Reader engagement metrics

4. **Multi-Format Export**
   - PDF generation
   - EPUB for e-readers
   - Medium/Dev.to cross-posting

### Scaling to 100+ Articles

**Database Considerations:**
- Current: Static file (good for <100 articles)
- Future: Turso/Supabase for 100+ articles
- Consider: CMS integration (Sanity, Contentful)

**Performance Optimizations:**
- Implement virtual scrolling for article lists
- Add search indexing (Algolia, Meilisearch)
- Progressive image loading
- Route-based code splitting

## Resources

### Template Files
- `/docs/templates/article-template.md` - Base article structure
- `/docs/templates/prompt-template.md` - Agent prompt template
- `/docs/templates/category-template.md` - Category-specific prompts

### Reference Materials
- Next.js 15 docs: https://nextjs.org/docs
- Markdown guide: https://www.markdownguide.org
- TypeScript handbook: https://www.typescriptlang.org/docs

### Tools
- **Article Preview**: `npm run dev` - See changes live
- **Type Checking**: `npm run type-check` - Validate TypeScript
- **Production Build**: `npm run build` - Test final output

---

**Last Updated**: 2025-09-25
**Version**: 1.0
**Maintained By**: Tech Blog Team