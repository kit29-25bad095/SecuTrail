import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/services/sessions/sessionManager";

export async function POST(req: NextRequest) {
  try {
    let sessionId: string | undefined;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      sessionId = body?.sessionId;
    } else {
      const text = await req.text().catch(() => "");
      try {
        const parsed = JSON.parse(text);
        sessionId = parsed?.sessionId;
      } catch {
        sessionId = text.trim() || undefined;
      }
    }

    if (sessionId && typeof sessionId === "string") {
      SessionManager.invalidateSession(sessionId.slice(0, 100));
    }

    return NextResponse.json({
      success: true,
      message: "Session invalidated safely",
    });
  } catch {
    // Quick exit endpoint must NEVER throw 500 error or block exit
    return NextResponse.json({ success: true });
  }
}
