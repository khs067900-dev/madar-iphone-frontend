import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "نعود إليكم قريبًا",
  description: "نجري بعض أعمال الصيانة في متجر مدار للإلكترونيات. شكرًا لتفهّمكم.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main
      dir="rtl"
      className="flex min-h-svh flex-col bg-[#fafbf9] px-6 py-8 text-[#253c3a] sm:px-10 sm:py-10"
    >
      <header className="text-center text-sm font-semibold tracking-wide sm:text-base">
        مدار للإلكترونيات
      </header>

      <section
        aria-labelledby="maintenance-title"
        className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center py-12 text-center sm:py-16"
      >
        <Image
          src="/Maintenance%20web.svg"
          alt=""
          width={320}
          height={320}
          priority
          sizes="(max-width: 640px) 208px, 272px"
          className="mb-8 h-52 w-52 max-w-full object-contain sm:mb-10 sm:h-68 sm:w-68"
        />
        <p className="mb-3 text-xs font-medium text-[#60716b] sm:text-sm">
          الموقع تحت الصيانة
        </p>
        <h1
          id="maintenance-title"
          className="text-3xl font-semibold leading-relaxed sm:text-4xl"
        >
          نعود إليكم قريبًا
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-8 text-[#60716b] sm:max-w-sm sm:text-base">
          نجري بعض التحديثات على المتجر.
          <br />
          نعتذر عن التوقف المؤقت، وشكرًا لتفهّمكم.
        </p>
      </section>

      <footer className="text-center text-xs leading-6 text-[#60716b]">
        يسعدنا أن نراكم مجددًا
      </footer>
    </main>
  );
}
