"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  SkipForward,
} from "lucide-react";
import { MYTH_VS_REAL_QUESTIONS, MythVsRealItem } from "@/data/learnAndPreventData";
import { BotanicalSprig, BotanicalDivider, BotanicalLeafCorner } from "./BotanicalDecorations";

interface MythVsRealQuizProps {
  onLearnMoreTopic?: (topicId: string) => void;
}

export function MythVsRealQuiz({ onLearnMoreTopic }: MythVsRealQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"Myth" | "Real" | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<Record<number, "Myth" | "Real">>({});

  const currentItem: MythVsRealItem = MYTH_VS_REAL_QUESTIONS[currentIndex];
  const totalQuestions = MYTH_VS_REAL_QUESTIONS.length;

  const handleSelectAnswer = (answer: "Myth" | "Real") => {
    // Only allow selecting if not already flipped to keep interaction distinct
    setSelectedAnswer(answer);
    setUserAnswersHistory((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      const nextAnswer = userAnswersHistory[currentIndex + 1] || null;
      setSelectedAnswer(nextAnswer);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      const prevAnswer = userAnswersHistory[currentIndex - 1] || null;
      setSelectedAnswer(prevAnswer);
      setIsFlipped(false);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsFlipped(false);
    setIsCompleted(false);
    setUserAnswersHistory({});
  };

  const isCorrect = selectedAnswer === currentItem?.correctAnswer;

  if (isCompleted) {
    return (
      <div className="w-full max-w-3xl mx-auto rounded-3xl bg-card border border-border p-8 sm:p-12 text-center shadow-md relative overflow-hidden transition-all duration-300">
        <BotanicalLeafCorner className="absolute -top-3 -right-3 w-20 h-20 text-primary" />
        <BotanicalLeafCorner className="absolute -bottom-3 -left-3 w-20 h-20 text-primary rotate-180" />

        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
          <Sparkles className="w-8 h-8" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
          Quiz Completed
        </h3>
        <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          You&apos;ve explored all {totalQuestions} key boundary and consent realities. Separating cultural myths from true care creates psychological safety and empowered choices.
        </p>

        <BotanicalDivider className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Myth vs Real Flip-Card Quiz"
      className="w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* 6.1 Initial Quiz Screen Headers */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-2">
          <BotanicalSprig className="w-4 h-4" />
          <span>Interactive Card Quiz</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
          Myth vs Real
        </h2>
        <p className="text-lg font-serif italic text-muted-foreground mt-1">
          Think. Choose. Learn.
        </p>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Not everything you hear is true. Let&apos;s separate myths from facts.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="w-full max-w-xl flex items-center justify-between text-xs font-medium text-muted-foreground mb-3 px-2">
        <span>Question {currentIndex + 1} of {totalQuestions}</span>
        <span className="capitalize">{currentItem.topicLabel}</span>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full max-w-xl h-1.5 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* 6.3 3D FLIP CARD CONTAINER */}
      <div className="w-full max-w-xl perspective-1000 min-h-[380px] sm:min-h-[420px] relative">
        <div
          className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl transform-style-3d transition-transform duration-500 ease-out relative ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* ======================================================== */}
          {/* FRONT SIDE OF THE CARD */}
          {/* ======================================================== */}
          <div
            className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl bg-card border border-border p-6 sm:p-8 flex flex-col justify-between shadow-md backface-hidden absolute inset-0 ${
              isFlipped ? "pointer-events-none" : ""
            }`}
            aria-hidden={isFlipped}
          >
            {/* Top Bar with botanical badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                MYTH OR REAL?
              </span>
              <BotanicalSprig className="w-6 h-6 opacity-60 text-primary" />
            </div>

            {/* Statement */}
            <div className="my-auto py-4">
              <blockquote className="text-xl sm:text-2xl font-serif text-foreground leading-snug font-medium text-center">
                &ldquo;{currentItem.statement}&rdquo;
              </blockquote>
            </div>

            {/* Interactive Feedback & Action Zone */}
            <div className="space-y-4">
              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectAnswer("Myth")}
                  aria-pressed={selectedAnswer === "Myth"}
                  className={`py-3 px-4 rounded-2xl font-medium text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedAnswer === "Myth"
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border hover:border-primary hover:bg-accent/10"
                  }`}
                >
                  <span>Myth</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAnswer("Real")}
                  aria-pressed={selectedAnswer === "Real"}
                  className={`py-3 px-4 rounded-2xl font-medium text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedAnswer === "Real"
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border hover:border-primary hover:bg-accent/10"
                  }`}
                >
                  <span>Real</span>
                </button>
              </div>

              {/* Immediate Non-Shaming Feedback & Flip Reveal Trigger */}
              {selectedAnswer ? (
                <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                  <div className="text-xs sm:text-sm text-foreground text-center sm:text-left">
                    <span className="font-semibold block">
                      {isCorrect ? currentItem.feedbackCorrect : currentItem.feedbackIncorrect}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Flip to explore the trauma-informed reality.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleFlipCard}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal the answer</span>
                  </button>
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground italic">
                  Select an answer above to reveal the explanation.
                </p>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* REVERSE SIDE OF THE CARD */}
          {/* ======================================================== */}
          <div
            className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl bg-primary text-primary-foreground border-2 border-primary p-6 sm:p-8 flex flex-col justify-between shadow-md backface-hidden rotate-y-180 absolute inset-0 ${
              !isFlipped ? "pointer-events-none" : ""
            }`}
            aria-hidden={!isFlipped}
          >
            {/* Header: Reality Label & Correct Tag */}
            <div className="flex items-center justify-between border-b border-primary-foreground/20 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
                THE REALITY
              </span>
              <span className="text-xs text-primary-foreground/80">
                Correct: <strong className="text-primary-foreground uppercase">{currentItem.correctAnswer}</strong>
              </span>
            </div>

            {/* Title & Core Explanation */}
            <div className="py-3 space-y-3 overflow-y-auto max-h-[220px] pr-1">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-primary-foreground leading-snug">
                {currentItem.realityTitle}
              </h3>
              <p className="text-xs sm:text-sm text-primary-foreground/90 leading-relaxed font-sans">
                {currentItem.realityExplanation}
              </p>

              {/* Practical Takeaway */}
              <div className="p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-xs leading-relaxed">
                <span className="font-bold text-primary-foreground block mb-0.5">What to remember:</span>
                <span className="text-primary-foreground/90">{currentItem.whatToRemember}</span>
              </div>
            </div>

            {/* Bottom Controls on Reverse Side */}
            <div className="flex items-center justify-between pt-3 border-t border-primary-foreground/20">
              <button
                type="button"
                onClick={handleFlipCard}
                className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/80 hover:text-primary-foreground underline focus:outline-none focus:ring-1 focus:ring-primary-foreground rounded px-1 py-0.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to question</span>
              </button>

              {onLearnMoreTopic && currentItem.learnMoreTopicId && (
                <button
                  type="button"
                  onClick={() => onLearnMoreTopic(currentItem.learnMoreTopicId!)}
                  className="inline-flex items-center gap-1.5 text-xs text-primary-foreground bg-primary-foreground/15 hover:bg-primary-foreground/25 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore topic</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6.4 QUIZ NAVIGATION CONTROLS */}
      <div className="w-full max-w-xl flex items-center justify-between gap-3 mt-6 px-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-border text-xs font-medium text-foreground hover:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Previous question"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
            aria-label="Restart quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Question indicator dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {MYTH_VS_REAL_QUESTIONS.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-5 bg-primary"
                  : userAnswersHistory[idx]
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!selectedAnswer && (
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <span>Skip</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-xs cursor-pointer"
          >
            <span>{currentIndex === totalQuestions - 1 ? "Finish" : "Next"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
