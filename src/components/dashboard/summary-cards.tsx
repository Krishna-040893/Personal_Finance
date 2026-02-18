"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetRemaining: number;
}

export function SummaryCards({
  totalIncome,
  totalExpenses,
  balance,
  budgetRemaining,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-income",
      bgColor: "bg-income/10",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      color: "text-expense",
      bgColor: "bg-expense/10",
    },
    {
      title: "Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-income" : "text-expense",
      bgColor: balance >= 0 ? "bg-income/10" : "bg-expense/10",
    },
    {
      title: "Budget Remaining",
      value: budgetRemaining,
      icon: PiggyBank,
      color: budgetRemaining >= 0 ? "text-income" : "text-expense",
      bgColor: budgetRemaining >= 0 ? "bg-income/10" : "bg-expense/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
