"use client";

import * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Heart,
  Scale,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EducationalDisclaimer } from "@/components/awareness/EducationalDisclaimer";
import { AudiencePills } from "@/components/awareness/AudiencePills";
import { HelplineButton } from "@/components/common/HelplineButton";

export default function GetHelpAwarenessPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
            Curriculum Core • Guide 05
          </Badge>
          <AudiencePills
            audiences={["students", "educators", "parents", "bystanders", "supporters"]}
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          How to Navigate Support &amp; Where to Turn
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Following an incident or disclosure, navigating the first steps can feel overwhelming. This guide breaks down medical priorities, emotional crisis care, and legal aid in India—without pressure, judgment, or compulsory reporting.
        </p>

        <EducationalDisclaimer topic="emergency healthcare, statutory helplines, and crisis response" />
      </div>

      {/* 1. Time-Sensitive Healthcare Priorities (The 72-Hour Window) */}
      <section className="rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-6 sm:p-8 space-y-4 dark:border-blue-900/60 dark:bg-blue-950/20">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
          <Clock className="h-5 w-5" />
          <h2 className="text-lg sm:text-xl font-bold">
            Time-Sensitive Healthcare: The Critical 72-Hour Window
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Certain medical preventative treatments are highly time-critical. You have the right to receive urgent healthcare immediately without deciding whether to report to the police.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="rounded-xl border border-blue-300 bg-white dark:bg-slate-900 p-4 space-y-2">
            <span className="font-bold text-xs text-blue-700 dark:text-blue-300 block">
              1. HIV Post-Exposure Prophylaxis (PEP)
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              PEP is a 28-day antiretroviral regimen that prevents HIV from replicating in the body after potential exposure. It is <strong>most effective within 72 hours</strong> and should be started as early as possible.
            </p>
          </div>

          <div className="rounded-xl border border-blue-300 bg-white dark:bg-slate-900 p-4 space-y-2">
            <span className="font-bold text-xs text-blue-700 dark:text-blue-300 block">
              2. Emergency Contraception
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Emergency contraceptive pills (such as levonorgestrel) are effective within 72 hours of potential pregnancy risk. Certain copper IUDs can be placed up to 120 hours (5 days) post-incident.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-100/50 dark:border-blue-800 dark:bg-blue-900/30 text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
          <strong>Statutory Healthcare Guarantee:</strong> Under Section 357C of the Code of Criminal Procedure (and Section 396 of Bharatiya Nagarik Suraksha Sanhita), all hospitals—public and private—are legally mandated to provide immediate, free medical first aid and forensic treatment. You <strong>cannot</strong> be forced to file a police FIR before receiving emergency healthcare.
        </div>
      </section>

      {/* 2. The Three Parallel Pillars of Support */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Care Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Three Parallel Pillars of Support
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            You do not need to follow a rigid linear path. Explore any pillar on your own terms:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Medical */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Medical Care
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hospital emergency rooms, One Stop Centres, STI preventative antibiotics, PEP protocols, and dignified forensic examinations by female medical officers.
            </p>
            <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 pt-2 border-t">
              Free Emergency Medical Aid
            </div>
          </div>

          {/* Emotional */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Emotional Stabilization
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              24/7 free national psychological helplines (Tele-MANAS 14416), hospital-based counseling desks (Dilaasa), and grounding practices to process shock safely.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 pt-2 border-t">
              Confidential &amp; Non-Judgmental
            </div>
          </div>

          {/* Legal */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Legal Literacy &amp; Aid
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Understanding Zero-FIR provisions, statement recording by women magistrates (Sec 183 BNSS), and free designated advocates through NALSA (15100).
            </p>
            <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 pt-2 border-t">
              Free Counsel under Section 12 LSA Act
            </div>
          </div>
        </div>
      </section>

      {/* 3. How to Support a Friend (Dos & Don'ts) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            How to Support Someone Who Discloses Assault
          </h2>
          <p className="text-xs text-muted-foreground">
            A guide for friends, family members, educators, and allies:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What to DO */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Recommended Supportive Actions (DO)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Believe Them:</strong> Say: &ldquo;I believe you, and I am glad you told me.&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Remind Them It&apos;s Not Their Fault:</strong> Trauma often causes internal guilt; reassure them that the perpetrator is 100% responsible.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Offer Choices, Don&apos;t Demand:</strong> Say: &ldquo;Would you like to sit together, or should I help you find medical information?&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Keep Confidentiality:</strong> Do not share their disclosure with mutual friends or family without their explicit consent.</span>
              </li>
            </ul>
          </div>

          {/* What NOT to DO */}
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 space-y-3 dark:border-red-900/60 dark:bg-red-950/20">
            <div className="font-bold text-sm text-red-900 dark:text-red-200 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>Harmful Reactions to Avoid (DON&apos;T)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Don&apos;t Interrogate:</strong> Avoid asking &ldquo;Why did you go with them?&rdquo; or &ldquo;How much had you drank?&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Don&apos;t Force Police Reporting:</strong> Forcing a survivor into a police station before they are emotionally ready causes secondary trauma.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Don&apos;t Make It About Yourself:</strong> Avoid emotional outbursts like &ldquo;I am going to kill them!&rdquo; which forces the survivor to calm you down.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>Don&apos;t Minimize:</strong> Never say &ldquo;At least it wasn&apos;t worse&rdquo; or &ldquo;You just need to move on.&rdquo;</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Direct Entry to Survivor Track */}
      <section className="rounded-2xl border-2 border-slate-900 bg-slate-900 text-white p-6 sm:p-8 space-y-4 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-emerald-400 dark:text-emerald-600" />
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Seeking Care for Yourself Right Now?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-700 max-w-2xl leading-relaxed">
              Enter the confidential Survivor Track for deterministic safety checks, simultaneous medical/emotional/legal triage, and agency-first options. Completely anonymous with zero server tracking.
            </p>
          </div>

          <Link href="/survivor" className="shrink-0">
            <Button
              size="lg"
              variant="default"
              className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500"
            >
              <span>Enter Survivor Support Track</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. Statutory 24/7 Helplines Directory */}
      <section className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" />
          <span>Statutory 24/7 Indian Emergency Helplines</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          All numbers below are verified government-funded statutory hotlines:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <HelplineButton
            number="112"
            label="National Emergency"
            description="Immediate physical danger"
            variant="emergency"
            size="sm"
          />
          <HelplineButton
            number="1091"
            label="Women Helpline"
            description="24/7 nationwide crisis line"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="181"
            label="Women in Distress"
            description="Shelter & emergency support"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="14416"
            label="Tele-MANAS"
            description="Mental health counseling (free)"
            variant="mental-health"
            size="sm"
          />
          <HelplineButton
            number="1098"
            label="Childline (POCSO)"
            description="Minor protection services"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="15100"
            label="NALSA Legal Aid"
            description="Free statutory legal counsel"
            variant="legal"
            size="sm"
          />
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
        <Link href="/awareness/digital-safety">
          <Button variant="outline" size="sm" className="text-xs">
            ← Previous: Digital Safety &amp; Tech Abuse
          </Button>
        </Link>
        <Link href="/awareness">
          <Button variant="default" size="sm" className="gap-2 text-xs font-semibold bg-slate-900 text-white">
            <span>Back to Curriculum Overview</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
