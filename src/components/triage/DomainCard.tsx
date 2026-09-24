"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Stethoscope, Heart, Scale, CheckCircle2 } from "lucide-react";
import type { SupportDomain } from "@/types";

interface DomainCardProps {
  /** Which care domain this card represents */
  domain: SupportDomain;
  /** Whether this domain is currently selected */
  selected: boolean;
  /** Called when the card is clicked or activated via keyboard */
  onToggle: () => void;
  /** Disabled state — card is non-interactive */
  disabled?: boolean;
  className?: string;
}

/** Per-domain static configuration */
const DOMAIN_CONFIG = {
  MEDICAL: {
    label: "Medical Care",
    description:
      "HIV PEP prophylaxis within 72 hours, emergency contraception, injury care, and free forensic examination without mandatory police FIR.",
    footer: "Critical window: 72h for PEP",
    Icon: Stethoscope,
    selectedBorder: "border-blue-600",
    selectedBg: "bg-blue-50/50 dark:bg-blue-950/30",
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    checkBorder: "border-blue-600 bg-blue-600",
    footerColor: "text-blue-700 dark:text-blue-300",
  },
  EMOTIONAL: {
    label: "Emotional Support",
    description:
      "Trauma stabilization, non-judgmental crisis lines (Tele-MANAS), grounding techniques, and safe space counseling.",
    footer: "24/7 Free & Anonymous Helplines",
    Icon: Heart,
    selectedBorder: "border-emerald-600",
    selectedBg: "bg-emerald-50/50 dark:bg-emerald-950/30",
    iconBg:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
    checkBorder: "border-emerald-600 bg-emerald-600",
    footerColor: "text-emerald-700 dark:text-emerald-300",
  },
  LEGAL: {
    label: "Legal Information",
    description:
      "Statutory rights under BNS 2023, Zero-FIR procedures, free legal aid via NALSA/DLSA, and evidence preservation guidelines.",
    footer: "Free Advocates via DLSA / NALSA",
    Icon: Scale,
    selectedBorder: "border-purple-600",
    selectedBg: "bg-purple-50/50 dark:bg-purple-950/30",
    iconBg:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
    checkBorder: "border-purple-600 bg-purple-600",
    footerColor: "text-purple-700 dark:text-purple-300",
  },
} as const satisfies Record<
  string,
  {
    label: string;
    description: string;
    footer: string;
    Icon: React.ElementType;
    selectedBorder: string;
    selectedBg: string;
    iconBg: string;
    checkBorder: string;
    footerColor: string;
  }
>;

/**
 * Clickable domain selection card for the SecuTrail triage screen.
 * Handles all colour/icon logic internally; the parent only manages
 * which domains are selected.
 *
 * Fully keyboard-accessible — activates on Enter/Space.
 */
function DomainCard({
  domain,
  selected,
  onToggle,
  disabled = false,
  className,
}: DomainCardProps) {
  const config = DOMAIN_CONFIG[domain];
  const { Icon } = config;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) onToggle();
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onToggle()}
      onKeyDown={handleKeyDown}
      className={cn(
        "cursor-pointer rounded-xl border-2 p-5 transition-all flex flex-col justify-between select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? cn(config.selectedBorder, config.selectedBg, "shadow-sm")
          : "border-slate-200 bg-card hover:border-slate-300 dark:border-slate-800",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {/* Top row: icon + checkbox indicator */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg font-bold",
              config.iconBg
            )}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </div>

          {/* Selection indicator circle */}
          <div
            className={cn(
              "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
              selected ? config.checkBorder + " text-white" : "border-slate-300"
            )}
            aria-hidden="true"
          >
            {selected && <CheckCircle2 className="h-4 w-4" />}
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
          {config.label}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {config.description}
        </p>
      </div>

      {/* Footer tag */}
      <div
        className={cn(
          "mt-4 pt-3 border-t text-[11px] font-semibold",
          config.footerColor
        )}
      >
        {config.footer}
      </div>
    </div>
  );
}

export { DomainCard };
export type { DomainCardProps };
