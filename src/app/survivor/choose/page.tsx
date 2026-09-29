"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bot,
  GitFork,
  ArrowRight,
  Lock,
  HeartHandshake,
  CheckCircle2,
  ArrowLeft,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function ChoosePathwayPage() {
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* ------------------------------------------------------------ */}
      {/* HEADER & CHOICE REASSURANCE */}
      {/* ------------------------------------------------------------ */}
      <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-xs text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 px-4 py-1.5 text-xs font-semibold">
          <HeartHandshake className="h-4 w-4 text-emerald-600" />
          <span>Support Selection • You Decide</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          How would you like to receive support?
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          You are physically safe. Choose the way you want to explore support right now.
          You can talk freely with our interactive AI assistant or explore structured, informative triage guidelines at your own pace.
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
      </div>

      {/* ------------------------------------------------------------ */}
      {/* TWO PRIMARY PATHWAYS: SPEAK WITH AI vs TRIAGE INFO */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* CARD 1: SPEAK WITH AI */}
        <Card className="rounded-3xl border-2 border-blue-200 hover:border-blue-400 dark:border-blue-900/60 dark:hover:border-blue-700 bg-gradient-to-b from-blue-50/40 via-card to-card dark:from-blue-950/20 dark:via-card dark:to-card p-6 flex flex-col justify-between shadow-sm transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <Bot className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 text-xs font-semibold">
                Interactive Chatbot
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Speak with AI Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Ask anything in a private, interactive chat. The assistant answers strictly from verified memory—with tailored, responsive replies for your specific questions and zero repeated generic answers.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ask anything in your own words with conversational continuity</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Answers grounded strictly in verified memory (BNS 2023, MoHFW, NALSA)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Responsive, specific replies tailored to each question you ask</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% confidential and anonymous with instant Quick Exit</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/survivor/assistant" className="block">
              <Button
                size="lg"
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-sm shadow-sm"
              >
                <Bot className="h-4 w-4" />
                <span>Speak with AI Assistant</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* CARD 2: TRIAGE INFORMATION */}
        <Card className="rounded-3xl border-2 border-emerald-200 hover:border-emerald-400 dark:border-emerald-900/60 dark:hover:border-emerald-700 bg-gradient-to-b from-emerald-50/40 via-card to-card dark:from-emerald-950/20 dark:via-card dark:to-card p-6 flex flex-col justify-between shadow-sm transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                <GitFork className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs font-semibold">
                Informative Guide
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Explore Triage Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                A structured, self-paced informative overview. Review your options across medical care, emotional support, and legal rights with clear timelines and verified directories.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Multi-path selection: Medical, Emotional, or Legal needs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Clear clinical timelines: 72-hour HIV PEP &amp; emergency contraception</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Transparent option cards outlining expectations, pros &amp; tradeoffs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Audited directory of One Stop Centres and government hospitals</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/survivor/triage" className="block">
              <Button
                size="lg"
                className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl text-sm shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <GitFork className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                <span>Explore Triage Information</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* CONFIDENTIALITY REASSURANCE & QUICK EXIT */}
      {/* ------------------------------------------------------------ */}
      <div className="rounded-2xl border bg-slate-900 text-slate-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
            <EyeOff className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold">
              Complete Privacy Guarantee
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Whichever option you choose, no personal data is saved. Press <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-slate-200">ESC</kbd> twice or click Quick Exit at any time to instantly leave.
            </p>
          </div>
        </div>

        <Link href="/survivor" className="shrink-0 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs border-slate-700 bg-slate-800 text-white hover:bg-slate-700 rounded-lg gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Safety Check</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
