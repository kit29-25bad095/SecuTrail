import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/security/adminAuth";
import { getFeedbackQueue } from "@/lib/db/feedbackStore";

export async function GET(req: NextRequest) {
  if (!verifyAdminAccess(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  const feedbackItems = getFeedbackQueue();

  return NextResponse.json({
    success: true,
    count: feedbackItems.length,
    feedback: feedbackItems,
  });
}
