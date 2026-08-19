"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/company/AAPL", label: "Company Analyzer" },
  { href: "/dcf", label: "DCF Valuation" },
  { href: "/portfolio", label: "Risk Management" },
  { href: "/scenarios", label: "Scenario Analysis" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-ink-200 bg-white/95 backdrop-blur sm:block">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3">
        <span className="text-sm font-semibold tracking-tight text-ink-900">
          Meridian<span className="text-accent">Research</span>
        </span>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-accent-light text-accent"
                    : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
