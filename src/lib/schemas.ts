import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Transaction                                                        */
/* ------------------------------------------------------------------ */

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().optional(),
  date: z.string(),
  categoryId: z.string().min(1),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

/* ------------------------------------------------------------------ */
/*  Budget                                                             */
/* ------------------------------------------------------------------ */

export const createBudgetSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

/* ------------------------------------------------------------------ */
/*  Loan                                                               */
/* ------------------------------------------------------------------ */

export const createLoanSchema = z.object({
  name: z.string().min(1),
  lenderName: z.string().min(1),
  principalAmount: z.number().positive(),
  interestRate: z.number().min(0),
  tenureMonths: z.number().int().positive(),
  startDate: z.string(),
  dueDay: z.number().int().min(1).max(28),
  emiAmount: z.number().positive().optional(),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;

/* ------------------------------------------------------------------ */
/*  Credit Card                                                        */
/* ------------------------------------------------------------------ */

export const createCardSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  cardLimit: z.number().positive(),
  billingCycleDay: z.number().int().min(1).max(28),
  paymentDueDay: z.number().int().min(1).max(28),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;

/* ------------------------------------------------------------------ */
/*  Subscription                                                       */
/* ------------------------------------------------------------------ */

export const createSubscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  billingDay: z.number().int().min(1).max(28),
  category: z.enum(["WORK", "PERSONAL"]),
  creditCardId: z.string().min(1),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

/* ------------------------------------------------------------------ */
/*  EMI Payment                                                        */
/* ------------------------------------------------------------------ */

export const updateEmiPaymentSchema = z.object({
  paymentId: z.string().min(1),
  status: z.enum(["PAID", "MISSED", "UPCOMING"]),
});

export type UpdateEmiPaymentInput = z.infer<typeof updateEmiPaymentSchema>;

/* ------------------------------------------------------------------ */
/*  Subscription Payment                                               */
/* ------------------------------------------------------------------ */

export const updateSubscriptionPaymentSchema = z.object({
  paymentId: z.string().min(1),
  status: z.enum(["PAID", "MISSED", "UPCOMING"]),
});

export type UpdateSubscriptionPaymentInput = z.infer<typeof updateSubscriptionPaymentSchema>;

/* ------------------------------------------------------------------ */
/*  Auth / Register                                                    */
/* ------------------------------------------------------------------ */

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
