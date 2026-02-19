"use client";

import { formatCurrency } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { Button } from "@/components/ui/button";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface SubscriptionPayment {
  id: string;
  status: "UPCOMING" | "PAID" | "MISSED";
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay: number;
  category: "WORK" | "PERSONAL";
  isActive: boolean;
  payments: SubscriptionPayment[];
}

export function SubscriptionList({ subscriptions }: { subscriptions: Subscription[] }) {
  const { toast } = useToast();
  const router = useRouter();

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      if (!res.ok) throw new Error();
      toast({ title: `Subscription ${isActive ? "paused" : "activated"}`, variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const deleteSubscription = async (id: string) => {
    if (!confirm("Delete this subscription?")) return;
    try {
      const res = await fetch(`/api/subscriptions?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Subscription deleted", variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  if (subscriptions.length === 0) {
    return (
      <p className="py-3 text-center text-body-sm text-muted-foreground">
        No subscriptions yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {subscriptions.map((sub) => {
        const latestPayment = sub.payments[0];

        return (
          <div
            key={sub.id}
            className="flex items-center justify-between rounded-lg border border-border-subtle p-3"
          >
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm font-medium">{sub.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-overline font-semibold uppercase ${
                      sub.category === "WORK"
                        ? "bg-info-muted text-info"
                        : "bg-primary-muted text-primary"
                    }`}
                  >
                    {sub.category}
                  </span>
                  {!sub.isActive && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-overline text-muted-foreground">
                      PAUSED
                    </span>
                  )}
                </div>
                <p className="text-caption text-muted-foreground">
                  {formatCurrency(sub.amount)}/mo &middot; Day {sub.billingDay}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {latestPayment && <PaymentStatusBadge status={latestPayment.status} />}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleActive(sub.id, sub.isActive)}
                className="h-8 w-8"
                title={sub.isActive ? "Pause" : "Activate"}
              >
                {sub.isActive ? (
                  <ToggleRight className="h-4 w-4 text-success" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteSubscription(sub.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
