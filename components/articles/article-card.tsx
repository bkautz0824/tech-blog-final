import Link from 'next/link'
import { CalendarIcon, TagIcon, ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { Article } from '@/lib/articles-convex'

interface ArticleCardProps {
  article: Article
  readingTime?: number
  featured?: boolean
  priority?: boolean
}

export function ArticleCard({
  article,
  readingTime,
  featured = false,
  priority = false
}: ArticleCardProps) {
  const cardClasses = featured
    ? "elegant-card p-8 lg:p-12 max-w-4xl mx-auto relative overflow-hidden"
    : "elegant-card h-full flex flex-col relative overflow-hidden"

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <article className={cardClasses}>
        {/* Featured article layout */}
        {featured ? (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full category-badge-glow border border-primary/20 shadow-sm"
                    style={{
                      boxShadow: '0 2px 8px rgba(var(--primary-rgb, 217, 119, 6), 0.15)'
                    }}>
                <TagIcon className="h-4 w-4" />
                {article.category}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {readingTime && (
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  {readingTime} min read
                </span>
              )}
            </div>

            <h3 className="elegant-title text-2xl lg:text-3xl font-bold mb-4">
              {article.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {article.description}
            </p>

            {article.keyFeatures && (
              <div className="flex flex-wrap gap-2">
                {article.keyFeatures.slice(0, 4).map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                  >
                    {typeof feature === 'string' ? feature : feature.title}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Regular article card layout */}

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 shadow-sm"
                      style={{
                        boxShadow: '0 2px 6px rgba(var(--primary-rgb, 217, 119, 6), 0.12)'
                      }}>
                  <TagIcon className="h-3 w-3" />
                  {article.category}
                </span>
              </div>

              <h3 className="elegant-title text-xl font-semibold mb-3 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
                {article.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  {readingTime && (
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="h-4 w-4" />
                      <span>{readingTime}m</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <span>Read more</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </>
        )}
      </article>
    </Link>
  )
}