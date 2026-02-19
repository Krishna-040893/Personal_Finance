import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const getUserId = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

const updatePaymentSchema = z.object({
  paymentId: z.string().min(1),
  status: z.enum(["PAID", "MISSED", "UPCOMING"]),
});

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updatePaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { paymentId, status } = parsed.data;

    const payment = await db.emiPayment.findFirst({
      where: { id: paymentId, userId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Use a transaction for atomicity when marking as paid
    if (status === "PAID" && payment.status !== "PAID") {
      const [updatedPayment] = await db.$transaction([
        db.emiPayment.update({
          where: { id: paymentId },
          data: { status: "PAID", paidDate: new Date() },
        }),
        db.loan.update({
          where: { id: payment.loanId },
          data: {
            remainingBalance: { decrement: payment.principalPart },
          },
        }),
      ]);

      // Check if all EMIs are now paid — close the loan
      const unpaid = await db.emiPayment.count({
        where: { loanId: payment.loanId, status: { not: "PAID" } },
      });

      if (unpaid === 0) {
        await db.loan.update({
          where: { id: payment.loanId },
          data: { status: "CLOSED", remainingBalance: 0 },
        });
      }

      return NextResponse.json(updatedPayment);
    }

    // For reverting or marking missed
    if (status === "UPCOMING" && payment.status === "PAID") {
      // Reverting a paid payment — add balance back
      const [updatedPayment] = await db.$transaction([
        db.emiPayment.update({
          where: { id: paymentId },
          data: { status: "UPCOMING", paidDate: null },
        }),
        db.loan.update({
          where: { id: payment.loanId },
          data: {
            remainingBalance: { increment: payment.principalPart },
            status: "ACTIVE",
          },
        }),
      ]);
      return NextResponse.json(updatedPayment);
    }

    const updatedPayment = await db.emiPayment.update({
      where: { id: paymentId },
      data: {
        status,
        paidDate: status === "PAID" ? new Date() : null,
      },
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error("Failed to update EMI payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
