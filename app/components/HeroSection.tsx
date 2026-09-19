"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Flame, Sparkles, Clock, Package, CreditCard, MapPin, Star } from "lucide-react";


type Feature = { icon: React.ReactNode; text: string };

type Slide = {
  img: string;
  badgeIcon: React.ReactNode;
  badge: string;
  title: string;
  titleSpan: string;
  desc: string;
  btnHref: string;
  btnText: string;
  accentColor: string;
  accentRgb: string;
  features: Feature[] | null;
  singleBtn?: boolean;
};

const slides: Slide[] = [
  /* hidden slides
  {
    img: "/hero39.webp",
    badgeIcon: <ShoppingBag size={13} />,
    badge: "أحدث الأجهزة الإلكترونية",
    title: "تقنية المستقبل",
    titleSpan: "بين يديك الآن",
    desc: "ساعات ذكية · سماعات لاسلكية · هواتف وأجهزة لوحية",
    btnHref: "/smartphones",
    btnText: "تسوق الآن",
    accentColor: "#65E0CD",
    accentRgb: "101,224,205",
    features: null,
  },
  {
    img: "/hero40.webp",
    badgeIcon: <Flame size={13} />,
    badge: "إصدار حصري",
    title: "iPhone 17 Pro Max",
    titleSpan: "قوة لا حدود لها",
    desc: "تصميم تيتانيوم · كاميرا احترافية · أداء خارق",
    btnHref: "/smartphones/iphone-17-pro-max",
    btnText: "اكتشف الآن",
    accentColor: "#65E0CD",
    accentRgb: "101,224,205",
    features: null,
  },
  {
    img: "/hero38.webp",
    badgeIcon: <Star size={13} />,
    badge: "الأحدث من سامسونج",
    title: "Samsung Galaxy S26 Ultra",
    titleSpan: "اكتشف مستقبل التقنية",
    desc: "200MP · Snapdragon · بطارية تدوم طويلاً · S Pen",
    btnHref: "/samsung-s26-ultra",
    btnText: "اكتشف المستقبل",
    accentColor: "#65E0CD",
    accentRgb: "101,224,205",
    features: null,
  },
  */
  {
    img: "https://res.cloudinary.com/bzwltpqf/image/upload/v1789126696/deec23e7-4e69-4b8f-8b56-8900ec23bba0.webp",
    badgeIcon: <MapPin size={13} />,
    badge: "متوفر الآن في المملكة 🇸🇦",
    title: "iPhone 18 Pro Max",
    titleSpan: "وصل أخيراً — اطلب الآن",
    desc: "الجيل الجديد من Apple متوفر الآن · توصيل خلال 24 ساعة · ضمان سنتين · أولوية للطلبات الأولى",
    btnHref: "/smartphones/iphone-18-pro-max",
    btnText: "اطلب الآن ←",
    accentColor: "#65E0CD",
    accentRgb: "101,224,205",
    features: null,
    singleBtn: true,
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
    <>
    <section className="hero-section" dir="rtl" onTouchStart={touchStart} style={{ "--accent": s.accentColor, "--accent-rgb": s.accentRgb } as React.CSSProperties}>
      <div className={`hero-slide ${animating ? "fade-out" : "fade-in"}`}>
        <Image src={s.img} alt={s.title} fill priority style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="hero-overlay" />
      </div>

      <div className={`hero-content ${animating ? "fade-out" : "fade-in"}`}>
        <span className="hero-badge">
          <span className="badge-icon">{s.badgeIcon}</span>
          {s.badge}
        </span>
        <h1 className="hero-title">
          {s.title}<br />
          <span>{s.titleSpan}</span>
        </h1>
        <p className="hero-desc">{s.desc}</p>
        {s.features && (
          <div className="hero-features">
            {s.features.map((f, i) => (
              <div key={i} className="feat-item">
                <div className="feat-icon-wrap">{f.icon}</div>
                <span>{f.text}</span>
                {i < s.features!.length - 1 && <div className="feat-divider" />}
              </div>
            ))}
          </div>
        )}
        <div className="hero-actions">
          {s.singleBtn ? (
            <Link href={s.btnHref} className="btn-primary">
              {s.btnText}
            </Link>
          ) : (
            <>
              <Link href={s.btnHref} className="btn-primary">{s.btnText}</Link>
              <Link href="/smartphones" className="btn-outline">كل المنتجات</Link>
            </>
          )}
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
          min-height: 520px;
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
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(100deg, rgba(0,0,0,0.72) 0%, rgba(5,30,31,0.55) 55%, rgba(9,79,82,0.18) 100%);
          z-index: 1;
        }
        .fade-in { animation: fadeIn 0.45s ease forwards; }
        .fade-out { animation: fadeOut 0.45s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 52px 6vw;
          max-width: 560px;
          margin-right: 0;
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(101,224,205,0.12);
          border: 1px solid rgba(101,224,205,0.35);
          color: #65E0CD;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
          width: fit-content;
          backdrop-filter: blur(6px);
          letter-spacing: 0.3px;
        }
        .badge-icon {
          display: flex;
          align-items: center;
          color: #65E0CD;
        }
        .hero-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.2;
          margin: 0;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        .hero-title span {
          color: #65E0CD;
          display: block;
        }
        .hero-desc {
          font-size: clamp(1rem, 1.6vw, 1.18rem);
          color: rgba(255,255,255,0.88);
          margin: 0;
          line-height: 1.9;
          text-shadow: 0 1px 8px rgba(0,0,0,0.4);
          max-width: 460px;
          font-weight: 500;
        }
        .hero-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .feat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.83rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, rgba(9,79,82,0.45) 0%, rgba(0,0,0,0.3) 100%);
          border: 1px solid rgba(101,224,205,0.25);
          border-radius: 12px;
          padding: 10px 14px;
          backdrop-filter: blur(12px);
          transition: border-color 0.2s, background 0.2s;
        }
        .feat-item:hover {
          border-color: rgba(101,224,205,0.55);
          background: linear-gradient(135deg, rgba(9,79,82,0.65) 0%, rgba(0,0,0,0.35) 100%);
        }
        .feat-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(101,224,205,0.25), rgba(101,224,205,0.08));
          border: 1px solid rgba(101,224,205,0.3);
          color: #65E0CD;
          flex-shrink: 0;
          box-shadow: 0 0 10px rgba(101,224,205,0.15);
        }
        .feat-divider { display: none; }
        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .btn-primary {
          padding: 12px 32px;
          background: linear-gradient(135deg, #1B7174 0%, #094F52 100%);
          color: #fff;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: filter 0.25s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(9,79,82,0.5);
          border: 1px solid rgba(101,224,205,0.25);
        }
        .btn-primary:hover {
          filter: brightness(1.15);
          transform: translateY(-2px);
          box-shadow: 0 6px 26px rgba(9,79,82,0.65);
        }
        .btn-outline {
          padding: 12px 32px;
          border: 1.5px solid rgba(101,224,205,0.4);
          color: #65E0CD;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s, transform 0.2s;
          backdrop-filter: blur(4px);
        }
        .btn-outline:hover {
          border-color: #65E0CD;
          background: rgba(101,224,205,0.1);
          transform: translateY(-2px);
        }
        .hero-dots {
          position: absolute;
          bottom: 22px;
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
          background: rgba(255,255,255,0.3);
          padding: 0;
          transition: all 0.3s;
        }
        .dot-active {
          width: 26px;
          border-radius: 4px;
          background: #65E0CD;
        }
        @media (max-width: 768px) {
          .hero-section { min-height: 420px; }
          .hero-content { padding: 40px 5vw; max-width: 100%; gap: 12px; }
          .hero-title { font-size: clamp(1.5rem, 5.5vw, 2rem); }
          .hero-desc { font-size: 1rem; }
          .hero-features { gap: 0; padding: 10px 12px; }
          .feat-item { font-size: 0.72rem; gap: 5px; }
          .feat-divider { margin: 0 10px; }
        }
        @media (max-width: 480px) {
          .hero-section { min-height: 380px; }
          .hero-content { padding: 32px 5vw; gap: 10px; }
          .hero-title { font-size: clamp(1.3rem, 6vw, 1.7rem); }
          .hero-desc { font-size: 0.95rem; }
          .hero-badge { font-size: 0.7rem; padding: 5px 10px; }
          .hero-features { flex-wrap: wrap; gap: 8px; padding: 10px 12px; }
          .feat-divider { display: none; }
          .hero-actions { flex-direction: column; gap: 8px; }
          .btn-primary, .btn-outline { text-align: center; padding: 10px 20px; font-size: 0.84rem; }
        }
      `}</style>
    </section>

    </>
  );
}
