import ComingSoon from "../../../components/ComingSoon";
import CategoryPageClient from "../../[slug]/CategoryPageClient";

export const revalidate = 3600;

const RESERVATION_DATE = new Date(
  process.env.NEXT_PUBLIC_IPHONE18_RESERVATION_DATE ?? "2026-09-12T23:00:00+03:00"
);

const SLIDES = [
  "/06550573-067f-4102-8bf9-0e0c02236776.webp",
  "/df3a0f08-fb1c-4b40-863c-58f8f562805d.webp",
  "/e5ae006f-b733-41d4-9e48-69994eeacbe4.webp",
];

export default function IPhone18Page() {
  const isOver = Date.now() >= RESERVATION_DATE.getTime();

  if (!isOver) {
    return (
      <ComingSoon
        modelName="آيفون 18"
        reservationDate={RESERVATION_DATE.toISOString()}
        slides={SLIDES}
        reservationLabel="15 سبتمبر 2026"
        availabilityLabel="أكتوبر 2026"
      />
    );
  }

  // Date passed → show normal products page
  return <CategoryPageClient slug="iphone-18" />;
}
