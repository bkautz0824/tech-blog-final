export default function ArticlesLoading() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-16 animate-pulse">
            <div className="h-12 bg-card rounded-lg w-64 mx-auto mb-6"></div>
            <div className="h-4 bg-card rounded w-96 mx-auto mb-2"></div>
            <div className="h-4 bg-card rounded w-80 mx-auto"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="elegant-card h-80 bg-card/50">
                  <div className="h-6 bg-card rounded w-20 mb-4"></div>
                  <div className="h-8 bg-card rounded w-full mb-3"></div>
                  <div className="h-4 bg-card rounded w-full mb-2"></div>
                  <div className="h-4 bg-card rounded w-3/4 mb-6"></div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-card rounded w-16"></div>
                    <div className="h-6 bg-card rounded w-20"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-card rounded w-20"></div>
                    <div className="h-4 bg-card rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}