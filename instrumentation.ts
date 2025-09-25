/**
 * Next.js 15 Instrumentation
 * Enables advanced monitoring, RSC optimization, and performance tracking
 */

export async function register() {
  // Only run instrumentation in Node.js environment (server-side)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // React Server Components optimization
    const { performance } = await import('perf_hooks');

    // Track RSC rendering performance with proper typing
    let rscObserver: any = null;
    if (typeof PerformanceObserver !== 'undefined') {
      rscObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('rsc') || entry.name.includes('server-component')) {
            console.log(`RSC Performance: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });

      try {
        rscObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        // Performance observer not supported in this environment
        console.log('Performance observer not available');
        rscObserver = null;
      }
    }

    // Next.js 15 build-time optimizations
    if (process.env.NODE_ENV === 'production') {
      // Enable advanced caching for articles
      process.env.NEXT_CACHE_REVALIDATE_ARTICLES = '86400'; // 24 hours
      process.env.NEXT_CACHE_REVALIDATE_DEFAULT = '3600';   // 1 hour

      // Optimize bundle analysis
      if (process.env.ANALYZE === 'true') {
        console.log('Bundle analysis enabled for Next.js 15');
        // Bundle analyzer would be loaded via withBundleAnalyzer in next.config.mjs
      }
    }

    // Development optimizations
    if (process.env.NODE_ENV === 'development') {
      // Enable Turbopack for faster builds
      process.env.TURBOPACK = '1';

      // Enhanced development logging
      console.log('🚀 Next.js 15 with Turbopack enabled');
      console.log('🔥 React Server Components active');
      console.log('⚡ Performance monitoring active');
    }

    // Register custom performance markers
    performance.mark('app-initialization-start');

    // Add cleanup for graceful shutdowns
    process.on('SIGTERM', () => {
      performance.mark('app-shutdown-start');
      if (rscObserver && typeof rscObserver.disconnect === 'function') {
        rscObserver.disconnect();
      }
    });

    performance.mark('app-initialization-end');
    performance.measure('app-initialization', 'app-initialization-start', 'app-initialization-end');
  }
}

// Export for use in other parts of the application
export const config = {
  runtime: 'nodejs',
  regions: ['iad1'], // Optimize for primary region
  maxDuration: 30,   // Max execution time for serverless functions
};