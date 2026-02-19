import { db } from "@/lib/db";

/**
 * Ensures UPCOMING payment records exist for all active subscriptions
 * for the given month/year. Idempotent — skipDuplicates ignores existing rows.
 */
export async function ensureMonthlyPayments(
  userId: string,
  month: number,
  year: number
) {
  const activeSubscriptions = await db.subscription.findMany({
    where: { userId, isActive: true },
  });

  if (activeSubscriptions.length === 0) return;

  await db.subscriptionPayment.createMany({
    data: activeSubscriptions.map((sub) => ({
      subscriptionId: sub.id,
      month,
      year,
      dueDate: new Date(year, month - 1, sub.billingDay),
      amount: sub.amount,
      status: "UPCOMING" as const,
      userId,
    })),
    skipDuplicates: true,
  });
}
