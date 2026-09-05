"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2, ChevronRight, X } from "lucide-react";

// Replace these illustrative records with verified, publishable award data before launch.
const awards = [
  { id: 1, name: "A. O.", area: "Household support", amount: "₦250,000", status: "Approved" },
  { id: 2, name: "M. K.", area: "Education support", amount: "₦180,000", status: "Approved" },
  { id: 3, name: "J. A.", area: "Medical support", amount: "₦300,000", status: "Approved" },
];

export function RecentAwards() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((v) => (v + 1) % awards.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const award = awards[index];

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-30 flex max-w-[340px] items-start gap-3 rounded-lg border border-[#c8d7e0] bg-white p-4 text-left shadow-[0_12px_35px_rgba(11,45,69,.16)] hover:border-[#005ea8]">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eaf1f5] text-[#005ea8]"><Bell size={17}/></span>
        <span className="min-w-0">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-[#536b79]">Recent award notice</span>
          <span className="mt-1 block text-[13px] font-semibold text-[#12304a]">{award.name} · {award.area}</span>
          <span className="mt-1 block text-[11px] text-[#536b79]">{award.status} · {award.amount}</span>
        </span>
        <ChevronRight size={16} className="mt-1 shrink-0 text-[#7b8e9a]"/>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-[#0b2d45]/25 p-4 sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label="Recent award notices">
          <div className="w-full max-w-xl rounded-xl border border-[#c8d7e0] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d9e2e8] px-5 py-4">
              <div><h2 className="font-bold text-[#12304a]">Recent award notices</h2><p className="text-[11px] text-[#647985]">Illustrative records for the prototype. Publish only verified award information.</p></div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-2 hover:bg-[#f4f7f9]"><X size={18}/></button>
            </div>
            <div className="divide-y divide-[#e4eaee]">
              {awards.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                  <CheckCircle2 size={19} className="text-[#2e7d52]" />
                  <div className="flex-1"><p className="text-sm font-semibold text-[#12304a]">{item.name} · {item.area}</p><p className="text-xs text-[#647985]">Award status: {item.status}</p></div>
                  <span className="text-sm font-bold text-[#12304a]">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
