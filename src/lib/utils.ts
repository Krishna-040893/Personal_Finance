import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | { toNumber(): number }): string {
  const num = typeof amount === "number" ? amount : amount.toNumber();
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getMonthName(month: number): string {
  return new Date(2024, month - 1).toLocaleString("en-IN", { month: "long" });
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Standard EMI formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export interface AmortizationEntry {
  month: number;
  year: number;
  dueDate: Date;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  startDate: Date,
  dueDay: number
): AmortizationEntry[] {
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  let balance = principal;
  const schedule: AmortizationEntry[] = [];

  for (let i = 0; i < tenureMonths; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, dueDay);
    const interest = balance * monthlyRate;
    const principalPart = emi - interest;
    balance = Math.max(0, balance - principalPart);

    schedule.push({
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      dueDate: d,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
}
