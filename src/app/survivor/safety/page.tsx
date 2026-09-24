"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { SafetyClassifier } from "@/services/safety/safetyClassifier";
import { SafetyClassificationResult } from "@/types";

const QUICK_SITUATION_CHIPS = [
  {
    label: "I am in immediate physical danger right now",
    query: "someone is following me and threatening violence right now",
  },
  {
    label: "I need HIV PEP or emergency contraception (within 72 hours)",
    query: "I need emergency PEP within 72 hours and morning after pill",
  },
  {
    label: "A child or minor under 18 is involved",
    query: "A 16 year old minor school student was assaulted",
  },
  {
    label: "I am having overwhelming thoughts of self-harm or panic",
    query: "I feel panic, crying, shaking, and thoughts of self harm",
  },
  {
    label: "I have questions about legal rights or Zero-FIR",
    query: "How do I file a Zero FIR under BNS without getting arrested?",
  },
];

export default function ImmediateSafetyPage() {
  const router = useRouter();
  const [inputText, setInputText] = React.useState<string>("");
  const [classification, setClassification] = React.useState<SafetyClassificationResult | null>(null);

  const handleClassify = (text: string) => {
    setInputText(text);
    if (!text.trim()) {
      setClassification(null);
      return;
    }
    const result = SafetyClassifier.classify(text);
    setClassification(result);
  };

  const handleProceedToTriage = () => {
    if (classification) {
      try {
        const triageData = {
          selectedDomains: classification.recommendedPaths,
          timeframe:
            classification.category === "MEDICAL_URGENCY"
              ? "UNDER_72_HOURS"
              : "UNDER_5_DAYS",
          updatedAt: Date.now(),
        };
        sessionStorage.setItem("secutrail_triage", JSON.stringify(triageData));
        localStorage.setItem("secutrail_triage", JSON.stringify(triageData));
      } catch {
        // Safe fallback
      }
    }
    router.push("/survivor/triage");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
          Step 01 • Safety &amp; Risk Classifier
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Immediate Safety Screening
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Before exploring care pathways, we check if you are in active physical danger or need urgent medical attention. You can use our confidential situation screener or skip directly to triage.
        </p>
      </div>

      {/* Direct Emergency Call Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-red-500 bg-card p-5 text-center space-y-2 shadow-xs">
          <span className="rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-0.5 text-[10px] font-bold uppercase">
            National Emergency
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            112
          </h2>
          <p className="text-xs text-muted-foreground">
            Unified emergency dispatch for Police, Medical Ambulance &amp; Rescue across all states in India.
          </p>
          <a
            href="tel:112"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call 112 Now</span>
          </a>
        </div>

        <div className="rounded-xl border-2 border-amber-500 bg-card p-5 text-center space-y-2 shadow-xs">
          <span className="rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold uppercase">
            Women Helpline
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            1091 / 181
          </h2>
          <p className="text-xs text-muted-foreground">
            Dedicated 24/7 crisis response, female police officers, and emergency shelter assistance.
          </p>
          <a
            href="tel:1091"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call 1091 Now</span>
          </a>
        </div>

        <div className="rounded-xl border-2 border-blue-500 bg-card p-5 text-center space-y-2 shadow-xs">
          <span className="rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold uppercase">
            Childline (Under 18)
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            1098
          </h2>
          <p className="text-xs text-muted-foreground">
            Mandatory emergency outreach and POCSO legal protection for children and minors.
          </p>
          <a
            href="tel:1098"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call 1098 Now</span>
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* CONFIDENTIAL SAFETY / RISK CLASSIFIER WIDGET */}
      {/* ------------------------------------------------------------ */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Confidential Situation Screener (Deterministic Risk Classifier)
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Tap a quick statement or describe what is happening. The deterministic classifier identifies time-sensitive medical windows or safety risks without storing your words on any server.
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Quick Situation Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Quick Situations:
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_SITUATION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleClassify(chip.query)}
                  className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-secondary transition-colors text-left"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input for Custom Situation */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Or describe in your own words (completely private, never saved):
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => handleClassify(e.target.value)}
                placeholder="E.g., I'm safe now at home, but I am worried about infections from last night..."
                rows={2}
                className="w-full rounded-lg border border-input bg-background p-3 text-xs shadow-2xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Real-Time Classification Output */}
          {classification && (
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900/60 p-4 space-y-3 animate-in fade-in-50">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Category: {classification.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      classification.urgency === "CRITICAL"
                        ? "destructive"
                        : classification.urgency === "HIGH"
                        ? "warning"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    Urgency: {classification.urgency}
                  </Badge>
                </div>
              </div>

              {/* Emergency Alert if Critical */}
              {classification.requiresEmergencyRouting && (
                <Alert variant="emergency" className="border-red-400 bg-red-100/60">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  <div>
                    <AlertTitle className="text-xs font-bold text-red-950">
                      High-Priority Emergency Notice
                    </AlertTitle>
                    <AlertDescription className="text-xs text-red-900 leading-normal mt-0.5">
                      {classification.guidanceMessage}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Recommended Paths */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                  Identified Relevant Support Paths:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {classification.recommendedPaths.map((domain) => (
                    <Badge key={domain} variant="verified" className="text-[11px] uppercase font-bold">
                      {domain === "MEDICAL" && "Medical & Prophylaxis (PEP)"}
                      {domain === "EMOTIONAL" && "Emotional Support & Helplines"}
                      {domain === "LEGAL" && "Legal Rights (BNS 2023)"}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {classification.guidanceMessage}
              </p>

              {/* Proceed with recommendations */}
              <div className="pt-2 flex justify-end">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleProceedToTriage}
                  className="gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <span>Apply Recommendations &amp; Proceed to Triage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Practical Physical Safety Protocol */}
      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <span>Immediate Safety Steps If You Feel Unsafe</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>1. Move to a Secured Space</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If indoors, lock doors and windows. If outside, move toward well-lit public areas (24/7 pharmacies, metro stations, hospital emergency desks, security checkpoints).
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <Users className="h-4 w-4 text-emerald-600" />
                <span>2. Alert a Trusted Contact</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Send a quick location pin or pre-arranged code word to a trusted friend, family member, or neighbor who can come or call emergency responders for you.
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <Eye className="h-4 w-4 text-emerald-600" />
                <span>3. Silent Emergency Calls</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If speaking aloud puts you in danger, dial 112 and leave the line open. Dispatchers are trained to track the location of unmuted calls where silence or struggle is heard.
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>4. Digital Privacy &amp; Quick Exit</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If someone approaches your screen, press <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 font-mono text-[10px]">ESC</kbd> twice or click Quick Exit at the top right to instantly replace this page with neutral weather information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action / Skip Controls to Preserve User Agency */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        <Link href="/survivor">
          <Button variant="outline" size="sm" className="text-xs">
            ← Back to Track Overview
          </Button>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/survivor/triage" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <span>Skip Screening &amp; Go Directly to Triage</span>
            </Button>
          </Link>

          <Button
            variant="default"
            size="sm"
            onClick={handleProceedToTriage}
            className="flex-1 sm:flex-initial gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
          >
            <span>Proceed to Step 02: Triage Care</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
