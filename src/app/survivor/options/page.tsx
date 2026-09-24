"use client";

import * as React from "react";
import Link from "next/link";
import { AgencyOptionsService } from "@/services/agency/agencyOptions";
import { OptionCard, DecisionOption } from "@/components/survivor/OptionCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  ArrowRight,
  Database,
  Bot,
  RotateCcw,
} from "lucide-react";
import { SupportDomain } from "@/types";

export default function SurvivorOptionsPage() {
  const [selectedDomains, setSelectedDomains] = React.useState<SupportDomain[]>([
    "MEDICAL",
    "EMOTIONAL",
  ]);
  const [chosenOptionId, setChosenOptionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem("secutrail_triage") ||
        localStorage.getItem("secutrail_triage");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.selectedDomains && parsed.selectedDomains.length > 0) {
          setSelectedDomains(parsed.selectedDomains);
        }
      }

      const storedOption =
        sessionStorage.getItem("secutrail_selected_option") ||
        localStorage.getItem("secutrail_selected_option");
      if (storedOption) {
        setChosenOptionId(storedOption);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const options: DecisionOption[] = React.useMemo(() => {
    return AgencyOptionsService.getOptionsForContext(selectedDomains);
  }, [selectedDomains]);

  const handleSelectOption = (optId: string) => {
    setChosenOptionId(optId);
    try {
      sessionStorage.setItem("secutrail_selected_option", optId);
      localStorage.setItem("secutrail_selected_option", optId);
    } catch {
      // Safe fallback
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
          Step 03 • Agency-First Decision Layer
        </Badge>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          You have options.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          &ldquo;Here&apos;s what each option involves. You choose what feels appropriate for you.&rdquo;
        </p>
        <p className="text-xs text-muted-foreground">
          SecuTrail never forces a course of action. Compare timelines, benefits, and practical realities below.
        </p>
      </div>

      {/* Selected Triage Context */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-card border text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Current Focus Areas:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedDomains.map((d) => (
              <Badge key={d} variant="secondary" className="text-[10px]">
                {d}
              </Badge>
            ))}
          </div>
        </div>

        <Link
          href="/survivor/triage"
          className="text-primary hover:underline flex items-center gap-1 text-[11px]"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Adjust Triage</span>
        </Link>
      </div>

      {/* Decision Option Cards List */}
      <div className="space-y-6">
        {options.map((opt) => (
          <OptionCard
            key={opt.id}
            option={opt}
            isSelected={chosenOptionId === opt.id}
            onSelect={handleSelectOption}
          />
        ))}
      </div>

      {/* Action Next Steps */}
      <div className="rounded-xl border bg-slate-900 text-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Ready to explore verified facilities or ask questions?</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            You can view audited contact details for local hospitals and One Stop Centres, or consult our verified AI assistant for step-by-step guidance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link href="/survivor/action" className="flex-1 sm:flex-initial">
            <Button variant="default" size="sm" className="w-full text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              <span>View Action Checklist</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <Link href="/survivor/resources" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full text-xs border-slate-700 bg-slate-800 text-white hover:bg-slate-700 gap-1.5">
              <Database className="h-3.5 w-3.5" />
              <span>Verified Resources</span>
            </Button>
          </Link>

          <Link href="/survivor/assistant" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full text-xs border-slate-700 bg-slate-800 text-white hover:bg-slate-700 gap-1.5">
              <Bot className="h-3.5 w-3.5" />
              <span>Decision Assistant</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
