"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  Sparkles,
  HelpCircle,
  FileCode2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface FaqItem {
  q: string;
  a: string;
  category: "アカウント・申請" | "機能・モデル" | "セキュリティ・規約";
}

const FAQS: FaqItem[] = [
  {
    category: "機能・モデル",
    q: "最新の Gemini 3.1 Pro モデルは社内で使えますか？",
    a: "はい、利用可能です。VS Code や JetBrains IDE のチャットペイン上部のモデルセレクタから直接切り替えが可能です。一覧に表示されない場合は IDE 設定の「Preview Features」を有効化（または .gemini/settings.json に設定）してください。"
  },
  {
    category: "アカウント・申請",
    q: "新規プロジェクトで Google Cloud の $300 無料枠を利用したい場合は？",
    a: "社内プロジェクト申請フォーム（/contact）からご申請ください。情シス・AI推進チームにて新規GCPプロジェクトを作成し、組織IAM権限と無料クレジットを払い出します。"
  },
  {
    category: "セキュリティ・規約",
    q: "顧客データや個人情報を Antigravity に読み込ませても大丈夫ですか？",
    a: "厳禁です。社内AI利用ガイドラインに基づき、個人情報（PII）・顧客機密データ・秘密鍵・本番認証情報の入力は禁止されています。ダミーデータやモック値に置換してご利用ください。"
  },
  {
    category: "機能・モデル",
    q: "プロジェクト固有のコーディング規約をエージェントに守らせるには？",
    a: "リポジトリのルートディレクトリに `.geminirules` を配置し、プロジェクトのアーキテクチャ方針、命名規則、使用禁止ライブラリ等を記述することで、Antigravity が自律的にルールを遵守してコードを生成します。"
  }
];

export default function AntigravityInfoPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    playCyberClick();
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="Antigravity 情報局"
        subtitle="社内開発者のための Antigravity 2.0 最新リリース・Tips・公式FAQハブ"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中・社内ナレッジ拡充中（準備中）"
          message="社内向けのお知らせ・詳細FAQ・推奨ルールセット（Rules / Skills）の社内共通リポジトリを準備しています。基本操作は導入ガイドおよび Academy をご覧ください。"
          prepDetails="開発標準化委員会およびAI推進チームにて、社内公式の .geminirules テンプレートを作成中です。"
          releaseDate="2026年Q4予定"
        />

        {/* 注目ニュース・ハイライトHUD */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold tracking-wider uppercase">
              <Zap size={14} className="text-cyan-400" />
              <span>OFFICIAL HIGHLIGHTS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Gemini 3.1 Pro & Antigravity 2.0 最新エコシステム
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              Google DeepMind 製の最先端推論モデル Gemini 3.1 Pro の社内展開が開始されました。
              超長文コンテキストの把握能力と高精度な自律タスク実行（エージェンティック・コーディング）により、複雑なリファクタリングやアーキテクチャ設計を強力に支援します。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="text-cyan-400 font-bold text-xs">MODEL GENERATION</div>
                <div className="text-white font-extrabold text-base mt-0.5">Gemini 3.1 Pro</div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">超高速・高精度コード推論</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="text-emerald-400 font-bold text-xs">CONTEXT WINDOW</div>
                <div className="text-white font-extrabold text-base mt-0.5">2,000,000+ Tokens</div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">大規模リポジトリの一括把握</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="text-indigo-400 font-bold text-xs">AUTONOMOUS FLOW</div>
                <div className="text-white font-extrabold text-base mt-0.5">Subagent Routing</div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans">複数エージェント協調実行</div>
              </div>
            </div>
          </div>
        </div>

        {/* 関連学習・ナビゲーション */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.12)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <Link
                href="/guide"
                onClick={() => playCyberClick()}
                onMouseEnter={() => playCyberHover()}
                className="p-5 flex flex-col justify-between h-full space-y-3 group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                    <Terminal size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-cyan-600 transition-colors">
                    Antigravity 導入ガイド
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    環境構築からVS Code拡張のインストール、CLI設定までの全手順
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-cyan-700 font-mono">
                  <span>ガイドを見る</span>
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(99, 102, 241, 0.12)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <Link
                href="/academy"
                onClick={() => playCyberClick()}
                onMouseEnter={() => playCyberHover()}
                className="p-5 flex flex-col justify-between h-full space-y-3 group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <BookOpen size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                    Antigravity Academy
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    3コース・12レッスンで基礎から実践・安全活用を体系的に習得
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-indigo-700 font-mono">
                  <span>講座を始める</span>
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.12)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <Link
                href="/contact"
                onClick={() => playCyberClick()}
                onMouseEnter={() => playCyberHover()}
                className="p-5 flex flex-col justify-between h-full space-y-3 group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <MessageSquare size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-purple-600 transition-colors">
                    アカウント・お問い合わせ
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ライセンス申請、GCP利用枠の拡張、技術的な相談窓口
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-purple-700 font-mono">
                  <span>窓口へ進む</span>
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </SpotlightCard>
          </TiltCard>
        </div>

        {/* よくある質問 (FAQ) アコーディオン */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>社内よくある質問（FAQ）</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                エンジニアからよく寄せられる質問と公式回答
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              全 {FAQS.length} 件
            </span>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    onMouseEnter={() => playCyberHover()}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 font-bold text-slate-800 text-sm sm:text-base cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                        {faq.category}
                      </span>
                      <span>{faq.q}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
