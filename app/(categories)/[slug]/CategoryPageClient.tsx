"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { IoGridOutline } from "react-icons/io5";
import type { Product } from "../../components/products/types";
import { slugConfigs } from "../../lib/categoryConfig";
import { sortProducts } from "../../lib/sortProducts";
import CategoryHero from "./components/CategoryHero";
import ProductsGrid from "./components/ProductsGrid";
import AnimatedBackground from "../../components/AnimatedBackground";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function filterProducts(products: Product[], slug: string): Product[] {
  const config = slugConfigs[slug];
  if (!config) return products;
  const { brand, category, nameIncludes, nameExcludes } = config.filters;
  return products.filter((p) => {
    const matchBrand = brand ? p.brand?.toLowerCase() === brand.toLowerCase() : true;
    const matchCategory = category ? p.category === category : true;
    const matchName = nameIncludes?.length
      ? nameIncludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    const matchExclude = nameExcludes?.length
      ? !nameExcludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    return matchBrand && matchCategory && matchName && matchExclude;
  });
}

export default function CategoryPageClient({ slug }: { slug: string }) {
  const config = slugConfigs[slug];
  if (!config) notFound();

  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const brand = config?.filters.brand ?? "";
    const query = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    fetch(`/api/products${query}`)
      .then((r) => r.json())
      .then((data: Product[]) => setRawProducts(sortProducts(filterProducts(data, slug))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, config?.filters.brand]);

  const label = config?.label ?? slug;
  const parentLabel = config?.parentLabel ?? "";
  const parentHref = config?.parentHref ?? "/";

  return (
    <>
    <AnimatedBackground />
    <main className="min-h-screen" dir="rtl">
      <CategoryHero
        label={label}
        parentLabel={parentLabel}
        parentHref={parentHref}
        productCount={rawProducts.length}
        loading={loading}
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5 sm:mb-7"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200/60">
              <IoGridOutline size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">جميع المنتجات</h2>
              {!loading && (
                <p className="text-[11px] text-white/50 flex items-center gap-1">
                  <span className="font-bold text-teal-400">{rawProducts.length}</span> منتج
                </p>
              )}
            </div>
          </div>


        </motion.div>

        <ProductsGrid
          products={rawProducts}
          loading={loading}
          page={page}
          onPageChange={setPage}
          emoji="📱"
          reserveMode={slug === "iphone-18"}
        />
      </div>
    </main>
    </>
  );
}
