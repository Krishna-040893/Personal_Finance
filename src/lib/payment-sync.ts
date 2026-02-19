import { db } from "@/lib/db";

/**
 * Ensures UPCOMING payment records exist for all active loans and subscriptions
 * for the given month/year. Idempotent — skips if records already exist.
 */
export async function ensureMonthlyPayments(
  userId: string,
  month: number,
  year: number
) {
  // 1. Subscription payments for active subscriptions
  const activeSubscriptions = await db.subscription.findMany({
    where: { userId, isActive: true },
  });

  for (const sub of activeSubscriptions) {
    const existing = await db.subscriptionPayment.findUnique({
      where: {
        subscriptionId_month_year: {
          subscriptionId: sub.id,
          month,
          year,
        },
      },
    });

    if (!existing) {
      const dueDate = new Date(year, month - 1, sub.billingDay);
      await db.subscriptionPayment.create({
        data: {
          subscriptionId: sub.id,
          month,
          year,
          dueDate,
          amount: sub.amount,
          status: "UPCOMING",
          userId,
        },
      });
    }
  }
}
