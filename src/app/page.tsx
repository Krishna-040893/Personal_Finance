"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Landmark,
  PiggyBank,
  CalendarDays,
  Shield,
  TrendingUp,
  Zap,
  ChevronRight,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ArrowLeftRight,
    title: "Transaction Tracking",
    description:
      "Log every income and expense with categories, dates, and notes. See where your money goes at a glance.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/20",
  },
  {
    icon: PiggyBank,
    title: "Smart Budgets",
    description:
      "Set monthly budgets by category. Get visual progress bars and alerts when you're approaching limits.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: CreditCard,
    title: "Credit Cards",
    description:
      "Track multiple cards, due dates, and spending limits. Never miss a payment or overspend again.",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
    borderColor: "border-violet-500/20",
  },
  {
    icon: Landmark,
    title: "Loans & EMIs",
    description:
      "Manage loans with amortization schedules. Track principal vs interest and see payoff timelines.",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/20",
  },
  {
    icon: CalendarDays,
    title: "Monthly Planner",
    description:
      "Plan upcoming months with expected income and expenses. Stay ahead of your financial commitments.",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500",
    borderColor: "border-rose-500/20",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description:
      "Beautiful charts and breakdowns of spending patterns, income trends, and budget utilization.",
    color: "from-sky-500/20 to-indigo-500/20",
    iconColor: "text-sky-500",
    borderColor: "border-sky-500/20",
  },
];

const stats = [
  { value: "100%", label: "Free & Open Source" },
  { value: "256-bit", label: "Encrypted Data" },
  { value: "0", label: "Ads or Tracking" },
  { value: "∞", label: "Transactions" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[40%] left-[10%] h-[80vh] w-[80vh] rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute -bottom-[20%] right-[5%] h-[60vh] w-[60vh] rounded-full bg-chart-4/[0.06] blur-[100px]" />
        <div className="absolute top-[40%] right-[30%] h-[40vh] w-[40vh] rounded-full bg-success/[0.04] blur-[80px]" />
      </div>

      {/* Navigation */}
      <header className="landing-stagger-1 relative z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow-primary transition-shadow group-hover:shadow-[0_0_32px_rgba(37,99,235,0.3)]">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              FinanceTracker
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#stats"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Why Us
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1.5 shadow-glow-primary">
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — copy */}
          <div className="max-w-2xl">
            <div className="landing-stagger-2 mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              Open source personal finance
            </div>
            <h1 className="landing-stagger-3 font-display text-display leading-[1.1] tracking-tight">
              Your money,
              <br />
              <span className="bg-gradient-to-r from-primary via-chart-4 to-primary bg-clip-text text-transparent">
                finally clear.
              </span>
            </h1>
            <p className="landing-stagger-4 mt-6 max-w-lg text-body-lg leading-relaxed text-muted-foreground">
              Track transactions, set budgets, manage loans and credit cards —
              all in one clean dashboard. No ads, no data selling, just your
              finances under control.
            </p>
            <div className="landing-stagger-5 mt-10 flex flex-wrap items-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="gap-2 rounded-xl px-8 text-base shadow-glow-primary transition-all hover:shadow-[0_0_32px_rgba(37,99,235,0.3)]"
                >
                  Start Tracking Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="#features"
                className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See features
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
            {/* Trust indicators */}
            <div className="landing-stagger-6 mt-12 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-success" />
                Self-hosted & private
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Real-time analytics
              </span>
            </div>
          </div>

          {/* Right — floating dashboard preview */}
          <div className="landing-stagger-5 relative hidden lg:block">
            <div className="relative">
              {/* Main dashboard card */}
              <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-elevated backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold">
                    Monthly Overview
                  </span>
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 font-mono text-xs font-medium text-success">
                    +12.4%
                  </span>
                </div>
                {/* Mini chart bars */}
                <div className="flex items-end gap-2.5">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="landing-bar flex-1 rounded-t-sm bg-primary/20"
                        style={
                          {
                            height: `${h}px`,
                            "--bar-height": `${h}px`,
                            animationDelay: `${0.8 + i * 0.05}s`,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-bold">
                    $4,280
                  </span>
                  <span className="text-xs text-muted-foreground">
                    saved this month
                  </span>
                </div>
              </div>

              {/* Floating transaction card */}
              <div className="landing-float-card absolute -bottom-8 -left-10 z-10 rounded-xl border border-border/60 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Salary Deposited</p>
                    <p className="font-mono text-sm font-bold text-success">
                      +$5,400.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating budget card */}
              <div
                className="landing-float-card absolute -right-6 -top-4 z-10 rounded-xl border border-border/60 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <PiggyBank className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Budget on track</p>
                    <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-primary/10">
                      <div className="h-full w-[68%] rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block font-mono text-xs font-medium uppercase tracking-widest text-primary">
              Everything you need
            </span>
            <h2 className="font-display text-h1 tracking-tight">
              One app for your
              <br />
              entire financial life
            </h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              No more spreadsheets. No more forgetting due dates. Every tool you
              need to take control of your money, in one place.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border ${feature.borderColor} bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border-strong hover:shadow-lg`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} ${feature.iconColor}`}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md">
            <div className="noise-texture grid grid-cols-2 divide-x divide-border/40 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="px-6 py-10 text-center">
                  <div className="font-display text-3xl font-bold tracking-tight text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="font-display text-h1 tracking-tight">
            Ready to take control?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-muted-foreground">
            Start tracking your finances today. Free, private, and built for
            people who care about where their money goes.
          </p>
          <div className="mt-10">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 rounded-xl px-10 text-base shadow-glow-primary transition-all hover:shadow-[0_0_32px_rgba(37,99,235,0.3)]"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">
              FinanceTracker
            </span>
            <span className="ml-1">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <Link
              href="/login"
              className="transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
