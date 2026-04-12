export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6 items-center">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-4 w-4" />
        <div className="skeleton h-4 w-24" />
      </div>

      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="skeleton h-4 w-24" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="skeleton h-3 w-full" />
              ))}
            </div>
          ))}
        </aside>

        {/* Products grid skeleton */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-9 w-36 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                <div className="skeleton aspect-square rounded-none" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-1/3" />
                  <div className="skeleton h-4 w-5/6" />
                  <div className="skeleton h-5 w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
