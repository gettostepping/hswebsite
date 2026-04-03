import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  DollarSign,
  Calendar as CalendarIcon,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import CourseCalendarPreview from "./course-calendar";

interface CoursePageProps {
  params: { slug: string };
}

async function getCourse(slug: string) {
  try {
    return await prisma.course.findUnique({
      where: { slug, active: true },
      include: {
        sessions: {
          where: {
            active: true,
            date: { gte: new Date() },
          },
          orderBy: { date: "asc" },
          take: 60,
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: "Course Not Found" };

  return {
    title: course.title,
    description: course.description.slice(0, 160),
  };
}

export async function generateStaticParams() {
  try {
    const courses = await prisma.course.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return courses.map((c: any) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="bg-[#091729] min-h-screen selection:bg-brand-500/30 font-sans">
      {/* Hero Header */}
      <section className="bg-[#0b1f3a] pt-16 pb-14 sm:pt-20 sm:pb-20 border-b border-white/10 relative overflow-hidden">
        <div className="container-narrow relative z-10 px-4">
          <Link
            href="/pricing"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-8 transition-colors group px-4 py-2 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </Link>

          <span className="mb-6 inline-block bg-brand-600/20 text-brand-300 border border-brand-600/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
            {course.category}
          </span>

          <h1 className="text-white font-black text-4xl sm:text-5xl lg:text-6xl mb-8 tracking-tight leading-tight">
            {course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 font-medium">
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl">
              <Clock className="w-5 h-5 text-brand-400" />
              {course.duration}
            </span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl">
              <DollarSign className="w-5 h-5 text-brand-400" />
              Starting at {formatCurrency(course.priceOriginal)}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#091729]">
        <div className="container-narrow relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-4">
                  Course Overview
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                {/* What You'll Learn */}
                <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
                  <h3 className="text-white font-bold text-xl mb-6">
                    What You&apos;ll Learn
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Hands-on CPR techniques for adults, children, and infants",
                      "Proper use of AED (Automated External Defibrillator)",
                      "Recognition of life-threatening emergencies",
                      "Team-based resuscitation skills",
                      "Current AHA Guidelines techniques",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="text-brand-400 w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-400 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What's Included */}
                <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
                  <h3 className="text-white font-bold text-xl mb-6">
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Professional instruction from certified healthcare providers",
                      "All training materials and equipment provided",
                      "AHA eCard certification upon completion",
                      "2-year certification validity",
                      "Skills practice with modern manikins",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="text-brand-400 w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-400 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-32 h-fit">
              {/* Pricing Card */}
              <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8 shadow-xl shadow-black/30">
                <h3 className="text-brand-400 font-semibold tracking-widest uppercase text-xs mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  Course Pricing
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-end pb-4 border-b border-white/10">
                    <span className="text-slate-400 font-medium">
                      Original cert
                    </span>
                    <span className="text-white font-black text-4xl">
                      {formatCurrency(course.priceOriginal)}
                    </span>
                  </div>
                  {course.priceRenewal && (
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-slate-400 font-medium">
                        Renewal
                      </span>
                      <span className="text-brand-400 font-bold text-2xl">
                        {formatCurrency(course.priceRenewal)}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  asChild
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white h-14 rounded-xl text-base font-bold"
                >
                  <Link href={`/booking/${course.slug}`}>
                    <CalendarIcon className="w-5 h-5 mr-3" />
                    Register Now
                  </Link>
                </Button>

                <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
                  Have a group of 5 or more?{" "}
                  <Link
                    href="/corporate"
                    className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
                  >
                    Ask about corporate rates
                  </Link>
                  .
                </p>
              </div>

              {/* Upcoming Sessions Preview */}
              {course.sessions.length > 0 && (
                <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                  <h3 className="text-slate-400 font-semibold tracking-widest uppercase text-xs mb-4">
                    Upcoming Openings
                  </h3>
                  <CourseCalendarPreview
                    sessions={course.sessions}
                    slug={course.slug}
                  />
                  <p className="text-slate-500 text-xs mt-2 text-center">
                    Dates highlighted in red hold available bookings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
