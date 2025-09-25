import Link from 'next/link'
import { TagIcon } from '@heroicons/react/24/outline'
import { HeroSection } from '@/components/hero-section'
import { ArticlesGrid } from '@/components/articles/articles-grid'
import { getFeaturedArticles, getCategoriesCached, preloadArticles, preloadCategories } from '@/lib/articles-server'
import { Suspense } from 'react'

// Preload data at build time
preloadArticles()
preloadCategories()

export default async function Home() {
  const [featuredData, categories] = await Promise.all([
    getFeaturedArticles(6),
    getCategoriesCached()
  ])

  const { latest, featured } = featuredData

  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest Article */}
      {latest && (
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

              <Suspense fallback={<div className="animate-pulse bg-card rounded-xl h-64" />}>
                <div className="animate-scale-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                  <ArticlesGrid articles={[latest]} showFeatured={true} />
                </div>
              </Suspense>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles Grid */}
      {featured.length > 0 && (
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

              <Suspense fallback={<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-card rounded-xl h-64" />
                ))}
              </div>}>
                <ArticlesGrid articles={featured} />
              </Suspense>

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
      )}

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