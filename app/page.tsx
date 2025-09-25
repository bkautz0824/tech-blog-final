'use client'

import Link from 'next/link'
import { articles, getAllCategories } from '@/lib/articles'
import { CalendarIcon, TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { VideoBackground } from '@/components/video-background'
import { useThemeDetection } from '@/hooks/use-theme-detection'

export default function Home() {
  const currentTheme = useThemeDetection()
  const featuredArticles = articles.slice(0, 6)
  const categories = getAllCategories()
  const latestArticle = articles[0]
  const otherFeatured = featuredArticles.slice(1)

  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden min-h-[80vh]">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <VideoBackground theme={currentTheme} className="w-full h-full rounded-none" />
        </div>

        {/* Enhanced gradient overlay for superior text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-background/85 via-background/70 to-background/85" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/60 via-transparent to-background/40" />

        <div className="container mx-auto px-6 lg:px-8 relative z-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="elegant-title text-5xl lg:text-7xl font-bold mb-8 drop-shadow-2xl">
              <span className="gradient-text drop-shadow-lg">Modern</span> Development
              <br />
              <span className="text-foreground/90 drop-shadow-lg">Tools & Insights</span>
            </h1>
            <p className="text-xl lg:text-2xl text-foreground/80 leading-relaxed mb-12 max-w-3xl mx-auto drop-shadow-md font-medium">
              Discover cutting-edge development tools, frameworks, and resources that elevate your productivity and craft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <Link href="/articles" className="elegant-button group micro-bounce">
                <span>Explore Articles</span>
                <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link href="/categories" className="group inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 micro-bounce">
                <span className="font-medium text-sm group-hover:text-primary transition-colors duration-300">Browse Categories</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {latestArticle && (
        <section className="py-16 lg:py-24 relative overflow-hidden">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2 animate-pulse" style={{ animationDuration: '8s' }} />

          <div className="container mx-auto px-6 lg:px-8 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 animate-fade-in-down">
                <h2 className="elegant-title text-3xl lg:text-4xl font-bold mb-4 gradient-text-theme">
                  Latest Article
                </h2>
                <p className="text-lg text-muted-foreground">
                  Stay up-to-date with the newest tools and techniques
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full" />
              </div>

              <div className="animate-scale-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                <Link href={`/articles/${latestArticle.id}`} className="group block">
                  <article className="elegant-card p-8 lg:p-12 max-w-4xl mx-auto relative overflow-hidden hover:scale-[1.01] transition-all duration-500 ease-out">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        <TagIcon className="h-4 w-4" />
                        {latestArticle.category}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(latestArticle.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className="elegant-title text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      {latestArticle.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {latestArticle.description}
                    </p>

                    {latestArticle.keyFeatures && (
                      <div className="flex flex-wrap gap-2">
                        {latestArticle.keyFeatures.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles Grid */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden">
        {/* Animated decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-gentle-bounce" style={{ animationDelay: '1s', animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-gentle-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }} />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="elegant-title text-3xl lg:text-4xl font-bold mb-4 gradient-text-theme">
                Featured Articles
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Handpicked articles covering the latest in development tools
              </p>
              <div className="flex justify-center items-center gap-6 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent to-primary flex-1 max-w-20" />
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="h-px bg-gradient-to-l from-transparent to-accent flex-1 max-w-20" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherFeatured.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-stagger"
                  style={{
                    animationDelay: `${index * 150 + 300}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <Link
                    href={`/articles/${article.id}`}
                    className="group block h-full"
                  >
                    <article className="elegant-card h-full flex flex-col relative overflow-hidden group-hover:scale-[1.03] transition-all duration-400 ease-out hover:shadow-2xl">
                      {/* Subtle hover gradient overlay */}
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

                        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                          {article.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50 group-hover:border-primary/30 transition-colors duration-300">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
                            <time dateTime={article.date}>
                              {new Date(article.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </time>
                          </div>

                          <div className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-accent transition-colors duration-300">
                            <span>Read more</span>
                            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
              <Link
                href="/articles"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 micro-bounce"
              >
                <span className="font-medium text-sm group-hover:text-primary transition-colors duration-300">View All Articles</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/2 via-transparent to-accent/2" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up mb-16">
              <h2 className="elegant-title text-3xl lg:text-4xl font-bold mb-4 gradient-text-theme">
                Explore by Category
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Find articles that match your interests and expertise
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <div
                  key={category}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100 + 200}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <Link
                    href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 micro-bounce"
                  >
                    <TagIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                    <span className="font-medium text-sm group-hover:text-primary transition-colors duration-300">
                      {category}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}