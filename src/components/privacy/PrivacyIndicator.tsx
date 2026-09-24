import * as React from "react";
import { cn } from "@/lib/utils";
import { Lock, Clock } from "lucide-react";

interface PrivacyIndicatorProps {
  /** Optional session identifier. When null/undefined the pill still renders. */
  sessionId?: string | null;
  /** Whether to display the truncated session ID alongside the label */
  showSessionId?: boolean;
  /** Compact mode omits the expiry note, useful in tight headers */
  compact?: boolean;
  className?: string;
}

/**
 * A small privacy/session status pill. Shows a lock icon, an "Anonymous
 * Session" label, an optional truncated session ID, and an expiry note.
 * Purely visual — no state, no browser APIs.
 */
function PrivacyIndicator({
  sessionId,
  showSessionId = false,
  compact = false,
  className,
}: PrivacyIndicatorProps) {
  const truncated =
    sessionId && showSessionId
      ? `···${sessionId.slice(-6)}`
      : null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-700 dark:bg-slate-900",
        className
      )}
      aria-label="Anonymous session — no personal data collected"
      title="Anonymous Session — no personal data collected"
    >
      {/* Lock icon */}
      <Lock className="h-3 w-3 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />

      {/* Label */}
      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
        Anonymous Session
      </span>

      {/* Truncated ID */}
      {truncated && (
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 select-all">
          {truncated}
        </span>
      )}

      {/* Expiry note — hidden in compact mode */}
      {!compact && (
        <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
          <Clock className="h-2.5 w-2.5" aria-hidden="true" />
          Expires after 30m idle
        </span>
      )}
    </div>
  );
}

export { PrivacyIndicator };
export type { PrivacyIndicatorProps };
