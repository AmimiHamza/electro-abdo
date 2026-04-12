export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="w-full h-[320px] md:h-[480px] skeleton rounded-none" />

      {/* Categories skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Products skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="skeleton h-8 w-40 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="skeleton aspect-square rounded-none" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-5 w-1/3 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
