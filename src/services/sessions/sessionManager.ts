import crypto from "crypto";
import { EphemeralConversationContext } from "@/types";

export interface EphemeralSessionData {
  id: string;
  token: string;
  createdAt: number;
  lastActiveAt: number;
  expiresAt: number;
  isInvalidated: boolean;
  triage?: {
    domains: string[];
    stateCode?: string;
    districtName?: string;
    emergencyDetected?: boolean;
  };
  conversationContext?: EphemeralConversationContext;
}

// In-memory store for high-speed ephemeral access with zero persistence footprint
const memorySessionStore = new Map<string, EphemeralSessionData>();

// Session timeout: 30 minutes of inactivity
const SESSION_TTL_MS = 30 * 60 * 1000;

export class SessionManager {
  /**
   * Generates a cryptographically random anonymous session token
   */
  public static createSession(initialTriage?: EphemeralSessionData["triage"]): EphemeralSessionData {
    const now = Date.now();
    const token = crypto.randomBytes(24).toString("hex");
    const id = `sess_${crypto.randomBytes(12).toString("hex")}`;

    const session: EphemeralSessionData = {
      id,
      token,
      createdAt: now,
      lastActiveAt: now,
      expiresAt: now + SESSION_TTL_MS,
      isInvalidated: false,
      triage: initialTriage,
    };

    memorySessionStore.set(token, session);
    memorySessionStore.set(id, session);

    // Periodically prune stale expired sessions
    this.cleanupExpiredSessions();

    return session;
  }

  /**
   * Retrieves active session if not expired and not invalidated
   */
  public static getSession(identifier: string): EphemeralSessionData | null {
    if (!identifier) return null;

    const session = memorySessionStore.get(identifier);
    if (!session) return null;

    if (session.isInvalidated) {
      return null;
    }

    const now = Date.now();
    if (now > session.expiresAt) {
      this.expireSession(identifier);
      return null;
    }

    // Refresh activity timestamp and sliding expiration window
    session.lastActiveAt = now;
    session.expiresAt = now + SESSION_TTL_MS;
    return session;
  }

  /**
   * Updates temporary session state (e.g. triage preferences or conversation context)
   */
  public static updateSession(
    identifier: string,
    updates: Partial<Pick<EphemeralSessionData, "triage" | "conversationContext">>
  ): EphemeralSessionData | null {
    const session = this.getSession(identifier);
    if (!session) return null;

    if (updates.triage) {
      session.triage = {
        ...session.triage,
        ...updates.triage,
      };
    }

    if (updates.conversationContext) {
      session.conversationContext = {
        ...updates.conversationContext,
      };
    }

    session.lastActiveAt = Date.now();
    session.expiresAt = Date.now() + SESSION_TTL_MS;
    return session;
  }

  /**
   * Updates ephemeral conversation context for the active session
   */
  public static updateConversationContext(
    identifier: string,
    context: EphemeralConversationContext
  ): EphemeralSessionData | null {
    return this.updateSession(identifier, { conversationContext: context });
  }

  /**
   * Explicitly marks a session as expired
   */
  public static expireSession(identifier: string): boolean {
    const session = memorySessionStore.get(identifier);
    if (!session) return false;

    session.isInvalidated = true;
    session.expiresAt = Date.now() - 1000;
    return true;
  }

  /**
   * Immediately invalidates and flushes the session (used by Quick Exit)
   */
  public static invalidateSession(identifier: string): boolean {
    return this.deleteSession(identifier);
  }

  /**
   * Completely purges the session from memory
   */
  public static deleteSession(identifier: string): boolean {
    const session = memorySessionStore.get(identifier);
    if (!session) return false;

    memorySessionStore.delete(session.token);
    memorySessionStore.delete(session.id);
    return true;
  }

  /**
   * Internal garbage collection for expired sessions
   */
  public static cleanupExpiredSessions(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    memorySessionStore.forEach((session, key) => {
      if (session.isInvalidated || now > session.expiresAt) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((k) => memorySessionStore.delete(k));
  }

  /**
   * Diagnostic count of active ephemeral sessions (no PII)
   */
  public static getActiveSessionCount(): number {
    this.cleanupExpiredSessions();
    const uniqueIds = new Set<string>();
    memorySessionStore.forEach((s) => {
      if (!s.isInvalidated && Date.now() <= s.expiresAt) {
        uniqueIds.add(s.id);
      }
    });
    return uniqueIds.size;
  }
}
