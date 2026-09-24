import { clearSecuTrailClientState } from "@/lib/privacy/sessionCleanup";

export interface QuickExitOptions {
  customDestination?: string;
  mockWindow?: {
    location: {
      replace: (url: string) => void;
      href?: string;
    };
    sendBeacon?: (url: string, data?: BodyInit | null) => boolean;
  };
}

/**
 * performQuickExit
 *
 * Orchestrates instantaneous, non-blocking exit:
 * 1. Dispatches non-blocking server invalidation beacon (does NOT await response).
 * 2. Purges SecuTrail localStorage keys and sessionStorage.
 * 3. Replaces window location via location.replace() so the sensitive page is
 *    not retained in the browser back-button history stack.
 */
export function performQuickExit(options?: QuickExitOptions): void {
  const win = options?.mockWindow || (typeof window !== "undefined" ? window : null);
  if (!win) return;

  const destination =
    options?.customDestination ||
    process.env.NEXT_PUBLIC_QUICK_EXIT_URL ||
    "https://www.google.com";

  // Step 1: Fire-and-forget server-side session invalidation.
  // We NEVER await, block, or delay redirect for network acknowledgement.
  try {
    let sessionId: string | null = null;
    if (typeof localStorage !== "undefined") {
      sessionId = localStorage.getItem("secutrail_session_id");
    }
    if (!sessionId && typeof sessionStorage !== "undefined") {
      sessionId = sessionStorage.getItem("secutrail_session_id");
    }

    const payload = JSON.stringify({ sessionId });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/session/exit",
        new Blob([payload], { type: "application/json" })
      );
    } else if (typeof fetch !== "undefined") {
      fetch("/api/session/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Safe silence: Network latency or failure must NEVER block physical safety exit
      });
    }
  } catch {
    // Non-blocking catch
  }

  // Step 2: Clear all SecuTrail temporary client storage
  clearSecuTrailClientState();

  // Step 3: Immediate replacement of current location to avoid adding back-button history
  try {
    win.location.replace(destination);
  } catch {
    if (win.location.href !== undefined) {
      win.location.href = destination;
    }
  }
}
