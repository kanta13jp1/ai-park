"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { Calendar } from "lucide-react";

export default function OfficeHourBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-[#627384] px-4 py-3 shadow-inner">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-medium py-2.5 px-4 rounded-sm shadow-xs border border-slate-200/80 flex items-center justify-center space-x-2 transition-all duration-150 hover:shadow-md cursor-pointer group"
          >
            <Calendar className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm tracking-wide">AI Office Hour 予約はこちらから</span>
          </button>
        </div>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
