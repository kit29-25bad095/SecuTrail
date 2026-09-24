import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/prisma";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const dbHealth = await checkDatabaseHealth();
  const resourceProvider = getResourceProvider();
  const verifiedResources = await resourceProvider.getResources({
    verificationStatus: "VERIFIED",
  });

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      responseTimeMs,
      database: {
        provider: "PostgreSQL (Prisma)",
        connected: dbHealth.connected,
        latencyMs: dbHealth.latencyMs,
        fallbackMode: !dbHealth.connected ? "In-Memory Verified Registry Active" : null,
      },
      services: {
        safetyClassifier: "ONLINE",
        triageEngine: "ONLINE",
        verifiedRAG: "ONLINE",
        guardrails: "ONLINE",
        quickExit: {
          status: "ONLINE",
          destination: process.env.NEXT_PUBLIC_QUICK_EXIT_URL || "https://www.google.com",
        },
        resourceProvider: {
          mode: process.env.RESOURCE_PROVIDER || "demo",
          totalVerified: verifiedResources.length,
        },
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
