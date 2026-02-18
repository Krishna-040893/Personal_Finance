import { PrismaClient, TransactionType } from "@prisma/client";

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

  // Create a default user for development
  const user = await prisma.user.upsert({
    where: { email: "dev@example.com" },
    update: {},
    create: {
      email: "dev@example.com",
      name: "Dev User",
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
