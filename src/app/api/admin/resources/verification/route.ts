import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/security/adminAuth";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export async function GET(req: NextRequest) {
  if (!verifyAdminAccess(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  try {
    const provider = getResourceProvider();
    const allResources = await provider.getResources({ includeDemo: true });

    const now = Date.now();
    const fifteenDaysFromNow = now + 15 * 24 * 60 * 60 * 1000;

    const expired = allResources.filter(
      (r) => new Date(r.nextReview).getTime() < now || r.verificationStatus === "EXPIRED"
    );

    const upcomingReview = allResources.filter(
      (r) =>
        new Date(r.nextReview).getTime() >= now &&
        new Date(r.nextReview).getTime() <= fifteenDaysFromNow &&
        r.verificationStatus === "VERIFIED"
    );

    const pendingReview = allResources.filter(
      (r) => r.verificationStatus === "PENDING_REVIEW" || r.verificationStatus === "NEEDS_UPDATE"
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalResources: allResources.length,
        verifiedActive: allResources.filter((r) => r.verificationStatus === "VERIFIED").length,
        expiredCount: expired.length,
        upcomingReviewCount: upcomingReview.length,
        pendingReviewCount: pendingReview.length,
      },
      queues: {
        expired,
        upcomingReview,
        pendingReview,
      },
    });
  } catch (error) {
    console.error("Admin verification queue error:", error);
    return NextResponse.json(
      { error: "Failed to load verification queues" },
      { status: 500 }
    );
  }
}
