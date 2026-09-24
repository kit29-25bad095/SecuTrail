import { NextRequest, NextResponse } from "next/server";
import { getResourceProvider } from "@/services/resources/resourceProvider";
import { SupportDomain, VerificationStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const state = searchParams.get("state") || undefined;
    const district = searchParams.get("district") || undefined;
    const is24x7 = searchParams.get("is24x7") === "true";
    const includeDemo = searchParams.get("includeDemo") === "true";
    const verificationStatus =
      (searchParams.get("status") as VerificationStatus) || undefined;

    const domains = domain ? [domain as SupportDomain] : undefined;

    const provider = getResourceProvider();
    const resources = await provider.getResources({
      domains,
      state,
      district,
      is24x7: is24x7 ? true : undefined,
      includeDemo,
      verificationStatus,
    });

    return NextResponse.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Resources API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve verified resources" },
      { status: 500 }
    );
  }
}
