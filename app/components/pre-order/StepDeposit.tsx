"use client";

import { IoShieldCheckmark, IoCardOutline, IoCubeOutline } from "react-icons/io5";
import { fmt, PRE_ORDER_DEPOSIT } from "./types";

export function StepDeposit({ productPrice, onNext, onBack }: {
  productPrice: number;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
      {/* Amount hero */}
      <div
        className="flex flex-col items-center gap-1 py-3 sm:py-5 rounded-2xl"
        style={{ background: "linear-gradient(135deg,rgba(101,224,205,0.1),rgba(27,113,116,0.15))", border: "1px solid rgba(101,224,205,0.2)" }}
      >
        <p className="text-[10px] sm:text-xs font-bold text-[#65E0CD]/70 uppercase tracking-widest">الدفعة المطلوبة الآن</p>
        <p className="text-3xl sm:text-5xl font-black mt-1 sm:mt-2 text-[#65E0CD]">
          {fmt(PRE_ORDER_DEPOSIT)}
        </p>
        <p className="text-sm sm:text-base font-bold text-white/70 mt-0.5 sm:mt-1">ريال سعودي</p>
        <p className="text-[10px] sm:text-[11px] text-white/40 mt-1 sm:mt-2 text-center px-3 sm:px-4 leading-relaxed">
          لتأكيد حجز جهازك، يلزم دفع دفعة مقدمة قدرها {fmt(PRE_ORDER_DEPOSIT)} ريال.
        </p>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl overflow-hidden border border-white/10">
        {[
          ["قيمة الحجز المسبق", `${fmt(PRE_ORDER_DEPOSIT)} ر.س`],
          ["المبلغ المطلوب الآن", `${fmt(PRE_ORDER_DEPOSIT)} ر.س`],
          ["المبلغ المتبقي", "أقساط حسب خيارك"],
        ].map(([k, v], i) => (
          <div
            key={k}
            className="flex justify-between px-3 py-2 sm:px-4 sm:py-2.5"
            style={{
              background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <span className="text-[11px] sm:text-sm text-white/50 font-medium">{k}</span>
            <span className="text-[11px] sm:text-sm font-bold text-white">{v}</span>
          </div>
        ))}
      </div>

      {/* Refund notice */}
      <div
        className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl"
        style={{ background: "rgba(101,224,205,0.07)", border: "1px solid rgba(101,224,205,0.2)" }}
      >
        <IoShieldCheckmark size={15} className="text-[#65E0CD] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-[#65E0CD] mb-0.5">مبلغ الدفعة قابل للاسترداد</p>
          <p className="text-[10px] sm:text-[11px] text-white/50 leading-relaxed">
            في حال إلغاء الحجز وفقاً لسياسة المتجر، يتم رد الدفعة المقدمة حسب شروط وأحكام الحجز.
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-col gap-1.5 sm:gap-2 px-1">
        {[
          { Icon: IoShieldCheckmark, text: "الدفع يتم عبر بوابة دفع آمنة خاصه بمتجرنا" },
          { Icon: IoCardOutline,     text: "لن يتم خصم أي مبلغ إضافي غير موضح قبل تأكيد الدفع" },
          { Icon: IoCubeOutline,     text: "الدفعة مخصصة لتأكيد الحجز المسبق فقط" },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon size={12} style={{ color: "#65E0CD", flexShrink: 0 }} />
            <p className="text-[10px] sm:text-[11px] text-white/40">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-white text-xs sm:text-sm mt-0.5"
        style={{ background: "linear-gradient(135deg,#1B7174,#094F52)" }}
      >
        المتابعة إلى الدفع
      </button>
      <button onClick={onBack} className="text-[10px] sm:text-xs text-white/30 text-center py-1 hover:text-white/60 transition">
        → العودة إلى البيانات
      </button>
    </div>
  );
}
