import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ProgressStep {
  label: string;
  completed?: boolean;
  current?: boolean;
}

interface ProgressIndicatorProps {
  value?: number; // 0 to 100
  label?: string;
  step?: number;
  totalSteps?: number;
  steps?: ProgressStep[];
  variant?: "default" | "calm" | "amber";
  className?: string;
}

export function ProgressIndicator({
  value,
  label,
  step,
  totalSteps,
  steps,
  variant = "default",
  className,
}: ProgressIndicatorProps) {
  // If numeric step + totalSteps is provided, compute percentage
  const calculatedPercentage =
    value !== undefined
      ? Math.min(Math.max(value, 0), 100)
      : step && totalSteps
      ? Math.min(Math.max((step / totalSteps) * 100, 0), 100)
      : 0;

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Label or Step counter */}
      {(label || (step && totalSteps)) && (
        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
          <span>{label || (step && totalSteps ? `Step ${step} of ${totalSteps}` : "")}</span>
          <span>{Math.round(calculatedPercentage)}%</span>
        </div>
      )}

      {/* Discrete steps visual representation if provided */}
      {steps && steps.length > 0 && (
        <div className="flex items-center justify-between gap-2 pt-1 pb-2">
          {steps.map((s, index) => {
            const isCompleted = s.completed || (step !== undefined && index + 1 < step);
            const isCurrent = s.current || (step !== undefined && index + 1 === step);

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1 text-center"
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] hidden sm:block truncate max-w-[90px]",
                    isCurrent ? "font-bold text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Continuous Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={calculatedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || (step && totalSteps ? `Step ${step} of ${totalSteps}` : "Progress")}
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className={cn("h-full transition-all duration-300 ease-in-out", {
            "bg-primary": variant === "default",
            "bg-emerald-600": variant === "calm",
            "bg-amber-600": variant === "amber",
          })}
          style={{ width: `${calculatedPercentage}%` }}
        />
      </div>
    </div>
  );
}
