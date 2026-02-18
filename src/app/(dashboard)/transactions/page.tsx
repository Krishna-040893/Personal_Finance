export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";

// TODO: Replace with actual auth user ID
const DEV_USER_ID = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

export default async function TransactionsPage() {
  const userId = await DEV_USER_ID();

  const [transactions, categories] = await Promise.all([
    userId
      ? db.transaction.findMany({
          where: { userId },
          include: { category: true },
          orderBy: { date: "desc" },
          take: 50,
        })
      : [],
    userId
      ? db.category.findMany({
          where: { userId },
          orderBy: { name: "asc" },
        })
      : [],
  ]);

  const serializedTransactions = transactions.map((t) => ({
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

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          Add and manage your income and expenses
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
        <TransactionForm categories={serializedCategories} />
        <TransactionList transactions={serializedTransactions} />
      </div>
    </div>
  );
}
