import * as React from "react";
import { cn } from "@/lib/utils";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?:
      | "default"
      | "destructive"
      | "warning"
      | "success"
      | "emergency"
      | "info"
      | "privacy";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-xl border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
      {
        "bg-background text-foreground border-border": variant === "default",
        "border-primary/45 bg-secondary text-primary [&>svg]:text-primary":
          variant === "destructive",
        "border-primary/35 bg-secondary text-primary [&>svg]:text-primary":
          variant === "warning",
        "border-primary/25 bg-secondary text-primary [&>svg]:text-primary":
          variant === "success",
        "border-primary/50 bg-secondary text-primary font-medium [&>svg]:text-primary shadow-2xs":
          variant === "emergency",
        "border-primary/20 bg-secondary text-primary [&>svg]:text-primary":
          variant === "info",
        "border-primary/15 bg-secondary text-primary [&>svg]:text-primary":
          variant === "privacy",
      },
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-base", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs sm:text-sm [&_p]:leading-relaxed text-muted-foreground", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
