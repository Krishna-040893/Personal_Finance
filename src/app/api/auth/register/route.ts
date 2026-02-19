import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { TransactionType } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const DEFAULT_CATEGORIES = [
  { name: "Salary", icon: "Briefcase", color: "#10b981", type: TransactionType.INCOME },
  { name: "Freelance", icon: "Laptop", color: "#06b6d4", type: TransactionType.INCOME },
  { name: "Investments", icon: "TrendingUp", color: "#8b5cf6", type: TransactionType.INCOME },
  { name: "Other Income", icon: "Plus", color: "#6366f1", type: TransactionType.INCOME },
  { name: "Housing", icon: "Home", color: "#ef4444", type: TransactionType.EXPENSE },
  { name: "Food & Dining", icon: "Utensils", color: "#f97316", type: TransactionType.EXPENSE },
  { name: "Transportation", icon: "Car", color: "#eab308", type: TransactionType.EXPENSE },
  { name: "Utilities", icon: "Zap", color: "#84cc16", type: TransactionType.EXPENSE },
  { name: "Healthcare", icon: "Heart", color: "#ec4899", type: TransactionType.EXPENSE },
  { name: "Entertainment", icon: "Film", color: "#a855f7", type: TransactionType.EXPENSE },
  { name: "Shopping", icon: "ShoppingBag", color: "#14b8a6", type: TransactionType.EXPENSE },
  { name: "Education", icon: "GraduationCap", color: "#2563eb", type: TransactionType.EXPENSE },
  { name: "Subscriptions", icon: "Repeat", color: "#f43f5e", type: TransactionType.EXPENSE },
  { name: "Other Expense", icon: "MoreHorizontal", color: "#64748b", type: TransactionType.EXPENSE },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // TODO: Hash password with bcrypt before storing in production
    const user = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    // Seed default categories for the new user
    await db.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        userId: user.id,
      })),
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
