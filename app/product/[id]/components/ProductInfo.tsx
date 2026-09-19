"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IoCartOutline,
  IoShieldCheckmark,
  IoCarOutline,
  IoRemove,
  IoAdd,
  IoFlash,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: (qty: number) => void;
  onBuyNow: (qty: number) => void;
  onVariantChange?: (images: string[]) => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart, onBuyNow, onVariantChange }: ProductInfoProps) {
  const router = useRouter();
  const { variants } = product;
  const hasVariants = variants && variants.length > 0;

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(
    hasVariants ? variants![0].defaultStorage : (product.storage ?? "")
  );
  const [qty, setQty] = useState(1);

  const activeVariant   = hasVariants ? variants![selectedColorIdx] : null;
  const storageOptions  = activeVariant?.storageOptions ?? [];
  const activeStorage   = storageOptions.find((s) => s.storage === selectedStorage) ?? storageOptions[0];

  const finalPrice    = activeStorage?.salePrice ?? activeStorage?.originalPrice ?? product.salePrice ?? product.originalPrice ?? 0;
  const originalPrice = activeStorage?.originalPrice ?? product.originalPrice ?? 0;
  const hasDiscount   = finalPrice < originalPrice;
  const savingsPct    = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  const handleColorChange = (idx: number) => {
    setSelectedColorIdx(idx);
    const variant = variants![idx];
    setSelectedStorage(variant.defaultStorage);
    onVariantChange?.(variant.images);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">

      {/* ── Name ── */}
      <div>
        {product.brand && (
          <p className="text-[10px] sm:text-xs font-bold text-white/35 uppercase tracking-widest mb-1">{product.brand}</p>
        )}
        <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
          {activeVariant ? activeVariant.name : product.name}
        </h1>
      </div>



      {/* ── Price ── */}
      <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
        <span className="text-2xl sm:text-3xl font-black text-teal-300">{fmt(finalPrice)}</span>
        <span className="text-xs sm:text-sm font-bold text-white/50">ر.س</span>
        {hasDiscount && (
          <>
            <span className="text-xs sm:text-sm text-white/35 line-through">{fmt(originalPrice)} ر.س</span>
            <span className="text-[10px] sm:text-xs font-black text-white bg-red-500 px-1.5 sm:px-2 py-0.5 rounded-md">
              -{savingsPct}%
            </span>
          </>
        )}
      </div>
      {product.taxIncluded && (
        <p className="text-[10px] text-white/40 -mt-3">شامل ضريبة القيمة المضافة</p>
      )}

      {/* ── Brief ── */}
      {product.brief && (
        <p className="text-xs sm:text-sm text-white/65 leading-relaxed border-r-2 border-teal-500/40 pr-3">
          {product.brief}
        </p>
      )}

      {/* ── Color Variants ── */}
      {hasVariants && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white/70">اللون:</span>
            <span className="text-xs font-black text-teal-300">{activeVariant?.color}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {variants!.map((v, i) => (
              <button
                key={i}
                onClick={() => handleColorChange(i)}
                title={v.color}
                className={`relative transition-all duration-300 rounded-full ${
                  selectedColorIdx === i
                    ? "w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-teal-400 ring-offset-2 ring-offset-transparent shadow-lg scale-110"
                    : "w-6 h-6 sm:w-7 sm:h-7 opacity-55 hover:opacity-90 hover:scale-110"
                }`}
                style={{ backgroundColor: v.colorCode }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Storage Options ── */}
      {storageOptions.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-white/70">السعة:</span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {storageOptions.map((opt) => (
              <button
                key={opt.storage}
                onClick={() => setSelectedStorage(opt.storage)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  selectedStorage === opt.storage
                    ? "bg-teal-500 border-teal-400 text-white shadow-sm shadow-teal-500/30"
                    : "bg-white/4 border-white/12 text-white/55 hover:border-white/30 hover:text-white/80"
                }`}
              >
                {opt.storage}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fallback static storage */}
      {!hasVariants && product.storage && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white/70">الذاكرة:</span>
          <span className="text-xs bg-white/8 text-teal-300 px-3 py-1.5 rounded-lg font-medium border border-white/10">
            {product.storage}
          </span>
        </div>
      )}

      {/* ── Delivery & Warranty pills ── */}
      <div className="flex flex-wrap gap-2">
        {product.freeDelivery && (
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60 bg-white/5 border border-white/8 px-2.5 py-1.5 rounded-full">
            <IoCarOutline size={13} className="text-teal-400 shrink-0" />
            شحن مجاني — {product.deliveryTime}
          </div>
        )}
        {product.warrantyYears > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60 bg-white/5 border border-white/8 px-2.5 py-1.5 rounded-full">
            <IoShieldCheckmark size={13} className="text-teal-400 shrink-0" />
            ضمان {product.warrantyYears} {product.warrantyYears === 1 ? "سنة" : "سنتين"}
          </div>
        )}
      </div>

      {/* ── Quantity ── */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-white/70">الكمية:</span>
        <div className="flex items-center border border-white/12 rounded-xl overflow-hidden bg-white/3">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 text-white transition"
          >
            <IoRemove size={13} />
          </button>
          <span className="w-8 sm:w-10 text-center text-sm font-black text-white">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 text-white transition"
          >
            <IoAdd size={13} />
          </button>
        </div>
      </div>

      {/* ── CTA Buttons ── */}
      <div className="flex flex-col gap-2.5 sm:gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onAddToCart(qty)}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-shadow"
        >
          <IoCartOutline size={18} />
          {addedToCart ? "تمت الإضافة ✓" : "أضف للسلة"}
        </motion.button>
        <button
          onClick={() => onBuyNow(qty)}
          className="w-full bg-white/6 text-white font-black text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl border border-white/12 hover:bg-white/10 hover:border-white/20 transition"
        >
          شراء الآن
        </button>
      </div>

      {/* ── Installment ── */}
      {product.installment?.available && (
        <div className="relative rounded-2xl overflow-hidden border border-amber-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-orange-500/8 to-transparent" />
          <div className="relative p-3 sm:p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400/15 flex items-center justify-center shrink-0">
                <IoFlash size={14} className="text-amber-300" />
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-300">تقسيط متاح</span>
              {product.installment.months && (
                <span className="mr-auto text-[10px] sm:text-xs bg-amber-400 text-black px-2 py-0.5 rounded-full font-black">
                  {product.installment.months} شهر
                </span>
              )}
            </div>

            {product.installment.downPayment && (
              <div className="bg-white/8 rounded-xl px-3 sm:px-4 py-2.5 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold text-white/70">الدفعة الأولى</span>
                <span className="text-sm sm:text-base font-black text-amber-300">
                  {fmt(product.installment.downPayment)}{" "}
                  <span className="text-[10px] font-bold text-white/50">ر.س</span>
                </span>
              </div>
            )}

            {product.installment.note && (
              <p className="text-[11px] sm:text-xs text-white/65 leading-relaxed">{product.installment.note}</p>
            )}

            {product.installment.conditions && product.installment.conditions.length > 0 && (
              <div className="space-y-1.5">
                {product.installment.conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <IoCheckmarkCircle size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-[11px] sm:text-xs text-white/70">{c}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[10px] sm:text-xs text-white/40 border-t border-white/8 pt-2.5 leading-relaxed">
              يتم تفعيل التقسيط بعد مراجعة البيانات والموافقة.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
