import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function VerifyPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-16 bg-[#091729]">
      <div className="w-full max-w-md px-4 text-center">
        <div className="bg-[#0f2a44] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8">
          <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-600/30 mx-auto mb-5 flex items-center justify-center">
            <Mail className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-2">
            Check Your Email
          </h1>
          <p className="text-slate-400 mb-6">
            A sign-in link has been sent to your email address. Click the link
            to complete your sign in.
          </p>
          <p className="text-xs text-slate-500 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 inline-block mb-6">
            The link will expire in 24 hours
          </p>
          <div>
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-lg"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
