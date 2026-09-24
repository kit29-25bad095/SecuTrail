import { NextRequest, NextResponse } from "next/server";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        count: 0,
        resources: [],
      });
    }

    const provider = getResourceProvider();
    const resources = await provider.searchResources(q);

    return NextResponse.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Resource search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform resource search" },
      { status: 500 }
    );
  }
}
