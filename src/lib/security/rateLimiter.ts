import { NextRequest } from "next/server";
import crypto from "crypto";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory bucket cache keyed by hashed client token
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((record, key) => {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    });
  }, 300000);
  if (timer.unref) {
    timer.unref();
  }
}

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  prefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  limit: number;
}

/**
 * Privacy-preserving rate limiter:
 * Derives a salted cryptographic hash of client identifier (IP / session / user-agent).
 * The raw IP is NEVER retained in memory.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): RateLimitResult {
  const maxRequests = options.maxRequests || 60;
  const windowMs = options.windowMs || 60000; // 1 minute default
  const prefix = options.prefix || "api";

  // Identify client anonymously
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "";
  const sessionCookie = req.cookies.get("secutrail_session_id")?.value || "";

  // Hash identifier with salt for privacy
  const salt = process.env.SESSION_SECRET || "secutrail_default_salt_2026";
  const clientHash = crypto
    .createHmac("sha256", salt)
    .update(`${ip}:${userAgent}:${sessionCookie}:${prefix}`)
    .digest("hex")
    .substring(0, 16);

  const now = Date.now();
  const existing = rateLimitMap.get(clientHash);

  if (!existing || now > existing.resetAt) {
    rateLimitMap.set(clientHash, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
      limit: maxRequests,
    };
  }

  existing.count += 1;
  const resetSeconds = Math.max(0, Math.ceil((existing.resetAt - now) / 1000));
  const remaining = Math.max(0, maxRequests - existing.count);

  if (existing.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      limit: maxRequests,
    };
  }

  return {
    allowed: true,
    remaining,
    resetSeconds,
    limit: maxRequests,
  };
}
