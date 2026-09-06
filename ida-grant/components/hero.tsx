"use client";

import Link from "next/link";
import { ArrowRight, CirclePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { VideoModal } from "./video-modal";

const LEARN_MORE_VIDEO_ID = "HpGg232napQ";

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [heroSrc, setHeroSrc] = useState("/family-hero.png");

  useEffect(() => {
    fetch("/family-hero.webp.b64", { cache: "force-cache" })
      .then((response) => response.text())
      .then((base64) => {
        if (base64.trim()) setHeroSrc(`data:image/webp;base64,${base64.trim()}`);
      })
      .catch(() => {
        // Keep the existing asset as a fallback if the edited image cannot be loaded.
      });
  }, []);

  return (
    <>
      <section id="home" className="hero-grid overflow-hidden">
        <div className="container-x grid min-h-[500px] items-center gap-10 py-12 md:grid-cols-[1fr_1.05fr] md:py-16">
          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-full bg-[#EAF1F5] px-4 py-2 text-[11px] font-semibold text-[#005EA8]">
              Empowering People. Changing Lives.
            </div>
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.02] tracking-tight text-[#12304A] md:text-6xl">
              IDA World
              <br />
              Support Grant
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500">
              Providing financial assistance to individuals and families in need to help them overcome challenges and build a better tomorrow.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-lg bg-[#005EA8] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#004B87] focus:outline-none focus:ring-2 focus:ring-[#005EA8] focus:ring-offset-2"
              >
                Apply Now <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-[#12304A] transition hover:border-[#005EA8]/30 hover:bg-[#F4F7F9] focus:outline-none focus:ring-2 focus:ring-[#005EA8] focus:ring-offset-2"
              >
                <CirclePlay size={15} /> Learn More
              </button>
            </div>
          </div>

          <div className="relative min-h-[360px] md:min-h-[440px]">
            <div className="absolute inset-x-0 bottom-0 h-[78%] rounded-[44%_44%_12%_12%] bg-[#EAF1F5]/70" />
            <img
              src={heroSrc}
              alt="Family smiling together"
              className="relative h-full w-full object-contain object-center drop-shadow-xl"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoId={LEARN_MORE_VIDEO_ID}
      />
    </>
  );
}
