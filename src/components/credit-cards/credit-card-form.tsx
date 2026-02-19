"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function CreditCardForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    issuer: "",
    cardLimit: "",
    billingCycleDay: "1",
    paymentDueDay: "15",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/credit-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          issuer: form.issuer,
          cardLimit: parseFloat(form.cardLimit),
          billingCycleDay: parseInt(form.billingCycleDay),
          paymentDueDay: parseInt(form.paymentDueDay),
        }),
      });

      if (!res.ok) throw new Error();

      toast({ title: "Credit card added", variant: "success" });
      setForm({ name: "", issuer: "", cardLimit: "", billingCycleDay: "1", paymentDueDay: "15" });
      router.refresh();
    } catch {
      toast({ title: "Failed to add card", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4"
    >
      <h2 className="text-h4 font-display font-semibold">Add Credit Card</h2>

      <div className="space-y-3">
        <div>
          <label className="text-body-sm font-medium text-muted-foreground">Card Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Amazon Pay ICICI"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-body-sm font-medium text-muted-foreground">Issuer</label>
          <input
            type="text"
            required
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            placeholder="e.g. ICICI Bank"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-body-sm font-medium text-muted-foreground">Card Limit (₹)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.cardLimit}
            onChange={(e) => setForm({ ...form, cardLimit: e.target.value })}
            placeholder="100000"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Billing Day</label>
            <input
              type="number"
              required
              min="1"
              max="28"
              value={form.billingCycleDay}
              onChange={(e) => setForm({ ...form, billingCycleDay: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Payment Due Day</label>
            <input
              type="number"
              required
              min="1"
              max="28"
              value={form.paymentDueDay}
              onChange={(e) => setForm({ ...form, paymentDueDay: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Card"}
      </Button>
    </form>
  );
}
