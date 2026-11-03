"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  ShieldAlert,
  BookOpen,
  Scale,
  Database,
  ExternalLink,
  Lock,
  RotateCcw,
  Sparkles,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  User,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { OptionCard } from "@/components/survivor/OptionCard";
import {
  SupportDomain,
  SafetyClassificationResult,
  SourceCitation,
  AgencyDecisionOption,
  VerifiedResource,
  EphemeralConversationContext,
  ConversationTurnResponse,
} from "@/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  safetyClassification?: SafetyClassificationResult;
  relevantDomains?: SupportDomain[];
  citations?: SourceCitation[];
  agencyOptions?: AgencyDecisionOption[];
  verifiedResources?: VerifiedResource[];
  isError?: boolean;
}

const CATEGORY_PROMPTS = [
  {
    icon: "💚",
    label: "Emotional Support",
    prompt: "I'm feeling overwhelmed and need someone to talk to.",
    color: "border-chip-emotional-border bg-chip-emotional text-chip-emotional-foreground hover:opacity-90",
  },
  {
    icon: "⚖️",
    label: "Legal Awareness",
    prompt: "What are my rights and legal options under Indian law?",
    color: "border-chip-legal-border bg-chip-legal text-chip-legal-foreground hover:opacity-90",
  },
  {
    icon: "📚",
    label: "Learn & Understand",
    prompt: "What should I know about consent and personal boundaries?",
    color: "border-border bg-card text-foreground hover:bg-muted/80",
  },
];

const QUICK_SUGGESTIONS = [
  "I need some comforting words right now.",
  "I don't want to tell anyone yet.",
  "What if I don't want to report?",
  "What is PEP and the 72-hour window?",
  "What is consent under Indian law?",
  "I'm still feeling scared.",
  "What are my options?",
];

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: "msg_welcome_initial",
  role: "assistant",
  content:
    "Hello. Welcome to a safe, quiet space. I'm here as your confidential, gentle support assistant. ❤️\n\n" +
    "You can ask me questions about time-sensitive medical care (such as PEP within 72 hours), understand your legal rights under Indian law (BNS 2023), or simply talk openly about how you're feeling.\n\n" +
    "I will always speak with kindness, honesty, and calm care—never with judgment or pressure. You are in complete control of this space. How can I support you right now?",
  timestamp: Date.now(),
  relevantDomains: ["EMOTIONAL", "LEGAL", "MEDICAL"],
  citations: [],
  agencyOptions: [],
  verifiedResources: [],
};

export default function DecisionAssistantPage() {
  const [inputMessage, setInputMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [context, setContext] = React.useState<EphemeralConversationContext | undefined>(undefined);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const chatScrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Restore ephemeral conversation from sessionStorage on mount (if available)
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("secutrail_chat_messages");
      const storedCtx = sessionStorage.getItem("secutrail_chat_context");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
      if (storedCtx) {
        setContext(JSON.parse(storedCtx));
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Save to temporary sessionStorage when messages update
  React.useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem("secutrail_chat_messages", JSON.stringify(messages));
      }
      if (context) {
        sessionStorage.setItem("secutrail_chat_context", JSON.stringify(context));
      }
    } catch {
      // Safe fallback
    }
  }, [messages, context]);

  // Scroll to bottom when messages update
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopyText = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      // Safe fallback
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    const userMessageId = `msg_user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      // Pull ephemeral location context if user previously configured triage
      let userState: string | undefined = undefined;
      let userDistrict: string | undefined = undefined;
      let sessionId: string | undefined = undefined;

      try {
        const storedTriage =
          sessionStorage.getItem("secutrail_triage") ||
          localStorage.getItem("secutrail_triage");
        if (storedTriage) {
          const parsed = JSON.parse(storedTriage);
          userState = parsed.state || undefined;
          userDistrict = parsed.district || undefined;
        }
        sessionId =
          sessionStorage.getItem("secutrail_session_id") ||
          localStorage.getItem("secutrail_session_id") ||
          undefined;
      } catch {
        // Safe fallback
      }

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          context,
          sessionId,
          state: userState,
          district: userDistrict,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: ConversationTurnResponse & { success?: boolean; error?: string } = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsgId = `msg_asst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
        safetyClassification: data.safetyClassification,
        relevantDomains: data.relevantDomains,
        citations: data.citations,
        agencyOptions: data.agencyOptions,
        verifiedResources: data.verifiedResources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.context) {
        setContext(data.context);
      }
    } catch (err) {
      console.error("Assistant chat error:", err);
      const errorMsgId = `msg_err_${Date.now()}`;
      const fallbackMsg: ChatMessage = {
        id: errorMsgId,
        role: "assistant",
        content:
          "I'm unable to process that right now. You can try again, or choose one of the support areas below.",
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleResetConversation = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setContext(undefined);
    try {
      sessionStorage.removeItem("secutrail_chat_messages");
      sessionStorage.removeItem("secutrail_chat_context");
    } catch {
      // Safe fallback
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const hasOnlyInitialWelcome =
    messages.length === 1 && messages[0].id === "msg_welcome_initial";

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      {/* ------------------------------------------------------------ */}
      {/* CHAT TOP HEADER BAR */}
      {/* ------------------------------------------------------------ */}
      <header className="shrink-0 border-b border-border/70 bg-card/60 backdrop-blur-md px-4 py-2.5 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/survivor/choose"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground py-1 px-2 rounded-lg hover:bg-muted transition-colors shrink-0"
            title="Return to Pathway Choice"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Choose Options</span>
          </Link>

          <div className="h-4 w-[1px] bg-border hidden sm:block shrink-0" />

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Bot className="h-4 w-4" />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm font-bold text-foreground truncate">SecuTrail Assistant</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-chip-emotional px-2 py-0.5 text-[10px] font-semibold text-chip-emotional-foreground border border-chip-emotional-border">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Sentimentally Balanced</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-chip-legal px-2 py-0.5 text-[10px] font-semibold text-chip-legal-foreground border border-chip-legal-border hidden md:inline-flex">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Verified RAG</span>
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                <Lock className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
                <span>Private Ephemeral Session Active • Zero Storage</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetConversation}
            className="h-8 text-xs gap-1.5 px-3 rounded-lg border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Start a fresh conversation and clear session context"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </header>

      {/* ------------------------------------------------------------ */}
      {/* FULL CHAT CANVAS SCROLL AREA */}
      {/* ------------------------------------------------------------ */}
      <div
        ref={chatScrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 scroll-smooth"
      >
        <div className="max-w-3xl lg:max-w-4xl mx-auto w-full space-y-6">
          {/* Welcome Hero State (shown when starting fresh) */}
          {hasOnlyInitialWelcome && (
            <div className="text-center py-6 sm:py-8 space-y-4 animate-in fade-in-50 duration-300">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1 shadow-xs">
                <Bot className="h-7 w-7" />
              </div>
              <div className="space-y-1.5 max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  How can I support you right now?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  A calm, emotionally balanced, and trauma-informed space. Ask about medical timelines (PEP within 72h), your legal rights (BNS 2023), or talk openly about whatever is on your mind.
                </p>
              </div>

              {/* ChatGPT-style starter prompt cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
                {CATEGORY_PROMPTS.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(cat.prompt)}
                    className={`flex flex-col justify-between p-4 rounded-2xl border text-left shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer ${cat.color} group`}
                  >
                    <span className="text-2xl mb-2" aria-hidden="true">
                      {cat.icon}
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight flex items-center justify-between text-foreground">
                        <span>{cat.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                      </p>
                      <p className="text-[11px] opacity-80 mt-1 line-clamp-2">
                        {cat.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Stream */}
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.role === "user" ? (
                // ---------------- USER MESSAGE BUBBLE ----------------
                <div className="flex justify-end items-end gap-2.5">
                  <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] space-y-1">
                    <div className="rounded-2xl rounded-br-xs bg-primary text-primary-foreground px-4 py-3 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground pr-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs mb-4 shadow-2xs">
                    <User className="h-4 w-4" />
                  </span>
                </div>
              ) : (
                // ---------------- ASSISTANT MESSAGE CARD ----------------
                <div className="flex items-start gap-3 max-w-[96%] sm:max-w-[92%]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs shadow-xs mt-1">
                    <Bot className="h-4.5 w-4.5" />
                  </span>

                  <div className="flex-1 space-y-3 min-w-0">
                    {/* Emergency Alert Banner if Critical */}
                    {msg.safetyClassification?.requiresEmergencyRouting && (
                      <Alert variant="emergency" className="border-2 border-destructive bg-destructive/10 text-foreground shadow-xs">
                        <ShieldAlert className="h-5 w-5 text-destructive" />
                        <div>
                          <AlertTitle className="font-bold text-foreground text-xs sm:text-sm">
                            Priority Safety Notice
                          </AlertTitle>
                          <AlertDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
                            {msg.safetyClassification.guidanceMessage ||
                              "Immediate safety risk detected. Please prioritize physical security."}
                          </AlertDescription>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            <a
                              href="tel:112"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 transition-colors shadow-2xs"
                            >
                              <PhoneCall className="h-3.5 w-3.5" />
                              <span>Call 112 (National Emergency)</span>
                            </a>
                            <a
                              href="tel:1091"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors shadow-2xs"
                            >
                              <span>Call 1091 (Women Helpline)</span>
                            </a>
                          </div>
                        </div>
                      </Alert>
                    )}

                    {/* Main Assistant Content Bubble */}
                    <div className="rounded-2xl rounded-tl-xs border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3">
                      {/* Top Badges & Copy Button */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/70">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {msg.relevantDomains && msg.relevantDomains.length > 0 ? (
                            msg.relevantDomains.map((domain) => (
                              <Badge
                                key={domain}
                                variant={
                                  domain === "EMOTIONAL"
                                    ? "emotional"
                                    : domain === "LEGAL"
                                    ? "legal"
                                    : "default"
                                }
                                className="text-[10px] uppercase font-bold py-0.5 px-2"
                              >
                                {domain === "MEDICAL" && "Medical Prophylaxis"}
                                {domain === "EMOTIONAL" && "Emotional Support"}
                                {domain === "LEGAL" && "Legal Rights (BNS 2023)"}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              Verified Assistance
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                            title="Copy response text"
                          >
                            {copiedMessageId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-[10px] text-emerald-600 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span className="text-[10px] hidden sm:inline">Copy</span>
                              </>
                            )}
                          </button>
                          <span className="text-[10px] text-muted-foreground">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </div>

                      {/* Interactive Decision Pathways (Collapsible) */}
                      {msg.agencyOptions && msg.agencyOptions.length > 0 && (
                        <div className="pt-2 border-t border-border/70">
                          <button
                            type="button"
                            onClick={() => toggleSection(`options_${msg.id}`)}
                            className="flex items-center justify-between w-full text-left text-xs font-bold text-foreground py-1 hover:text-primary transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Scale className="h-3.5 w-3.5 text-primary" />
                              <span>Explore Available Decision Pathways ({msg.agencyOptions.length})</span>
                            </span>
                            {expandedSections[`options_${msg.id}`] ? (
                              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </button>

                          {expandedSections[`options_${msg.id}`] && (
                            <div className="grid grid-cols-1 gap-2.5 pt-2 animate-in fade-in-50 duration-200">
                              {msg.agencyOptions.map((opt) => (
                                <OptionCard key={opt.id} option={opt} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive Verified Facilities & Helplines (Collapsible) */}
                      {msg.verifiedResources && msg.verifiedResources.length > 0 && (
                        <div className="pt-2 border-t border-border/70">
                          <button
                            type="button"
                            onClick={() => toggleSection(`res_${msg.id}`)}
                            className="flex items-center justify-between w-full text-left text-xs font-bold text-foreground py-1 hover:text-primary transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Database className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Verified Facilities &amp; Helplines ({msg.verifiedResources.length})</span>
                            </span>
                            {expandedSections[`res_${msg.id}`] ? (
                              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </button>

                          {expandedSections[`res_${msg.id}`] && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 animate-in fade-in-50 duration-200">
                              {msg.verifiedResources.map((res) => (
                                <ResourceCard key={res.id} resource={res} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Statutory Grounding Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-border/70 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1 font-semibold text-foreground">
                            <BookOpen className="h-3 w-3 text-primary" />
                            <span>Sources:</span>
                          </span>
                          {msg.citations.map((cite) => (
                            <span
                              key={cite.id}
                              className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] text-foreground border border-border"
                              title={`${cite.title} (${cite.organization})`}
                            >
                              <span>{cite.title}</span>
                              {cite.url && (
                                <a
                                  href={cite.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  <ExternalLink className="h-2.5 w-2.5 inline" />
                                </a>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator while Assistant is Thinking */}
          {loading && (
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs shadow-xs mt-1">
                <Bot className="h-4.5 w-4.5" />
              </span>
              <div className="rounded-2xl rounded-tl-xs border border-border/80 bg-card p-3.5 shadow-xs flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                <span className="text-xs text-muted-foreground">
                  Consulting verified Indian statutes &amp; clinical guidelines...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* CHATGPT-STYLE PINNED BOTTOM INPUT BAR */}
      {/* ------------------------------------------------------------ */}
      <div className="shrink-0 border-t border-border/70 bg-background/95 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="max-w-3xl lg:max-w-4xl mx-auto w-full space-y-2.5">
          {/* Quick Suggestions Pills Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Suggestions:</span>
            </span>
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                disabled={loading}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground hover:bg-muted transition-all whitespace-nowrap shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95"
              >
                &ldquo;{suggestion}&rdquo;
              </button>
            ))}
          </div>

          {/* ChatGPT-style Floating Input Card */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="relative rounded-2xl border border-input bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-primary p-2 transition-all"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }
                }}
                placeholder="Tell me what's on your mind... (Press Enter to send)"
                rows={1}
                className="w-full bg-transparent text-foreground px-2 py-1.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none resize-none min-h-[40px] max-h-[160px]"
              />

              <Button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                size="sm"
                className="h-9 w-9 rounded-xl p-0 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Bottom Security & Privacy Footnote */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>Zero chat history stored on servers • PII automatically sanitized</span>
            </div>
            <span className="hidden sm:inline text-[10px] text-muted-foreground/80">
              Enter to send, Shift+Enter for new line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
