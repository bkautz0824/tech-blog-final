'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { VideoBackground } from '@/components/video-background'
import { useThemeDetection } from '@/hooks/use-theme-detection'

export function HeroSection() {
  const currentTheme = useThemeDetection()

  return (
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
  )
}