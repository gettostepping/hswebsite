"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactMessage } from "@/actions/contact";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      message: formData.get("message") as string,
    };

    const result = await submitContactMessage(data);

    if (result.success) {
      toast.success("Message sent! We'll respond within 24 hours.");
      setSubmitted(true);
    } else {
      toast.error(result.error || "Failed to send message");
    }

    setLoading(false);
  }

  return (
    <div className="bg-[#091729] min-h-screen text-white pb-24">
      {/* Hero */}
      <section className="bg-[#0b1f3a] pt-16 pb-12 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">
            Contact Us
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Have questions about our courses? Need help with registration? Our
            team is here and ready to help you save lives.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                  Contact Information
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      icon: Phone,
                      label: "Phone",
                      value: "718-674-2647",
                      subtext: "Mon-Sat 9AM-6PM",
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      value: "heartsaverny01@yahoo.com",
                      subtext: "We respond within 24 hours",
                    },
                    {
                      icon: MapPin,
                      label: "Training Center",
                      value: "3220 Church Avenue",
                      subtext:
                        "Brooklyn NY 11226 (Corner of Church & New York Ave)",
                    },
                    {
                      icon: Clock,
                      label: "Office Hours",
                      value: "Monday - Saturday: 9:00 AM - 6:00 PM",
                      subtext: "Sunday: Closed",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-5">
                      <div className="bg-white/5 border border-white/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-brand-400" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">
                          {item.label}
                        </p>
                        <p className="text-white font-semibold leading-snug mb-0.5">
                          {item.value}
                        </p>
                        <p className="text-slate-400 text-sm">{item.subtext}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden border border-white/10 h-64">
                <iframe
                  title="HeartSaverNY Training Center"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.6!2d-73.9503!3d40.6505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b8f3b7e3e3b%3A0x0!2s3220+Church+Ave%2C+Brooklyn%2C+NY+11226!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Call CTA */}
            <div className="flex items-center justify-center">
              <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-10 sm:p-14 flex flex-col items-center text-center w-full">
                <div className="w-24 h-24 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mb-8">
                  <Phone className="w-12 h-12 text-brand-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                  Give Us a Call
                </h2>
                <p className="text-slate-400 text-lg mb-10 max-w-sm leading-relaxed">
                  The fastest way to reach us. If we don&apos;t answer, we&apos;ll return your call as soon as possible.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="h-16 px-10 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xl shadow-xl shadow-brand-900/40 transition-transform active:scale-95"
                >
                  <a href="tel:7186742647">
                    <Phone className="w-6 h-6 mr-3" />
                    718-674-2647
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
