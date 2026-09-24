"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Printer,
  Trash2,
  Stethoscope,
  Heart,
  Scale,
  Building2,
  Clock,
  ChevronRight,
  LogOut,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { performQuickExit } from "@/services/safety/quickExit";
import { SupportDomain } from "@/types";

interface TriageState {
  selectedDomains?: SupportDomain[];
  timeframe?: string;
  state?: string | null;
  district?: string | null;
  updatedAt?: number;
}

export default function SurvivorActionPage() {
  const [triage, setTriage] = React.useState<TriageState | null>(null);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, boolean>>({});
  const [clearedNotice, setClearedNotice] = React.useState<boolean>(false);

  React.useEffect(() => {
    try {
      const storedTriage =
        sessionStorage.getItem("secutrail_triage") ||
        localStorage.getItem("secutrail_triage");
      if (storedTriage) {
        setTriage(JSON.parse(storedTriage));
      }

      const storedOpt =
        sessionStorage.getItem("secutrail_selected_option") ||
        localStorage.getItem("secutrail_selected_option");
      if (storedOpt) {
        setSelectedOptionId(storedOpt);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const domains = triage?.selectedDomains || ["MEDICAL", "EMOTIONAL"];
  const isMedicalSelected = domains.includes("MEDICAL");
  const isEmotionalSelected = domains.includes("EMOTIONAL");
  const isLegalSelected = domains.includes("LEGAL");

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handlePrintPlan = () => {
    window.print();
  };

  const handleClearSession = () => {
    try {
      sessionStorage.removeItem("secutrail_triage");
      sessionStorage.removeItem("secutrail_selected_option");
      localStorage.removeItem("secutrail_triage");
      localStorage.removeItem("secutrail_selected_option");
      setTriage(null);
      setSelectedOptionId(null);
      setClearedNotice(true);
    } catch {
      // Safe fallback
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 print:text-left print:max-w-none">
        <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider print:hidden">
          Step 06 • User-Led Action Plan
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Your Customized Action Summary
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Based on the areas you selected, here is a practical, step-by-step checklist of what to expect, what to bring, and how your privacy is protected by law.
        </p>
      </div>

      {/* Printer / Disk Privacy Alert */}
      <Alert className="border-amber-300 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-200 print:hidden">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
        <div className="text-xs">
          <AlertTitle className="font-bold">Privacy Advisory for Printing / Saving</AlertTitle>
          <AlertDescription className="mt-0.5 leading-relaxed">
            Printing this document or saving it as a PDF leaves a record in your printer queue or downloads folder. Only print or save if you are using a secure, private device.
          </AlertDescription>
        </div>
      </Alert>

      {/* Selected Scope Overview */}
      <div className="p-4 rounded-xl border bg-card space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Focus Domains:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {domains.map((d) => (
                <Badge key={d} variant="verified" className="text-[11px] font-semibold">
                  {d}
                </Badge>
              ))}
            </div>
          </div>

          {triage?.timeframe && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3 text-primary" />
              <span>
                Timeframe: {triage.timeframe === "UNDER_72_HOURS" ? "Within 72 Hours (Critical Window)" : triage.timeframe === "UNDER_5_DAYS" ? "Within 5 Days" : "Ongoing / Later"}
              </span>
            </div>
          )}
        </div>

        {selectedOptionId && (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="font-semibold text-foreground">Chosen Pathway Strategy:</span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {selectedOptionId.replace(/_/g, " ")}
            </Badge>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* DOMAIN CHECKLISTS */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-6">
        {/* MEDICAL ACTION CHECKLIST */}
        {isMedicalSelected && (
          <Card className="border-blue-200 dark:border-blue-900 shadow-2xs">
            <CardHeader className="pb-3 border-b bg-blue-50/40 dark:bg-blue-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-bold">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Medical &amp; Physical Well-Being Actions
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-300">
                  Critical: First 72h
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs sm:text-sm">
              <div className="space-y-2.5">
                {[
                  {
                    id: "med_pep",
                    title: "Access HIV Post-Exposure Prophylaxis (PEP)",
                    detail:
                      "Under MoHFW NACO guidelines, PEP must be started within 72 hours of exposure to prevent HIV transmission. Available 24/7 at designated government tertiary hospitals and Anti-Retroviral Therapy (ART) centers.",
                  },
                  {
                    id: "med_forensic",
                    title: "Forensic Examination Without Mandatory Police FIR",
                    detail:
                      "Under Indian statutory healthcare mandates (Sec 357C CrPC / BNS counterpart), every registered hospital (public and private) is legally obligated to provide immediate free medical aid and forensic evidence collection without requiring an advance FIR.",
                  },
                  {
                    id: "med_clothing",
                    title: "Evidence Preservation Guidance",
                    detail:
                      "If you plan to preserve physical evidence: avoid bathing, douching, changing clothes, or brushing teeth before the medical exam if possible. If clothes were changed, place unwashed clothes in a clean paper bag (not plastic).",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!completedSteps[item.id]}
                      onChange={() => toggleStep(item.id)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-0.5">
                      <div className={`font-semibold ${completedSteps[item.id] ? "line-through text-muted-foreground" : "text-slate-900 dark:text-slate-100"}`}>
                        {item.title}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* EMOTIONAL ACTION CHECKLIST */}
        {isEmotionalSelected && (
          <Card className="border-emerald-200 dark:border-emerald-900 shadow-2xs">
            <CardHeader className="pb-3 border-b bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
                    <Heart className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Emotional Support &amp; Psychological Grounding
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300">
                  24/7 Free &amp; Confidential
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs sm:text-sm">
              <div className="space-y-2.5">
                {[
                  {
                    id: "emo_helpline",
                    title: "Connect with Tele-MANAS (Dial 14416)",
                    detail:
                      "Free, 24/7 confidential psychological support operated by NIMHANS and the Government of India across 20+ regional languages. No identification is requested.",
                  },
                  {
                    id: "emo_grounding",
                    title: "Practice 5-4-3-2-1 Sensory Grounding",
                    detail:
                      "When experiencing panic or flashback episodes: identify 5 things you can see, 4 things you can touch, 3 sounds you can hear, 2 scents you can smell, and 1 slow breath.",
                  },
                  {
                    id: "emo_confidant",
                    title: "Identify a Safe Anchor Person",
                    detail:
                      "Consider telling one trusted friend, family member, or counselor who respects your boundaries and does not pressure you into decisions you are not ready for.",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!completedSteps[item.id]}
                      onChange={() => toggleStep(item.id)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="space-y-0.5">
                      <div className={`font-semibold ${completedSteps[item.id] ? "line-through text-muted-foreground" : "text-slate-900 dark:text-slate-100"}`}>
                        {item.title}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* LEGAL ACTION CHECKLIST */}
        {isLegalSelected && (
          <Card className="border-purple-200 dark:border-purple-900 shadow-2xs">
            <CardHeader className="pb-3 border-b bg-purple-50/40 dark:bg-purple-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 font-bold">
                    <Scale className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Legal Protection &amp; Statutory Rights
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] text-purple-700 border-purple-300">
                  BNS 2023 &amp; Legal Aid
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs sm:text-sm">
              <div className="space-y-2.5">
                {[
                  {
                    id: "leg_zerofir",
                    title: "Understand Zero-FIR Rights",
                    detail:
                      "Under Indian law, a Zero-FIR can be registered at ANY police station regardless of jurisdiction where the incident occurred. The station must accept the complaint and transfer it to the jurisdictional station without delay.",
                  },
                  {
                    id: "leg_aid",
                    title: "Access Free Legal Counsel (NALSA / DLSA Helpline: 15100)",
                    detail:
                      "Under the Legal Services Authorities Act, all women and minors are entitled to free, state-funded legal representation regardless of financial status.",
                  },
                  {
                    id: "leg_privacy",
                    title: "Statutory Identity Concealment (Section 72 BNS)",
                    detail:
                      "The law strictly prohibits disclosing the identity or likeness of a survivor in public, police records, or media publications. Violations carry mandatory imprisonment.",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!completedSteps[item.id]}
                      onChange={() => toggleStep(item.id)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="space-y-0.5">
                      <div className={`font-semibold ${completedSteps[item.id] ? "line-through text-muted-foreground" : "text-slate-900 dark:text-slate-100"}`}>
                        {item.title}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* INTEGRATED ONE STOP CENTRE (SAKHI) NOTICE */}
      {/* ------------------------------------------------------------ */}
      <Card className="border-border/80 bg-slate-900 text-slate-100 shadow-sm print:bg-white print:text-black print:border-black">
        <CardContent className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400 print:text-black" />
            <h3 className="font-bold text-sm sm:text-base">
              One Stop Centre (Sakhi) All-in-One Facility
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            If navigating separate hospitals, police stations, and counseling services feels overwhelming, One Stop Centres (OSCs) provide all four services under a single roof: emergency medical care, trauma counseling, legal aid, and temporary safe shelter for up to 5 days.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/survivor/resources" className="print:hidden">
              <Button size="sm" variant="outline" className="text-xs border-slate-700 bg-slate-800 text-white hover:bg-slate-700 gap-1.5">
                <span>Find Your District One Stop Centre</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------ */}
      {/* ACTION TOOLBAR: PRINT, CLEAR SESSION, QUICK EXIT */}
      {/* ------------------------------------------------------------ */}
      <div className="rounded-xl border p-4 bg-card flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrintPlan}
            className="text-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save Checklist</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearSession}
            className="text-xs text-muted-foreground hover:text-red-600 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Stored Triage Answers</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/survivor/assistant" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>Ask Decision Assistant</span>
            </Button>
          </Link>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => performQuickExit()}
            className="flex-1 sm:flex-initial text-xs font-semibold gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Instant Quick Exit (Purge Session)</span>
          </Button>
        </div>
      </div>

      {clearedNotice && (
        <Alert variant="success" className="text-xs py-2 print:hidden">
          <CheckCircle2 className="h-4 w-4" />
          <span>Your local session selections have been completely erased from this browser.</span>
        </Alert>
      )}
    </div>
  );
}
