import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || (label ? generatedId : undefined);
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;

    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[11px] text-muted-foreground">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperId}
          className={cn(
            "flex min-h-[90px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-destructive font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
