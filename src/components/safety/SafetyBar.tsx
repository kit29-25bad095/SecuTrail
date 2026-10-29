"use client";

import * as React from "react";
import { QuickExit } from "./QuickExit";
import { ShieldAlert } from "lucide-react";
import { useQuickExit } from "@/hooks/useQuickExit";

export function SafetyBar() {
  // Bind global double-escape listener
  useQuickExit();

  return (
    <aside
      aria-label="Safety emergency escape bar"
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 px-4 py-2 backdrop-blur-md text-foreground transition-colors shadow-2xs"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldAlert className="h-4 w-4 shrink-0" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              Need to leave quickly?
            </span>
            <span className="text-[11px] sm:text-xs text-muted-foreground hidden md:inline">
              Click Quick Exit or press{" "}
              <kbd className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground border border-border shadow-2xs">
                ESC × 2
              </kbd>{" "}
              anytime.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <QuickExit size="default" />
        </div>
      </div>
    </aside>
  );
}
