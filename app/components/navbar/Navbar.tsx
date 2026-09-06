"use client";

import { useState, useEffect, useSyncExternalStore, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./data";
import { SearchIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { useCartStore } from "../../store/cartStore";
import { useCompanyStore } from "../../store/companyStore";

const announcements = [
  "💳 متاح تقسيط على جميع المنتجات",
  "🎉 دفعة أولى فقط 1000 ريال وقسّط الباقي",
  "🚚 شحن مجاني للطلبات أعلى من 1000 ريال",
  "⭐ أقساط بدون فوائد حتى 24 شهر",
  "🛡️ ضمان رسمي على جميع الأجهزة",
];

function RotatingAnnouncements() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="text-white font-semibold text-center leading-tight relative h-5 overflow-hidden flex items-center justify-center min-w-0 flex-1">
      <span key={index} className="animate-fade-in-out text-[10px] sm:text-xs truncate max-w-full px-1">
        {announcements[index]}
      </span>
    </span>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ _id: string; name: string; images?: string[]; image?: string; salePrice?: number; originalPrice?: number; price?: number }[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const { logo, nameAr, fetchCompany } = useCompanyStore();

  useEffect(() => { fetchCompany(); }, [fetchCompany]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktop = searchWrapRef.current?.contains(target);
      const inMobile = mobileSearchRef.current?.contains(target);
      if (!inDesktop && !inMobile) { setSearchOpen(false); setResults([]); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } finally { setSearching(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchResults]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""}`} dir="rtl">

      {/* ── Row 1: Top bar ── */}
      <div className="border-b border-[#082C39]" style={{ background: 'linear-gradient(135deg, #000000, #082C39, #126066)' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 h-9 flex items-center justify-between text-xs gap-1 sm:gap-3">

          {/* Right: WhatsApp */}
          <a
            href="https://wa.me/966592014922"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 text-green-300 font-bold hover:text-green-200 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.868.936-3.42-.235-.372A9.818 9.818 0 1 1 12 21.818z"/>
            </svg>
            <span className="hidden sm:inline">+966 59 201 4922</span>
          </a>

          {/* Center: rotating announcements */}
          <RotatingAnnouncements />

          {/* Left: location */}
          <span className="flex items-center gap-1 sm:gap-1.5 text-gray-200 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
            <span className="text-[10px] sm:text-xs">السعودية</span>
          </span>

        </div>
      </div>

      {/* ── Row 2: Logo + Search + Icons ── */}
      <div className="border-b border-[#126066]/20" style={{ background: '#F5FFFF' }}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">

          {/* Right: Hamburger + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              aria-label="القائمة"
              className="lg:hidden p-2 rounded-xl text-[#082C39] hover:text-[#126066] hover:bg-[#126066]/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Link href="/" className="flex items-center leading-none group">
              {logo ? (
                <Image
                  src={logo}
                  alt={nameAr || "logo"}
                  width={180}
                  height={72}
                  className="object-contain h-9 w-auto lg:h-14"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-[28px] font-black text-[#082C39] group-hover:text-[#20A5A1] transition-colors tracking-tight">
                    {nameAr || "مدار"}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">للأجهزة الإلكترونية</span>
                </div>
              )}
            </Link>
          </div>

          {/* Left: Search + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Desktop Search */}
            <div ref={searchWrapRef} className="hidden sm:block relative w-48 md:w-64 lg:w-80">
              <div className="flex items-center rounded-2xl border-2 border-[#126066]/30 bg-white focus-within:border-[#20A5A1] transition-all duration-200 overflow-hidden">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="ابحث..."
                  className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-transparent outline-none text-[#082C39] placeholder-[#126066]/50"
                />
                {searching ? (
                  <div className="px-3"><div className="w-4 h-4 border-2 border-[#126066] border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                  <button
                    aria-label="بحث"
                    onClick={() => fetchResults(searchQuery)}
                    className="m-1.5 px-3 py-2 bg-[#126066] hover:bg-[#20A5A1] text-white rounded-xl transition-colors flex items-center gap-1 text-sm font-semibold shrink-0"
                  >
                    <SearchIcon />
                    <span className="hidden lg:inline">بحث</span>
                  </button>
                )}
              </div>
              {searchOpen && results.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {results.map((p) => {
                    const img = p.images?.[0] || p.image;
                    const price = p.salePrice ?? p.originalPrice ?? p.price ?? 0;
                    return (
                      <li key={p._id}>
                        <Link
                          href={`/product/${p._id}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); setResults([]); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          {img && (
                            <Image
                              src={img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${img.startsWith("/") ? img : "/" + img}`}
                              alt={p.name} width={44} height={44}
                              className="object-contain rounded-xl border border-gray-100 bg-white shrink-0" unoptimized
                            />
                          )}
                          <span className="flex-1 text-sm text-gray-800 line-clamp-1 font-medium">{p.name}</span>
                          <span className="text-sm font-bold text-gray-900 shrink-0">{price.toLocaleString("en-US")} ج.م</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              {searchOpen && !searching && searchQuery.trim() && results.length === 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-8">
                  <p className="text-center text-sm text-gray-400">لا توجد نتائج لـ &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>

            {/* Mobile search icon */}
            <button
              aria-label="بحث"
              className="sm:hidden p-2 text-[#082C39] hover:text-[#20A5A1] transition-colors shrink-0"
              onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchInputRef.current?.focus(), 50); }}
            >
              <SearchIcon />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="السلة"
              className="relative flex flex-col items-center gap-0.5 p-2 text-[#082C39] hover:text-[#20A5A1] transition-colors shrink-0 group"
            >
              <div className="relative">
                <CartIcon />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-[#20A5A1] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-0.5">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[10px] font-medium">السلة</span>
            </Link>

          </div>

        </div>
      </div>

      {/* ── Mobile search bar (expands below header on small screens) ── */}
      <div className={`sm:hidden border-b border-[#126066]/20 transition-all duration-200 overflow-hidden ${searchOpen ? "max-h-24" : "max-h-0"}`} style={{ background: '#F5FFFF' }}>
        <div ref={mobileSearchRef} className="px-4 py-2 relative">
          <div className="flex items-center rounded-2xl border-2 border-[#126066]/30 bg-white focus-within:border-[#20A5A1] transition-all duration-200 overflow-hidden">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="ابحث عن منتج..."
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-[#082C39] placeholder-[#126066]/50"
            />
            {searching ? (
              <div className="px-3"><div className="w-4 h-4 border-2 border-[#126066] border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <button
                aria-label="بحث"
                onClick={() => fetchResults(searchQuery)}
                className="m-1.5 px-3 py-2 bg-[#126066] hover:bg-[#20A5A1] text-white rounded-xl transition-colors flex items-center gap-1 text-sm font-semibold shrink-0"
              >
                <SearchIcon />
              </button>
            )}
          </div>
          {searchOpen && results.length > 0 && (
            <ul className="absolute right-4 left-4 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-gray-50">
              {results.map((p) => {
                const img = p.images?.[0] || p.image;
                const price = p.salePrice ?? p.originalPrice ?? p.price ?? 0;
                return (
                  <li key={p._id}>
                    <Link
                      href={`/product/${p._id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); setResults([]); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      {img && (
                        <Image
                          src={img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${img.startsWith("/") ? img : "/" + img}`}
                          alt={p.name} width={40} height={40}
                          className="object-contain rounded-xl border border-gray-100 bg-white shrink-0" unoptimized
                        />
                      )}
                      <span className="flex-1 text-sm text-gray-800 line-clamp-1 font-medium">{p.name}</span>
                      <span className="text-sm font-bold text-gray-900 shrink-0">{price.toLocaleString("en-US")} ج.م</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {searchOpen && !searching && searchQuery.trim() && results.length === 0 && (
            <div className="absolute right-4 left-4 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-6">
              <p className="text-center text-sm text-gray-400">لا توجد نتائج لـ &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Desktop nav ── */}
      <div className="hidden lg:block border-b border-[#082C39]/80" style={{ background: '#082C39' }}>
        <div className="max-w-7xl mx-auto px-4">
          <DesktopNav items={navItems} />
        </div>
      </div>

      <MobileMenu items={navItems} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
}
