"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Compass,
  Layers,
  Sparkles,
  Headphones,
  Shield,
  EyeOff,
  LogOut,
} from "lucide-react";
import { QuickExit } from "@/components/safety/QuickExit";
import { MythVsRealQuiz } from "@/components/awareness/learn-and-prevent/MythVsRealQuiz";
import { InteractiveStories } from "@/components/awareness/learn-and-prevent/InteractiveStories";
import { RevealDiscoverCards } from "@/components/awareness/learn-and-prevent/RevealDiscoverCards";
import { MicroQuiz } from "@/components/awareness/learn-and-prevent/MicroQuiz";
import { ListenLessonPlayer } from "@/components/awareness/learn-and-prevent/ListenLessonPlayer";
import { TopicLibrary } from "@/components/awareness/learn-and-prevent/TopicLibrary";
import {
  BotanicalSprig,
  BotanicalDivider,
  BotanicalLeafCorner,
} from "@/components/awareness/learn-and-prevent/BotanicalDecorations";

type LearningExperience = "myth-real" | "scenario" | "reveal" | "quiz" | "listen";

export default function LearnAndPreventPage() {
  const [activeExperience, setActiveExperience] = useState<LearningExperience>("myth-real");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectActivity = (activity: string) => {
    if (
      activity === "myth-real" ||
      activity === "scenario" ||
      activity === "reveal" ||
      activity === "quiz" ||
      activity === "listen"
    ) {
      setActiveExperience(activity as LearningExperience);
      scrollToSection("interactive-explorer");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* ============================================================ */}
      {/* 4. PAGE HEADER & HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pb-24 border-b border-border">
        {/* Subtle decorative leaf corners */}
        <BotanicalLeafCorner className="absolute top-2 left-2 w-24 h-24 text-primary opacity-25 pointer-events-none hidden sm:block" />
        <BotanicalLeafCorner className="absolute top-2 right-2 w-24 h-24 text-primary opacity-25 pointer-events-none rotate-90 hidden sm:block" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Quick Exit Reminder Bar on page */}
          <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto mb-8 p-2.5 px-4 rounded-2xl bg-card border border-border shadow-xs">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              <span>
                <strong>Confidential educational space:</strong> No login required.
              </span>
            </div>
            <QuickExit size="sm" />
          </div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            <BotanicalSprig className="w-4 h-4" />
            <span>LEARN &amp; PREVENT</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground leading-tight">
            Knowledge gives you options.
          </h1>

          {/* Supporting Text */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
            Explore everyday situations, understand boundaries, challenge common myths, and discover ways to support yourself or others.
          </p>

          {/* Reassurance */}
          <p className="mt-4 text-xs sm:text-sm text-muted-foreground italic font-serif">
            &ldquo;Explore at your own pace. Skip anything you don&apos;t want to do.&rdquo;
          </p>

          {/* Primary & Secondary Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => scrollToSection("interactive-explorer")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-sm cursor-pointer"
            >
              Start exploring
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("topic-library")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-card border-2 border-border text-foreground font-semibold text-sm hover:bg-accent/10 hover:border-primary transition-all cursor-pointer"
            >
              Browse all topics
            </button>
          </div>

          {/* Reassurance Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <EyeOff className="h-4 w-4 text-primary" />
              <span>Zero-PII &amp; RAM-Only Storage</span>
            </span>
            <span className="hidden sm:inline text-border">•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              <span>Trauma-Informed &amp; Non-Shaming</span>
            </span>
            <span className="hidden sm:inline text-border">•</span>
            <span className="flex items-center gap-1.5">
              <LogOut className="h-4 w-4 text-primary" />
              <span>Press ESC twice to Quick Exit</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. LEARNING EXPERIENCE NAVIGATION & INTERACTIVE EXPLORER */}
      {/* ============================================================ */}
      <section id="interactive-explorer" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Experience Selector Tabs */}
        <div className="w-full max-w-4xl mx-auto mb-10">
          <div className="p-1.5 rounded-3xl bg-card border border-border shadow-xs flex flex-wrap items-center justify-center gap-1 sm:gap-2" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeExperience === "myth-real"}
              onClick={() => setActiveExperience("myth-real")}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeExperience === "myth-real"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Myth vs Real</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeExperience === "scenario"}
              onClick={() => setActiveExperience("scenario")}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeExperience === "scenario"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Interactive Stories</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeExperience === "reveal"}
              onClick={() => setActiveExperience("reveal")}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeExperience === "reveal"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Reveal &amp; Discover</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeExperience === "quiz"}
              onClick={() => setActiveExperience("quiz")}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeExperience === "quiz"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quick Quizzes</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeExperience === "listen"}
              onClick={() => setActiveExperience("listen")}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeExperience === "listen"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Audio Lessons</span>
            </button>
          </div>
        </div>

        {/* Dynamic Experience View */}
        <div className="w-full">
          {activeExperience === "myth-real" && (
            <MythVsRealQuiz onLearnMoreTopic={() => scrollToSection("topic-library")} />
          )}

          {activeExperience === "scenario" && <InteractiveStories />}

          {activeExperience === "reveal" && (
            <RevealDiscoverCards onSelectCategory={() => scrollToSection("topic-library")} />
          )}

          {activeExperience === "quiz" && <MicroQuiz />}

          {activeExperience === "listen" && <ListenLessonPlayer />}
        </div>
      </section>

      {/* Editorial Decorative Branch Divider */}
      <BotanicalDivider className="max-w-md" />

      {/* ============================================================ */}
      {/* 11 & 12. TOPIC LIBRARY & TRUST VERIFICATION REGISTRY */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
        <TopicLibrary onSelectActivity={handleSelectActivity} />
      </section>

      {/* ============================================================ */}
      {/* CURRICULUM MODULES SUB-TRACK LINKS */}
      {/* ============================================================ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-border">
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              In-Depth Study
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
              Explore Complete Curriculum Modules
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Prefer structured textbook chapters? Explore deep-dive curriculum guides covering India legal literacy, 5Ds bystander models, and digital evidence gathering.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/awareness/consent"
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs text-center hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Consent Guide
            </Link>
            <Link
              href="/awareness/bystander-support"
              className="px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-xs text-center hover:bg-primary/10 transition-colors whitespace-nowrap"
            >
              Bystander 5Ds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
