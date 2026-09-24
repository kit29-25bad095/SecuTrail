import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/services/sessions/sessionManager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const session = SessionManager.createSession(body.triage);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Could not initialize ephemeral session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId parameter is required" },
        { status: 400 }
      );
    }

    const session = SessionManager.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
        triage: session.triage,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      SessionManager.deleteSession(sessionId);
    }

    return NextResponse.json({ success: true, message: "Session purged" });
  } catch {
    return NextResponse.json({ success: true });
  }
}
