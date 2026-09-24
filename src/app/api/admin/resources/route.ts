import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/security/adminAuth";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export async function GET(req: NextRequest) {
  if (!verifyAdminAccess(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  try {
    const provider = getResourceProvider();
    const resources = await provider.getResources({ includeDemo: true });

    return NextResponse.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Admin resources get error:", error);
    return NextResponse.json({ error: "Failed to fetch admin resources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminAccess(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      serviceType,
      contact,
      operatingHours,
      state,
      district,
      description,
      website,
      is24x7,
      authorityLevel,
      sourceOrganization,
      services,
    } = body;

    if (!name || !serviceType || !contact) {
      return NextResponse.json(
        { error: "Name, serviceType, and contact are required fields" },
        { status: 400 }
      );
    }

    const provider = getResourceProvider();
    const newResource = await provider.createResource({
      name,
      serviceType,
      contact,
      operatingHours: operatingHours || (is24x7 ? "24/7" : "9:00 AM - 5:00 PM"),
      state: state || "Delhi",
      district: district || "South Delhi",
      description: description || null,
      website: website || null,
      is24x7: Boolean(is24x7),
      availability: "AVAILABLE",
      geographicScope: state ? "STATE" : "NATIONAL",
      verificationStatus: "VERIFIED",
      authorityLevel: authorityLevel || "TIER_2_VETTED_NGO",
      lastVerified: new Date().toISOString(),
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      sourceOrganization: sourceOrganization || "Admin Audit Desk",
      services: services || [{ category: "EMOTIONAL", name: "Support Services", isFree: true }],
      isDemo: false,
    });

    return NextResponse.json({
      success: true,
      message: "Resource created and verified",
      resource: newResource,
    });
  } catch (error) {
    console.error("Admin resource creation error:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
