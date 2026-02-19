import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "destructive" | "income" | "expense";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = "default",
      size = "md",
      showLabel = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const barColors: Record<string, string> = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
      income: "bg-income",
      expense: "bg-expense",
    };

    const trackSizes: Record<string, string> = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {(showLabel || label) && (
          <div className="mb-1.5 flex items-center justify-between text-body-sm">
            {label && (
              <span className="font-medium text-foreground">{label}</span>
            )}
            {showLabel && (
              <span className="font-mono text-muted-foreground tabular-nums">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            "w-full overflow-hidden rounded-full bg-secondary",
            trackSizes[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-smooth",
              barColors[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
