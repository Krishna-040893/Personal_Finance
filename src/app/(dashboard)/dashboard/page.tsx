export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { getCurrentMonth, getCurrentYear } from "@/lib/utils";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments";
import { ensureMonthlyPayments } from "@/lib/payment-sync";

export default async function DashboardPage() {
  const userId = await getAuthUserId();
  const now = new Date();
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  // Fetch current month transactions
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Fetch budgets for current month
  const budgets = await db.budget.findMany({
    where: { userId, month: currentMonth, year: currentYear },
  });

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const budgetRemaining = totalBudget - totalExpenses;

  // Build monthly chart data (last 6 months) — single query
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const allChartTxs = await db.transaction.findMany({
    where: { userId, date: { gte: sixMonthsAgo, lte: endOfCurrentMonth } },
    select: { amount: true, type: true, date: true },
  });

  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthlyMap.set(key, { income: 0, expenses: 0 });
  }

  for (const t of allChartTxs) {
    const key = `${t.date.getFullYear()}-${t.date.getMonth()}`;
    const bucket = monthlyMap.get(key);
    if (bucket) {
      if (t.type === "INCOME") bucket.income += Number(t.amount);
      else bucket.expenses += Number(t.amount);
    }
  }

  const monthlyData: { month: string; income: number; expenses: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = monthlyMap.get(key)!;
    monthlyData.push({
      month: d.toLocaleString("en-IN", { month: "short" }),
      income: bucket.income,
      expenses: bucket.expenses,
    });
  }

  // Category breakdown for expenses this month
  const expensesByCategory = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce<Record<string, { name: string; value: number; color: string }>>(
      (acc, t) => {
        const key = t.categoryId;
        if (!acc[key]) {
          acc[key] = {
            name: t.category.name,
            value: 0,
            color: t.category.color ?? "#64748b",
          };
        }
        acc[key].value += Number(t.amount);
        return acc;
      },
      {}
    );

  const categoryData = Object.values(expensesByCategory);

  // Upcoming payments (next 5 EMI + subscription payments)
  await ensureMonthlyPayments(userId, currentMonth, currentYear);

  const upcomingEMIs = await db.emiPayment.findMany({
    where: { userId, status: "UPCOMING" },
    include: { loan: { select: { name: true } } },
    orderBy: { dueDate: "asc" },
    take: 5,
  });

  const upcomingSubs = await db.subscriptionPayment.findMany({
    where: { userId, status: "UPCOMING" },
    include: { subscription: { select: { name: true } } },
    orderBy: { dueDate: "asc" },
    take: 5,
  });

  const upcomingPayments = [
    ...upcomingEMIs.map((p) => ({
      id: p.id,
      type: "emi" as const,
      name: p.loan.name,
      amount: Number(p.amount),
      dueDate: p.dueDate.toISOString(),
      status: p.status,
    })),
    ...upcomingSubs.map((p) => ({
      id: p.id,
      type: "subscription" as const,
      name: p.subscription.name,
      amount: Number(p.amount),
      dueDate: p.dueDate.toISOString(),
      status: p.status,
    })),
  ]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5).map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    type: t.type,
    description: t.description,
    date: t.date.toISOString(),
    category: {
      name: t.category.name,
      color: t.category.color,
    },
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Your financial overview for{" "}
          {now.toLocaleString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        budgetRemaining={budgetRemaining}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart data={monthlyData} />
        <CategoryChart data={categoryData} title="Expenses by Category" />
      </div>

      <UpcomingPayments payments={upcomingPayments} />

      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
}
