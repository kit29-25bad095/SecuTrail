import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/security/adminAuth";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminAccess(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));

    const {
      verifiedBy = "System Auditor",
      verifierRole = "Senior Verification Specialist",
      checkType = "PHONE_CHECK",
      findings = "Phone line verified operational; hours confirmed.",
      newStatus = "VERIFIED",
      nextReviewDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    } = body;

    const provider = getResourceProvider();
    const verifiedResource = await provider.verifyResource(id, {
      verifiedBy,
      verifierRole,
      checkType,
      findings,
      newStatus,
      nextReviewDate,
    });

    if (!verifiedResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Resource verification successfully recorded",
      resource: verifiedResource,
      auditRecord: {
        verifiedBy,
        verifierRole,
        checkType,
        findings,
        verifiedAt: new Date().toISOString(),
        nextReviewDate,
      },
    });
  } catch (error) {
    console.error("Resource verification error:", error);
    return NextResponse.json(
      { error: "Failed to record resource verification" },
      { status: 500 }
    );
  }
}
