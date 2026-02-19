import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  format?: "currency" | "number" | "percentage";
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  format = "currency",
  className,
  ...props
}: StatCardProps) {
  const resolvedTrend =
    trend ?? (change != null ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : undefined);

  const trendColors: Record<string, string> = {
    up: "text-success bg-success-muted",
    down: "text-destructive bg-destructive-muted",
    neutral: "text-muted-foreground bg-muted",
  };

  const trendIcons: Record<string, React.ElementType> = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const formatValue = (v: number) => {
    switch (format) {
      case "currency":
        return formatCurrency(v);
      case "percentage":
        return `${v.toFixed(1)}%`;
      case "number":
        return new Intl.NumberFormat("en-IN").format(v);
    }
  };

  const TrendIcon = resolvedTrend ? trendIcons[resolvedTrend] : null;

  return (
    <div
      className={cn(
        "group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-muted-foreground">
          {title}
        </span>
        {Icon && (
          <div className="rounded-lg bg-primary-muted p-2 transition-colors group-hover:bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-3 font-mono text-h3 font-bold tabular-nums tracking-tight text-foreground">
        {formatValue(value)}
      </div>

      {/* Trend badge */}
      {resolvedTrend && change != null && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-caption font-semibold",
              trendColors[resolvedTrend]
            )}
          >
            {TrendIcon && <TrendIcon className="h-3 w-3" />}
            <span className="font-mono tabular-nums">
              {change > 0 && "+"}
              {change.toFixed(1)}%
            </span>
          </span>
          <span className="text-caption text-muted-foreground">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
