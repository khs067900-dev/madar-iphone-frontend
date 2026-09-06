import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_INTERNAL_TOKEN!;

function authHeaders() {
  return { "x-internal-token": TOKEN, "Content-Type": "application/json" };
}

// Public — called from Next.js middleware to log visits
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await fetch(`${BACKEND}/api/secret/device-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

// Protected — admin only
export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("secret_panel_auth")?.value;
  if (cookie !== TOKEN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const r = await fetch(`${BACKEND}/api/secret/device-logs`, { headers: authHeaders() });
  const data = await r.json();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const cookie = req.cookies.get("secret_panel_auth")?.value;
  if (cookie !== TOKEN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const r = await fetch(`${BACKEND}/api/secret/device-logs`, { method: "DELETE", headers: authHeaders() });
  return NextResponse.json(await r.json());
}
