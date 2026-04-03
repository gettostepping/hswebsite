import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookingCalendar from "./calendar";

export default async function CourseBookingPage({
  params,
}: {
  params: { courseSlug: string };
}) {
  const course = await prisma.course.findUnique({
    where: { slug: params.courseSlug },
  });

  if (!course || !course.active) {
    notFound();
  }

  // Fetch all upcoming class sessions for this course
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSessions = await prisma.classSession.findMany({
    where: {
      courseId: course.id,
      date: { gte: today },
      active: true,
    },
    orderBy: { date: "asc" },
  });

  // Filter out sessions that are full
  const availableSessions = upcomingSessions.filter(
    (s) => s.enrolledCount < s.capacity,
  );

  return (
    <main className="min-h-screen bg-[#091729] pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Select a Date
          </h1>
          <p className="text-slate-400 text-lg">
            Choose an available training day for{" "}
            <span className="text-brand-400 font-semibold">{course.title}</span>
            .
          </p>
        </div>

        <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/40">
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-400">Loading...</div>}>
            <BookingCalendar course={course} sessions={availableSessions} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
