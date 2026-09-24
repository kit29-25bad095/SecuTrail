import * as React from "react";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, AlertCircle } from "lucide-react";

interface SafetyNoticeProps {
  /**
   * - `info`    — informational, blue palette
   * - `caution` — time-sensitive medical urgency, amber palette
   * - `urgent`  — immediate danger / emergency, red palette
   */
  severity: "info" | "caution" | "urgent";
  /** Short title summarising the notice */
  title: string;
  /** Body content — can contain text or other React elements */
  children: React.ReactNode;
  /** Optional action slot rendered below the body (e.g. helpline buttons) */
  actions?: React.ReactNode;
  /** Override the default severity icon */
  icon?: React.ReactNode;
  className?: string;
}

const severityConfig = {
  info: {
    wrapper:
      "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40",
    iconWrapper:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    titleColor: "text-blue-900 dark:text-blue-100",
    bodyColor: "text-blue-800 dark:text-blue-200",
    DefaultIcon: Info,
  },
  caution: {
    wrapper:
      "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40",
    iconWrapper:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    titleColor: "text-amber-900 dark:text-amber-100",
    bodyColor: "text-amber-800 dark:text-amber-200",
    DefaultIcon: AlertTriangle,
  },
  urgent: {
    wrapper:
      "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40",
    iconWrapper:
      "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
    titleColor: "text-red-900 dark:text-red-100",
    bodyColor: "text-red-800 dark:text-red-200",
    DefaultIcon: AlertCircle,
  },
} as const;

/**
 * A calm, trauma-informed safety notice component.
 *
 * Severity levels control the colour palette:
 * - `info`    → blue  (general information)
 * - `caution` → amber (medical time-sensitivity)
 * - `urgent`  → red   (immediate danger)
 *
 * Never uses alarming imagery or violent visual language per SecuTrail
 * design principles.
 */
function SafetyNotice({
  severity,
  title,
  children,
  actions,
  icon,
  className,
}: SafetyNoticeProps) {
  const config = severityConfig[severity];
  const { DefaultIcon } = config;

  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        "rounded-xl border p-4 space-y-3",
        config.wrapper,
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            config.iconWrapper
          )}
          aria-hidden="true"
        >
          {icon ?? <DefaultIcon className="h-4 w-4" />}
        </div>

        <h3
          className={cn(
            "flex-1 text-sm font-bold leading-snug pt-0.5",
            config.titleColor
          )}
        >
          {title}
        </h3>
      </div>

      {/* Body */}
      <div
        className={cn(
          "text-xs sm:text-sm leading-relaxed pl-11",
          config.bodyColor
        )}
      >
        {children}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex flex-wrap gap-2 pl-11 pt-1">{actions}</div>
      )}
    </div>
  );
}

export { SafetyNotice };
export type { SafetyNoticeProps };
