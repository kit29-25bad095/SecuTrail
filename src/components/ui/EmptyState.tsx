import * as React from "react";
import { cn } from "@/lib/utils";
import { FolderSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  suggestions,
  onSelectSuggestion,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        {icon || <FolderSearch className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1.5">{title}</h3>
      <p className="max-w-md text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
        {description}
      </p>

      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5 max-w-md">
          <span className="text-[11px] text-muted-foreground mr-1">Suggestions:</span>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSuggestion && onSelectSuggestion(item)}
              className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-foreground hover:bg-accent transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {action && <div>{action}</div>}
    </div>
  );
}
