import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function PlannerLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="text" className="mt-1 h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-card">
        <Skeleton variant="text" className="h-5 w-32 mb-4" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={`h-${i}`} variant="text" className="h-4 w-full" />
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
