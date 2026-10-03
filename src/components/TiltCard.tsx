"use client";

import React, { useRef, useState, useCallback } from "react";
import { playCyberHover } from "@/lib/sound";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // 最大傾き角度（デフォルト: 6度）
  glareOpacity?: number; // 光沢ハイライトの最大不透明度（デフォルト: 0.15）
  enableSound?: boolean;
}

/**
 * Awwwards / FWA 水準の 3D パースペクティブ・ティルトカードコンポーネント
 * マウス移動に連動して微小な立体傾斜と動的グレア（光沢）を演出
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  glareOpacity = 0.15,
  enableSound = true,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // カード内のX座標
      const y = e.clientY - rect.top; // カード内のY座標

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 中心からのオフセット比率 (-1 〜 1)
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      // 傾き角度の計算
      const rotateX = -percentY * maxTilt;
      const rotateY = percentX * maxTilt;

      setTransform(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
      );

      // グレア位置の計算（パーセント）
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY, opacity: glareOpacity });
    },
    [maxTilt, glareOpacity]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (enableSound) {
      playCyberHover();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // スムーズに元の水平姿勢に戻す
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-2xl will-change-transform ${className}`}
      {...props}
    >
      {/* 動的光沢（Glare）オーバーレイ */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`,
        }}
      />
      {children}
    </div>
  );
}
