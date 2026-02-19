import { Skeleton } from "@/components/ui/skeleton";

export default function CreditCardsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" className="h-8 w-44" />
          <Skeleton variant="text" className="mt-1 h-4 w-60" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-card">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton variant="text" className="h-5 w-36" />
                  <Skeleton variant="text" className="mt-1 h-3.5 w-48" />
                </div>
                <Skeleton variant="circular" className="h-8 w-8" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <Skeleton variant="text" className="h-3 w-10 mb-1" />
                  <Skeleton variant="text" className="h-5 w-20" />
                </div>
                <div>
                  <Skeleton variant="text" className="h-3 w-20 mb-1" />
                  <Skeleton variant="text" className="h-5 w-16" />
                </div>
                <div>
                  <Skeleton variant="text" className="h-3 w-16 mb-1" />
                  <Skeleton variant="text" className="h-5 w-14" />
                </div>
              </div>
              <Skeleton className="mt-3 h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
