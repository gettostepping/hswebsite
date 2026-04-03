import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Hourglass,
  GraduationCap,
} from "lucide-react";
import { format, isPast, isFuture } from "date-fns";

export default async function MyCoursesPage() {
  const session = await getSession();
  if (!session?.user?.email)
    redirect("/api/auth/signin?callbackUrl=/my-courses");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/api/auth/signin?callbackUrl=/my-courses");

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { session: { include: { course: true } } },
    orderBy: { createdAt: "desc" },
  });

  const upcomingBookings = bookings.filter(
    (b) =>
      isFuture(new Date(b.session.date)) &&
      (b.status === "paid" || b.status === "CONFIRMED"),
  );
  const pastBookings = bookings.filter(
    (b) =>
      isPast(new Date(b.session.date)) &&
      (b.status === "paid" || b.status === "CONFIRMED"),
  );
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    paid: {
      label: "Confirmed",
      color: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      icon: CheckCircle2,
    },
    CONFIRMED: {
      label: "Confirmed",
      color: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      icon: CheckCircle2,
    },
    pending: {
      label: "Pending Payment",
      color: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
      icon: Hourglass,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-500/20 text-red-300 border border-red-500/30",
      icon: XCircle,
    },
  };

  function BookingCard({
    booking,
    isPastEvent,
  }: {
    booking: (typeof bookings)[0];
    isPastEvent?: boolean;
  }) {
    const config = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = config.icon;
    const classDate = new Date(booking.session.date);

    return (
      <div
        className={`bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden relative group transition-all hover:border-brand-500/40 ${
          isPastEvent ? "opacity-60" : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-1.5 h-full ${
            isPastEvent ? "bg-white/20" : "bg-brand-600"
          }`}
        />
        <div className="p-6 pl-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link href={`/courses/${booking.session.course.slug}`}>
                <h3 className="text-lg font-bold text-white hover:text-brand-300 transition-colors mb-2 line-clamp-1">
                  {booking.session.course.title}
                </h3>
              </Link>
              <div className="space-y-1.5 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="font-medium">
                    {format(classDate, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span>
                    {booking.session.startTime} — {booking.session.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {booking.session.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <span
                className={`${config.color} font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1.5`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {config.label}
              </span>
              {isPastEvent && (
                <span className="bg-white/10 text-slate-400 border border-white/15 text-xs px-3 py-1 rounded-full">
                  Completed
                </span>
              )}
              {booking.paymentProvider && (
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  via {booking.paymentProvider}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Booking #{booking.id.slice(-8).toUpperCase()}
            </span>
            {booking.amount && (
              <span className="text-xs font-semibold text-slate-400">
                ${Number(booking.amount).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#091729] pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              My Courses
            </h1>
          </div>
          <p className="text-slate-400 ml-[52px]">
            Welcome back,{" "}
            <span className="font-semibold text-white">
              {user.name || user.email.split("@")[0]}
            </span>
            . Here are your registered training sessions.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-[#0f2a44] border border-white/10 rounded-xl p-5 text-center">
            <p className="text-3xl font-black text-brand-400">
              {upcomingBookings.length}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Upcoming
            </p>
          </div>
          <div className="bg-[#0f2a44] border border-white/10 rounded-xl p-5 text-center">
            <p className="text-3xl font-black text-emerald-400">
              {pastBookings.length}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Completed
            </p>
          </div>
          <div className="bg-[#0f2a44] border border-white/10 rounded-xl p-5 text-center">
            <p className="text-3xl font-black text-white">{bookings.length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Total
            </p>
          </div>
        </div>

        {/* Pending Section */}
        {pendingBookings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Hourglass className="w-5 h-5 text-amber-300" />
              <span className="text-amber-300">
                Pending Payment ({pendingBookings.length})
              </span>
            </h2>
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-brand-400" />
            Upcoming Classes ({upcomingBookings.length})
          </h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-10 text-center">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-400 mb-2">
                No Upcoming Classes
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                You don&apos;t have any upcoming training sessions. Browse our
                courses to register.
              </p>
              <Button
                asChild
                className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-8 font-bold"
              >
                <Link href="/pricing">
                  Browse Courses <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Completed Section */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-400 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              Completed ({pastBookings.length})
            </h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isPastEvent />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
