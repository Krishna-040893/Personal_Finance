export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { getCurrentMonth, getCurrentYear, getMonthName } from "@/lib/utils";
import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetList } from "@/components/budgets/budget-list";

export default async function BudgetsPage() {
  const userId = await getAuthUserId();
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const [budgets, expenseCategories] = await Promise.all([
    db.budget.findMany({
      where: { userId, month: currentMonth, year: currentYear },
      include: { category: true },
    }),
    db.category.findMany({
      where: { userId, type: "EXPENSE" },
      orderBy: { name: "asc" },
    }),
  ]);

  // Calculate spent per budget category — single groupBy query
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  const categoryIds = budgets.map((b) => b.categoryId);

  const spentByCategory = categoryIds.length > 0
    ? await db.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId,
          categoryId: { in: categoryIds },
          type: "EXPENSE",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      })
    : [];

  const spentMap = new Map(
    spentByCategory.map((row) => [row.categoryId, Number(row._sum.amount ?? 0)])
  );

  const budgetItems = budgets.map((b) => ({
    id: b.id,
    amount: Number(b.amount),
    spent: spentMap.get(b.categoryId) ?? 0,
    category: {
      name: b.category.name,
      color: b.category.color,
    },
  }));

  const serializedCategories = expenseCategories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const monthLabel = `${getMonthName(currentMonth)} ${currentYear}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="text-muted-foreground">
          Set spending limits for each category
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
        <BudgetForm categories={serializedCategories} />
        <BudgetList budgets={budgetItems} monthLabel={monthLabel} />
      </div>
    </div>
  );
}
