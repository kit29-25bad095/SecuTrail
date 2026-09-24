import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepBadgeProps {
  /** The step number or identifier displayed in the badge circle */
  step: number | string;
  /** Human-readable step label */
  label: string;
  /** Visual state of this step */
  status?: "pending" | "active" | "complete";
  className?: string;
}

/**
 * A numbered step indicator badge suitable for multi-step flows.
 * `complete` shows a checkmark, `active` shows the number with a ring,
 * `pending` is subdued.
 */
function StepBadge({
  step,
  label,
  status = "pending",
  className,
}: StepBadgeProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-2 select-none", className)}
      aria-current={status === "active" ? "step" : undefined}
    >
      {/* Circle */}
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all",
          {
            "bg-muted text-muted-foreground": status === "pending",
            "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2":
              status === "active",
            "bg-emerald-600 text-white": status === "complete",
          }
        )}
        aria-hidden="true"
      >
        {status === "complete" ? (
          <Check className="h-3 w-3 stroke-[3]" />
        ) : (
          step
        )}
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-xs font-semibold leading-none",
          {
            "text-muted-foreground": status === "pending",
            "text-foreground": status === "active",
            "text-emerald-700 dark:text-emerald-400": status === "complete",
          }
        )}
      >
        {label}
      </span>
    </div>
  );
}

export { StepBadge };
export type { StepBadgeProps };
