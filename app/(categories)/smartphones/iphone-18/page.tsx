"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Zap } from "lucide-react";
import AnimatedBackground from "../../../components/AnimatedBackground";

/* ─── بيانات الموديلات ──────────────────────────────────────── */
const models = [
  {
    label: "آيفون 18 برو ماكس",
    tagline: "الأقوى على الإطلاق",
    screen: "6.9 بوصة",
    chip: "A20 Pro",
    camera: "48MP × 3",
    battery: "45 ساعة",
    colors: ["#800020", "#DCE6F0", "#E8E8E8", "#1a1a1a"],
    storages: ["256GB", "512GB", "1TB", "2TB"],
    startPrice: 6299,
    image:
      "https://res.cloudinary.com/bzwltpqf/image/upload/v1789095298/34ab662e-de1b-4359-9d99-43e2ba54678f_1.webp",
    href: "/smartphones/iphone-18-pro-max",
    badge: "الأفضل مبيعاً",
    badgeClass: "bg-yellow-400 text-black",
    accentFrom: "from-yellow-500/20",
    accentTo: "to-amber-500/10",
    borderHover: "hover:border-yellow-400/40",
    btnFrom: "from-yellow-400",
    btnTo: "to-amber-400",
  },
  {
    label: "آيفون 18 برو",
    tagline: "أداء استثنائي",
    screen: "6.3 بوصة",
    chip: "A20 Pro",
    camera: "48MP × 3",
    battery: "33 ساعة",
    colors: ["#800020", "#DCE6F0", "#E8E8E8", "#1a1a1a"],
    storages: ["256GB", "512GB", "1TB"],
    startPrice: 5299,
    image:
      "https://res.cloudinary.com/bzwltpqf/image/upload/v1789095297/96bef8db-6a7f-4361-b75b-330d54685d37_1.webp",
    href: "/smartphones/iphone-18-pro",
    badge: "الأكثر طلباً",
    badgeClass: "bg-teal-400 text-black",
    accentFrom: "from-teal-500/20",
    accentTo: "to-cyan-500/10",
    borderHover: "hover:border-teal-400/40",
    btnFrom: "from-teal-400",
    btnTo: "to-cyan-400",
  },
  {
    label: "آيفون 18",
    tagline: "تجربة آبل الكاملة",
    screen: "6.1 بوصة",
    chip: "A18",
    camera: "48MP + 12MP",
    battery: "22 ساعة",
    colors: ["#DCE6F0", "#E8E8E8", "#1a1a1a", "#d4a0a0"],
    storages: ["128GB", "256GB", "512GB"],
    startPrice: 3899,
    image:
      "https://res.cloudinary.com/bzwltpqf/image/upload/v1789095830/background-removed.webp",
    href: "/smartphones/iphone-18-standard",
    badge: "الأوفر",
    badgeClass: "bg-cyan-400 text-black",
    accentFrom: "from-cyan-500/20",
    accentTo: "to-blue-500/10",
    borderHover: "hover:border-cyan-400/40",
    btnFrom: "from-cyan-400",
    btnTo: "to-blue-400",
  },
];

/* ─── بطاقة مواصفة صغيرة ───────────────────────────────────── */
function SpecPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 border border-white/8">
      <span className="text-teal-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] sm:text-[10px] text-white/40 leading-none">{label}</p>
        <p className="text-[10px] sm:text-[11px] text-white font-bold leading-tight mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── بطاقة الموديل ─────────────────────────────────────────── */
function ModelCard({ m, i }: { m: (typeof models)[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
      className="group"
    >
      <Link
        href={m.href}
        className={`relative flex items-end overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 ${m.borderHover} transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 h-[220px] sm:h-[280px] lg:h-[320px]`}
      >
        {/* الصورة خلفية */}
        <Image
          src={m.image}
          alt={m.label}
          fill
          className="object-cover object-center scale-[1.05] group-hover:scale-[1.12] transition-transform duration-700"
          unoptimized
        />

        {/* تدرج سفلي فوق الصورة */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* الكلام فوق التدرج */}
        <div className="relative z-10 w-full flex items-center justify-between gap-3 px-4 sm:px-5 pb-4 sm:pb-5">
          <h2 className="text-white font-black text-sm sm:text-base lg:text-xl leading-tight">
            {m.label}
          </h2>

          <div
            className={`shrink-0 flex items-center gap-1.5 bg-gradient-to-l ${m.btnFrom} ${m.btnTo} text-black text-[11px] sm:text-xs font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.04]`}
          >
            تسوق الآن
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── الصفحة الرئيسية ───────────────────────────────────────── */
export default function IPhone18LandingPage() {
  return (
    <>
      <AnimatedBackground />
      <main dir="rtl" className="min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-12 pb-12 sm:pb-16">

          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-white/40 mb-6 sm:mb-10"
          >
            <Link href="/" className="hover:text-white/70 transition-colors">الرئيسية</Link>
            <ChevronLeft size={10} className="sm:hidden" />
            <ChevronLeft size={12} className="hidden sm:block" />
            <Link href="/smartphones" className="hover:text-white/70 transition-colors">الهواتف الذكية</Link>
            <ChevronLeft size={10} className="sm:hidden" />
            <ChevronLeft size={12} className="hidden sm:block" />
            <span className="text-white/70">آيفون 18</span>
          </motion.nav>

          {/* Hero */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-400/20 text-teal-300 text-[9px] sm:text-[11px] font-bold tracking-widest uppercase px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-5"
            >
              <Zap size={11} className="sm:hidden" />
              <Zap size={13} className="hidden sm:block" />
              سلسلة آيفون 18 — الجيل الجديد
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-tight"
            >
              آيفون 18
              <span className="block mt-1 sm:mt-2 bg-gradient-to-l from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                اختر موديلك
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 sm:mt-5 text-white/50 text-xs sm:text-sm lg:text-base max-w-lg mx-auto leading-relaxed px-2"
            >
              معالج A20 Pro، كاميرا 48MP بفتحة عدسة متغيرة، بطارية تدوم أطول — ثلاثة موديلات لكل احتياج
            </motion.p>
          </div>

          {/* بطاقات الموديلات */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {models.map((m, i) => (
              <ModelCard key={m.href} m={m} i={i} />
            ))}
          </div>



        </div>
      </main>
    </>
  );
}
