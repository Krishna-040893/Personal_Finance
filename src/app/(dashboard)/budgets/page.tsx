export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getCurrentMonth, getCurrentYear, getMonthName } from "@/lib/utils";
import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetList } from "@/components/budgets/budget-list";

// TODO: Replace with actual auth user ID
const DEV_USER_ID = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

export default async function BudgetsPage() {
  const userId = await DEV_USER_ID();
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const [budgets, expenseCategories] = await Promise.all([
    userId
      ? db.budget.findMany({
          where: { userId, month: currentMonth, year: currentYear },
          include: { category: true },
        })
      : [],
    userId
      ? db.category.findMany({
          where: { userId, type: "EXPENSE" },
          orderBy: { name: "asc" },
        })
      : [],
  ]);

  // Calculate spent per budget category
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  const budgetItems = await Promise.all(
    budgets.map(async (b) => {
      const spent = await db.transaction.aggregate({
        where: {
          userId,
          categoryId: b.categoryId,
          type: "EXPENSE",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      });

      return {
        id: b.id,
        amount: b.amount,
        spent: spent._sum.amount ?? 0,
        category: {
          name: b.category.name,
          color: b.category.color,
        },
      };
    })
  );

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
