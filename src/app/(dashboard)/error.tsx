"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive-muted">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="font-display text-h3 font-semibold">
          Something went wrong
        </h2>
        <p className="mt-2 text-body-sm text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  );
}
