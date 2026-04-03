"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Phone, Mail, MapPin, Clock, Award, Shield } from "lucide-react";

const footerCourses = [
  { name: "HeartSaver CPR/AED", href: "/courses/cpr-aed" },
  { name: "HeartSaver First Aid", href: "/courses/first-aid" },
  { name: "CPR/AED + First Aid", href: "/courses/cpr-aed-first-aid" },
  { name: "BLS for Healthcare Providers", href: "/courses/bls-provider" },
  { name: "ACLS Provider", href: "/courses/acls-provider" },
  { name: "PALS Provider", href: "/courses/pals-provider" },
  { name: "NRP Training", href: "/courses/nrp" },
];

const footerLinks = [
  { name: "About Us", href: "/contact" },
  { name: "Pricing", href: "/pricing" },
  { name: "Corporate Training", href: "/corporate" },
  { name: "Contact Us", href: "/contact" },
];

export function Footer() {
  const pathname = usePathname();

  // Hide the footer on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#0b1f3a] text-slate-300">
      {/* ── Main Footer ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-5 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-600 group-hover:bg-brand-500 transition-colors flex-shrink-0">
                <Heart className="w-4.5 h-4.5 text-white" fill="currentColor" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-black text-white tracking-tight">
                  HeartSaverNY
                </span>
                <span className="text-base font-black text-brand-500 tracking-tight">
                  {" "}
                  Training
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Brooklyn's AHA-authorized training center providing CPR, First
              Aid, BLS, ACLS, PALS, and NRP certification courses for healthcare
              providers, childcare workers, and the general public.
            </p>

            {/* AHA Badge */}
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="w-9 h-9 rounded-lg bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0">
                <Award className="w-4.5 h-4.5 text-brand-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-0.5">
                  AHA Authorized
                </p>
                <p className="text-xs text-slate-400 leading-snug">
                  American Heart Association Training Center
                </p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5 pb-2 border-b border-white/10">
              Our Courses
            </h3>
            <ul className="space-y-2.5">
              {footerCourses.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-600 flex-shrink-0 group-hover:bg-brand-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5 pb-2 border-b border-white/10">
              Quick Links
            </h3>
            <ul className="space-y-2.5 mb-8">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-600 flex-shrink-0 group-hover:bg-brand-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cert badge */}
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4.5 h-4.5 text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-0.5">
                  2-Year Certification
                </p>
                <p className="text-xs text-slate-400 leading-snug">
                  All AHA certs valid for two years from course date
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5 pb-2 border-b border-white/10">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:7186742647"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-600/40 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                      718-674-2647
                    </p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="mailto:heartsaverny01@yahoo.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                      Email
                    </p>
                    <p className="text-sm text-slate-300 group-hover:text-brand-300 transition-colors break-all">
                      heartsaverny01@yahoo.com
                    </p>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                    Location
                  </p>
                  <p className="text-sm text-slate-300 leading-snug">
                    3220 Church Avenue
                    <br />
                    Brooklyn, NY 11226
                    <br />
                    <span className="text-xs text-slate-500">
                      Corner of Church Ave. &amp; New York Ave.
                    </span>
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                    Hours
                  </p>
                  <p className="text-sm text-slate-300 leading-snug">
                    Monday – Saturday
                    <br />
                    9:00am – 6:00pm
                    <br />
                    <span className="text-xs text-slate-500">
                      Closed Sunday
                    </span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} HeartSaverNY Training Academy. All
              rights reserved. &nbsp;·&nbsp; AHA Authorized Training Center
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/privacy"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
