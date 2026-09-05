"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type VideoModalProps = {
  open: boolean;
  onClose: () => void;
  videoId: string;
};

export function VideoModal({ open, onClose, videoId }: VideoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#071b2a]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Learn more video"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#005EA8]">IDA World Support Grant</p>
            <h2 className="mt-0.5 text-sm font-bold text-[#12304A] md:text-base">Learn more about the grant</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#12304A] focus:outline-none focus:ring-2 focus:ring-[#005EA8]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="aspect-video bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="How To Qualify For IDA Grant"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
