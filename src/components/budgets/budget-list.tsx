"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface BudgetItem {
  id: string;
  amount: number;
  spent: number;
  category: {
    name: string;
    color: string | null;
  };
}

interface BudgetListProps {
  budgets: BudgetItem[];
  monthLabel: string;
}

export function BudgetList({ budgets, monthLabel }: BudgetListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/budgets?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({ title: "Budget deleted", variant: "success" });
        router.refresh();
      } else {
        toast({ title: "Failed to delete budget", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete budget", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgets for {monthLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No budgets set. Use the form to create one.
          </p>
        ) : (
          <div className="space-y-4">
            {budgets.map((b) => {
              const pct = b.amount > 0 ? (b.spent / b.amount) * 100 : 0;
              const overBudget = pct > 100;

              return (
                <div
                  key={b.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: b.category.color ?? "#64748b",
                        }}
                      />
                      <span className="text-sm font-medium">
                        {b.category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(b.spent)} / {formatCurrency(b.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(b.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${
                        overBudget ? "bg-expense" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  {overBudget && (
                    <p className="mt-1 text-xs text-expense">
                      Over budget by {formatCurrency(b.spent - b.amount)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete budget"
        description="This action cannot be undone. The budget will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Card>
  );
}
