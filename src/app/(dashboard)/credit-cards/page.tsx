export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { CreditCardForm } from "@/components/credit-cards/credit-card-form";
import { CreditCardList } from "@/components/credit-cards/credit-card-list";

export default async function CreditCardsPage() {
  const userId = await getAuthUserId();

  const cards = await db.creditCard.findMany({
    where: { userId },
    include: {
      subscriptions: {
        include: {
          payments: {
            orderBy: [{ year: "desc" }, { month: "desc" }],
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedCards = cards.map((card) => {
    const cardLimit = Number(card.cardLimit);
    const activeSubscriptionTotal = card.subscriptions
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + Number(s.amount), 0);

    return {
      id: card.id,
      name: card.name,
      issuer: card.issuer,
      cardLimit,
      billingCycleDay: card.billingCycleDay,
      paymentDueDay: card.paymentDueDay,
      activeSubscriptionTotal,
      utilization: cardLimit > 0 ? (activeSubscriptionTotal / cardLimit) * 100 : 0,
      subscriptions: card.subscriptions.map((sub) => ({
        id: sub.id,
        name: sub.name,
        amount: Number(sub.amount),
        billingDay: sub.billingDay,
        category: sub.category,
        isActive: sub.isActive,
        payments: sub.payments.map((p) => ({
          id: p.id,
          status: p.status,
        })),
      })),
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Credit Cards</h1>
        <p className="text-muted-foreground">
          Manage your credit cards and subscriptions
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
        <CreditCardForm />
        <CreditCardList cards={serializedCards} />
      </div>
    </div>
  );
}
