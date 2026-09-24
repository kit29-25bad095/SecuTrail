"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console without sensitive user information
    console.error("SecuTrail application error caught:", error.message);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        We encountered an issue
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        We couldn&apos;t load verified information right now. Your privacy and local session remain protected. Please try refreshing or return to the safe home screen.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
