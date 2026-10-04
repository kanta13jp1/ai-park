"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playCyberClick, playCyberHover } from "@/lib/sound";

const emptySubscribe = () => () => {};

function subscribeSound(callback: () => void) {
  window.addEventListener("ai-park-sound-changed", callback);
  return () => window.removeEventListener("ai-park-sound-changed", callback);
}

export default function SoundToggle() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const enabled = useSyncExternalStore(subscribeSound, () => isSoundEnabled(), () => true);

  if (!isMounted) {
    return null;
  }

  const toggleSound = () => {
    const next = !enabled;
    if (next) {
      setSoundEnabled(true);
      setTimeout(() => playCyberClick(), 50);
    } else {
      playCyberClick();
      setSoundEnabled(false);
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
      title={enabled ? "効果音をミュート" : "効果音を有効化"}
    >
      {enabled ? (
        <>
          <Volume2 size={14} className="text-cyan-400 animate-pulse" />
          <span>SOUND ON</span>
        </>
      ) : (
        <>
          <VolumeX size={14} className="text-slate-500" />
          <span>MUTED</span>
        </>
      )}
    </button>
  );
}
