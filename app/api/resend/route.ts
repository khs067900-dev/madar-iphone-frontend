import { NextRequest, NextResponse } from "next/server";

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
  const { orderId, customerName } = await req.json();

  await sendTelegram(`🔄 طلب إعادة إرسال الرمز\n👤 العميل: ${customerName}\n🔢 الطلب: ${orderId}`).catch(() => {});

  return NextResponse.json({ ok: true });
}
