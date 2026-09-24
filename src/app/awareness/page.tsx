"use client";

import * as React from "react";
import Link from "next/link";
import { AWARENESS_MODULES } from "@/data/awarenessData";
import { AwarenessModuleView } from "@/components/awareness/AwarenessModuleView";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { EducationalDisclaimer } from "@/components/awareness/EducationalDisclaimer";
import { AudiencePills, TargetAudience } from "@/components/awareness/AudiencePills";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  CheckCircle,
  Shield,
  Users,
  Smartphone,
  HelpCircle,
  ArrowRight,
  Filter,
} from "lucide-react";

// Map modules to target audiences for filtering
const MODULE_AUDIENCES: Record<string, TargetAudience[]> = {
  "understanding-sexual-violence": ["students", "educators", "parents", "bystanders", "supporters"],
  "how-violence-happens": ["students", "educators", "parents", "bystanders", "supporters"],
  "prevention-and-self-control": ["students", "educators", "parents", "supporters"],
  "bystander-intervention-5ds": ["students", "educators", "bystanders", "supporters"],
  "understanding-impact": ["educators", "parents", "supporters", "bystanders"],
  "after-an-incident": ["students", "educators", "parents", "supporters"],
  "india-legal-literacy": ["students", "educators", "parents", "bystanders", "supporters"],
};

export default function AwarenessPage() {
  const [activeModuleId, setActiveModuleId] = React.useState<string>(
    AWARENESS_MODULES[0].id
  );
  const [completedModules, setCompletedModules] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedAudience, setSelectedAudience] = React.useState<TargetAudience | "all">("all");

  // Load ephemeral progress from localStorage without sending to any server
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("secutrail_awareness_progress");
      if (stored) {
        setCompletedModules(JSON.parse(stored));
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const saveProgress = (newCompleted: string[]) => {
    setCompletedModules(newCompleted);
    try {
      localStorage.setItem(
        "secutrail_awareness_progress",
        JSON.stringify(newCompleted)
      );
    } catch {
      // Safe fallback
    }
  };

  const handleToggleComplete = (modId: string) => {
    let updated: string[];
    if (completedModules.includes(modId)) {
      updated = completedModules.filter((id) => id !== modId);
    } else {
      updated = [...completedModules, modId];
    }
    saveProgress(updated);
  };

  const handleResetProgress = () => {
    saveProgress([]);
  };

  // Filter modules based on search query and audience filter
  const filteredModules = React.useMemo(() => {
    return AWARENESS_MODULES.filter((mod) => {
      // Audience filter
      if (selectedAudience !== "all") {
        const audiences = MODULE_AUDIENCES[mod.id] || [];
        if (!audiences.includes(selectedAudience)) {
          return false;
        }
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = mod.title.toLowerCase().includes(q);
        const matchesDesc = mod.shortDescription.toLowerCase().includes(q);
        const matchesTakeaways = mod.keyTakeaways.some((t) => t.toLowerCase().includes(q));
        const matchesOverview = mod.overview.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesTakeaways || matchesOverview;
      }

      return true;
    });
  }, [searchQuery, selectedAudience]);

  const activeModuleIndex = AWARENESS_MODULES.findIndex(
    (m) => m.id === activeModuleId
  );
  const currentModule =
    AWARENESS_MODULES[activeModuleIndex] || AWARENESS_MODULES[0];

  const progressPercent =
    (completedModules.length / AWARENESS_MODULES.length) * 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* 1. Track Header & Progress Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Track 01 • Prevention &amp; Education
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Awareness &amp; Prevention Portal
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Evidence-based educational guides on consent, recognizing coercion, the 5Ds active bystander framework, digital boundaries, and statutory Indian law (BNS 2023, POSH Act 2013).
          </p>

          <EducationalDisclaimer />
        </div>

        {/* Progress Card */}
        <div className="w-full md:w-72 rounded-2xl border bg-card p-5 shadow-xs shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Curriculum Progress</span>
            <span className="text-primary font-bold">
              {completedModules.length} of {AWARENESS_MODULES.length} Done
            </span>
          </div>

          <ProgressIndicator value={progressPercent} className="h-2" />

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>Anonymous Local Storage</span>
            {completedModules.length > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="hover:text-foreground underline flex items-center gap-0.5 text-xs text-slate-500"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Specialized Guides Cards (5 Deep-Dive Pages) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Specialized Educational Guides
          </h2>
          <span className="text-xs text-muted-foreground">5 Core Topic Guides</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Guide 1 */}
          <Link
            href="/awareness/consent"
            className="group rounded-xl border bg-card p-4 hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Consent &amp; Autonomy
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                The FRIES model, ongoing verbal consent, and BNS 2023 legal standards.
              </p>
            </div>
            <div className="pt-3 border-t mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
              <span>Read Guide</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Guide 2 */}
          <Link
            href="/awareness/boundaries"
            className="group rounded-xl border bg-card p-4 hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Boundaries &amp; Coercion
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                4 boundary types, boundary erosion, handling rejection, and the POSH Act.
              </p>
            </div>
            <div className="pt-3 border-t mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
              <span>Read Guide</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Guide 3 */}
          <Link
            href="/awareness/bystander-support"
            className="group rounded-xl border bg-card p-4 hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Bystander Support (5Ds)
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                Direct, Distract, Delegate, Delay, Document across transit, campus, and work.
              </p>
            </div>
            <div className="pt-3 border-t mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
              <span>Read Guide</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Guide 4 */}
          <Link
            href="/awareness/digital-safety"
            className="group rounded-xl border bg-card p-4 hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <Smartphone className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Digital Safety &amp; Tech
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                NCII, sextortion defense, StopNCII hashing, IT Act provisions, and 1930 portal.
              </p>
            </div>
            <div className="pt-3 border-t mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
              <span>Read Guide</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Guide 5 */}
          <Link
            href="/awareness/get-help"
            className="group rounded-xl border bg-card p-4 hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                How to Get Help
              </h3>
              <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                The 72h PEP window, free legal aid, supporting a friend, and 24/7 helplines.
              </p>
            </div>
            <div className="pt-3 border-t mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
              <span>Read Guide</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Search & Audience Filtering Controls */}
      <section className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Filter Curriculum by Target Audience
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g., PEP, Zero-FIR, 5Ds)..."
              className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs shadow-2xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <AudiencePills
          audiences={["students", "educators", "parents", "bystanders", "supporters"]}
          activeAudience={selectedAudience}
          onSelectAudience={setSelectedAudience}
          isFilter
        />
      </section>

      {/* 4. Main Interactive Curriculum Player & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Modules Sidebar List */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Curriculum Modules ({filteredModules.length})
            </h3>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[11px] text-primary hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredModules.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed text-xs text-muted-foreground space-y-1">
              <p className="font-semibold">No modules match your filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedAudience("all");
                }}
                className="text-primary underline text-[11px]"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredModules.map((mod) => {
                const isSelected = mod.id === activeModuleId;
                const isDone = completedModules.includes(mod.id);

                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveModuleId(mod.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? "border-primary bg-secondary/80 shadow-xs"
                        : "border-border/70 bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5 ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : mod.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {mod.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {mod.shortDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {mod.estimatedMinutes} mins
                        </span>
                        {isDone && (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Module Content Player */}
        <div className="lg:col-span-8">
          <AwarenessModuleView
            module={currentModule}
            isCompleted={completedModules.includes(currentModule.id)}
            onComplete={() => handleToggleComplete(currentModule.id)}
            onNextModule={
              activeModuleIndex < AWARENESS_MODULES.length - 1
                ? () =>
                    setActiveModuleId(
                      AWARENESS_MODULES[activeModuleIndex + 1].id
                    )
                : undefined
            }
            onPrevModule={
              activeModuleIndex > 0
                ? () =>
                    setActiveModuleId(
                      AWARENESS_MODULES[activeModuleIndex - 1].id
                    )
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
