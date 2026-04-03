import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import DeleteCourseButton from "./delete-button";
import CourseStatusSwitch from "./status-switch";
import EditCourseModal from "./edit-modal";

export default async function AdminProductsPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Products & Prices</h1>
          <p className="text-slate-400">Manage your course catalog and synchronize with Stripe.</p>
        </div>
        <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-900/40">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Course
          </Link>
        </Button>
      </div>

      <div className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Course Title</th>
                <th className="px-6 py-4 font-medium">Original Price</th>
                <th className="px-6 py-4 font-medium">Renewal Price</th>
                <th className="px-6 py-4 font-medium">Stripe Status</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No courses found. Create one to get started!
                  </td>
                </tr>
              )}
              {courses.map((course: any) => (
                <tr key={course.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.category} • {course.duration}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{formatCurrency(course.priceOriginal)}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {course.priceRenewal ? formatCurrency(course.priceRenewal) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {course.stripeProductId ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">Synced</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-xs">Unsynced</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <CourseStatusSwitch id={course.id} initialStatus={course.active} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <EditCourseModal course={course} />
                       <DeleteCourseButton id={course.id} />
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
