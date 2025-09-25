# Batch Planning Template

Use this template to plan and execute efficient batch article creation for the tech blog.

## Batch Information

**Batch Number**: [e.g., Batch 3]
**Focus Area**: [e.g., Frontend Frameworks, AI Tools, Backend Services]
**Target Completion**: [Date]
**Total Articles**: [Number]
**Estimated Time**: [Hours]

---

## Tools List

### Tool 1: [Tool Name]

**Category**: [Exact category name - must match existing or new]
**Target Date**: [YYYY-MM-DD]
**Priority**: [High/Medium/Low]

**URLs**:
- Official Site:
- Documentation:
- GitHub:
- Additional:

**Key Value Props** (for agent prompt):
1.
2.
3.
4.
5.

**Focus Areas** (for agent):
-
-
-

**Code Example Requirements**:
- Example 1: [Brief description]
- Example 2: [Brief description]
- Example 3: [Brief description]

**Status**: [ ] Not Started | [ ] In Progress | [ ] Agent Complete | [ ] Reviewed | [ ] Added to Blog

---

### Tool 2: [Tool Name]

[Repeat structure above]

---

## Batch Execution Plan

### Phase 1: Research & Planning (Est: X min)

**Tasks:**
- [ ] Research trending tools
- [ ] Verify official documentation exists
- [ ] Check community activity (GitHub stars, recent commits)
- [ ] Confirm no duplicate articles exist
- [ ] Assign categories
- [ ] Set target dates (stagger by 1 day each)

**Output:**
- Completed tools list above
- Priority ranking
- Category distribution plan

### Phase 2: Agent Execution (Est: X min)

**Execution Strategy**: [Sequential / Parallel]

**For Sequential:**
```
Tool 1 → Review → Tool 2 → Review → Tool 3
Timeline: [X min per tool]
```

**For Parallel (Recommended for 3+ tools):**
```
Launch 3-5 agents simultaneously
Monitor outputs as they complete
Timeline: [X min total]
```

**Agent Prompts Checklist:**
- [ ] All prompts prepared in advance
- [ ] Category-specific focus areas added
- [ ] Code example requirements specified
- [ ] Word count and format confirmed
- [ ] Date and metadata included

### Phase 3: Integration (Est: X min)

**Tasks:**
- [ ] Open `lib/articles-data.ts`
- [ ] Insert articles before closing `]`
- [ ] Maintain consistent formatting
- [ ] Add commas between articles
- [ ] Save file

**Insertion Order:**
- Place newest articles at the top
- Maintain date sorting (newest → oldest)
- Group by category if logical

### Phase 4: Quality Assurance (Est: X min)

**Type Checking:**
```bash
npm run type-check
# Must pass with 0 errors
```

**Lint Checking:**
```bash
npm run lint:check
# Should pass or have minimal warnings
```

**Local Testing:**
```bash
npm run dev
# Test these URLs:
```

- [ ] Homepage - Latest article shows correctly
- [ ] /articles - All new articles appear
- [ ] /categories - New categories/counts updated
- [ ] Individual article pages - All render correctly
- [ ] Mobile responsive - Test on small viewport
- [ ] Theme switching - Test both light/dark modes

**Production Build:**
```bash
npm run build
npm run start
# Verify production build works
```

### Phase 5: Deployment (Est: X min)

**Git Workflow:**
```bash
# Stage changes
git add lib/articles-data.ts

# Commit with descriptive message
git commit -m "Add batch X: [Brief description]

Articles added:
- [Tool 1] ([Category])
- [Tool 2] ([Category])
- [Tool 3] ([Category])
..."

# Push to repository
git push origin main
```

**Verify Deployment:**
- [ ] Check Vercel dashboard for build status
- [ ] Visit production URL
- [ ] Test new articles on live site
- [ ] Verify sitemap updated
- [ ] Check social sharing metadata

---

## Tracking & Metrics

### Before Batch
- Total Articles: [X]
- Total Categories: [X]
- Total Word Count: [X]

### After Batch
- Total Articles: [X]
- Total Categories: [X]
- Total Word Count: [X]
- New Articles: [X]
- Time Taken: [X hours]

### Performance
- Articles per Hour: [X]
- Average Article Length: [X words]
- Agent Success Rate: [X%]
- Errors/Revisions: [X]

---

## Post-Batch Review

### What Worked Well
1.
2.
3.

### What Could Be Improved
1.
2.
3.

### Lessons Learned
1.
2.
3.

### Next Batch Optimizations
1.
2.
3.

---

## Example: Completed Batch

### Batch 1: Frontend Build Tools (5 articles) ✅

**Completion Date**: 2024-12-01
**Total Time**: 2.5 hours
**Success Rate**: 100%

**Articles:**
1. ✅ Vite - Build Tool - 2,847 words
2. ✅ Turbopack - Build Tool - 2,654 words
3. ✅ esbuild - Build Tool - 2,523 words
4. ✅ Parcel - Build Tool - 2,712 words
5. ✅ Rollup - Build Tool - 2,389 words

**Metrics:**
- Articles per Hour: 2
- Avg Length: 2,625 words
- Total Words: 13,125
- Categories: 1 (Build Tools)

**Optimizations Applied:**
- Ran 3 agents in parallel
- Prepared all prompts in advance
- Used consistent focus areas
- Batch committed all articles

**Next Batch Notes:**
- Parallel execution saved 40% time
- Need more specific code example requirements
- Consider adding benchmark comparison section