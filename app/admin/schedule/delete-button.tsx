"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteClassSession } from "@/actions/admin-schedule";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function DeleteSessionButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="icon"
      className="h-8 w-8 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this schedule block? It will also be removed from Google Calendar.")) {
          startTransition(async () => {
            const result = await deleteClassSession(id);
            if (result.success) {
              toast.success("Schedule block deleted");
            } else {
              toast.error(result.error);
            }
          });
        }
      }}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
