"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

interface ProductDetailsProps {
  description?: string;
  specs?: Product["specs"];
  gallery?: Product["gallery"];
  specifications?: Product["specifications"];
  specGroups?: Product["specGroups"];
  sections?: Product["sections"];
  rating?: Product["rating"];
  reviews?: Product["reviews"];
}

const SPEC_LABELS: Record<string, string> = {
  screen: "الشاشة", processor: "المعالج", ram: "الرام", storage: "التخزين",
  rearCamera: "الكاميرا الخلفية", frontCamera: "الكاميرا الأمامية",
  battery: "البطارية", batteryLife: "عمر البطارية",
  charging: "الشحن", os: "نظام التشغيل", extras: "مميزات إضافية",
};

/* ─── HeroCard ──────────────────────────────────────────────── */
function HeroCard({ image, title, subtitle, aspect = "aspect-[4/3]", children }: {
  image: string; title?: string; subtitle?: string; aspect?: string; children?: React.ReactNode;
}) {
  return (
    <div className={`relative w-full ${aspect} rounded-2xl sm:rounded-3xl overflow-hidden group`}>
      <Image src={image} alt={title ?? ""} fill unoptimized
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 z-10">
        {title && <h3 className="text-sm sm:text-lg font-black text-white leading-snug drop-shadow-lg">{title}</h3>}
        {subtitle && <p className="mt-1 text-[11px] sm:text-sm text-white/70 leading-relaxed max-w-lg">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

/* ─── DesignSection ─────────────────────────────────────────── */
function DesignSection({ section }: { section: NonNullable<Product["sections"]>[0] }) {
  type ColorEntry = { name: string; colorCode: string; image: string; title: string };
  type Feature    = { id: string; label: string; title: string; image: string; colors?: ColorEntry[] };
  const features: Feature[] = (section.content as { features?: Feature[] })?.features ?? [];

  const [activeFeature, setActiveFeature] = useState(0);
  const [activeColor,   setActiveColor]   = useState(0);

  if (!features.length) return null;

  const current      = features[activeFeature];
  const colorList    = current?.colors;
  const displayImage = colorList ? colorList[activeColor]?.image : current?.image;
  const displayTitle = colorList ? colorList[activeColor]?.title : current?.title;

  return (
    <div className="space-y-4 sm:space-y-5 mt-6 sm:mt-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-teal-400 bg-teal-500/10 border border-teal-400/20 px-3 py-1 rounded-full">
          التصميم
        </span>
        <span className="text-sm sm:text-base font-black text-white">{section.title}</span>
      </div>

      {/* Pills — horizontal scroll on mobile, wrap on desktop */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-nowrap sm:flex-wrap">
        {features.map((f, i) => (
          <button
            key={f.id}
            onClick={() => { setActiveFeature(i); setActiveColor(0); }}
            className={`relative shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 border whitespace-nowrap ${
              activeFeature === i
                ? "bg-white/10 border-teal-400/40 text-teal-300"
                : "border-white/8 text-white/40 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {activeFeature === i && (
              <motion.div layoutId="design-pill-bg"
                className="absolute inset-0 rounded-xl bg-white/5"
                transition={{ duration: 0.22 }}
              />
            )}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Hero image with overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeFeature}-${activeColor}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {displayImage && (
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/8] rounded-2xl sm:rounded-3xl overflow-hidden group">
              <Image
                src={displayImage} alt={current?.label ?? ""} fill unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />

              {/* Badge top-right */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                <span className="text-[9px] sm:text-[11px] font-black tracking-widest uppercase bg-teal-400/90 text-black px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                  {current?.label}
                </span>
              </div>

              {/* Bottom overlay: text + swatches */}
              <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-6 z-10 flex flex-col gap-2 sm:gap-3">
                {displayTitle && (
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-white leading-snug drop-shadow-lg max-w-xl">
                    {displayTitle}
                  </p>
                )}
                {colorList && colorList.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {colorList.map((c, ci) => (
                      <button
                        key={c.name}
                        onClick={(e) => { e.preventDefault(); setActiveColor(ci); }}
                        title={c.name}
                        className={`rounded-full transition-all duration-300 ${
                          activeColor === ci
                            ? "w-6 h-6 sm:w-8 sm:h-8 ring-2 ring-white ring-offset-1 ring-offset-transparent shadow-lg scale-110"
                            : "w-4 h-4 sm:w-6 sm:h-6 opacity-55 hover:opacity-90 hover:scale-110"
                        }`}
                        style={{ backgroundColor: c.colorCode }}
                      />
                    ))}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activeColor}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{ duration: 0.18 }}
                        className="text-[10px] sm:text-xs text-white/55 font-medium"
                      >
                        {colorList[activeColor]?.name}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function ProductDetails({
  description, specs, gallery, specifications,
  specGroups, sections, rating, reviews,
}: ProductDetailsProps) {
  const TABS = [
    { key: "overview", label: "نظرة عامة" },
    { key: "specs",    label: "المواصفات" },
    { key: "reviews",  label: "التقييمات" },
  ];
  const [active, setActive] = useState("overview");

  const hasSpecGroups     = specGroups     && specGroups.length > 0;
  const hasSpecifications = specifications && specifications.length > 0;
  const hasLegacySpecs    = specs          && Object.values(specs).some(Boolean);

  /* design section (first active one) */
  const designSection = sections?.find((s) => s.isActive && s.type === "design");

  return (
    <div className="mt-12 sm:mt-14">

      {/* ── Tab Bar ── */}
      <div className="flex border-b border-white/10 mb-6 sm:mb-8">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActive(tab.key)}
            className={`relative px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-colors ${
              active === tab.key ? "text-teal-300" : "text-white/45 hover:text-white/70"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <motion.div layoutId="tab-bar"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
        >

          {/* ── Overview ── */}
          {active === "overview" && (
            <div className="space-y-4">
              {description && (
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">{description}</p>
              )}
              {gallery && gallery.length > 0 && (
                <div className={`grid gap-3 ${gallery.length === 1 ? "" : gallery.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                  {gallery.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <HeroCard image={item.url} title={item.caption} aspect="aspect-[4/3]" />
                    </motion.div>
                  ))}
                </div>
              )}
              {!description && (!gallery || !gallery.length) && !designSection && (
                <p className="text-xs sm:text-sm text-white/40">لا توجد نظرة عامة متاحة.</p>
              )}

              {/* Design section — only here, inside overview tab */}
              {designSection && <DesignSection section={designSection} />}
            </div>
          )}

          {/* ── Specs ── */}
          {active === "specs" && (
            <div>
              {hasSpecGroups ? (
                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  {specGroups!.map((group, gi) => (
                    <div key={gi}>
                      <div className="bg-white/6 px-4 sm:px-5 py-2.5 border-b border-white/10">
                        <h3 className="text-[11px] sm:text-xs font-black text-teal-300 uppercase tracking-wide">{group.group}</h3>
                      </div>
                      <div className="divide-y divide-white/6">
                        {group.items.map((item, ii) => (
                          <div key={ii} className={`flex items-start justify-between px-4 sm:px-5 py-2.5 sm:py-3 gap-4 ${ii % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                            <span className="text-[11px] sm:text-xs text-white/45 shrink-0">{item.key}</span>
                            <span className="text-[11px] sm:text-xs font-semibold text-white text-left leading-snug">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasSpecifications ? (
                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  {specifications!.map((group, gi) => (
                    <div key={gi}>
                      <div className="bg-white/6 px-4 sm:px-5 py-2.5 border-b border-white/10">
                        <h3 className="text-[11px] sm:text-xs font-black text-teal-300 uppercase tracking-wide">{group.groupName}</h3>
                      </div>
                      <div className="divide-y divide-white/6">
                        {group.items.map((item, ii) => (
                          <div key={ii} className={`flex items-start justify-between px-4 sm:px-5 py-2.5 sm:py-3 gap-4 ${ii % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                            <span className="text-[11px] sm:text-xs text-white/45 shrink-0">{item.label}</span>
                            <span className="text-[11px] sm:text-xs font-semibold text-white text-left">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasLegacySpecs ? (
                <div className="rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/6">
                  {Object.entries(specs!).filter(([, v]) => v).map(([key, value], ii) => (
                    <div key={key} className={`flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 gap-4 ${ii % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                      <span className="text-[11px] sm:text-xs text-white/45 shrink-0">{SPEC_LABELS[key] ?? key}</span>
                      <span className="text-[11px] sm:text-xs font-semibold text-teal-300 text-left">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-white/40">لا توجد مواصفات متاحة.</p>
              )}
            </div>
          )}

          {/* ── Reviews ── */}
          {active === "reviews" && (
            <div>
              {reviews && reviews.length > 0 ? (
                <>
                  {rating && (
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 px-3 py-1.5 rounded-full w-fit mb-5">
                      <IoStar size={13} className="text-amber-400" />
                      <span className="text-xs sm:text-sm font-bold text-amber-300">{rating.average}</span>
                      <span className="text-[10px] text-amber-400/60">({rating.count})</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {reviews.map((review, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="bg-white/4 rounded-xl border border-white/8 p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-teal-300">{review.name[0]}</span>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-white">{review.name}</span>
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-white/40">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <IoStar key={si} size={10} className={si < review.rate ? "text-amber-400" : "text-white/15"} />
                          ))}
                        </div>
                        <p className="text-[11px] sm:text-xs text-white/65 leading-relaxed">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-xs sm:text-sm text-white/40">لا توجد تقييمات بعد.</p>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
