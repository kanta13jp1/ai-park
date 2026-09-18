"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner, UnderConstructionBadge } from "@/components/UnderConstruction";
import { Search, Download, Star, ShieldCheck, Sparkles, FolderCode } from "lucide-react";
import { useState } from "react";

export default function SkillsHubPage() {
  const [search, setSearch] = useState("");

  const skills = [
    {
      name: "accidental-data-loss-prevention",
      title: "不可逆データ損失防止ガード",
      category: "セキュリティ",
      author: "セキュリティ統括",
      stars: 128,
      desc: "DROP TABLE、TRUNCATE、全件DELETE、GCSバケット削除などの破壊的コマンド実行前に必ずユーザー確認を強制する安全ガードスキル。",
    },
    {
      name: "playwright-ui-testing",
      title: "Playwright UI自動検証・スクショ比較",
      category: "テスト・QA",
      author: "品質保証部",
      stars: 94,
      desc: "Next.jsやWebアプリの画面崩れ・レスポンシブ崩れ・アクセシビリティをヘッドレスブラウザで自動検証しスクリーンショットを記録するスキル。",
    },
    {
      name: "bigquery-sql-optimization",
      title: "BigQuery SQL自動最適化 & コスト削減",
      category: "データ分析",
      author: "データエンジニアチーム",
      stars: 82,
      desc: "大量スキャンを防ぐパーティション/クラスタリングの自動付与、ラベル強制、パフォーマンスチューニングを行うスキル。",
    },
    {
      name: "oss-first-architect",
      title: "車輪の再発明防止（OSS探索・選定）",
      category: "設計・アーキテクチャ",
      author: "AI CoE",
      stars: 76,
      desc: "機能開発前にGitHub上の高品質・成熟した既存OSSライブラリを探索し、最もシンプルなMVP設計を提案するスキル。",
    },
    {
      name: "model-router",
      title: "最適基盤モデル自動ルーティング",
      category: "AI基盤",
      author: "AI推進基盤チーム",
      stars: 110,
      desc: "タスクの難易度・コンテキスト長・速度要件に応じてFlash/Pro/Subagentモードを自動選定し、コストと精度を最大化するスキル。",
    },
    {
      name: "figma-live-sync-uiux",
      title: "Figma デザイン同期 & コード変換",
      category: "フロントエンド",
      author: "UI/UXデザインチーム",
      stars: 87,
      desc: "Figmaのデザイン定義（トークン・コンポーネント）からTailwind CSSコードを正確に抽出しUIドリフトを防ぐスキル。",
    },
  ];

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="社内Skillsカタログ"
        subtitle="Antigravityに専門機能を追加する社内公式・公認スキル集"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【準備中】社内Skillsカタログ・自動配信リポジトリを整備中"
          submessage="現在、社内Gitリポジトリ（mightylink/antigravity-skills-catalog）のホスティング環境およびワンクリック導入スクリプトを準備しています。スキルの先行利用はOffice Hourにてご案内可能です。"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="スキル名、用途、カテゴリで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => alert("現在、社内Skillsの新規登録フォームを準備中です。先行登録希望はCoEメンターまでご連絡ください。")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors border border-slate-300"
          >
            <FolderCode size={15} />
            <span>自作Skillを社内登録する</span>
            <span className="text-[10px] text-amber-700 font-normal">（🚧 準備中）</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {skill.category}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold">
                    <Star size={13} fill="currentColor" />
                    <span>{skill.stars}</span>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{skill.title}</h4>
                <code className="text-[11px] text-slate-500 font-mono block mt-0.5 mb-2">
                  {skill.name}
                </code>
                <p className="text-xs text-slate-600 leading-relaxed">{skill.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">作成: {skill.author}</span>
                <button
                  onClick={() => alert(`「${skill.title}」のワンクリック導入スクリプトは現在準備中です。Office Hourにて先行配布しています。`)}
                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium rounded flex items-center space-x-1 transition-colors"
                >
                  <Download size={13} />
                  <span>導入する</span>
                  <span className="text-[10px]">（🚧 準備中）</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
