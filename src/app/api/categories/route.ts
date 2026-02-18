import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// TODO: Replace with actual auth user ID
const getUserId = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
