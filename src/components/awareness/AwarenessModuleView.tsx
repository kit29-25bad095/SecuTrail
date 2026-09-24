"use client";

import * as React from "react";
import { AwarenessModule } from "@/data/awarenessData";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Scale,
  Brain,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface AwarenessModuleViewProps {
  module: AwarenessModule;
  onComplete: () => void;
  isCompleted: boolean;
  onNextModule?: () => void;
  onPrevModule?: () => void;
}

export function AwarenessModuleView({
  module,
  onComplete,
  isCompleted,
  onNextModule,
  onPrevModule,
}: AwarenessModuleViewProps) {
  // Scenario state
  const [selectedChoices, setSelectedChoices] = React.useState<Record<string, number>>({});
  // Quiz state
  const [quizAnswers, setQuizAnswers] = React.useState<Record<number, number>>({});
  // Reflection response stored purely locally/ephemerally
  const [reflectionText, setReflectionText] = React.useState("");
  const [revealedMyths, setRevealedMyths] = React.useState<Record<number, boolean>>({});

  const handleChoiceSelect = (scenarioId: string, choiceIdx: number) => {
    setSelectedChoices((prev) => ({ ...prev, [scenarioId]: choiceIdx }));
  };

  const handleQuizSelect = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const toggleMyth = (idx: number) => {
    setRevealedMyths((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Module Header */}
      <div className="rounded-xl border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {module.number}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Module {module.number} of 7 • ~{module.estimatedMinutes} mins
            </span>
          </div>
          {isCompleted && (
            <Badge variant="verified" className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Completed
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {module.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {module.overview}
        </p>

        {/* Key Takeaways */}
        <div className="mt-6 rounded-lg bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Essential Principles</span>
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {module.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 1. MYTH VS REALITY INTERACTIVE SECTION */}
      {/* ------------------------------------------------------------ */}
      {module.myths.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Myth vs. Reality
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {module.myths.map((item, idx) => {
              const isRevealed = revealedMyths[idx];
              return (
                <Card key={idx} className="overflow-hidden border-border/80">
                  <div className="p-4 sm:p-5 bg-card">
                    <div className="flex items-start gap-3">
                      <span className="rounded bg-red-100 dark:bg-red-950/80 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300 uppercase shrink-0 mt-0.5">
                        Myth
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        &ldquo;{item.myth}&rdquo;
                      </p>
                    </div>

                    {!isRevealed ? (
                      <div className="mt-4 pt-3 border-t flex justify-end">
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
                      <div className="mt-4 pt-4 border-t space-y-2 animate-in fade-in-50">
                        <div className="flex items-start gap-3">
                          <span className="rounded bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase shrink-0 mt-0.5">
                            Reality
                          </span>
                          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                            {item.reality}
                          </p>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 pl-14 leading-relaxed">
                          {item.detailedContext}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* 2. INTERACTIVE SCENARIO SIMULATION */}
      {/* ------------------------------------------------------------ */}
      {module.scenarios.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Scenario Simulation &amp; Decision Paths
            </h2>
          </div>

          {module.scenarios.map((scenario) => {
            const chosenIdx = selectedChoices[scenario.id];

            return (
              <Card key={scenario.id} className="border-border/80">
                <CardHeader className="pb-3">
                  <Badge variant="outline" className="w-fit text-xs mb-1">
                    Simulation Case
                  </Badge>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {scenario.title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 p-3 rounded-md bg-slate-50 dark:bg-slate-900/40 border leading-relaxed">
                    {scenario.situation}
                  </p>
                  <p className="text-xs font-semibold text-primary pt-1">
                    {scenario.dilemma}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-2">
                    {scenario.choices.map((choice, cIdx) => {
                      const isSelected = chosenIdx === cIdx;

                      return (
                        <div key={cIdx} className="space-y-2">
                          <button
                            type="button"
                            onClick={() => handleChoiceSelect(scenario.id, cIdx)}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                              isSelected
                                ? choice.isRecommended
                                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100 ring-1 ring-emerald-500"
                                  : "border-red-400 bg-red-50/50 text-red-950 dark:bg-red-950/30 dark:text-red-100 ring-1 ring-red-400"
                                : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{choice.action}</span>
                              {choice.strategyUsed && (
                                <Badge variant="secondary" className="text-[10px]">
                                  {choice.strategyUsed}
                                </Badge>
                              )}
                            </div>
                          </button>

                          {isSelected && (
                            <div
                              className={`p-3 rounded-md text-xs leading-relaxed animate-in fade-in-50 ${
                                choice.isRecommended
                                  ? "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300"
                                  : "bg-red-100/70 text-red-900 dark:bg-red-950 dark:text-red-200 border border-red-300"
                              }`}
                            >
                              <strong>
                                {choice.isRecommended
                                  ? "✓ Trauma-Informed Choice: "
                                  : "⚠ Critical Consideration: "}
                              </strong>
                              {choice.consequence}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* 3. INDIA LEGAL FRAMEWORK (If applicable) */}
      {/* ------------------------------------------------------------ */}
      {module.legalFramework && module.legalFramework.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Statutory Protections (Indian Law)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {module.legalFramework.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border bg-card p-4 space-y-2 text-xs"
              >
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {item.statute}
                </div>
                <Badge variant="outline" className="text-[10px] text-purple-700 dark:text-purple-300">
                  {item.section}
                </Badge>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* 4. COMPREHENSION CHECK / QUIZ */}
      {/* ------------------------------------------------------------ */}
      {module.quizzes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Quick Knowledge Check
            </h2>
          </div>

          {module.quizzes.map((q, qIdx) => {
            const answeredOptIdx = quizAnswers[qIdx];
            return (
              <Card key={qIdx} className="border-border/80">
                <CardHeader className="pb-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {q.question}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answeredOptIdx === oIdx;
                    return (
                      <div key={oIdx} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => handleQuizSelect(qIdx, oIdx)}
                          className={`w-full text-left p-3 rounded-md text-xs sm:text-sm transition-all border ${
                            isSelected
                              ? opt.isCorrect
                                ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100 font-medium"
                                : "border-red-400 bg-red-50 text-red-950 dark:bg-red-950 dark:text-red-100"
                              : "border-slate-200 hover:bg-slate-50 dark:border-slate-800"
                          }`}
                        >
                          {opt.text}
                        </button>
                        {isSelected && (
                          <p
                            className={`text-xs p-2 rounded ${
                              opt.isCorrect
                                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50/50"
                                : "text-red-700 dark:text-red-300 bg-red-50/50"
                            }`}
                          >
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* 5. PRIVATE REFLECTION PROMPT */}
      {/* ------------------------------------------------------------ */}
      <section className="rounded-xl border bg-slate-50 dark:bg-slate-900/40 p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span>Private Reflection Prompt</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
          &ldquo;{module.reflectionPrompt}&rdquo;
        </p>

        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Reflect privately here... (This stays in your temporary browser memory only, never saved to a server or account)"
          className="w-full min-h-[70px] rounded-md border border-input bg-background p-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <p className="text-[11px] text-muted-foreground">
          Zero data leaves your browser. Clearing temporary state or pressing Quick Exit erases this instantly.
        </p>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* MODULE NAVIGATION & COMPLETION */}
      {/* ------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
        {onPrevModule ? (
          <Button variant="outline" size="sm" onClick={onPrevModule} className="gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous Module</span>
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <Button
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            onClick={onComplete}
            className="gap-1.5 text-xs"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{isCompleted ? "Completed" : "Mark as Completed"}</span>
          </Button>

          {onNextModule && (
            <Button size="sm" onClick={onNextModule} className="gap-1.5 text-xs">
              <span>Next Module</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
