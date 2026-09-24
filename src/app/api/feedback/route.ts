import { NextRequest, NextResponse } from "next/server";
import { addFeedback } from "@/lib/db/feedbackStore";
import { checkRateLimit } from "@/lib/security/rateLimiter";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(req, {
    maxRequests: 20,
    windowMs: 60000,
    prefix: "feedback",
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many feedback submissions. Please wait before submitting another report.",
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
    const { resourceId, feedbackType, comments } = body;

    if (!resourceId || !feedbackType) {
      return NextResponse.json(
        { error: "resourceId and feedbackType are required" },
        { status: 400 }
      );
    }

    const item = addFeedback({
      resourceId: String(resourceId).slice(0, 100),
      feedbackType: String(feedbackType).slice(0, 50),
      comments: comments ? String(comments).substring(0, 500) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted for verification audit",
        feedbackId: item.id,
      },
      {
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to record feedback" },
      { status: 500 }
    );
  }
}
