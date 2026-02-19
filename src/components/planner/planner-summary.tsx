"use client";

import { StatCard } from "@/components/ui/stat-card";
import { IndianRupee, Landmark, Repeat, Wallet } from "lucide-react";

interface Summary {
  totalIncome: number;
  totalEMIs: number;
  totalSubscriptions: number;
  discretionaryRemaining: number;
}

export function PlannerSummary({ summary }: { summary: Summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Monthly Income"
        value={summary.totalIncome}
        icon={IndianRupee}
        trend="neutral"
      />
      <StatCard
        title="EMI Obligations"
        value={summary.totalEMIs}
        icon={Landmark}
        trend="neutral"
      />
      <StatCard
        title="Subscriptions"
        value={summary.totalSubscriptions}
        icon={Repeat}
        trend="neutral"
      />
      <StatCard
        title="Remaining"
        value={summary.discretionaryRemaining}
        icon={Wallet}
        trend={summary.discretionaryRemaining >= 0 ? "up" : "down"}
      />
    </div>
  );
}
