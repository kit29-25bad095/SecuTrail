"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  BookOpen,
  Headphones,
  Info,
} from "lucide-react";
import { AUDIO_LESSONS, AudioLesson } from "@/data/learnAndPreventData";
import { BotanicalSprig } from "./BotanicalDecorations";

export function ListenLessonPlayer() {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentLesson: AudioLesson = AUDIO_LESSONS[selectedLessonIndex];

  // Verify browser SpeechSynthesis support safely on client mount
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
    }

    return () => {
      // Clean up speech synthesis on unmount
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const playAudio = () => {
    if (!isSupported || typeof window === "undefined") return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Cancel any previous utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentLesson.fullTranscript);
    utterance.rate = 0.95; // slightly slower, calm cadence
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pauseAudio = () => {
    if (!isSupported || typeof window === "undefined") return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleLessonChange = (index: number) => {
    stopAudio();
    setSelectedLessonIndex(index);
    setShowFullTranscript(false);
  };

  return (
    <section
      aria-label="Listen Instead of Read Educational Lessons"
      className="w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004225]/10 text-[#004225] text-xs font-semibold tracking-wider uppercase mb-2">
          <Headphones className="w-4 h-4" />
          <span>Audio Experience</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#004225] tracking-tight">
          Listen Instead of Read
        </h2>
        <p className="text-sm text-[#004225]/75 mt-2 max-w-md mx-auto leading-relaxed">
          Listen to concise, calm audio narrations generated directly in your browser with zero external tracking.
        </p>
      </div>

      {/* Lesson Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6" role="tablist">
        {AUDIO_LESSONS.map((lesson, idx) => (
          <button
            key={lesson.id}
            role="tab"
            aria-selected={idx === selectedLessonIndex}
            onClick={() => handleLessonChange(idx)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              idx === selectedLessonIndex
                ? "bg-[#004225] text-[#FFFDD0] shadow-xs"
                : "bg-[#004225]/10 text-[#004225] hover:bg-[#004225]/15"
            }`}
          >
            {lesson.title}
          </button>
        ))}
      </div>

      {/* Main Audio Player Card */}
      <div className="w-full max-w-2xl rounded-3xl bg-[#FFFFF2] border-2 border-[#004225]/20 p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
        {/* Lesson Header */}
        <div className="flex items-center justify-between border-b border-[#004225]/15 pb-4 mb-4">
          <div>
            <span className="text-xs uppercase font-bold text-[#004225]/70 tracking-wider">
              {currentLesson.category} • {currentLesson.durationEstimate}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#004225] mt-1">
              {currentLesson.title}
            </h3>
          </div>
          <BotanicalSprig className="w-6 h-6 opacity-60" />
        </div>

        {/* Audio Controls Bar */}
        <div className="p-4 rounded-2xl bg-[#FFFDD0]/70 border border-[#004225]/15 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!isPlaying ? (
              <button
                type="button"
                onClick={playAudio}
                disabled={!isSupported}
                aria-label={isPaused ? "Resume narration" : "Play narration"}
                className="w-12 h-12 rounded-full bg-[#004225] text-[#FFFDD0] flex items-center justify-center hover:bg-[#00331D] focus:outline-none focus:ring-2 focus:ring-[#004225] focus:ring-offset-2 transition-all shadow-sm cursor-pointer disabled:opacity-40"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseAudio}
                aria-label="Pause narration"
                className="w-12 h-12 rounded-full bg-[#004225] text-[#FFFDD0] flex items-center justify-center hover:bg-[#00331D] focus:outline-none focus:ring-2 focus:ring-[#004225] transition-all shadow-sm cursor-pointer"
              >
                <Pause className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={stopAudio}
              disabled={!isPlaying && !isPaused}
              aria-label="Stop narration"
              className="w-10 h-10 rounded-full border border-[#004225]/30 text-[#004225] flex items-center justify-center hover:bg-[#004225]/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-[#004225]/85 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#004225]" />
            <span>
              {isPlaying
                ? "Playing narration..."
                : isPaused
                ? "Narration paused"
                : "Ready to listen (Browser Voice)"}
            </span>
          </div>
        </div>

        {/* Graceful Fallback Notice if SpeechSynthesis is unsupported */}
        {!isSupported && (
          <div className="mb-4 p-3 rounded-xl bg-[#004225]/8 border border-[#004225]/15 flex items-start gap-2 text-xs text-[#004225]">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Your browser does not support local speech synthesis audio. You can read the complete transcript directly below.
            </p>
          </div>
        )}

        {/* Concise Summary */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#004225]/80">
            Concise Lesson Summary
          </span>
          <p className="text-sm text-[#004225] leading-relaxed font-sans bg-[#FFFFF8] p-4 rounded-2xl border border-[#004225]/15">
            {currentLesson.conciseSummary}
          </p>
        </div>

        {/* Transcript Toggle */}
        <div className="pt-3 border-t border-[#004225]/15">
          <button
            type="button"
            onClick={() => setShowFullTranscript((prev) => !prev)}
            aria-expanded={showFullTranscript}
            className="text-xs font-semibold text-[#004225] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showFullTranscript ? "Hide full narration text" : "Read full narration text"}</span>
          </button>

          {showFullTranscript && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FFFFF8] border border-[#004225]/15 text-xs sm:text-sm text-[#004225]/90 leading-relaxed font-serif animate-fade-in">
              <p>{currentLesson.fullTranscript}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
