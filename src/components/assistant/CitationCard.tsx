import * as React from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, BadgeCheck, Building2 } from "lucide-react";

interface CitationCardProps {
  /** Title of the cited document or guideline */
  title: string;
  /** Publishing organisation */
  organization: string;
  /** Legal/geographic jurisdiction, e.g. "India — National" */
  jurisdiction: string;
  /** Publication year or range, e.g. 2023 or "2021–2023" */
  year?: number | string;
  /** Human-readable verification status, e.g. "Verified by Ministry of Health" */
  verificationStatus: string;
  /** Optional public URL to the source document */
  url?: string;
  className?: string;
}

/**
 * Displays a single grounding source citation used in an AI response.
 * Intended to be rendered inside `AIResponseContainer`.
 * Server-safe — no hooks or browser APIs.
 */
function CitationCard({
  title,
  organization,
  jurisdiction,
  year,
  verificationStatus,
  url,
  className,
}: CitationCardProps) {
  const Wrapper = url ? "a" : "div";
  const wrapperProps = url
    ? {
        href: url,
        target: "_blank" as const,
        rel: "noopener noreferrer",
        "aria-label": `Source: ${title} — opens in new tab`,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors",
        url &&
          "hover:border-primary/40 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {/* Organisation icon bubble */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        <Building2 className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
            {title}
          </p>
          {url && (
            <ExternalLink
              className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Organisation + jurisdiction + year */}
        <p className="text-[11px] text-muted-foreground truncate">
          {organization}
          {jurisdiction && (
            <span className="text-muted-foreground/70"> · {jurisdiction}</span>
          )}
          {year && (
            <span className="text-muted-foreground/70"> · {year}</span>
          )}
        </p>

        {/* Verification badge */}
        <div className="flex items-center gap-1 pt-0.5">
          <BadgeCheck
            className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
            {verificationStatus}
          </span>
        </div>
      </div>
    </Wrapper>
  );
}

export { CitationCard };
export type { CitationCardProps };
