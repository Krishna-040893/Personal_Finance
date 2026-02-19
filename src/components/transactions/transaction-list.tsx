"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  category: {
    name: string;
    color: string | null;
  };
}

interface TransactionListProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function TransactionList({
  transactions,
  currentPage,
  totalPages,
  totalCount,
}: TransactionListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/transactions?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({ title: "Transaction deleted", variant: "success" });
        router.refresh();
      } else {
        toast({ title: "Failed to delete transaction", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete transaction", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  function goToPage(page: number) {
    router.push(`/transactions?page=${page}`);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Transactions</CardTitle>
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {totalCount} total
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No transactions yet. Add your first one using the form.
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: tx.category.color ?? "#64748b",
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {tx.description || tx.category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.date)} &middot; {tx.category.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === "INCOME" ? "text-income" : "text-expense"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                  <Badge variant={tx.type === "INCOME" ? "income" : "expense"}>
                    {tx.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteId(tx.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete transaction"
        description="This action cannot be undone. The transaction will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Card>
  );
}
