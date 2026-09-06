import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_INTERNAL_TOKEN!;

// Skip static files, API routes, and the secret panel itself
function shouldSkip(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/x-panel") ||
    pathname.startsWith("/blocked") ||
    pathname.includes(".") // static files
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (shouldSkip(pathname)) return NextResponse.next();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    (req as any).ip ||
    null;

  const fingerprint = req.cookies.get("_fp")?.value || null;
  const userAgent = req.headers.get("user-agent") || null;

  // ── Check if blocked ──────────────────────────────────────────────────────
  try {
    const checkRes = await fetch(`${BACKEND}/api/secret/blocked-devices/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint, ip }),
      signal: AbortSignal.timeout(3000),
    });
    if (checkRes.ok) {
      const { blocked } = await checkRes.json();
      if (blocked) {
        return NextResponse.redirect(new URL("/blocked", req.url));
      }
    }
  } catch {
    // fail open — don't block if backend is down
  }

  // ── Log visit ─────────────────────────────────────────────────────────────
  try {
    fetch(`${BACKEND}/api/secret/device-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint, ip, userAgent, path: pathname }),
      signal: AbortSignal.timeout(3000),
    }).catch(() => {});
  } catch {
    // fire and forget
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
