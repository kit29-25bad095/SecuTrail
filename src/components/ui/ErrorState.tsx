import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw, PhoneCall } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showEmergencyFallback?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Information Temporarily Unavailable",
  message = "We couldn't retrieve verified information at this moment. You can retry or access emergency services directly.",
  onRetry,
  showEmergencyFallback = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8 text-center",
        className
      )}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="max-w-md text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        )}

        {showEmergencyFallback && (
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-800 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Call 112 (Emergency)</span>
          </a>
        )}
      </div>
    </div>
  );
}
