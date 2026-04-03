"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClassSession } from "@/actions/admin-schedule";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CourseOption {
  id: string;
  title: string;
}

export default function ScheduleForm({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createClassSession(formData);

    if (result.success) {
      toast.success("Schedule successfully saved & synced!");
      router.push("/admin/schedule");
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="courseId" className="text-slate-300">Select Course Template</Label>
          <select 
            id="courseId" 
            name="courseId" 
            required 
            className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="" className="bg-[#0f2a44] text-slate-400">Select a course...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0f2a44] text-white">{c.title}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date" className="text-slate-300">Class Date</Label>
          <Input id="date" name="date" type="date" required className="h-12 bg-white/5 border border-white/10 text-white focus-visible:ring-brand-500 rounded-xl [color-scheme:dark]" />
        </div>
        
        <div className="space-y-2">
           {/* Empty spacer for alignment */}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-slate-300">Start Time</Label>
          <Input id="startTime" name="startTime" type="time" required className="h-12 bg-white/5 border border-white/10 text-white focus-visible:ring-brand-500 rounded-xl [color-scheme:dark]" defaultValue="09:00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-slate-300">End Time</Label>
          <Input id="endTime" name="endTime" type="time" required className="h-12 bg-white/5 border border-white/10 text-white focus-visible:ring-brand-500 rounded-xl [color-scheme:dark]" defaultValue="13:00" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="capacity" className="text-slate-300">Maximum Seats</Label>
          <Input id="capacity" name="capacity" type="number" min="1" max="100" required className="h-12 bg-white/5 border border-white/10 text-white focus-visible:ring-brand-500 rounded-xl" defaultValue="12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructorName" className="text-slate-300">Instructor Name</Label>
          <Input id="instructorName" name="instructorName" required className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="e.g. Sarah Conners" />
        </div>

        <div className="space-y-2 md:col-span-2">
           <Label htmlFor="location" className="text-slate-300">Training Location</Label>
           <Input id="location" name="location" required className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" defaultValue="3220 Church Avenue, Brooklyn NY 11226" />
        </div>
        
        <input type="hidden" name="active" value="true" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
          <Link href="/admin/schedule"><ArrowLeft className="w-4 h-4 mr-2" /> Cancel</Link>
        </Button>
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white w-48 h-12 rounded-xl font-bold" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Schedule & Sync</>}
        </Button>
      </div>
    </form>
  );
}
