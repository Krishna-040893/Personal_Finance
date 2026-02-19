import { cn } from "@/lib/utils";

type PaymentStatus = "UPCOMING" | "PAID" | "MISSED";

const statusStyles: Record<PaymentStatus, string> = {
  UPCOMING: "bg-warning-muted text-warning",
  PAID: "bg-success-muted text-success",
  MISSED: "bg-destructive-muted text-destructive",
};

const statusLabels: Record<PaymentStatus, string> = {
  UPCOMING: "Upcoming",
  PAID: "Paid",
  MISSED: "Missed",
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
