import { NextRequest, NextResponse } from "next/server";
import { SafetyClassifier } from "@/services/safety/safetyClassifier";
import { SafetyGuardrails } from "@/services/safety/guardrails";
import { checkRateLimit } from "@/lib/security/rateLimiter";

export async function POST(req: NextRequest) {
  // Apply rate limiting: 60 requests per minute
  const rateLimit = checkRateLimit(req, {
    maxRequests: 60,
    windowMs: 60000,
    prefix: "classify",
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many classification requests. Please wait a moment.",
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
    const text = body?.text || "";

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text field is required for classification" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text exceeds maximum allowed length of 5000 characters" },
        { status: 400 }
      );
    }

    // Step 1: Input guardrail check (redacts PII)
    const guardrailResult = SafetyGuardrails.checkInput(text);

    // Step 2: Safety classification
    const classification = SafetyClassifier.classify(guardrailResult.sanitizedInput);

    return NextResponse.json(
      {
        success: true,
        classification,
        piiRedacted: guardrailResult.hasPII,
      },
      {
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Classification API error:", error);
    return NextResponse.json(
      { error: "Failed to classify input safely" },
      { status: 500 }
    );
  }
}
