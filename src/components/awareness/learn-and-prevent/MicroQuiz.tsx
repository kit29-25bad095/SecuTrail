"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { MICRO_QUIZZES, MicroQuizActivity, MicroQuizQuestion } from "@/data/learnAndPreventData";
import { BotanicalDivider, BotanicalLeafCorner } from "./BotanicalDecorations";

export function MicroQuiz() {
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answersMap, setAnswersMap] = useState<Record<number, number>>({});

  const activity: MicroQuizActivity = MICRO_QUIZZES[selectedActivityIndex];
  const question: MicroQuizQuestion = activity.questions[questionIndex];
  const totalQuestions = activity.questions.length;

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
    setAnswersMap((prev) => ({ ...prev, [questionIndex]: index }));
  };

  const handleRetryQuestion = () => {
    setSelectedOptionIndex(null);
    setAnswersMap((prev) => {
      const copy = { ...prev };
      delete copy[questionIndex];
      return copy;
    });
  };

  const handleNext = () => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((prev) => prev + 1);
      const nextSelected = answersMap[questionIndex + 1] !== undefined ? answersMap[questionIndex + 1] : null;
      setSelectedOptionIndex(nextSelected);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      const prevSelected = answersMap[questionIndex - 1] !== undefined ? answersMap[questionIndex - 1] : null;
      setSelectedOptionIndex(prevSelected);
    }
  };

  const handleRestartActivity = () => {
    setQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsCompleted(false);
    setAnswersMap({});
  };

  const handleSwitchActivity = (index: number) => {
    setSelectedActivityIndex(index);
    setQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsCompleted(false);
    setAnswersMap({});
  };

  const isAnswered = selectedOptionIndex !== null;
  const isCorrect = isAnswered && selectedOptionIndex === question.correctIndex;

  return (
    <section
      aria-label="Micro-Quizzes"
      className="w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004225]/10 text-[#004225] text-xs font-semibold tracking-wider uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Self-Paced Checkpoints</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#004225] tracking-tight">
          Quick Quizzes
        </h2>
        <p className="text-sm text-[#004225]/75 mt-2 max-w-md mx-auto leading-relaxed">
          Short, non-judgmental 3-question checks to reinforce essential legal rights and bystander strategies.
        </p>
      </div>

      {/* Activity Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6" role="tablist">
        {MICRO_QUIZZES.map((act, idx) => (
          <button
            key={act.id}
            role="tab"
            aria-selected={idx === selectedActivityIndex}
            onClick={() => handleSwitchActivity(idx)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              idx === selectedActivityIndex
                ? "bg-[#004225] text-[#FFFDD0] shadow-xs"
                : "bg-[#004225]/10 text-[#004225] hover:bg-[#004225]/15"
            }`}
          >
            {act.title}
          </button>
        ))}
      </div>

      {/* Main Quiz Box */}
      <div className="w-full max-w-2xl rounded-3xl bg-[#FFFFF2] border-2 border-[#004225]/20 p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
        <BotanicalLeafCorner className="absolute -top-3 -right-3 w-16 h-16 text-[#004225] opacity-40 pointer-events-none" />

        {isCompleted ? (
          /* Completion State */
          <div className="text-center py-6 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#004225]/10 text-[#004225] mb-4">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#004225]">
              Activity Complete
            </h3>
            <p className="mt-2 text-sm text-[#004225]/85 max-w-md mx-auto leading-relaxed">
              Thank you for exploring &ldquo;{activity.title}&rdquo;. You can review questions or explore another topic at your own pace.
            </p>

            <BotanicalDivider className="my-6" />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestartActivity}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#004225] text-[#FFFDD0] text-xs font-semibold hover:bg-[#00331D] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Review this quiz</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Question State */
          <div>
            {/* Header: Progress & Category */}
            <div className="flex items-center justify-between text-xs text-[#004225]/80 border-b border-[#004225]/15 pb-3 mb-4">
              <span className="font-semibold">
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              <span className="italic">{activity.category}</span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#004225] mb-5 leading-snug">
              {question.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3" role="radiogroup" aria-label="Question answer options">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isOptionCorrect = idx === question.correctIndex;

                let buttonStyles =
                  "bg-[#FFFFF8] border-[#004225]/20 hover:border-[#004225] hover:bg-[#FFFDD0] text-[#004225]";

                if (isAnswered) {
                  if (isSelected && isOptionCorrect) {
                    buttonStyles = "bg-[#004225] border-[#004225] text-[#FFFDD0]";
                  } else if (isSelected && !isOptionCorrect) {
                    buttonStyles = "bg-[#004225]/15 border-[#004225]/40 text-[#004225]";
                  } else if (isOptionCorrect) {
                    buttonStyles = "bg-[#004225]/10 border-[#004225]/30 text-[#004225]";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#004225] ${buttonStyles}`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mt-0.5 ${
                        isSelected
                          ? "bg-[#FFFDD0] text-[#004225]"
                          : "bg-[#004225]/10 text-[#004225]"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Immediate Explanatory Feedback */}
            {isAnswered && (
              <div className="mt-5 p-4 rounded-2xl bg-[#004225]/8 border border-[#004225]/15 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#004225]">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#004225]" />
                        <span>Insight verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-[#004225]/80" />
                        <span>Explore another answer</span>
                      </>
                    )}
                  </div>

                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={handleRetryQuestion}
                      className="text-xs font-semibold text-[#004225] underline hover:no-underline cursor-pointer"
                    >
                      Retry question
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#004225]/90 leading-relaxed font-sans">
                  {question.explanation}
                </p>

                <div className="pt-2 border-t border-[#004225]/10 text-xs text-[#004225]">
                  <span className="font-bold">What to remember: </span>
                  <span className="text-[#004225]/85">{question.takeaway}</span>
                </div>
              </div>
            )}

            {/* Bottom Question Controls */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-3 border-t border-[#004225]/15">
              <button
                type="button"
                onClick={handlePrev}
                disabled={questionIndex === 0}
                className="inline-flex items-center gap-1 text-xs text-[#004225]/75 hover:text-[#004225] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#004225] text-[#FFFDD0] text-xs font-semibold hover:bg-[#00331D] focus:outline-none focus:ring-2 focus:ring-[#004225] transition-all shadow-xs cursor-pointer"
              >
                <span>{questionIndex === totalQuestions - 1 ? "Complete" : "Continue"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
