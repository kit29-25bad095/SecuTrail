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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004225]/10 text-[#004225] text-xs font-semibold tracking-wider uppercase mb-2">
          <Compass className="w-4 h-4" />
          <span>Scenario-Based Exploration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#004225] tracking-tight">
          Interactive Stories
        </h2>
        <p className="text-sm text-[#004225]/75 mt-2 max-w-md mx-auto leading-relaxed">
          Walk through real-world dilemmas, explore different actions, and understand the subtle impact of your words.
        </p>
      </div>

      {/* Progress & Category */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs font-medium text-[#004225]/80 mb-3 px-2">
        <span>Scenario {currentScenarioIndex + 1} of {totalScenarios}</span>
        <span className="capitalize">{scenario.category}</span>
      </div>

      <div className="w-full max-w-2xl h-1.5 bg-[#004225]/15 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[#004225] transition-all duration-300 rounded-full"
          style={{ width: `${((currentScenarioIndex + 1) / totalScenarios) * 100}%` }}
        />
      </div>

      {/* Main Scenario Container */}
      <div className="w-full max-w-2xl rounded-3xl bg-[#FFFFF2] border-2 border-[#004225]/20 p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
        <BotanicalLeafCorner className="absolute -top-3 -right-3 w-16 h-16 text-[#004225] opacity-40 pointer-events-none" />

        {/* Title */}
        <div className="flex items-center justify-between border-b border-[#004225]/15 pb-4 mb-4">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#004225]">
            {scenario.title}
          </h3>
          <BotanicalSprig className="w-5 h-5 opacity-60" />
        </div>

        {/* Situation narrative */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDD0]/70 border border-[#004225]/15 mb-6 text-sm sm:text-base text-[#004225] leading-relaxed">
          <p className="font-serif italic text-base sm:text-lg mb-2 text-[#004225]">
            The Situation:
          </p>
          <p className="text-[#004225]/90 font-sans">{scenario.situation}</p>
        </div>

        {/* Prompt */}
        <p className="text-sm font-semibold text-[#004225] mb-4">
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
                className="w-full text-left p-4 rounded-2xl bg-[#FFFFF8] border-2 border-[#004225]/20 hover:border-[#004225] hover:bg-[#FFFDD0] transition-all flex items-start gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#004225]"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004225]/10 text-[#004225] flex items-center justify-center font-bold text-xs group-hover:bg-[#004225] group-hover:text-[#FFFDD0] transition-colors mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base text-[#004225] font-medium leading-snug">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Consequence & Analysis Reveal */
          <div className="space-y-4 animate-fade-in">
            {/* Selected choice highlight */}
            <div className="p-4 rounded-2xl bg-[#004225]/10 border border-[#004225]/20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#004225]/75 block mb-1">
                Your selected response
              </span>
              <p className="text-sm font-medium text-[#004225]">
                &ldquo;{selectedOption.text}&rdquo;
              </p>
            </div>

            {/* Analysis card */}
            <div
              className={`p-5 rounded-2xl border-2 transition-all ${
                selectedOption.isSupportive
                  ? "bg-[#FFFFF0] border-[#004225]/30 text-[#004225]"
                  : "bg-[#FFFFF0] border-[#004225]/25 text-[#004225]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm text-[#004225]">
                {selectedOption.isSupportive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#004225]" />
                    <span>Supportive &amp; Empowering Response</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-[#004225]/80" />
                    <span>Risk &amp; Impact Analysis</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#004225]/90 leading-relaxed mb-3">
                {selectedOption.consequences}
              </p>

              <div className="p-3 rounded-xl bg-[#004225]/8 border border-[#004225]/15 text-xs text-[#004225]/90 leading-relaxed">
                <span className="font-semibold block mb-0.5 text-[#004225]">Understanding the effect:</span>
                <span>{selectedOption.analysis}</span>
              </div>

              {/* Takeaway */}
              <div className="mt-3 pt-3 border-t border-[#004225]/15 text-xs text-[#004225] font-medium">
                <span className="font-bold text-[#004225]">Safer approach: </span>
                {selectedOption.takeaway}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTryAnother}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#004225]/30 text-xs font-semibold text-[#004225] hover:bg-[#004225]/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try another response</span>
              </button>

              {currentScenarioIndex < totalScenarios - 1 ? (
                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#004225] text-[#FFFDD0] text-xs font-semibold hover:bg-[#00331D] focus:outline-none focus:ring-2 focus:ring-[#004225] transition-all shadow-xs cursor-pointer"
                >
                  <span>Next scenario</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#004225] text-[#FFFDD0] text-xs font-semibold hover:bg-[#00331D] transition-all cursor-pointer"
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
          className="inline-flex items-center gap-1 text-xs text-[#004225]/75 hover:text-[#004225] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous scenario</span>
        </button>

        <span className="text-xs text-[#004225]/60">
          No personal answers are stored or monitored
        </span>

        <button
          type="button"
          onClick={handleNextScenario}
          disabled={currentScenarioIndex === totalScenarios - 1}
          className="inline-flex items-center gap-1 text-xs text-[#004225]/75 hover:text-[#004225] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <span>Next scenario</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
