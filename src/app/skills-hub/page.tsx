"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import SkillApplicationModal from "@/components/skills/SkillApplicationModal";
import { playCyberClick, playCyberSuccess, playCyberHover } from "@/lib/sound";
import {
  Wrench,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Code2,
  FileText,
  Search,
  Filter,
  ArrowRight,
  Cpu,
  Layers,
  Terminal,
  Database,
  Plus,
  Compass,
  CheckCircle2
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

interface SkillItem {
  id: string;
  name: string;
  category: "コード・品質" | "データ・SQL" | "ドキュメント・要件" | "セキュリティ" | "運用自動化";
  status: "社内認定 (Verified)" | "PoC検証中" | "試作カタログ";
  description: string;
  triggerPhrase: string;
  author: string;
  badgeColor?: string;
}

// 社内で実際に作成・確認した Skills だけを追加する（架空のスキル・作成部署・認定は載せない）
const SKILLS_CATALOG: SkillItem[] = [];

export default function SkillsHubPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const categories = ["all", "コード・品質", "データ・SQL", "ドキュメント・要件", "セキュリティ", "運用自動化"] as const;

  const filteredSkills = useMemo(() => {
    return SKILLS_CATALOG.filter((skill) => {
      const matchCategory = selectedCategory === "all" || skill.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        q === "" ||
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.triggerPhrase.toLowerCase().includes(q) ||
        skill.author.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    playCyberClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        playCyberSuccess();
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="社内 Skills カタログ"
        subtitle="社内で共有する Antigravity の Skills（準備中）"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：社内Skillsカタログを準備しています"
          message="社内で共有している Skills はまだありません。社内で作成・確認が済んだものから掲載します。"
        />

        {/* HUDハイライト */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40 cursor-default"
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                  <Wrench size={14} className="text-indigo-400" />
                  <span>ANTIGRAVITY EXTENSIONS</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  チームのナレッジをエージェントの「即戦力スキル」へ
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Antigravity Skills は、プロジェクトで培った定常業務・品質規約・デプロイ手順をMarkdownおよびスクリプトとしてパッケージ化したものです。
                  リポジトリ内に配置するだけで、エージェントが必要なタイミングで自律的にスキルをロードし、高品質な成果物を生成します。
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      playCyberClick();
                      setIsApplyModalOpen(true);
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新規Skillを提案・申請する</span>
                  </button>
                  <Link
                    href="/guide"
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>導入ガイドを見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 font-mono text-xs space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>CERTIFIED CRITERIA</span>
                </div>
                <div className="text-slate-200">・シークレット・APIキー非含有の検証済</div>
                <div className="text-slate-200">・破壊的コマンド（DROP/RM）の遮断</div>
                <div className="text-slate-200">・標準入出力（stdio）準拠の安全設計</div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* フィルター＆検索バー */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* 検索入力 */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="スキル名、構文、キーワード、作成部署で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  クリア
                </button>
              )}
            </div>

            {/* 新規提案ボタン */}
            <button
              onClick={() => {
                playCyberClick();
                setIsApplyModalOpen(true);
              }}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>自作Skillの申請</span>
            </button>
          </div>

          {/* カテゴリピル */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>カテゴリ:</span>
            </span>
            {categories.map((cat) => {
              const count =
                cat === "all"
                  ? SKILLS_CATALOG.length
                  : SKILLS_CATALOG.filter((s) => s.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playCyberClick();
                    setSelectedCategory(cat);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  {cat === "all" ? "すべて" : cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* スキル一覧 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>社内 Skills 一覧（準備中）</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                コマンドまたは自然言語でエージェントに呼び出し可能なスキル一覧
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
              該当 {filteredSkills.length} / 全 {SKILLS_CATALOG.length} 件
            </span>
          </div>

          {filteredSkills.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <Compass className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">
                {SKILLS_CATALOG.length === 0 ? "🚧 工事中：社内で共有している Skills はまだありません" : "該当するスキルが見つかりませんでした"}
              </p>
              <p className="text-xs text-slate-400">
                作成・確認が済んだものから掲載します。右上の「自作Skillの申請」から提案できます。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSkills.map((skill) => (
                <TiltCard
                  key={skill.id}
                  maxTilt={6}
                  glareOpacity={0.12}
                  className="h-full rounded-2xl"
                >
                  <SpotlightCard
                    spotlightColor="rgba(99, 102, 241, 0.12)"
                    className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
                  >
                    <div className="p-6 flex flex-col justify-between h-full space-y-4">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-2 font-mono">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              skill.status.includes("社内認定")
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : skill.status.includes("PoC")
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {skill.status}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {skill.category}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                          {skill.name}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {skill.description}
                        </p>

                        {/* 呼び出し構文 */}
                        <div className="space-y-1.5 font-mono">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>呼び出しプロンプト構文:</span>
                            <button
                              onClick={() => handleCopy(skill.id, skill.triggerPhrase)}
                              onMouseEnter={() => playCyberHover()}
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
                            >
                              {copiedId === skill.id ? (
                                <>
                                  <Check size={12} className="text-emerald-600" />
                                  <span className="text-emerald-600">コピー完了</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>構文をコピー</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="bg-slate-950 text-cyan-300 p-3 rounded-xl text-xs overflow-x-auto border border-slate-800">
                            <code>{skill.triggerPhrase}</code>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                        <span className="text-slate-400">作成: {skill.author}</span>
                        <span
                          className={`font-bold ${
                            skill.status.includes("社内認定")
                              ? "text-emerald-600"
                              : "text-indigo-600"
                          }`}
                        >
                          審査ステータス: {skill.status.includes("社内認定") ? "適合 (公式認定)" : "適合 (PoC)"}
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 新規Skill提案モーダル */}
      <SkillApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
