"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { updateCourse } from "@/actions/admin-products";
import { toast } from "sonner";
import { Save, Loader2, Edit, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ScheduleRule } from "@/lib/scheduling";

export default function EditCourseModal({ course }: { course: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const defaultRule: ScheduleRule = course.schedulingRules || {
    frequency: "weekly",
    daysOfWeek: [1, 3, 5],
    startTime: "09:00",
    endTime: "13:00",
    capacity: 12,
    location: "Main Training Center",
    instructorName: "Primary Instructor",
    exceptionsAdded: [],
    exceptionsRemoved: []
  };

  const [rule, setRule] = useState<ScheduleRule>(defaultRule);
  const [removedDates, setRemovedDates] = useState<Date[]>(defaultRule.exceptionsRemoved.map((d: string) => new Date(d + "T00:00:00")));
  const [addedDates, setAddedDates] = useState<Date[]>(defaultRule.exceptionsAdded.map((d: string) => new Date(d + "T00:00:00")));

  const toggleDay = (day: number) => {
    setRule(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort()
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Inject the scheduling rule JSON
    const finalRule: ScheduleRule = {
       ...rule,
       exceptionsAdded: addedDates && addedDates.length > 0 ? addedDates.filter(d => d).map(d => format(d, "yyyy-MM-dd")) : [],
       exceptionsRemoved: removedDates && removedDates.length > 0 ? removedDates.filter(d => d).map(d => format(d, "yyyy-MM-dd")) : []
    };
    formData.append("schedulingRules", JSON.stringify(finalRule));

    const result = await updateCourse(course.id, formData);

    if (result.success) {
      toast.success("Course updated & schedules synced!");
      setOpen(false);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  }

  const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 border-white/10 bg-transparent">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-[#0f2a44] border-white/10 font-sans max-h-[90vh] overflow-y-auto w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-white">Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 p-1 rounded-xl">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400 rounded-lg">Basic Info</TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-brand-600 data-[state=active]:text-white text-slate-400 rounded-lg"><CalendarDays className="w-4 h-4 mr-2"/> Recurring Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" forceMount hidden={activeTab !== "basic"} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Course Title</Label>
                  <Input id="title" name="title" defaultValue={course.title} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-slate-300">URL Slug</Label>
                  <Input id="slug" name="slug" defaultValue={course.slug} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea id="description" name="description" defaultValue={course.description} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500 min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-300">Duration</Label>
                  <Input id="duration" name="duration" defaultValue={course.duration} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-300">Category Tag</Label>
                  <Input id="category" name="category" defaultValue={course.category} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceOriginal" className="text-slate-300">Original Price ($)</Label>
                  <Input id="priceOriginal" name="priceOriginal" type="number" step="0.01" defaultValue={course.priceOriginal} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceRenewal" className="text-slate-300">Renewal Price ($)</Label>
                  <Input id="priceRenewal" name="priceRenewal" type="number" step="0.01" defaultValue={course.priceRenewal || ""} className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="imageUrl" className="text-slate-300">Image URL [Optional]</Label>
                  <Input id="imageUrl" name="imageUrl" type="url" defaultValue={course.imageUrl || ""} className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                </div>
                <div className="flex items-center space-x-3 bg-white/5 p-4 border border-white/10 rounded-lg md:col-span-2">
                  <Switch id="active" name="active" value="true" defaultChecked={course.active} />
                  <div className="space-y-1">
                    <Label htmlFor="active" className="text-white">Active Status</Label>
                    <p className="text-xs text-slate-500">If active, this course will be bookable on the website.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" forceMount hidden={activeTab !== "schedule"} className="space-y-6">
              <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
                 <h4 className="font-bold text-white mb-2">Automated Schedule Generator</h4>
                 <p className="text-sm text-slate-400 mb-8">Configure a recurring rule below. When you save, the system will automatically generate exact database entries for the next 12 months based on this rule, skipping any dates you remove and adding any dates you explicitly pick. This integrates perfectly with the existing booking features.</p>
                 
                 <div className="space-y-8">
                    {/* Top Section: Form Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-5">
                         <div>
                           <Label className="text-slate-300 mb-2 block">Frequency</Label>
                           <select 
                             value={rule.frequency} 
                             onChange={e => setRule({...rule, frequency: e.target.value as any})}
                             className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                           >
                              <option value="weekly" className="bg-[#0f2a44] text-white">Every Week</option>
                              <option value="biweekly" className="bg-[#0f2a44] text-white">Every Other Week</option>
                              <option value="daily" className="bg-[#0f2a44] text-white">Every Day</option>
                           </select>
                         </div>

                         {(rule.frequency === "weekly" || rule.frequency === "biweekly") && (
                           <div>
                             <Label className="text-slate-300 mb-2 block">Active Days of Week</Label>
                             <div className="flex flex-wrap gap-2">
                               {daysLabels.map((tag, i) => (
                                 <Button
                                   key={i}
                                   type="button"
                                   variant={rule.daysOfWeek.includes(i) ? "default" : "outline"}
                                   className={rule.daysOfWeek.includes(i) ? "bg-brand-600 text-white hover:bg-brand-700" : "text-slate-400 border-white/10 hover:bg-white/10 hover:text-white bg-transparent"}
                                   onClick={() => toggleDay(i)}
                                 >
                                   {tag}
                                 </Button>
                               ))}
                             </div>
                           </div>
                         )}

                         <div className="space-y-2">
                            <Label className="text-slate-300">Location</Label>
                            <Input value={rule.location} onChange={e => setRule({...rule, location: e.target.value})} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                         </div>
                       </div>
                       
                       <div className="space-y-5">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label className="text-slate-300">Start Time</Label>
                              <Input type="time" value={rule.startTime} onChange={e => setRule({...rule, startTime: e.target.value})} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500 [color-scheme:dark]" />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-slate-300">End Time</Label>
                              <Input type="time" value={rule.endTime} onChange={e => setRule({...rule, endTime: e.target.value})} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500 [color-scheme:dark]" />
                           </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label className="text-slate-300">Class Capacity</Label>
                              <Input type="number" min="1" value={rule.capacity} onChange={e => setRule({...rule, capacity: parseInt(e.target.value)})} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-slate-300">Instructor Name</Label>
                              <Input value={rule.instructorName} onChange={e => setRule({...rule, instructorName: e.target.value})} required className="bg-white/5 border-white/10 text-white focus-visible:ring-brand-500" />
                           </div>
                         </div>
                       </div>
                    </div>

                    {/* Bottom Section: Calendars */}
                    <div className="pt-6 border-t border-white/10">
                       <Label className="text-white font-bold block text-center mb-6 text-lg">Calendar Exceptions</Label>
                       <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:items-start p-4 bg-white/5 rounded-2xl">
                         <div className="flex flex-col items-center p-4 rounded-xl shadow-sm">
                            <span className="text-sm font-bold text-red-400 mb-3 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">Blackout Dates (Remove)</span>
                            <Calendar
                              mode="multiple"
                              selected={removedDates}
                              onSelect={setRemovedDates as any}
                              className="bg-transparent border-0 text-white"
                              classNames={{
                                head_cell: "text-slate-400 font-normal w-9",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent hover:bg-white/10 rounded-md",
                                nav_button: "text-slate-400 hover:text-white hover:bg-white/10 rounded-md p-1",
                                caption_label: "text-white font-medium",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 aria-selected:bg-red-500 aria-selected:text-white hover:bg-white/10 rounded-md",
                              }}
                            />
                         </div>
                         <div className="flex flex-col items-center p-4 rounded-xl shadow-sm">
                            <span className="text-sm font-bold text-emerald-400 mb-3 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">Extra Dates (Add)</span>
                            <Calendar
                              mode="multiple"
                              selected={addedDates}
                              onSelect={setAddedDates as any}
                              className="bg-transparent border-0 text-white"
                              classNames={{
                                head_cell: "text-slate-400 font-normal w-9",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent hover:bg-white/10 rounded-md",
                                nav_button: "text-slate-400 hover:text-white hover:bg-white/10 rounded-md p-1",
                                caption_label: "text-white font-medium",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 aria-selected:bg-emerald-500 aria-selected:text-white hover:bg-white/10 rounded-md",
                              }}
                            />
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end pt-4 border-t border-white/10">
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white w-40 h-10 font-bold" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Save & Sync</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
