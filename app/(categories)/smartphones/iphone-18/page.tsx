"use client";

import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

const ORDER_DATE = new Date("2026-09-12T00:00:00");

function getTimeLeft() {
  const diff = ORDER_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function IPhone18Page() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  const t = time ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const items = [
    { value: t.days, label: "يوم" },
    { value: t.hours, label: "ساعة" },
    { value: t.minutes, label: "دقيقة" },
    { value: t.seconds, label: "ثانية" },
  ];

  return (
    <section dir="rtl" className="relative w-full h-screen overflow-hidden flex items-center justify-center">

      {/* Background image */}
      <Image
        src="/06550573-067f-4102-8bf9-0e0c02236776.webp"
        alt="آيفون 18"
        fill
        className="object-cover object-top"
        unoptimized
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-4 sm:gap-6 px-4 w-full max-w-lg mx-auto">

        <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
          آيفون 18
        </h1>

        <p className="text-white/70 text-sm sm:text-base lg:text-lg">
          قريباً — الحجز يبدأ في 12 سبتمبر 2026
        </p>

        {/* Timer */}
        <div className="flex items-end justify-center gap-2 sm:gap-4 mt-1 w-full">
          {items.map((item, i) => (
            <Fragment key={item.label}>
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-white tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-white/50 text-[10px] sm:text-xs">{item.label}</span>
              </div>
              {i < items.length - 1 && (
                <span key={i + "sep"} className="text-white/30 text-xl sm:text-2xl font-black mb-5 sm:mb-6">:</span>
              )}
            </Fragment>
          ))}
        </div>

        <Link
          href="/smartphones"
          className="mt-2 text-white/50 text-xs sm:text-sm hover:text-white transition-colors"
        >
          ← العودة للهواتف
        </Link>

      </div>
    </section>
  );
}
