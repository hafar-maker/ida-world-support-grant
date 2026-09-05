import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-100 bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#005EA8] text-[#005EA8] font-bold">◎</div>
          <div className="leading-tight"><div className="text-[13px] font-extrabold tracking-wide text-[#12304A]">IDA WORLD</div><div className="text-[10px] font-bold tracking-widest text-slate-500">SUPPORT GRANT</div></div>
        </Link>
        <nav className="hidden items-center gap-8 text-[12px] font-medium text-slate-600 md:flex">
          <a href="#home">Home</a><a href="#about">About Us</a><a href="#eligibility">Eligibility</a><a href="#how">How It Works</a><a href="#faqs">FAQs</a><a href="#contact">Contact Us</a>
        </nav>
        <Link href="/apply" className="inline-flex items-center gap-2 rounded-lg bg-[#005EA8] px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#004B87]">Apply Now <ArrowRight size={14}/></Link>
      </div>
    </header>
  );
}
