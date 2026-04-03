"use client";

import { Calendar } from "@/components/ui/calendar";
import { Day } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function CourseCalendarPreview({ sessions, slug }: { sessions: any[]; slug: string }) {
  const availableDates = sessions.map((s: any) => new Date(s.date));

  return (
    <Calendar
      mode="single"
      selected={undefined}
      className="rounded-xl border border-white/10 bg-[#0b1f3a] p-4"
      classNames={{
        caption_label: "text-lg font-bold text-white",
        nav_button: "h-8 w-8 bg-transparent p-0 text-white hover:text-white border-0 hover:bg-white/10 inline-flex items-center justify-center rounded-md transition-colors",
        day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 text-slate-300 hover:bg-white/10 hover:text-white inline-flex items-center justify-center rounded-md text-sm transition-colors",
        head_cell: "text-slate-400 rounded-md w-9 font-medium text-[0.85rem] pb-2",
        day_selected: "!bg-transparent",
        day_disabled: "text-slate-700 opacity-50 cursor-not-allowed",
        day_outside: "text-slate-700 opacity-50",
        cell: "text-center text-sm p-0 w-9 h-9 relative",
      }}
      disabled={(date) => {
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
        return !availableDates.some((d) => isSameDay(d, date));
      }}
      modifiers={{ available: availableDates }}
      modifiersClassNames={{
        available: "font-bold text-[#34d399] bg-[#10b981]/15 rounded-md",
      }}
      components={{
        Day: (dayProps) => {
          const { date } = dayProps;
          const session = sessions.find((s: any) => isSameDay(new Date(s.date), date));

          return (
            <div className="relative group/day w-9 h-9 flex items-center justify-center">
              <Day {...dayProps} />

              {session && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-4 bg-[#0f2a44] border border-white/10 text-white rounded-xl shadow-2xl opacity-0 group-hover/day:opacity-100 pointer-events-none group-hover/day:pointer-events-auto transition-all duration-200 z-[100] translate-y-2 group-hover/day:translate-y-0 text-left">
                  <div className="font-bold text-sm mb-1 text-white flex items-center justify-between">
                    <span>{format(new Date(session.date), "MMM d, yyyy")}</span>
                    <span className="text-xs px-2 py-0.5 bg-brand-600 rounded-full">
                      {session.capacity - session.enrolledCount} spots
                    </span>
                  </div>
                  <div className="text-xs text-brand-400 font-medium mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {session.startTime} - {session.endTime}
                  </div>
                  <div className="text-xs text-slate-400 mb-4 flex items-start gap-1 pb-3 border-b border-white/10">
                    <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{session.location}</span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white h-8 text-xs font-bold transition-transform active:scale-95 rounded-lg"
                  >
                    <Link href={`/booking/${slug}?date=${format(new Date(session.date), "yyyy-MM-dd")}`}>Register Now</Link>
                  </Button>
                  {/* Triangle Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0f2a44]" />
                </div>
              )}
            </div>
          );
        },
      }}
    />
  );
}
