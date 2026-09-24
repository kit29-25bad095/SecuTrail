import * as React from "react";
import { Clock, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface DecisionOption {
  id: string;
  letter: string; // "A", "B", "C", "D"
  title: string;
  category: "EMERGENCY" | "MEDICAL" | "LEGAL" | "EMOTIONAL" | "COMBINED";
  summary: string;
  whatItIs: string;
  whoProvidesIt: string;
  howToAccess: string;
  timingConsiderations: string;
  whatMayHappen: string[];
  potentialBenefits: string[];
  potentialConsiderations: string[];
  sources: string[];
}

interface OptionCardProps {
  option: DecisionOption;
  isSelected?: boolean;
  onSelect?: (optionId: string) => void;
  className?: string;
}

export function OptionCard({
  option,
  isSelected = false,
  onSelect,
  className,
}: OptionCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getCategoryColor = (cat: DecisionOption["category"]) => {
    switch (cat) {
      case "EMERGENCY":
        return "border-red-200 bg-red-50/30 dark:bg-red-950/20";
      case "MEDICAL":
        return "border-blue-200 bg-blue-50/30 dark:bg-blue-950/20";
      case "LEGAL":
        return "border-purple-200 bg-purple-50/30 dark:bg-purple-950/20";
      case "EMOTIONAL":
        return "border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20";
      default:
        return "border-slate-200 bg-slate-50/30 dark:bg-slate-900/20";
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ${getCategoryColor(
        option.category
      )} ${isSelected ? "ring-2 ring-primary shadow-md" : "hover:border-slate-400"} ${className || ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {option.letter}
            </span>
            <Badge variant="outline" className="text-xs uppercase font-semibold">
              {option.category}
            </Badge>
          </div>
          {isSelected && (
            <Badge variant="verified" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Selected Direction
            </Badge>
          )}
        </div>

        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
          {option.title}
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          {option.summary}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 text-xs sm:text-sm pt-0">
        {/* Key timing note */}
        <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/40 p-2.5 text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50">
          <Clock className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold">Timing Considerations: </span>
            <span>{option.timingConsiderations}</span>
          </div>
        </div>

        {/* Quick summary points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="rounded-md border bg-card p-3">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Who Provides It</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{option.whoProvidesIt}</p>
          </div>

          <div className="rounded-md border bg-card p-3">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-primary" />
              <span>How To Access It</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{option.howToAccess}</p>
          </div>
        </div>

        {/* Expandable Deep Breakdown */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t text-xs">
            <div>
              <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                What May Happen During This Process:
              </h5>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                {option.whatMayHappen.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="rounded bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 border border-emerald-200 dark:border-emerald-900/40">
                <span className="font-semibold text-emerald-900 dark:text-emerald-300 block mb-1">
                  Potential Benefits
                </span>
                <ul className="space-y-1 text-emerald-800 dark:text-emerald-300">
                  {option.potentialBenefits.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded bg-slate-50 dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-300 block mb-1">
                  Considerations To Keep In Mind
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {option.potentialConsiderations.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {option.sources.length > 0 && (
              <div className="pt-1 text-[11px] text-slate-500">
                <span className="font-medium">Sources & Framework: </span>
                {option.sources.join(" • ")}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-1 flex items-center justify-between border-t bg-card/60">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          {isExpanded ? "Show less details" : "Learn what this entails..."}
        </button>

        {onSelect && (
          <Button
            size="sm"
            variant={isSelected ? "outline" : "default"}
            onClick={() => onSelect(option.id)}
            className="text-xs"
          >
            {isSelected ? "Current Choice" : "Focus On This Option"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
