import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { createTransactionSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

    const body = await req.json();
    const parsed = createTransactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const transaction = await db.transaction.create({
      data: {
        amount: parsed.data.amount,
        type: parsed.data.type,
        description: parsed.data.description ?? null,
        date: new Date(parsed.data.date),
        categoryId: parsed.data.categoryId,
        userId,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to create transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as "INCOME" | "EXPENSE" | null;
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "50") || 50, 1), 200);

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      include: { category: true },
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Ensure the transaction belongs to the user
    const transaction = await db.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.transaction.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to delete transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
