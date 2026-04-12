// Skeleton loading components — match the actual layout shapes

export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden flex-shrink-0 w-56 sm:w-64">
      <SkeletonBox className="w-full aspect-square" />
      <div className="p-3 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <SkeletonBox className="h-5 w-20" />
          <SkeletonBox className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <SkeletonBox className="w-full aspect-square" />
          <div className="p-3 space-y-2">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
            <SkeletonBox className="h-8 w-full rounded-lg mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroCarouselSkeleton() {
  return (
    <div className="w-full h-[420px] md:h-[520px] lg:h-[600px] skeleton" />
  );
}

export function SectionSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div className="container-shop py-12 space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonBox className="h-7 w-48" />
            <SkeletonBox className="h-4 w-64" />
          </div>
          <SkeletonBox className="h-8 w-24 rounded-full" />
        </div>
      )}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBox className="w-full aspect-square" />
      <div className="p-3 space-y-2">
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-3 w-20" />
        </div>
      </div>
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-5/6" />
      <SkeletonBox className="h-3 w-4/6" />
    </div>
  );
}
