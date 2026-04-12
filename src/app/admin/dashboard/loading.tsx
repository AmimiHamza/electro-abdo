export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48 rounded" />
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 space-y-3">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-8 w-16 rounded" />
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="skeleton h-5 w-32 rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-4">
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-4 w-24 rounded ms-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
