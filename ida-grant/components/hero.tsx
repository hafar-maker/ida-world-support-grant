import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="overflow-hidden border-b border-[#d9e2e8] bg-white">
      <div className="container-x grid min-h-[540px] items-center gap-12 py-12 md:grid-cols-[1.02fr_.98fr] md:py-16">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe0ea] bg-[#EAF1F5] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-[#005EA8]">
            <ShieldCheck size={14} /> A simple, secure support portal
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0B2D45] md:text-6xl">
            Financial support for a <span className="text-[#005EA8]">brighter tomorrow.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#536b79] md:text-lg">
            Apply for IDA World Support Grant assistance online, review eligibility requirements, and keep track of your application from one secure place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-md bg-[#005EA8] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#004B87] focus:outline-none focus:ring-2 focus:ring-[#005EA8] focus:ring-offset-2"
            >
              Start an application <ArrowRight size={16} />
            </Link>
            <Link
              href="/grants"
              className="inline-flex items-center gap-2 rounded-md border border-[#cbd9e1] bg-white px-6 py-3.5 text-sm font-bold text-[#12304A] transition hover:bg-[#F4F7F9] focus:outline-none focus:ring-2 focus:ring-[#005EA8] focus:ring-offset-2"
            >
              <FileText size={16} /> View grant opportunities
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl gap-3 text-sm text-[#536b79] sm:grid-cols-3">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#005EA8]" /> Clear requirements</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#005EA8]" /> Online application</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#005EA8]" /> Application updates</div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#EAF1F5]" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#F4F7F9]" />
          <div className="relative rounded-2xl border border-[#d7e3ea] bg-[#F4F7F9] p-4 shadow-[0_20px_60px_rgba(11,45,69,0.10)]">
            <div className="rounded-xl border border-[#d7e3ea] bg-white p-6">
              <div className="flex items-center justify-between border-b border-[#e5edf1] pb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#005EA8]">Support application</p>
                  <p className="mt-1 text-lg font-extrabold text-[#12304A]">Your application journey</p>
                </div>
                <div className="rounded-full bg-[#EAF1F5] px-3 py-1 text-[10px] font-bold text-[#005EA8]">ONLINE</div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ["01", "Check eligibility", "Review the programme requirements"],
                  ["02", "Submit application", "Complete the secure online form"],
                  ["03", "Track progress", "Receive updates as your application moves forward"],
                ].map(([number, title, text], index) => (
                  <div key={number} className="flex gap-4 rounded-lg border border-[#e2ebef] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005EA8] text-xs font-extrabold text-white">{number}</div>
                    <div>
                      <p className="text-sm font-bold text-[#12304A]">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-[#647986]">{text}</p>
                    </div>
                    {index === 0 && <CheckCircle2 className="ml-auto mt-1 shrink-0 text-[#005EA8]" size={17} />}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-[#0B2D45] p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#bcd4e4]">Need help?</p>
                <p className="mt-1 text-sm font-semibold">Our support team can help you understand the application process.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
