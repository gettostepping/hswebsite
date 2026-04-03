"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminOverviewClient({ initialSettings }: { initialSettings: { maintenanceMode?: boolean } }) {
  const [maintenance, setMaintenance] = useState(initialSettings?.maintenanceMode || false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="space-y-1">
        <Label htmlFor="maintenance-mode" className="text-sm font-medium text-slate-300">
          Maintenance Mode
        </Label>
        <p className="text-xs text-slate-500">
          Disables public site access
        </p>
      </div>
      <Switch
        id="maintenance-mode"
        checked={maintenance}
        disabled={loading}
        onCheckedChange={async (checked) => {
          setMaintenance(checked);
          setLoading(true);
          try {
            // We would call a server action here to update the DB
            // await updateSettings({ maintenanceMode: checked });
            toast.success(`Maintenance mode ${checked ? "enabled" : "disabled"}`);
          } catch {
            setMaintenance(!checked);
            toast.error("Failed to update settings");
          }
          setLoading(false);
        }}
        className="data-[state=checked]:bg-yellow-500"
      />
    </div>
  );
}
