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
      <div className="w-full max-w-3xl mx-auto rounded-3xl bg-[#FFFFF0] border-2 border-[#004225]/25 p-8 sm:p-12 text-center shadow-md relative overflow-hidden transition-all duration-300">
        <BotanicalLeafCorner className="absolute -top-3 -right-3 w-20 h-20 text-[#004225]" />
        <BotanicalLeafCorner className="absolute -bottom-3 -left-3 w-20 h-20 text-[#004225] rotate-180" />

        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#004225]/10 text-[#004225] mb-4">
          <Sparkles className="w-8 h-8" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#004225] tracking-tight">
          Quiz Completed
        </h3>
        <p className="mt-3 text-base text-[#004225]/85 max-w-lg mx-auto leading-relaxed">
          You&apos;ve explored all {totalQuestions} key boundary and consent realities. Separating cultural myths from true care creates psychological safety and empowered choices.
        </p>

        <BotanicalDivider className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#004225] text-[#FFFDD0] font-medium text-sm hover:bg-[#00331D] focus:outline-none focus:ring-2 focus:ring-[#004225] focus:ring-offset-2 transition-all shadow-sm"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004225]/10 text-[#004225] text-xs font-semibold tracking-wider uppercase mb-2">
          <BotanicalSprig className="w-4 h-4" />
          <span>Interactive Card Quiz</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#004225] tracking-tight">
          Myth vs Real
        </h2>
        <p className="text-lg font-serif italic text-[#004225]/80 mt-1">
          Think. Choose. Learn.
        </p>
        <p className="text-sm text-[#004225]/75 mt-2 max-w-md mx-auto leading-relaxed">
          Not everything you hear is true. Let&apos;s separate myths from facts.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="w-full max-w-xl flex items-center justify-between text-xs font-medium text-[#004225]/80 mb-3 px-2">
        <span>Question {currentIndex + 1} of {totalQuestions}</span>
        <span className="capitalize">{currentItem.topicLabel}</span>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full max-w-xl h-1.5 bg-[#004225]/15 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[#004225] transition-all duration-300 rounded-full"
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
            className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl bg-[#FFFFF2] border-2 border-[#004225]/20 p-6 sm:p-8 flex flex-col justify-between shadow-md backface-hidden absolute inset-0 ${
              isFlipped ? "pointer-events-none" : ""
            }`}
            aria-hidden={isFlipped}
          >
            {/* Top Bar with botanical badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004225] text-[#FFFDD0] text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                MYTH OR REAL?
              </span>
              <BotanicalSprig className="w-6 h-6 opacity-60" />
            </div>

            {/* Statement */}
            <div className="my-auto py-4">
              <blockquote className="text-xl sm:text-2xl font-serif text-[#004225] leading-snug font-medium text-center">
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
                  className={`py-3 px-4 rounded-2xl font-medium text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004225] ${
                    selectedAnswer === "Myth"
                      ? "bg-[#004225] text-[#FFFDD0] border-[#004225] shadow-sm"
                      : "bg-[#FFFDD0]/60 text-[#004225] border-[#004225]/30 hover:border-[#004225] hover:bg-[#FFFDD0]"
                  }`}
                >
                  <span>Myth</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAnswer("Real")}
                  aria-pressed={selectedAnswer === "Real"}
                  className={`py-3 px-4 rounded-2xl font-medium text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004225] ${
                    selectedAnswer === "Real"
                      ? "bg-[#004225] text-[#FFFDD0] border-[#004225] shadow-sm"
                      : "bg-[#FFFDD0]/60 text-[#004225] border-[#004225]/30 hover:border-[#004225] hover:bg-[#FFFDD0]"
                  }`}
                >
                  <span>Real</span>
                </button>
              </div>

              {/* Immediate Non-Shaming Feedback & Flip Reveal Trigger */}
              {selectedAnswer ? (
                <div className="p-3.5 rounded-2xl bg-[#004225]/8 border border-[#004225]/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                  <div className="text-xs sm:text-sm text-[#004225] text-center sm:text-left">
                    <span className="font-semibold block">
                      {isCorrect ? currentItem.feedbackCorrect : currentItem.feedbackIncorrect}
                    </span>
                    <span className="text-[#004225]/75 text-xs">
                      Flip to explore the trauma-informed reality.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleFlipCard}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004225] text-[#FFFDD0] text-xs font-semibold hover:bg-[#00331D] focus:outline-none focus:ring-2 focus:ring-[#004225] transition-all whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal the answer</span>
                  </button>
                </div>
              ) : (
                <p className="text-center text-xs text-[#004225]/60 italic">
                  Select an answer above to reveal the explanation.
                </p>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* REVERSE SIDE OF THE CARD */}
          {/* ======================================================== */}
          <div
            className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl bg-[#004225] text-[#FFFDD0] border-2 border-[#004225] p-6 sm:p-8 flex flex-col justify-between shadow-md backface-hidden rotate-y-180 absolute inset-0 ${
              !isFlipped ? "pointer-events-none" : ""
            }`}
            aria-hidden={!isFlipped}
          >
            {/* Header: Reality Label & Correct Tag */}
            <div className="flex items-center justify-between border-b border-[#FFFDD0]/20 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDD0]/15 text-[#FFFDD0] text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5 text-[#FFFDD0]" />
                THE REALITY
              </span>
              <span className="text-xs text-[#FFFDD0]/80">
                Correct: <strong className="text-[#FFFDD0] uppercase">{currentItem.correctAnswer}</strong>
              </span>
            </div>

            {/* Title & Core Explanation */}
            <div className="py-3 space-y-3 overflow-y-auto max-h-[220px] pr-1">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#FFFDD0] leading-snug">
                {currentItem.realityTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#FFFDD0]/90 leading-relaxed font-sans">
                {currentItem.realityExplanation}
              </p>

              {/* Practical Takeaway */}
              <div className="p-3 rounded-xl bg-[#FFFDD0]/10 border border-[#FFFDD0]/20 text-xs leading-relaxed">
                <span className="font-bold text-[#FFFDD0] block mb-0.5">What to remember:</span>
                <span className="text-[#FFFDD0]/90">{currentItem.whatToRemember}</span>
              </div>
            </div>

            {/* Bottom Controls on Reverse Side */}
            <div className="flex items-center justify-between pt-3 border-t border-[#FFFDD0]/20">
              <button
                type="button"
                onClick={handleFlipCard}
                className="inline-flex items-center gap-1.5 text-xs text-[#FFFDD0]/80 hover:text-[#FFFDD0] underline focus:outline-none focus:ring-1 focus:ring-[#FFFDD0] rounded px-1 py-0.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to question</span>
              </button>

              {onLearnMoreTopic && currentItem.learnMoreTopicId && (
                <button
                  type="button"
                  onClick={() => onLearnMoreTopic(currentItem.learnMoreTopicId!)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#FFFDD0] bg-[#FFFDD0]/15 hover:bg-[#FFFDD0]/25 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
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
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-[#004225]/30 text-xs font-medium text-[#004225] hover:bg-[#004225]/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Previous question"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-[#004225]/75 hover:text-[#004225] hover:bg-[#004225]/10 transition-colors cursor-pointer"
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
                  ? "w-5 bg-[#004225]"
                  : userAnswersHistory[idx]
                  ? "w-2 bg-[#004225]/60"
                  : "w-2 bg-[#004225]/20"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!selectedAnswer && (
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-[#004225]/70 hover:text-[#004225] hover:bg-[#004225]/10 transition-colors cursor-pointer"
            >
              <span>Skip</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#004225] text-[#FFFDD0] text-xs font-semibold hover:bg-[#00331D] focus:outline-none focus:ring-2 focus:ring-[#004225] transition-all shadow-xs cursor-pointer"
          >
            <span>{currentIndex === totalQuestions - 1 ? "Finish" : "Next"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
