"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  GitFork,
  Bot,
  Database,
  ArrowRight,
  Lock,
  HeartHandshake,
  CheckCircle2,
  Scale,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SurvivorHomePage() {
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const sess =
        sessionStorage.getItem("secutrail_session_id") ||
        localStorage.getItem("secutrail_session_id");
      if (sess) {
        setSessionId(sess);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* ------------------------------------------------------------ */}
      {/* TRACK HERO & PRIVACY GUARANTEE */}
      {/* ------------------------------------------------------------ */}
      <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-xs text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 px-4 py-1.5 text-xs font-semibold">
          <HeartHandshake className="h-4 w-4 text-emerald-600" />
          <span>Confidential Survivor Decision Support</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          You are in control here.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          SecuTrail provides trauma-informed clarity without taking away your autonomy. We present medical, emotional, and legal options grounded in verified Indian statutory law — with zero pressure to report.
        </p>

        {/* Anonymous Session Badge */}
        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          <span>Anonymous Session:</span>
          <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
            {sessionId ? `${sessionId.substring(0, 16)}...` : "Active (In-Memory)"}
          </span>
          <span className="text-[10px] text-muted-foreground">• Expires after 30m idle</span>
        </div>

        {/* Immediate Danger Check */}
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/40 p-6 text-left space-y-3 mt-6">
          <div className="flex items-center gap-2 text-amber-950 dark:text-amber-100">
            <ShieldAlert className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0" />
            <h2 className="text-base font-bold">
              Immediate Safety Check: Are you in physical danger right now?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            If someone is threatening harm, attempting to enter, or you are unsafe where you are, please prioritize physical safety immediately.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link href="/survivor/safety" className="flex-1">
              <Button
                variant="destructive"
                className="w-full gap-2 text-xs font-bold bg-red-600 hover:bg-red-700 h-11"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>I Am In Immediate Danger (Emergency Steps)</span>
              </Button>
            </Link>

            <Link href="/survivor/triage" className="flex-1">
              <Button
                variant="default"
                className="w-full gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white h-11 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                <span>I Am Physically Safe (Proceed to Triage)</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* THE 5-STEP DECISION JOURNEY */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Clear, Calm Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            How The Survivor Track Works
          </h2>
          <p className="text-xs text-muted-foreground">
            You can move forward or backward through any step at your own pace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">01</span>
              <ShieldAlert className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Safety Check</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Screening for active physical danger, emergency hotlines (112, 1091).
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-2 border-primary/40 bg-secondary/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary">02</span>
              <GitFork className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Care Triage</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select Medical, Emotional, or Legal needs simultaneously.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">03</span>
              <Scale className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Agency Options</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Balanced option cards with timing, what to expect, and tradeoffs.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">04</span>
              <Database className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Verified Resources</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Audited One Stop Centres, legal clinics, and 24/7 helplines.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">05</span>
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Verified Assistant</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Grounded answers strictly cited to BNS 2023, MoHFW, and NALSA.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* DIRECT PATHWAY LAUNCH CARDS */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pathway 1: Triage */}
        <Card className="rounded-2xl hover:border-slate-400 transition-all flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-2">
              <GitFork className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="w-fit text-[11px] mb-1">
              Step 02
            </Badge>
            <CardTitle className="text-base font-bold">
              Multi-Path Triage
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Identify your relevant support categories: medical prophylaxis, counseling, or legal rights without locking yourself in.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/survivor/triage">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs rounded-lg">
                <span>Start Triage Care</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pathway 2: Agency Options */}
        <Card className="rounded-2xl hover:border-slate-400 transition-all flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 mb-2">
              <Scale className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="w-fit text-[11px] mb-1">
              Step 03
            </Badge>
            <CardTitle className="text-base font-bold">
              Your Available Options
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Review clear option cards outlining medical care, reporting choices, and emotional counseling with transparent timelines.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/survivor/options">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs rounded-lg">
                <span>Explore Option Cards</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pathway 3: Verified Resources */}
        <Card className="rounded-2xl hover:border-slate-400 transition-all flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
              <Database className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="w-fit text-[11px] mb-1">
              Step 04
            </Badge>
            <CardTitle className="text-base font-bold">
              Verified Resource Directory
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Browse pre-screened government hospitals, One Stop Centres (Sakhi), legal aid clinics, and 24/7 confidential helplines.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/survivor/resources">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs rounded-lg">
                <span>Browse Directory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* CONFIDENTIALITY REASSURANCE BAR */}
      {/* ------------------------------------------------------------ */}
      <div className="rounded-2xl border bg-slate-900 text-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
            <EyeOff className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold">
              Zero PII Architecture
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
              No registration or account creation. Press <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-slate-200">ESC</kbd> twice or click Quick Exit at any time to immediately replace this screen and wipe all session keys.
            </p>
          </div>
        </div>

        <Link href="/privacy" className="shrink-0">
          <Button variant="outline" size="sm" className="text-xs border-slate-700 bg-slate-800 text-white hover:bg-slate-700 rounded-lg">
            Privacy Threat Model
          </Button>
        </Link>
      </div>
    </div>
  );
}
