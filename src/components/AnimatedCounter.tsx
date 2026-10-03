"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value?: number;
  end?: number; // エイリアスサポート
  duration?: number; // ミリ秒（デフォルト 1200ms）
  decimals?: number; // 小数点桁数
  prefix?: string; // 例: "¥", "+"
  suffix?: string; // 例: "人", "時間", "%"
  className?: string;
}

/**
 * Awwwards / FWA 水準の動的数値カウントアップコンポーネント
 * 画面内に入ると 0 から滑らかにイージング（easeOutExpo）を伴ってカウントアップする
 */
export default function AnimatedCounter({
  value,
  end,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const targetValue = value ?? end ?? 0;
  const [displayValue, setDisplayValue] = useState(targetValue);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isIntersectingRef = useRef(false);
  const currentValRef = useRef(displayValue);
  currentValRef.current = displayValue;

  useEffect(() => {
    // ユーザーがアニメーション低減を設定している場合は即座に目標値を表示
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    const startCountAnimation = (startVal: number, endVal: number) => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutExpo: 1 - 2^(-10 * progress)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = startVal + (endVal - startVal) * easeProgress;

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setDisplayValue(endVal);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startCountAnimation(currentValRef.current, targetValue);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // すでに画面内に表示されている状態で value が更新された場合もアニメーションを実行
    if (isIntersectingRef.current && currentValRef.current !== value) {
      startCountAnimation(currentValRef.current, targetValue);
    }

    return () => observer.disconnect();
  }, [targetValue, duration]);

  const formattedValue = displayValue.toLocaleString("ja-JP", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
