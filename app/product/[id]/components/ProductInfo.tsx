"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoCartOutline,
  IoShieldCheckmark,
  IoCarOutline,
  IoRefresh,
  IoStar,
  IoRemove,
  IoAdd,
  IoFlash,
  IoCheckmarkCircle,
  IoCalendarOutline,
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
  onPreOrder?: () => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart, onBuyNow, onVariantChange, onPreOrder }: ProductInfoProps) {
  const router = useRouter();
  const isIphone18 = product.category === "ابل ايفون 18";
  const { variants } = product;
  const hasVariants = variants && variants.length > 0;

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(
    hasVariants ? variants![0].defaultStorage : (product.storage ?? "")
  );
  const [qty, setQty] = useState(1);

  const activeVariant = hasVariants ? variants![selectedColorIdx] : null;
  const storageOptions = activeVariant?.storageOptions ?? [];
  const activeStorage = storageOptions.find((s) => s.storage === selectedStorage) ?? storageOptions[0];

  const finalPrice = activeStorage?.salePrice ?? activeStorage?.originalPrice ?? product.salePrice ?? product.originalPrice ?? 0;
  const originalPrice = activeStorage?.originalPrice ?? product.originalPrice ?? 0;
  const hasDiscount = finalPrice < originalPrice;
  const savingsPercent = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  const handleColorChange = (idx: number) => {
    setSelectedColorIdx(idx);
    const variant = variants![idx];
    setSelectedStorage(variant.defaultStorage);
    onVariantChange?.(variant.images);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
        {activeVariant ? activeVariant.name : product.name}
      </h1>

      {/* Rating */}
      {product.rating && !isIphone18 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar
                key={i}
                size={16}
                className={i < Math.round(product.rating!.average) ? "text-amber-400" : "text-gray-200"}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-white">{product.rating.average}</span>
          <span className="text-xs text-white/70">({product.rating.count} تقييم)</span>
        </div>
      )}

      {/* Price */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-3xl font-black text-teal-300">{fmt(finalPrice)}</span>
          <span className="text-sm font-bold text-white/70">ر.س</span>
          {hasDiscount && (
            <>
              <span className="text-sm text-white/60 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">
                -{savingsPercent}%
              </span>
            </>
          )}
        </div>
        {product.taxIncluded && (
          <p className="text-[11px] text-white/60 mt-1">شامل ضريبة القيمة المضافة</p>
        )}
      </div>

      {/* Brief */}
      {product.brief && (
        <p className="text-sm sm:text-sm text-white/80 leading-relaxed">{product.brief}</p>
      )}

      {/* Color Variants */}
      {hasVariants && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white/90">اللون:</span>
            <span className="text-sm text-teal-300 font-bold">{activeVariant?.color}</span>
          </div>
          <div className="flex items-center gap-3">
            {variants!.map((v, i) => (
              <button
                key={i}
                onClick={() => handleColorChange(i)}
                title={v.color}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColorIdx === i
                    ? "border-teal-400 scale-110"
                    : "border-white/20 hover:border-white/50"
                }`}
                style={{ backgroundColor: v.colorCode }}
              >
                {selectedColorIdx === i && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-teal-400 ring-offset-2 ring-offset-transparent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage Options */}
      {storageOptions.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-bold text-white/90">السعة:</span>
          <div className="flex flex-wrap gap-2">
            {storageOptions.map((opt) => (
              <button
                key={opt.storage}
                onClick={() => setSelectedStorage(opt.storage)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  selectedStorage === opt.storage
                    ? "bg-teal-500 border-teal-400 text-white"
                    : "bg-white/5 border-white/20 text-white/70 hover:border-white/50"
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
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white/90">الذاكرة:</span>
          <span className="text-xs bg-white/10 text-teal-300 px-3 py-1.5 rounded-lg font-medium border border-white/10">
            {product.storage}
          </span>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-white/90">الكمية:</span>
        <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 text-white transition"
          >
            <IoRemove size={14} />
          </button>
          <span className="w-10 text-center text-base font-bold text-white">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 text-white transition"
          >
            <IoAdd size={14} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        {isIphone18 && onPreOrder ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onPreOrder}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl transition-shadow"
          >
            <IoCalendarOutline size={20} />
            احجز الآن
          </motion.button>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddToCart(qty)}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl transition-shadow"
            >
              <IoCartOutline size={20} />
              {addedToCart ? "تمت الإضافة ✓" : "أضف للسلة"}
            </motion.button>
            <button
              onClick={() => onBuyNow(qty)}
              className="w-full bg-white/10 text-white font-bold text-base py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition"
            >
              شراء الآن
            </button>
          </>
        )}
      </div>



      {/* Installment */}
      {product.installment?.available && (
        <div className="relative rounded-2xl overflow-hidden border border-amber-400/40">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-600/20" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center">
                <IoFlash size={16} className="text-amber-300" />
              </div>
              <span className="text-sm font-black text-amber-300">تقسيط متاح</span>
              {product.installment.months && (
                <span className="mr-auto text-[11px] bg-amber-400 text-black px-2.5 py-0.5 rounded-full font-black">
                  {product.installment.months} شهر
                </span>
              )}
            </div>
            {product.installment.downPayment && (
              <div className="bg-white/10 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white">الدفعة الأولى</span>
                <span className="text-base font-black text-amber-300">{fmt(product.installment.downPayment)} <span className="text-xs font-bold text-white">ر.س</span></span>
              </div>
            )}
            {product.installment.note && (
              <p className="text-xs text-white leading-relaxed mb-3">{product.installment.note}</p>
            )}
            {product.installment.conditions && product.installment.conditions.length > 0 && (
              <div className="space-y-2 mb-3">
                {product.installment.conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <IoCheckmarkCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-white">{c}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-white/80 border-t border-white/10 pt-3 mt-1 leading-relaxed">
              يتم تفعيل التقسيط بعد مراجعة البيانات والموافقة، وفي حال التأخير يحق للمتجر اتخاذ الإجراءات اللازمة.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

