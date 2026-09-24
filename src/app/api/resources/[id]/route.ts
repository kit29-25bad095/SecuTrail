import { NextRequest, NextResponse } from "next/server";
import { getResourceProvider } from "@/services/resources/resourceProvider";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const provider = getResourceProvider();
    const resource = await provider.getResourceById(id);

    if (!resource) {
      return NextResponse.json(
        { error: "Verified resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Resource detail API error:", error);
    return NextResponse.json(
      { error: "Failed to load resource details" },
      { status: 500 }
    );
  }
}
