"use client";

import { useState, useRef } from "react";
import { inp } from "./types";

export function StepPayment({
  loading,
  onSubmit,
  onBack,
}: {
  loading: boolean;
  onSubmit: (cardNumber: string, expiry: string, cvv: string, holder: string) => void;
  onBack: () => void;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardError, setCardError] = useState("");
  const [cardHolderError, setCardHolderError] = useState("");

  const expiryRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  const handleCardSubmit = () => {
    let valid = true;

    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) {
      setCardError("رقم البطاقة يجب أن يكون 16 رقمًا"); valid = false;
    } else {
      let sum = 0, shouldDouble = false;
      for (let i = rawCard.length - 1; i >= 0; i--) {
        let digit = parseInt(rawCard[i]);
        if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
        sum += digit; shouldDouble = !shouldDouble;
      }
      if (sum % 10 !== 0) { setCardError("رقم البطاقة غير صحيح"); valid = false; }
    }

    if (valid) {
      const expiryDigits = cardExpiry.replace(/\D/g, "");
      if (expiryDigits.length !== 4) {
        setCardError("تاريخ الانتهاء غير مكتمل"); valid = false;
      } else {
        const month = parseInt(expiryDigits.slice(0, 2));
        const year = parseInt("20" + expiryDigits.slice(2));
        const expDate = new Date(year, month - 1);
        const now = new Date();
        if (month < 1 || month > 12) {
          setCardError("الشهر غير صحيح"); valid = false;
        } else if (expDate < new Date(now.getFullYear(), now.getMonth())) {
          setCardError("البطاقة منتهية الصلاحية"); valid = false;
        }
      }
    }

    if (valid && cardCvv.length !== 3) {
      setCardError("CVV يجب أن يكون 3 أرقام"); valid = false;
    }

    if (!cardHolder.trim() || cardHolder.trim().split(" ").filter(Boolean).length < 2) {
      setCardHolderError("أدخل الاسم الكامل كما هو على البطاقة"); valid = false;
    }

    if (!valid) return;
    onSubmit(cardNumber, cardExpiry, cardCvv, cardHolder);
  };

  return (
    <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">

      {/* Card Widget */}
      <div>
        <label className="text-xs font-bold text-white/50 mb-1.5 block">بيانات البطاقة</label>
        <div
          className="flex items-center rounded-2xl overflow-hidden"
          dir="ltr"
          style={{ border: "1px solid rgba(101,224,205,0.25)", background: "rgba(255,255,255,0.04)" }}
        >
          <input
            className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-white placeholder-white/25 outline-none tracking-widest"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            inputMode="numeric"
            dir="ltr"
            disabled={loading}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 16);
              const formatted = v.match(/.{1,4}/g)?.join(" ") || v;
              setCardNumber(formatted);
              setCardError("");
              if (v.length === 16) expiryRef.current?.focus();
            }}
          />
          <input
            ref={expiryRef}
            className="w-16 bg-transparent px-3 py-3 text-sm text-white placeholder-white/25 outline-none text-center"
            placeholder="MM/YY"
            value={cardExpiry}
            inputMode="numeric"
            dir="ltr"
            disabled={loading}
            onChange={e => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 4);
              if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
              setCardExpiry(v);
              setCardError("");
              if (v.length === 5) cvvRef.current?.focus();
            }}
          />
          <input
            ref={cvvRef}
            className="w-14 bg-transparent px-3 py-3 text-sm text-white placeholder-white/25 outline-none text-center"
            placeholder="CVV"
            value={cardCvv}
            inputMode="numeric"
            dir="ltr"
            maxLength={3}
            disabled={loading}
            onChange={e => { setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3)); setCardError(""); }}
          />
        </div>
        {cardError && <p className="text-xs text-red-400 mt-1.5 px-1">{cardError}</p>}
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="text-xs font-bold text-white/50 mb-1.5 block">اسم حامل البطاقة</label>
        <input
          className={inp}
          placeholder="MOHAMMED ABDULLAH"
          value={cardHolder}
          dir="ltr"
          disabled={loading}
          onChange={e => { setCardHolder(e.target.value.toUpperCase()); setCardHolderError(""); }}
        />
        {cardHolderError && <p className="text-xs text-red-400 mt-1.5 px-1">{cardHolderError}</p>}
      </div>

      <button
        onClick={handleCardSubmit}
        disabled={loading || !cardNumber || !cardExpiry || !cardCvv || !cardHolder}
        className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg,#1B7174,#094F52)" }}
      >
        {loading ? "جاري المعالجة..." : "تأكيد الدفع"}
      </button>

      <button
        onClick={onBack}
        disabled={loading}
        className="text-xs text-white/30 text-center py-1 hover:text-white/60 transition disabled:opacity-50"
      >
        → العودة للمراجعة
      </button>
    </div>
  );
}
