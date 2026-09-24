"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  AlertCircle,
  Clock,
  FileText,
  Train,
  School,
  Briefcase,
  Smartphone,
  CheckCircle,
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

export default function BystanderSupportAwarenessPage() {
  const [selectedPlaybookTab, setSelectedPlaybookTab] = React.useState<string>("transit");
  const [selectedScenarioChoice, setSelectedScenarioChoice] = React.useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
            Curriculum Core • Guide 03
          </Badge>
          <AudiencePills
            audiences={["students", "educators", "parents", "bystanders", "supporters"]}
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Active Bystander Intervention: The 5Ds Framework
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Bystanders possess the power to interrupt violence before it occurs. You do not need to be physically imposing or risk your safety. The globally recognized 5Ds model provides five practical, safe ways to de-escalate harm.
        </p>

        <EducationalDisclaimer topic="active bystander interventions and community safety standards" />
      </div>

      {/* 1. The 5Ds Framework Cards */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Core Toolkit
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            The 5Ds Methodology
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Assess personal safety first. Choose the &ldquo;D&rdquo; that best matches your comfort level and the situation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Direct */}
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">01</span>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Direct</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Name the behavior directly when safe to do so: &ldquo;That comment is not okay&rdquo; or &ldquo;Leave them alone.&rdquo;
            </p>
          </div>

          {/* Distract */}
          <div className="rounded-xl border bg-card p-4 space-y-2 border-emerald-400/50 bg-emerald-50/20 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">02</span>
              <Eye className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Distract</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Create an interruption to defuse tension: ask for directions, drop a pen, or pretend you know the person being harassed.
            </p>
          </div>

          {/* Delegate */}
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">03</span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Delegate</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enlist someone with institutional authority: metro security, event organizers, a professor, or venue managers.
            </p>
          </div>

          {/* Delay */}
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">04</span>
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Delay</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Check in with the targeted person after the moment passes: &ldquo;I saw what happened. Are you okay? Can I walk with you?&rdquo;
            </p>
          </div>

          {/* Document */}
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">05</span>
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Document</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If safe and others are intervening, note dates, times, and details. Never post online without the survivor&apos;s explicit consent.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Situational Playbooks */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Real-World Situational Playbooks
          </h2>
          <p className="text-xs text-muted-foreground">
            How to adapt the 5Ds across specific Indian environments:
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b pb-2 text-xs overflow-x-auto">
          {[
            { id: "transit", label: "Public Transit (Metro / Bus)", icon: Train },
            { id: "campus", label: "College Campus / Parties", icon: School },
            { id: "workplace", label: "Workplace & Office", icon: Briefcase },
            { id: "online", label: "Social Media & Group Chats", icon: Smartphone },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPlaybookTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedPlaybookTab === tab.id
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Playbook Content */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          {selectedPlaybookTab === "transit" && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Scenario: Persistent Groping or Creeping on a Metro or Bus
              </h3>
              <p className="leading-relaxed">
                Crowded public transit is frequently weaponized by harassers who rely on social hesitation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs block">
                    Distract (Safest First Step)
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Stand in between them or make eye contact with the victim: &ldquo;Excuse me, did you drop this metro card?&rdquo; or &ldquo;Can you help me with the next stop?&rdquo;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-blue-700 dark:text-blue-400 text-xs block">
                    Delegate (Call Security)
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Alert the bus conductor, metro CISF personnel on the platform, or press the emergency coach intercom to request station guard attendance.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-purple-700 dark:text-purple-400 text-xs block">
                    Delay (Follow Up)
                  </span>
                  <p className="text-xs text-muted-foreground">
                    When getting off: &ldquo;I noticed that person making you uncomfortable. Would you like me to walk with you to the station exit?&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedPlaybookTab === "campus" && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Scenario: Steered Towards an Unsafe Situation at a Gathering
              </h3>
              <p className="leading-relaxed">
                An intoxicated classmate is being led into a private room or into a cab by someone while they seem confused or unresponsive.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs block">
                    Distract &amp; Interrupt
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Step right up: &ldquo;Hey! Their roommate called me looking for them, we need to head back together&rdquo; or spill a drink intentionally near them to break momentum.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-blue-700 dark:text-blue-400 text-xs block">
                    Delegate to Mutuals
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Grab two other friends: &ldquo;They are not in a condition to make decisions right now. Let&apos;s all get them a glass of water and make sure they get home safely.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedPlaybookTab === "workplace" && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Scenario: Inappropriate Humor or Pressure During a Meeting
              </h3>
              <p className="leading-relaxed">
                A senior manager makes a demeaning sexualized remark about a colleague&apos;s appearance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-red-700 dark:text-red-400 text-xs block">
                    Direct (Professional Pivot)
                  </span>
                  <p className="text-xs text-muted-foreground">
                    &ldquo;I don&apos;t understand the joke. Can we redirect our focus back to the project deliverables?&rdquo; Refusing to laugh drains the entitlement.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-xs block">
                    Document &amp; Delay
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Check in with the targeted colleague afterwards: &ldquo;That remark was completely inappropriate. If you decide to contact HR or the ICC, I will corroborate as a witness.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedPlaybookTab === "online" && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Scenario: Inappropriate Photos or Derogatory Comments in Group Chats
              </h3>
              <p className="leading-relaxed">
                Someone shares non-consensual media, slut-shaming memes, or lewd remarks in a class or neighborhood WhatsApp group.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-red-700 dark:text-red-400 text-xs block">
                    Direct Group Call-Out
                  </span>
                  <p className="text-xs text-muted-foreground">
                    &ldquo;Sharing private photos or comments without consent is illegal under the IT Act and violates group rules. Delete it immediately.&rdquo;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-1">
                  <span className="font-bold text-blue-700 dark:text-blue-400 text-xs block">
                    Delegate to Admin
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Privately message the group administrator to enforce group guidelines, remove the offending member, and support the victim.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Trauma-Informed Allyship Principles */}
      <section className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 p-6 sm:p-8 space-y-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
        <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span>How to Be a Genuine Ally (Without Becoming Overbearing)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100">1. Center the Survivor</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Never take actions (like filing a report or confronting an abuser) without the survivor&apos;s clear permission. Taking over strips their autonomy.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100">2. Validate, Never Interrogate</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Say: &ldquo;I believe you and I am here for you.&rdquo; Avoid asking &ldquo;Why were you there?&rdquo; or &ldquo;Why didn&apos;t you fight back?&rdquo; which causes secondary trauma.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100">3. Ask Open-Ended Questions</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ask: &ldquo;What would feel most helpful right now? Would you like a glass of water, or for me to stay with you while you call a friend?&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Simulation Case */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Interactive Case: The Late-Night Bus Dilemma
          </h2>
        </div>

        <Card className="border-border/80">
          <CardHeader className="pb-3">
            <Badge variant="outline" className="w-fit text-xs mb-1">
              5Ds In Action
            </Badge>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              The Intimidating Commuter
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 p-3 rounded-md bg-slate-50 dark:bg-slate-900/40 border leading-relaxed">
              You are seated on an evening bus. Two seats ahead, an individual is blocking the aisle, speaking aggressively to a seated passenger who is visibly shaking and trying to look away out the window.
            </p>
            <p className="text-xs font-semibold text-primary pt-1">
              How can you safely intervene using the 5Ds?
            </p>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {[
              {
                text: "DELEGATE & DISTRACT: Walk to the driver/conductor and report the harassment immediately, then stand near the passenger and ask: 'Excuse me, is this seat open?'",
                isCorrect: true,
                strategy: "5Ds: Delegate + Distract",
                feedback: "Ideal layered response. Alerts staff who have authority while diffusing the physical isolation without provoking a violent fight.",
              },
              {
                text: "Physically tackle the aggressor from behind.",
                isCorrect: false,
                strategy: "High Risk Escalation",
                feedback: "Unsafe. Direct physical violence can escalate into severe injury on a moving vehicle and often causes terror for the person you intended to help.",
              },
              {
                text: "Turn up your headphones and pretend you don't notice anything.",
                isCorrect: false,
                strategy: "Bystander Inaction",
                feedback: "Passive silence validates the perpetrator's behavior and leaves the vulnerable passenger without recourse.",
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
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">
                      {option.strategy}
                    </Badge>
                  </div>
                </button>
                {selectedScenarioChoice === idx && (
                  <p
                    className={`text-xs p-2.5 rounded-md leading-relaxed animate-in fade-in-50 ${
                      option.isCorrect
                        ? "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300"
                        : "bg-red-100/70 text-red-900 dark:bg-red-950 dark:text-red-200 border border-red-300"
                    }`}
                  >
                    <strong>{option.isCorrect ? "✓ Trauma-Informed Action: " : "⚠ Warning: "}</strong>
                    {option.feedback}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 5. Emergency Resources Callout */}
      <section className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" />
          <span>Statutory Helplines for Intervention &amp; Reporting</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          In active emergencies, enlist statutory responders immediately:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <HelplineButton
            number="112"
            label="National Emergency"
            description="Police, Fire, Ambulance (24/7)"
            variant="emergency"
            size="sm"
          />
          <HelplineButton
            number="1091"
            label="Women Helpline"
            description="Toll-free crisis assistance"
            variant="support"
            size="sm"
          />
          <HelplineButton
            number="1098"
            label="Childline (POCSO)"
            description="Protection for minors & children"
            variant="support"
            size="sm"
          />
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
        <Link href="/awareness/boundaries">
          <Button variant="outline" size="sm" className="text-xs">
            ← Previous: Boundaries &amp; Coercion
          </Button>
        </Link>
        <Link href="/awareness/digital-safety">
          <Button variant="default" size="sm" className="gap-2 text-xs font-semibold bg-slate-900 text-white">
            <span>Next Guide: Digital Safety &amp; Tech Abuse</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
