"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TimeframeOption {
  id: string;
  label: string;
  note: string;
}

interface TimeframeSelectorProps {
  /** Currently selected timeframe id */
  value: string;
  /** Called with the new timeframe id when a button is activated */
  onChange: (value: string) => void;
  className?: string;
}

/** Fixed timeframe options — sourced from clinical PEP/EC windows */
const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  {
    id: "UNDER_72_HOURS",
    label: "Within the last 72 hours",
    note: "PEP and emergency contraception highly effective",
  },
  {
    id: "UNDER_5_DAYS",
    label: "Within the last 5 days",
    note: "Certain contraceptive & forensic options remain",
  },
  {
    id: "PAST_MONTH",
    label: "More than 5 days ago / Ongoing",
    note: "Emotional counseling, legal aid & STI screenings",
  },
];

/**
 * A group of toggle buttons for selecting the incident timeframe during
 * triage. Uses `role="radiogroup"` for screen-reader semantics.
 *
 * Requires 'use client' because it renders interactive event handlers.
 */
function TimeframeSelector({
  value,
  onChange,
  className,
}: TimeframeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Timeframe sensitivity"
      className={cn("grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs", className)}
    >
      {TIMEFRAME_OPTIONS.map((option) => {
        const isSelected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.id)}
            className={cn(
              "p-3 rounded-lg border text-left transition-all select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "border-primary bg-secondary/80 font-semibold text-foreground"
                : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
            )}
          >
            <div className="font-medium text-foreground text-xs">
              {option.label}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {option.note}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { TimeframeSelector, TIMEFRAME_OPTIONS };
export type { TimeframeSelectorProps, TimeframeOption };
