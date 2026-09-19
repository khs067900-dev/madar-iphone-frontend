"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images: rawImages, name, discountPercent = 0 }: ProductImagesProps) {
  const images = rawImages.filter((img) => {
    try { return !!img && !!new URL(img); } catch { return false; }
  });
  const [selected, setSelected] = useState(0);
  const touchStart = useRef(0);

  const goTo = (i: number) => setSelected((i + images.length) % images.length);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 lg:sticky lg:top-[72px]">
      {/* ── Main image ── */}
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/3 border border-white/8 group"
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50 && images.length > 1) goTo(selected + (diff > 0 ? 1 : -1));
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            /* aspect-[3/4] on mobile → square on desktop */
            className="relative w-full aspect-[3/4] sm:aspect-square"
          >
            <Image
              src={images[selected]}
              alt={name}
              fill
              /* scale قليل — كانت scale-150 */
              className="object-contain p-4 sm:p-6"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 z-10"
          >
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
              خصم {discountPercent}%
            </span>
          </motion.div>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 z-10 bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border border-white/15">
            {selected + 1} / {images.length}
          </div>
        )}

        {/* Prev / Next arrows — desktop only */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(selected - 1)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-base font-bold border border-white/10"
            >
              ›
            </button>
            <button
              onClick={() => goTo(selected + 1)}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-base font-bold border border-white/10"
            >
              ‹
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === selected ? "w-4 h-1.5 sm:w-5 sm:h-2 bg-teal-400" : "w-1.5 h-1.5 bg-white/35"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {images.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide px-0.5">
          {images.map((img, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.93 }}
              onClick={() => setSelected(i)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border transition-all duration-300 bg-white/3 ${
                i === selected
                  ? "border-teal-400/70 shadow-sm shadow-teal-500/20"
                  : "border-white/8 opacity-50 hover:opacity-80 hover:border-white/20"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1.5" sizes="64px" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
