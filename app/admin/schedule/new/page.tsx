import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ScheduleForm from "./client-form";

export default async function NewSchedulePage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const courses = await prisma.course.findMany({
    where: { active: true },
    select: { id: true, title: true }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Schedule New Class</h1>
        <p className="text-slate-400">Map a course to a specific date and time. This syncs directly to Google Calendar.</p>
      </div>

      <ScheduleForm courses={courses} />
    </div>
  );
}
