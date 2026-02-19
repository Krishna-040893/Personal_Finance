"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Eye,
  EyeOff,
  TrendingUp,
  PiggyBank,
  Shield,
} from "lucide-react";
import { BlueprintBookIcon } from "@/components/ui/logo";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Left panel — branding & illustration */}
      <div className="relative hidden w-[55%] overflow-hidden lg:block">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-chart-4/80" />
        <div className="absolute inset-0">
          <div className="absolute -left-[20%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-white/[0.08] blur-[80px]" />
          <div className="absolute bottom-[5%] right-[10%] h-[40vh] w-[40vh] rounded-full bg-chart-4/30 blur-[60px]" />
        </div>

        {/* Subtle grid pattern */}
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-white/30">
              <BlueprintBookIcon size={20} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Blueprint Books
            </span>
          </Link>

          {/* Center — feature highlights */}
          <div className="space-y-10">
            <div>
              <h1 className="login-stagger-1 font-display text-4xl font-bold leading-tight tracking-tight">
                Take control of
                <br />
                your finances.
              </h1>
              <p className="login-stagger-2 mt-4 max-w-sm text-base leading-relaxed text-white/70">
                Track spending, set budgets, manage loans — all in one place.
                Your financial clarity starts here.
              </p>
            </div>

            {/* Feature cards */}
            <div className="login-stagger-3 space-y-3">
              {[
                {
                  icon: TrendingUp,
                  text: "Real-time transaction tracking",
                },
                {
                  icon: PiggyBank,
                  text: "Smart budget management",
                },
                {
                  icon: Shield,
                  text: "Private & self-hosted",
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

          {/* Bottom */}
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Blueprint Books. Open Source.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        {/* Ambient glow for right side */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-[30%] top-[20%] h-[50vh] w-[50vh] rounded-full bg-primary/[0.04] blur-[100px]" />
        </div>

        <div className="login-form-enter relative z-10 w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BlueprintBookIcon size={20} />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Blueprint Books
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                {error}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Password</label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <Button
              type="submit"
              className="h-11 w-full gap-2 rounded-xl text-sm font-semibold shadow-glow-primary transition-all hover:shadow-[0_0_32px_rgba(30,63,111,0.35)]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Create one
            </Link>
          </p>

          <div className="mt-6 rounded-xl border border-border/40 bg-card/30 px-4 py-3 backdrop-blur-sm">
            <p className="text-center text-xs text-muted-foreground">
              <span className="text-foreground/70 font-medium">Dev mode:</span>{" "}
              use{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium">
                dev@example.com
              </code>{" "}
              with no password after running the seed script.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
