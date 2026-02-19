import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as "INCOME" | "EXPENSE" | null;

    const categories = await db.category.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
