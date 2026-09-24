import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-4">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has moved. If you are seeking immediate assistance, please use our emergency or triage options.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="default" className="gap-2">
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
        <Link href="/survivor">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Survivor Support</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
