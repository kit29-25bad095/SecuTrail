import * as React from "react";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

interface HelplineButtonProps {
  /**
   * The helpline number to dial — must be a real Indian emergency/support
   * number (e.g. '112', '1091', '181', '14416', '1098', '15100').
   */
  number: string;
  /** Human-readable service name, e.g. "National Emergency" */
  label: string;
  /** Short description of the service */
  description?: string;
  /**
   * Colour variant:
   * - `emergency`    → red   (112, police)
   * - `support`      → amber (women's helplines 181 / 1091)
   * - `legal`        → purple (legal aid)
   * - `mental-health`→ teal  (Tele-MANAS 14416, iCall)
   */
  variant?: "emergency" | "support" | "legal" | "mental-health";
  size?: "sm" | "default";
  className?: string;
}

const variantStyles = {
  emergency: {
    wrapper:
      "border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:hover:bg-red-900/40",
    iconWrapper: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    numberColor: "text-red-800 dark:text-red-200",
    labelColor: "text-red-900 dark:text-red-100",
    descColor: "text-red-700 dark:text-red-300",
  },
  support: {
    wrapper:
      "border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:hover:bg-amber-900/40",
    iconWrapper:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    numberColor: "text-amber-800 dark:text-amber-200",
    labelColor: "text-amber-900 dark:text-amber-100",
    descColor: "text-amber-700 dark:text-amber-300",
  },
  legal: {
    wrapper:
      "border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:hover:bg-purple-900/40",
    iconWrapper:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    numberColor: "text-purple-800 dark:text-purple-200",
    labelColor: "text-purple-900 dark:text-purple-100",
    descColor: "text-purple-700 dark:text-purple-300",
  },
  "mental-health": {
    wrapper:
      "border-teal-200 bg-teal-50 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/40 dark:hover:bg-teal-900/40",
    iconWrapper:
      "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    numberColor: "text-teal-800 dark:text-teal-200",
    labelColor: "text-teal-900 dark:text-teal-100",
    descColor: "text-teal-700 dark:text-teal-300",
  },
} as const;

/**
 * A tappable `<a href="tel:…">` helpline button for real Indian emergency
 * and support numbers. Renders as a full card-style link for easy tapping
 * on mobile devices.
 *
 * IMPORTANT: Only real Indian numbers may be used:
 * 112, 1091, 181, 14416, 1098, 15100.
 */
function HelplineButton({
  number,
  label,
  description,
  variant = "support",
  size = "default",
  className,
}: HelplineButtonProps) {
  const styles = variantStyles[variant];

  return (
    <a
      href={`tel:${number}`}
      aria-label={`Call ${label} at ${number}`}
      className={cn(
        "flex items-center gap-3 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        styles.wrapper,
        size === "default" ? "p-3.5" : "p-2.5",
        className
      )}
    >
      {/* Icon bubble */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg",
          styles.iconWrapper,
          size === "default" ? "h-10 w-10" : "h-8 w-8"
        )}
        aria-hidden="true"
      >
        <Phone className={size === "default" ? "h-5 w-5" : "h-4 w-4"} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={cn(
              "font-extrabold leading-none tabular-nums",
              styles.numberColor,
              size === "default" ? "text-lg" : "text-base"
            )}
          >
            {number}
          </span>
          <span
            className={cn(
              "font-semibold",
              styles.labelColor,
              size === "default" ? "text-sm" : "text-xs"
            )}
          >
            {label}
          </span>
        </div>
        {description && (
          <p
            className={cn(
              "mt-0.5 leading-snug",
              styles.descColor,
              size === "default" ? "text-xs" : "text-[11px]"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </a>
  );
}

export { HelplineButton };
export type { HelplineButtonProps };
