import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_INTERNAL_TOKEN!;

function check(req: NextRequest) {
  return req.cookies.get("secret_panel_auth")?.value === TOKEN;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!check(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await fetch(`${BACKEND}/api/secret/blocked-devices/${id}`, {
    method: "DELETE",
    headers: { "x-internal-token": TOKEN },
  });
  return NextResponse.json({ ok: true });
}
