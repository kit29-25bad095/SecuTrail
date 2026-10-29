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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Self-Paced Checkpoints</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
          Quick Quizzes
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
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
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-primary/10 text-primary hover:bg-primary/15"
            }`}
          >
            {act.title}
          </button>
        ))}
      </div>

      {/* Main Quiz Box */}
      <div className="w-full max-w-2xl rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
        <BotanicalLeafCorner className="absolute -top-3 -right-3 w-16 h-16 text-primary opacity-40 pointer-events-none" />

        {isCompleted ? (
          /* Completion State */
          <div className="text-center py-6 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-foreground">
              Activity Complete
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Thank you for exploring &ldquo;{activity.title}&rdquo;. You can review questions or explore another topic at your own pace.
            </p>

            <BotanicalDivider className="my-6" />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestartActivity}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
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
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-3 mb-4">
              <span className="font-semibold">
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              <span className="italic">{activity.category}</span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-serif font-bold text-foreground mb-5 leading-snug">
              {question.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3" role="radiogroup" aria-label="Question answer options">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isOptionCorrect = idx === question.correctIndex;

                let buttonStyles =
                  "bg-card border-border hover:border-primary hover:bg-accent/10 text-foreground";

                if (isAnswered) {
                  if (isSelected && isOptionCorrect) {
                    buttonStyles = "bg-primary border-primary text-primary-foreground";
                  } else if (isSelected && !isOptionCorrect) {
                    buttonStyles = "bg-primary/15 border-primary/40 text-foreground";
                  } else if (isOptionCorrect) {
                    buttonStyles = "bg-primary/10 border-primary/30 text-foreground";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary ${buttonStyles}`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mt-0.5 ${
                        isSelected
                          ? "bg-primary-foreground text-primary"
                          : "bg-primary/10 text-primary"
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
              <div className="mt-5 p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Insight verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-primary/80" />
                        <span>Explore another answer</span>
                      </>
                    )}
                  </div>

                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={handleRetryQuestion}
                      className="text-xs font-semibold text-primary underline hover:no-underline cursor-pointer"
                    >
                      Retry question
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  {question.explanation}
                </p>

                <div className="pt-2 border-t border-border text-xs text-foreground">
                  <span className="font-bold">What to remember: </span>
                  <span className="text-muted-foreground">{question.takeaway}</span>
                </div>
              </div>
            )}

            {/* Bottom Question Controls */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-3 border-t border-border">
              <button
                type="button"
                onClick={handlePrev}
                disabled={questionIndex === 0}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-xs cursor-pointer"
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
