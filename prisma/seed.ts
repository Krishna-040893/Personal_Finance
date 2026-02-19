import { PrismaClient, TransactionType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateEMI, generateAmortizationSchedule } from "../src/lib/utils";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  // Income categories
  { name: "Salary", icon: "Briefcase", color: "#10b981", type: TransactionType.INCOME },
  { name: "Freelance", icon: "Laptop", color: "#06b6d4", type: TransactionType.INCOME },
  { name: "Investments", icon: "TrendingUp", color: "#8b5cf6", type: TransactionType.INCOME },
  { name: "Other Income", icon: "Plus", color: "#6366f1", type: TransactionType.INCOME },

  // Expense categories
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

async function main() {
  console.log("Seeding database...");

  // Create a default user for development (password: "password123")
  const hashedPassword = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "dev@example.com" },
    update: {},
    create: {
      email: "dev@example.com",
      name: "Dev User",
      password: hashedPassword,
    },
  });

  // Create default categories
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: {
        name_userId_type: {
          name: cat.name,
          userId: user.id,
          type: cat.type,
        },
      },
      update: {},
      create: {
        ...cat,
        userId: user.id,
      },
    });
  }

  // ─── Sample Loan: Home Loan ────────────────────────────
  console.log("Seeding loans...");

  const existingLoan = await prisma.loan.findFirst({
    where: { userId: user.id, name: "Home Loan" },
  });

  if (!existingLoan) {
    const principal = 500000;
    const rate = 8.5;
    const tenure = 240;
    const dueDay = 5;
    const startDate = new Date(2025, 0, 5); // Jan 2025

    const emi = calculateEMI(principal, rate, tenure);
    const schedule = generateAmortizationSchedule(principal, rate, tenure, startDate, dueDay);

    await prisma.loan.create({
      data: {
        name: "Home Loan",
        lenderName: "SBI Bank",
        principalAmount: principal,
        interestRate: rate,
        tenureMonths: tenure,
        emiAmount: Math.round(emi * 100) / 100,
        startDate,
        dueDay,
        remainingBalance: principal,
        status: "ACTIVE",
        userId: user.id,
        emiPayments: {
          create: schedule.map((entry) => ({
            month: entry.month,
            year: entry.year,
            dueDate: entry.dueDate,
            amount: entry.emi,
            principalPart: entry.principal,
            interestPart: entry.interest,
            status: "UPCOMING",
            userId: user.id,
          })),
        },
      },
    });

    console.log("  Created Home Loan with EMI schedule");
  }

  // ─── Sample Credit Card ────────────────────────────────
  console.log("Seeding credit cards...");

  let card = await prisma.creditCard.findFirst({
    where: { userId: user.id, name: "Amazon Pay ICICI" },
  });

  if (!card) {
    card = await prisma.creditCard.create({
      data: {
        name: "Amazon Pay ICICI",
        issuer: "ICICI Bank",
        cardLimit: 200000,
        billingCycleDay: 1,
        paymentDueDay: 18,
        userId: user.id,
      },
    });
    console.log("  Created Amazon Pay ICICI card");
  }

  // ─── Sample Subscriptions ─────────────────────────────
  console.log("Seeding subscriptions...");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const subs = [
    { name: "Netflix", amount: 15.99, billingDay: 10, category: "PERSONAL" as const },
    { name: "GitHub Copilot", amount: 19.0, billingDay: 15, category: "WORK" as const },
    { name: "Spotify", amount: 9.99, billingDay: 20, category: "PERSONAL" as const },
  ];

  for (const sub of subs) {
    const existing = await prisma.subscription.findFirst({
      where: { userId: user.id, name: sub.name, creditCardId: card.id },
    });

    if (!existing) {
      const subscription = await prisma.subscription.create({
        data: {
          name: sub.name,
          amount: sub.amount,
          billingDay: sub.billingDay,
          category: sub.category,
          isActive: true,
          creditCardId: card.id,
          userId: user.id,
        },
      });

      // Create payment record for current month
      await prisma.subscriptionPayment.create({
        data: {
          subscriptionId: subscription.id,
          month: currentMonth,
          year: currentYear,
          dueDate: new Date(currentYear, currentMonth - 1, sub.billingDay),
          amount: sub.amount,
          status: "UPCOMING",
          userId: user.id,
        },
      });

      console.log(`  Created subscription: ${sub.name}`);
    }
  }

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
