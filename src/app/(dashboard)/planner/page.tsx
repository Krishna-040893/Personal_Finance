export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { getCurrentMonth, getCurrentYear, getMonthName } from "@/lib/utils";
import { ensureMonthlyPayments } from "@/lib/payment-sync";
import { PlannerClient } from "@/components/planner/planner-client";

export default async function PlannerPage() {
  const userId = await getAuthUserId();
  const month = getCurrentMonth();
  const year = getCurrentYear();

  // Ensure subscription payments exist
  await ensureMonthlyPayments(userId, month, year);

  // Fetch EMI payments for the month
  const emiPayments = await db.emiPayment.findMany({
    where: { userId, month, year },
    include: { loan: { select: { name: true, lenderName: true } } },
    orderBy: { dueDate: "asc" },
  });

  // Fetch subscription payments for the month
  const subscriptionPayments = await db.subscriptionPayment.findMany({
    where: { userId, month, year },
    include: {
      subscription: {
        select: { name: true, category: true, creditCard: { select: { name: true } } },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  // Fetch income for the month
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const incomeAgg = await db.transaction.aggregate({
    where: { userId, type: "INCOME", date: { gte: startOfMonth, lte: endOfMonth } },
    _sum: { amount: true },
  });

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalEMIs = emiPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalSubscriptions = subscriptionPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const calendarItems = [
    ...emiPayments.map((p) => ({
      id: p.id,
      type: "emi" as const,
      name: p.loan.name,
      subtitle: p.loan.lenderName,
      amount: Number(p.amount),
      dueDate: p.dueDate.toISOString(),
      day: p.dueDate.getDate(),
      status: p.status,
    })),
    ...subscriptionPayments.map((p) => ({
      id: p.id,
      type: "subscription" as const,
      name: p.subscription.name,
      subtitle: `${p.subscription.creditCard.name} (${p.subscription.category})`,
      amount: Number(p.amount),
      dueDate: p.dueDate.toISOString(),
      day: p.dueDate.getDate(),
      status: p.status,
    })),
  ].sort((a, b) => a.day - b.day);

  const summary = {
    totalIncome,
    totalEMIs,
    totalSubscriptions,
    discretionaryRemaining: totalIncome - totalEMIs - totalSubscriptions,
  };

  const monthLabel = `${getMonthName(month)} ${year}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Monthly Planner</h1>
        <p className="text-muted-foreground">
          Overview of all obligations for {monthLabel}
        </p>
      </div>

      <PlannerClient
        month={month}
        year={year}
        summary={summary}
        calendarItems={calendarItems}
      />
    </div>
  );
}
