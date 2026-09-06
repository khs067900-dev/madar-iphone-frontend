import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("secret_panel_auth")?.value;
  if (token && token === process.env.ADMIN_INTERNAL_TOKEN)
    return NextResponse.json({ ok: true });
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
