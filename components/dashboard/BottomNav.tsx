"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/company/AAPL", label: "Analyzer", icon: "search" },
  { href: "/dcf", label: "DCF", icon: "chart" },
  { href: "/portfolio", label: "Risk", icon: "shield" },
  { href: "/scenarios", label: "Scenarios", icon: "layers" },
] as const;

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "#2563eb" : "#7c869c";
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-6 4 3 5-8" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <polygon points="12 2 2 8 12 14 22 8 12 2" />
          <polyline points="2 14 12 20 22 14" />
          <polyline points="2 11 12 17 22 11" />
        </svg>
      );
    default:
      return null;
  }
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:hidden">
      <div className="flex items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2"
            >
              <Icon name={item.icon} active={active} />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-accent" : "text-ink-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
