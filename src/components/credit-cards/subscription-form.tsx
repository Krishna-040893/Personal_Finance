"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface Props {
  creditCardId: string;
  creditCardName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionForm({ creditCardId, creditCardName, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    billingDay: "1",
    category: "PERSONAL" as "WORK" | "PERSONAL",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          amount: parseFloat(form.amount),
          billingDay: parseInt(form.billingDay),
          category: form.category,
          creditCardId,
        }),
      });

      if (!res.ok) throw new Error();

      toast({ title: "Subscription added", variant: "success" });
      setForm({ name: "", amount: "", billingDay: "1", category: "PERSONAL" });
      onOpenChange(false);
      router.refresh();
    } catch {
      toast({ title: "Failed to add subscription", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Add Subscription to {creditCardName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Netflix"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-body-sm font-medium text-muted-foreground">Amount (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="15.99"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-body-sm font-medium text-muted-foreground">Billing Day</label>
              <input
                type="number"
                required
                min="1"
                max="28"
                value={form.billingDay}
                onChange={(e) => setForm({ ...form, billingDay: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-body-sm font-medium text-muted-foreground">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as "WORK" | "PERSONAL" })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-body-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="PERSONAL">Personal</option>
              <option value="WORK">Work</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Subscription"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
