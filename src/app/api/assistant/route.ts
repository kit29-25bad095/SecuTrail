import { NextRequest, NextResponse } from "next/server";
import { VerifiedRAGService } from "@/services/rag/ragService";
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
    const { query, domains, state, district } = body;

    // Strict input validation
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    if (query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      );
    }

    if (query.length > 2000) {
      return NextResponse.json(
        { error: "Query exceeds maximum allowed length of 2000 characters" },
        { status: 400 }
      );
    }

    const answerResult = await VerifiedRAGService.answer({
      query: query.trim(),
      selectedDomains: Array.isArray(domains) ? domains : undefined,
      state: typeof state === "string" ? state.trim() : undefined,
      district: typeof district === "string" ? district.trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        ...answerResult,
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
      { error: "Failed to answer query through verified RAG" },
      { status: 500 }
    );
  }
}
