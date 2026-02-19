import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function LoansLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" className="h-8 w-40" />
          <Skeleton variant="text" className="mt-1 h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <Skeleton variant="text" className="h-5 w-36" />
                <Skeleton variant="text" className="mt-1 h-3.5 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <Skeleton variant="text" className="h-3 w-12 mb-1" />
                <Skeleton variant="text" className="h-5 w-20" />
              </div>
              <div>
                <Skeleton variant="text" className="h-3 w-16 mb-1" />
                <Skeleton variant="text" className="h-5 w-24" />
              </div>
              <div>
                <Skeleton variant="text" className="h-3 w-10 mb-1" />
                <Skeleton variant="text" className="h-5 w-14" />
              </div>
            </div>
            <Skeleton className="mt-4 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
