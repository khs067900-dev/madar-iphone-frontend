import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaMobileAlt, FaEnvelope, FaChevronLeft } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCompany() {
  try {
    const r = await fetch(`${API}/api/admin/company`, { next: { revalidate: 60 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Footer() {
  const c = await getCompany();

  function ensureAbsolute(url: string) {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  }

  function toInlineUrl(url: string) {
    if (!url) return "";
    return `/file-view?url=${encodeURIComponent(url)}`;
  }

  const qrSrc: string = c.qrImage || "";
  const qrLinkType: string = c.qrFile ? "file" : (c.qrLinkType || "link");
  const qrLink: string = qrLinkType === "file" ? toInlineUrl(c.qrFile || "") : ensureAbsolute(c.qrLink || "");

  const footerItems: { image: string; linkType: string; link: string; file: string }[] =
    (c.footerItems || []).filter((item: { image: string }) => item.image);

  const img1: string = c.img1 || "";
  const linkType1: string = c.file1 ? "file" : (c.link1Type || c.linkType1 || "link");
  const link1: string = linkType1 === "file" ? toInlineUrl(c.file1 || "") : ensureAbsolute(c.link1 || "");
  const img2: string = c.img2 || "";
  const linkType2: string = c.file2 ? "file" : (c.link2Type || c.linkType2 || "link");
  const link2: string = linkType2 === "file" ? toInlineUrl(c.file2 || "") : ensureAbsolute(c.link2 || "");

  function getHref(item: { linkType: string; link: string; file: string }) {
    if (item.file) return toInlineUrl(item.file);
    return item.linkType === "link" ? ensureAbsolute(item.link) : toInlineUrl(item.file);
  }

  const links = [
    { label: "عن المتجر", href: "/about" },
    { label: "طرق الدفع", href: "/payment" },
    { label: "سياسة الاستبدال والاسترجاع", href: "/return-policy" },
    { label: "سياسة الخصوصية واتفاقية الاستخدام", href: "/privacy" },
  ];

  return (
    <footer dir="rtl" style={{ background: "linear-gradient(180deg, #053132 0%, #092C32 30%, #082D32 55%, #0C232F 80%, #0D202E 100%)" }} className="text-gray-200 mt-16">

      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #2dd4bf, transparent)" }} />

      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* من نحن */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold tracking-wide uppercase" style={{ color: "#2dd4bf" }}>
            من نحن
          </h3>
          <div className="w-8 h-0.5 rounded" style={{ background: "#2dd4bf" }} />
          <p className="text-sm leading-7 text-gray-300">
            {c.details || "مؤسسة مدار الاجهزة الالكترونية هي اختيارك الأول لشراء أجهزتك بالأقساط داخل السعودية، ضمان موثوق وخدمة محلية."}
          </p>
        </div>

        {/* روابط مهمة */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold tracking-wide uppercase" style={{ color: "#2dd4bf" }}>
            روابط مهمة
          </h3>
          <div className="w-8 h-0.5 rounded" style={{ background: "#2dd4bf" }} />
          <ul className="flex flex-col gap-2.5">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2 text-sm text-gray-300 transition-colors group"
                  style={{ ["--hover-color" as string]: "#2dd4bf" }}
                >
                  <FaChevronLeft size={10} className="text-teal-500 group-hover:translate-x-[-3px] transition-transform" />
                  <span className="group-hover:text-teal-300 transition-colors">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* تواصل معنا */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold tracking-wide uppercase" style={{ color: "#2dd4bf" }}>
            تواصل معنا
          </h3>
          <div className="w-8 h-0.5 rounded" style={{ background: "#2dd4bf" }} />
          <ul className="flex flex-col gap-3">
            {c.whatsapp && (
              <li>
                <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-teal-300 transition-colors" dir="ltr">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "rgba(45,212,191,0.12)" }}>
                    <FaWhatsapp className="text-emerald-400" size={15} />
                  </span>
                  {c.whatsapp}
                </a>
              </li>
            )}
            {c.phone && (
              <li>
                <a href={`tel:${c.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-teal-300 transition-colors" dir="ltr">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "rgba(45,212,191,0.12)" }}>
                    <FaMobileAlt className="text-teal-400" size={15} />
                  </span>
                  {c.phone}
                </a>
              </li>
            )}
            {c.email && (
              <li>
                <a href={`mailto:${c.email}`}
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-teal-300 transition-colors" dir="ltr">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "rgba(45,212,191,0.12)" }}>
                    <FaEnvelope className="text-teal-400" size={15} />
                  </span>
                  {c.email}
                </a>
              </li>
            )}
          </ul>

          {/* Images row */}
          <div className="flex gap-2 items-center flex-wrap mt-1">
            {qrSrc && (
              qrLink
                ? <a href={qrLink} target="_blank" rel="noreferrer" className="shrink-0">
                    <Image src={qrSrc} alt="qr" width={200} height={200} className="rounded-lg border bg-white p-1 h-auto w-auto max-h-16" style={{ borderColor: "rgba(45,212,191,0.3)" }} />
                  </a>
                : <Image src={qrSrc} alt="qr" width={200} height={200} className="rounded-lg border bg-white p-1 shrink-0 h-auto w-auto max-h-16" style={{ borderColor: "rgba(45,212,191,0.3)" }} />
            )}
            {footerItems.map((item, i) => {
              const href = getHref(item);
              const el = <Image key={i} src={item.image} alt={`footer-item-${i}`} width={200} height={200} className="rounded-lg h-auto w-auto max-h-16" />;
              return href
                ? <a key={i} href={href} target="_blank" rel="noreferrer" className="shrink-0">{el}</a>
                : <span key={i} className="shrink-0">{el}</span>;
            })}
            {img1 && (
              link1
                ? <a href={link1} target="_blank" rel="noreferrer" className="shrink-0"><Image src={img1} alt="img1" width={200} height={200} className="rounded-lg h-auto w-auto max-h-16" /></a>
                : <Image src={img1} alt="img1" width={200} height={200} className="rounded-lg shrink-0 h-auto w-auto max-h-16" />
            )}
            {img2 && (
              link2
                ? <a href={link2} target="_blank" rel="noreferrer" className="shrink-0"><Image src={img2} alt="img2" width={200} height={200} className="rounded-lg h-auto w-auto max-h-16" /></a>
                : <Image src={img2} alt="img2" width={200} height={200} className="rounded-lg shrink-0 h-auto w-auto max-h-16" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "rgba(45,212,191,0.15)" }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-3 items-center">
            <Image src="/cc975b.png" alt="cc" width={50} height={30} className="object-contain" style={{ width: "auto", height: "28px" }} />
            <Image src="/mada975b.png" alt="mada" width={50} height={30} className="object-contain" style={{ width: "auto", height: "28px" }} />
          </div>
          <span className="text-xs" style={{ color: "rgba(167,243,208,0.6)" }}>
            الحقوق محفوظة مؤسسة مدار الاجهزة الالكترونية © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
