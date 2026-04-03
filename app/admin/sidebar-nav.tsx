"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingCart,
  Settings,
} from "lucide-react";

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingCart,
  Settings,
};

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export function AdminSidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = iconMap[item.icon] || LayoutDashboard;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isActive
                  ? "bg-brand-600 shadow-md shadow-brand-900/50"
                  : "bg-white/5 group-hover:bg-white/10"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-brand-400"
                }`}
              />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
