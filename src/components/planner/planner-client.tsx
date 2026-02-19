"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlannerSummary } from "./planner-summary";
import { PlannerCalendar } from "./planner-calendar";
import { PaymentStatusList } from "./payment-status-list";

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

interface Summary {
  totalIncome: number;
  totalEMIs: number;
  totalSubscriptions: number;
  discretionaryRemaining: number;
}

interface Props {
  month: number;
  year: number;
  summary: Summary;
  calendarItems: CalendarItem[];
}

export function PlannerClient({ month, year, summary, calendarItems }: Props) {
  return (
    <div className="space-y-6">
      <PlannerSummary summary={summary} />

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <PlannerCalendar month={month} year={year} items={calendarItems} />
        </TabsContent>

        <TabsContent value="pending">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 font-display font-semibold">Pending Payments</h3>
            <PaymentStatusList items={calendarItems} filter="pending" />
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 font-display font-semibold">Completed Payments</h3>
            <PaymentStatusList items={calendarItems} filter="completed" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
