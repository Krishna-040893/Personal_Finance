import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateAmortizationSchedule, calculateEMI } from "@/lib/utils";
import { z } from "zod";

const getUserId = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

const createLoanSchema = z.object({
  name: z.string().min(1),
  lenderName: z.string().min(1),
  principalAmount: z.number().positive(),
  interestRate: z.number().min(0),
  tenureMonths: z.number().int().positive(),
  startDate: z.string(),
  dueDay: z.number().int().min(1).max(28),
  emiAmount: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createLoanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, lenderName, principalAmount, interestRate, tenureMonths, startDate, dueDay } = parsed.data;
    const emiAmount = parsed.data.emiAmount ?? calculateEMI(principalAmount, interestRate, tenureMonths);
    const emiRounded = Math.round(emiAmount * 100) / 100;

    const schedule = generateAmortizationSchedule(
      principalAmount,
      interestRate,
      tenureMonths,
      new Date(startDate),
      dueDay
    );

    const loan = await db.loan.create({
      data: {
        name,
        lenderName,
        principalAmount,
        interestRate,
        tenureMonths,
        emiAmount: emiRounded,
        startDate: new Date(startDate),
        dueDay,
        remainingBalance: principalAmount,
        userId,
        emiPayments: {
          create: schedule.map((entry) => ({
            month: entry.month,
            year: entry.year,
            dueDate: entry.dueDate,
            amount: entry.emi,
            principalPart: entry.principal,
            interestPart: entry.interest,
            status: "UPCOMING",
            userId,
          })),
        },
      },
      include: { emiPayments: true },
    });

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    console.error("Failed to create loan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as "ACTIVE" | "CLOSED" | "DEFAULTED" | null;

    const loans = await db.loan.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: {
        emiPayments: {
          orderBy: [{ year: "asc" }, { month: "asc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error("Failed to fetch loans:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const loan = await db.loan.findFirst({ where: { id, userId } });
    if (!loan) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.loan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete loan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
