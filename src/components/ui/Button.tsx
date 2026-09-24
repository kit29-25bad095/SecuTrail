import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "safety"
    | "calm";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
          {
            "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.99]":
              variant === "default",
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.99]":
              variant === "destructive",
            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-[0.99]":
              variant === "outline",
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.99]":
              variant === "secondary",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-amber-600 text-white shadow-sm hover:bg-amber-700 active:bg-amber-800 font-semibold active:scale-[0.99]":
              variant === "safety",
            "bg-emerald-800 text-white shadow-sm hover:bg-emerald-900 active:bg-emerald-950 font-semibold active:scale-[0.99] dark:bg-emerald-700 dark:hover:bg-emerald-800":
              variant === "calm",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-lg px-6 text-base font-semibold": size === "lg",
            "h-14 rounded-xl px-8 text-base font-bold": size === "xl",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0 text-current" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
