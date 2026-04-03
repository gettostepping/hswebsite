"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Award,
  Shield,
  CheckCircle2,
  Send,
  Phone,
  Mail,
  Calculator,
  MapPin,
  ChevronDown,
  Minus,
  Plus,
  TrendingDown,
  Info,
} from "lucide-react";

/** Location travel fees from Brooklyn HQ */
const LOCATIONS = [
  { name: "Brooklyn", fee: 0, label: "Home Base" },
  { name: "Queens", fee: 25, label: "+$25" },
  { name: "Manhattan", fee: 35, label: "+$35" },
  { name: "Bronx", fee: 50, label: "+$50" },
  { name: "Staten Island", fee: 60, label: "+$60" },
  { name: "Long Island", fee: 75, label: "+$75" },
];

/**
 * Discount tiers — the more students, the bigger the per-head discount.
 * This mirrors what we show the user in the breakdown equation.
 */
function getDiscountRate(students: number): number {
  if (students >= 20) return 0.25;   // 25 %
  if (students >= 15) return 0.20;   // 20 %
  if (students >= 10) return 0.15;   // 15 %
  if (students >= 5)  return 0.10;   // 10 %
  return 0;                            // no discount
}

function getDiscountLabel(students: number): string {
  const r = getDiscountRate(students);
  if (r === 0) return "No group discount (min 5 students)";
  return `${(r * 100).toFixed(0)}% group discount`;
}

type Course = {
  id: string;
  title: string;
  priceOriginal: number;
  priceRenewal?: number | null;
  category: string;
};

export function CorporateClient({ courses }: { courses: Course[] }) {
  /* ── Estimator State ── */
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [studentsTotal, setStudentsTotal] = useState<number>(10);
  const [studentsOriginal, setStudentsOriginal] = useState<number>(10);
  const [locationIdx, setLocationIdx] = useState<number>(0);

  // Safely enforce bounds whenever studentsTotal changes or course changes
  const handleSetTotal = (val: number) => {
    setStudentsTotal(val);
    if (studentsOriginal > val) setStudentsOriginal(val);
  };

  const location = LOCATIONS[locationIdx] || LOCATIONS[0];

  const estimate = useMemo(() => {
    const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
    if (!course) return null;

    const discountRate = getDiscountRate(studentsTotal);
    const isRenewalAvailable = course.priceRenewal != null;
    
    // Enforce logic internally in case state hasn't settled
    const validOriginal = Math.min(studentsOriginal, studentsTotal);
    const actualOriginalStudents = isRenewalAvailable ? validOriginal : studentsTotal;
    const actualRenewalStudents = isRenewalAvailable ? (studentsTotal - validOriginal) : 0;

    const unitPriceOrig = course.priceOriginal;
    const unitPriceRen = course.priceRenewal || course.priceOriginal;

    const discountedUnitOrig = unitPriceOrig * (1 - discountRate);
    const discountedUnitRen = unitPriceRen * (1 - discountRate);

    const subtotalOrig = discountedUnitOrig * actualOriginalStudents;
    const subtotalRen = discountedUnitRen * actualRenewalStudents;

    const subtotal = subtotalOrig + subtotalRen;
    const travelFee = location.fee;
    
    const total = subtotal + travelFee;
    const originalTotalBeforeDiscount = (unitPriceOrig * actualOriginalStudents) + (unitPriceRen * actualRenewalStudents) + travelFee;
    const savings = originalTotalBeforeDiscount - total;

    return {
      course,
      discountRate,
      discountedUnitOrig,
      discountedUnitRen,
      actualOriginalStudents,
      actualRenewalStudents,
      unitPriceOrig,
      unitPriceRen,
      subtotal,
      travelFee,
      total,
      savings,
      originalTotal: originalTotalBeforeDiscount
    };
  }, [courses, selectedCourseId, studentsTotal, studentsOriginal, location]);
  return (
    <div className="bg-[#091729] min-h-screen text-white pb-24">
      {/* Hero */}
      <section className="bg-[#0b1f3a] pt-16 pb-12 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">
            Corporate Solutions
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Group Training &amp; Certification
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Equip your team with life-saving skills. Custom on-site training
            programs tailored perfectly to your organization&apos;s needs.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left – Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                  Why Choose Corporate Training?
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      icon: Building2,
                      title: "On-Site Convenience",
                      desc: "We come to your facility — no travel required for your team. Training at your location on your schedule.",
                    },
                    {
                      icon: Users,
                      title: "Volume Discounts",
                      desc: "Special discounted rates for groups of 5 or more. Highly competitive pricing for larger organizations.",
                    },
                    {
                      icon: Award,
                      title: "Customized Programs",
                      desc: "Training programs tailored precisely to your specific industry requirements, whether healthcare, construction, or education.",
                    },
                    {
                      icon: Shield,
                      title: "OSHA & AHA Compliant",
                      desc: "Ensure your workplace entirely meets strict OSHA first aid and CPR training requirements with official AHA certification.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-bold text-white mb-1.5">{item.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact info box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Need Immediate Assistance?</h3>
                <div className="space-y-3">
                  <p className="text-slate-300 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-400" />
                    718-674-2647
                  </p>
                  <p className="text-slate-300 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-400" />
                    corporate@heartsavertraining.com
                  </p>
                </div>
              </div>
            </div>

            {/* Right – Estimator + Form */}
            <div className="space-y-8">
              {/* ═══════════════════════════════════════════════
                  ESTIMATOR CARD
                  ═══════════════════════════════════════════════ */}
              <div className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-600/20 to-brand-500/10 border-b border-white/10 px-8 py-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Group Training Estimator</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Instant pricing — no commitment</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* Course Selector */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-brand-400" />
                      Select Course
                    </Label>
                    <div className="relative">
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm cursor-pointer"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#0b1f3a] text-white">
                            {c.title} — ${c.priceOriginal}/student
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Student Count */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300 text-sm font-medium flex items-center gap-2 mb-2">
                        <Users className="w-3.5 h-3.5 text-brand-400" />
                        Total Number of Students
                      </Label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSetTotal(Math.max(1, studentsTotal - 1))}
                          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all active:scale-95 flex-shrink-0"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <Input
                          type="number"
                          min={1}
                          max={200}
                          value={studentsTotal}
                          onChange={(e) => handleSetTotal(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
                          className="h-12 rounded-xl bg-white/5 border-white/10 text-white text-center text-lg font-bold focus-visible:ring-brand-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleSetTotal(Math.min(200, studentsTotal + 1))}
                          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all active:scale-95 flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Discount badge */}
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mt-3 transition-colors ${
                        getDiscountRate(studentsTotal) > 0
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/5 text-slate-400 border border-white/10"
                      }`}>
                        <TrendingDown className="w-3 h-3" />
                        {getDiscountLabel(studentsTotal)}
                      </div>
                    </div>

                    {/* Breakdown Sliders if Renewal Exists */}
                    {estimate?.course?.priceRenewal != null && (
                      <div className="pt-4 border-t border-white/10 space-y-5">
                        <Label className="text-slate-300 text-sm font-medium">Certification Split</Label>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm text-slate-400 mb-2">
                             <span>Original Students</span>
                             <span className="font-bold text-white">{estimate.actualOriginalStudents}</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={studentsTotal}
                            value={studentsOriginal}
                            onChange={(e) => setStudentsOriginal(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm text-slate-400 mb-2">
                             <span>Renewal Students</span>
                             <span className="font-bold text-white">{estimate.actualRenewalStudents}</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={studentsTotal}
                            value={studentsTotal - studentsOriginal}
                            onChange={(e) => setStudentsOriginal(studentsTotal - parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Selector */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      Training Location
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {LOCATIONS.map((loc, idx) => (
                        <button
                          key={loc.name}
                          type="button"
                          onClick={() => setLocationIdx(idx)}
                          className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-center ${
                            idx === locationIdx
                              ? "bg-brand-600/20 border-brand-500/40 text-brand-300 ring-1 ring-brand-500/20"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                          }`}
                        >
                          <span className="block font-semibold">{loc.name}</span>
                          <span className={`block text-[10px] mt-0.5 ${idx === locationIdx ? "text-brand-400" : "text-slate-500"}`}>
                            {loc.fee === 0 ? "Free" : loc.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10" />

                  {/* Price Breakdown */}
                  {estimate && (
                    <div className="space-y-4">
                      {/* Equation display */}
                      <div className="bg-[#091729] rounded-xl border border-white/10 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-3.5 h-3.5 text-brand-400" />
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pricing Formula</p>
                        </div>
                        <div className="font-mono text-sm text-slate-300 leading-relaxed space-y-1">
                          {estimate.actualOriginalStudents > 0 && (
                            <p>
                              <span className="text-slate-500">Original ({estimate.actualOriginalStudents}):</span>{" "}
                              <span className="text-white">${estimate.unitPriceOrig.toFixed(2)}</span>
                              {estimate.discountRate > 0 && (
                                <span className="text-emerald-400"> × {((1 - estimate.discountRate)).toFixed(2)}</span>
                              )}
                              <span className="text-slate-500"> = </span>
                              <span className="text-white">${estimate.discountedUnitOrig.toFixed(2)}</span>
                              <span className="text-slate-500">/ea</span>
                            </p>
                          )}
                          {estimate.actualRenewalStudents > 0 && (
                            <p>
                              <span className="text-slate-500">Renewal ({estimate.actualRenewalStudents}):</span>{" "}
                              <span className="text-white">${estimate.unitPriceRen.toFixed(2)}</span>
                              {estimate.discountRate > 0 && (
                                <span className="text-emerald-400"> × {((1 - estimate.discountRate)).toFixed(2)}</span>
                              )}
                              <span className="text-slate-500"> = </span>
                              <span className="text-white">${estimate.discountedUnitRen.toFixed(2)}</span>
                              <span className="text-slate-500">/ea</span>
                            </p>
                          )}
                          <p className="border-t border-white/10 pt-1 mt-1">
                            <span className="text-slate-500">Students Subtotal:</span>{" "}
                            <span className="text-white font-bold">${(estimate.actualOriginalStudents * estimate.discountedUnitOrig + estimate.actualRenewalStudents * estimate.discountedUnitRen).toFixed(2)}</span>
                          </p>
                          {estimate.travelFee > 0 && (
                            <p>
                              <span className="text-slate-500">Travel Fee:</span>{" "}
                              <span className="text-amber-400">+${estimate.travelFee.toFixed(2)}</span>
                              <span className="text-slate-500"> ({location.name})</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Summary Row */}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Estimated Total</p>
                          {estimate.savings > 0 && (
                            <p className="text-sm text-slate-500 line-through">${estimate.originalTotal.toFixed(2)}</p>
                          )}
                          <p className="text-3xl font-black text-white tracking-tight">${estimate.total.toFixed(2)}</p>
                        </div>
                        {estimate.savings > 0 && (
                          <div className="bg-emerald-500/15 border border-emerald-500/20 rounded-xl px-4 py-2 text-right">
                            <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">You Save</p>
                            <p className="text-lg font-black text-emerald-400">${estimate.savings.toFixed(2)}</p>
                          </div>
                        )}
                      </div>

                      {/* Per-student callout */}
                      <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-400 bg-white/5 rounded-lg px-4 py-3 border border-white/5">
                        <Users className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div>
                            {estimate.actualOriginalStudents > 0 && (
                              <span className="mr-3"><span className="text-white font-bold">${estimate.discountedUnitOrig.toFixed(2)}</span><span className="opacity-70 text-xs">/orig</span></span>
                            )}
                            {estimate.actualRenewalStudents > 0 && (
                              <span><span className="text-white font-bold">${estimate.discountedUnitRen.toFixed(2)}</span><span className="opacity-70 text-xs">/ren</span></span>
                            )}
                          </div>
                          {estimate.discountRate > 0 && (
                            <span className="text-emerald-400 font-bold">{(estimate.discountRate * 100).toFixed(0)}% group discount</span>
                          )}
                        </div>
                      </div>
                      <a href="tel:7186742647" className="block mt-6">
                        <Button
                          className="w-full h-14 rounded-xl font-bold text-base bg-brand-600 hover:bg-brand-700 text-white"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          Call to Register Your Team
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
