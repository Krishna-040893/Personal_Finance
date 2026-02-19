export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { LoanForm } from "@/components/loans/loan-form";
import { LoanList } from "@/components/loans/loan-list";

const DEV_USER_ID = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

export default async function LoansPage() {
  const userId = await DEV_USER_ID();

  const loans = userId
    ? await db.loan.findMany({
        where: { userId },
        include: {
          emiPayments: {
            orderBy: [{ year: "asc" }, { month: "asc" }],
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const serializedLoans = loans.map((loan) => ({
    ...loan,
    startDate: loan.startDate.toISOString(),
    createdAt: loan.createdAt.toISOString(),
    updatedAt: loan.updatedAt.toISOString(),
    emiPayments: loan.emiPayments.map((p) => ({
      ...p,
      dueDate: p.dueDate.toISOString(),
      paidDate: p.paidDate?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
    })),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Loans & EMIs</h1>
        <p className="text-muted-foreground">
          Track your loans and monthly EMI payments
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
        <LoanForm />
        <LoanList loans={serializedLoans} />
      </div>
    </div>
  );
}
