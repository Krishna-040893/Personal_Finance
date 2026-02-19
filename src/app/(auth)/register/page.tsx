"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  ArrowRight,
  Eye,
  EyeOff,
  BarChart3,
  CreditCard,
  Landmark,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Left panel — branding */}
      <div className="relative hidden w-[55%] overflow-hidden lg:block">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-chart-4/90 via-primary to-primary/80" />
        <div className="absolute inset-0">
          <div className="absolute -right-[20%] top-[15%] h-[60vh] w-[60vh] rounded-full bg-white/[0.08] blur-[80px]" />
          <div className="absolute bottom-[10%] left-[10%] h-[40vh] w-[40vh] rounded-full bg-primary/30 blur-[60px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-white/30">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              FinanceTracker
            </span>
          </Link>

          <div className="space-y-10">
            <div>
              <h1 className="login-stagger-1 font-display text-4xl font-bold leading-tight tracking-tight">
                Start your journey
                <br />
                to financial clarity.
              </h1>
              <p className="login-stagger-2 mt-4 max-w-sm text-base leading-relaxed text-white/70">
                Join thousands who have taken control of their money. Set up
                takes less than a minute.
              </p>
            </div>

            <div className="login-stagger-3 space-y-3">
              {[
                {
                  icon: BarChart3,
                  text: "Visual spending analytics",
                },
                {
                  icon: CreditCard,
                  text: "Credit card & subscription tracking",
                },
                {
                  icon: Landmark,
                  text: "Loan & EMI management",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.08] px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} FinanceTracker. Open Source.
          </p>
        </div>
      </div>

      {/* Right panel — register form */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-[30%] top-[20%] h-[50vh] w-[50vh] rounded-full bg-chart-4/[0.04] blur-[100px]" />
        </div>

        <div className="login-form-enter relative z-10 w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                FinanceTracker
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started with free financial tracking
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Full Name</label>
              <div className="relative">
                <Input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-11 rounded-xl border-border/60 bg-card/50 pl-10 pr-4 text-sm backdrop-blur-sm transition-colors focus-visible:border-primary focus-visible:ring-primary/20"
                />
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-11 rounded-xl border-border/60 bg-card/50 px-4 text-sm backdrop-blur-sm transition-colors focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="h-11 rounded-xl border-border/60 bg-card/50 px-4 pr-10 text-sm backdrop-blur-sm transition-colors focus-visible:border-primary focus-visible:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                required
                minLength={6}
                className="h-11 rounded-xl border-border/60 bg-card/50 px-4 text-sm backdrop-blur-sm transition-colors focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full gap-2 rounded-xl text-sm font-semibold shadow-glow-primary transition-all hover:shadow-[0_0_32px_rgba(37,99,235,0.3)]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
