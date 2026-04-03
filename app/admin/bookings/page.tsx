import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminBookingsClient from "./client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBookingsPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      session: {
        include: {
          course: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0f2a44] to-[#162d4a] border border-white/10 rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative">
          <p className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-2">Registration Tracker</p>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Bookings Overview</h1>
          <p className="text-slate-400 max-w-xl">Monitor and manage student registrations, payments, and class enrollments directly.</p>
        </div>
      </div>
      
      <AdminBookingsClient initialBookings={bookings} />
    </div>
  );
}
