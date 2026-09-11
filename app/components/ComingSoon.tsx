"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DEFAULT_SLIDES = [
  "/06550573-067f-4102-8bf9-0e0c02236776.webp",
  "/df3a0f08-fb1c-4b40-863c-58f8f562805d.webp",
  "/e5ae006f-b733-41d4-9e48-69994eeacbe4.webp",
];

interface Props {
  modelName: string;
  reservationDate: string; // ISO string — passed from server
  slides?: string[];
  reservationLabel?: string; // e.g. "12 سبتمبر 2026"
  availabilityLabel?: string; // e.g. "أكتوبر 2026"
}

function useCountdown(target: Date, onExpire: () => void) {
  const calledRef = useRef(false);
  const [time, setTime] = useState(() => calcDiff(target));

  useEffect(() => {
    const id = setInterval(() => {
      const diff = calcDiff(target);
      setTime(diff);
      if (diff.total <= 0 && !calledRef.current) {
        calledRef.current = true;
        onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return time;
}

function calcDiff(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    total: diff,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function ComingSoon({
  modelName,
  reservationDate,
  slides,
  reservationLabel,
  availabilityLabel,
}: Props) {
  const router = useRouter();
  const images = slides?.length ? slides : DEFAULT_SLIDES;
  const target = new Date(reservationDate);

  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const countdown = useCountdown(target, () => router.refresh());

  // Auto-slide every 4.5s
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % images.length);
        setFading(false);
      }, 600);
    }, 4500);
    return () => clearInterval(id);
  }, [images.length]);

  function goTo(i: number) {
    if (i === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(i);
      setFading(false);
    }, 600);
  }

  const units = [
    { v: countdown.days, l: "يوم" },
    { v: countdown.hours, l: "ساعة" },
    { v: countdown.minutes, l: "دقيقة" },
    { v: countdown.seconds, l: "ثانية" },
  ];

  return (
    <section
      dir="rtl"
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background slides */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? (fading ? 0 : 1) : 0 }}
        >
          <Image
            src={src}
            alt={modelName}
            fill
            className="object-cover object-top"
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5 sm:gap-7 px-4 w-full max-w-xl mx-auto py-16">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-teal-400"
            style={{ boxShadow: "0 0 8px #2dd4bf" }}
          />
          قريباً
        </div>

        {/* Model name */}
        <h1
          className="font-black text-white leading-tight"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
        >
          {modelName}
        </h1>

        <p className="text-white/50 font-medium" style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)" }}>
          انتظرونا قريباً
        </p>

        {/* Countdown */}
        <div className="flex items-end justify-center gap-2 sm:gap-3 w-full">
          {units.map((u, i) => (
            <div key={u.l} className="flex items-end gap-2 sm:gap-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex items-center justify-center rounded-xl sm:rounded-2xl"
                  style={{
                    width: "clamp(52px, 14vw, 80px)",
                    height: "clamp(52px, 14vw, 80px)",
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="font-black text-white tabular-nums"
                    style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)" }}
                  >
                    {String(u.v).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-white/40 font-medium" style={{ fontSize: "clamp(0.55rem, 1.5vw, 0.7rem)" }}>
                  {u.l}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="text-white/25 font-black mb-6 text-lg sm:text-xl">:</span>
              )}
            </div>
          ))}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <div
            className="flex flex-col gap-1 p-3 sm:p-4 rounded-2xl text-right"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="text-teal-400 font-bold" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", letterSpacing: "0.06em" }}>
              فتح باب الحجز
            </span>
            <span className="text-white font-black" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
              {reservationLabel ?? "15 سبتمبر 2026"}
            </span>
          </div>
          <div
            className="flex flex-col gap-1 p-3 sm:p-4 rounded-2xl text-right"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="text-teal-400 font-bold" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", letterSpacing: "0.06em" }}>
              موعد التوفير
            </span>
            <span className="text-white font-black" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
              {availabilityLabel ?? "قريباً"}
            </span>
          </div>
        </div>

        {/* Slide dots */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 mt-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`الشريحة ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background: i === current ? "#2dd4bf" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
