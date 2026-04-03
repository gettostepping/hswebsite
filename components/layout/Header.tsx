"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  BookOpen,
  ChevronDown,
  Phone,
  Clock,
  MapPin,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPuzzle } from "@/hooks/use-admin-puzzle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
  { name: "Corporate", href: "/corporate" },
  { name: "Contact", href: "/contact" },
];

function UserDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  const displayName =
    session.user?.name || session.user?.email?.split("@")[0] || "User";
  const email = session.user?.email || "";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-bold ring-2 ring-brand-400/30">
          {initials}
        </div>
        <span className="hidden xl:block text-sm font-medium text-slate-200 max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-64 bg-[#0f2a44] rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            <div className="px-4 py-3.5 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold ring-2 ring-brand-400/30">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{email}</p>
                </div>
              </div>
            </div>

            <div className="py-1.5">
              <Link
                href="/my-courses"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4 text-brand-400" />
                My Courses
              </Link>
            </div>

            <div className="border-t border-white/10 py-1.5">
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { handleLogoClick } = useAdminPuzzle();
  const pathname = usePathname();

  // Hide the main site header on admin pages — admin has its own sidebar
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50">
      {/* ── Utility Bar ── */}
      <div className="bg-[#0f2744] hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs text-slate-300">
            <div className="flex items-center gap-5">
              <a
                href="tel:7186742647"
                className="flex items-center gap-1.5 font-semibold text-white hover:text-brand-300 transition-colors"
              >
                <Phone className="w-3 h-3 text-brand-400 flex-shrink-0" />
                718-674-2647
              </a>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-brand-400 flex-shrink-0" />
                Mon – Sat: 9:00am – 6:00pm &nbsp;·&nbsp; Closed Sunday
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-brand-400 flex-shrink-0" />
              3220 Church Avenue, Brooklyn NY 11226
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <nav className="bg-[#0b1f3a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-3 group"
                onClick={handleLogoClick}
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-900/50 group-hover:shadow-brand-600/40 transition-all duration-300 group-hover:scale-105">
                  <Heart
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                  />
                  <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-[17px] font-black text-white tracking-tight">
                    HeartSaverNY
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mt-0.5">
                    Training Center
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-white/5 rounded-full px-1.5 py-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                        isActive
                          ? "text-white bg-white/10"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Auth + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {session ? (
                <>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full px-6 h-10 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold shadow-lg shadow-brand-900/40 transition-all hover:shadow-brand-600/30 hover:scale-[1.02]"
                  >
                    <Link href="/pricing" className="flex items-center gap-2">
                      Register Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <UserDropdown />
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn("email")}
                    className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full px-6 h-10 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold shadow-lg shadow-brand-900/40 transition-all hover:shadow-brand-600/30 hover:scale-[1.02]"
                  >
                    <Link href="/pricing" className="flex items-center gap-2">
                      Register Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </>
              )}

              {/* AHA Badge */}
              <div className="pl-3 ml-1 border-l border-white/10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Shield className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">AHA Authorized</span>
                </div>
              </div>
            </div>

            {/* Mobile: menu toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <Button
                asChild
                size="sm"
                className="rounded-full bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-900/40 font-bold"
              >
                <Link href="/pricing">Register</Link>
              </Button>
              <button
                type="button"
                className="p-2 -mr-1 rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pb-6 pt-3 space-y-1 border-t border-white/10 mt-1">
                  {/* Mobile utility info */}
                  <div className="px-3 py-3 bg-white/5 rounded-xl mb-4 space-y-2 border border-white/10">
                    <a
                      href="tel:7186742647"
                      className="flex items-center gap-2 text-sm font-semibold text-brand-400"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      718-674-2647
                    </a>
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Mon – Sat: 9am – 6pm
                    </p>
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      3220 Church Ave, Brooklyn NY 11226
                    </p>
                  </div>

                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                          isActive
                            ? "text-white bg-white/10"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}

                  <div className="pt-4 px-1 space-y-3 border-t border-white/10 mt-3">
                    {session ? (
                      <>
                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm ring-2 ring-brand-400/30">
                            {(session.user?.name || session.user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {session.user?.name ||
                                session.user?.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/my-courses"
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <BookOpen className="w-4 h-4 text-brand-400" />
                          My Courses
                        </Link>
                        <Button
                          asChild
                          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold shadow-none h-11"
                        >
                          <Link href="/pricing">Register Now</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 border-white/10 rounded-xl bg-transparent h-11"
                          onClick={() => signOut()}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-white/10 text-slate-300 hover:text-white hover:bg-white/10 bg-transparent font-semibold h-11"
                          onClick={() => signIn("email")}
                        >
                          Sign In
                        </Button>
                        <Button
                          asChild
                          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-bold shadow-none h-11"
                        >
                          <Link href="/pricing">Register Now</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
