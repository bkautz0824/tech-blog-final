import Link from 'next/link'
import { TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { ArticlesGrid } from '@/components/articles/articles-grid'
import { getArticlesCached, preloadArticles } from '@/lib/articles-convex'
import type { Metadata } from 'next'
import { Suspense } from 'react'

// Preload articles at build time
preloadArticles()

export const metadata: Metadata = {
  title: 'All Articles | Tech Blog',
  description: 'Explore our complete collection of articles covering modern development tools, frameworks, and best practices.',
  keywords: ['development tools', 'programming', 'web development', 'software engineering', 'tech articles'],
  openGraph: {
    title: 'All Articles | Tech Blog',
    description: 'Explore our complete collection of articles covering modern development tools, frameworks, and best practices.',
    type: 'website',
  },
  alternates: {
    canonical: '/articles',
  },
}

export default async function ArticlesPage() {
  const articles = await getArticlesCached()

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="elegant-title text-4xl lg:text-5xl font-bold mb-6 gradient-text-theme">
              All Articles
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Discover our complete collection of articles covering the latest development tools,
              frameworks, and techniques that are shaping the future of software engineering.
            </p>
            <div className="flex justify-center items-center gap-6">
              <div className="h-px bg-gradient-to-r from-transparent to-primary flex-1 max-w-32" />
              <div className="text-primary text-sm font-medium bg-primary/10 px-4 py-1 rounded-full">
                {articles.length} Articles
              </div>
              <div className="h-px bg-gradient-to-l from-transparent to-accent flex-1 max-w-32" />
            </div>
          </div>

          {/* Articles Grid */}
          <Suspense fallback={
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-card rounded-xl h-64" />
              ))}
            </div>
          }>
            <ArticlesGrid articles={articles} />
          </Suspense>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="elegant-title text-2xl lg:text-3xl font-bold mb-4">
                Stay Updated
              </h3>
              <p className="text-muted-foreground mb-8">
                New articles are added regularly. Check back soon for the latest development tools and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="elegant-button group">
                  <span>Back to Home</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link href="/categories" className="elegant-button-outline group">
                  <TagIcon className="h-4 w-4 mr-2" />
                  <span>Browse Categories</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}