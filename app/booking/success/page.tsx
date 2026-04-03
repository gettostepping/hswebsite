import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar } from "lucide-react";

export default function BookingSuccessPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-16 bg-[#091729]">
      <div className="w-full max-w-lg px-4 text-center">
        <div className="bg-[#0f2a44] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 sm:p-12">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 inline-block mb-4 uppercase tracking-widest">
            Payment Successful
          </p>
          <h1 className="text-white font-black text-3xl mb-3">
            Registration Confirmed!
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your training session has been booked successfully. A confirmation
            email with all the details has been sent to your email address.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-white font-semibold mb-3">What&apos;s Next?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                Check your email for booking confirmation
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                Arrive 15 minutes before your session starts
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                Wear comfortable clothing for hands-on practice
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                Bring a valid photo ID
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
            >
              <Link href="/calendar">
                <Calendar className="w-4 h-4 mr-2" />
                Register for Another Class
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-lg font-semibold"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
