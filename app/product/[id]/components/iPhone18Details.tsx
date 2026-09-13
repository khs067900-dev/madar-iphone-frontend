"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SpecGroup {
  group: string;
  items: { key: string; value: string }[];
}

interface Section {
  type: string;
  title: string;
  subtitle?: string;
  content: Record<string, unknown>;
  media?: { type: string; url: string; alt: string; sortOrder: number }[];
  isActive: boolean;
}

interface iPhone18DetailsProps {
  specGroups?: SpecGroup[];
  sections?: Section[];
  description?: string;
}

const TABS = [
  { key: "overview", label: "نظرة عامة" },
  { key: "specs", label: "المواصفات" },
];

/* ─── helpers ─── */
function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

/* ─── Section renderers ─── */

function DesignSection({ section }: { section: Section }) {
  const features = asArray<Record<string, unknown>>(
    asObj(section.content).features
  );
  const [active, setActive] = useState(0);

  const feat = features[active];
  if (!feat) return null;

  // colors feature
  const colors = asArray<Record<string, unknown>>(feat.colors);
  const [activeColor, setActiveColor] = useState(0);
  const displayImage =
    colors.length > 0
      ? asString(colors[activeColor]?.image)
      : asString(feat.image);
  const displayTitle =
    colors.length > 0
      ? asString(colors[activeColor]?.title)
      : asString(feat.title);

  return (
    <div className="space-y-6">
      {/* Feature tabs */}
      <div className="flex flex-wrap gap-2">
        {features.map((f, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              active === i
                ? "bg-teal-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {asString(f.label)}
          </button>
        ))}
      </div>

      {/* Feature content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {displayImage && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-white/5">
              <Image
                src={displayImage}
                alt={displayTitle}
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          )}

          {colors.length > 0 && (
            <div className="flex items-center gap-3">
              {colors.map((c, ci) => (
                <button
                  key={ci}
                  onClick={() => setActiveColor(ci)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    activeColor === ci
                      ? "border-teal-400 scale-110"
                      : "border-white/20"
                  }`}
                  style={{ backgroundColor: asString(c.colorCode) }}
                  title={asString(c.name)}
                />
              ))}
            </div>
          )}

          <p className="text-sm text-white/80 leading-relaxed">{displayTitle}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CameraSection({ section }: { section: Section }) {
  const content = asObj(section.content);
  const hero = asObj(content.hero);
  const stats = asArray<Record<string, unknown>>(hero.stats);
  const zoomLevels = asArray<Record<string, unknown>>(content.zoomLevels);
  const zoomFooter = asObj(content.zoomFooter);
  const lensesCard = asObj(content.lensesCard);
  const lenses = asArray<Record<string, unknown>>(lensesCard.lenses);
  const proPhotos = asArray<Record<string, unknown>>(
    asObj(content.proPhotos).items
  );
  const video = asObj(content.video);
  const proVideoItems = asArray<Record<string, unknown>>(
    asObj(content.proVideo).items
  );

  const [activeZoom, setActiveZoom] = useState(0);

  return (
    <div className="space-y-10">
      {/* Hero */}
      {asString(hero.image) && (
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden">
          <Image
            src={asString(hero.image)}
            alt={section.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {stats.length > 0 && (
            <div className="absolute bottom-6 right-6 left-6 flex gap-6">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-teal-300">
                    {asString(s.value)}
                  </p>
                  <p className="text-xs text-white/80">{asString(s.label)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-white/80 leading-relaxed">
        {asString(hero.description)}
      </p>

      {/* Zoom levels */}
      {zoomLevels.length > 0 && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {zoomLevels.map((z, i) => (
              <button
                key={i}
                onClick={() => setActiveZoom(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeZoom === i
                    ? "bg-teal-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {asString(z.label)}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeZoom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden"
            >
              <Image
                src={asString(zoomLevels[activeZoom]?.image)}
                alt={asString(zoomLevels[activeZoom]?.label)}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
          {asString(zoomFooter.text) && (
            <p className="text-xs text-white/60 leading-relaxed">
              {asString(zoomFooter.text)}
            </p>
          )}
        </div>
      )}

      {/* Lenses */}
      {lenses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-teal-300">العدسات</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lenses.map((l, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2"
              >
                <p className="text-xs font-black text-white">{asString(l.name)}</p>
                <p className="text-[11px] text-teal-300 font-bold">
                  {asString(l.model)}
                </p>
                {asArray<string>(l.specs).map((s, si) => (
                  <p key={si} className="text-[11px] text-white/60">
                    {s}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Photos */}
      {proPhotos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-teal-300">
            {asString(asObj(content.proPhotos).title)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {proPhotos.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="relative h-36 rounded-xl overflow-hidden">
                  <Image
                    src={asString(p.image)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <p className="text-[10px] text-white/60 leading-relaxed line-clamp-3">
                  {asString(p.label)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video */}
      {asString(video.image) && (
        <div className="space-y-3">
          <h3 className="text-sm font-black text-teal-300">
            {asString(video.title)}
          </h3>
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden">
            <Image
              src={asString(video.image)}
              alt={asString(video.title)}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-4 right-4 left-4 text-xs text-white/80 leading-relaxed">
              {asString(video.description)}
            </p>
          </div>
        </div>
      )}

      {/* Pro Video items */}
      {proVideoItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {proVideoItems.map((p, i) => (
            <div key={i} className="space-y-2">
              <div className="relative h-36 rounded-xl overflow-hidden">
                <Image
                  src={asString(p.image)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed line-clamp-3">
                {asString(p.label)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PerformanceSection({ section }: { section: Section }) {
  const content = asObj(section.content);
  const chips = asArray<Record<string, unknown>>(content.chips);
  const mediaUrl = asString(section.media?.[0]?.url);

  return (
    <div className="space-y-6">
      {mediaUrl && (
        <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden">
          <Image src={mediaUrl} alt={section.title} fill className="object-cover" sizes="100vw" />
        </div>
      )}
      <p className="text-sm text-white/80 leading-relaxed">
        {asString(content.description)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chips.map((c, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5"
          >
            <p className="text-xs font-black text-teal-300">{asString(c.name)}</p>
            <p className="text-[11px] text-white/70 leading-relaxed">
              {asString(c.description)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BatterySection({ section }: { section: Section }) {
  const content = asObj(section.content);
  const stats = asArray<Record<string, unknown>>(content.stats);
  const mediaUrl = asString(section.media?.[0]?.url);

  return (
    <div className="space-y-6">
      {mediaUrl && (
        <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden">
          <Image src={mediaUrl} alt={section.title} fill className="object-cover" sizes="100vw" />
        </div>
      )}
      <p className="text-sm text-white/80 leading-relaxed">
        {asString(content.description)}
      </p>
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-1"
            >
              <p className="text-2xl font-black text-teal-300">
                {asString(s.value)}
              </p>
              <p className="text-[11px] font-bold text-white/80">
                {asString(s.unit)}
              </p>
              <p className="text-[10px] text-white/50 leading-relaxed">
                {asString(s.label)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-black text-white">{section.title}</h3>
        {section.subtitle && (
          <p className="text-xs text-teal-300 mt-0.5">{section.subtitle}</p>
        )}
      </div>
      {section.type === "design" && <DesignSection section={section} />}
      {section.type === "camera" && <CameraSection section={section} />}
      {section.type === "performance" && <PerformanceSection section={section} />}
      {section.type === "battery" && <BatterySection section={section} />}
    </div>
  );
}

/* ─── Main Component ─── */
export default function IPhone18Details({
  specGroups,
  sections,
  description,
}: iPhone18DetailsProps) {
  const [active, setActive] = useState("overview");
  const activeSections = sections?.filter((s) => s.isActive) ?? [];

  return (
    <div className="mt-14">
      {/* Tab Bar */}
      <div className="flex border-b border-white/20 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative px-5 py-3 text-sm font-bold transition-colors ${
              active === tab.key ? "text-teal-300" : "text-white hover:text-teal-200"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <motion.div
                layoutId="tab-indicator-18"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* Overview */}
          {active === "overview" && (
            <div className="space-y-12">
              {description && (
                <p className="text-sm text-white/80 leading-relaxed">{description}</p>
              )}
              {activeSections.map((sec, i) => (
                <SectionRenderer key={i} section={sec} />
              ))}
            </div>
          )}

          {/* Specs */}
          {active === "specs" && (
            <div className="space-y-4">
              {specGroups && specGroups.length > 0 ? (
                <div className="rounded-2xl border border-white/10 overflow-hidden">
                  {specGroups.map((group, gi) => (
                    <div key={gi}>
                      <div className="bg-white/10 px-5 py-3 border-b border-white/10">
                        <h3 className="text-sm font-bold text-teal-300">{group.group}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2">
                        {group.items.map((item, ii) => (
                          <div
                            key={ii}
                            className={`flex items-center justify-between px-5 py-3.5 border-b border-white/10 ${
                              ii % 2 === 0 ? "sm:border-l" : ""
                            }`}
                          >
                            <span className="text-xs text-white/70">{item.key}</span>
                            <span className="text-xs font-semibold text-teal-300">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/60">لا توجد مواصفات متاحة.</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
