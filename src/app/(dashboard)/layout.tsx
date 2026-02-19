"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { BlueprintBookIcon } from "@/components/ui/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <BlueprintBookIcon size={20} className="text-primary" />
          <span className="font-display text-base font-bold tracking-tight">
            Blueprint Books
          </span>
        </header>

        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <main className="min-h-screen lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
