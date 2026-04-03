import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingCart,
  Settings,
  LogOut,
  Heart,
  ChevronRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { AdminSidebarNav } from "./sidebar-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const navItems = [
    { href: "/admin", label: "Overview", icon: "LayoutDashboard" },
    { href: "/admin/products", label: "Products & Prices", icon: "ShoppingCart" },
    { href: "/admin/schedule", label: "Class Schedule", icon: "Calendar" },
    { href: "/admin/bookings", label: "Bookings", icon: "Users" },
    { href: "/admin/settings", label: "Settings", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#060f1e] flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0b1f3a] border-r border-white/10 min-h-screen">
        {/* Logo Section */}
        <div className="px-6 pt-7 pb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-900/50 group-hover:shadow-brand-600/40 transition-all duration-300 group-hover:scale-105">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-black text-white tracking-tight">
                HeartSaverNY
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mt-0.5">
                Training Center
              </span>
            </div>
          </Link>
        </div>

        {/* Admin Badge */}
        <div className="mx-6 mb-6 px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">Admin Panel</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Navigation
          </p>
          <AdminSidebarNav items={navItems} />
        </div>

        {/* User Section */}
        <div className="px-3 pb-6 mt-auto">
          <div className="border-t border-white/10 pt-4 space-y-1">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-white text-sm ring-2 ring-brand-400/30">
                {session.user.name?.[0] || session.user.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-bold text-white truncate">
                  {session.user.name || "Admin"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm group"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Admin</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0b1f3a] border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black text-white tracking-tight">HeartSaverNY</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-brand-400">Training Center</span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Exit
          </Link>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#091729]">
          {children}
        </div>
      </main>
    </div>
  );
}
