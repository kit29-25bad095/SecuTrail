import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Optional visible label rendered above the select */
  label?: string;
  /** Validation error message; turns border red when set */
  error?: string;
  /** Hint text shown below the select when there is no error */
  hint?: string;
}

/**
 * Styled `<select>` wrapper that matches the Input component's border,
 * radius, ring, and label conventions. Forwards its ref to the underlying
 * `<select>` element.
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || (label ? generatedId : undefined);
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hintId}
            className={cn(
              // Base — mirrors Input styles exactly
              "flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm shadow-sm transition-all duration-150",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          >
            {children}
          </select>

          {/* Chevron indicator — pointer-events-none so clicks pass through */}
          <div className="pointer-events-none absolute right-3 flex items-center text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error && (
          <p id={errorId} className="text-xs text-destructive font-medium">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
