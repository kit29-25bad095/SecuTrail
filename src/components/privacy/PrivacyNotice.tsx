import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Info } from "lucide-react";

const DEFAULT_MESSAGE =
  "SecuTrail collects no personal information. This session exists only in temporary browser memory and expires automatically.";

interface PrivacyNoticeProps {
  /**
   * - `inline` — small single-line strip for footers / sidebars
   * - `banner` — full-width soft notice bar
   * - `card` — bordered card panel for dedicated privacy pages
   */
  variant?: "inline" | "banner" | "card";
  /** Override the default privacy message */
  message?: string;
  /** Append a "Learn more" link pointing to /privacy */
  showLearnMore?: boolean;
  className?: string;
}

/**
 * Compact privacy explanation banner. Communicate the anonymous / ephemeral
 * nature of SecuTrail sessions without alarming language.
 */
function PrivacyNotice({
  variant = "banner",
  message = DEFAULT_MESSAGE,
  showLearnMore = false,
  className,
}: PrivacyNoticeProps) {
  if (variant === "inline") {
    return (
      <p
        className={cn(
          "flex items-center gap-1.5 text-[11px] text-muted-foreground",
          className
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
        <span>{message}</span>
        {showLearnMore && (
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors ml-0.5"
          >
            Learn more
          </a>
        )}
      </p>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Your Privacy is Protected
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {message}
            </p>
            {showLearnMore && (
              <a
                href="/privacy"
                className="text-xs font-semibold text-primary underline-offset-2 hover:underline transition-colors"
              >
                Read our full privacy notice →
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: banner
  return (
    <div
      className={cn(
        "flex w-full items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
        className
      )}
      role="note"
      aria-label="Privacy notice"
    >
      <Info
        className="h-4 w-4 shrink-0 text-slate-400 mt-0.5"
        aria-hidden="true"
      />
      <span className="leading-relaxed flex-1">{message}</span>
      {showLearnMore && (
        <a
          href="/privacy"
          className="ml-2 shrink-0 font-semibold text-primary underline-offset-2 hover:underline transition-colors"
        >
          Learn more
        </a>
      )}
    </div>
  );
}

export { PrivacyNotice };
export type { PrivacyNoticeProps };
