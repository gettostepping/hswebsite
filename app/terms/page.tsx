import Link from "next/link";

export const metadata = {
  title: "Terms of Service | HeartSaverNY",
  description: "Review HeartSaverNY's terms of service including cancellation, rescheduling, lateness, and no-show policies.",
};

const sections = [
  {
    id: "cancellation",
    title: "Cancellation Policy",
    content: [
      "Once registration has been processed, NO REFUND will be given. Credit may be used up to 365 days (1 year) from the original class date.",
    ],
  },
  {
    id: "rescheduling",
    title: "Rescheduling Policy",
    content: [
      "To reschedule, you must contact us at 718-674-2647 during business hours (9am–8pm EST). We will not honor any rescheduling request without proof that you attempted to contact us by phone or email. If you are unable to reach us by phone, please leave a voicemail or email us at heartsaverny01@yahoo.com.",
      "We are open on most major holidays except Christmas and New Year's Day. Rescheduling requests made on those holidays will not be counted until the next business day.",
    ],
    subsections: [
      {
        title: "3 or More Days in Advance",
        text: "If you contact us within business hours (9am–8pm EST) 3 or more days before your course (excluding holidays listed above), no fee will be charged. Students may only reschedule once within 60 days of the original class date.",
      },
      {
        title: "1–2 Days Before the Course",
        text: "A $40 fee applies for BLS and HEARTSAVER courses, and a $75 fee applies for all other courses if you reschedule 1–2 days before your class.",
      },
      {
        title: "Day-Of Rescheduling",
        text: "Students are not permitted to reschedule on the day of the course. Any such request will be treated as a NO SHOW.",
      },
      {
        title: "Multiple Reschedules",
        text: "We do not allow rescheduling more than once. No refund or credit will be granted if the student cannot attend the rescheduled class, unless there are extreme weather conditions or a medical emergency.",
      },
    ],
  },
  {
    id: "lateness",
    title: "Lateness Policy",
    content: [
      "Students must arrive on time. We recommend arriving at least 15 minutes early. If a student is more than 15 minutes late, they will be considered a NO SHOW. This also applies to rescheduled classes.",
      "If you know in advance that you will be late, please reschedule within the adequate timeframe to avoid penalties. See the Rescheduling Policy above.",
    ],
  },
  {
    id: "no-show",
    title: "No Show Policy",
    content: [
      "A student who does not attend class and did not notify us before the start of the class is considered a NO SHOW. We do not honor refunds or credits for any student who does not show up. Seats are reserved.",
    ],
  },
  {
    id: "replacement-card",
    title: "Replacement Card / Misprinted Card",
    content: [
      "All replacement cards (BLS, HEARTSAVER, ACLS, PALS, NRP) are $25 each. Students may pick up the card in person or request delivery by regular mail.",
      "Students are responsible for verifying the correct spelling of their name on the class roster given at the start of each class. If a student fails to notify the instructor of a misspelling at that time, HeartSaverNY, Inc. will not be responsible for the misprinted card. The student must pay the replacement card fee to obtain a corrected card.",
    ],
  },
  {
    id: "chargeback",
    title: "Credit Card Chargeback / Dispute",
    content: [
      "If a charge is placed in dispute by the student (or the cardholder) because they do not recognize the charge, the student is responsible for a $25.00 processing fee in addition to the original charges due on the transaction.",
    ],
  },
  {
    id: "on-site",
    title: "On-Site Training Policy",
    content: [
      "HeartSaverNY, Inc. will gladly travel to your location for On-Site Training. A minimum of five participants is required. Once an On-Site Training date is scheduled, a non-refundable deposit of 50% of the total training cost is required.",
      "You may reschedule within 48 hours of the On-Site Training. Rescheduling is permitted only once. If the training is cancelled, the deposit will not be refunded.",
      "Group discounts are based on the number of students originally confirmed by the client. If fewer students attend than expected, HeartSaverNY, Inc. will not issue a refund for the absent students. A credit for future training may be issued instead.",
    ],
  },
  {
    id: "disclaimer",
    title: "Website Disclaimer",
    content: [
      'The information provided on this website is presented "as is." HeartSaverNY, Inc. is not responsible for any mistakes, misprints, incorrect pricing, or product descriptions. HeartSaverNY, Inc. expressly disclaims all warranties, express or implied, of any kind with respect to the website and its use.',
      "By using this website, you agree that HeartSaverNY, Inc., its officers, employees, and representatives shall not be held liable for any damages arising from the use of this content or its information.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#091729] min-h-screen text-white pb-24">
      {/* Hero */}
      <section className="bg-[#0b1f3a] pt-16 pb-12 border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-3">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Please read these terms carefully before registering for any course. By booking with HeartSaverNY, you agree to the policies below.
          </p>
          <p className="text-slate-500 text-sm mt-4">Last updated: April 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Quick nav */}
          <div className="bg-[#0f2a44] border border-white/10 rounded-2xl p-6 mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Jump to section</p>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm text-brand-300 hover:text-white bg-brand-600/10 hover:bg-brand-600/20 border border-brand-600/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={section.id} id={section.id} className="bg-[#0f2a44] border border-white/10 rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-xs font-black text-brand-400 bg-brand-600/10 border border-brand-600/20 rounded-lg px-2.5 py-1 mt-0.5 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="space-y-4 ml-10">
                  {section.content.map((para, pi) => (
                    <p key={pi} className="text-slate-300 leading-relaxed">{para}</p>
                  ))}

                  {section.subsections && (
                    <div className="mt-6 space-y-4">
                      {section.subsections.map((sub) => (
                        <div key={sub.title} className="border-l-2 border-brand-600/40 pl-4">
                          <p className="text-white font-semibold text-sm mb-1">{sub.title}</p>
                          <p className="text-slate-400 text-sm leading-relaxed">{sub.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              Questions?{" "}
              <Link href="/contact" className="text-brand-400 hover:text-brand-300 underline underline-offset-4">
                Contact us
              </Link>{" "}
              or call{" "}
              <a href="tel:7186742647" className="text-brand-400 hover:text-brand-300">
                718-674-2647
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
