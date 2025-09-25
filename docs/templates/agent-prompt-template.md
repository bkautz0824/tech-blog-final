# Technical Content Expander - Optimized Prompt Template

Use this template when requesting articles from the technical-content-expander agent.

## Base Prompt Template

```
Create a comprehensive 2,500+ word technical article about [TOOL_NAME] for [CATEGORY].

Tool Details:
- Name: [TOOL_NAME]
- Category: [EXACT_CATEGORY]
- Target Date: [YYYY-MM-DD]
- Official URLs: [PRIMARY_URL, DOCS_URL, GITHUB_URL]
- Primary Value Props: [3-5 key benefits]

Requirements:
1. Title: Compelling title that includes tool name and value proposition
2. Word Count: 2,500-3,000 words
3. Technical Depth: Include architecture details, performance benchmarks, real implementations

Article Structure - Include ALL sections:
- Executive Summary (300-400 words)
  * Clear value proposition
  * Key differentiators
  * Who should use this tool

- Technical Deep Dive (600-800 words)
  * Architecture and design principles
  * Performance characteristics
  * Technical innovations
  * Comparison with alternatives

- Real-World Examples (800-1000 words)
  * 3+ complete implementation examples
  * Full TypeScript/JavaScript code
  * Real use cases (e-commerce, SaaS, analytics, etc.)
  * Progressive complexity (basic → intermediate → advanced)

- Common Pitfalls & Solutions (400-500 words)
  * 3+ common problems with code examples
  * Clear solutions with fixed code
  * Debugging tips

- Best Practices (300-400 words)
  * Implementation patterns
  * Performance optimization
  * Security considerations
  * Production deployment tips

- Integration Guide (200-300 words)
  * CI/CD integration
  * Toolchain compatibility
  * Migration strategies

- Getting Started (200-300 words)
  * Installation steps
  * Basic configuration
  * First example
  * Essential commands

Format Requirements:
- Output as TypeScript object ready for articles-data.ts insertion
- Use proper markdown syntax in content field
- Include 6 keyFeatures (concise, descriptive)
- Provide 3-5 official URLs
- Use kebab-case for article ID

Focus Areas (Category-Specific):
[INSERT_CATEGORY_SPECIFIC_FOCUS_AREAS]

Code Example Requirements:
- All examples in TypeScript
- Include imports and full context
- Show both basic and advanced usage
- Include error handling
- Add inline comments for clarity
- Use realistic variable names
```

## Category-Specific Focus Areas

### Build Tools / Developer Tools
```
Focus on:
- Performance benchmarks (startup time, build time, bundle size)
- Configuration examples (minimal vs. advanced)
- Plugin ecosystem and extensibility
- Migration guides from competing tools
- Integration with popular frameworks
```

### React/Frontend Frameworks
```
Focus on:
- Component examples (form, data fetching, state management)
- Routing and navigation patterns
- Server-side rendering capabilities
- Performance optimization techniques
- TypeScript integration
```

### AI Tools
```
Focus on:
- API integration examples
- Cost and pricing considerations
- Accuracy and reliability metrics
- Use case scenarios
- Prompt engineering best practices
```

### Database/Backend
```
Focus on:
- Schema design examples
- Query optimization patterns
- Connection pooling and caching
- Migration strategies
- Scaling considerations
```

### DevOps/Infrastructure
```
Focus on:
- Deployment workflows
- CI/CD pipeline examples
- Monitoring and observability
- Cost optimization
- Security best practices
```

### Testing/Quality
```
Focus on:
- Test organization patterns
- Coverage strategies
- CI/CD integration
- Performance testing
- Visual regression testing
```

### Mobile Development
```
Focus on:
- Cross-platform capabilities
- Native module integration
- Performance on devices
- Build and deployment process
- Platform-specific considerations
```

### UI/UX Libraries
```
Focus on:
- Component examples and variants
- Theming and customization
- Accessibility features
- Performance impact
- Design system integration
```

## Example: Complete Prompt for Vite

```
Create a comprehensive 2,500+ word technical article about Vite for Build Tools.

Tool Details:
- Name: Vite
- Category: Build Tools
- Target Date: 2024-12-20
- Official URLs: https://vitejs.dev, https://vitejs.dev/guide/, https://github.com/vitejs/vite
- Primary Value Props:
  * Instant dev server with native ESM
  * Lightning-fast HMR (<50ms)
  * Optimized production builds
  * Framework-agnostic plugin system
  * Rollup-based bundling

Requirements:
1. Title: Something like "Vite: The Lightning-Fast Build Tool Revolutionizing Frontend Development"
2. Word Count: 2,500-3,000 words
3. Technical Depth: Architecture, ESM benefits, Rollup integration, performance metrics

Article Structure - Include ALL sections:
- Executive Summary
- Technical Deep Dive (focus on ESM, cold start optimization, plugin architecture)
- Real-World Examples:
  * React project setup with Vite
  * Vue 3 application with TypeScript
  * Multi-framework monorepo setup
- Common Pitfalls:
  * CommonJS module compatibility issues
  * Dynamic imports in SSR
  * Plugin conflicts
- Best Practices:
  * Optimal vite.config.ts setup
  * Build optimization strategies
  * Development workflow tips
- Integration Guide:
  * CI/CD with GitHub Actions
  * Docker integration
  * Environment variables handling
- Getting Started:
  * Quick project scaffolding
  * Configuration basics

Format as TypeScript object for articles-data.ts.

Focus on:
- Performance benchmarks vs webpack/parcel/esbuild
- HMR implementation details
- Build optimization techniques
- Plugin ecosystem (official + community)
- Framework integration patterns
```

## Expected Agent Response Format

```typescript
{
  id: "vite-lightning-fast-build-tool",
  title: "Vite: The Lightning-Fast Build Tool Revolutionizing Frontend Development",
  description: "Discover how Vite delivers instant dev server startup and sub-50ms HMR through native ESM, transforming the frontend development experience. Learn architecture, implementation patterns, and production optimization techniques.",
  category: "Build Tools",
  date: "2024-12-20",
  content: `# Vite: The Lightning-Fast Build Tool Revolutionizing Frontend Development

## Executive Summary

[300+ words of comprehensive overview...]

## Technical Deep Dive

[600+ words covering architecture...]

[... rest of article content ...]
`,
  urls: [
    "https://vitejs.dev",
    "https://vitejs.dev/guide/",
    "https://github.com/vitejs/vite"
  ],
  keyFeatures: [
    "Instant dev server startup",
    "Lightning-fast HMR (<50ms)",
    "Optimized production builds",
    "Framework-agnostic plugins",
    "Native ESM support",
    "Rollup-based bundling"
  ]
}
```

## Quality Validation

After receiving agent output, verify:

- [ ] Article ID is unique and descriptive
- [ ] Title is compelling (not generic)
- [ ] Description is 2-3 sentences and SEO-friendly
- [ ] Category matches existing categories exactly
- [ ] Date is in correct format
- [ ] Content includes ALL required sections
- [ ] Code examples are complete and working
- [ ] URLs are official and active
- [ ] KeyFeatures has exactly 6 items
- [ ] Total word count is 2,500+
- [ ] No markdown syntax errors
- [ ] TypeScript object is valid

## Troubleshooting

### Agent Returns Incomplete Article

**Cause:** Content too large for single response

**Solution:**
```
First request: "Create executive summary and technical deep dive sections only"
Second request: "Create the 3 real-world examples sections"
Third request: "Create common pitfalls, best practices, and getting started"
Fourth request: "Combine all sections and format as TypeScript object"
```

### Agent Skips Code Examples

**Cause:** Prompt not specific enough

**Solution:**
```
Add to prompt:
"Each example must include:
- Complete, working code (50-100 lines minimum)
- Full imports and setup
- TypeScript types
- Error handling
- Inline explanatory comments"
```

### Article Too Generic

**Cause:** Missing specific focus areas

**Solution:**
```
Add to prompt:
"Focus specifically on:
- [Specific feature 1] with code example
- [Specific feature 2] with benchmarks
- [Specific feature 3] with migration guide"
```

---

**Pro Tip**: Save successful prompts for each category. Reuse and refine them for similar tools to maintain consistency and quality across articles.