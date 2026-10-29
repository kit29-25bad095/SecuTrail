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
    | "info"
    | "emotional"
    | "legal";
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
          "border-primary/40 bg-secondary text-primary":
            variant === "destructive",
          "border-border text-foreground bg-background": variant === "outline",
          "border-primary/30 bg-secondary text-primary font-bold":
            variant === "verified",
          "border-primary/20 bg-secondary text-primary font-bold uppercase tracking-wider":
            variant === "demo",
          "border-primary/30 bg-secondary text-primary font-semibold":
            variant === "warning",
          "border-primary/20 bg-secondary text-primary font-medium":
            variant === "calm",
          "border-primary/20 bg-secondary text-primary":
            variant === "info",
          "border-chip-emotional-border bg-chip-emotional text-chip-emotional-foreground font-semibold":
            variant === "emotional",
          "border-chip-legal-border bg-chip-legal text-chip-legal-foreground font-semibold":
            variant === "legal",
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
