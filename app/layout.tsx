import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { AppWrapper } from '@/components/app-wrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dev Tools Blog - Modern Development Insights',
  description: 'Discover cutting-edge development tools, frameworks, and resources that elevate your productivity and craft.',
  keywords: 'development tools, programming, web development, frameworks, developer resources',
  authors: [{ name: 'Dev Tools Blog Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#d97706' },
    { media: '(prefers-color-scheme: dark)', color: '#c026d3' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`} style={{'--font-geist-sans': GeistSans.style.fontFamily, '--font-geist-mono': GeistMono.style.fontFamily} as React.CSSProperties}>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all duration-200"
        >
          Skip to main content
        </a>

        <AppWrapper>
          <main id="main-content" className="flex-1" role="main" aria-label="Main content">
            {children}
          </main>
          <footer
            className="border-t border-border/40 bg-muted/20 mt-24"
            role="contentinfo"
            aria-label="Site footer"
          >
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
              <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                  <h3 className="elegant-title text-lg font-semibold mb-3">Dev Tools Blog</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Modern development insights and cutting-edge tools for today's developers.
                  </p>
                </div>
                <nav aria-label="Footer navigation">
                  <h4 className="font-medium mb-3">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <a
                        href="/articles"
                        className="hover:text-primary transition-colors focus:text-primary focus:underline"
                        aria-describedby="articles-desc"
                      >
                        Articles
                      </a>
                      <span id="articles-desc" className="sr-only">View all development articles</span>
                    </li>
                    <li>
                      <a
                        href="/categories"
                        className="hover:text-primary transition-colors focus:text-primary focus:underline"
                        aria-describedby="categories-desc"
                      >
                        Categories
                      </a>
                      <span id="categories-desc" className="sr-only">Browse articles by category</span>
                    </li>
                  </ul>
                </nav>
                <div>
                  <h4 className="font-medium mb-3">Technologies</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.
                  </p>
                </div>
              </div>
              <div className="border-t border-border/40 mt-8 pt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  © <time dateTime="2025">2025</time> Dev Tools Blog. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </AppWrapper>
      </body>
    </html>
  )
}