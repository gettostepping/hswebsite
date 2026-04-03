"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowRight } from "lucide-react";
import { registerUser } from "@/actions/auth";
import { signIn, useSession } from "next-auth/react";

export default function RegisterPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInRes?.error) {
      setError("Registration successful, but failed to auto-login.");
      setLoading(false);
    } else {
      router.push("/");
    }
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400">
              Sign up securely to manage your bookings
            </p>
            {error && <p className="text-red-400 text-sm mt-3 bg-red-950/50 p-2 rounded-lg">{error}</p>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-slate-300 text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-brand-500 rounded-xl mt-1.5"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold mt-2"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
