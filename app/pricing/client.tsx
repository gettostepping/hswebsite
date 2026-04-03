"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle2, ArrowRight, Search } from "lucide-react";

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

export function PricingClient({ courses }: { courses: Course[] }) {
  const [category, setCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(courses.map((c) => c.category))),
  ];
  const filteredCourses = courses.filter(
    (c) => category === "All" || c.category === category,
  );


  return (
    <div className="bg-[#091729] min-h-screen text-white selection:bg-brand-500/30 font-sans pb-24">
      {/* Hero */}
      <section className="bg-[#0b1f3a] pt-16 pb-12 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">
            Pricing &amp; Courses
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Course Rates
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Competitive rates for professional-quality training. All prices
            include materials, instruction, and AHA certification.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="original" className="w-full">
            {/* Tab switcher */}
            <div className="flex justify-center mb-10">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/5 border border-white/10 p-1.5 rounded-xl h-auto">
                <TabsTrigger
                  value="original"
                  className="py-2.5 rounded-lg data-[state=active]:bg-brand-600 data-[state=active]:text-white text-slate-400 font-bold transition-all"
                >
                  Original
                </TabsTrigger>
                <TabsTrigger
                  value="renewal"
                  className="py-2.5 rounded-lg data-[state=active]:bg-brand-600 data-[state=active]:text-white text-slate-400 font-bold transition-all"
                >
                  Renewal
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Original tab ── */}
            <TabsContent value="original" className="mt-0 outline-none">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course, idx) => {
                    const isPopular = idx === 1 && category === "All";
                    return (
                      <div
                        key={course.id}
                        className={`relative bg-[#0f2a44] border rounded-2xl p-8 flex flex-col hover:border-brand-500/40 hover:shadow-xl hover:shadow-black/30 transition-all ${
                          isPopular ? "border-brand-500/60" : "border-white/10"
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                            <span className="bg-brand-600 text-white font-bold px-3 py-1 rounded-full text-xs whitespace-nowrap">
                              Most Popular
                            </span>
                          </div>
                        )}

                        {/* Category badge */}
                        <span className="self-start mb-6 bg-brand-600/20 text-brand-300 border border-brand-600/30 rounded-full px-3 py-1 text-xs font-bold">
                          {course.category}
                        </span>

                        {/* Title */}
                        <Link href={`/courses/${course.slug}`}>
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 hover:text-brand-300 transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-6 border-b border-white/10 pb-6">
                          <span className="text-4xl font-black text-white">
                            {formatCurrency(course.priceOriginal)}
                          </span>
                          <span className="text-sm font-medium text-slate-500">
                            / person
                          </span>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 text-sm px-3 py-1.5 rounded-lg w-fit mb-6">
                          <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
                          {course.duration}
                        </div>

                        {/* Feature list */}
                        <ul className="space-y-3 mb-8 flex-grow">
                          {[
                            "Professional instruction",
                            "All materials included",
                            "AHA eCard certification",
                            "Hands-on practice",
                            "2-year validity",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 w-4 h-4 text-brand-400 flex-shrink-0" />
                              <span className="text-sm text-slate-400 leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <Button
                          asChild
                          className={`w-full h-12 rounded-lg text-base font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all ${
                            isPopular ? "shadow-lg shadow-brand-900/50" : ""
                          }`}
                        >
                          <Link href={`/booking/${course.slug}`}>
                            Register Now
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                  <Search className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-slate-400">
                    Try selecting a different category filter.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* ── Renewal tab ── */}
            <TabsContent value="renewal" className="mt-0 outline-none">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="relative bg-[#0f2a44] border border-white/10 rounded-2xl p-8 flex flex-col hover:border-brand-500/40 hover:shadow-xl hover:shadow-black/30 transition-all"
                    >
                      {/* Category badge */}
                      <span className="self-start mb-6 bg-brand-600/20 text-brand-300 border border-brand-600/30 rounded-full px-3 py-1 text-xs font-bold">
                        {course.category}
                      </span>

                      {/* Title */}
                      <Link href={`/courses/${course.slug}`}>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 hover:text-brand-300 transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                      </Link>

                      {course.priceRenewal ? (
                        <>
                          {/* Renewal price */}
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-black text-white">
                              {formatCurrency(course.priceRenewal)}
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                              / person
                            </span>
                          </div>

                          {/* Strikethrough + save badge */}
                          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 border-b border-white/10 pb-6">
                            <span className="line-through text-slate-500">
                              {formatCurrency(course.priceOriginal)}
                            </span>
                            <span className="bg-brand-600/20 text-brand-300 border border-brand-600/30 text-xs px-2 py-0.5 rounded">
                              Save {formatCurrency(course.priceOriginal - course.priceRenewal)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Original price (no renewal discount) */}
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-black text-white">
                              {formatCurrency(course.priceOriginal)}
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                              / person
                            </span>
                          </div>
                          <div className="mb-6 border-b border-white/10 pb-6">
                            <span className="bg-slate-700/50 text-slate-400 border border-slate-600/40 text-xs px-2 py-0.5 rounded">
                              No renewal discount
                            </span>
                          </div>
                        </>
                      )}

                      {/* Duration */}
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 text-sm px-3 py-1.5 rounded-lg w-fit mb-6">
                        <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
                        {course.duration}
                      </div>

                      {/* Feature list */}
                      <ul className="space-y-3 mb-8 flex-grow">
                        {(course.priceRenewal
                          ? [
                              "Current certification required",
                              "Streamlined curriculum",
                              "AHA eCard renewal",
                              "Updated guidelines",
                            ]
                          : [
                              "Professional instruction",
                              "All materials included",
                              "AHA eCard certification",
                              "Hands-on practice",
                              "2-year validity",
                            ]
                        ).map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 w-4 h-4 text-brand-400 flex-shrink-0" />
                            <span className="text-sm text-slate-400 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Button
                        asChild
                        className="w-full h-12 rounded-lg text-base font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all"
                      >
                        <Link href={`/booking/${course.slug}`}>
                          Register Now
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                  <Search className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-slate-400">
                    Try selecting a different category filter.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Group CTA banner */}
          <div className="mt-20 bg-brand-600 rounded-2xl p-10 sm:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
              Need Group Training?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              We offer special rates for groups of 5 or more. Contact us for a
              customized corporate training proposal tailored to your needs.
            </p>
            <Button
              asChild
              size="lg"
              className="h-14 px-8 rounded-lg bg-[#091729] hover:bg-[#0b1f3a] text-white font-bold text-base"
            >
              <Link href="/corporate">
                Request Corporate Pricing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
