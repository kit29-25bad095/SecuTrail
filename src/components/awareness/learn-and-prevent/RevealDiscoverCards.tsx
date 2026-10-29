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
        return <Compass className="w-5 h-5 text-primary" />;
      case "rev-2":
        return <Sparkles className="w-5 h-5 text-primary" />;
      case "rev-3":
        return <ShieldAlert className="w-5 h-5 text-primary" />;
      case "rev-4":
        return <Flame className="w-5 h-5 text-primary" />;
      case "rev-5":
        return <HeartHandshake className="w-5 h-5 text-primary" />;
      case "rev-6":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <BookOpen className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <section
      aria-label="Reveal & Discover Cards"
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-2">
          <Layers className="w-4 h-4" />
          <span>Interactive Discoveries</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
          Reveal &amp; Discover
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
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
                  ? "bg-card border-primary/40 shadow-md ring-1 ring-primary/20"
                  : "bg-card border-border hover:border-primary/40 hover:bg-accent/5"
              }`}
            >
              <div>
                {/* Top Pill & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center">
                      {getIconForCard(card.id)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {card.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground bg-primary/5 px-2 py-0.5 rounded-full">
                    {card.readTime}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-serif font-bold text-foreground mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Prompt Statement */}
                <p className="text-sm text-muted-foreground italic mb-4 font-serif">
                  &ldquo;{card.prompt}&rdquo;
                </p>

                {/* Revealed Content Section */}
                {isRevealed && (
                  <div
                    id={`reveal-content-${card.id}`}
                    className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in text-xs sm:text-sm"
                  >
                    <p className="text-muted-foreground leading-relaxed font-sans">
                      {card.explanation}
                    </p>

                    <div className="p-3 rounded-2xl bg-primary/5 border border-border text-xs text-foreground">
                      <span className="font-bold block mb-0.5 text-foreground">
                        Practical takeaway:
                      </span>
                      <span className="text-muted-foreground leading-relaxed">
                        {card.practicalTakeaway}
                      </span>
                    </div>

                    {onSelectCategory && (
                      <button
                        type="button"
                        onClick={() => onSelectCategory(card.category)}
                        className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <span>Explore category: {card.category}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Reveal / Hide Toggle Button */}
              <div className="mt-6 pt-3 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleReveal(card.id)}
                  aria-expanded={isRevealed}
                  aria-controls={`reveal-content-${card.id}`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                    isRevealed
                      ? "bg-primary/15 text-primary hover:bg-primary/25"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
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

                <BotanicalSprig className="w-4 h-4 opacity-40 text-primary" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
