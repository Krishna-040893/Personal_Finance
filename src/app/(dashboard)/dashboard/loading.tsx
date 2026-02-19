import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="text" className="mt-1 h-4 w-64" />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Chart area */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <Skeleton variant="text" className="h-5 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <Skeleton variant="text" className="h-5 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
