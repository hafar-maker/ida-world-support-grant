"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";

const nav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Find a Grant", "/grants"],
  ["Applicants", "/apply"],
  ["My Applications", "/my-applications"],
  ["Help", "/#contact"],
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <div className="border-b border-[#d9e2e8] bg-[#f4f7f9] text-[12px] text-[#27465a]">
        <div className="container-x flex min-h-9 items-center justify-end gap-4">
          <Link href="#contact" className="hover:underline">Help</Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#d9e2e8] bg-white">
        <div className="container-x flex min-h-[74px] items-center gap-3">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 flex-1 items-center gap-3"
            aria-label="IDA World Support Grant home"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#005ea8] text-[#005ea8] font-black">IDA</div>
            <div className="leading-tight">
              <div className="text-[13px] font-extrabold tracking-wide text-[#12304a]">IDA WORLD</div>
              <div className="text-[10px] font-bold tracking-[.18em] text-[#536b79]">SUPPORT GRANT</div>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
            {nav.map(([label, href]) => (
              <Link key={label} href={href} className="inline-flex items-center gap-1 rounded-md px-3 py-3 text-[13px] font-semibold text-[#27465a] hover:bg-[#f4f7f9] hover:text-[#005ea8]">
                {label}{["Find a Grant", "Applicants"].includes(label) && <ChevronDown size={13} />}
              </Link>
            ))}
          </nav>

          <Link href="/grants" className="hidden items-center gap-2 rounded-md border border-[#005ea8] px-3 py-2.5 text-[12px] font-bold text-[#005ea8] hover:bg-[#eaf1f5] sm:inline-flex">
            <Search size={15} /> Search grants
          </Link>
          <Link href="/apply" className="hidden items-center gap-2 rounded-md bg-[#005ea8] px-4 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-[#004b87] sm:inline-flex">
            Apply now <ArrowRight size={14}/>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#d9e2e8] text-[#12304a] hover:bg-[#f4f7f9] focus:outline-none focus:ring-2 focus:ring-[#005ea8] lg:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#d9e2e8] bg-white shadow-lg lg:hidden">
            <nav className="container-x py-3" aria-label="Mobile primary">
              {nav.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-between border-b border-[#edf1f4] px-2 text-sm font-semibold text-[#12304a] last:border-b-0 hover:bg-[#f4f7f9] hover:text-[#005ea8]"
                >
                  <span>{label}</span>
                  {["Find a Grant", "Applicants"].includes(label) && <ChevronDown size={15} />}
                </Link>
              ))}
              <div className="grid gap-2 pt-3 sm:hidden">
                <Link
                  href="/grants"
                  onClick={closeMenu}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#005ea8] px-4 text-sm font-bold text-[#005ea8]"
                >
                  <Search size={16} /> Search grants
                </Link>
                <Link
                  href="/apply"
                  onClick={closeMenu}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#005ea8] px-4 text-sm font-bold text-white"
                >
                  Apply now <ArrowRight size={15}/>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
