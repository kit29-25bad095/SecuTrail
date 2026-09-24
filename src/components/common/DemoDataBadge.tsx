import * as React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface DemoDataBadgeProps {
  /** Override the default hover/title message */
  message?: string;
  className?: string;
}

const DEFAULT_MESSAGE =
  "This is demonstration data for evaluation purposes.";

/**
 * A small amber "[DEMO DATA]" badge that clearly marks mock or seeded
 * content. Renders the message as a native `title` tooltip on hover.
 * Carry the `[DEMO]` prefix convention in nearby text/data as well.
 */
function DemoDataBadge({
  message = DEFAULT_MESSAGE,
  className,
}: DemoDataBadgeProps) {
  return (
    <span
      role="note"
      title={message}
      aria-label={`Demo data indicator: ${message}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 select-none",
        "dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200",
        className
      )}
    >
      <Info className="h-3 w-3 shrink-0" aria-hidden="true" />
      Demo Data
    </span>
  );
}

export { DemoDataBadge };
export type { DemoDataBadgeProps };
