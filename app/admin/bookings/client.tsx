"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, ShoppingCart, Mail, Phone, Calendar as CalendarIcon, DollarSign } from "lucide-react";

export default function AdminBookingsClient({ initialBookings }: { initialBookings: any[] }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = initialBookings.filter((b) => {
    // Status filter
    if (filter !== "all") {
      if (filter === "paid" && b.status !== "paid" && b.status !== "CONFIRMED") return false;
      if (filter !== "paid" && b.status !== filter) return false;
    }
    
    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const userName = (b.user?.name || b.guestName || "").toLowerCase();
      const userEmail = (b.user?.email || b.guestEmail || "").toLowerCase();
      const courseTitle = (b.session.course.title || "").toLowerCase();
      
      if (!userName.includes(q) && !userEmail.includes(q) && !courseTitle.includes(q)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── Toolbar ── */}
      <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl shadow-black/10">
        <div className="flex gap-2 w-full md:w-auto p-1 bg-white/5 rounded-xl border border-white/5">
          {["all", "paid", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors capitalize flex-1 md:flex-none ${
                filter === status 
                  ? "bg-brand-600 text-white shadow-md" 
                  : "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0b1f3a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
          />
        </div>
      </div>

      {/* ── Bookings Table ── */}
      <div className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden block overflow-x-auto shadow-xl shadow-black/10">
        <div className="min-w-[800px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-48">Transaction Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest min-w-[200px]">Student Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Class Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right w-36">Total & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <ShoppingCart className="w-10 h-10 text-slate-600/50 mx-auto mb-4" />
                    <p className="text-white font-bold text-lg mb-1">No bookings found</p>
                    {searchQuery && <p className="text-sm text-slate-500">Try adjusting your search criteria</p>}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5 align-top">
                      <p className="text-sm font-bold text-white mb-0.5">{format(new Date(b.createdAt), "MMM d, yyyy")}</p>
                      <p className="text-xs text-slate-500 font-medium">{format(new Date(b.createdAt), "h:mm a")}</p>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-700/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold flex-shrink-0 shadow-inner">
                          {(b.user?.name || b.guestName || b.user?.email || b.guestEmail || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                            {b.user?.name || b.guestName || "Unknown Name"}
                            {!b.user && <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold bg-[#091729] text-brand-400 border border-white/5">Guest</span>}
                          </p>
                          <div className="space-y-1">
                            {b.user?.email || b.guestEmail ? (
                              <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 truncate">
                                <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" /> {b.user?.email || b.guestEmail}
                              </p>
                            ) : null}
                            {b.user?.phone || b.guestPhone ? (
                              <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 truncate">
                                <Phone className="w-3 h-3 text-slate-500 flex-shrink-0" /> {b.user?.phone || b.guestPhone}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <p className="text-sm font-bold text-white mb-1.5">
                        {b.session.course.title}
                      </p>
                      <p className="text-xs text-brand-400 font-bold flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {format(new Date(b.session.date), "EEE, MMM d, yyyy")} <span className="text-slate-600 mx-0.5">·</span> {b.session.startTime}
                      </p>
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                      <div className="flex flex-col items-end gap-2.5">
                        <p className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-slate-400" />{b.amount?.toFixed(2) || "0.00"}
                        </p>
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-wider border shadow-sm ${
                          b.status === "paid" || b.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : b.status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {b.status} {b.paymentProvider === "PAYPAL" ? "(PP)" : "(STRIPE)"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
