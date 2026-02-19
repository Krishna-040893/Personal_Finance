"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { calculateEMI, formatCurrency } from "@/lib/utils";

export function LoanForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lenderName: "",
    principalAmount: "",
    interestRate: "",
    tenureMonths: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDay: "5",
  });

  const principal = parseFloat(form.principalAmount) || 0;
  const rate = parseFloat(form.interestRate) || 0;
  const tenure = parseInt(form.tenureMonths) || 0;
  const calculatedEMI = principal > 0 && tenure > 0 ? calculateEMI(principal, rate, tenure) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          lenderName: form.lenderName,
          principalAmount: principal,
          interestRate: rate,
          tenureMonths: tenure,
          startDate: form.startDate,
          dueDay: parseInt(form.dueDay),
        }),
      });

      if (!res.ok) throw new Error("Failed to create loan");

      toast({ title: "Loan added", variant: "success" });
      setForm({
        name: "",
        lenderName: "",
        principalAmount: "",
        interestRate: "",
        tenureMonths: "",
        startDate: new Date().toISOString().split("T")[0],
        dueDay: "5",
      });
      router.refresh();
    } catch {
      toast({ title: "Failed to add loan", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4"
    >
      <h2 className="text-h4 font-display font-semibold">Add New Loan</h2>

      <div className="space-y-3">
        <div>
          <label className="text-body-sm font-medium text-muted-foreground">Loan Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Home Loan"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-body-sm font-medium text-muted-foreground">Lender</label>
          <input
            type="text"
            required
            value={form.lenderName}
            onChange={(e) => setForm({ ...form, lenderName: e.target.value })}
            placeholder="e.g. SBI Bank"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Principal (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.principalAmount}
              onChange={(e) => setForm({ ...form, principalAmount: e.target.value })}
              placeholder="500000"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Interest Rate (%)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.interestRate}
              onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
              placeholder="8.5"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Tenure (months)</label>
            <input
              type="number"
              required
              min="1"
              value={form.tenureMonths}
              onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
              placeholder="240"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Due Day</label>
            <input
              type="number"
              required
              min="1"
              max="28"
              value={form.dueDay}
              onChange={(e) => setForm({ ...form, dueDay: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-body-sm font-medium text-muted-foreground">Start Date</label>
          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {calculatedEMI > 0 && (
        <div className="rounded-lg bg-primary-muted p-3">
          <span className="text-body-sm text-muted-foreground">Calculated EMI: </span>
          <span className="font-mono font-semibold text-primary">
            {formatCurrency(Math.round(calculatedEMI * 100) / 100)}
          </span>
          <span className="text-caption text-muted-foreground"> /month</span>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Loan"}
      </Button>
    </form>
  );
}
