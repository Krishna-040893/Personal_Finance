"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMonth, getCurrentYear } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface BudgetFormProps {
  categories: Category[];
}

export function BudgetForm({ categories }: BudgetFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      amount: parseFloat(formData.get("amount") as string),
      categoryId: formData.get("categoryId") as string,
      month: parseInt(formData.get("month") as string),
      year: parseInt(formData.get("year") as string),
    };

    const res = await fetch("/api/budgets", {
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
        <CardTitle>Set Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <Select name="categoryId" required>
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Budget Amount
            </label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Month</label>
              <Select name="month" defaultValue={getCurrentMonth()}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleString("en-IN", {
                      month: "long",
                    })}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Year</label>
              <Input
                name="year"
                type="number"
                defaultValue={getCurrentYear()}
                min={2020}
                max={2100}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Set Budget"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
