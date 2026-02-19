"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

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
  remainingBalance: number;
  status: string;
  emiPayments: EmiPayment[];
}

interface Props {
  loan: Loan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoanDetailDialog({ loan, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const markPaid = async (paymentId: string) => {
    try {
      const res = await fetch("/api/loans/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, status: "PAID" }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "EMI marked as paid", variant: "success" });
      router.refresh();
      onOpenChange(false);
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const paidCount = loan.emiPayments.filter((p) => p.status === "PAID").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{loan.name}</DialogTitle>
          <DialogDescription>
            {loan.lenderName} &middot; {loan.interestRate}% p.a. &middot;{" "}
            {formatCurrency(loan.principalAmount)} principal
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
          <div className="text-center">
            <p className="text-caption text-muted-foreground">Monthly EMI</p>
            <p className="font-mono font-semibold">{formatCurrency(loan.emiAmount)}</p>
          </div>
          <div className="text-center">
            <p className="text-caption text-muted-foreground">Remaining</p>
            <p className="font-mono font-semibold">{formatCurrency(loan.remainingBalance)}</p>
          </div>
          <div className="text-center">
            <p className="text-caption text-muted-foreground">Progress</p>
            <p className="font-mono font-semibold">
              {paidCount}/{loan.tenureMonths}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-display font-semibold">EMI Schedule</h3>
          <div className="space-y-2">
            {loan.emiPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-body-sm">
                    <p className="font-medium">
                      {new Date(0, payment.month - 1).toLocaleString("en-IN", { month: "short" })}{" "}
                      {payment.year}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      Due: {formatDate(payment.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-body-sm">
                    <p className="font-mono font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-caption text-muted-foreground">
                      P: {formatCurrency(payment.principalPart)} &middot; I:{" "}
                      {formatCurrency(payment.interestPart)}
                    </p>
                  </div>
                  <PaymentStatusBadge status={payment.status} />
                  {payment.status === "UPCOMING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markPaid(payment.id)}
                      className="h-8 gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Pay
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
