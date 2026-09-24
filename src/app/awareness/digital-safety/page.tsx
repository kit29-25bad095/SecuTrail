"use client";

import * as React from "react";
import Link from "next/link";
import {
  Smartphone,
  AlertTriangle,
  Scale,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Globe,
  Camera,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EducationalDisclaimer } from "@/components/awareness/EducationalDisclaimer";
import { AudiencePills } from "@/components/awareness/AudiencePills";
import { HelplineButton } from "@/components/common/HelplineButton";

export default function DigitalSafetyAwarenessPage() {
  const [selectedMitigationStep, setSelectedMitigationStep] = React.useState<number>(0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
            Curriculum Core • Guide 04
          </Badge>
          <AudiencePills
            audiences={["students", "educators", "parents", "bystanders", "supporters"]}
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Digital Safety, Tech Abuse &amp; Online Boundaries
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Technology is frequently weaponized to harass, blackmail, monitor, and isolate individuals. Understanding digital boundaries, cyber laws under Indian statutes, and evidence preservation empowers you to reclaim digital autonomy.
        </p>

        <EducationalDisclaimer topic="cyber safety, tech-facilitated abuse, and the IT Act 2000" />
      </div>

      {/* 1. Recognizing Forms of Technology-Facilitated Abuse */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Threat Taxonomy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Recognizing Common Forms of Tech Abuse
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Digital violence is real violence with severe psychological and social consequences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* NCII */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Non-Consensual Images (NCII)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Threatening to post, forward, or trade private photographs or videos taken with or without consent. Often labeled &ldquo;revenge porn&rdquo; or blackmail.
            </p>
            <div className="text-[10px] font-semibold text-red-600 dark:text-red-400 pt-1 border-t">
              Criminal Offence: Sec 66E / 67 IT Act
            </div>
          </div>

          {/* Sextortion */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Sextortion &amp; Coercion
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Demanding money, additional explicit content, or sexual compliance under the threat of exposing past messages, images, or morphed deepfakes to contacts.
            </p>
            <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 pt-1 border-t">
              Extortion Offence under BNS 2023
            </div>
          </div>

          {/* Cyberstalking */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Cyberstalking &amp; Stalkerware
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Persistent unwanted calls, messages across multiple dummy profiles, secret installation of GPS tracking apps, or hiding Bluetooth tags in bags.
            </p>
            <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 pt-1 border-t">
              Section 77 BNS (Electronic Stalking)
            </div>
          </div>

          {/* Doxxing */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Doxxing &amp; Impersonation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Publishing someone&apos;s phone number, address, workplace, or family details online to incite mass harassment, or creating fake dating profiles in their name.
            </p>
            <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 pt-1 border-t">
              Section 66D IT Act (Impersonation)
            </div>
          </div>
        </div>
      </section>

      {/* 2. Step-by-Step Incident Response Protocol */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Action Protocol
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Immediate Response: What to Do If You Are Targeted
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Follow these evidence-based steps to protect yourself and build an enforceable legal paper trail:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              step: "Step 01",
              title: "Do NOT Pay or Comply",
              desc: "Never transfer money or send more photos. Blackmailers almost never delete media after payment; they demand more.",
            },
            {
              step: "Step 02",
              title: "Preserve Evidence",
              desc: "Take screenshots showing full URLs, account handles, phone numbers, and timestamps before blocking or reporting.",
            },
            {
              step: "Step 03",
              title: "StopNCII.org Protection",
              desc: "Use StopNCII.org to generate cryptographic digital hashes locally on your device to block image distribution on platforms.",
            },
            {
              step: "Step 04",
              title: "Report to Cyber Police (1930)",
              desc: "File a confidential complaint at cybercrime.gov.in or dial 1930 (National Cyber Crime Helpline).",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                selectedMitigationStep === idx
                  ? "border-primary bg-secondary/70 shadow-xs"
                  : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40"
              }`}
              onClick={() => setSelectedMitigationStep(idx)}
            >
              <span className="text-xs font-mono font-bold text-primary block mb-1">
                {item.step}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Statutory Protections under Indian Law */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <Scale className="h-5 w-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Indian Statutory Legal Provisions for Digital Crimes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
            <Badge variant="outline" className="text-[10px] text-purple-700 dark:text-purple-300">
              IT Act 2000 • Section 66E
            </Badge>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              Violation of Bodily Privacy
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Capturing, publishing, or transmitting images of a private area of any person without consent carries up to 3 years imprisonment or fine up to ₹2 lakh.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
            <Badge variant="outline" className="text-[10px] text-purple-700 dark:text-purple-300">
              IT Act 2000 • Section 67 &amp; 67A
            </Badge>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              Publishing Obscene Content
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Transmitting sexually explicit material in electronic form carries mandatory imprisonment of up to 5 years (first conviction) and up to ₹10 lakh fine.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/40 space-y-1.5">
            <Badge variant="outline" className="text-[10px] text-purple-700 dark:text-purple-300">
              BNS 2023 • Section 77
            </Badge>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              Electronic &amp; Cyber Stalking
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Monitoring the internet, email, or electronic communication of a person despite disinterest is a criminal offence under the new Bharatiya Nyaya Sanhita.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Guidance for Parents & Educators */}
      <section className="rounded-2xl border-2 border-amber-200 bg-amber-50/30 p-6 sm:p-8 space-y-4 dark:border-amber-900/60 dark:bg-amber-950/20">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-lg font-bold">
            Guidance for Parents &amp; Educators: Handling Teen Sextortion
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          When teenagers or young students face online blackmail, their primary terror is parental shame and punishment. How adults respond determines whether the teen seeks help or attempts self-harm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4 space-y-2 dark:border-emerald-800 dark:bg-emerald-950/40">
            <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Recommended Supportive Adult Response</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              &ldquo;You are safe with me. You did not do anything wrong—the person blackmailing you is a criminal who is targeting you. We will handle this together step by step.&rdquo; Focus on emotional safety first, then technical reporting.
            </p>
          </div>

          <div className="rounded-xl border border-red-300 bg-red-50/70 p-4 space-y-2 dark:border-red-800 dark:bg-red-950/40">
            <div className="font-bold text-xs text-red-900 dark:text-red-200 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Dangerous Reaction to Avoid</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Yelling, blaming them (&ldquo;Why would you send such a thing? You ruined our family reputation!&rdquo;), or immediately confiscating their device. This isolates the victim and drives them directly back into the blackmailer&apos;s trap.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Emergency Resources & Official Portals */}
      <section className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" />
          <span>Statutory Reporting Helplines for Cyber Offences</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Contact statutory authorities for takedown assistance and cyber crime investigation:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <HelplineButton
            number="1930"
            label="National Cyber Crime Helpline"
            description="MHA National Cyber Portal (24/7)"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="1098"
            label="Childline (Minor Victims)"
            description="POCSO & child sexual abuse protection"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="112"
            label="National Emergency (ERSS)"
            description="Immediate physical intimidation"
            variant="emergency"
            size="sm"
          />
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
        <Link href="/awareness/bystander-support">
          <Button variant="outline" size="sm" className="text-xs">
            ← Previous: Bystander Framework (5Ds)
          </Button>
        </Link>
        <Link href="/awareness/get-help">
          <Button variant="default" size="sm" className="gap-2 text-xs font-semibold bg-slate-900 text-white">
            <span>Next Guide: How to Get Help &amp; Support</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
