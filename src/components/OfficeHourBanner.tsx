"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { Calendar, ArrowRight, Sparkles, Clock } from "lucide-react";
import { playCyberClick, playCyberHover } from "@/lib/sound";

export default function OfficeHourBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-indigo-900/50 px-4 py-2.5 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5 text-xs text-slate-300">
            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-cyan-300 border border-indigo-400/30 font-semibold font-mono text-[10px]">
              <Sparkles size={11} className="text-cyan-400" />
              <span>OFFICE HOUR</span>
            </span>
            <span className="text-slate-300 hidden md:inline">
              担当：梅澤（AI推進担当）
            </span>
            <span className="text-slate-400 text-[11px]">
              自チームのAI活用・エージェント実装の個別相談を受付中
            </span>
          </div>

          <button
            onClick={() => {
              playCyberClick();
              setModalOpen(true);
            }}
            onMouseEnter={() => playCyberHover()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs py-1.5 px-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer group shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>15分個別相談を予約する</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
