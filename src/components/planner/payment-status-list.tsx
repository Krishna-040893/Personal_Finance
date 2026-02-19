"use client";

import { formatCurrency } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface CalendarItem {
  id: string;
  type: "emi" | "subscription";
  name: string;
  subtitle: string;
  amount: number;
  dueDate: string;
  day: number;
  status: "UPCOMING" | "PAID" | "MISSED";
}

interface Props {
  items: CalendarItem[];
  filter: "pending" | "completed";
}

export function PaymentStatusList({ items, filter }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const filtered =
    filter === "pending"
      ? items.filter((i) => i.status === "UPCOMING" || i.status === "MISSED")
      : items.filter((i) => i.status === "PAID");

  const markPaid = async (item: CalendarItem) => {
    const endpoint =
      item.type === "emi" ? "/api/loans/payments" : "/api/subscriptions/payments";

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: item.id, status: "PAID" }),
      });
      if (!res.ok) throw new Error();
      toast({ title: `${item.name} marked as paid`, variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  if (filtered.length === 0) {
    return (
      <p className="py-4 text-center text-body-sm text-muted-foreground">
        {filter === "pending" ? "All payments up to date!" : "No completed payments yet."}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border border-border p-3"
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-2 w-2 rounded-full ${
                item.type === "emi" ? "bg-primary" : "bg-chart-4"
              }`}
            />
            <div>
              <p className="text-body-sm font-medium">{item.name}</p>
              <p className="text-caption text-muted-foreground">{item.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-body-sm font-semibold">
              {formatCurrency(item.amount)}
            </span>
            <PaymentStatusBadge status={item.status} />
            {item.status !== "PAID" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => markPaid(item)}
                className="h-7 gap-1 text-caption"
              >
                <Check className="h-3 w-3" />
                Pay
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
