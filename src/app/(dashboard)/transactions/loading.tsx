import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="text" className="mt-1 h-4 w-64" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Form skeleton */}
        <SkeletonCard className="h-fit" />

        {/* List skeleton */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <Skeleton variant="text" className="h-5 w-36 mb-6" />
          <SkeletonTable rows={8} />
        </div>
      </div>
    </div>
  );
}
