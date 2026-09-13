"use client";

import { motion } from "framer-motion";

interface Props {
  label: string;
  parentLabel: string;
  parentHref: string;
  productCount: number;
  loading: boolean;
}

export default function CategoryHero({ label }: Props) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight"
        >
          {label}
        </motion.h1>
      </div>
    </div>
  );
}
