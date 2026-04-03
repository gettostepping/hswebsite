"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCourse } from "@/actions/admin-products";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CourseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createCourse(formData);

    if (result.success) {
      toast.success("Course synced to Stripe and saved!");
      router.push("/admin/products");
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-slate-300">Course Title</Label>
          <Input id="title" name="title" required className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="e.g. Basic Life Support (BLS)" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-slate-300">URL Slug</Label>
          <Input id="slug" name="slug" required className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="e.g. bls-cpr" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-slate-300">Description</Label>
          <Textarea id="description" name="description" required className="min-h-[100px] bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="Detailed course description..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-slate-300">Duration</Label>
          <Input id="duration" name="duration" required className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="e.g. 4 Hours" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-slate-300">Category Tag</Label>
          <Input id="category" name="category" required className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="e.g. Healthcare Providers" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceOriginal" className="text-slate-300">Original Price ($)</Label>
          <Input id="priceOriginal" name="priceOriginal" type="number" step="0.01" required className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="85.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceRenewal" className="text-slate-300">Renewal Price ($) [Optional]</Label>
          <Input id="priceRenewal" name="priceRenewal" type="number" step="0.01" className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="65.00" />
        </div>
        <div className="space-y-2 md:col-span-2">
           <Label htmlFor="imageUrl" className="text-slate-300">Image URL [Optional]</Label>
           <Input id="imageUrl" name="imageUrl" type="url" className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl" placeholder="https://..." />
        </div>

        <div className="flex items-center space-x-3 bg-white/5 p-4 border border-white/10 rounded-xl md:col-span-2">
          <Switch id="active" name="active" value="true" defaultChecked />
          <div className="space-y-1">
            <Label htmlFor="active" className="text-white">Active Status</Label>
            <p className="text-xs text-slate-500">If active, this course will be bookable on the website.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button asChild variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
          <Link href="/admin/products"><ArrowLeft className="w-4 h-4 mr-2" /> Cancel</Link>
        </Button>
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white w-40 h-12 rounded-xl font-bold" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save & Sync</>}
        </Button>
      </div>
    </form>
  );
}
