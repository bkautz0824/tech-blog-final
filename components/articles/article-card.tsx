import Link from 'next/link'
import { CalendarIcon, TagIcon, ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { Article } from '@/lib/articles-server'

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
    ? "elegant-card p-8 lg:p-12 max-w-4xl mx-auto relative overflow-hidden hover:scale-[1.01] transition-all duration-500 ease-out"
    : "elegant-card h-full flex flex-col relative overflow-hidden group-hover:scale-[1.03] transition-all duration-400 ease-out hover:shadow-2xl"

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <article className={cardClasses}>
        {/* Featured article layout */}
        {featured ? (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
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

            <h3 className="elegant-title text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
              {article.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {article.description}
            </p>

            {article.keyFeatures && (
              <div className="flex flex-wrap gap-2">
                {article.keyFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Regular article card layout */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/3 group-hover:via-primary/1 group-hover:to-accent/3 transition-all duration-500 ease-out rounded-xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:scale-105 transition-all duration-300">
                  <TagIcon className="h-3 w-3 group-hover:rotate-12 transition-transform duration-300" />
                  {article.category}
                </span>
              </div>

              <h3 className="elegant-title text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
                {article.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/50 group-hover:border-primary/30 transition-colors duration-300">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
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

                <div className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-accent transition-colors duration-300">
                  <span>Read more</span>
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </>
        )}
      </article>
    </Link>
  )
}