import * as React from "react";
import { Shield, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIResponseContainerProps {
  /** Show a skeleton loader instead of children */
  isLoading?: boolean;
  /** ISO date string of when the sources were last verified */
  verifiedAt?: string;
  /** Number of verified source documents used */
  sourcesCount?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper for structured AI / RAG responses in the SecuTrail assistant.
 * Provides a consistent header (shield + "Verified Analysis"), content area,
 * and a footer note emphasising grounded, no-hallucination responses.
 */
export function AIResponseContainer({
  isLoading = false,
  verifiedAt,
  sourcesCount,
  children,
  className,
}: AIResponseContainerProps) {
  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
        className
      )}
      aria-label="Verified AI response"
    >
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">
            Verified Analysis
          </span>
        </div>
        {sourcesCount !== undefined && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {sourcesCount} verified{" "}
              {sourcesCount === 1 ? "source" : "sources"}
              {formattedDate && ` · verified ${formattedDate}`}
            </span>
          </div>
        )}
      </div>

      {/* ---- Content ---- */}
      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-3 animate-pulse" aria-hidden="true">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        ) : (
          children
        )}
      </div>

      {/* ---- Footer note ---- */}
      <div className="border-t bg-muted/20 px-4 py-2.5">
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>
            Grounded response — answers strictly cite verified statutory and clinical sources.
            SecuTrail never fabricates emergency numbers, legal provisions, or resource availability.
          </span>
        </p>
      </div>
    </div>
  );
}
