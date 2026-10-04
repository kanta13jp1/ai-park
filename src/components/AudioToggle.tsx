"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playCyberClick, playCyberHover } from "@/lib/sound";

const emptySubscribe = () => () => {};

function subscribeSound(callback: () => void) {
  window.addEventListener("ai-park-sound-changed", callback);
  return () => window.removeEventListener("ai-park-sound-changed", callback);
}

export default function AudioToggle() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const enabled = useSyncExternalStore(subscribeSound, () => isSoundEnabled(), () => false);

  if (!isMounted) return null;

  const toggle = () => {
    const next = !enabled;
    setSoundEnabled(next);
    if (next) {
      setTimeout(() => playCyberClick(), 50);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center space-x-2">
      <button
        onClick={() => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }));
        }}
        onMouseEnter={() => playCyberHover()}
        className="px-2.5 py-1.5 rounded-full border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-mono font-bold flex items-center space-x-1 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
        title="キーボードショートカット一覧 (?)"
      >
        <span className="text-[10px] text-cyan-400">?</span>
        <span className="text-[10px] tracking-wider">KEYS</span>
      </button>

      <button
        onClick={toggle}
        onMouseEnter={() => playCyberHover()}
        className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold flex items-center space-x-2 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer active:scale-95 ${
          enabled
            ? "bg-slate-900/90 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20"
            : "bg-slate-900/60 text-slate-400 border-white/10 hover:text-white hover:border-white/30"
        }`}
        title={enabled ? "サイバー触感サウンドを消音 (M)" : "サイバー触感サウンドを有効化 (M)"}
      >
        {enabled ? (
          <>
            <Volume2 size={14} className="text-cyan-400 animate-pulse" />
            <span className="tracking-wide">SOUND ON</span>
          </>
        ) : (
          <>
            <VolumeX size={14} />
            <span className="tracking-wide">MUTED</span>
          </>
        )}
      </button>
    </div>
  );
}
