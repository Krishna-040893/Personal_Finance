export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getCurrentMonth, getCurrentYear } from "@/lib/utils";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments";
import { ensureMonthlyPayments } from "@/lib/payment-sync";

// TODO: Replace with actual auth user ID
const DEV_USER_ID = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

export default async function DashboardPage() {
  const userId = await DEV_USER_ID();
  const now = new Date();
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  // Fetch current month transactions
  const transactions = userId
    ? await db.transaction.findMany({
        where: {
          userId,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        include: { category: true },
        orderBy: { date: "desc" },
      })
    : [];

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Fetch budgets for current month
  const budgets = userId
    ? await db.budget.findMany({
        where: { userId, month: currentMonth, year: currentYear },
      })
    : [];

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetRemaining = totalBudget - totalExpenses;

  // Build monthly chart data (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    const monthTxs = userId
      ? await db.transaction.findMany({
          where: { userId, date: { gte: monthStart, lte: monthEnd } },
        })
      : [];

    monthlyData.push({
      month: d.toLocaleString("en-IN", { month: "short" }),
      income: monthTxs
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0),
      expenses: monthTxs
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0),
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
        acc[key].value += t.amount;
        return acc;
      },
      {}
    );

  const categoryData = Object.values(expensesByCategory);

  // Upcoming payments (next 5 EMI + subscription payments)
  await ensureMonthlyPayments(userId, currentMonth, currentYear);

  const upcomingEMIs = userId
    ? await db.emiPayment.findMany({
        where: { userId, status: "UPCOMING" },
        include: { loan: { select: { name: true } } },
        orderBy: { dueDate: "asc" },
        take: 5,
      })
    : [];

  const upcomingSubs = userId
    ? await db.subscriptionPayment.findMany({
        where: { userId, status: "UPCOMING" },
        include: { subscription: { select: { name: true } } },
        orderBy: { dueDate: "asc" },
        take: 5,
      })
    : [];

  const upcomingPayments = [
    ...upcomingEMIs.map((p) => ({
      id: p.id,
      type: "emi" as const,
      name: p.loan.name,
      amount: p.amount,
      dueDate: p.dueDate.toISOString(),
      status: p.status,
    })),
    ...upcomingSubs.map((p) => ({
      id: p.id,
      type: "subscription" as const,
      name: p.subscription.name,
      amount: p.amount,
      dueDate: p.dueDate.toISOString(),
      status: p.status,
    })),
  ]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5).map((t) => ({
    id: t.id,
    amount: t.amount,
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
