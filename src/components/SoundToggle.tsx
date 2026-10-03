"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playCyberClick, playCyberHover } from "@/lib/sound";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isSoundEnabled());

    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (customEvent.detail) {
        setEnabled(customEvent.detail.enabled);
      }
    };

    window.addEventListener("ai-park-sound-changed", handleSoundChange);
    return () => window.removeEventListener("ai-park-sound-changed", handleSoundChange);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleSound = () => {
    const next = !enabled;
    if (next) {
      setSoundEnabled(true);
      setEnabled(true);
      setTimeout(() => playCyberClick(), 50);
    } else {
      playCyberClick();
      setSoundEnabled(false);
      setEnabled(false);
    }
  };

  return (
    <button
      onClick={toggleSound}
      onMouseEnter={() => playCyberHover()}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 shadow-xs border ${
        enabled
          ? "bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60 hover:border-cyan-400"
          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200"
      }`}
      title={enabled ? "触覚音響をミュートする" : "触覚音響を有効化する"}
      aria-label={enabled ? "触覚音響をミュートする" : "触覚音響を有効化する"}
    >
      {enabled ? (
        <>
          <Volume2 size={13} className="text-cyan-400 animate-pulse" />
          <span>CYBER AUDIO: ON</span>
        </>
      ) : (
        <>
          <VolumeX size={13} className="text-slate-400" />
          <span>CYBER AUDIO: OFF</span>
        </>
      )}
    </button>
  );
}
