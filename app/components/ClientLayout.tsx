"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import WhatsappButton from "./WhatsappButton";
import FingerprintInit from "./FingerprintInit";

export default function ClientLayout({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isFileView = pathname.startsWith("/file-view");
  const isXPanel = pathname.startsWith("/x-panel");
  const isBlocked = pathname.startsWith("/blocked");
  const hideChrome = isAdmin || isFileView || isXPanel || isBlocked;

  return (
    <>
      <FingerprintInit />
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && footer}
      {!hideChrome && <WhatsappButton />}
    </>
  );
}
