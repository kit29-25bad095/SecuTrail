import { NextRequest, NextResponse } from "next/server";
import { AdaptiveChatEngine } from "@/services/ai/adaptiveChatEngine";
import { checkRateLimit } from "@/lib/security/rateLimiter";

export async function POST(req: NextRequest) {
  // Apply rate limiting: 30 requests per minute per client hash
  const rateLimit = checkRateLimit(req, {
    maxRequests: 30,
    windowMs: 60000,
    prefix: "assistant",
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment before sending another query.",
        retryAfter: rateLimit.resetSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.resetSeconds.toString(),
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const userMessage = (body.message || body.query || "").toString();
    const { context, sessionId, state, district } = body;

    // Strict input validation
    if (!userMessage || userMessage.trim().length === 0) {
      return NextResponse.json(
        { error: "Query or message string is required" },
        { status: 400 }
      );
    }

    if (userMessage.length > 2000) {
      return NextResponse.json(
        { error: "Message exceeds maximum allowed length of 2000 characters" },
        { status: 400 }
      );
    }

    const turnResult = await AdaptiveChatEngine.processTurn({
      message: userMessage.trim(),
      context: typeof context === "object" && context !== null ? context : undefined,
      sessionId: typeof sessionId === "string" ? sessionId.trim() : undefined,
      state: typeof state === "string" ? state.trim() : undefined,
      district: typeof district === "string" ? district.trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        response: turnResult.response,
        structuredExplanation: turnResult.response, // backward-compat with single-turn consumers
        context: turnResult.context,
        safetyClassification: turnResult.safetyClassification,
        relevantDomains: turnResult.relevantDomains,
        citations: turnResult.citations,
        agencyOptions: turnResult.agencyOptions,
        verifiedResources: turnResult.verifiedResources,
        guardrailFlags: turnResult.guardrailFlags,
      },
      {
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "Failed to process turn through conversational assistant" },
      { status: 500 }
    );
  }
}
