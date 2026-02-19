import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { ensureMonthlyPayments } from "@/lib/payment-sync";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

    // Ensure subscription payments exist for this month
    await ensureMonthlyPayments(userId, month, year);

    // Fetch EMI payments for the month
    const emiPayments = await db.emiPayment.findMany({
      where: { userId, month, year },
      include: { loan: { select: { name: true, lenderName: true } } },
      orderBy: { dueDate: "asc" },
    });

    // Fetch subscription payments for the month
    const subscriptionPayments = await db.subscriptionPayment.findMany({
      where: { userId, month, year },
      include: {
        subscription: {
          select: { name: true, category: true, creditCard: { select: { name: true } } },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    // Fetch income for the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const incomeAgg = await db.transaction.aggregate({
      where: { userId, type: "INCOME", date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    });

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalEMIs = emiPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalSubscriptions = subscriptionPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const discretionaryRemaining = totalIncome - totalEMIs - totalSubscriptions;

    // Build calendar items
    const calendarItems = [
      ...emiPayments.map((p) => ({
        id: p.id,
        type: "emi" as const,
        name: p.loan.name,
        subtitle: p.loan.lenderName,
        amount: Number(p.amount),
        dueDate: p.dueDate.toISOString(),
        day: p.dueDate.getDate(),
        status: p.status,
      })),
      ...subscriptionPayments.map((p) => ({
        id: p.id,
        type: "subscription" as const,
        name: p.subscription.name,
        subtitle: `${p.subscription.creditCard.name} (${p.subscription.category})`,
        amount: Number(p.amount),
        dueDate: p.dueDate.toISOString(),
        day: p.dueDate.getDate(),
        status: p.status,
      })),
    ].sort((a, b) => a.day - b.day);

    return NextResponse.json({
      month,
      year,
      summary: {
        totalIncome,
        totalEMIs,
        totalSubscriptions,
        discretionaryRemaining,
      },
      calendarItems,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch planner data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
