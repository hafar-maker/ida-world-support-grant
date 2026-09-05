import Link from "next/link";
import { ArrowRight, ChevronDown, Search } from "lucide-react";

const nav = [
  ["Home", "/"],
  ["Learn", "/learn"],
  ["Find a Grant", "/grants"],
  ["Applicants", "/apply"],
  ["About", "/#about"],
  ["Help", "/#contact"],
];

export function SiteHeader() {
  return (
    <>
      <div className="border-b border-[#d9e2e8] bg-[#f4f7f9] text-[12px] text-[#27465a]">
        <div className="container-x flex min-h-9 items-center justify-between gap-4">
          <span>IDA World Support Grant</span>
          <div className="flex items-center gap-4">
            <Link href="#contact" className="hover:underline">Help</Link>
            <Link href="/dashboard" className="hover:underline">My account</Link>
            <Link href="/apply" className="font-semibold text-[#005ea8] hover:underline">Register / Login</Link>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[#d9e2e8] bg-white">
        <div className="container-x flex min-h-[74px] items-center gap-5">
          <Link href="/" className="flex min-w-[190px] items-center gap-3" aria-label="IDA World Support Grant home">
            <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#005ea8] text-[#005ea8] font-black">IDA</div>
            <div className="leading-tight">
              <div className="text-[13px] font-extrabold tracking-wide text-[#12304a]">IDA WORLD</div>
              <div className="text-[10px] font-bold tracking-[.18em] text-[#536b79]">SUPPORT GRANT</div>
            </div>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
            {nav.map(([label, href]) => (
              <Link key={label} href={href} className="inline-flex items-center gap-1 rounded-md px-3 py-3 text-[13px] font-semibold text-[#27465a] hover:bg-[#f4f7f9] hover:text-[#005ea8]">
                {label}{["Learn", "Find a Grant", "Applicants"].includes(label) && <ChevronDown size={13} />}
              </Link>
            ))}
          </nav>
          <Link href="/grants" className="hidden items-center gap-2 rounded-md border border-[#005ea8] px-3 py-2.5 text-[12px] font-bold text-[#005ea8] hover:bg-[#eaf1f5] sm:inline-flex">
            <Search size={15} /> Search grants
          </Link>
          <Link href="/apply" className="inline-flex items-center gap-2 rounded-md bg-[#005ea8] px-4 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-[#004b87]">
            Apply now <ArrowRight size={14}/>
          </Link>
        </div>
      </header>
    </>
  );
}
