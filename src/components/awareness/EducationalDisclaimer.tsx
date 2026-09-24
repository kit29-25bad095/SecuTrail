import * as React from "react";
import { Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface EducationalDisclaimerProps {
  className?: string;
  topic?: string;
}

/**
 * EducationalDisclaimer Component
 * Clearly distinguishes educational / legal literacy information from formal legal advice or medical diagnosis.
 * Reinforces trauma-informed, non-judgmental principles.
 */
export function EducationalDisclaimer({ className, topic }: EducationalDisclaimerProps) {
  return (
    <aside
      role="note"
      aria-label="Educational Disclaimer"
      className={cn(
        "rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>Educational &amp; Legal Literacy Standard</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
              <ShieldCheck className="h-3 w-3" /> Statutory Grounding
            </span>
          </p>
          <p className="leading-relaxed text-muted-foreground">
            The contents on this page {topic ? `regarding ${topic}` : ""} are synthesized from official Indian statutory statutes (Bharatiya Nyaya Sanhita 2023, BNSS 2023, POSH Act 2013, POCSO Act 2012) and Ministry of Health &amp; Family Welfare clinical protocols. This information is provided to build community literacy and prevent harm, and does not constitute formal legal counsel or medical evaluation.
          </p>
        </div>
      </div>
    </aside>
  );
}
