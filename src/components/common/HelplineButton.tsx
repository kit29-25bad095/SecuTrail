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
      "border-[#004225]/40 bg-[#FFFDD0] hover:bg-[#FAF7BA] text-[#004225]",
    iconWrapper: "bg-[#004225] text-[#FFFDD0]",
    numberColor: "text-[#004225]",
    labelColor: "text-[#004225]",
    descColor: "text-[#004225]/80",
  },
  support: {
    wrapper:
      "border-[#004225]/25 bg-[#FFFDD0] hover:bg-[#FAF7BA] text-[#004225]",
    iconWrapper:
      "bg-[#004225]/15 text-[#004225]",
    numberColor: "text-[#004225]",
    labelColor: "text-[#004225]",
    descColor: "text-[#004225]/80",
  },
  legal: {
    wrapper:
      "border-[#004225]/25 bg-[#FFFDD0] hover:bg-[#FAF7BA] text-[#004225]",
    iconWrapper:
      "bg-[#004225]/15 text-[#004225]",
    numberColor: "text-[#004225]",
    labelColor: "text-[#004225]",
    descColor: "text-[#004225]/80",
  },
  "mental-health": {
    wrapper:
      "border-[#004225]/25 bg-[#FFFDD0] hover:bg-[#FAF7BA] text-[#004225]",
    iconWrapper:
      "bg-[#004225]/15 text-[#004225]",
    numberColor: "text-[#004225]",
    labelColor: "text-[#004225]",
    descColor: "text-[#004225]/80",
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
