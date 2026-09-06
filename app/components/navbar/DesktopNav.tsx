"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./data";
import { DropdownMenu } from "./dropdown";
import { ChevronDownIcon } from "./icons";

export default function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <div key={item.label} className="relative group">
            <Link
              href={item.href}
              className={`flex items-center gap-1 px-3.5 py-4 text-[13px] font-semibold whitespace-nowrap transition-colors relative
                ${isActive ? "text-white" : "text-[#F5FFFF]/70 hover:text-white"}
              `}
            >
              {item.label}
              {(item.children || item.groups) && (
                <span className={`transition-transform duration-200 group-hover:rotate-180`}>
                  <ChevronDownIcon />
                </span>
              )}
              {/* active underline */}
              <span className={`absolute bottom-0 right-0 left-0 h-0.5 bg-[#20A5A1] rounded-full transition-all duration-200
                ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}
              `} />
            </Link>
            {(item.children || item.groups) && (
              <DropdownMenu items={item.children} groups={item.groups} />
            )}
          </div>
        );
      })}
    </div>
  );
}
