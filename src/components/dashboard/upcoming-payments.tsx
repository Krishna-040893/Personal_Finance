"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { Landmark, Repeat, CalendarDays } from "lucide-react";
import Link from "next/link";

interface UpcomingPayment {
  id: string;
  type: "emi" | "subscription";
  name: string;
  amount: number;
  dueDate: string;
  status: "UPCOMING" | "PAID" | "MISSED";
}

export function UpcomingPayments({ payments }: { payments: UpcomingPayment[] }) {
  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="mb-4 font-display text-h4 font-semibold">Upcoming Payments</h2>
        <p className="text-body-sm text-muted-foreground">
          No upcoming payments. Add loans or subscriptions to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-h4 font-semibold">Upcoming Payments</h2>
        <Link
          href="/planner"
          className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          View Planner
        </Link>
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between rounded-lg border border-border-subtle p-3"
          >
            <div className="flex items-center gap-3">
              {payment.type === "emi" ? (
                <div className="rounded-lg bg-primary-muted p-2">
                  <Landmark className="h-4 w-4 text-primary" />
                </div>
              ) : (
                <div className="rounded-lg bg-chart-4/20 p-2">
                  <Repeat className="h-4 w-4 text-chart-4" />
                </div>
              )}
              <div>
                <p className="text-body-sm font-medium">{payment.name}</p>
                <p className="text-caption text-muted-foreground">
                  Due {formatDate(payment.dueDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-body-sm font-semibold">
                {formatCurrency(payment.amount)}
              </span>
              <PaymentStatusBadge status={payment.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
