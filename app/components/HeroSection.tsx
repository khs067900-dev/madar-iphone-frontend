"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    img: "/hero39.webp",
    badge: "🛒 أحدث الأجهزة الإلكترونية",
    title: "تقنية المستقبل",
    titleSpan: "بين يديك الآن",
    desc: "ساعات ذكية · سماعات لاسلكية · هواتف وأجهزة لوحية",
    btnHref: "/smartphones",
    btnText: "تسوق الآن",
    accentColor: "#20A5A1",
    accentRgb: "32,165,161",
    features: null,
  },
  {
    img: "/hero40.webp",
    badge: "🔥 إصدار حصري",
    title: "iPhone 17 Pro Max",
    titleSpan: "قوة لا حدود لها",
    desc: "تصميم تيتانيوم · كاميرا احترافية · أداء خارق",
    btnHref: "/smartphones/iphone-17-pro-max",
    btnText: "اكتشف الآن",
    accentColor: "#FF6B00",
    accentRgb: "255,107,0",
    features: null,
  },
  {
    img: "/hero38.webp",
    badge: "✨ الأحدث من سامسونج",
    title: "Samsung Galaxy S26 Ultra",
    titleSpan: "اكتشف مستقبل التقنية",
    desc: "200MP · Snapdragon · بطارية تدوم طويلاً · S Pen",
    btnHref: "/samsung-s26-ultra",
    btnText: "اكتشف المستقبل",
    accentColor: "#20A5A1",
    accentRgb: "32,165,161",
    features: null,
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slideTo = useCallback((index: number) => {
    if (index === current || animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(index); setAnimating(false); }, 400);
  }, [current, animating]);

  useEffect(() => {
    const t = setInterval(() => slideTo((current + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [current, slideTo]);

  const touchStart = useCallback((e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    const onEnd = (ev: TouchEvent) => {
      const diff = x - ev.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) slideTo(diff > 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length);
      document.removeEventListener("touchend", onEnd);
    };
    document.addEventListener("touchend", onEnd);
  }, [current, slideTo]);

  const s = slides[current];

  return (
    <section className="hero-section" dir="rtl" onTouchStart={touchStart} style={{ "--accent": s.accentColor, "--accent-rgb": s.accentRgb } as React.CSSProperties}>
      <div className={`hero-slide ${animating ? "fade-out" : "fade-in"}`}>
        <Image
          src={s.img}
          alt={s.title}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className={`hero-content ${animating ? "fade-out" : "fade-in"}`}>
        <span className="hero-badge">{s.badge}</span>
        <h1 className="hero-title">
          {s.title}<br />
          <span>{s.titleSpan}</span>
        </h1>
        <p className="hero-desc">{s.desc}</p>
        <div className="hero-actions">
          <Link href={s.btnHref} className="btn-primary">{s.btnText}</Link>
          <Link href="/smartphones" className="btn-outline">كل المنتجات</Link>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} onClick={() => slideTo(i)} className={`dot ${i === current ? "dot-active" : ""}`} />
        ))}
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 75vh;
          min-height: 420px;
          max-height: 600px;
          display: flex;
          align-items: center;
          overflow: hidden;
          font-family: 'Cairo', sans-serif;
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .fade-out { animation: fadeOut 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 0 6vw;
          max-width: 520px;
          margin-right: 0;
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(var(--accent-rgb), 0.18);
          border: 1px solid rgba(var(--accent-rgb), 0.5);
          color: var(--accent);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
          width: fit-content;
          backdrop-filter: blur(4px);
          transition: all 0.4s;
        }
        .hero-title {
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 900;
          color: #F5FFFF;
          line-height: 1.25;
          margin: 0;
          text-shadow: 0 2px 16px rgba(0,0,0,0.6);
        }
        .hero-title span {
          color: var(--accent);
          transition: color 0.4s;
        }
        .hero-desc {
          font-size: clamp(0.85rem, 1.3vw, 0.98rem);
          color: rgba(245,255,255,0.85);
          margin: 0;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .btn-primary {
          padding: 11px 30px;
          background: var(--accent);
          color: #000;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: filter 0.25s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(var(--accent-rgb), 0.4);
        }
        .btn-primary:hover {
          filter: brightness(0.85);
          transform: translateY(-2px);
        }
        .btn-outline {
          padding: 11px 30px;
          border: 2px solid rgba(245,255,255,0.55);
          color: #F5FFFF;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s, transform 0.2s;
          backdrop-filter: blur(4px);
        }
        .btn-outline:hover {
          border-color: var(--accent);
          background: rgba(var(--accent-rgb), 0.12);
          transform: translateY(-2px);
        }
        .hero-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: rgba(255,255,255,0.35);
          padding: 0;
          transition: all 0.3s;
        }
        .dot-active {
          width: 24px;
          border-radius: 4px;
          background: var(--accent);
        }
        @media (max-width: 768px) {
          .hero-section { height: 42vh; min-height: 260px; max-height: 340px; }
          .hero-content { margin: auto 0 5vh; padding: 0 5vw; max-width: 100%; gap: 10px; }
          .hero-title { font-size: clamp(1.3rem, 5vw, 1.8rem); }
          .hero-desc { font-size: 0.78rem; }
          .hero-badge { font-size: 0.72rem; padding: 4px 10px; }
        }
        @media (max-width: 480px) {
          .hero-section { height: 44vh; min-height: 270px; max-height: 350px; }
          .hero-title { font-size: clamp(1.1rem, 5.5vw, 1.5rem); }
          .hero-desc { font-size: 0.72rem; }
          .hero-badge { font-size: 0.68rem; }
          .hero-actions { flex-direction: column; gap: 8px; }
          .btn-primary, .btn-outline { text-align: center; padding: 9px 20px; font-size: 0.82rem; }
        }
      `}</style>
    </section>
  );
}
