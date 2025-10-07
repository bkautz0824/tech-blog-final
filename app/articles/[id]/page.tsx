import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RetroButton } from '@/components/retro-button'
import { getArticleByIdCached, getArticlesCached, getArticleMetadata, preloadArticle } from '@/lib/articles-convex'
import type { Metadata } from 'next'

interface ArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const articles = await getArticlesCached()
  return articles.map((article) => ({
    id: article.id,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params
  const metadata = await getArticleMetadata(id)

  if (!metadata) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    }
  }

  return {
    title: `${metadata.title} | Tech Blog`,
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: 'Tech Blog' }],
    category: metadata.category,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
        authors: ['Tech Blog'],
      tags: metadata.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: `/articles/${id}`,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params

  // Preload the article
  preloadArticle(id)

  const article = await getArticleByIdCached(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="article-reading-glow min-h-screen">
      <article className="max-w-4xl mx-auto relative z-10">
        {/* Article Header */}
        <header className="mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg"
                style={{
                  boxShadow: '0 8px 32px rgba(var(--primary-rgb, 217, 119, 6), 0.1)'
                }}>
          <div className="mb-3">
            <Link href="/" className="text-primary hover:underline font-mono text-xs category-badge-glow inline-block px-2 py-1 rounded transition-all duration-300">
              ← Back to Home
            </Link>
          </div>
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary font-mono text-xs uppercase rounded category-badge-glow">
              {article.category}
            </span>
          </div>
          <h1 className="retro-title text-2xl md:text-3xl mb-3 leading-tight gradient-text-theme">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-3 leading-relaxed">
            {article.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Published: {new Date(article.date).toLocaleDateString()}</span>
          </div>

          {/* Subtle decorative line */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-accent mt-4 rounded-full shadow-sm"
               style={{
                 boxShadow: '0 0 8px rgba(var(--primary-rgb, 217, 119, 6), 0.3)'
               }} />
        </header>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="article-content-card">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
            />
          </div>

          {/* Key Features Section */}
          {article.keyFeatures && article.keyFeatures.length > 0 && (
            <div className="article-content-card">
              <h2 className="retro-subtitle text-2xl mb-6 gradient-text-theme">Key Features</h2>
              <ul className="space-y-4">
                {article.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex flex-col gap-2 p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <span className="text-primary font-mono text-lg mt-0.5 shadow-sm">▸</span>
                      <span className="font-semibold text-primary flex-1">{typeof feature === 'string' ? feature : feature.title}</span>
                    </div>
                    {typeof feature === 'object' && feature.description && (
                      <p className="text-muted-foreground ml-7 text-sm">{feature.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Links */}
          {article.urls && article.urls.length > 0 && (
            <div className="article-content-card">
              <h2 className="retro-subtitle text-2xl mb-6 gradient-text-theme">Related Links</h2>
              <ul className="space-y-4">
                {article.urls.map((urlItem, index) => {
                  const url = typeof urlItem === 'string' ? urlItem : urlItem.url;
                  const title = typeof urlItem === 'object' ? urlItem.title : url;
                  return (
                    <li key={index} className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent font-mono text-sm break-all transition-colors duration-300 category-badge-glow inline-block"
                      >
                        {title} ↗
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50"
             style={{
               boxShadow: '0 4px 16px rgba(var(--primary-rgb, 217, 119, 6), 0.05)'
             }}>
          <Link href="/articles" className="category-badge-glow">
            <RetroButton variant="secondary">
              All Articles
            </RetroButton>
          </Link>
          <Link href="/" className="category-badge-glow">
            <RetroButton>
              Back to Home
            </RetroButton>
          </Link>
        </nav>
      </article>
    </div>
  )
}

// Helper function to format markdown-like content to HTML
function formatContent(content: string): string {
  // Basic markdown to HTML conversion with better styling
  let html = content
    // Headers with better styling
    .replace(/^### \*\*(.+?)\*\*/gim, '<h3 class="retro-subtitle text-xl mt-8 mb-4 text-primary border-l-4 border-primary pl-4 bg-primary/5 py-2 rounded-r">$1</h3>')
    .replace(/^### (.*$)/gim, '<h3 class="retro-subtitle text-xl mt-8 mb-4 text-primary border-l-4 border-primary pl-4 bg-primary/5 py-2 rounded-r">$1</h3>')
    .replace(/^## \*\*(.+?)\*\*/gim, '<h2 class="retro-title text-2xl mt-10 mb-6 text-primary border-b-2 border-primary pb-2">$1</h2>')
    .replace(/^## (.*$)/gim, '<h2 class="retro-title text-2xl mt-10 mb-6 text-primary border-b-2 border-primary pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="retro-title text-3xl mt-8 mb-6">$1</h1>')
    // Bold with accent color
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
    // Code blocks with better styling
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<div class="bg-muted/50 border-l-4 border-secondary p-4 rounded-r-lg overflow-x-auto my-6"><pre><code class="text-sm font-mono">$2</code></pre></div>')
    // Inline code with better styling
    .replace(/`([^`]+)`/g, '<code class="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono border border-primary/20">$1</code>')
    // Enhanced bullet lists
    .replace(/^- (.*$)/gim, '<li class="flex items-start gap-3 mb-3"><span class="text-primary font-bold text-lg mt-0.5">•</span><span class="flex-1 leading-relaxed">$1</span></li>')
    // Enhanced numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="flex items-start gap-3 mb-3"><span class="text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded text-sm mt-0.5">$&</span><span class="flex-1 leading-relaxed">$1</span></li>')

  // Split into paragraphs and add proper spacing
  const paragraphs = html.split('\n\n').filter(p => p.trim())
  html = paragraphs.map(p => {
    // Don't wrap headers, lists, or code blocks in paragraph tags
    if (p.startsWith('<h') || p.startsWith('<li') || p.startsWith('<div class="bg-muted') || p.startsWith('<pre')) {
      return p
    }
    return `<p class="mb-6 leading-relaxed text-base">${p}</p>`
  }).join('\n')

  // Wrap list items in proper ul tags
  html = html.replace(/(<li class="flex[\s\S]*?<\/li>\s*)+/g, (match) => {
    return `<ul class="space-y-2 mb-6">${match}</ul>`
  })

  return html
}