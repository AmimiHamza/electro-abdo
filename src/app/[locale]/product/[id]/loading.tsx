export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6 items-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="skeleton h-4 w-20" />
            {i < 2 && <div className="skeleton h-4 w-3" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton w-16 h-16 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-5 w-32" />
          <div className="flex gap-3">
            <div className="skeleton h-8 w-28" />
            <div className="skeleton h-8 w-20" />
          </div>
          <div className="skeleton h-px w-full my-4" />
          <div className="flex gap-3">
            <div className="skeleton h-12 w-32 rounded-xl" />
            <div className="skeleton h-12 flex-1 rounded-xl" />
            <div className="skeleton h-12 w-12 rounded-xl" />
          </div>
          <div className="space-y-2 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`skeleton h-3 ${i % 3 === 2 ? "w-4/5" : "w-full"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
