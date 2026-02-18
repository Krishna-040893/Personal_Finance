"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
}

interface TransactionFormProps {
  categories: Category[];
}

export function TransactionForm({ categories }: TransactionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      amount: parseFloat(formData.get("amount") as string),
      type,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      categoryId: formData.get("categoryId") as string,
    };

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                type === "EXPENSE"
                  ? "bg-expense text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                type === "INCOME"
                  ? "bg-income text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Amount</label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <Select name="categoryId" required>
              <option value="">Select category...</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Input
              name="description"
              type="text"
              placeholder="What was this for?"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Date</label>
            <Input
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
