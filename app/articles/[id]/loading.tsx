export default function ArticleLoading() {
  return (
    <article className="max-w-4xl mx-auto animate-pulse">
      {/* Article Header Skeleton */}
      <header className="mb-8">
        <div className="mb-3">
          <div className="h-4 bg-card rounded w-24"></div>
        </div>
        <div className="mb-3">
          <div className="h-6 bg-card rounded w-32"></div>
        </div>
        <div className="h-8 bg-card rounded w-full mb-3"></div>
        <div className="h-6 bg-card rounded w-3/4 mb-3"></div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-card rounded w-32"></div>
        </div>
      </header>

      {/* Article Content Skeleton */}
      <div className="space-y-8">
        <div className="bg-card border-2 border-border rounded-lg p-6">
          <div className="space-y-4">
            <div className="h-4 bg-card/50 rounded w-full"></div>
            <div className="h-4 bg-card/50 rounded w-5/6"></div>
            <div className="h-4 bg-card/50 rounded w-4/5"></div>
            <div className="h-4 bg-card/50 rounded w-full"></div>
            <div className="h-4 bg-card/50 rounded w-3/4"></div>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-6">
          <div className="h-6 bg-card/50 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-card/50 rounded w-full"></div>
            <div className="h-4 bg-card/50 rounded w-4/5"></div>
            <div className="h-4 bg-card/50 rounded w-5/6"></div>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-6">
          <div className="h-6 bg-card/50 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-card/50 rounded w-full"></div>
            <div className="h-4 bg-card/50 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <nav className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="h-10 bg-card rounded w-32"></div>
        <div className="h-10 bg-card rounded w-32"></div>
      </nav>
    </article>
  )
}