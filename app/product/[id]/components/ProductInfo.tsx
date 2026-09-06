"use client";

import { useState } from "react";
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
} from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: (qty: number) => void;
  onBuyNow: (qty: number) => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart, onBuyNow }: ProductInfoProps) {
  const [qty, setQty] = useState(1);

  const { name, brief, color, storage, salePrice, taxIncluded, rating, colors } = product;
  const originalPrice = product.originalPrice || product.price || 0;
  const hasDiscount = salePrice != null && salePrice > 0 && salePrice < originalPrice;
  const savingsPercent = hasDiscount ? Math.round(((originalPrice - salePrice!) / originalPrice) * 100) : 0;
  const finalPrice = hasDiscount ? salePrice! : originalPrice;

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
        {name}
      </h1>

      {/* Rating */}
      {rating && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar
                key={i}
                size={16}
                className={i < Math.round(rating.average) ? "text-amber-400" : "text-gray-200"}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-white">{rating.average}</span>
          <span className="text-xs text-white/70">({rating.count} تقييم)</span>
        </div>
      )}

      {/* Price */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-black text-teal-300">{fmt(finalPrice)}</span>
          <span className="text-xs sm:text-sm font-bold text-white/70">ر.س</span>
          {hasDiscount && (
            <>
              <span className="text-sm text-white/60 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">
                -{savingsPercent}%
              </span>
            </>
          )}
        </div>
        {taxIncluded && (
          <p className="text-[11px] text-white/60 mt-1">شامل ضريبة القيمة المضافة</p>
        )}
      </div>

      {/* Brief */}
      {brief && (
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{brief}</p>
      )}

      {/* Color */}
      {colors && colors.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white/90">اللون:</span>
          <div className="flex items-center gap-2">
            {colors.map((c, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-white/20"
                style={{ backgroundColor: c.code }}
                title={c.name}
              />
            ))}
            <span className="text-xs text-white/80">{color}</span>
          </div>
        </div>
      )}

      {/* Storage */}
      {storage && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white/90">الذاكرة:</span>
          <span className="text-xs bg-white/10 text-teal-300 px-3 py-1.5 rounded-lg font-medium border border-white/10">
            {storage}
          </span>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-white/90">الكمية:</span>
        <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 text-white transition"
          >
            <IoRemove size={14} />
          </button>
          <span className="w-10 text-center text-sm font-bold text-white">{qty}</span>
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
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart(qty)}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl transition-shadow"
        >
          <IoCartOutline size={20} />
          {addedToCart ? "تمت الإضافة ✓" : "أضف للسلة"}
        </motion.button>
        <button
          onClick={() => onBuyNow(qty)}
          className="w-full bg-white/10 text-white font-bold text-sm py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition"
        >
          شراء الآن
        </button>
      </div>

      {/* Trust Features - 3 items with dividers */}
      <div className="flex items-center justify-between divide-x divide-x-reverse divide-white/10 border border-white/10 rounded-2xl p-4 mt-1 bg-white/5">
        <div className="flex-1 flex flex-col items-center gap-1.5 px-2">
          <IoRefresh size={20} className="text-teal-400" />
          <span className="text-[10px] font-bold text-white text-center">إرجاع مجاني</span>
          <span className="text-[9px] text-white/60 text-center">خلال 14 يوم</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5 px-2">
          <IoCarOutline size={20} className="text-teal-400" />
          <span className="text-[10px] font-bold text-white text-center">شحن سريع</span>
          <span className="text-[9px] text-white/60 text-center">من 2 إلى 3 أيام عمل</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5 px-2">
          <IoShieldCheckmark size={20} className="text-teal-400" />
          <span className="text-[10px] font-bold text-white text-center">دفع آمن</span>
          <span className="text-[9px] text-white/60 text-center">ومشفر</span>
        </div>
      </div>

      {/* Installment */}
      {product.installment?.available && (
        <div className="relative rounded-2xl overflow-hidden border border-amber-400/40">
          {/* gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-600/20" />
          <div className="relative p-4">
            {/* Header */}
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

            {/* Down Payment */}
            {product.installment.downPayment && (
              <div className="bg-white/10 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white">الدفعة الأولى</span>
                <span className="text-base font-black text-amber-300">{fmt(product.installment.downPayment)} <span className="text-xs font-bold text-white">ر.س</span></span>
              </div>
            )}

            {/* Note */}
            {product.installment.note && (
              <p className="text-xs text-white leading-relaxed mb-3">{product.installment.note}</p>
            )}

            {/* Conditions */}
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

            {/* Policy */}
            <p className="text-xs text-white/80 border-t border-white/10 pt-3 mt-1 leading-relaxed">
              يتم تفعيل التقسيط بعد مراجعة البيانات والموافقة، وفي حال التأخير يحق للمتجر اتخاذ الإجراءات اللازمة.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
