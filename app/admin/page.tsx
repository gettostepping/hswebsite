import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { format, isToday, isTomorrow, addDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Users,
  ShoppingCart,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Activity,
  MessageSquare,
  Building2,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import AdminOverviewClient from "./overview-client";

export default async function AdminOverviewPage() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekEnd = endOfDay(addDays(now, 7));
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    courseCount,
    activeCourseCount,
    totalSessionCount,
    upcomingSessionCount,
    bookingCount,
    paidBookingCount,
    pendingBookingCount,
    settings,
    todaySessions,
    upcomingWeekSessions,
    recentBookings,
    contactMessages,
    corporateInquiries,
    monthlyBookings,
    userCount,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { active: true } }),
    prisma.classSession.count(),
    prisma.classSession.count({ where: { date: { gte: todayStart } } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: { in: ["paid", "CONFIRMED"] } } }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.siteSettings.findUnique({ where: { id: "global" } }),
    prisma.classSession.findMany({
      where: { date: { gte: todayStart, lte: todayEnd } },
      include: { course: { select: { title: true, category: true } } },
      orderBy: { startTime: "asc" },
    }),
    prisma.classSession.findMany({
      where: { date: { gte: todayStart, lte: weekEnd } },
      include: {
        course: { select: { title: true, category: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        session: {
          select: {
            date: true,
            startTime: true,
            course: { select: { title: true } },
          },
        },
      },
    }),
    prisma.contactMessage.count(),
    prisma.corporateInquiry.count(),
    prisma.booking.count({
      where: { createdAt: { gte: monthStart, lte: monthEnd }, status: { in: ["paid", "CONFIRMED"] } },
    }),
    prisma.user.count(),
  ]);

  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0f2a44] to-[#162d4a] border border-white/10 rounded-2xl p-8 md:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-60 h-60 bg-blue-500/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-2">
                {format(now, "EEEE, MMMM d, yyyy")}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                {greeting}, {session.user.name?.split(" ")[0] || "Admin"} 👋
              </h1>
              <p className="text-slate-400 text-base max-w-lg">
                {todaySessions.length > 0
                  ? `You have ${todaySessions.length} class${todaySessions.length > 1 ? "es" : ""} scheduled today. ${pendingBookingCount > 0 ? `${pendingBookingCount} booking${pendingBookingCount > 1 ? "s" : ""} need attention.` : "All bookings are up to date."}`
                  : `No classes scheduled today. ${upcomingSessionCount > 0 ? `${upcomingSessionCount} upcoming sessions on the calendar.` : "Consider scheduling some classes."}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/schedule/new"
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-brand-900/40"
              >
                <CalendarIcon className="w-4 h-4" />
                Schedule Class
              </Link>
              <Link
                href="/admin/products/new"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-sm transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Add Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Courses",
            value: activeCourseCount,
            total: courseCount,
            icon: BookOpen,
            color: "from-brand-500 to-brand-700",
            accent: "text-brand-400",
            href: "/admin/products",
          },
          {
            label: "Upcoming Classes",
            value: upcomingSessionCount,
            total: totalSessionCount,
            icon: CalendarIcon,
            color: "from-blue-500 to-blue-700",
            accent: "text-blue-400",
            href: "/admin/schedule",
          },
          {
            label: "Paid Bookings",
            value: paidBookingCount,
            total: bookingCount,
            icon: Users,
            color: "from-emerald-500 to-emerald-700",
            accent: "text-emerald-400",
            href: "/admin/bookings",
          },
          {
            label: "This Month",
            value: monthlyBookings,
            total: null,
            icon: TrendingUp,
            color: "from-violet-500 to-violet-700",
            accent: "text-violet-400",
            href: "/admin/bookings",
            suffix: "bookings",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-black/20 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <p className="text-xs text-slate-500">
                {stat.label}
                {stat.total !== null && stat.total !== undefined && (
                  <span className={`${stat.accent} ml-1`}>/ {stat.total} total</span>
                )}
                {stat.suffix && <span className={`${stat.accent} ml-1`}>{stat.suffix}</span>}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column (2 cols) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Today&apos;s Schedule</h2>
                  <p className="text-xs text-slate-500">{format(now, "EEEE, MMM d")}</p>
                </div>
              </div>
              <Link href="/admin/schedule" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {todaySessions.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm">No classes scheduled today</p>
                  <Link href="/admin/schedule/new" className="text-xs text-brand-400 hover:text-brand-300 font-bold mt-2 inline-block">
                    Schedule a class →
                  </Link>
                </div>
              ) : (
                todaySessions.map((s: any) => (
                  <div key={s.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="text-center min-w-[52px]">
                      <div className="text-lg font-black text-white">{s.startTime}</div>
                      <div className="text-[10px] text-slate-500 uppercase">to {s.endTime}</div>
                    </div>
                    <div className="w-px h-10 bg-brand-600/50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{s.course.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s.enrolledCount}/{s.capacity}</span>
                      </div>
                    </div>
                    {s.enrolledCount >= s.capacity ? (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20">FULL</span>
                    ) : (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">OPEN</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming This Week */}
          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-sm font-bold text-white">Upcoming This Week</h2>
              </div>
              <Link href="/admin/schedule" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                Full Schedule <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {upcomingWeekSessions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-slate-500 text-sm">No upcoming sessions this week</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {upcomingWeekSessions.map((s: any) => {
                  const sessionDate = new Date(s.date);
                  const dayLabel = isToday(sessionDate) ? "Today" : isTomorrow(sessionDate) ? "Tomorrow" : format(sessionDate, "EEE, MMM d");
                  const fillPercent = s.capacity > 0 ? Math.round((s.enrolledCount / s.capacity) * 100) : 0;
                  return (
                    <div key={s.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/5 transition-colors">
                      <div className="min-w-[80px]">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isToday(sessionDate) ? "bg-brand-600/20 text-brand-400" : "bg-white/5 text-slate-400"}`}>
                          {dayLabel}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{s.course.title}</p>
                        <p className="text-xs text-slate-500">{s.startTime} – {s.endTime}</p>
                      </div>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${fillPercent >= 100 ? "bg-red-500" : fillPercent >= 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(fillPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{s.enrolledCount}/{s.capacity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-sm font-bold text-white">Recent Bookings</h2>
              </div>
              <Link href="/admin/bookings" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                All Bookings <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-slate-500 text-sm">No bookings yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentBookings.map((b: any) => (
                  <div key={b.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(b.user?.name || b.user?.email || b.guestName || b.guestEmail || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{b.user?.name || b.user?.email || b.guestName || b.guestEmail || "Unknown Guest"} {!b.user && <span className="ml-2 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">GUEST</span>}</p>
                      <p className="text-xs text-slate-500 truncate">{b.session.course.title} · {format(new Date(b.session.date), "MMM d")}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      b.status === "paid" || b.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : b.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (1 col) ── */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: "Products & Prices", desc: "Manage course catalog", icon: ShoppingCart, href: "/admin/products", color: "from-brand-500 to-brand-700" },
                { label: "Class Schedule", desc: "View & edit sessions", icon: CalendarIcon, href: "/admin/schedule", color: "from-blue-500 to-blue-700" },
                { label: "Bookings", desc: "Student registrations", icon: Users, href: "/admin/bookings", color: "from-emerald-500 to-emerald-700" },
                { label: "Settings", desc: "System configuration", icon: Settings, href: "/admin/settings", color: "from-slate-500 to-slate-700" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${settings?.maintenanceMode ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                  <span className="text-sm text-slate-300">Site Status</span>
                </div>
                <span className={`text-xs font-bold ${settings?.maintenanceMode ? "text-amber-400" : "text-emerald-400"}`}>
                  {settings?.maintenanceMode ? "Maintenance" : "Online"}
                </span>
              </div>
              <AdminOverviewClient initialSettings={settings || {}} />
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Registered Users</span>
                  <span className="text-white font-bold">{userCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Courses</span>
                  <span className="text-white font-bold">{courseCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Sessions</span>
                  <span className="text-white font-bold">{totalSessionCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inbox Summary */}
          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Messages & Inquiries
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Contact Messages</p>
                    <p className="text-xs text-slate-500">Total received</p>
                  </div>
                </div>
                <span className="text-lg font-black text-white">{contactMessages}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Corporate Inquiries</p>
                    <p className="text-xs text-slate-500">Total received</p>
                  </div>
                </div>
                <span className="text-lg font-black text-white">{corporateInquiries}</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {pendingBookingCount > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-400 mb-1">Pending Bookings</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pendingBookingCount} booking{pendingBookingCount > 1 ? "s" : ""} with pending payment status. These may need follow-up.
                  </p>
                  <Link href="/admin/bookings" className="text-xs text-amber-400 hover:text-amber-300 font-bold mt-2 inline-flex items-center gap-1">
                    Review Bookings <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
