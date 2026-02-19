"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { LoanDetailDialog } from "./loan-detail-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface EmiPayment {
  id: string;
  month: number;
  year: number;
  dueDate: string;
  amount: number;
  principalPart: number;
  interestPart: number;
  status: "UPCOMING" | "PAID" | "MISSED";
  paidDate: string | null;
}

interface Loan {
  id: string;
  name: string;
  lenderName: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  startDate: string;
  dueDay: number;
  remainingBalance: number;
  status: "ACTIVE" | "CLOSED" | "DEFAULTED";
  emiPayments: EmiPayment[];
}

export function LoanList({ loans }: { loans: Loan[] }) {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this loan and all its EMI records?")) return;

    try {
      const res = await fetch(`/api/loans?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Loan deleted", variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  if (loans.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
        <p className="text-muted-foreground">No loans yet. Add your first loan to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {loans.map((loan) => {
          const paidCount = loan.emiPayments.filter((p) => p.status === "PAID").length;
          const totalCount = loan.emiPayments.length;
          const progressPercent = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;

          return (
            <div
              key={loan.id}
              onClick={() => setSelectedLoan(loan)}
              className="cursor-pointer rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold">{loan.name}</h3>
                  <p className="text-body-sm text-muted-foreground">{loan.lenderName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-caption font-semibold ${
                      loan.status === "ACTIVE"
                        ? "bg-primary-muted text-primary"
                        : loan.status === "CLOSED"
                        ? "bg-success-muted text-success"
                        : "bg-destructive-muted text-destructive"
                    }`}
                  >
                    {loan.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(loan.id, e)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-body-sm">
                <div>
                  <span className="text-muted-foreground">EMI</span>
                  <p className="font-mono font-semibold">{formatCurrency(loan.emiAmount)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Remaining</span>
                  <p className="font-mono font-semibold">{formatCurrency(loan.remainingBalance)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rate</span>
                  <p className="font-mono font-semibold">{loan.interestRate}%</p>
                </div>
              </div>

              <div className="mt-4">
                <Progress
                  value={paidCount}
                  max={totalCount}
                  variant="success"
                  size="sm"
                  showLabel
                  label={`${paidCount} / ${totalCount} EMIs paid`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {selectedLoan && (
        <LoanDetailDialog
          loan={selectedLoan}
          open={!!selectedLoan}
          onOpenChange={(open) => !open && setSelectedLoan(null)}
        />
      )}
    </>
  );
}
