import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse-soft bg-muted",
        {
          "rounded-md": variant === "rectangular",
          "rounded-full": variant === "circular",
          "h-4 w-full rounded-sm": variant === "text",
        },
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between pb-4">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="circular" className="h-8 w-8" />
      </div>
      <Skeleton variant="text" className="h-7 w-32" />
      <Skeleton variant="text" className="mt-2 h-3 w-20" />
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" className="h-9 w-9 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-3.5 w-3/5" />
            <Skeleton variant="text" className="h-3 w-2/5" />
          </div>
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
