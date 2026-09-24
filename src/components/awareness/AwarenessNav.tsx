"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  Shield,
  Users,
  Smartphone,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AWARENESS_NAV_ITEMS = [
  {
    href: "/awareness",
    label: "Curriculum Overview",
    icon: BookOpen,
    short: "Overview",
  },
  {
    href: "/awareness/consent",
    label: "Consent & Bodily Autonomy",
    icon: CheckCircle,
    short: "Consent",
  },
  {
    href: "/awareness/boundaries",
    label: "Boundaries & Coercion",
    icon: Shield,
    short: "Boundaries",
  },
  {
    href: "/awareness/bystander-support",
    label: "Bystander Support (5Ds)",
    icon: Users,
    short: "Bystander",
  },
  {
    href: "/awareness/digital-safety",
    label: "Digital Safety & Tech Abuse",
    icon: Smartphone,
    short: "Digital Safety",
  },
  {
    href: "/awareness/get-help",
    label: "How to Get Help",
    icon: HelpCircle,
    short: "Get Help",
  },
];

export function AwarenessNav() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-background/90 px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <GraduationCap className="h-3.5 w-3.5" />
          </div>
          <Link
            href="/awareness"
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
          >
            Awareness &amp; Prevention Track
          </Link>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Evidence-Based Legal &amp; Community Education
          </span>
        </div>

        {/* Sub-track Tabs */}
        <nav aria-label="Awareness Sub-navigation" className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {AWARENESS_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/awareness"
                ? pathname === "/awareness"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors text-xs",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.short}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
