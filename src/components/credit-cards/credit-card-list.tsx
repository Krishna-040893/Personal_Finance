"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { SubscriptionList } from "./subscription-list";
import { SubscriptionForm } from "./subscription-form";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface SubscriptionPayment {
  id: string;
  status: "UPCOMING" | "PAID" | "MISSED";
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay: number;
  category: "WORK" | "PERSONAL";
  isActive: boolean;
  payments: SubscriptionPayment[];
}

interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  cardLimit: number;
  billingCycleDay: number;
  paymentDueDay: number;
  activeSubscriptionTotal: number;
  utilization: number;
  subscriptions: Subscription[];
}

export function CreditCardList({ cards }: { cards: CreditCard[] }) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [addSubCard, setAddSubCard] = useState<{ id: string; name: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteCard = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/credit-cards?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Card deleted", variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
        <p className="text-muted-foreground">No credit cards yet. Add your first card to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {cards.map((card) => {
          const isExpanded = expandedCard === card.id;
          const utilizationVariant =
            card.utilization > 75
              ? "destructive"
              : card.utilization > 50
              ? "warning"
              : "default";

          return (
            <div
              key={card.id}
              className="rounded-xl border border-border bg-card shadow-card"
            >
              <div
                className="flex cursor-pointer items-start justify-between p-5"
                onClick={() => setExpandedCard(isExpanded ? null : card.id)}
              >
                <div>
                  <h3 className="font-display font-semibold">{card.name}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {card.issuer} &middot; Billing day {card.billingCycleDay} &middot; Due day{" "}
                    {card.paymentDueDay}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(card.id);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="px-5 pb-2">
                <div className="grid grid-cols-3 gap-4 text-body-sm">
                  <div>
                    <span className="text-muted-foreground">Limit</span>
                    <p className="font-mono font-semibold">{formatCurrency(card.cardLimit)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subscriptions</span>
                    <p className="font-mono font-semibold">{formatCurrency(card.activeSubscriptionTotal)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Utilization</span>
                    <p className="font-mono font-semibold">{card.utilization.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="mt-3 mb-3">
                  <Progress
                    value={card.utilization}
                    max={100}
                    variant={utilizationVariant}
                    size="sm"
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border-subtle p-5 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-body-sm font-semibold">Subscriptions</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddSubCard({ id: card.id, name: card.name });
                      }}
                      className="gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                  <SubscriptionList subscriptions={card.subscriptions} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {addSubCard && (
        <SubscriptionForm
          creditCardId={addSubCard.id}
          creditCardName={addSubCard.name}
          open={!!addSubCard}
          onOpenChange={(open) => !open && setAddSubCard(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete credit card"
        description="This will permanently delete the card and all its subscriptions. This action cannot be undone."
        onConfirm={handleDeleteCard}
        loading={deleting}
      />
    </>
  );
}
