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
    selectedBorder: "border-primary",
    selectedBg: "bg-accent/30",
    iconBg: "bg-secondary text-secondary-foreground border border-border",
    checkBorder: "border-primary bg-primary text-primary-foreground",
    footerColor: "text-primary font-semibold",
  },
  EMOTIONAL: {
    label: "Emotional Support",
    description:
      "Trauma stabilization, non-judgmental crisis lines (Tele-MANAS), grounding techniques, and safe space counseling.",
    footer: "24/7 Free & Anonymous Helplines",
    Icon: Heart,
    selectedBorder: "border-chip-emotional-border",
    selectedBg: "bg-chip-emotional/50",
    iconBg:
      "bg-chip-emotional text-chip-emotional-foreground border border-chip-emotional-border",
    checkBorder: "border-primary bg-primary text-primary-foreground",
    footerColor: "text-chip-emotional-foreground font-semibold",
  },
  LEGAL: {
    label: "Legal Information",
    description:
      "Statutory rights under BNS 2023, Zero-FIR procedures, free legal aid via NALSA/DLSA, and evidence preservation guidelines.",
    footer: "Free Advocates via DLSA / NALSA",
    Icon: Scale,
    selectedBorder: "border-chip-legal-border",
    selectedBg: "bg-chip-legal/50",
    iconBg:
      "bg-chip-legal text-chip-legal-foreground border border-chip-legal-border",
    checkBorder: "border-primary bg-primary text-primary-foreground",
    footerColor: "text-chip-legal-foreground font-semibold",
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
