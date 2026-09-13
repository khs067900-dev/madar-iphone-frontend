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
    <div className="flex flex-col gap-3 lg:sticky lg:top-[80px]">
      {/* Hero Image with overlay */}
      <div
        className="relative rounded-3xl overflow-hidden group"
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50 && images.length > 1) goTo(selected + (diff > 0 ? 1 : -1));
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45 }}
            className="relative w-full aspect-[3/4] sm:aspect-square"
          >
            <Image
              src={images[selected]}
              alt={name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-4 right-4 z-10"
          >
            <span className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
              خصم {discountPercent}%
            </span>
          </motion.div>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold border border-white/20">
            {selected + 1} / {images.length}
          </div>
        )}

        {/* Product name on image */}
        <div className="absolute bottom-0 right-0 left-0 z-10 p-5">
          <p className="text-white font-black text-base sm:text-lg leading-snug drop-shadow-lg line-clamp-2">
            {name}
          </p>
        </div>

        {/* Prev/Next arrows on desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(selected - 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-lg font-bold"
            >
              ›
            </button>
            <button
              onClick={() => goTo(selected + 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-lg font-bold"
            >
              ‹
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === selected ? "w-5 h-2 bg-teal-400" : "w-2 h-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1">
          {images.map((img, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.93 }}
              onClick={() => setSelected(i)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 ${
                i === selected
                  ? "ring-2 ring-teal-400 ring-offset-1 ring-offset-transparent"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              {i === selected && <div className="absolute inset-0 bg-teal-400/10" />}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
