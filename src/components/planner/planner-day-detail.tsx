"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  day: number;
  monthLabel: string;
  items: CalendarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlannerDayDetail({ day, monthLabel, items, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const router = useRouter();

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
      onOpenChange(false);
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>
            {monthLabel} {day}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      item.type === "emi" ? "bg-primary" : "bg-chart-4"
                    }`}
                  />
                  <span className="text-body-sm font-medium">{item.name}</span>
                </div>
                <p className="ml-4 text-caption text-muted-foreground">{item.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
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
      </DialogContent>
    </Dialog>
  );
}
