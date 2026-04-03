"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Heart,
  Shield,
  Award,
  Calendar,
  Users,
  Clock,
  Phone,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronRight,
  ChevronLeft,
  Activity,
  BookOpen,
  Zap,
  Building2,
  Stethoscope,
  Baby,
  Dumbbell,
  Bus,
  User,
  GraduationCap,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  category: string;
  priceOriginal: number;
  priceRenewal: number | null;
}

interface Stats {
  courses: number;
  sessions: number;
}

const fadeInUp: React.ComponentProps<typeof motion.div> = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" },
};

const professions = [
  {
    icon: "fa-solid fa-stethoscope",
    title: "Healthcare Providers",
    sub: "Nurses · Doctors · Paramedics · EMTs",
  },
  {
    icon: "fa-solid fa-baby",
    title: "Childcare Workers",
    sub: "Babysitters · Daycare · Baby Nurses",
  },
  {
    icon: "fa-solid fa-dumbbell",
    title: "Fitness Professionals",
    sub: "Personal Trainers · Yoga Instructors",
  },
  { icon: "fa-solid fa-bus", title: "Bus Matrons", sub: "School & Transit Safety" },
  { icon: "fa-solid fa-building", title: "Corporate Teams", sub: "Workplace Safety Programs" },
  {
    icon: "fa-solid fa-spa",
    title: "Massage Therapists",
    sub: "Spa & Wellness Professionals",
  },
  {
    icon: "fa-solid fa-users",
    title: "General Public",
    sub: "Parents · Caregivers · Anyone",
  },
  { icon: "fa-solid fa-graduation-cap", title: "Students & Teachers", sub: "Educational Settings" },
];

const features = [
  {
    icon: Award,
    title: "AHA Authorized Training Center",
    desc: "Our certifications are directly issued by the American Heart Association and recognized by all major healthcare institutions nationwide.",
  },
  {
    icon: Zap,
    title: "Same-Day eCard Certification",
    desc: "Walk out of class with your official AHA eCard in your inbox the very same day you complete your course.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    desc: "All classes are taught by active paramedics, registered nurses, and first responders with real-world emergency experience.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    desc: "Classes held every Monday through Saturday. On-site corporate training also available across all five NYC boroughs.",
  },
  {
    icon: BookOpen,
    title: "Hands-On Practical Training",
    desc: "Practice with clinical-grade manikins and AED trainers so you're prepared for real-world emergencies from day one.",
  },
];

const testimonials = [
  {
    quote:
      "I have taken many courses for years and HeartSaverNY is the most detailed CPR course I've taken. Great instructor. Continue the good work.",
    name: "Stacey Whitfield",
    role: "HeartSaverNY Student",
    rating: 5,
  },
  {
    quote:
      "The BLS certification class was incredibly thorough. Our instructor made sure every student felt confident with chest compressions and AED use before we left. Got my eCard the same day!",
    name: "Marcus Johnson",
    role: "Registered Nurse, Brooklyn",
    rating: 5,
  },
  {
    quote:
      "As a personal trainer, having my CPR/AED certification is non-negotiable. HeartSaverNY made the process seamless and the hands-on training was top notch.",
    name: "Priya Patel",
    role: "Certified Personal Trainer",
    rating: 5,
  },
  {
    quote:
      "We booked HeartSaverNY for corporate training at our office. They were professional, punctual, and our entire team walked away feeling prepared for any emergency.",
    name: "David Chen",
    role: "Office Manager, Manhattan",
    rating: 5,
  },
  {
    quote:
      "I needed my ACLS renewal done quickly and HeartSaverNY had me scheduled within days. The instructor was knowledgeable and made the material straightforward.",
    name: "Dr. Elena Rodriguez",
    role: "Emergency Medicine Physician",
    rating: 5,
  },
  {
    quote:
      "Quick, efficient, and thorough. I got my babysitter CPR certification here and felt completely prepared. The infant CPR portion was especially well taught.",
    name: "Ashley Thompson",
    role: "Childcare Provider, Queens",
    rating: 5,
  },
];

const services = [
  {
    icon: Activity,
    title: "Multiple Course Options",
    desc: "CPR/AED, First Aid, BLS, ACLS, PALS, and NRP courses available for healthcare providers, childcare workers, and the general public.",
    link: "/pricing",
    linkText: "View All Courses",
  },
  {
    icon: Building2,
    title: "Remote & Onsite Training",
    desc: "Based in Brooklyn, we also travel to you. Corporate and group training available throughout NYC and the tri-state area.",
    link: "/corporate",
    linkText: "Corporate Training",
  },
  {
    icon: Shield,
    title: "2-Year AHA Certification",
    desc: "Successfully complete our courses and receive a two-year American Heart Association certification valid nationally.",
    link: "/pricing",
    linkText: "Register Today",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
};

export function HomePageClient({
  courses,
  stats,
}: {
  courses: Course[];
  stats: Stats;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  }, []);

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetInterval]);

  const goTo = (idx: number) => {
    setDirection(idx > activeIdx ? 1 : -1);
    setActiveIdx(idx);
    resetInterval();
  };

  const goPrev = () => {
    const idx = (activeIdx - 1 + testimonials.length) % testimonials.length;
    setDirection(-1);
    setActiveIdx(idx);
    resetInterval();
  };

  const goNext = () => {
    const idx = (activeIdx + 1) % testimonials.length;
    setDirection(1);
    setActiveIdx(idx);
    resetInterval();
  };

  return (
    <div className="bg-[#091729] min-h-screen text-white">
      {/* ─────────────────────────────────────────────────────
          HERO  –  full-bleed, no max-w container on the grid
      ───────────────────────────────────────────────────── */}
      <section className="relative bg-[#0b1f3a] overflow-hidden">
        {/* Full-viewport grid – no constraining wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — text content */}
          <div
            className="flex flex-col justify-center min-h-[calc(88vh-80px)] py-20 lg:py-28
                          px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10"
          >
            <div className="max-w-xl lg:ml-auto">
              {/* AHA Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 mb-7"
              >
                <span className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/40 text-brand-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  AHA Authorized Training Center
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
              >
                Learn Skills
                <br />
                That <span className="text-brand-500">Save Lives.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 }}
                className="text-lg text-slate-300 leading-relaxed mb-8"
              >
                Brooklyn&apos;s premier CPR, First Aid, BLS, ACLS, PALS &amp;
                NRP training center. Hands-on classes Monday–Saturday with{" "}
                <strong className="text-white font-semibold">
                  same-day AHA certification.
                </strong>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.26 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-8 shadow-lg shadow-brand-900/40 text-base font-bold transition-transform hover:scale-105"
                >
                  <Link href="/pricing">
                    Explore Courses &amp; Pricing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-lg px-8 text-base font-bold"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </motion.div>

              {/* Trust Checks */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-x-6 gap-y-2"
              >
                {[
                  "Same-Day eCards",
                  "Mon – Sat Classes",
                  "2-Year AHA Cert",
                  "On-Site Training Available",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-slate-400 text-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* RIGHT — hero image, fills full right half to viewport edge */}
          <div className="hidden lg:block relative min-h-[calc(88vh-80px)] overflow-hidden">
            {/* Left-to-center gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f3a] via-[#0b1f3a]/25 to-transparent z-10" />
            {/* Bottom fade into stats bar */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0b1f3a] to-transparent z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80"
              alt="CPR and First Aid Training"
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            {/* NO red stripe */}
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="bg-brand-600 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-700/60">
              {[
                {
                  value: `${stats.courses}`,
                  label: "Active Courses",
                  icon: Award,
                },
                {
                  value: `${stats.sessions}`,
                  label: "Monthly Sessions",
                  icon: Calendar,
                },
                { value: "5,000+", label: "Students Certified", icon: Users },
                { value: "15+", label: "Years Experience", icon: Shield },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-5 text-white"
                >
                  <stat.icon className="w-7 h-7 text-brand-200 flex-shrink-0 hidden sm:block" />
                  <div>
                    <div className="text-3xl font-black leading-none">
                      {stat.value}
                    </div>
                    <div className="text-xs text-brand-200 uppercase tracking-wider mt-1">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          WHO WE TRAIN
      ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#091729] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">
              Training for Everyone
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Who We Train
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Whether you&apos;re a healthcare professional, childcare worker,
              or concerned parent — we have a course designed for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {professions.map((prof, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center
                           hover:border-brand-500/50 hover:bg-white/10 transition-all group flex flex-col items-center cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-brand-600/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-600/30 transition-all">
                  <i className={`${prof.icon} text-xl text-brand-400 group-hover:text-brand-300 transition-colors`} />
                </div>
                <h3 className="font-bold text-white text-sm leading-snug mb-1 group-hover:text-brand-300 transition-colors">
                  {prof.title}
                </h3>
                <p className="text-xs text-slate-400 leading-snug">
                  {prof.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          FEATURED COURSES
      ───────────────────────────────────────────────────── */}
      {courses.length > 0 && (
        <section className="py-20 bg-[#0b1f3a] border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            >
              <div>
                <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">
                  AHA Certification Programs
                </p>
                <h2 className="text-4xl sm:text-5xl font-black text-white">
                  Our Courses
                </h2>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-bold text-sm group"
              >
                View All Pricing &amp; Courses
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Link
                    href={`/courses/${course.slug}`}
                    className="block h-full group"
                  >
                    <div
                      className="h-full flex flex-col bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden
                                    hover:border-brand-500/50 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300"
                    >
                      {/* Card header */}
                      <div className="bg-[#091729] p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <span
                          className="inline-block text-xs font-bold uppercase tracking-widest text-brand-300
                                         bg-brand-600/20 border border-brand-600/30 px-3 py-1.5 rounded-full mb-3"
                        >
                          {course.category}
                        </span>
                        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-brand-300 transition-colors">
                          {course.title}
                        </h3>
                      </div>
                      {/* Card body */}
                      <div className="flex flex-col flex-1 p-6">
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-auto">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10">
                          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                            <Clock className="w-4 h-4 text-brand-500" />
                            {course.duration}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-white">
                              {formatCurrency(course.priceOriginal)}
                            </div>
                            {course.priceRenewal && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                Renewal: {formatCurrency(course.priceRenewal)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pricing note */}
            <motion.div
              {...fadeInUp}
              className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6
                         flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-white">
                  Looking for renewal pricing?
                </p>
                <p className="text-slate-400 text-sm mt-0.5">
                  We offer discounted renewal rates for all AHA courses. View
                  the full pricing table on our Pricing page.
                </p>
              </div>
              <Button
                asChild
                className="bg-brand-600 hover:bg-brand-700 rounded-lg flex-shrink-0 shadow-none"
              >
                <Link href="/pricing">View Full Pricing</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────
          WHY CHOOSE US
      ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#091729] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Feature list */}
            <div>
              <motion.div {...fadeInUp}>
                <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">
                  The HeartSaverNY Difference
                </p>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
                  Why Professionals <br className="hidden sm:block" />
                  Choose Us
                </h2>
                <p className="text-slate-400 mb-10 text-base max-w-md">
                  We&apos;ve been training healthcare providers, childcare
                  workers, and everyday people to save lives for over 15 years.
                </p>
              </motion.div>

              <div className="space-y-7">
                {features.map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="flex gap-4 group"
                  >
                    <div
                      className="flex-shrink-0 w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center
                                    shadow-md shadow-brand-900/50 group-hover:scale-105 transition-transform"
                    >
                      <feat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-0.5">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
                alt="Medical Training"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091729]/90 via-[#091729]/20 to-transparent" />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                      <Heart
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        AHA Certified Training
                      </p>
                      <p className="text-xs text-white/60">
                        American Heart Association Authorized Center
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-white/70 mt-3 pt-3 border-t border-white/15">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                      Same-Day eCards
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                      Nationally Recognized
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                      2-Year Validity
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          TESTIMONIALS CAROUSEL
      ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0b1f3a] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            {/* Label */}
            <p className="text-brand-400 font-bold uppercase tracking-widest text-xs text-center mb-10">
              What Our Students Say
            </p>

            {/* Full-width row: arrow — content — arrow */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Prev button */}
              <button
                onClick={goPrev}
                aria-label="Previous review"
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10
                           hover:bg-brand-600 hover:border-brand-600 text-slate-400 hover:text-white
                           flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Quote content — fills all available space */}
              <div className="flex-1 relative overflow-hidden min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeIdx}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="text-center"
                  >
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonials[activeIdx].rating)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-brand-500 text-brand-500"
                          />
                        ),
                      )}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8 max-w-4xl mx-auto">
                      &ldquo;{testimonials[activeIdx].quote}&rdquo;
                    </blockquote>

                    {/* Attribution */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-0.5 bg-brand-600 rounded mb-3" />
                      <p className="font-bold text-brand-300 text-base">
                        {testimonials[activeIdx].name}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {testimonials[activeIdx].role}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next button */}
              <button
                onClick={goNext}
                aria-label="Next review"
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10
                           hover:bg-brand-600 hover:border-brand-600 text-slate-400 hover:text-white
                           flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2.5 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIdx
                      ? "w-6 h-2 bg-brand-500"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Review count */}
            <p className="text-center text-slate-500 text-xs mt-3">
              {activeIdx + 1} of {testimonials.length} reviews
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          SERVICE HIGHLIGHTS
      ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#091729] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">
              Our Programs
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Training That Fits Your Needs
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8
                           hover:border-brand-500/50 hover:shadow-xl hover:shadow-black/30
                           transition-all group flex flex-col"
              >
                <div
                  className="w-14 h-14 rounded-xl bg-brand-600 flex items-center justify-center mb-6
                                group-hover:scale-105 transition-transform shadow-lg shadow-brand-900/40"
                >
                  <svc.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {svc.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  {svc.desc}
                </p>
                <Link
                  href={svc.link}
                  className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-bold text-sm group-hover:gap-2.5 transition-all"
                >
                  {svc.linkText}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          MISSION BAND
      ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#0b1f3a] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-6 h-6 text-brand-400" fill="currentColor" />
            </div>
            <p className="text-lg text-slate-300 leading-relaxed">
              <strong className="text-white font-bold">
                HeartSaverNY believes every life has value.
              </strong>{" "}
              Our goal is to educate healthcare providers, childcare workers,
              and the general community on the principles of BLS, CPR, First
              Aid, ACLS, PALS, and NRP — in a convenient, non-judgmental, and
              informative manner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          CTA
      ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-600 relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Take the First Step
              <br className="hidden sm:block" /> to Saving Lives
            </h2>
            <p className="text-brand-100 text-lg mb-10 max-w-xl mx-auto">
              Classes run Monday through Saturday in Brooklyn, NY. Contact us to
              register or request on-site corporate training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:7186742647"
                className="inline-flex items-center gap-3 bg-white text-brand-600 hover:bg-slate-100
                           font-black text-lg px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                718-674-2647
              </a>
              <Button
                asChild
                size="lg"
                className="bg-[#0b1f3a] hover:bg-[#0d2548] text-white border-0 rounded-xl px-8 font-bold
                           shadow-xl hover:scale-105 transition-transform"
              >
                <Link href="/contact">Contact to Register</Link>
              </Button>
            </div>
            <p className="text-brand-200/80 text-sm mt-8">
              Walk-ins welcome &nbsp;·&nbsp; Same-Day AHA eCards &nbsp;·&nbsp;
              3220 Church Ave, Brooklyn NY
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
