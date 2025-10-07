import { ArticleCard } from './article-card'
import type { Article } from '@/lib/articles-convex'

interface ArticlesGridProps {
  articles: Article[]
  showFeatured?: boolean
  className?: string
}

export function ArticlesGrid({
  articles,
  showFeatured = false,
  className = ""
}: ArticlesGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No articles found.</p>
      </div>
    )
  }

  const featuredArticle = showFeatured ? articles[0] : null
  const gridArticles = showFeatured ? articles.slice(1) : articles

  return (
    <div className={className}>
      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-16">
          <ArticleCard
            article={featuredArticle}
            featured={true}
            priority={true}
          />
        </div>
      )}

      {/* Articles Grid */}
      {gridArticles.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article, index) => (
            <div
              key={article.id}
              className="animate-stagger"
              style={{
                animationDelay: `${index * 150 + (showFeatured ? 300 : 0)}ms`,
                animationFillMode: 'both'
              }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}