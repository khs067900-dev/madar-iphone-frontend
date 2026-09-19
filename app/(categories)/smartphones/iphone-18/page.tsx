import type { Metadata } from "next";
import IPhone18Client from "./IPhone18Client";

export const metadata: Metadata = {
  title: "آيفون 18 — اختر موديلك | مدار للإلكترونيات",
  description:
    "تسوق سلسلة آيفون 18 بأفضل الأسعار: آيفون 18 برو ماكس، آيفون 18 برو، آيفون 18 عادي. شحن سريع وضمان معتمد.",
  openGraph: {
    title: "آيفون 18 — اختر موديلك | مدار للإلكترونيات",
    description: "سلسلة آيفون 18 الجديدة متوفرة الآن بأفضل الأسعار وبالتقسيط المريح.",
    url: "https://madarelectronic.com/smartphones/iphone-18",
    locale: "ar_SA",
    type: "website",
  },
};

export default function IPhone18LandingPage() {
  return <IPhone18Client />;
}
