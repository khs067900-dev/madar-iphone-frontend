"use client";

import { useState } from "react";
import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";
import { fmt, resolveImg } from "./types";
import type { PreOrderProduct } from "./types";

export function StepVariant({ product, onNext }: {
  product: PreOrderProduct;
  onNext: (color: string, storage: string, price: number, image: string) => void;
}) {
  const variants = product.variants ?? [];
  const [color, setColor] = useState(variants[0]?.color ?? "");
  const [storageByColor, setStorageByColor] = useState<Record<string, string>>({});

  const activeVariant = variants.find(v => v.color === color) ?? variants[0];
  const storageOpts = activeVariant?.storageOptions ?? [];
  const defaultStorage = storageOpts[0]?.storage ?? "";
  const storage = storageByColor[color] ?? defaultStorage;

  function handleColorChange(nextColor: string) { setColor(nextColor); }
  function handleStorageChange(nextStorage: string) {
    setStorageByColor(prev => ({ ...prev, [color]: nextStorage }));
  }

  const activeOpt = storageOpts.find(o => o.storage === storage) ?? storageOpts[0];
  const price = activeOpt?.salePrice ?? activeOpt?.originalPrice ?? product.price;
  const img = activeVariant?.images?.[0] ?? product.image ?? "";

  return (
    <div className="flex flex-col gap-2.5 p-2.5 sm:gap-3 sm:p-3">
      {/* Product preview */}
      <div className="flex items-center gap-2 p-2 sm:gap-2.5 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
        {img && (
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            <Image src={resolveImg(img)} alt={product.name} width={56} height={56} className="object-contain p-1 scale-[2]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs sm:text-sm text-white leading-snug truncate">{product.name}</p>
          <p className="text-[10px] sm:text-xs text-white/40 mt-0.5 truncate">{color} · {storage}</p>
        </div>
        <div className="text-left shrink-0 pl-1">
          <p className="text-base sm:text-lg font-black text-[#65E0CD] leading-none">{fmt(price)}</p>
          <p className="text-[9px] sm:text-[10px] text-white/40 mt-0.5 text-center">ر.س</p>
        </div>
      </div>

      {/* Color */}
      {variants.length > 0 && (
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-white/50 mb-1.5">
            اللون — <span className="text-white/80">{color}</span>
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {variants.map(v => (
              <button
                key={v.color}
                onClick={() => handleColorChange(v.color)}
                title={v.color}
                className="relative rounded-full transition-all"
                style={{
                  width: 26, height: 26,
                  backgroundColor: v.colorCode,
                  boxShadow: color === v.color
                    ? "0 0 0 2px #051e1f, 0 0 0 3.5px #65E0CD"
                    : "0 1px 3px rgba(0,0,0,0.4)",
                  transform: color === v.color ? "scale(1.12)" : "scale(1)",
                }}
              >
                {color === v.color && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <IoCheckmarkCircle size={11} className="text-white drop-shadow" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage */}
      {storageOpts.length > 0 && (
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-white/50 mb-1.5">السعة</p>
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
            {storageOpts.map(opt => {
              const p = opt.salePrice ?? opt.originalPrice;
              const active = storage === opt.storage;
              return (
                <button
                  key={opt.storage}
                  onClick={() => handleStorageChange(opt.storage)}
                  className="flex flex-col items-center px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: active ? "#65E0CD" : "rgba(255,255,255,0.1)",
                    background: active ? "rgba(101,224,205,0.1)" : "rgba(255,255,255,0.03)",
                    color: active ? "#65E0CD" : "rgba(255,255,255,0.6)",
                  }}
                >
                  <span className="text-[10px] sm:text-xs font-bold">{opt.storage}</span>
                  <span className="text-[9px] sm:text-[10px] font-semibold mt-0.5" style={{ color: active ? "#65E0CD" : "rgba(255,255,255,0.3)" }}>
                    {fmt(p)} ر.س
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => onNext(color, storage, price, resolveImg(img))}
        className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-white text-xs sm:text-sm mt-0.5"
        style={{ background: "linear-gradient(135deg,#1B7174,#094F52)" }}
      >
        التالي — بياناتك الشخصية
      </button>
    </div>
  );
}
