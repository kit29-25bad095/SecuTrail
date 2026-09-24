"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  GitFork,
  Scale,
  Database,
  Bot,
  Info,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SurvivorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Initialize ephemeral session ID on client if absent
  React.useEffect(() => {
    try {
      let sessId =
        sessionStorage.getItem("secutrail_session_id") ||
        localStorage.getItem("secutrail_session_id");

      if (!sessId) {
        sessId = `sess_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
        sessionStorage.setItem("secutrail_session_id", sessId);
        localStorage.setItem("secutrail_session_id", sessId);

        // Ping server session endpoint (non-blocking)
        fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessId }),
        }).catch(() => {
          // Safe silence
        });
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const steps = [
    { href: "/survivor/safety", label: "01 Immediate Safety", icon: ShieldAlert },
    { href: "/survivor/triage", label: "02 Triage Care", icon: GitFork },
    { href: "/survivor/options", label: "03 Your Options", icon: Scale },
    { href: "/survivor/action", label: "04 Action Plan", icon: CheckCircle2 },
    { href: "/survivor/resources", label: "05 Verified Resources", icon: Database },
    { href: "/survivor/assistant", label: "06 Decision Assistant", icon: Bot },
  ];

  return (
    <div className="flex flex-col flex-1 bg-slate-50/50 dark:bg-slate-950/40 min-h-screen">

      {/* Survivor Track Sub-header & Navigation bar */}
      <div className="border-b bg-background/90 px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/survivor"
              className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <span>Survivor Support Track</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3 text-emerald-600" />
              Confidential Ephemeral Session
            </span>
          </div>

          {/* Sub-track Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {steps.map((step) => {
              const isActive = pathname === step.href;
              const Icon = step.icon;

              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{step.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Track Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
