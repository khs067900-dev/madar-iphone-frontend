"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// ─── تاريخ الإطلاق — غيّره هنا ───────────────────────────────────────────────
const LAUNCH_DATE = new Date("2026-09-12T10:00:00+03:00");
// ─────────────────────────────────────────────────────────────────────────────

const POPUP_KEY = "popup_shown";

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }, [target]);
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
}

// ─── CTA handler ─────────────────────────────────────────────────────────────
function handleCTA() {
  window.location.href = "/smartphones/iphone-18";
}
// ─────────────────────────────────────────────────────────────────────────────

export default function IPhone18Popup() {
  const [open, setOpen] = useState(false);
  const { d, h, m, s } = useCountdown(LAUNCH_DATE);

  useEffect(() => {
    if (sessionStorage.getItem(POPUP_KEY)) return;
    const t = setTimeout(() => {
      sessionStorage.setItem(POPUP_KEY, "1");
      setOpen(true);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  const units = [
    { v: d, l: "يوم" },
    { v: h, l: "ساعة" },
    { v: m, l: "دقيقة" },
    { v: s, l: "ثانية" },
  ];

  return (
    <>
      <div className="pp-overlay" onClick={() => setOpen(false)} />

      <div className="pp-modal" role="dialog" aria-modal="true" dir="rtl">

        {/* ══ قسم الصورة العلوي ══ */}
        <div className="pp-img-section">
          <Image
            src="/df3a0f08-fb1c-4b40-863c-58f8f562805d.webp"
            alt="iPhone 18"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          {/* تدرج سفلي يذوّب الصورة في الخلفية */}
          <div className="pp-img-fade" />
          {/* شارة الإصدار الحصري فوق الصورة */}
          <div className="pp-badge-wrap">
            <span className="pp-live-dot" />
            <span className="pp-badge-text">إصدار حصري · المملكة العربية السعودية</span>
          </div>
        </div>

        {/* ══ زر الإغلاق ══ */}
        <button className="pp-close" onClick={() => setOpen(false)} aria-label="إغلاق">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {/* ══ قسم المحتوى السفلي ══ */}
        <div className="pp-body">

          {/* العنوان الرئيسي */}
          <div className="pp-heading">
            <p className="pp-gen-label">الجيل القادم من آبل</p>
            <h2 className="pp-title">iPhone 18</h2>
            <p className="pp-tagline">مستقبل التقنية · يصل إلى المملكة</p>
          </div>

          {/* فاصل مضيء */}
          <div className="pp-glow-line" />

          {/* بطاقة التقسيط */}
          <div className="pp-offer-card">
            <div className="pp-offer-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#65E0CD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="pp-offer-text">
              <p className="pp-offer-title">متوفر بالتقسيط بنفس سعر الكاش</p>
              <p className="pp-offer-sub">لا فوائد · لا رسوم خفية · أقساط مريحة حتى 24 شهر</p>
            </div>
          </div>

          {/* فاصل */}
          <div className="pp-divider" />

          {/* Countdown */}
          <div className="pp-countdown-section">
            <p className="pp-countdown-label">
              <span className="pp-countdown-dot" />
              الإطلاق الرسمي بعد
            </p>
            <div className="pp-timer">
              {units.map(({ v, l }, i) => (
                <div key={l} className="pp-timer-item">
                  <div className="pp-unit">
                    <span className="pp-num">{String(v).padStart(2, "0")}</span>
                    <span className="pp-unit-lbl">{l}</span>
                  </div>
                  {i < 3 && <span className="pp-colon">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="pp-cta" onClick={handleCTA}>
            <span>سجّل اهتمامك الآن</span>
            <span className="pp-cta-arrow">←</span>
          </button>

          <p className="pp-footnote">سيتم التواصل معك فور بدء الطلب المسبق</p>

        </div>
      </div>

      <style>{`
        /* ══ Overlay ══ */
        .pp-overlay {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          animation: ppFade .3s ease both;
        }
        @keyframes ppFade { from{opacity:0} to{opacity:1} }

        /* ══ Modal ══ */
        .pp-modal {
          position: fixed;
          z-index: 9999;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(460px, calc(100vw - 20px));
          max-height: calc(100vh - 24px);
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 28px;
          background: #07141a;
          border: 1px solid rgba(101,224,205,0.13);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 50px 120px rgba(0,0,0,0.85),
            0 0 100px rgba(101,224,205,0.07);
          animation: ppRise .45s cubic-bezier(.22,1,.36,1) both;
          scrollbar-width: none;
        }
        .pp-modal::-webkit-scrollbar { display: none; }
        @keyframes ppRise {
          from { opacity:0; transform:translate(-50%, calc(-50% + 32px)) scale(.96); }
          to   { opacity:1; transform:translate(-50%, -50%) scale(1); }
        }

        /* ══ قسم الصورة ══ */
        .pp-img-section {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          border-radius: 28px 28px 0 0;
          flex-shrink: 0;
        }
        .pp-img-fade {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7,20,26,0.15) 0%,
            rgba(7,20,26,0.1) 40%,
            rgba(7,20,26,0.7) 75%,
            rgba(7,20,26,1) 100%
          );
          z-index: 1;
        }

        /* شارة الإصدار */
        .pp-badge-wrap {
          position: absolute;
          top: 14px; right: 14px;
          z-index: 2;
          display: flex; align-items: center; gap: 6px;
          background: rgba(7,20,26,0.65);
          border: 1px solid rgba(101,224,205,0.25);
          border-radius: 20px;
          padding: 5px 12px;
          backdrop-filter: blur(8px);
        }
        .pp-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #65E0CD;
          box-shadow: 0 0 8px #65E0CD;
          animation: livePulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes livePulse {
          0%,100% { box-shadow: 0 0 6px #65E0CD; }
          50%      { box-shadow: 0 0 14px #65E0CD, 0 0 28px rgba(101,224,205,.4); }
        }
        .pp-badge-text {
          font-size: 0.65rem; font-weight: 700;
          color: rgba(101,224,205,.9);
          letter-spacing: .06em;
          white-space: nowrap;
        }

        /* ══ زر الإغلاق ══ */
        .pp-close {
          position: absolute; top: 14px; left: 14px; z-index: 10;
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(0,0,0,.45);
          border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.55);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .2s, color .2s, border-color .2s;
          backdrop-filter: blur(6px);
        }
        .pp-close:hover {
          background: rgba(101,224,205,.15);
          border-color: rgba(101,224,205,.4);
          color: #65E0CD;
        }

        /* ══ Body ══ */
        .pp-body {
          padding: 4px 26px 26px;
          display: flex; flex-direction: column; gap: 0;
        }

        /* العنوان */
        .pp-heading { margin-bottom: 16px; }
        .pp-gen-label {
          font-size: .68rem; font-weight: 600;
          color: rgba(255,255,255,.35);
          letter-spacing: .08em; text-transform: uppercase;
          margin: 0 0 4px;
        }
        .pp-title {
          font-size: clamp(2.8rem, 10vw, 3.8rem);
          font-weight: 900; margin: 0; line-height: .95;
          letter-spacing: -.03em;
          background: linear-gradient(125deg, #fff 25%, #b8f0ea 65%, #65E0CD 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 24px rgba(101,224,205,.2));
        }
        .pp-tagline {
          font-size: .75rem; font-weight: 500;
          color: rgba(255,255,255,.38);
          margin: 6px 0 0;
          letter-spacing: .04em;
        }

        /* فاصل مضيء */
        .pp-glow-line {
          height: 1px; margin-bottom: 16px;
          background: linear-gradient(90deg, rgba(101,224,205,.25) 0%, rgba(101,224,205,.08) 60%, transparent 100%);
          position: relative;
        }
        .pp-glow-line::before {
          content: "";
          position: absolute; top: -1px; right: 0;
          width: 40px; height: 3px; border-radius: 2px;
          background: #65E0CD;
          box-shadow: 0 0 12px #65E0CD;
        }

        /* بطاقة التقسيط */
        .pp-offer-card {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(101,224,205,.05);
          border: 1px solid rgba(101,224,205,.14);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 14px;
        }
        .pp-offer-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(101,224,205,.1);
          border: 1px solid rgba(101,224,205,.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-offer-text { flex: 1; }
        .pp-offer-title {
          font-size: .85rem; font-weight: 800;
          color: rgba(255,255,255,.92); margin: 0 0 4px;
        }
        .pp-offer-sub {
          font-size: .7rem; font-weight: 500;
          color: rgba(101,224,205,.65); margin: 0;
          line-height: 1.5;
        }

        /* فاصل */
        .pp-divider {
          height: 1px; margin-bottom: 16px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
        }

        /* Countdown */
        .pp-countdown-section { margin-bottom: 20px; }
        .pp-countdown-label {
          display: flex; align-items: center; gap: 7px;
          font-size: .65rem; font-weight: 700;
          color: rgba(255,255,255,.35);
          letter-spacing: .1em; text-transform: uppercase;
          margin: 0 0 12px;
        }
        .pp-countdown-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(101,224,205,.5);
          flex-shrink: 0;
        }
        .pp-timer {
          display: flex; align-items: center; gap: 6px;
        }
        .pp-timer-item {
          display: flex; align-items: center; gap: 6px; flex: 1;
        }
        .pp-unit {
          flex: 1;
          display: flex; flex-direction: column; align-items: center;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(101,224,205,.12);
          border-radius: 12px;
          padding: 11px 4px 9px;
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 16px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.03) inset;
          transition: border-color .3s, background .3s;
        }
        .pp-unit:hover {
          background: rgba(101,224,205,.06);
          border-color: rgba(101,224,205,.22);
        }
        .pp-num {
          font-size: clamp(1.5rem, 5vw, 2rem);
          font-weight: 900; color: #fff; line-height: 1;
          font-variant-numeric: tabular-nums;
          letter-spacing: -.02em;
        }
        .pp-unit-lbl {
          font-size: .58rem; font-weight: 700;
          color: rgba(101,224,205,.55);
          margin-top: 5px; letter-spacing: .03em;
        }
        .pp-colon {
          font-size: 1.5rem; font-weight: 800;
          color: rgba(101,224,205,.2);
          line-height: 1; margin-bottom: 18px;
          flex-shrink: 0;
        }

        /* CTA */
        .pp-cta {
          width: 100%; padding: 15px 20px;
          background: linear-gradient(135deg, #1ec8c2 0%, #15a09b 50%, #0e7a76 100%);
          color: #fff; font-size: .95rem; font-weight: 800;
          border: none; border-radius: 14px; cursor: pointer;
          letter-spacing: .03em;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 8px 30px rgba(30,200,194,.38), 0 0 0 1px rgba(255,255,255,.1) inset;
          transition: transform .18s, box-shadow .18s, filter .18s;
          position: relative; overflow: hidden;
          margin-bottom: 10px;
        }
        .pp-cta::before {
          content: "";
          position: absolute; top: 0; right: 0;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.08));
          pointer-events: none;
        }
        .pp-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(30,200,194,.5), 0 0 0 1px rgba(255,255,255,.12) inset;
          filter: brightness(1.07);
        }
        .pp-cta:active { transform: translateY(0); }
        .pp-cta-arrow {
          font-size: 1.1rem; line-height: 1;
          transition: transform .2s;
        }
        .pp-cta:hover .pp-cta-arrow { transform: translateX(-3px); }

        /* Footnote */
        .pp-footnote {
          text-align: center;
          font-size: .65rem; font-weight: 500;
          color: rgba(255,255,255,.22);
          margin: 0; letter-spacing: .02em;
        }

        /* ══ Responsive ══ */
        @media (max-width: 480px) {
          .pp-modal { border-radius: 22px; }
          .pp-img-section { height: 185px; }
          .pp-body { padding: 4px 18px 20px; }
          .pp-title { font-size: 2.5rem; }
          .pp-num { font-size: 1.4rem; }
          .pp-unit { padding: 9px 2px 7px; border-radius: 10px; }
          .pp-colon { font-size: 1.2rem; }
          .pp-cta { padding: 13px 16px; font-size: .88rem; }
        }
        @media (max-height: 680px) {
          .pp-img-section { height: 160px; }
          .pp-body { gap: 0; }
        }
      `}</style>
    </>
  );
}
