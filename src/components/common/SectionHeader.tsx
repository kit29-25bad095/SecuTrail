import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Small uppercase eyebrow label rendered above the title */
  eyebrow?: string;
  /** Primary section title — rendered as an `<h2>` */
  title: string;
  /** Optional supporting text rendered below the title */
  subtitle?: string;
  /** Text alignment of the header block */
  align?: "left" | "center";
  className?: string;
}

/**
 * Reusable section header with an optional eyebrow tag, a title, and a
 * supporting subtitle. Keeps the typography hierarchy consistent across
 * all SecuTrail pages.
 */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-1.5",
        align === "center" && "text-center mx-auto",
        className
      )}
    >
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-prose">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export { SectionHeader };
export type { SectionHeaderProps };
