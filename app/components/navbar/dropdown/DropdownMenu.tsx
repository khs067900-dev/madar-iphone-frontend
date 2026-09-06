"use client";

import Link from "next/link";
import { NavGroup } from "../data";

interface DropdownMenuProps {
  items?: { label: string; href: string }[];
  groups?: NavGroup[];
}

export default function DropdownMenu({ items, groups }: DropdownMenuProps) {
  const isWide = groups && groups.length > 1;

  return (
    <div className={`absolute top-full right-0 mt-0 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden
      opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
      transition-all duration-200 ease-out
      ${isWide ? "w-[480px] grid grid-cols-2 gap-0 py-4 px-2" : "w-56"}
    `}>
      {groups?.map((group, gi) => (
        <div key={gi} className={isWide ? "px-2" : ""}>
          <div className="px-3 py-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
            {group.groupLabel}
          </div>
          {group.items.map((item, ci) => (
            <Link
              key={`${item.href}-${ci}`}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors text-right"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      ))}
      {items?.map((item, index) => (
        <Link
          key={`${item.href}-${index}`}
          href={item.href}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors text-right mx-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}
