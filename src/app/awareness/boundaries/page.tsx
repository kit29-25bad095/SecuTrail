"use client";

import * as React from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  Heart,
  Smartphone,
  Users,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EducationalDisclaimer } from "@/components/awareness/EducationalDisclaimer";
import { AudiencePills } from "@/components/awareness/AudiencePills";
import { HelplineButton } from "@/components/common/HelplineButton";

export default function BoundariesAwarenessPage() {
  const [selectedScriptTab, setSelectedScriptTab] = React.useState<string>("digital");
  const [selectedScenarioChoice, setSelectedScenarioChoice] = React.useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
            Curriculum Core • Guide 02
          </Badge>
          <AudiencePills
            audiences={["students", "educators", "parents", "bystanders", "supporters"]}
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Recognizing Boundaries &amp; Coercive Behaviors
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Healthy relationships are rooted in mutual respect for personal limits. Coercion begins when someone systematically tests, pushes, or punishes boundaries to assert power and entitlement.
        </p>

        <EducationalDisclaimer topic="boundaries, psychological coercion, and the POSH Act 2013" />
      </div>

      {/* 1. Four Pillars of Personal Boundaries */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Boundary Anatomy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            The Four Types of Personal Boundaries
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Boundaries define what feels safe, comfortable, and acceptable in interactions with others.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Physical */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              1. Physical Boundaries
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your body, personal space, need for rest, and privacy. You have the sovereign right to decide who touches you, when, and how closely they stand.
            </p>
          </div>

          {/* Emotional */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              2. Emotional Boundaries
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your right to your feelings, privacy of your thoughts, and protection from emotional dumping, guilt-tripping, or being blamed for another&apos;s moods.
            </p>
          </div>

          {/* Digital */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              3. Digital Boundaries
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your right to phone privacy, password confidentiality, freedom from constant location tracking, and autonomy over whether to share personal media.
            </p>
          </div>

          {/* Relational / Social */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              4. Social Boundaries
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your freedom to maintain friendships, family relationships, hobbies, and career goals without needing permission or enduring jealousy.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Boundary Erosion & Coercive Control Spectrum */}
      <section className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              How Violations Escalate: Boundary Erosion
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Perpetrators rarely begin with extreme acts. They systematically test compliance in stages:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              STAGE 01 • Testing
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Small Infringements
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Making subtle boundary-crossing &ldquo;jokes&rdquo;, invading personal space, or testing reactions when a minor boundary is mentioned. If you speak up, they claim you are &ldquo;overreacting&rdquo;.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
              STAGE 02 • Wear-Down
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Persistence &amp; Guilt
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Badgering you after a clear &ldquo;No&rdquo;. Using emotional manipulation: &ldquo;If you really cared about me, you would do this.&rdquo; Normalizes ignoring your limits until you give in out of exhaustion.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
              STAGE 03 • Entitlement
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Isolation &amp; Control
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Demanding complete access to passwords, monitoring friendships, or threatening social ruin/career impact if compliance isn&apos;t given. Consent is effectively extinguished.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Handling Rejection with Integrity & Self-Control */}
      <section className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/30 p-6 sm:p-8 space-y-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
        <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
          <Users className="h-5 w-5" />
          <h2 className="text-lg font-bold">
            Essential Life Skill: Taking &ldquo;No&rdquo; With Dignity
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Hearing a refusal can sting, but someone establishing a boundary is not an insult or a debate. Responding with grace, self-control, and maturity is the hallmark of emotional health.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 space-y-2 dark:border-emerald-800 dark:bg-emerald-950/40">
            <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Mature &amp; Respectful Response</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              &ldquo;I understand completely. Thank you for being honest with me.&rdquo; Accept the answer immediately, drop the subject, and do not make the interaction awkward or hostile.
            </p>
          </div>

          <div className="rounded-xl border border-red-300 bg-red-50/60 p-4 space-y-2 dark:border-red-800 dark:bg-red-950/40">
            <div className="font-bold text-xs text-red-900 dark:text-red-200 flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>Predatory &amp; Coercive Response</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Demanding an explanation (&ldquo;Why not? What did I do wrong?&rdquo;), following them around, recruiting mutual friends to pressure them, or giving them the silent treatment.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Practical Boundary Setting Scripts */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Practical Scripts for Setting Clear Limits
          </h2>
          <p className="text-xs text-muted-foreground">
            Clear, non-apologetic language you can use in different situations:
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b pb-2 text-xs">
          {[
            { id: "digital", label: "Digital Privacy" },
            { id: "dating", label: "Dating & Touch" },
            { id: "workplace", label: "Workplace & POSH" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedScriptTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedScriptTab === tab.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          {selectedScriptTab === "digital" && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  When pressured for private photos:
                </span>
                <p className="italic text-slate-600 dark:text-slate-400">
                  &ldquo;I don&apos;t share photos like that. That is a firm personal boundary for me, so please don&apos;t ask again.&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  When demanded to share phone passwords or live location:
                </span>
                <p className="italic text-slate-600 dark:text-slate-400">
                  &ldquo;Trust in a relationship comes from communication, not digital surveillance. I keep my device and passwords private.&rdquo;
                </p>
              </div>
            </div>
          )}

          {selectedScriptTab === "dating" && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  When touch feels too fast or uncomfortable:
                </span>
                <p className="italic text-slate-600 dark:text-slate-400">
                  &ldquo;I need us to slow down right now. I am not ready for that.&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  When someone guilt-trips your boundary:
                </span>
                <p className="italic text-slate-600 dark:text-slate-400">
                  &ldquo;My boundaries are not up for negotiation. If you care about me, you will respect my decision without making me feel guilty.&rdquo;
                </p>
              </div>
            </div>
          )}

          {selectedScriptTab === "workplace" && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  When an uncomfortable comment or touch occurs at work:
                </span>
                <p className="italic text-slate-600 dark:text-slate-400">
                  &ldquo;That comment/action is unprofessional and makes me uncomfortable. Please keep our interactions strictly professional.&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Under the POSH Act 2013:
                </span>
                <p className="text-xs text-muted-foreground leading-normal">
                  Every organization with 10+ employees is legally required to maintain an Internal Complaints Committee (ICC). Quid pro quo harassment (promising benefits for favors) and creating a hostile working environment are illegal.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Interactive Practice Scenario */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Scenario Simulation: Recognizing Boundary Wear-Down
          </h2>
        </div>

        <Card className="border-border/80">
          <CardHeader className="pb-3">
            <Badge variant="outline" className="w-fit text-xs mb-1">
              Case Study
            </Badge>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              The Peer Pressure Dilemma
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 p-3 rounded-md bg-slate-50 dark:bg-slate-900/40 border leading-relaxed">
              At a college party, a student repeatedly declines shots of alcohol, explaining they have an exam tomorrow. Several friends gather around, chanting, calling them a &ldquo;buzzkill&rdquo;, and pushing the glass into their hand.
            </p>
            <p className="text-xs font-semibold text-primary pt-1">
              If you are standing nearby as a friend or bystander, what is the best intervention?
            </p>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {[
              {
                text: "Step in and distract: 'Hey, I actually need their help with something outside for a second' and guide them away from the pressure.",
                isCorrect: true,
                feedback: "Excellent 5Ds Distract technique. Interrupts the group-think harassment without starting a fight and respects their stated limit.",
              },
              {
                text: "Join in the chanting so you don't look uncool to the group.",
                isCorrect: false,
                feedback: "Active complicity. Enables boundary coercion and contributes to toxic social entitlement.",
              },
              {
                text: "Stay completely quiet and look at your phone.",
                isCorrect: false,
                feedback: "Passive bystander effect. Leaves the individual isolated under escalating coercive pressure.",
              },
            ].map((option, idx) => (
              <div key={idx} className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedScenarioChoice(idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                    selectedScenarioChoice === idx
                      ? option.isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100 ring-1 ring-emerald-500"
                        : "border-red-400 bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100 ring-1 ring-red-400"
                      : "border-slate-200 hover:bg-slate-50 dark:border-slate-800"
                  }`}
                >
                  {option.text}
                </button>
                {selectedScenarioChoice === idx && (
                  <p
                    className={`text-xs p-2.5 rounded-md leading-relaxed animate-in fade-in-50 ${
                      option.isCorrect
                        ? "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300"
                        : "bg-red-100/70 text-red-900 dark:bg-red-950 dark:text-red-200 border border-red-300"
                    }`}
                  >
                    <strong>{option.isCorrect ? "✓ Trauma-Informed Ally: " : "⚠ Critical Insight: "}</strong>
                    {option.feedback}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 6. Emergency Resources Callout */}
      <section className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" />
          <span>Experiencing Coercion, Harassment, or Abuse?</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Confidential statutory resources can help you assess your safety and understand your options:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <HelplineButton
            number="1091"
            label="Women Helpline"
            description="24/7 crisis support"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="181"
            label="Women in Distress"
            description="Shelter & legal referral"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="14416"
            label="Tele-MANAS"
            description="Mental health counseling"
            variant="mental-health"
            size="sm"
          />
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
        <Link href="/awareness/consent">
          <Button variant="outline" size="sm" className="text-xs">
            ← Previous: Consent &amp; Autonomy
          </Button>
        </Link>
        <Link href="/awareness/bystander-support">
          <Button variant="default" size="sm" className="gap-2 text-xs font-semibold bg-slate-900 text-white">
            <span>Next Guide: Active Bystander Framework (5Ds)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
