"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Day } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { createCheckoutSession } from "@/actions/stripe";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPaypalOrder, capturePaypalOrder } from "@/actions/paypal";
import { getUserProfile, updateUserRegistrationInfo } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export default function BookingCalendar({
  course,
  sessions,
}: {
  course: any;
  sessions: any[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"selection" | "details" | "payment">("selection");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [registrationType, setRegistrationType] = useState<"ORIGINAL" | "RENEWAL">("ORIGINAL");

  const { data: sessionData } = useSession();
  const searchParams = useSearchParams();

  // Pre-select date from ?date= query param (e.g. coming from the courses page)
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      try {
        const parsed = parseISO(dateParam);
        const match = sessions.find((s) => isSameDay(new Date(s.date), parsed));
        if (match) {
          setSelectedDate(parsed);
          setSelectedSessionId(match.id);
          setStep("details");
        }
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserProfile().then((profile) => {
      if (profile) {
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          // @ts-ignore
          address: profile.address || "",
        });
      }
    });
  }, []);

  // Auto-update selectedSessionId when selectedDate changes so user can switch dates while paying
  useEffect(() => {
    if (selectedDate) {
      const sessionsOnDate = sessions.filter((s) => isSameDay(new Date(s.date), selectedDate));
      if (sessionsOnDate.length > 0) {
        setSelectedSessionId((prev) => {
          if (sessionsOnDate.some((s) => s.id === prev)) return prev;
          return sessionsOnDate[0].id;
        });
      } else {
        setSelectedSessionId(null);
        setStep("selection");
      }
    } else {
      setSelectedSessionId(null);
      setStep("selection");
    }
  }, [selectedDate, sessions]);

  // Map out dates that have sessions
  const availableDates = sessions.map((s) => new Date(s.date));

  // Find the sessions occurring on the selected date
  const selectedSessions = selectedDate
    ? sessions.filter((s) => isSameDay(new Date(s.date), selectedDate))
    : [];

  const router = useRouter();

  const handleCheckout = async (sessionId: string) => {
    setLoading(true);
    // Modified to pass formData if guest! But createCheckoutSession takes bookingId.
    // Wait, the new API has not changed createCheckoutSession parameters. 
    // We actually need to call createBooking(sessionId, formData) natively inside calendar, and THEN call createStripeCheckout(bookingId).
    // Or we update createCheckoutSession(sessionId, guestData).
    const result = await createCheckoutSession(sessionId, formData);
    if (result?.url) {
      window.location.href = result.url;
    } else {
      setLoading(false);
      toast.error(result?.error || "Checkout failed to initialize");
    }
  };

  const handlePaypalCreateOrder = async (sessionId: string) => {
    const result = await createPaypalOrder(sessionId, formData, registrationType);
    if (result.error || !result.orderId) {
      toast.error(result.error || "Failed to initiate PayPal");
      return "";
    }
    return result.orderId;
  };

  const handlePaypalApprove = async (
    data: any,
    actions: any,
    sessionId: string,
  ) => {
    setLoading(true);
    const result = await capturePaypalOrder(data.orderID, sessionId, formData);
    setLoading(false);

    if (result.success) {
      toast.success("Registration Confirmed!");
      router.push("/booking/success");
    } else {
      toast.error(result.error || "Payment failed");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pl-2 pr-2">
        {/* Interactive Calendar Side */}
        <div className="flex flex-col items-center w-full max-w-[420px] mx-auto">
          {selectedSessionId && step !== "selection" && (
            <div className="bg-[#0b1f3a] border border-brand-500/30 rounded-2xl p-5 mb-6 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-black/20">
               <div>
                  <div className="text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">Selected Class</div>
                  <div className="text-white font-bold text-lg leading-tight">
                    {format(new Date(sessions.find((s) => s.id === selectedSessionId)?.date || new Date()), "MMMM d, yyyy")}
                  </div>
                  <div className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" /> 
                    {sessions.find((s) => s.id === selectedSessionId)?.startTime} - {sessions.find((s) => s.id === selectedSessionId)?.endTime}
                  </div>
               </div>
               <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                  <div className={`font-black tracking-tight leading-none transition-colors ${registrationType === "ORIGINAL" || course.priceRenewal == null ? "text-2xl text-brand-400" : "text-lg text-slate-500"}`}>
                     ${course.priceOriginal} <span className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70">Original</span>
                  </div>
                  {course.priceRenewal != null && (
                    <div className={`font-black tracking-tight leading-none mt-1.5 transition-colors ${registrationType === "RENEWAL" ? "text-2xl text-brand-400" : "text-lg text-slate-500"}`}>
                       ${course.priceRenewal} <span className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70">Renewal</span>
                    </div>
                  )}
                  <Button variant="link" size="sm" className="h-auto p-0 text-slate-400 hover:text-white mt-3" onClick={() => setStep("selection")}>Change Time</Button>
               </div>
            </div>
          )}

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl border border-white/10 bg-[#0b1f3a] p-4"
            classNames={{
              caption_label: "text-lg font-bold text-white",
              nav_button: "h-8 w-8 bg-transparent p-0 text-white hover:text-white border-0 hover:bg-white/10 inline-flex items-center justify-center rounded-md transition-colors",
              day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 text-slate-300 hover:bg-white/10 hover:text-white inline-flex items-center justify-center rounded-md text-sm transition-colors",
              head_cell: "text-slate-400 rounded-md w-9 font-medium text-[0.85rem] pb-2",
              day_selected: "!bg-brand-600 !text-white font-bold",
              day_disabled: "text-slate-700 opacity-50 cursor-not-allowed",
              day_outside: "text-slate-700 opacity-50",
              cell: "text-center text-sm p-0 w-9 h-9 relative",
            }}
            disabled={(date) => {
              if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
              return !availableDates.some((d) => isSameDay(d, date));
            }}
            modifiers={{
              available: availableDates,
            }}
            modifiersClassNames={{
              available: "font-bold text-[#34d399] bg-[#10b981]/15 rounded-md",
            }}
            components={{
              Day: (dayProps) => {
                const { date } = dayProps;
                const session = sessions.find((s: any) =>
                  isSameDay(new Date(s.date), date),
                );

                return (
                  <div className="relative group/day w-9 h-9 flex items-center justify-center">
                    <Day {...dayProps} />

                    {session && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-4 bg-[#0f2a44] border border-white/10 text-white rounded-xl shadow-2xl opacity-0 group-hover/day:opacity-100 pointer-events-none group-hover/day:pointer-events-auto transition-all duration-200 z-[100] translate-y-2 group-hover/day:translate-y-0 text-left">
                        <div className="font-bold text-sm mb-1 text-white flex items-center justify-between">
                          <span>
                            {format(new Date(session.date), "MMM d, yyyy")}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-brand-600 rounded-full">
                            {session.capacity - session.enrolledCount} spots
                          </span>
                        </div>
                        <div className="text-xs text-brand-400 font-medium mb-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {session.startTime} -{" "}
                          {session.endTime}
                        </div>
                        <div className="text-xs text-slate-400 mb-4 flex items-start gap-1 pb-3 border-b border-white/10">
                          <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">
                            {session.location}
                          </span>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSessionId(session.id);
                            setStep("details");
                          }}
                          size="sm"
                          disabled={loading}
                          className="w-full bg-brand-600 hover:bg-brand-700 text-white h-8 text-xs font-bold transition-transform active:scale-95 rounded-lg"
                        >
                          {loading ? "Processing..." : "Select Class"}
                        </Button>
                        {/* Triangle Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0f2a44]" />
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
          <p className="text-slate-500 text-sm mt-4 mb-2 text-center">
            Highlighted green dates have open seat availability.
          </p>
        </div>

        {/* Selected Date Details Side */}
        <div className="flex flex-col">
          {!selectedDate ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-xl">
              <CalendarIcon className="w-12 h-12 text-white/20 mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">
                No Date Selected
              </h3>
              <p className="text-slate-500">
                Please choose an available date from the calendar to view class
                times and checkout.
              </p>
            </div>
          ) : selectedSessions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-xl">
              <h3 className="text-xl font-bold text-slate-400 mb-2">
                No Seats Available
              </h3>
              <p className="text-slate-500">
                The selected date is either fully booked or has no sessions
                scheduled. Please choose another date.
              </p>
            </div>
          ) : step === "details" && selectedSessionId ? (
            <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-6 relative">
              <h3 className="text-xl font-bold text-white mb-6">Student Information</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  // if user exists, optionally save to DB
                  if (sessionData?.user?.email) {
                    setLoading(true);
                    await updateUserRegistrationInfo({
                      name: formData.name,
                      phone: formData.phone,
                      address: formData.address,
                    });
                    setLoading(false);
                  }
                  
                  // Move to payment directly!
                  setStep("payment");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-slate-300">Name</label>
                  <Input required placeholder="John Doe" value={formData.name} onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))} className="bg-[#0b1f3a] border-white/10 text-white mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Email</label>
                  <Input 
                    disabled={!!sessionData?.user?.email} 
                    required 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                    className="bg-[#0b1f3a] border-white/10 text-white mt-1 disabled:opacity-50" 
                  />
                  {sessionData?.user?.email ? (
                    <p className="text-xs text-slate-500 mt-1">Email is tied to your secure account.</p>
                  ) : (
                    <p className="text-xs text-brand-400 mt-1">We will send your receipt here.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Phone</label>
                  <Input required placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))} className="bg-[#0b1f3a] border-white/10 text-white mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Address</label>
                  <Input required placeholder="Street, City, State, ZIP" value={formData.address} onChange={(e) => setFormData(f => ({ ...f, address: e.target.value }))} className="bg-[#0b1f3a] border-white/10 text-white mt-1" />
                </div>
                <div className="mt-8 flex gap-3">
                  <Button type="button" onClick={() => setStep("selection")} variant="outline" className="flex-1 bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">Back</Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg">
                    {loading ? "Saving..." : "Continue to Payment"}
                  </Button>
                </div>
              </form>
            </div>
          ) : step === "payment" && selectedSessionId ? (
            <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-6 relative">
              <h3 className="text-xl font-bold text-white mb-2">Checkout</h3>
              <p className="text-slate-400 mb-8 text-sm">Secure your seat using PayPal.</p>
              
              {course.priceRenewal != null && (
                <div className="mb-8">
                  <label className="text-sm font-medium text-slate-300 block mb-3">Registration Type</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex cursor-pointer border rounded-xl p-4 flex-col items-center justify-center transition-colors ${registrationType === "ORIGINAL" ? "border-brand-500 bg-brand-500/10 text-white" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>
                      <input type="radio" name="registrationType" value="ORIGINAL" className="sr-only" checked={registrationType === "ORIGINAL"} onChange={() => setRegistrationType("ORIGINAL")} />
                      <span className="font-bold">Original</span>
                      <span className="text-xs mt-1 opacity-70">${course.priceOriginal}</span>
                    </label>
                    <label className={`flex-1 flex cursor-pointer border rounded-xl p-4 flex-col items-center justify-center transition-colors ${registrationType === "RENEWAL" ? "border-brand-500 bg-brand-500/10 text-white" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>
                      <input type="radio" name="registrationType" value="RENEWAL" className="sr-only" checked={registrationType === "RENEWAL"} onChange={() => setRegistrationType("RENEWAL")} />
                      <span className="font-bold">Renewal</span>
                      <span className="text-xs mt-1 opacity-70">${course.priceRenewal}</span>
                    </label>
                  </div>
                  {registrationType === "RENEWAL" && (
                    <div className="mt-4 p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200 text-sm leading-relaxed">
                      <strong>Note:</strong> Your previous certification must not be expired. After paying, you must send an image of your old certification to our phone number <strong>718-674-2647</strong>.
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {/* Stripe Checkout Temporarily Removed */}

                <div className="relative z-0">
                  <PayPalButtons
                    style={{ layout: "vertical", color: "gold", shape: "rect", height: 48 }}
                    createOrder={() => handlePaypalCreateOrder(selectedSessionId)}
                    onApprove={(data, actions) => handlePaypalApprove(data, actions, selectedSessionId)}
                    disabled={loading}
                  />
                </div>

                <p className="text-center text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout with PayPal
                </p>

                <Button type="button" onClick={() => setStep("details")} variant="link" className="w-full text-slate-400 hover:text-white text-xs mt-2">
                  ← Back to details
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">
                Classes on {format(selectedDate, "MMMM d, yyyy")}
              </h3>

              {selectedSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-[#0f2a44] border border-white/10 rounded-2xl overflow-hidden relative group"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-brand-600" />
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-brand-400" />
                        {session.startTime} - {session.endTime}
                      </h4>
                      <p className="text-slate-400 flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" /> {session.location}
                      </p>
                      <p className="text-slate-400 flex items-center gap-2 text-sm mt-1">
                        <Users className="w-4 h-4" />{" "}
                        {session.capacity - session.enrolledCount} seats remaining
                      </p>
                    </div>

                    <div className="mt-8 space-y-4">
                      <Button
                        onClick={() => {
                          setSelectedSessionId(session.id);
                          setStep("details");
                        }}
                        disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-12 text-base rounded-xl shadow-lg"
                      >
                        Register Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
