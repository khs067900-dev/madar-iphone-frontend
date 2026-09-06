import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "تم حظر هذا الجهاز",
  robots: { index: false, follow: false },
};

export default function BlockedPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white px-4 text-center"
      dir="rtl"
    >
      <div className="relative w-48 h-48 mb-8 rounded-2xl overflow-hidden border border-red-800/30 shadow-lg shadow-red-900/20">
        <Image src="/aa.jpeg" alt="blocked" fill className="object-cover" />
      </div>

      <h1 className="text-2xl font-extrabold mb-4 text-red-400 leading-relaxed max-w-md">
        يا أخو شرموط انتا وياها 😤
      </h1>

      <div className="text-gray-300 max-w-sm text-base leading-loose space-y-1 font-bold">
        <p>لعب مع الأسد صعب 🦁</p>
        <p>راح أخليكم تندمو على اليوم اللي فكرتو فيه تخونو الأمانة</p>
        <p>وتدخل على جميلات 😤</p>
        <p>تعوني يا قليلين الأصل يا جعانين</p>
        <p>عيونكم فارغة يا شرميط 🖕</p>
      </div>

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-800/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
