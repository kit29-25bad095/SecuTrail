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
      className="sticky top-0 z-50 w-full border-b border-[#004225]/20 bg-[#FFFDD0]/95 px-4 py-2 backdrop-blur-md text-[#004225] transition-colors shadow-2xs"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#004225]/10 text-[#004225]">
            <ShieldAlert className="h-4 w-4 shrink-0" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#004225]">
              Need to leave quickly?
            </span>
            <span className="text-[11px] sm:text-xs text-[#004225]/80 hidden md:inline">
              Click Quick Exit or press{" "}
              <kbd className="inline-flex items-center gap-0.5 rounded bg-[#004225]/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#004225] border border-[#004225]/20 shadow-2xs">
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
