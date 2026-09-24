"use client";

import * as React from "react";
import {
  Bot,
  Send,
  ShieldAlert,
  BookOpen,
  Scale,
  Database,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { OptionCard } from "@/components/survivor/OptionCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { VerifiedRAGService } from "@/services/rag/ragService";
import { RAGAnswerResult } from "@/types";

const SAMPLE_QUERIES = [
  "What is PEP and what is the exact time window for HIV prevention?",
  "How does a Zero-FIR work under the new criminal laws (BNS 2023)?",
  "Can I get a forensic medical exam at a hospital without filing a police FIR?",
  "I feel numb, scared, and don't know who to talk to after an incident.",
];

export default function DecisionAssistantPage() {
  const [query, setQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<RAGAnswerResult | null>(null);

  const handleSubmit = async (userQuestion: string) => {
    const q = userQuestion.trim();
    if (!q) return;

    setLoading(true);
    setQuery(q);

    try {
      // Pull temporary location preferences from session if available
      let userState: string | undefined = undefined;
      let userDistrict: string | undefined = undefined;

      try {
        const stored =
          sessionStorage.getItem("secutrail_triage") ||
          localStorage.getItem("secutrail_triage");
        if (stored) {
          const parsed = JSON.parse(stored);
          userState = parsed.state || undefined;
          userDistrict = parsed.district || undefined;
        }
      } catch {
        // Safe fallback
      }

      // Execute Verified RAG pipeline
      const ragAnswer = await VerifiedRAGService.answer({
        query: q,
        state: userState,
        district: userDistrict,
      });

      setResult(ragAnswer);
    } catch (e) {
      console.error("Error running verified RAG query:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
          Step 05 • Verified AI Decision Assistant
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Trauma-Informed Decision Assistant
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Ask questions about healthcare timelines, your rights under Indian law (BNS 2023), or emotional coping. Every answer is grounded solely in verified statutory documents.
        </p>
      </div>

      {/* Input Box & Starters */}
      <Card className="border-border/80 shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(query);
            }}
            className="space-y-3"
          >
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about medical care, rights, emotional support, or what to do next..."
                rows={3}
                className="w-full rounded-lg border border-input bg-background p-3.5 text-xs sm:text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Zero chat history stored on servers. PII is automatically sanitized.</span>
              </div>

              <Button
                type="submit"
                disabled={loading || !query.trim()}
                className="gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{loading ? "Verifying..." : "Ask Assistant"}</span>
              </Button>
            </div>
          </form>

          {/* Quick Starter Chips */}
          <div className="space-y-1.5 pt-2 border-t">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Suggested Questions:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUERIES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSubmit(sample)}
                  className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-secondary transition-colors text-left"
                >
                  &ldquo;{sample}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading && (
        <LoadingState
          message="Consulting verified statutory & clinical sources..."
          subMessage="Filtering knowledge base against BNS 2023, MoHFW PEP protocols, and NALSA directories"
        />
      )}

      {/* ------------------------------------------------------------ */}
      {/* STRUCTURED RAG DECISION RESPONSE CARD */}
      {/* ------------------------------------------------------------ */}
      {result && !loading && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Emergency Alert if Critical */}
          {result.safetyClassification.requiresEmergencyRouting && (
            <Alert variant="emergency" className="border-2 border-red-500 bg-red-50">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <div>
                <AlertTitle className="font-bold text-red-950">
                  Priority Safety Notice
                </AlertTitle>
                <AlertDescription className="text-xs text-red-900 leading-relaxed mt-1">
                  {result.safetyClassification.guidanceMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* 1. Safety Classification & Relevant Paths */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold text-foreground">
                  Verified Analysis
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  Category: {result.safetyClassification.category}
                </Badge>
                <Badge
                  variant={
                    result.safetyClassification.urgency === "CRITICAL"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-[10px]"
                >
                  Urgency: {result.safetyClassification.urgency}
                </Badge>
              </div>
            </div>

            {/* Relevant Support Categories */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Identified Support Categories:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {result.relevantDomains.map((domain) => (
                  <Badge
                    key={domain}
                    variant="verified"
                    className="text-xs uppercase font-bold py-1 px-3"
                  >
                    {domain === "MEDICAL" && "Medical & Prophylaxis"}
                    {domain === "EMOTIONAL" && "Emotional & Stabilization"}
                    {domain === "LEGAL" && "Legal Rights (BNS 2023)"}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grounded Explanation */}
            <div className="pt-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
              {result.structuredExplanation}
            </div>
          </div>

          {/* 2. Agency-First Decision Options */}
          {result.agencyOptions.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Your Available Decision Pathways
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                You choose what feels appropriate for your situation. Here is what each path involves:
              </p>

              <div className="grid grid-cols-1 gap-4">
                {result.agencyOptions.map((opt) => (
                  <OptionCard key={opt.id} option={opt} />
                ))}
              </div>
            </section>
          )}

          {/* 3. Verified Resources Relevant to Query */}
          {result.verifiedResources.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Verified Facilities &amp; Crisis Services
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.verifiedResources.map((res) => (
                  <ResourceCard key={res.id} resource={res} />
                ))}
              </div>
            </section>
          )}

          {/* 4. Official Statutory & Medical Sources (Citations) */}
          {result.citations.length > 0 && (
            <Card className="border-border/80 bg-slate-50 dark:bg-slate-900/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>Grounding Source Authorities (Zero Hallucination Protocol)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                {result.citations.map((cite) => (
                  <div
                    key={cite.id}
                    className="p-2.5 rounded border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {cite.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {cite.organization} • Jurisdiction: {cite.jurisdiction} ({cite.publicationYear || "Current"})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="verified" className="text-[10px]">
                        ✓ {cite.verificationStatus}
                      </Badge>
                      {cite.url && (
                        <a
                          href={cite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-[11px] flex items-center gap-0.5"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
