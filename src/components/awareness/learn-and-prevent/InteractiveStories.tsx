"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Compass,
} from "lucide-react";
import { BRANCHING_SCENARIOS, BranchingScenario, ScenarioOption } from "@/data/learnAndPreventData";
import { BotanicalSprig, BotanicalLeafCorner } from "./BotanicalDecorations";

export function InteractiveStories() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const scenario: BranchingScenario = BRANCHING_SCENARIOS[currentScenarioIndex];
  const totalScenarios = BRANCHING_SCENARIOS.length;

  const selectedOption: ScenarioOption | undefined = scenario.options.find(
    (opt) => opt.id === selectedOptionId
  );

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleTryAnother = () => {
    setSelectedOptionId(null);
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < totalScenarios - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    }
  };

  const handlePrevScenario = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex((prev) => prev - 1);
      setSelectedOptionId(null);
    }
  };

  const handleRestart = () => {
    setCurrentScenarioIndex(0);
    setSelectedOptionId(null);
  };

  return (
    <section
      aria-label="Interactive Branching Stories"
      className="w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-2">
          <Compass className="w-4 h-4" />
          <span>Scenario-Based Exploration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
          Interactive Stories
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Walk through real-world dilemmas, explore different actions, and understand the subtle impact of your words.
        </p>
      </div>

      {/* Progress & Category */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs font-medium text-muted-foreground mb-3 px-2">
        <span>Scenario {currentScenarioIndex + 1} of {totalScenarios}</span>
        <span className="capitalize">{scenario.category}</span>
      </div>

      <div className="w-full max-w-2xl h-1.5 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${((currentScenarioIndex + 1) / totalScenarios) * 100}%` }}
        />
      </div>

      {/* Main Scenario Container */}
      <div className="w-full max-w-2xl rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
        <BotanicalLeafCorner className="absolute -top-3 -right-3 w-16 h-16 text-primary opacity-40 pointer-events-none" />

        {/* Title */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            {scenario.title}
          </h3>
          <BotanicalSprig className="w-5 h-5 opacity-60 text-primary" />
        </div>

        {/* Situation narrative */}
        <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-border mb-6 text-sm sm:text-base text-foreground leading-relaxed">
          <p className="font-serif italic text-base sm:text-lg mb-2 text-foreground">
            The Situation:
          </p>
          <p className="text-muted-foreground font-sans">{scenario.situation}</p>
        </div>

        {/* Prompt */}
        <p className="text-sm font-semibold text-foreground mb-4">
          {scenario.prompt}
        </p>

        {/* Choices List */}
        {!selectedOption ? (
          <div className="space-y-3" role="radiogroup" aria-label="Scenario response choices">
            {scenario.options.map((option, idx) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                className="w-full text-left p-4 rounded-2xl bg-card border-2 border-border hover:border-primary hover:bg-accent/10 transition-all flex items-start gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base text-foreground font-medium leading-snug">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Consequence & Analysis Reveal */
          <div className="space-y-4 animate-fade-in">
            {/* Selected choice highlight */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Your selected response
              </span>
              <p className="text-sm font-medium text-foreground">
                &ldquo;{selectedOption.text}&rdquo;
              </p>
            </div>

            {/* Analysis card */}
            <div
              className={`p-5 rounded-2xl border-2 transition-all ${
                selectedOption.isSupportive
                  ? "bg-card border-border text-foreground"
                  : "bg-card border-border text-foreground"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm text-foreground">
                {selectedOption.isSupportive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Supportive &amp; Empowering Response</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-primary/80" />
                    <span>Risk &amp; Impact Analysis</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                {selectedOption.consequences}
              </p>

              <div className="p-3 rounded-xl bg-primary/5 border border-border text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold block mb-0.5 text-foreground">Understanding the effect:</span>
                <span>{selectedOption.analysis}</span>
              </div>

              {/* Takeaway */}
              <div className="mt-3 pt-3 border-t border-border text-xs text-foreground font-medium">
                <span className="font-bold text-foreground">Safer approach: </span>
                {selectedOption.takeaway}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTryAnother}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try another response</span>
              </button>

              {currentScenarioIndex < totalScenarios - 1 ? (
                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-xs cursor-pointer"
                >
                  <span>Next scenario</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart scenarios</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scenario Prev/Next footer controls */}
      <div className="w-full max-w-2xl flex items-center justify-between mt-4 px-2">
        <button
          type="button"
          onClick={handlePrevScenario}
          disabled={currentScenarioIndex === 0}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous scenario</span>
        </button>

        <span className="text-xs text-muted-foreground">
          No personal answers are stored or monitored
        </span>

        <button
          type="button"
          onClick={handleNextScenario}
          disabled={currentScenarioIndex === totalScenarios - 1}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <span>Next scenario</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
