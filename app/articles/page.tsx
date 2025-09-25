'use client'

import Link from 'next/link'
import { articles } from '@/lib/articles'
import { CalendarIcon, TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export default function ArticlesPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <header className="relative py-16 lg:py-24 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden" role="banner">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" aria-hidden="true" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-down">
              <h1 className="elegant-title text-5xl lg:text-7xl font-bold mb-6 gradient-text-theme drop-shadow-sm">
                All Articles
                <span className="sr-only"> - {articles.length} articles available</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                Explore our complete collection of development tools, frameworks, and insights
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      {/* Articles Grid Section */}
      <section className="py-16 lg:py-24" aria-labelledby="articles-section-title">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Header */}
            <div className="mb-12 text-center animate-fade-in-up">
              <p
                id="articles-section-title"
                className="text-sm text-muted-foreground font-medium tracking-wide uppercase mb-2"
              >
                {articles.length} Articles Available
              </p>
              <div className="flex justify-center items-center gap-4" aria-hidden="true">
                <div className="h-px bg-border flex-1 max-w-20" />
                <TagIcon className="h-4 w-4 text-primary" />
                <div className="h-px bg-border flex-1 max-w-20" />
              </div>
            </div>

            {/* Enhanced Articles Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
              role="grid"
              aria-label={`Grid of ${articles.length} articles`}
            >
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  className={`group animate-stagger ${mounted ? '' : 'opacity-0'}`}
                  role="gridcell"
                  style={{
                    animationDelay: mounted ? `${index * 100}ms` : '0ms',
                    animationFillMode: 'both'
                  }}
                >
                  <Link
                    href={`/articles/${article.id}`}
                    className="block h-full"
                    aria-describedby={`article-${article.id}-description`}
                  >
                    <article className="elegant-card h-full flex flex-col relative overflow-hidden group-hover:scale-[1.02] transition-all duration-300 ease-out hover:shadow-2xl" tabIndex={0}>
                      {/* Animated background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-accent/5 transition-all duration-500 ease-out rounded-xl" />

                      <div className="relative flex flex-col h-full">
                        {/* Category Badge */}
                        <div className="mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                            <TagIcon className="h-3 w-3" />
                            {article.category}
                          </span>
                        </div>

                        {/* Article Title */}
                        <h2 className="elegant-title text-xl lg:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed flex-grow mb-6 line-clamp-3">
                          {article.description}
                        </p>

                        {/* Key Features */}
                        {article.keyFeatures && (
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {article.keyFeatures.slice(0, 3).map((feature, featureIndex) => (
                              <span
                                key={featureIndex}
                                className="px-2 py-1 text-xs font-medium bg-secondary/60 text-secondary-foreground rounded-md"
                              >
                                {feature}
                              </span>
                            ))}
                            {article.keyFeatures.length > 3 && (
                              <span className="px-2 py-1 text-xs font-medium bg-secondary/40 text-muted-foreground rounded-md">
                                +{article.keyFeatures.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <time dateTime={article.date}>
                              {new Date(article.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </time>
                          </div>

                          <div className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-accent transition-colors duration-300">
                            <span>Read Article</span>
                            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>

            {/* Enhanced Call to Action */}
            <div className="mt-16 text-center animate-fade-in-up">
              <div className="max-w-2xl mx-auto">
                <h3 className="elegant-title text-2xl lg:text-3xl font-bold mb-4">
                  Stay Updated
                </h3>
                <p className="text-muted-foreground mb-8">
                  New articles are added regularly. Check back soon for the latest development tools and insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="elegant-button group"
                  >
                    <span>Back to Home</span>
                    <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/categories"
                    className="elegant-button-outline group"
                  >
                    <TagIcon className="h-4 w-4 mr-2" />
                    <span>Browse Categories</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}