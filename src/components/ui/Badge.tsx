import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "verified"
    | "demo"
    | "warning"
    | "calm"
    | "info";
  size?: "sm" | "default";
}

function Badge({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
        {
          "border-transparent bg-primary text-primary-foreground":
            variant === "default",
          "border-transparent bg-secondary text-secondary-foreground":
            variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground":
            variant === "destructive",
          "border-border text-foreground bg-background": variant === "outline",
          "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-200":
            variant === "verified",
          "border-amber-300 bg-amber-50 text-amber-900 font-bold uppercase tracking-wider dark:border-amber-800 dark:bg-amber-950/70 dark:text-amber-200":
            variant === "demo",
          "border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200":
            variant === "warning",
          "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200":
            variant === "calm",
          "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200":
            variant === "info",
        },
        {
          "px-2.5 py-0.5 text-xs": size === "default",
          "px-2 py-0.2 text-[10px]": size === "sm",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };
