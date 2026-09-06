import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_INTERNAL_TOKEN!;

function check(req: NextRequest) {
  return req.cookies.get("secret_panel_auth")?.value === TOKEN;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!check(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const r = await fetch(`${BACKEND}/api/secret/device-logs/${id}`, {
    method: "PATCH",
    headers: { "x-internal-token": TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await r.json());
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!check(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await fetch(`${BACKEND}/api/secret/device-logs/${id}`, {
    method: "DELETE",
    headers: { "x-internal-token": TOKEN },
  });
  return NextResponse.json({ ok: true });
}
