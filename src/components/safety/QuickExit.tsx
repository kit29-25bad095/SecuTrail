"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { performQuickExit } from "@/services/safety/quickExit";
import { cn } from "@/lib/utils";

interface QuickExitButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

/**
 * QuickExit Component
 *
 * Implements a non-blocking, privacy-preserving emergency escape button.
 * - Zero confirmation dialogs
 * - Immediate location.replace() to neutral destination
 * - Purges SecuTrail-owned client cache (localStorage, sessionStorage)
 * - Fires non-blocking session invalidation beacon
 * - Operates as an HTML anchor link fallback if JavaScript is disabled
 * - Accessible via keyboard (Enter, Space) and screen readers
 */
export function QuickExit({ className, size = "default" }: QuickExitButtonProps) {
  const neutralUrl =
    process.env.NEXT_PUBLIC_QUICK_EXIT_URL || "https://www.google.com";

  const handleExit = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    performQuickExit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      performQuickExit();
    }
  };

  return (
    <a
      href={neutralUrl}
      role="button"
      tabIndex={0}
      onClick={handleExit}
      onKeyDown={handleKeyDown}
      aria-label="Quick Exit: Immediately leave this page and clear session data"
      aria-keyshortcuts="Escape Escape"
      title="Quick Exit (Press ESC twice or click to leave immediately)"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 font-bold text-white shadow-sm transition-all duration-150 hover:bg-amber-700 active:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 select-none cursor-pointer",
        {
          "text-xs px-2.5 py-1 min-h-[32px]": size === "sm",
          "text-sm px-4 py-2 min-h-[40px]": size === "default",
          "text-base px-5 py-2.5 min-h-[48px]": size === "lg",
        },
        className
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Quick Exit</span>
    </a>
  );
}
