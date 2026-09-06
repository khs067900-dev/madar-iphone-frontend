"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import ContactSection from "../components/ContactSection";

const C1 = "#053132", C2 = "#092C32", C4 = "#0A2931", C5 = "#0B2631";
const TEAL = "#2dd4bf", TEAL_DIM = "rgba(45,212,191,0.15)", TEAL_MID = "rgba(45,212,191,0.25)";

function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const IconMada = () => <Image src="/mada975b.png" alt="مدى" width={72} height={44} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />;
const IconVisa = () => <Image src="/cc975b.png" alt="بطاقات ائتمان" width={72} height={44} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />;

const IconInstallment = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="8" width="36" height="32" rx="4"/><path d="M16 24h16M16 30h10"/><path d="M24 8v4M16 8v4M32 8v4"/>
    <circle cx="34" cy="30" r="5" fill={TEAL} fillOpacity=".2" stroke={TEAL}/><path d="M32 30l1.5 1.5L35 28.5" strokeWidth="1.5"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 4l16 6v12c0 9-7 17-16 20C8 39 1 31 1 22V10l16-6z" fill={TEAL} fillOpacity=".15"/><path d="M17 24l5 5 9-10"/>
  </svg>
);
const IconCurrency = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="18"/><path d="M24 10v28M18 16h9a5 5 0 010 10h-9v-10zM18 26h10a5 5 0 010 10h-10"/>
  </svg>
);
const IconShipping = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="28" height="20" rx="2"/><path d="M30 20h8l6 8v6h-14V20z"/>
    <circle cx="12" cy="36" r="4"/><circle cx="36" cy="36" r="4"/><path d="M2 22h28"/>
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="18"/><line x1="24" y1="16" x2="24" y2="16" strokeWidth="3"/><line x1="24" y1="22" x2="24" y2="34"/>
  </svg>
);

const paymentMethods = [
  { title: "بطاقة مدى",         desc: "ادفع بسهولة عبر بطاقة مدى المحلية.",                         imgBg: true,  Icon: IconMada },
  { title: "بطاقات الائتمان",  desc: "نقبل فيزا وماستركارد وجميع البطاقات الائتمانية.",             imgBg: true,  Icon: IconVisa },
  { title: "الأقساط",           desc: "اشتري الآن وادفع على دفعات شهرية مريحة بدون فوائد.",         imgBg: false, Icon: IconInstallment },
];

const sections = [
  { title: "الدفع المعتمد",     Icon: IconShield,   content: ["يتم توفير طرق دفع متعددة وآمنة تناسب احتياجات العملاء."] },
  { title: "العملة المستخدمة", Icon: IconCurrency, content: ["العملة الرسمية المستخدمة في جميع المعاملات هي الريال السعودي (SAR)."] },
  { title: "التحويل والشحن",   Icon: IconShipping, content: ["يتم تنسيق الشحن بعد تأكيد الطلب حسب بيانات العميل."] },
  { title: "ملاحظة هامة",      Icon: IconInfo,     content: ["نحرص في مؤسسة مدار الاجهزة الالكترونية على توفير تجربة دفع واضحة وآمنة.", "بعد إتمام الطلب سيتم مراجعة البيانات والتواصل مع العميل عند الحاجة لتأكيد التفاصيل أو استكمال إجراءات الطلب."] },
];

interface Company { phone?: string; whatsapp?: string; email?: string; [k: string]: string | undefined; }

export default function PaymentClient({ company }: { company: Company }) {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t); }, []);

  const anim = (delay: number) => ({
    style: {
      opacity: heroVisible ? 1 : 0,
      transform: heroVisible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f9fc] overflow-x-hidden" dir="rtl">

      {/* ══ HERO ══ */}
      <section className="relative w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${C1} 0%, ${C2} 40%, ${C4} 75%, ${C5} 100%)` }}>
        {/* decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[80px]" style={{ background: "rgba(45,212,191,0.08)" }} />
          <div className="absolute top-10 left-10 w-48 h-48 rounded-full blur-[60px]" style={{ background: "rgba(45,212,191,0.06)" }} />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-32 -translate-x-1/2 blur-[50px]" style={{ background: "rgba(45,212,191,0.05)" }} />
        </div>
        {/* grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${TEAL} 1px,transparent 1px),linear-gradient(90deg,${TEAL} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />

        <div className="relative w-full px-4 sm:px-10 lg:px-20 py-14 sm:py-24 lg:py-32 text-center">
          <div {...anim(100)} className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium mb-5 border" style={{ background: TEAL_DIM, borderColor: TEAL_MID, color: TEAL }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
            مؤسسة مدار الاجهزة الالكترونية
          </div>
          <h1 {...anim(220)} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-white">
            تعرف على وسائل الدفع
            <span className="block" style={{ color: TEAL }}>المتاحة</span>
          </h1>
          <p {...anim(360)} className="text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-2" style={{ color: "rgba(167,243,208,0.75)" }}>
            طرق دفع متعددة وآمنة تناسب احتياجات عملائنا داخل مؤسسة مدار الاجهزة الالكترونية
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 70" className="w-full h-8 sm:h-14" preserveAspectRatio="none">
            <path d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" fill="#f8f9fc" />
          </svg>
        </div>
      </section>

      {/* ══ PAYMENT METHODS ══ */}
      <section className="w-full px-3 sm:px-8 lg:px-20 pt-6 sm:pt-10 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-5xl mx-auto">
          {paymentMethods.map((m, i) => (
            <FadeUp key={m.title} delay={i * 90}>
              <div className="group relative rounded-2xl border p-4 sm:p-6 text-center overflow-hidden hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center"
                style={{ background: "white", borderColor: TEAL_DIM, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
                {/* top accent */}
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)` }} />
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 ${
                  m.imgBg ? "bg-white/10 border p-2 sm:p-3" : ""
                }`} style={m.imgBg ? { borderColor: TEAL_DIM } : { background: TEAL_DIM }}>
                  <m.Icon />
                </div>
                <p className="text-sm sm:text-base font-extrabold mb-1 leading-snug text-gray-800">{m.title}</p>
                <p className="text-[11px] sm:text-xs leading-relaxed text-gray-500">{m.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ INFO SECTIONS ══ */}
      <section className="w-full px-3 sm:px-8 lg:px-20 py-6 sm:py-10 max-w-6xl mx-auto space-y-4">
        {sections.map((s, i) => (
          <FadeUp key={s.title} delay={i * 100}>
            <div className="group rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "white", borderColor: TEAL_DIM, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1 w-full h-1 sm:h-auto shrink-0" style={{ background: `linear-gradient(180deg, ${TEAL}, rgba(45,212,191,0.3))` }} />
                <div className="flex-1 p-4 sm:p-7 lg:p-9">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ background: TEAL_DIM, border: `1px solid ${TEAL_MID}` }}>
                      <s.Icon />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-gray-800">{s.title}</h2>
                      <div className="h-0.5 w-8 sm:w-10 mt-1 rounded-full" style={{ background: `linear-gradient(90deg, ${TEAL}, transparent)` }} />
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {s.content.map((p, j) => (
                      <p key={j} className="leading-relaxed sm:leading-loose text-xs sm:text-sm lg:text-base text-gray-600">{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}

        <ContactSection
          title="التواصل بخصوص الدفع"
          phone={company.phone}
          whatsapp={company.whatsapp}
          email={company.email}
          fadeDelay={300}
        />
      </section>

      <div className="h-10 sm:h-16" />
    </main>
  );
}
