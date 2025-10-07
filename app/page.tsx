import Link from 'next/link'
import { TagIcon } from '@heroicons/react/24/outline'
import { HeroSection } from '@/components/hero-section'
import { ArticlesGrid } from '@/components/articles/articles-grid'
import { getFeaturedArticles, getCategoriesCached, preloadArticles, preloadCategories } from '@/lib/articles-convex'
import { Suspense } from 'react'

// Preload data at build time
preloadArticles()
preloadCategories()

export default async function Home() {
  const [featuredData, categories] = await Promise.all([
    getFeaturedArticles(7),
    getCategoriesCached()
  ])

  const { latest, featured } = featuredData

  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest Article */}
      {latest && (
        <section className="py-16 lg:py-24 latest-article-glow">
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 animate-fade-in-down">
                <h2 className="elegant-title text-3xl lg:text-4xl font-bold mb-4 gradient-text-theme">
                  Latest Article
                </h2>
                <p className="text-lg text-muted-foreground">
                  Stay up-to-date with the newest tools and techniques
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full shadow-lg"
                     style={{
                       boxShadow: '0 0 10px rgba(var(--primary-rgb, 217, 119, 6), 0.4)'
                     }} />
              </div>

              <Suspense fallback={<div className="animate-pulse bg-card rounded-xl h-64" />}>
                <div className="animate-scale-in articles-grid-container" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                  <ArticlesGrid articles={[latest]} showFeatured={true} />
                </div>
              </Suspense>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles Grid */}
      {featured.length > 0 && (
        <section className="py-16 lg:py-24 featured-articles-glow">
          {/* Enhanced ambient lighting effects */}
          <div className="absolute top-20 left-10 w-48 h-48 bg-primary/8 rounded-full blur-3xl animate-gentle-bounce opacity-60" style={{ animationDelay: '1s', animationDuration: '6s' }} />
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-accent/8 rounded-full blur-3xl animate-gentle-bounce opacity-60" style={{ animationDelay: '2s', animationDuration: '8s' }} />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary/4 rounded-full blur-2xl animate-gentle-bounce opacity-40 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '3s', animationDuration: '10s' }} />

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-fade-in-up">
                <h2 className="elegant-title text-3xl lg:text-4xl font-bold mb-4 gradient-text-theme">
                  Featured Articles
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Handpicked articles covering the latest in development tools
                </p>
                <div className="flex justify-center items-center gap-6 mb-8">
                  <div className="h-px bg-gradient-to-r from-transparent to-primary flex-1 max-w-20 shadow-sm"
                       style={{
                         boxShadow: '0 0 4px rgba(var(--primary-rgb, 217, 119, 6), 0.3)'
                       }} />
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg"
                       style={{
                         boxShadow: '0 0 8px rgba(var(--primary-rgb, 217, 119, 6), 0.5)'
                       }} />
                  <div className="h-px bg-gradient-to-l from-transparent to-accent flex-1 max-w-20 shadow-sm"
                       style={{
                         boxShadow: '0 0 4px rgba(var(--accent-rgb, 234, 88, 12), 0.3)'
                       }} />
                </div>
              </div>

              <Suspense fallback={<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-card rounded-xl h-64" />
                ))}
              </div>}>
                <div className="articles-grid-container">
                  <ArticlesGrid articles={featured} />
                </div>
              </Suspense>

              <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
                <Link
                  href="/articles"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 transition-colors duration-200"
                >
                  <span className="font-medium text-sm">View All Articles</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 lg:py-24 categories-glow">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up mb-16">
              <h2 className="elegant-title text-3xl lg:text-4xl font-bold mb-4 gradient-text-theme">
                Explore by Category
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Find articles that match your interests and expertise
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-lg"
                   style={{
                     boxShadow: '0 0 12px rgba(var(--primary-rgb, 217, 119, 6), 0.4)'
                   }} />
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
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 transition-colors duration-200"
                  >
                    <TagIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
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