import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps {
  /** Layout axis of the separator */
  orientation?: "horizontal" | "vertical";
  /**
   * When true the separator is purely visual and hidden from assistive
   * technology. When false it carries semantic `role="separator"`.
   */
  decorative?: boolean;
  className?: string;
}

/**
 * A thin line that visually (and optionally semantically) divides content.
 * Renders a `<div>` with the appropriate ARIA role.
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { orientation = "horizontal", decorative = true, className, ...props },
    ref
  ) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps };
