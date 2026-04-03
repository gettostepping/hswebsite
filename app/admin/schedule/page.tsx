import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Calendar as CalendarIcon, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import DeleteSessionButton from "./delete-button";

export default async function AdminSchedulePage() {
  const sessions = await prisma.classSession.findMany({
    orderBy: { date: "desc" },
    include: {
      course: { select: { title: true, category: true } }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Class Schedule</h1>
          <p className="text-slate-400">Manage class dates and synchronize with your Google Calendar.</p>
        </div>
        <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-900/40">
          <Link href="/admin/schedule/new">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Class
          </Link>
        </Button>
      </div>

      <div className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Course Mapping</th>
                <th className="px-6 py-4 font-medium">Instructor & Location</th>
                <th className="px-6 py-4 font-medium">Capacity / Bookings</th>
                <th className="px-6 py-4 font-medium">Google Sync</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No active schedule blocks. Create one to get started!
                  </td>
                </tr>
              )}
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white flex items-center gap-2">
                       <CalendarIcon className="w-4 h-4 text-brand-400" />
                       {format(new Date(session.date), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{session.startTime} — {session.endTime}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-medium text-white line-clamp-1">{session.course.title}</p>
                     <p className="text-xs text-slate-500 mt-0.5">{session.course.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{session.instructorName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {session.location}</p>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-white font-medium">
                        <Users className="w-4 h-4 text-brand-400" />
                        {session.enrolledCount} / {session.capacity}
                     </div>
                     {session.enrolledCount >= session.capacity && (
                        <Badge variant="outline" className="mt-2 text-xs bg-red-500/20 text-red-400 border-red-500/30">Full</Badge>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    {session.googleEventId ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">Synced</Badge>
                    ) : (
                      <Badge variant="outline" className="border-white/10 text-slate-500 bg-white/5 text-xs shadow-none">None</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <DeleteSessionButton id={session.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
