import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_INTERNAL_TOKEN!;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (req.cookies.get("secret_panel_auth")?.value !== TOKEN)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const r = await fetch(`${BACKEND}/api/secret/blocked-devices/${id}/toggle`, {
    method: "PATCH",
    headers: { "x-internal-token": TOKEN },
  });
  return NextResponse.json(await r.json());
}
