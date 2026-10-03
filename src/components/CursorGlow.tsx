"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    // タッチデバイスでは無効化
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // ホバー中の要素がクリック可能かチェック
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest("[role='button']") ||
        target?.closest("input") ||
        target?.closest("select")
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // イージング（滑らかな追従補間）
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      {/* メインのソフトアンビエントグロー */}
      <div
        className={`rounded-full blur-2xl transition-all duration-200 ${
          isHoveringClickable
            ? "w-40 h-40 bg-gradient-to-tr from-cyan-400/20 via-indigo-500/20 to-purple-500/20 scale-125"
            : "w-32 h-32 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent scale-100"
        }`}
      />
      {/* センターの極小コアポインタ */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30 transition-all duration-150 ${
          isHoveringClickable
            ? "w-6 h-6 bg-cyan-400/10 scale-110"
            : "w-2.5 h-2.5 bg-cyan-400/20 scale-75"
        }`}
      />
    </div>
  );
}
