"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoExpand } from "react-icons/io5";

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
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const touchStart = useRef(0);

  const goTo = (i: number) => setSelected((i + images.length) % images.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-[80px]">
      {/* Main Image */}
      <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-200 group">
        {discountPercent > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute z-10 top-4 right-4"
          >
            <span className="bg-[#0D202E] text-white text-xs font-bold px-3 py-1.5 rounded-full">
              خصم {discountPercent}%
            </span>
          </motion.div>
        )}

        {images.length > 1 && (
          <div className="absolute z-10 top-4 left-4 bg-black/40 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/10">
            {selected + 1} / {images.length}
          </div>
        )}

        <div
          className="relative aspect-[4/3] sm:aspect-square cursor-zoom-in"
          onClick={() => setZoomed(!zoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomed(false)}
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50 && images.length > 1) goTo(selected + (diff > 0 ? 1 : -1));
          }}
        >
          <AnimatePresence mode="wait">
            {images.length > 0 && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[selected]}
                  alt={name}
                  fill
                  className="object-contain p-6 sm:p-10 transition-transform duration-500"
                  style={zoomed ? { transform: "scale(2)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 right-4 items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white/70 px-3 py-1.5 rounded-xl text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
            <IoExpand size={13} />
            اضغط للتكبير
          </div>
        </div>

        {/* Mobile dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelected(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === selected ? "w-5 h-2 bg-teal-400" : "w-2 h-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-1">
          {images.map((img, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(i)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 ${
                i === selected
                  ? "ring-2 ring-teal-400 ring-offset-2 ring-offset-transparent bg-white shadow-md"
                  : "ring-1 ring-gray-200 opacity-60 hover:opacity-100 bg-white"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-2" sizes="80px" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
