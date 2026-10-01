"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playCyberClick } from "@/lib/sound";

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isSoundEnabled());

    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      setEnabled(customEvent.detail.enabled);
    };

    window.addEventListener("ai-park-sound-changed", handleSoundChange);
    return () => window.removeEventListener("ai-park-sound-changed", handleSoundChange);
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    const next = !enabled;
    setSoundEnabled(next);
    setEnabled(next);
    if (next) {
      setTimeout(() => playCyberClick(), 50);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center">
      <button
        onClick={toggle}
        className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold flex items-center space-x-2 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer active:scale-95 ${
          enabled
            ? "bg-slate-900/90 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20"
            : "bg-slate-900/60 text-slate-400 border-white/10 hover:text-white hover:border-white/30"
        }`}
        title={enabled ? "サイバー触感サウンドを消音" : "サイバー触感サウンドを有効化 (Awwwards体験)"}
      >
        {enabled ? (
          <>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <Volume2 size={14} className="text-cyan-300" />
            <span className="tracking-widest text-[10px]">SFX ON</span>
          </>
        ) : (
          <>
            <VolumeX size={14} />
            <span className="tracking-widest text-[10px]">SFX OFF</span>
          </>
        )}
      </button>
    </div>
  );
}
