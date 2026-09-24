import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/security/adminAuth";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminAccess(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));

    const provider = getResourceProvider();
    const updated = await provider.updateResource(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully",
      resource: updated,
    });
  } catch (error) {
    console.error("Admin resource update error:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}
