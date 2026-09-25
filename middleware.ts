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

  const maintenanceEnabled = process.env.MAINTENANCE_MODE === "true";
  const isMaintenance = pathname === "/maintenance" || pathname.startsWith("/maintenance/");
  const isAssetOrApi =
    pathname === "/api" || pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    /\.(?:svg|png|jpe?g|gif|webp|ico|css|js|woff2?|ttf|eot|webmanifest|txt|xml|pdf)$/i.test(pathname);

  if (isMaintenance) {
    if (!maintenanceEnabled) {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    return NextResponse.next();
  }

  if (maintenanceEnabled && !isAssetOrApi) {
    const response = NextResponse.redirect(new URL("/maintenance", req.url));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (shouldSkip(pathname)) return NextResponse.next();

  // Skip logging if already logged in this session (valid for 30 minutes)
  const isLogged = req.cookies.get("_fp_logged")?.value;
  if (isLogged) return NextResponse.next();

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
      signal: AbortSignal.timeout(2000),
    }).catch(() => {});
  } catch {
    // fire and forget
  }

  const res = NextResponse.next();
  res.cookies.set("_fp_logged", "1", { maxAge: 1800, path: "/", sameSite: "lax" });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
