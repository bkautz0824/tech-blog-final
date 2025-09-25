'use client'

import Link from 'next/link'
import { getAllCategories, getArticlesByCategory } from '@/lib/articles'
import { TagIcon, CalendarIcon, ArrowRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export default function CategoriesPage() {
  const [mounted, setMounted] = useState(false)
  const categories = getAllCategories()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <header className="relative py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden" role="banner">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" aria-hidden="true" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-gentle-bounce" style={{ animationDuration: '8s', animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/8 rounded-full blur-3xl animate-gentle-bounce" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-down">
              <h1 className="elegant-title text-5xl lg:text-7xl font-bold mb-6 gradient-text-theme drop-shadow-sm">
                Categories
                <span className="sr-only"> - {categories.length} categories available</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
                Discover articles organized by technology, framework, and development focus areas
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      {/* Categories Grid Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden" aria-labelledby="categories-section-title">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/2 via-transparent to-accent/2 animate-pulse" style={{ animationDuration: '12s' }} />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Stats Header */}
            <div className="mb-16 text-center animate-fade-in-up">
              <p
                id="categories-section-title"
                className="text-sm text-muted-foreground font-medium tracking-wide uppercase mb-4"
              >
                {categories.length} Categories Available
              </p>
              <div className="flex justify-center items-center gap-6" aria-hidden="true">
                <div className="h-px bg-border flex-1 max-w-24" />
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="h-px bg-border flex-1 max-w-24" />
              </div>
            </div>

            {/* Enhanced Categories Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
              role="grid"
              aria-label={`Grid of ${categories.length} categories`}
            >
              {categories.map((category, index) => {
                const categoryArticles = getArticlesByCategory(category)
                const previewArticles = categoryArticles.slice(0, 3)
                const totalCount = categoryArticles.length

                return (
                  <div
                    key={category}
                    className={`group animate-stagger ${mounted ? '' : 'opacity-0'}`}
                    role="gridcell"
                    style={{
                      animationDelay: mounted ? `${index * 150}ms` : '0ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <article className="elegant-card h-full flex flex-col relative overflow-hidden group-hover:scale-[1.02] transition-all duration-400 ease-out hover:shadow-2xl">
                      {/* Animated background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/6 group-hover:via-primary/2 group-hover:to-accent/6 transition-all duration-500 ease-out rounded-xl" />

                      <div className="relative flex flex-col h-full">
                        {/* Category Header */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                              <TagIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="font-semibold text-sm">{category}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <DocumentTextIcon className="h-4 w-4" />
                              <span className="font-medium">{totalCount}</span>
                            </div>
                          </div>

                          <h2 className="elegant-title text-2xl lg:text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                            {category}
                          </h2>
                        </div>

                        {/* Articles Preview */}
                        <div className="flex-grow mb-6">
                          {previewArticles.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                Recent Articles
                              </h3>
                              {previewArticles.map((article) => (
                                <Link
                                  key={article.id}
                                  href={`/articles/${article.id}`}
                                  className="group/article block"
                                >
                                  <div className="p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group-hover/article:scale-[1.02]">
                                    <h4 className="font-medium text-sm group-hover/article:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                                      {article.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <CalendarIcon className="h-3 w-3" />
                                      <time dateTime={article.date}>
                                        {new Date(article.date).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </time>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                              {totalCount > 3 && (
                                <div className="text-xs text-muted-foreground font-medium pl-3 pt-2 border-t border-border/30">
                                  +{totalCount - 3} more article{totalCount - 3 !== 1 ? 's' : ''} available
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto">
                          <Link
                            href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                            className="elegant-button w-full group/btn"
                          >
                            <span>Explore {category}</span>
                            <ArrowRightIcon className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Call to Action */}
            <div className="mt-20 text-center animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
              <div className="max-w-3xl mx-auto">
                <h3 className="elegant-title text-3xl lg:text-4xl font-bold mb-6 gradient-text-theme">
                  Dive Deeper Into Development
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Each category contains carefully curated articles covering the latest tools, best practices, and emerging technologies in modern development.
                </p>
                <div className="button-group">
                  <Link
                    href="/articles"
                    className="elegant-button-cta group"
                  >
                    <span>Browse All Articles</span>
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/"
                    className="elegant-button-outline group"
                  >
                    <ArrowRightIcon className="h-4 w-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Back to Home</span>
                  </Link>
                </div>

                {/* Additional Stats */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {categories.reduce((total, cat) => total + getArticlesByCategory(cat).length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Total Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {categories.length}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {Math.round(categories.reduce((total, cat) => total + getArticlesByCategory(cat).length, 0) / categories.length)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Avg per Category</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}