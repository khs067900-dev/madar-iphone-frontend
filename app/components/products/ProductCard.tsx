"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCartOutline,
  IoCheckmarkCircle,
  IoFlash,
  IoCarOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { name, discountPercent = 0, brand, color, storage, inStock, installment, freeDelivery, warrantyYears } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice || product.price || 0;
  const salePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : undefined;
  const hasDiscount = salePrice != null && salePrice < originalPrice;
  const displayPrice = hasDiscount ? salePrice : originalPrice;
  const savings = hasDiscount ? originalPrice - salePrice : 0;

  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (added) return;
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setAdded(false);
      window.scrollTo(0, 0);
      router.push("/cart");
    }, 1100);
  };

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5 text-sm font-bold"
          >
            <IoCheckmarkCircle size={20} />
            تمت إضافة المنتج للسلة
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative h-full"
      >
        <Link
          href={`/product/${product._id}`}
          className="group relative flex flex-col h-full bg-black/40 backdrop-blur-md rounded-[22px] overflow-hidden card-shadow"
          dir="rtl"
        >

          {/* ══ IMAGE ZONE ══ */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>

            {/* White background */}
            <div className="absolute inset-0 bg-white" />

            {/* Top badges row */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-start justify-between p-2.5">
              {/* Discount */}
              {discountPercent > 0 ? (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                  className="flex items-center gap-0.5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-black px-2 py-1 rounded-xl shadow-lg shadow-red-500/35 leading-none"
                >
                  <IoFlash size={8} />
                  {discountPercent}%
                </motion.div>
              ) : <div />}

              {/* Stock */}
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-bold border leading-none backdrop-blur-md ${
                inStock
                  ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-red-900/60 text-red-300 border-red-500/40 shadow-sm"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${inStock ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                {inStock ? "متوفر" : "نفذ"}
              </div>
            </div>

            {/* Installment badge bottom */}
            {installment?.available && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-xl text-[9px] font-black leading-none shadow-md shadow-amber-500/30"
              >
                <IoFlash size={8} />
                تقسيط
              </motion.div>
            )}

            {/* Product image */}
            {resolvedImage ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={resolvedImage}
                  alt={name}
                  fill
                  className="object-contain p-4 sm:p-6"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl text-gray-200">📱</div>
            )}
          </div>

          {/* ══ CONTENT ZONE ══ */}
          <div className="flex flex-col flex-1 px-3.5 pt-3 pb-3.5 gap-2.5">

            {/* Brand row */}
            <div className="flex items-center gap-1.5">
              {brand && (
                <span className="text-[9px] font-black text-teal-300 bg-teal-900/50 border border-teal-500/40 px-1.5 py-0.5 rounded-lg uppercase tracking-wider leading-none">
                  {brand}
                </span>
              )}
              {storage && (
                <span className="text-[9px] font-semibold text-gray-300 bg-white/10 px-1.5 py-0.5 rounded-lg leading-none">
                  {storage}
                </span>
              )}
              {color && (
                <span className="text-[9px] font-semibold text-gray-300 bg-white/10 px-1.5 py-0.5 rounded-lg leading-none">
                  {color}
                </span>
              )}
            </div>

            {/* Product name */}
            <h3 className="text-[13px] sm:text-[14px] font-bold text-white leading-[1.5] line-clamp-2 flex-1">
              {name}
            </h3>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/10 via-white/20 to-transparent" />

            {/* Price + savings */}
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                {hasDiscount && (
                  <span className="text-[11px] text-gray-400 line-through leading-none text-gray-500">
                    {fmt(originalPrice)} ر.س
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-[18px] sm:text-[26px] font-black text-white leading-none tracking-tight">
                    {fmt(displayPrice!)}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-gray-400 mb-0.5 text-teal-300/70">ر.س</span>
                </div>
              </div>

              {hasDiscount && savings > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="shrink-0 text-center"
                >
                  <div className="text-[9px] text-gray-400 leading-none mb-0.5">وفّرت</div>
                  <div className="text-[11px] font-black text-red-400 bg-red-900/40 border border-red-500/40 px-2 py-0.5 rounded-lg leading-none whitespace-nowrap">
                    {fmt(savings)} ر.س
                  </div>
                </motion.div>
              )}
            </div>

            {/* Trust badges */}
            {(warrantyYears > 0 || freeDelivery) && (
              <div className="flex items-center gap-1.5 -mt-0.5">
                {warrantyYears > 0 && (
                  <span className="flex items-center gap-0.5 text-[8px] font-bold text-violet-300 bg-violet-900/40 border border-violet-500/40 px-1.5 py-0.5 rounded-lg leading-none">
                    <IoShieldCheckmarkOutline size={8} className="shrink-0" />
                    ضمان {warrantyYears} سنة
                  </span>
                )}
                {freeDelivery && (
                  <span className="flex items-center gap-0.5 text-[8px] font-bold text-emerald-300 bg-emerald-900/40 border border-emerald-500/40 px-1.5 py-0.5 rounded-lg leading-none">
                    <IoCarOutline size={8} className="shrink-0" />
                    توصيل مجاني
                  </span>
                )}
              </div>
            )}

            {/* Cart button */}
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.97 }}
              className={`cart-btn ${added ? "added" : ""}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2"
                  >
                    <IoCheckmarkCircle size={16} />
                    تمت الإضافة
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2"
                  >
                    <IoCartOutline size={16} />
                    أضف للسلة
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

          </div>
        </Link>
      </motion.div>
    </>
  );
}
