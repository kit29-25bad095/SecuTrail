/**
 * Privacy Session Cleanup Utility
 * Securely clears ONLY SecuTrail-owned client state without wiping entire localStorage.
 */

export const SECUTRAIL_STORAGE_KEYS = [
  "secutrail_session",
  "secutrail_session_id",
  "secutrail_chat",
  "secutrail_chat_messages",
  "secutrail_chat_context",
  "secutrail_triage",
  "secutrail_location",
  "secutrail_state",
  "secutrail_options",
  "secutrail_awareness_progress",
] as const;

export interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  key?: (index: number) => string | null;
  length?: number;
}

export function clearSecuTrailClientState(customStorages?: {
  localStorage?: StorageLike;
  sessionStorage?: StorageLike;
}): void {
  const local =
    customStorages?.localStorage ||
    (typeof localStorage !== "undefined" ? localStorage : null);
  const session =
    customStorages?.sessionStorage ||
    (typeof sessionStorage !== "undefined" ? sessionStorage : null);

  try {
    // 1. Clear known namespaced localStorage keys only
    if (local) {
      SECUTRAIL_STORAGE_KEYS.forEach((key) => {
        try {
          local.removeItem(key);
        } catch {
          // Ignore storage access errors (e.g. private browsing restrictions)
        }
      });

      // Also scan for any dynamic secutrail_ prefixed keys
      try {
        if (local.length !== undefined && local.key) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < local.length; i++) {
            const k = local.key(i);
            if (k && k.startsWith("secutrail_")) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach((k) => local.removeItem(k));
        }
      } catch {
        // Safe fallback
      }
    }

    // 2. Clear all sessionStorage
    if (session) {
      try {
        session.clear();
      } catch {
        // Safe fallback
      }
    }
  } catch (e) {
    // Non-blocking cleanup warning
    console.warn("Client state cleanup warning:", e);
  }
}
