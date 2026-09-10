import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_INTERNAL_TOKEN!;

function shouldSkip(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/x-panel") ||
    pathname.includes(".")
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
