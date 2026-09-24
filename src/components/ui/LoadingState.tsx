import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  variant?: "spinner" | "skeleton" | "card";
  className?: string;
}

export function LoadingState({
  message = "Retrieving verified information...",
  subMessage,
  variant = "spinner",
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn("w-full space-y-3 p-4 animate-pulse", className)}
      >
        <div className="h-5 w-1/3 rounded-md bg-muted" />
        <div className="h-4 w-full rounded-md bg-muted/70" />
        <div className="h-4 w-5/6 rounded-md bg-muted/60" />
        <div className="h-10 w-full rounded-md bg-muted/40 mt-4" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center animate-pulse",
          className
        )}
      >
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground">{message}</p>
        {subMessage && (
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {subMessage}
          </p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[160px] flex-col items-center justify-center p-6 text-center",
        className
      )}
    >
      <Loader2 className="h-7 w-7 animate-spin text-primary/70 mb-3" />
      <p className="text-sm font-medium text-foreground">{message}</p>
      {subMessage && (
        <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
          {subMessage}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
