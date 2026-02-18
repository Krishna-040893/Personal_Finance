import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "income" | "expense";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-secondary text-secondary-foreground": variant === "default",
          "bg-income/10 text-income": variant === "income",
          "bg-expense/10 text-expense": variant === "expense",
        },
        className
      )}
      {...props}
    />
  );
}
