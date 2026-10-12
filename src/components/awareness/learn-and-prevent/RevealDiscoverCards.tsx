"use client";

import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  ShieldAlert,
  Flame,
  HeartHandshake,
  CheckCircle,
  Eye,
  EyeOff,
  Layers,
  BookOpen,
} from "lucide-react";
import { REVEAL_DISCOVER_CARDS, RevealCardItem } from "@/data/learnAndPreventData";
import { BotanicalSprig } from "./BotanicalDecorations";

interface RevealDiscoverCardsProps {
  onSelectCategory?: (category: string) => void;
}

export function RevealDiscoverCards({ onSelectCategory }: RevealDiscoverCardsProps) {
  // Set of revealed card IDs (in-memory state)
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getIconForCard = (id: string) => {
    switch (id) {
      case "rev-1":
        return <Compass className="w-5 h-5 text-[#004225]" />;
      case "rev-2":
        return <Sparkles className="w-5 h-5 text-[#004225]" />;
      case "rev-3":
        return <ShieldAlert className="w-5 h-5 text-[#004225]" />;
      case "rev-4":
        return <Flame className="w-5 h-5 text-[#004225]" />;
      case "rev-5":
        return <HeartHandshake className="w-5 h-5 text-[#004225]" />;
      case "rev-6":
        return <CheckCircle className="w-5 h-5 text-[#004225]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[#004225]" />;
    }
  };

  return (
    <section
      aria-label="Reveal & Discover Cards"
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004225]/10 text-[#004225] text-xs font-semibold tracking-wider uppercase mb-2">
          <Layers className="w-4 h-4" />
          <span>Interactive Discoveries</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#004225] tracking-tight">
          Reveal &amp; Discover
        </h2>
        <p className="text-sm text-[#004225]/75 mt-2 max-w-lg mx-auto leading-relaxed">
          Tap each card to reveal key insights on healthy boundaries, affirmative communication, and recognizing warning signs.
        </p>
      </div>

      {/* Grid of 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {REVEAL_DISCOVER_CARDS.map((card: RevealCardItem) => {
          const isRevealed = !!revealedIds[card.id];

          return (
            <div
              key={card.id}
              className={`rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between p-6 shadow-xs relative overflow-hidden ${
                isRevealed
                  ? "bg-[#FFFFF0] border-[#004225]/30 shadow-md ring-1 ring-[#004225]/15"
                  : "bg-[#FFFFF8] border-[#004225]/15 hover:border-[#004225]/30 hover:bg-[#FFFFF2]"
              }`}
            >
              <div>
                {/* Top Pill & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-[#004225]/10 flex items-center justify-center">
                      {getIconForCard(card.id)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#004225]/70">
                      {card.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#004225]/60 bg-[#004225]/5 px-2 py-0.5 rounded-full">
                    {card.readTime}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-serif font-bold text-[#004225] mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Prompt Statement */}
                <p className="text-sm text-[#004225]/85 italic mb-4 font-serif">
                  &ldquo;{card.prompt}&rdquo;
                </p>

                {/* Revealed Content Section */}
                {isRevealed && (
                  <div
                    id={`reveal-content-${card.id}`}
                    className="mt-4 pt-4 border-t border-[#004225]/15 space-y-3 animate-fade-in text-xs sm:text-sm"
                  >
                    <p className="text-[#004225]/90 leading-relaxed font-sans">
                      {card.explanation}
                    </p>

                    <div className="p-3 rounded-2xl bg-[#004225]/8 border border-[#004225]/15 text-xs text-[#004225]">
                      <span className="font-bold block mb-0.5 text-[#004225]">
                        Practical takeaway:
                      </span>
                      <span className="text-[#004225]/85 leading-relaxed">
                        {card.practicalTakeaway}
                      </span>
                    </div>

                    {onSelectCategory && (
                      <button
                        type="button"
                        onClick={() => onSelectCategory(card.category)}
                        className="text-xs text-[#004225] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <span>Explore category: {card.category}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Reveal / Hide Toggle Button */}
              <div className="mt-6 pt-3 border-t border-[#004225]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleReveal(card.id)}
                  aria-expanded={isRevealed}
                  aria-controls={`reveal-content-${card.id}`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004225] ${
                    isRevealed
                      ? "bg-[#004225]/15 text-[#004225] hover:bg-[#004225]/25"
                      : "bg-[#004225] text-[#FFFDD0] hover:bg-[#00331D] shadow-xs"
                  }`}
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide insight</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal answer</span>
                    </>
                  )}
                </button>

                <BotanicalSprig className="w-4 h-4 opacity-40" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
