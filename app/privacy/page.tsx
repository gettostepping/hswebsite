import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | HeartSaverNY",
  description: "Learn how HeartSaverNY collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#091729] min-h-screen text-white pb-24">
      {/* Hero */}
      <section className="bg-[#0b1f3a] pt-16 pb-12 border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            At HeartSaverNY, Inc., your privacy is extremely important to us. This page explains how we handle your personal information.
          </p>
          <p className="text-slate-500 text-sm mt-4">Last updated: April 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Information We Collect</h2>
            <p className="text-slate-300 leading-relaxed">
              When you make purchases or requests through our website or in person, we may collect the following types of personal information:
            </p>
            <ul className="mt-4 space-y-2 ml-4">
              {[
                "Full name",
                "Mailing and billing address",
                "Phone number",
                "Email address",
                "Credit card or other payment information",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="text-slate-300 leading-relaxed">
              The information you provide is used solely to process your course registrations and transactions with HeartSaverNY, Inc. We use your information to:
            </p>
            <ul className="mt-4 space-y-2 ml-4">
              {[
                "Confirm and manage your course registration",
                "Send receipts and booking confirmations",
                "Contact you regarding scheduling, rescheduling, or cancellations",
                "Issue certifications upon course completion",
                "Process payments securely",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Data Confidentiality</h2>
            <p className="text-slate-300 leading-relaxed">
              All personal information you provide is kept strictly confidential. We do not sell, rent, trade, or share your information with any outside vendors, third-party marketing companies, or unaffiliated organizations for any purpose.
            </p>
          </div>

          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Payment Security</h2>
            <p className="text-slate-300 leading-relaxed">
              Payment information is processed through secure, industry-standard payment providers. HeartSaverNY, Inc. does not store your raw credit card data. All transactions are encrypted and handled in compliance with payment industry security standards (PCI-DSS).
            </p>
          </div>

          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Rights</h2>
            <p className="text-slate-300 leading-relaxed">
              You have the right to request access to the personal information we hold about you, and to request corrections or deletion of that data. To exercise these rights, please contact us directly.
            </p>
          </div>

          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              HeartSaverNY, Inc. reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Continued use of our website or services after such changes constitutes your acceptance of the updated policy.
            </p>
          </div>

          {/* Footer note */}
          <div className="mt-4 text-center">
            <p className="text-slate-500 text-sm">
              Questions about your data?{" "}
              <Link href="/contact" className="text-brand-400 hover:text-brand-300 underline underline-offset-4">
                Contact us
              </Link>{" "}
              or email{" "}
              <a href="mailto:heartsaverny01@yahoo.com" className="text-brand-400 hover:text-brand-300">
                heartsaverny01@yahoo.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
