export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { redirect } from "next/navigation";

const PAGE_SIZE = 20;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const userId = await getAuthUserId();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);

  const [transactions, totalCount, categories] = await Promise.all([
    db.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.transaction.count({ where: { userId } }),
    db.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Guard against empty last page
  if (page > totalPages && totalPages > 0) {
    redirect(`/transactions?page=${totalPages}`);
  }

  const serializedTransactions = transactions.map((t) => ({
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
        <TransactionList
          transactions={serializedTransactions}
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
