import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CourseForm from "./client-form";

export default async function NewProductPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Add New Course</h1>
        <p className="text-slate-400">Create a new course catalog entry. This will automatically sync to Stripe.</p>
      </div>

      <CourseForm />
    </div>
  );
}
