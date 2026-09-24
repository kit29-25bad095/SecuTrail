"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Heart,
  Scale,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SupportDomain } from "@/types";

const INDIAN_STATES = [
  { code: "DL", name: "Delhi", districts: ["South Delhi", "New Delhi", "South West Delhi", "North Delhi"] },
  { code: "MH", name: "Maharashtra", districts: ["Mumbai", "Pune", "Thane", "Nagpur"] },
  { code: "KA", name: "Karnataka", districts: ["Bengaluru Urban", "Mysuru", "Mangaluru"] },
  { code: "TN", name: "Tamil Nadu", districts: ["Chennai", "Coimbatore", "Madurai"] },
  { code: "UP", name: "Uttar Pradesh", districts: ["Lucknow", "Noida / Gautam Buddha Nagar", "Varanasi"] },
  { code: "WB", name: "West Bengal", districts: ["Kolkata", "Howrah"] },
];

export default function TriagePage() {
  const router = useRouter();

  // Multi-path selection: multiple domains simultaneously!
  const [selectedDomains, setSelectedDomains] = React.useState<SupportDomain[]>([
    "MEDICAL",
    "EMOTIONAL",
  ]);

  const [timeframe, setTimeframe] = React.useState<string>("UNDER_72_HOURS");
  const [wantsLocalResources, setWantsLocalResources] = React.useState<boolean>(false);
  const [selectedState, setSelectedState] = React.useState<string>("Delhi");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("South Delhi");

  // Load existing state if available
  React.useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem("secutrail_triage") ||
        localStorage.getItem("secutrail_triage");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.selectedDomains) setSelectedDomains(parsed.selectedDomains);
        if (parsed.timeframe) setTimeframe(parsed.timeframe);
        if (parsed.state) {
          setWantsLocalResources(true);
          setSelectedState(parsed.state);
        }
        if (parsed.district) setSelectedDistrict(parsed.district);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const toggleDomain = (domain: SupportDomain) => {
    if (selectedDomains.includes(domain)) {
      // Don't allow empty; require at least one
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter((d) => d !== domain));
      }
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const foundState = INDIAN_STATES.find((s) => s.name === stateName);
    if (foundState && foundState.districts.length > 0) {
      setSelectedDistrict(foundState.districts[0]);
    }
  };

  const currentDistricts =
    INDIAN_STATES.find((s) => s.name === selectedState)?.districts || [];

  const handleContinue = (target: "/survivor/options" | "/survivor/resources") => {
    const triageData = {
      selectedDomains,
      timeframe,
      state: wantsLocalResources ? selectedState : null,
      district: wantsLocalResources ? selectedDistrict : null,
      updatedAt: Date.now(),
    };

    try {
      const serialized = JSON.stringify(triageData);
      sessionStorage.setItem("secutrail_triage", serialized);
      localStorage.setItem("secutrail_triage", serialized);
    } catch {
      // Safe fallback
    }

    router.push(target);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
          Step 02 • Care Matrix
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          What areas of support are relevant to you?
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Select any or all areas below. SecuTrail never forces you down a single rigid pathway. You choose what matters right now.
        </p>
      </div>

      {/* 1. Multi-Path Domain Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MEDICAL */}
        <div
          onClick={() => toggleDomain("MEDICAL")}
          className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex flex-col justify-between ${
            selectedDomains.includes("MEDICAL")
              ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm"
              : "border-slate-200 bg-card hover:border-slate-300 dark:border-slate-800"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-bold">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  selectedDomains.includes("MEDICAL")
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedDomains.includes("MEDICAL") && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Medical Care
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              HIV PEP prophylaxis within 72 hours, emergency contraception, injury care, and free forensic examination without mandatory police FIR.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t text-[11px] font-semibold text-blue-700 dark:text-blue-300">
            Critical window: 72h for PEP
          </div>
        </div>

        {/* EMOTIONAL */}
        <div
          onClick={() => toggleDomain("EMOTIONAL")}
          className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex flex-col justify-between ${
            selectedDomains.includes("EMOTIONAL")
              ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm"
              : "border-slate-200 bg-card hover:border-slate-300 dark:border-slate-800"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
                <Heart className="h-5 w-5" />
              </div>
              <div
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  selectedDomains.includes("EMOTIONAL")
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedDomains.includes("EMOTIONAL") && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Emotional Support
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Trauma stabilization, non-judgmental crisis lines (Tele-MANAS), grounding techniques, and safe space counseling.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            24/7 Free &amp; Anonymous Helplines
          </div>
        </div>

        {/* LEGAL */}
        <div
          onClick={() => toggleDomain("LEGAL")}
          className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex flex-col justify-between ${
            selectedDomains.includes("LEGAL")
              ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 shadow-sm"
              : "border-slate-200 bg-card hover:border-slate-300 dark:border-slate-800"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 font-bold">
                <Scale className="h-5 w-5" />
              </div>
              <div
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  selectedDomains.includes("LEGAL")
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-300"
                }`}
              >
                {selectedDomains.includes("LEGAL") && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Legal Information
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Statutory rights under BNS 2023, Zero-FIR procedures, free legal aid via NALSA/DLSA, and evidence preservation guidelines.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t text-[11px] font-semibold text-purple-700 dark:text-purple-300">
            Free Advocates via DLSA / NALSA
          </div>
        </div>
      </div>

      {/* 2. Timing Considerations */}
      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Timeframe Sensitivity (Optional Context)</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Certain medical options (such as HIV PEP) are clinically time-critical. Selecting a timeframe helps surface relevant timing alerts.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              { id: "UNDER_72_HOURS", label: "Within the last 72 hours", note: "PEP and emergency contraception highly effective" },
              { id: "UNDER_5_DAYS", label: "Within the last 5 days", note: "Certain contraceptive & forensic options remain" },
              { id: "PAST_MONTH", label: "More than 5 days ago / Ongoing", note: "Emotional counseling, legal aid & STI screenings" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeframe(t.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  timeframe === t.id
                    ? "border-primary bg-secondary/80 font-semibold text-foreground"
                    : "border-border bg-card hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="font-medium text-foreground">{t.label}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{t.note}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Progressive Location Consent */}
      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Progressive Location Consent</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            SecuTrail never accesses GPS or exact coordinates. You can choose whether to see local district facilities or browse national services only.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-0 text-xs sm:text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wantsLocalResources}
              onChange={(e) => setWantsLocalResources(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Yes, show me verified local resources in my state and district
            </span>
          </label>

          {wantsLocalResources && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t animate-in fade-in-50">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select State:
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-1 focus:ring-ring"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select District / City:
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:ring-1 focus:ring-ring"
                >
                  {currentDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action choices */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Selections saved in local browser session only</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="default"
            onClick={() => handleContinue("/survivor/resources")}
            className="flex-1 sm:flex-initial text-xs"
          >
            <span>Skip to Resources Directly</span>
          </Button>

          <Button
            variant="default"
            size="default"
            onClick={() => handleContinue("/survivor/options")}
            className="flex-1 sm:flex-initial gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
          >
            <span>View Agency-First Options</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
