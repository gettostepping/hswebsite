"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { updateCourseStatus } from "@/actions/admin-products";
import { toast } from "sonner";

export default function CourseStatusSwitch({ id, initialStatus }: { id: string; initialStatus: boolean }) {
  const [active, setActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={active}
        disabled={loading}
        onCheckedChange={async (checked) => {
          setActive(checked);
          setLoading(true);
          try {
            const result = await updateCourseStatus(id, checked);
            if (result.success) {
               toast.success(`Course marked as ${checked ? "Active" : "Archived"}`);
            } else {
               setActive(!checked);
               toast.error(result.error);
            }
          } catch {
            setActive(!checked);
            toast.error("Failed to update status.");
          }
          setLoading(false);
        }}
        className="shadow-sm"
      />
      <span className={active ? "text-emerald-400 font-medium text-xs" : "text-slate-500 font-medium text-xs"}>
         {active ? "Active" : "Archived"}
      </span>
    </div>
  );
}
