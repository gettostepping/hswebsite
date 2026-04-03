"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password) {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res?.ok || (res?.error && String(res.error) !== "null")) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } else {
      const res = await signIn("email", { email, redirect: false });
      if (!res?.ok || (res?.error && String(res.error) !== "null")) {
        setError("Could not send magic link");
      } else {
        setSent(true);
      }
    }
    setLoading(false);
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-16 bg-[#091729]">
      <div className="w-full max-w-md px-4">
        <div className="bg-[#0f2a44] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-600 w-14 h-14 rounded-2xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
            </div>
          </div>
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-brand-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Check Your Email
              </h1>
              <p className="text-slate-400 mb-6">
                We sent a sign-in link to{" "}
                <strong className="text-white">{email}</strong>. Click the link
                to access your account.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-lg"
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
                <p className="text-slate-400">
                  Enter your email and password, or leave password blank for a magic link
                </p>
                {error && <p className="text-red-400 text-sm mt-3 bg-red-950/50 p-2 rounded-lg">{error}</p>}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-slate-300 text-sm font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl mt-1.5"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className="text-slate-300 text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl mt-1.5"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Continue with Email{" "}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <a href="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium">
                  Register here
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
