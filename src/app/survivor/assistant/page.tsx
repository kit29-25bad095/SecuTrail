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
  RotateCcw,
  Sparkles,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    color: "border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100/70",
  },
  {
    icon: "⚖️",
    label: "Legal Awareness",
    prompt: "What are my rights and legal options under Indian law?",
    color: "border-purple-300 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-100/70",
  },
  {
    icon: "📚",
    label: "Learn & Understand",
    prompt: "What should I know about consent and personal boundaries?",
    color: "border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 hover:bg-blue-100/70",
  },
];

const QUICK_SUGGESTIONS = [
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
    "Hello. I'm here to support you privately and calmly. You are in a confidential, anonymous space with zero tracking and no sign-up required.\n\n" +
    "You can talk about how you're feeling, ask about time-critical medical care (such as HIV PEP within 72 hours), understand your legal rights under Indian law (BNS 2023), or learn about consent and boundaries.\n\n" +
    "You are in complete control of this conversation. How can I help you right now?",
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
    textareaRef.current?.focus();
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 lg:px-8 space-y-5">
      {/* ------------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------------ */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-wider">
          Step 05 • Verified AI Decision Assistant
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          You&apos;re Not Alone. Let&apos;s Figure Out What You Need.
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          A private space to talk about what you&apos;re feeling, understand your options, and learn about emotional and legal support.
        </p>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* THREE SUPPORT CATEGORY QUICK STARTERS */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {CATEGORY_PROMPTS.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(cat.prompt)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left shadow-2xs hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer ${cat.color}`}
          >
            <span className="text-2xl shrink-0" aria-hidden="true">
              {cat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">{cat.label}</p>
              <p className="text-[11px] opacity-80 mt-0.5 line-clamp-1">{cat.prompt}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* INTERACTIVE CHAT CONTAINER */}
      {/* ------------------------------------------------------------ */}
      <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden bg-card flex flex-col">
        {/* Chatbox Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs">
                <Bot className="h-4 w-4" />
              </span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">SecuTrail Assistant</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified RAG</span>
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Private Ephemeral Session Active</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetConversation}
              className="h-7 text-xs gap-1 px-2.5 text-muted-foreground hover:text-foreground"
              title="Reset conversation and clear session context"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Start Fresh</span>
            </Button>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div
          ref={chatScrollContainerRef}
          className="p-4 sm:p-5 space-y-4 min-h-[380px] max-h-[580px] overflow-y-auto scroll-smooth bg-gradient-to-b from-muted/10 via-background to-background"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.role === "user" ? (
                // ---------------- USER MESSAGE BUBBLE ----------------
                <div className="flex justify-end items-end gap-2">
                  <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] space-y-1">
                    <div className="rounded-2xl rounded-br-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2.5 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground pr-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] mb-4">
                    <User className="h-3.5 w-3.5" />
                  </span>
                </div>
              ) : (
                // ---------------- ASSISTANT MESSAGE CARD ----------------
                <div className="flex items-start gap-2.5 max-w-[95%] sm:max-w-[90%]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs shadow-2xs mt-1">
                    <Bot className="h-4 w-4" />
                  </span>

                  <div className="flex-1 space-y-3">
                    {/* Emergency Alert Banner if Critical */}
                    {msg.safetyClassification?.requiresEmergencyRouting && (
                      <Alert variant="emergency" className="border-2 border-red-500 bg-red-50 dark:bg-red-950/60 shadow-xs">
                        <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <div>
                          <AlertTitle className="font-bold text-red-950 dark:text-red-100 text-xs sm:text-sm">
                            Priority Safety Notice
                          </AlertTitle>
                          <AlertDescription className="text-xs text-red-900 dark:text-red-200 leading-relaxed mt-1">
                            {msg.safetyClassification.guidanceMessage ||
                              "Immediate safety risk detected. Please prioritize physical security."}
                          </AlertDescription>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            <a
                              href="tel:112"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-2xs"
                            >
                              <PhoneCall className="h-3.5 w-3.5" />
                              <span>Call 112 (National Emergency)</span>
                            </a>
                            <a
                              href="tel:1091"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-800 font-bold text-xs hover:bg-red-50 transition-colors shadow-2xs"
                            >
                              <span>Call 1091 (Women Helpline)</span>
                            </a>
                          </div>
                        </div>
                      </Alert>
                    )}

                    {/* Main Assistant Bubble */}
                    <div className="rounded-2xl rounded-tl-xs border border-border/80 bg-card p-3.5 sm:p-5 shadow-xs space-y-3">
                      {/* Top Badges & Interactive Copy Button */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {msg.relevantDomains && msg.relevantDomains.length > 0 ? (
                            msg.relevantDomains.map((domain) => (
                              <Badge
                                key={domain}
                                variant="verified"
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
                      <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </div>

                      {/* Interactive Decision Pathways (Collapsible) */}
                      {msg.agencyOptions && msg.agencyOptions.length > 0 && (
                        <div className="pt-2 border-t">
                          <button
                            type="button"
                            onClick={() => toggleSection(`options_${msg.id}`)}
                            className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-800 dark:text-slate-200 py-1 hover:text-primary transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Scale className="h-3.5 w-3.5 text-purple-600" />
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
                        <div className="pt-2 border-t">
                          <button
                            type="button"
                            onClick={() => toggleSection(`res_${msg.id}`)}
                            className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-800 dark:text-slate-200 py-1 hover:text-primary transition-colors cursor-pointer"
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
                        <div className="pt-2 border-t flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400">
                            <BookOpen className="h-3 w-3 text-primary" />
                            <span>Sources:</span>
                          </span>
                          {msg.citations.map((cite) => (
                            <span
                              key={cite.id}
                              className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[10px]"
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
            <div className="flex items-start gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs shadow-2xs mt-1">
                <Bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl rounded-tl-xs border border-border/80 bg-card p-3 shadow-xs flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Consulting verified Indian statutes &amp; clinical guidelines...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* INTERACTIVE QUICK SUGGESTIONS PILLS */}
        {/* ------------------------------------------------------------ */}
        <div className="px-4 py-2 border-t bg-muted/20">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Suggestions:</span>
            </span>
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                disabled={loading}
                className="rounded-full border border-slate-200 dark:border-slate-800 bg-background px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-muted hover:border-slate-300 transition-colors whitespace-nowrap shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95"
              >
                &ldquo;{suggestion}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* INTERACTIVE INPUT BAR */}
        {/* ------------------------------------------------------------ */}
        <div className="p-3 sm:p-4 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="space-y-2"
          >
            <div className="relative flex items-center gap-2">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }
                }}
                placeholder="Tell me what's on your mind... (Press Enter to send)"
                rows={1}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs sm:text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 resize-none min-h-[44px]"
              />

              <Button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="h-11 px-4 rounded-xl gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shrink-0 shadow-xs cursor-pointer transition-all active:scale-95 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{loading ? "Sending..." : "Send"}</span>
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                <span>Zero chat history stored on servers. PII is automatically sanitized.</span>
              </div>
              <span className="hidden sm:inline text-[10px] text-slate-400">
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
