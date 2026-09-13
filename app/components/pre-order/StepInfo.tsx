"use client";

import { useState } from "react";
import { IoCheckmarkCircle, IoLogoWhatsapp, IoWarning } from "react-icons/io5";
import { inp } from "./types";
import { Err } from "./Err";

export function StepInfo({ onNext, onBack }: {
  onNext: (name: string, nationalId: string, whatsapp: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string) => {
    if (field === "name") {
      if (!value.trim()) return "الاسم مطلوب";
      if (value.trim().length < 3) return "الاسم قصير جداً";
    }
    if (field === "nationalId") {
      if (!value) return "رقم الهوية مطلوب";
      if (!/^[12]/.test(value)) return "الهوية تبدأ بـ 1 أو 2 فقط";
      if (value.length < 10) return `${value.length}/10 أرقام`;
    }
    if (field === "whatsapp") {
      if (!value) return "رقم الواتساب مطلوب";
      if (!value.startsWith("05")) return "الرقم يجب أن يبدأ بـ 05";
      if (value.length < 10) return `${value.length}/10 أرقام`;
    }
    return "";
  };

  const errors = {
    name: touched.name ? validateField("name", name) : "",
    nationalId: touched.nationalId ? validateField("nationalId", nationalId) : "",
    whatsapp: touched.whatsapp ? validateField("whatsapp", whatsapp) : "",
  };

  const isValid = (f: string, v: string) => touched[f] && !validateField(f, v);

  const submit = () => {
    setTouched({ name: true, nationalId: true, whatsapp: true });
    const e = ["name", "nationalId", "whatsapp"].map(f =>
      validateField(f, { name, nationalId, whatsapp }[f as keyof typeof errors] ?? "")
    );
    if (e.every(v => !v)) onNext(name.trim(), nationalId, whatsapp);
  };

  const fieldClass = (field: string, value: string) => {
    if (!touched[field]) return inp;
    return validateField(field, value)
      ? "w-full border border-red-400/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition bg-red-500/10 text-white placeholder:text-white/30"
      : "w-full border border-[#65E0CD]/50 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#65E0CD] transition bg-[#65E0CD]/5 text-white placeholder:text-white/30";
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-white/50">الاسم الكامل</label>
        <div className="relative">
          <input
            className={fieldClass("name", name)}
            placeholder="محمد عبدالله"
            value={name}
            onChange={e => { setName(e.target.value); setTouched(p => ({ ...p, name: true })); }}
            onBlur={() => setTouched(p => ({ ...p, name: true }))}
          />
          {isValid("name", name) && <IoCheckmarkCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65E0CD]" />}
        </div>
        <Err msg={errors.name} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-white/50">رقم الهوية الوطنية</label>
        <div className="relative">
          <input
            className={fieldClass("nationalId", nationalId)}
            placeholder="1xxxxxxxxx"
            value={nationalId}
            inputMode="numeric"
            dir="ltr"
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 10);
              setNationalId(v);
              setTouched(p => ({ ...p, nationalId: true }));
            }}
            onBlur={() => setTouched(p => ({ ...p, nationalId: true }))}
          />
          {isValid("nationalId", nationalId) && <IoCheckmarkCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65E0CD]" />}
        </div>
        <Err msg={errors.nationalId} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-white/50 flex items-center gap-1">
          <IoLogoWhatsapp size={13} className="text-[#65E0CD]" />
          رقم الواتساب
        </label>
        <div className="relative">
          <input
            className={fieldClass("whatsapp", whatsapp)}
            placeholder="05xxxxxxxx"
            value={whatsapp}
            inputMode="tel"
            dir="ltr"
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 10);
              setWhatsapp(v);
              setTouched(p => ({ ...p, whatsapp: true }));
            }}
            onBlur={() => setTouched(p => ({ ...p, whatsapp: true }))}
          />
          {isValid("whatsapp", whatsapp) && <IoCheckmarkCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65E0CD]" />}
        </div>
        <Err msg={errors.whatsapp} />
        <div className="flex items-start gap-2 mt-1 p-2.5 rounded-xl border border-[#65E0CD]/20 bg-[#65E0CD]/5">
          <IoWarning size={13} className="text-[#65E0CD] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#65E0CD]/80 leading-relaxed">
            <span className="font-bold">تنبيه:</span> رقم الواتساب هو وسيلة التواصل الوحيدة معك. تأكد من صحته.
          </p>
        </div>
      </div>

      <button
        onClick={submit}
        className="w-full py-3 rounded-xl font-bold text-white text-sm mt-1"
        style={{ background: "linear-gradient(135deg,#1B7174,#094F52)" }}
      >
        المتابعة للدفع
      </button>
      <button onClick={onBack} className="text-xs text-white/30 text-center py-1 hover:text-white/60 transition">
        → تعديل الاختيار
      </button>
    </div>
  );
}
