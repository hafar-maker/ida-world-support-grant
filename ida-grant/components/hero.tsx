import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="overflow-hidden border-b border-[#d9e2e8] bg-white">
      <div className="container-x grid min-h-[560px] items-center gap-8 py-10 sm:py-12 md:grid-cols-[1fr_0.95fr] md:gap-10 md:py-14 lg:min-h-[590px]">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe0ea] bg-[#EAF1F5] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-[#005EA8]">
            <ShieldCheck size={14} /> A simple, secure support portal
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0B2D45] sm:text-5xl md:text-6xl">
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
          </div>
          <div className="mt-8 grid max-w-xl gap-3 text-sm text-[#536b79] sm:grid-cols-3">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="shrink-0 text-[#005EA8]" /> Clear requirements</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="shrink-0 text-[#005EA8]" /> Online application</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="shrink-0 text-[#005EA8]" /> Application updates</div>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[620px] items-end justify-center md:justify-end">
          <div className="absolute right-0 top-8 h-64 w-64 rounded-full bg-[#EAF1F5] sm:h-80 sm:w-80" />
          <div className="absolute bottom-0 left-4 h-36 w-36 rounded-full bg-[#F4F7F9] sm:h-44 sm:w-44" />
          <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-[#d7e3ea] bg-[#F4F7F9] px-3 pt-3 shadow-[0_20px_60px_rgba(11,45,69,0.12)] sm:px-5 sm:pt-5">
            <div className="relative flex min-h-[300px] items-end justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#EAF1F5] to-white sm:min-h-[380px]">
              <Image
                src="/hero-men-hd.jpg"
                alt="Two men smiling and shaking hands"
                width={720}
                height={465}
                priority
                unoptimized
                sizes="(min-width: 768px) 50vw, 100vw"
                className="relative z-10 h-auto w-full max-w-[720px] object-contain object-bottom"
              />
              <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-white/70 bg-white/95 px-4 py-3 shadow-md backdrop-blur-sm sm:bottom-6 sm:left-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#005EA8]">IDA World Support Grant</p>
                <p className="mt-1 text-sm font-bold text-[#0B2D45]">Support when it matters.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
