import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_INTERNAL_TOKEN!;

function check(req: NextRequest) {
  return req.cookies.get("secret_panel_auth")?.value === TOKEN;
}

export async function GET(req: NextRequest) {
  if (!check(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await fetch(`${BACKEND}/api/secret/blocked-devices`, {
    headers: { "x-internal-token": TOKEN },
  });
  return NextResponse.json(await r.json());
}

export async function POST(req: NextRequest) {
  if (!check(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const r = await fetch(`${BACKEND}/api/secret/blocked-devices`, {
    method: "POST",
    headers: { "x-internal-token": TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await r.json());
}

export async function DELETE(req: NextRequest) {
  if (!check(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await fetch(`${BACKEND}/api/secret/blocked-devices`, {
    method: "DELETE",
    headers: { "x-internal-token": TOKEN },
  });
  return NextResponse.json(await r.json());
}
