import { NextRequest, NextResponse } from "next/server";
import { getTriageEngine } from "@/services/triage/triageEngine";
import { getResourceProvider } from "@/services/resources/resourceProvider";
import { SessionManager } from "@/services/sessions/sessionManager";
import { SupportDomain } from "@/types";
import { checkRateLimit } from "@/lib/security/rateLimiter";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(req, {
    maxRequests: 60,
    windowMs: 60000,
    prefix: "triage",
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many triage requests. Please wait a moment.",
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
    const { domains, timeframe, state, district, sessionId } = body;

    const validatedDomains: SupportDomain[] =
      Array.isArray(domains) && domains.length > 0
        ? domains
        : ["MEDICAL", "EMOTIONAL", "LEGAL"];

    // Update in-memory session if sessionId provided
    if (sessionId && typeof sessionId === "string") {
      SessionManager.updateSession(sessionId, {
        triage: {
          domains: validatedDomains,
          stateCode: typeof state === "string" ? state.slice(0, 50) : undefined,
          districtName: typeof district === "string" ? district.slice(0, 50) : undefined,
        },
      });
    }

    // Evaluate via TriageEngine service abstraction
    const triageEngine = getTriageEngine();
    const evaluation = await triageEngine.evaluateTriage({
      domains: validatedDomains,
      timeframe,
      state: typeof state === "string" ? state.slice(0, 50) : undefined,
      district: typeof district === "string" ? district.slice(0, 50) : undefined,
    });

    const resourceProvider = getResourceProvider();
    const resources = await resourceProvider.getResources({
      domains: validatedDomains,
      state: state || undefined,
      district: district || undefined,
      verificationStatus: "VERIFIED",
    });

    return NextResponse.json(
      {
        success: true,
        triage: {
          domains: validatedDomains,
          timeframe: timeframe || "UNDER_72_HOURS",
          state: state || null,
          district: district || null,
          timeframeAlerts: evaluation.timeframeAlerts,
          criticalActions: evaluation.criticalActions,
        },
        options: evaluation.recommendedOptions,
        recommendedResources: resources.slice(0, 6),
      },
      {
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Triage API error:", error);
    return NextResponse.json(
      { error: "Failed to process triage care request" },
      { status: 500 }
    );
  }
}
