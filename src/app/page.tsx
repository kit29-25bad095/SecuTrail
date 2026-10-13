import Link from "next/link";
import {
  BookOpen,
  HeartHandshake,
  CheckCircle2,
  Lock,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Scale,
  Stethoscope,
  Heart,
  Users,
  EyeOff,
  Check,
  Sparkles,
  ArrowDown,
  AlertTriangle,
  GraduationCap,
  School,
  UserCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HelplineButton } from "@/components/common/HelplineButton";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------ */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-background py-16 sm:py-24 border-b border-[#004225]/15">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#004225]/20 bg-secondary px-4 py-1.5 text-xs font-semibold text-primary shadow-xs mb-8">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Confidential &amp; Verified Decision-Support Platform</span>
          </div>

          {/* Primary Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
            SECUTRAIL
          </h1>

          {/* Three Core Brand Tenets */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-lg sm:text-2xl font-medium text-foreground">
            <span className="font-semibold text-foreground">
              Verified information.
            </span>
            <span className="hidden sm:inline text-foreground/40">•</span>
            <span className="font-semibold text-primary underline decoration-primary/40">
              Private support.
            </span>
            <span className="hidden sm:inline text-foreground/40">•</span>
            <span className="font-semibold text-foreground">
              Your choice.
            </span>
          </div>

          {/* Supportive Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-foreground/80 leading-relaxed">
            SecuTrail is a calm, trauma-informed safety platform designed for survivors of sexual assault and community allies in India. Every resource is statutorily grounded in Indian law, medical protocols, and verified services. Zero sign-up, zero data stored, and complete control over your decisions.
          </p>

          {/* Primary Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-xl mx-auto">
            <Link href="/survivor" className="flex-1">
              <Button
                size="xl"
                variant="default"
                className="w-full gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md"
              >
                <HeartHandshake className="h-5 w-5" />
                <span>Find Support</span>
              </Button>
            </Link>

            <Link href="/awareness" className="flex-1">
              <Button
                size="xl"
                variant="outline"
                className="w-full gap-2.5 border-primary/30 bg-secondary hover:bg-primary hover:text-primary-foreground text-primary font-bold shadow-xs transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                <span>Learn &amp; Prevent</span>
              </Button>
            </Link>
          </div>

          {/* Reassurance Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-foreground/75">
            <span className="flex items-center gap-1.5">
              <EyeOff className="h-4 w-4 text-primary" />
              <span>Zero Sign-Up or Tracking</span>
            </span>
            <span className="hidden sm:inline text-foreground/30">•</span>
            <span className="flex items-center gap-1.5">
              <LogOut className="h-4 w-4 text-primary" />
              <span>Instant Quick Exit (ESC × 2)</span>
            </span>
            <span className="hidden sm:inline text-foreground/30">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Statutorily Grounded Sources</span>
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 2. TWO-TRACK SECTION (ABOUT & WHO IT IS FOR) */}
      {/* ------------------------------------------------------------ */}
      <section id="about" className="py-16 sm:py-24 bg-background scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Two Distinct Pathways</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Clear Guidance For Every Need
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              SecuTrail separates proactive community education from acute trauma response. This separation ensures survivors receive calm, immediate care without clutter, while allies receive realistic educational tools to prevent harm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Track 1: Awareness Track */}
            <div className="relative rounded-3xl border border-[#004225]/20 bg-card p-8 shadow-sm flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold px-3 py-1 border-primary/20 text-primary bg-secondary/50">
                    Track 01 • Prevention
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-foreground">
                  Awareness Track
                </h3>
                <p className="text-sm font-semibold text-primary mt-1">
                  Prevention, Consent &amp; Bystander Action
                </p>

                {/* Who It Is For Box */}
                <div className="mt-4 rounded-xl bg-secondary/50 p-3.5 border border-primary/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Specifically Designed For:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 bg-card border border-primary/20 px-2.5 py-1 rounded-md text-foreground">
                      <GraduationCap className="h-3 w-3 text-primary" />
                      <span>Students</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-card border border-primary/20 px-2.5 py-1 rounded-md text-foreground">
                      <School className="h-3 w-3 text-primary" />
                      <span>Educators</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-card border border-primary/20 px-2.5 py-1 rounded-md text-foreground">
                      <Users className="h-3 w-3 text-primary" />
                      <span>Parents</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-card border border-primary/20 px-2.5 py-1 rounded-md text-foreground">
                      <UserCheck className="h-3 w-3 text-primary" />
                      <span>Bystanders</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-card border border-primary/20 px-2.5 py-1 rounded-md text-foreground">
                      <HeartHandshake className="h-3 w-3 text-primary" />
                      <span>Supporters</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-xs sm:text-sm text-foreground/85">
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>7 Interactive Modules:</strong> Healthy boundaries, consent demystification, digital privacy, and legal rights.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>The 5Ds Active Bystander Model:</strong> Direct, Distract, Delegate, Delay, and Document intervention methods.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Indian Statutory Literacy:</strong> Clear explanations of BNS 2023, Zero-FIR provisions, and POCSO protections.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/15">
                <Link href="/awareness" className="inline-block w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-between group rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <span>Explore Awareness Track</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Track 2: Survivor Support Track */}
            <div className="relative rounded-3xl border-2 border-primary/40 bg-card p-8 shadow-sm flex flex-col justify-between hover:border-primary hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <Badge variant="verified" className="text-xs font-semibold px-3 py-1">
                    Track 02 • Confidential
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-foreground">
                  Survivor Support Track
                </h3>
                <p className="text-sm font-semibold text-primary mt-1">
                  Trauma-Informed Triage &amp; Verified Choices
                </p>

                {/* Who It Is For Box */}
                <div className="mt-4 rounded-xl bg-secondary/50 p-3.5 border border-primary/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Specifically Designed For:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 bg-card border border-primary/20 px-3 py-1.5 rounded-md text-foreground font-medium">
                      <HeartHandshake className="h-3.5 w-3.5 text-primary" />
                      <span>People seeking confidential care and guidance after sexual assault</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-xs sm:text-sm text-foreground/85">
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Deterministic Safety Screening:</strong> Immediate physical danger checks and one-tap emergency calling (112, 1091).
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Simultaneous Multi-Path Triage:</strong> Explore Medical, Emotional, and Legal needs concurrently without linear locking.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Agency-First Option Cards:</strong> Balanced breakdowns of who provides care, critical timelines, and benefits vs. tradeoffs.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Zero Compulsory Reporting:</strong> Access emergency medical care without mandatory police involvement under Indian law.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/15">
                <Link href="/survivor" className="inline-block w-full">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full justify-between group rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
                  >
                    <span>Enter Survivor Support Track</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 3. HOW SECUTRAIL WORKS — 7-STAGE ARCHITECTURE PIPELINE */}
      {/* ------------------------------------------------------------ */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 bg-background border-y border-[#004225]/15 scroll-mt-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold tracking-widest text-primary mb-2">
              Engineering Rigor
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How SecuTrail Works
            </p>
            <p className="mt-3 text-sm sm:text-base text-foreground/80 leading-relaxed">
              SecuTrail is not a generic chatbot. It is a multi-tier, deterministic safety and decision-support pipeline designed to eliminate hallucination and protect user privacy.
            </p>
          </div>

          {/* Sequential Workflow Visualizer */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Step 1: User */}
            <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary font-extrabold text-sm shrink-0 border border-primary/20">
                  01
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    User Entry
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Anonymous arrival. No registration, no login, no IP logging, and zero tracking cookies.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] shrink-0 border-primary/20 text-primary bg-secondary/40">
                Zero Footprint
              </Badge>
            </div>

            <div className="flex justify-center text-primary/40">
              <ArrowDown className="h-5 w-5" />
            </div>

            {/* Step 2: Safety Layer */}
            <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary font-extrabold text-sm shrink-0 border border-primary/20">
                  02
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Safety Layer
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Persistent Quick Exit bar, global double-ESC listener, and instant neutral redirection to weather.com with selective storage purge.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] shrink-0 border-primary/20 text-primary bg-secondary/40">
                Instant Escape
              </Badge>
            </div>

            <div className="flex justify-center text-primary/40">
              <ArrowDown className="h-5 w-5" />
            </div>

            {/* Step 3: Risk Classification */}
            <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary font-extrabold text-sm shrink-0 border border-primary/20">
                  03
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Risk Classification
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Deterministic regex engine screens for acute physical danger, self-harm, medical timeframe urgency (72h PEP), or minor involvement.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] shrink-0 border-primary/20 text-primary bg-secondary/40">
                Deterministic
              </Badge>
            </div>

            <div className="flex justify-center text-primary/40">
              <ArrowDown className="h-5 w-5" />
            </div>

            {/* Step 4: Triage */}
            <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary font-extrabold text-sm shrink-0 border border-primary/20">
                  04
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Multi-Path Triage
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Simultaneous exploration of Medical Prophylaxis, Emotional Stabilization, and Legal Information without forced linear progression.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] shrink-0 border-primary/20 text-primary bg-secondary/40">
                Non-Linear
              </Badge>
            </div>

            <div className="flex justify-center text-primary/40">
              <ArrowDown className="h-5 w-5" />
            </div>

            {/* Step 5: Verified Information */}
            <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary font-extrabold text-sm shrink-0 border border-primary/20">
                  05
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Verified Information
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Strictly grounded RAG pipeline citing Bharatiya Nyaya Sanhita (BNS 2023), MoHFW clinical guidelines, and NALSA statutory legal provisions.
                  </p>
                </div>
              </div>
              <Badge variant="verified" className="w-fit text-[11px] shrink-0">
                Zero Hallucination
              </Badge>
            </div>

            <div className="flex justify-center text-primary/40">
              <ArrowDown className="h-5 w-5" />
            </div>

            {/* Step 6: Resources */}
            <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary font-extrabold text-sm shrink-0 border border-primary/20">
                  06
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Verified Resources
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Audited directory of 24/7 statutory helplines (112, 1091, 14416, 15100), One Stop Centres (Sakhi), and legal aid clinics with progressive location consent.
                  </p>
                </div>
              </div>
              <Badge variant="verified" className="w-fit text-[11px] shrink-0">
                Statutory Directory
              </Badge>
            </div>

            <div className="flex justify-center text-primary/40">
              <ArrowDown className="h-5 w-5" />
            </div>

            {/* Step 7: User Choice */}
            <div className="rounded-2xl border-2 border-primary bg-secondary/30 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm shrink-0 shadow-xs">
                  07
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    User Choice &amp; Agency
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Agency-first option cards outline what to expect, advantages, and tradeoffs. You decide whether to take action, seek care, or exit.
                  </p>
                </div>
              </div>
              <Badge variant="verified" className="w-fit text-[11px] shrink-0 font-bold">
                Survivor In Control
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 4. PRIVACY SECTION (ZERO PII & HONEST LIMITATIONS) */}
      {/* ------------------------------------------------------------ */}
      <section
        id="privacy"
        className="py-16 sm:py-24 bg-[#004225] text-[#FFFDD0] scroll-mt-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#00361E] px-3 py-1 text-xs font-semibold text-[#FFFDD0] border border-[#FFFDD0]/30">
              <Lock className="h-3.5 w-3.5 text-[#FAF7BA]" />
              <span>Zero-PII Footprint</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#FFFDD0]">
              Privacy by Architecture, Not Policy Promises.
            </h2>
            <p className="text-sm sm:text-base text-[#FFFDD0]/85 leading-relaxed">
              SecuTrail does not collect names, phone numbers, or account logins. We treat digital privacy as a vital physical safety requirement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What SecuTrail Protects */}
            <div className="rounded-2xl border border-[#FFFDD0]/25 bg-[#00361E] p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-[#FFFDD0] flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#FAF7BA] shrink-0" />
                <span>What SecuTrail Guarantees</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#FFFDD0]/85">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#FAF7BA] shrink-0 mt-0.5" />
                  <span>
                    <strong>No Accounts or Sign-Ups:</strong> We never ask for your identity or credentials.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#FAF7BA] shrink-0 mt-0.5" />
                  <span>
                    <strong>Ephemeral RAM Sessions:</strong> Triage selections exist only in volatile memory and automatically expire after 30 minutes of inactivity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#FAF7BA] shrink-0 mt-0.5" />
                  <span>
                    <strong>No Third-Party Analytics:</strong> No tracking pixels, Google Analytics, or advertising trackers.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#FAF7BA] shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant Selective State Wipe:</strong> Quick Exit immediately purges all SecuTrail localStorage and sessionStorage keys.
                  </span>
                </li>
              </ul>
            </div>

            {/* Honest Technical Limitations */}
            <div className="rounded-2xl border border-[#FFFDD0]/25 bg-[#00361E] p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-[#FFFDD0] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#FAF7BA] shrink-0" />
                <span>Honest Limitations (Threat Model)</span>
              </h3>
              <p className="text-xs text-[#FFFDD0]/85 leading-relaxed">
                We never make false claims about wiping device evidence. Quick Exit cleans application state, but <strong>cannot erase</strong>:
              </p>
              <ul className="space-y-2 text-xs text-[#FFFDD0]/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#FAF7BA] font-bold shrink-0">•</span>
                  <span>
                    <strong>Browser History:</strong> URLs remain in local history unless private/incognito mode was used.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FAF7BA] font-bold shrink-0">•</span>
                  <span>
                    <strong>Network Logs:</strong> Wi-Fi routers and Internet Service Providers record domain queries.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FAF7BA] font-bold shrink-0">•</span>
                  <span>
                    <strong>Device Spyware:</strong> Background keyloggers or stalkerware record screens in real-time.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FAF7BA] font-bold shrink-0">•</span>
                  <span>
                    <strong>Direct Observation:</strong> Someone standing directly behind you who saw the screen.
                  </span>
                </li>
              </ul>
              <div className="pt-2">
                <Link href="/privacy">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#FFFDD0]/40 bg-[#004225] text-[#FFFDD0] hover:bg-[#00321C] text-xs rounded-lg"
                  >
                    Read Complete Threat Model &amp; Privacy Center →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 5. VERIFIED INFORMATION SECTION (STATUTORY GROUNDING) */}
      {/* ------------------------------------------------------------ */}
      <section
        id="verified-information"
        className="py-16 sm:py-24 bg-background scroll-mt-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold tracking-widest text-primary mb-2">
              Statutory Truth
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Grounded in Indian Law &amp; Clinical Protocols
            </p>
            <p className="mt-3 text-sm sm:text-base text-foreground/80 leading-relaxed">
              In trauma support, inaccurate advice is dangerous. SecuTrail enforces a strict Zero-Hallucination policy. If a provision cannot be verified against official statutory gazettes, our system explicitly refuses to guess.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Authority 1: BNS 2023 */}
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold border border-primary/20">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Bharatiya Nyaya Sanhita (2023)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Objective statutory literacy: Zero-FIR provisions allowing complaints at any police station regardless of jurisdiction, Section 63-73 penalties, and mandatory female officer recording.
              </p>
              <div className="text-[11px] font-semibold text-primary pt-2 border-t border-primary/15">
                Official Gazette: Act No. 45 of 2023
              </div>
            </div>

            {/* Authority 2: MoHFW Protocols */}
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold border border-primary/20">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                MoHFW Clinical Guidelines
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                72-hour clinical protocol for HIV Post-Exposure Prophylaxis (PEP), emergency contraception within 72-120 hours, and the statutory right to emergency medical treatment without a police FIR.
              </p>
              <div className="text-[11px] font-semibold text-primary pt-2 border-t border-primary/15">
                Ministry of Health &amp; Family Welfare
              </div>
            </div>

            {/* Authority 3: NALSA */}
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold border border-primary/20">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                NALSA &amp; State DLSA
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Free legal aid guaranteed under Section 12 of the Legal Services Authorities Act (1987) for all women and children, assigned legal counsel, and Victim Compensation Scheme guidance.
              </p>
              <div className="text-[11px] font-semibold text-primary pt-2 border-t border-primary/15">
                National Legal Services Authority (15100)
              </div>
            </div>

            {/* Authority 4: POCSO Act */}
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold border border-primary/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                POCSO Act (2012)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protection of Children from Sexual Offences: Child-friendly court procedures, identity protection mandates, Child Welfare Committee (CWC) jurisdiction, and Childline 1098 routing.
              </p>
              <div className="text-[11px] font-semibold text-primary pt-2 border-t border-primary/15">
                Ministry of Women &amp; Child Development
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 6. USER AGENCY SECTION ("YOUR CHOICE, YOUR TIMELINE") */}
      {/* ------------------------------------------------------------ */}
      <section
        id="user-agency"
        className="py-16 sm:py-24 bg-background border-y border-[#004225]/15 scroll-mt-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider border-primary/20 bg-secondary/50 text-primary">
              Survivor Autonomy
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              You Have Options. You Choose What Feels Right.
            </h2>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              Trauma can strip away a person&apos;s sense of control. SecuTrail is built to restore it. We never tell you what you &ldquo;must&rdquo; do, never force linear commitments, and never report your situation without your explicit direction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold border border-primary/20">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Medical Care Without Police
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Under Section 357C of the CrPC / Section 396 of BNSS and MoHFW guidelines, all public and private hospitals are legally mandated to provide free emergency medical treatment immediately, regardless of whether a police FIR has been filed.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold border border-primary/20">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Confidential Emotional Care
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can speak with verified mental health professionals (such as Tele-MANAS on 14416 or certified crisis counselors) without disclosing your legal identity or initiating judicial procedures.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold border border-primary/20">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                Legal Literacy First
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Learn what filing an FIR involves, what evidence preservation means, and what free advocates are available through DLSA before making any formal decision to report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 7. VERIFIED RESOURCE DIRECTORY PREVIEW */}
      {/* ------------------------------------------------------------ */}
      <section id="resources" className="py-16 sm:py-24 bg-background scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold tracking-widest text-primary mb-2">
              Verified Directory
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Statutory 24/7 Helplines &amp; Crisis Services
            </p>
            <p className="mt-3 text-sm sm:text-base text-foreground/80">
              Every contact number below is a real, statutory Indian service audited by the SecuTrail verification engine. Tap any card on mobile to dial immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <HelplineButton
              number="112"
              label="National Emergency"
              description="Police, Fire, Ambulance — All-India 24/7 Emergency Response Support System (ERSS)"
              variant="emergency"
            />
            <HelplineButton
              number="1091"
              label="Women Helpline"
              description="24/7 toll-free helpline dedicated to women in distress across all Indian states"
              variant="support"
            />
            <HelplineButton
              number="181"
              label="Women in Distress"
              description="State-level crisis intervention, shelter referral, and counseling support"
              variant="support"
            />
            <HelplineButton
              number="14416"
              label="Tele-MANAS Counseling"
              description="Ministry of Health 24/7 mental health & trauma crisis counseling (toll-free)"
              variant="mental-health"
            />
            <HelplineButton
              number="1098"
              label="Childline (POCSO)"
              description="24/7 national emergency support for children and minors needing care and protection"
              variant="support"
            />
            <HelplineButton
              number="15100"
              label="NALSA Legal Aid"
              description="National Legal Services Authority — Free legal consultation & advocate assignment"
              variant="legal"
            />
          </div>

          <div className="mt-10 text-center">
            <Link href="/resources">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-colors"
              >
                <span>Search Full Directory by State &amp; District</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
