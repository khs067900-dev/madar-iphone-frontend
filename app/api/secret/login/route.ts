import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== process.env.SECRET_PANEL_PASSWORD)
    return NextResponse.json({ error: "كلمة المرور خاطئة" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("secret_panel_auth", process.env.ADMIN_INTERNAL_TOKEN!, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return res;
}
