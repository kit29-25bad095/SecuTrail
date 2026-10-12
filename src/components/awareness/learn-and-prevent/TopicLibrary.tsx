"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Clock,
  ShieldCheck,
  Info,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { TOPIC_LIBRARY, TopicLibraryItem } from "@/data/learnAndPreventData";
import { BotanicalSprig } from "./BotanicalDecorations";

interface TopicLibraryProps {
  onSelectActivity?: (activity: string) => void;
}

const CATEGORIES = [
  "All",
  "Consent & Boundaries",
  "Healthy Relationships",
  "Recognizing Warning Signs",
  "Digital Safety",
  "Supporting Others",
  "Finding Trustworthy Help",
] as const;

export function TopicLibrary({ onSelectActivity }: TopicLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTopics = useMemo(() => {
    return TOPIC_LIBRARY.filter((topic) => {
      const matchesCategory =
        selectedCategory === "All" || topic.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.keyTakeaways.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section
      id="topic-library"
      aria-label="Topic Library & Verification Registry"
      className="w-full max-w-6xl mx-auto flex flex-col items-center pt-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004225]/10 text-[#004225] text-xs font-semibold tracking-wider uppercase mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Curriculum &amp; Library</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#004225] tracking-tight">
          Topic Library
        </h2>
        <p className="text-sm text-[#004225]/75 mt-2 max-w-lg mx-auto leading-relaxed">
          Structured, verified guidance covering legal protections, healthy communication, and trauma-informed allyship.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="w-full max-w-3xl space-y-4 mb-8">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#004225]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, laws, bystander strategies, or boundaries..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFFFF8] border-2 border-[#004225]/20 text-sm text-[#004225] placeholder-[#004225]/40 focus:outline-none focus:border-[#004225] focus:ring-1 focus:ring-[#004225] transition-all shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#004225] text-[#FFFDD0] shadow-xs"
                  : "bg-[#004225]/8 text-[#004225] hover:bg-[#004225]/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-[#FFFFF2] border border-[#004225]/15 w-full max-w-lg">
          <Info className="w-8 h-8 text-[#004225]/50 mx-auto mb-2" />
          <p className="text-base font-serif font-bold text-[#004225]">
            No matching topics found
          </p>
          <p className="text-xs text-[#004225]/75 mt-1">
            Try adjusting your search terms or selecting &ldquo;All&rdquo; categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredTopics.map((topic: TopicLibraryItem) => (
            <div
              key={topic.id}
              className="rounded-3xl bg-[#FFFFF8] border-2 border-[#004225]/15 hover:border-[#004225]/30 p-6 flex flex-col justify-between shadow-xs transition-all hover:bg-[#FFFFF2]"
            >
              <div>
                {/* Status Indicator & Read Time */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {topic.isVerifiedStatutory ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#004225] text-[#FFFDD0] text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3 text-[#FFFDD0]" />
                      Verified Statutory Info
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#004225]/10 text-[#004225] text-[10px] font-bold uppercase tracking-wider">
                      <Info className="w-3 h-3 text-[#004225]" />
                      Educational Guidance
                    </span>
                  )}

                  <span className="text-[11px] text-[#004225]/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.estimatedMinutes} min
                  </span>
                </div>

                {/* Category & Title */}
                <span className="text-[11px] text-[#004225]/70 font-semibold block mb-1">
                  {topic.category}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#004225] mb-2 leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-[#004225]/85 leading-relaxed mb-4">
                  {topic.description}
                </p>

                {/* Key Takeaways */}
                <div className="p-3 rounded-2xl bg-[#004225]/5 border border-[#004225]/10 mb-4 text-xs">
                  <span className="font-bold text-[#004225] block mb-1.5">
                    Key Takeaways:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-[#004225]/85">
                    {topic.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statutory Source Metadata if verified */}
                {topic.isVerifiedStatutory && topic.authorityOrSource && (
                  <div className="p-3 rounded-xl bg-[#FFFFF0] border border-[#004225]/20 text-[11px] text-[#004225]/85 space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Authority / Law:</span>
                      <span>{topic.jurisdiction}</span>
                    </div>
                    <p className="font-medium">{topic.authorityOrSource}</p>
                    {topic.lastReviewed && (
                      <p className="text-[10px] text-[#004225]/60">
                        Last Reviewed: {topic.lastReviewed}
                      </p>
                    )}
                    {topic.sourceUrl && (
                      <a
                        href={topic.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#004225] underline hover:no-underline pt-1"
                      >
                        <span>Official Gazette Source</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Activity launcher link */}
              {onSelectActivity && (
                <div className="pt-3 border-t border-[#004225]/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectActivity(topic.recommendedActivity)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004225] hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Practice with{" "}
                      {topic.recommendedActivity === "myth-real"
                        ? "Myth vs Real"
                        : topic.recommendedActivity === "scenario"
                        ? "Interactive Story"
                        : topic.recommendedActivity === "reveal"
                        ? "Reveal Card"
                        : topic.recommendedActivity === "listen"
                        ? "Audio Lesson"
                        : "Quick Quiz"}
                    </span>
                  </button>
                  <BotanicalSprig className="w-4 h-4 opacity-40" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
