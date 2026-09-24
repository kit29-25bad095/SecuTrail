"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Scale,
  Brain,
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

export default function ConsentAwarenessPage() {
  const [revealedMyths, setRevealedMyths] = React.useState<Record<number, boolean>>({});
  const [selectedScenarioChoice, setSelectedScenarioChoice] = React.useState<number | null>(null);

  const toggleMyth = (index: number) => {
    setRevealedMyths((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
            Curriculum Core • Guide 01
          </Badge>
          <AudiencePills
            audiences={["students", "educators", "parents", "bystanders", "supporters"]}
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Understanding Consent &amp; Bodily Autonomy
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Consent is the voluntary, enthusiastic, and conscious agreement between individuals to engage in a specific sexual or physical activity. It is the cornerstone of healthy relationships and human dignity.
        </p>

        <EducationalDisclaimer topic="consent and Indian criminal law" />
      </div>

      {/* 1. The FRIES Framework for Consent */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Foundational Standard
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            The F.R.I.E.S. Model of Consent
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Consent is not merely the absence of a &ldquo;No&rdquo;. It must satisfy five non-negotiable criteria:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="text-lg font-black text-blue-600 dark:text-blue-400">F</div>
            <h3 className="font-bold text-sm text-foreground">Freely Given</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Given without pressure, guilt-tripping, manipulation, intoxication, or power imbalances.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">R</div>
            <h3 className="font-bold text-sm text-foreground">Reversible</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Can be revoked at any moment, by any person, even in the middle of an activity.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">I</div>
            <h3 className="font-bold text-sm text-foreground">Informed</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Both parties clearly understand the exact nature, boundaries, and protection methods involved.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="text-lg font-black text-purple-600 dark:text-purple-400">E</div>
            <h3 className="font-bold text-sm text-foreground">Enthusiastic</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Active, engaged participation. Reluctance, silence, or endurance is not consent.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="text-lg font-black text-teal-600 dark:text-teal-400">S</div>
            <h3 className="font-bold text-sm text-foreground">Specific</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agreeing to one act (or on a past date) never implies blanket consent for anything else.
            </p>
          </div>
        </div>
      </section>

      {/* 2. What Consent Is vs What It Is Not */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Clarity Checklist: What Consent Is &amp; Is Not
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What Consent IS */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>What Valid Consent Looks Like</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Active verbal agreement (&ldquo;Yes&rdquo;, &ldquo;I want this&rdquo;, &ldquo;This feels good&rdquo;).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Engaged body language: smiling, leaning in, reciprocal touch.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Periodic check-ins: &ldquo;Are you comfortable with this?&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Complete freedom to stop without fear of anger or sulking.</span>
              </li>
            </ul>
          </div>

          {/* What Consent IS NOT */}
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 space-y-3 dark:border-red-900/60 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-sm">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>What Does NOT Equal Consent</span>
            </div>
            <ul className="space-y-2 text-xs text-red-950 dark:text-red-100 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>Silence, going limp, or freezing in fear or shock.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>Saying yes after repeated wear-down badgering or emotional pressure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>Being intoxicated, asleep, or cognitively impaired.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>An existing romantic relationship, engagement, or marriage.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Statutory Legal Standard in India (BNS 2023) */}
      <section className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <Scale className="h-5 w-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Consent Under Indian Law (Bharatiya Nyaya Sanhita 2023)
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Under <strong>Section 63 of the Bharatiya Nyaya Sanhita (BNS 2023)</strong>, consent is defined as an <em>&ldquo;unequivocal voluntary agreement when the person by words, gestures or any form of verbal or non-verbal communication, communicates willingness to participate in the specific sexual act.&rdquo;</em>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border">
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-1">
                No Presumption from Lack of Resistance
              </p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Under Explanation 2 to Section 63, a person who does not physically resist is <strong>not</strong> to be regarded as having consented.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border">
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-1">
                Intoxication &amp; Incapacity
              </p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Consent obtained from a person who cannot understand the nature and consequence of the act due to intoxication or unsoundness of mind is legally void.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border">
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-1">
                Deceit &amp; Coercion (Section 69)
              </p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Sexual intercourse by deceitful means (including false identity, suppression of marital status, or fraudulent promises) is a distinct non-bailable offence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Myth vs. Reality Check */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Fact Check: Common Misconceptions About Consent
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              myth: "If someone wears revealing clothing or danced closely at a party, they are giving implicit consent.",
              reality: "Clothing, dancing, and social warmth are forms of personal self-expression, NEVER consent for physical touch.",
              explanation: "Consent requires explicit, mutual communication specific to physical contact. Assuming sexual entitlement based on aesthetics is a core precursor to assault.",
            },
            {
              myth: "If a person froze, went silent, and didn't fight back or shout for help, it was consensual.",
              reality: "Tonic immobility (freezing) is an involuntary neurobiological reflex when the brain assesses high threat.",
              explanation: "Research confirms that the human nervous system frequently triggers involuntary paralysis to minimize physical trauma. Lack of physical resistance is not agreement.",
            },
            {
              myth: "If someone consented earlier in the evening or has been your dating partner for years, you don't need to ask again.",
              reality: "Consent exists strictly in the present moment and must be ongoing.",
              explanation: "Prior relationship status never grants an ongoing claim to another person's body. Anyone has the right to decline or change their mind at any point.",
            },
          ].map((item, idx) => (
            <Card key={idx} className="border-border/80">
              <div className="p-4 sm:p-5 bg-card">
                <div className="flex items-start gap-3">
                  <span className="rounded bg-red-100 dark:bg-red-950/80 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300 uppercase shrink-0 mt-0.5">
                    Myth
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    &ldquo;{item.myth}&rdquo;
                  </p>
                </div>

                {!revealedMyths[idx] ? (
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMyth(idx)}
                      className="text-xs"
                    >
                      Reveal Fact-Checked Reality
                    </Button>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t space-y-2 animate-in fade-in-50">
                    <div className="flex items-start gap-3">
                      <span className="rounded bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase shrink-0 mt-0.5">
                        Reality
                      </span>
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                        {item.reality}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 pl-14 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Interactive Practice Scenario */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Real-World Scenario: Navigating Hesitation
          </h2>
        </div>

        <Card className="border-border/80">
          <CardHeader className="pb-3">
            <Badge variant="outline" className="w-fit text-xs mb-1">
              Practical Scenario
            </Badge>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              The Hesitant Partner
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 p-3 rounded-md bg-slate-50 dark:bg-slate-900/40 border leading-relaxed">
              You are spending time with a person you have been dating. You initiate physical intimacy. They lean away slightly, pull their hand back, and softly say: &ldquo;I&apos;m not sure... I&apos;m really tired today.&rdquo;
            </p>
            <p className="text-xs font-semibold text-primary pt-1">
              What is the respectful, trauma-informed response?
            </p>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {[
              {
                text: "Say: 'No problem at all! Let's just relax and watch a movie.' Step back immediately with zero guilt-tripping.",
                isCorrect: true,
                feedback: "Trauma-informed and respectful. Hesitation is a clear boundary. Accepting it with warmth builds safety and trust.",
              },
              {
                text: "Keep kissing them and whisper: 'Come on, just a little bit, don't ruin the mood.'",
                isCorrect: false,
                feedback: "Coercive wear-down tactic. Badgering someone after they express hesitation violates autonomy and constitutes boundary erosion.",
              },
              {
                text: "Act offended, cross your arms, and give them the silent treatment to show you are disappointed.",
                isCorrect: false,
                feedback: "Emotional manipulation. Punishing a partner for establishing a boundary creates an unsafe dynamic where they feel forced to comply.",
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
                    <strong>{option.isCorrect ? "✓ Correct: " : "⚠ Warning: "}</strong>
                    {option.feedback}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 6. Relevant Emergency Resources */}
      <section className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" />
          <span>Need Immediate Guidance or Support?</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          If you or someone you know has experienced non-consensual contact, confidential statutory services are available 24/7 across India:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
            description="24/7 confidential counseling"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="14416"
            label="Tele-MANAS"
            description="Free psychological support"
            variant="mental-health"
            size="sm"
          />
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
        <Link href="/awareness">
          <Button variant="outline" size="sm" className="text-xs">
            ← Back to Curriculum Overview
          </Button>
        </Link>
        <Link href="/awareness/boundaries">
          <Button variant="default" size="sm" className="gap-2 text-xs font-semibold bg-slate-900 text-white">
            <span>Next Guide: Recognizing Boundaries &amp; Coercion</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
