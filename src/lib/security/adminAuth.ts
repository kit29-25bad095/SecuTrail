import { NextRequest } from "next/server";

export function verifyAdminAccess(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY || "secutrail-admin-demo-key-2026";

  // Check Header
  const headerKey = req.headers.get("x-admin-key") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (headerKey && headerKey === adminKey) {
    return true;
  }

  // Check Cookie
  const cookieKey = req.cookies.get("secutrail_admin_key")?.value;
  if (cookieKey && cookieKey === adminKey) {
    return true;
  }

  return false;
}
