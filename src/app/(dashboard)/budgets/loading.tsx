import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function BudgetsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton variant="text" className="h-8 w-36" />
        <Skeleton variant="text" className="mt-1 h-4 w-56" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Form skeleton */}
        <SkeletonCard className="h-fit" />

        {/* Budget list skeleton */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <Skeleton variant="text" className="h-5 w-44 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" className="h-3 w-3" />
                    <Skeleton variant="text" className="h-4 w-24" />
                  </div>
                  <Skeleton variant="text" className="h-3 w-28" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
