"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import {
  Search,
  Download,
  Star,
  ShieldCheck,
  Sparkles,
  FolderCode,
  Check,
  Copy,
  X,
  FileCode,
  Tag,
  Send,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SkillItem {
  name: string;
  title: string;
  category: string;
  author: string;
  stars: number;
  desc: string;
  recommendedModel?: string;
  skillMdSnippet?: string;
  installCommand?: string;
}

const initialSkills: SkillItem[] = [
  {
    name: "accidental-data-loss-prevention",
    title: "不可逆データ損失防止ガード",
    category: "セキュリティ",
    author: "セキュリティ統括 CoE",
    stars: 128,
    desc: "DROP TABLE、TRUNCATE、全件DELETE、GCSバケット削除などの破壊的コマンド実行前に必ずユーザー確認を強制する安全ガードスキル。",
    recommendedModel: "Flash / Pro",
    installCommand: "agy skill install mightylink/accidental-data-loss-prevention",
    skillMdSnippet: `---
name: accidental-data-loss-prevention
description: STOP AND VERIFY before running destructive commands (DROP, TRUNCATE, DELETE, bucket deletion).
---

# Accidental Data Loss Prevention
Before running any irreversible destructive command:
1. Stop and ask the user for confirmation.
2. Clearly explain the impact and scope of the operation.
3. Wait for explicit approval before proceeding.`,
  },
  {
    name: "playwright-ui-testing",
    title: "Playwright UI自動検証・スクショ比較",
    category: "テスト・QA",
    author: "品質保証推進部",
    stars: 94,
    desc: "Next.jsやWebアプリの画面崩れ・レスポンシブ崩れ・アクセシビリティをヘッドレスブラウザで自動検証しスクリーンショットを記録するスキル。",
    recommendedModel: "Pro",
    installCommand: "agy skill install mightylink/playwright-ui-testing",
    skillMdSnippet: `---
name: playwright-ui-testing
description: End-to-end automated UI validation, visual regression, and screenshot inspection using Playwright.
---

# Playwright UI Testing
- Validate responsive layouts (Mobile 375px, Tablet 768px, Desktop 1280px).
- Capture screenshots on failures and save to artifacts directory.
- Check WCAG 2.1 AA accessibility guidelines.`,
  },
  {
    name: "bigquery-sql-optimization",
    title: "BigQuery SQL自動最適化 & コスト削減",
    category: "データ分析",
    author: "データ基盤チーム",
    stars: 82,
    desc: "大量スキャンを防ぐパーティション/クラスタリングの自動付与、クエリラベル強制、パフォーマンスチューニングを行うスキル。",
    recommendedModel: "Flash",
    installCommand: "agy skill install mightylink/bigquery-sql-optimization",
    skillMdSnippet: `---
name: bigquery-sql-optimization
description: Enforce partitioning, clustering, mandatory query labels, and SQL cost optimization.
---

# BigQuery SQL Optimization
- Always verify partition filter in WHERE clauses.
- Avoid SELECT * on PB-scale tables.
- Add label attribution for team billing transparency.`,
  },
  {
    name: "oss-first-architect",
    title: "車輪の再発明防止（OSS探索・選定）",
    category: "設計・アーキテクチャ",
    author: "AI CoE アーキテクト",
    stars: 76,
    desc: "機能開発前にGitHub上の高品質・成熟した既存OSSライブラリを探索し、車輪の再発明を防いで最もシンプルなMVP設計を提案するスキル。",
    recommendedModel: "Pro",
    installCommand: "agy skill install mightylink/oss-first-architect",
    skillMdSnippet: `---
name: oss-first-architect
description: Search and evaluate existing open source projects before implementing custom code from scratch.
---

# OSS First Architect
1. Check GitHub and npm/pypi for well-maintained packages.
2. Evaluate stars, license compatibility, and last commit dates.
3. Recommend: (A) Use existing, (B) Fork/adapt, or (C) Build custom.`,
  },
  {
    name: "model-router",
    title: "最適基盤モデル自動ルーティング",
    category: "AI基盤",
    author: "AI推進基盤チーム",
    stars: 110,
    desc: "タスクの難易度・コンテキスト長・速度要件に応じてFlash/Pro/Subagentモードを自動選定し、コストと推論精度を最大化するスキル。",
    recommendedModel: "Flash-Lite / Pro",
    installCommand: "agy skill install mightylink/model-router",
    skillMdSnippet: `---
name: model-router
description: Automatically route user prompts to the most cost-effective and capable model tier.
---

# Model Router
- Lightweight / Quick lookups: gemini-2.5-flash
- Deep reasoning / Complex refactoring: gemini-2.5-pro
- Parallel subagent delegation: Subagents with specialized roles`,
  },
  {
    name: "figma-live-sync-uiux",
    title: "Figma デザイン同期 & コード変換",
    category: "フロントエンド",
    author: "UI/UXデザインチーム",
    stars: 87,
    desc: "Figmaのデザイン定義（トークン・コンポーネント）からTailwind CSSコードを正確に抽出しUIドリフトを防ぐスキル。",
    recommendedModel: "Pro",
    installCommand: "agy skill install mightylink/figma-live-sync-uiux",
    skillMdSnippet: `---
name: figma-live-sync-uiux
description: Synchronize Figma design tokens and generate exact pixel-perfect Tailwind CSS components.
---

# Figma Live Sync
- Read color variables, typography scales, and spacing tokens.
- Generate responsive Tailwind CSS JSX markup.
- Prevent arbitrary magic values in styles.`,
  },
];

const categories = [
  "すべて",
  "セキュリティ",
  "テスト・QA",
  "データ分析",
  "設計・アーキテクチャ",
  "AI基盤",
  "フロントエンド",
];

export default function SkillsHubPage() {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  // モーダル用ステート
  const [selectedSkillForInstall, setSelectedSkillForInstall] = useState<SkillItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  // 申請フォーム用ステート
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("開発支援");
  const [formAuthor, setFormAuthor] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSnippet, setFormSnippet] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // テンプレート挿入
  const applyTemplate = () => {
    setFormSnippet(`---
name: ${formName || "my-custom-skill"}
description: ${formDesc || "ここにスキルの目的・用途を記載します"}
---

# ${formTitle || "My Custom Skill"}
## 目的
社内プロジェクトにおける作業を標準化・自動化します。

## 指針
1. 実行前に必ず影響範囲を確認すること。
2. 標準的なコーディング規約に準拠すること。
`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTitle || !formAuthor) {
      alert("必須項目（スキル識別子、タイトル、申請者名）を入力してください。");
      return;
    }

    const newSkill: SkillItem = {
      name: formName.trim().toLowerCase().replace(/\s+/g, "-"),
      title: formTitle,
      category: formCategory,
      author: formAuthor,
      stars: 1,
      desc: formDesc || "社内エンジニアによる新規登録スキル",
      recommendedModel: "Flash / Pro",
      installCommand: `agy skill install mightylink/${formName.trim().toLowerCase()}`,
      skillMdSnippet: formSnippet || `# ${formTitle}\n${formDesc}`,
    };

    setSkills([newSkill, ...skills]);
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      // フォーム初期化
      setFormName("");
      setFormTitle("");
      setFormAuthor("");
      setFormDesc("");
      setFormSnippet("");
    }, 2000);
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase()) ||
      s.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "すべて" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string, type: "snippet" | "cmd") => {
    navigator.clipboard.writeText(text);
    if (type === "snippet") {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="社内Skillsカタログ"
        subtitle="Antigravityに専門機能を追加する社内公式・公認スキル集"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        {/* バナー: β版として公開 */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>🚀</span>
                  <span>社内Skillsカタログ（先行β版）を公開中</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  Phase 1 機能稼働
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                社内で推奨される高品質なSkillsを閲覧・インポートできます。各チームで開発した自作Skillの登録申請も受付中です。
              </p>
            </div>
          </div>
        </div>

        {/* 検索バー & 登録ボタン */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="スキル名、用途、作成者で検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <FolderCode size={15} />
            <span>自作Skillを社内登録する</span>
          </button>
        </div>

        {/* カテゴリフィルタータブ */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs font-semibold"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* スキルカード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {skill.category}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold">
                    <Star size={13} fill="currentColor" />
                    <span>{skill.stars}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-base">{skill.title}</h4>
                <code className="text-[11px] text-slate-500 font-mono block mt-0.5 mb-2 bg-slate-50 px-2 py-0.5 rounded w-fit">
                  {skill.name}
                </code>
                <p className="text-xs text-slate-600 leading-relaxed">{skill.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">作成: {skill.author}</span>
                <button
                  onClick={() => setSelectedSkillForInstall(skill)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg flex items-center space-x-1 transition-colors border border-blue-200 text-xs"
                >
                  <Download size={13} />
                  <span>導入コードを見る</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
            <p className="text-sm font-semibold">該当するSkillが見つかりませんでした。</p>
            <p className="text-xs text-slate-400">検索条件を変更するか、右上の「自作Skillを社内登録する」から新しく追加してください。</p>
          </div>
        )}
      </div>

      {/* 導入手順モーダル */}
      {selectedSkillForInstall && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSkillForInstall(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                  {selectedSkillForInstall.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedSkillForInstall.name}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {selectedSkillForInstall.title} の導入方法
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedSkillForInstall.desc}
              </p>
            </div>

            {/* 方法1: CLIコマンド */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span>方法 1. Antigravity CLI (agy) でインストール</span>
              </label>
              <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-lg text-xs font-mono">
                <code>{selectedSkillForInstall.installCommand}</code>
                <button
                  onClick={() =>
                    handleCopy(selectedSkillForInstall.installCommand || "", "cmd")
                  }
                  className="ml-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors flex items-center space-x-1 text-[11px]"
                >
                  {copiedCmd ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedCmd ? "コピー済" : "コピー"}</span>
                </button>
              </div>
            </div>

            {/* 方法2: SKILL.md 直接配置 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  方法 2. プロジェクトに手動配置 (`.gemini/skills/` またはグローバル)
                </label>
                <button
                  onClick={() =>
                    handleCopy(selectedSkillForInstall.skillMdSnippet || "", "snippet")
                  }
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
                >
                  {copiedSnippet ? (
                    <Check size={13} className="text-emerald-600" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span>{copiedSnippet ? "SKILL.md をコピーしました" : "SKILL.md をコピー"}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
                {selectedSkillForInstall.skillMdSnippet}
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center space-x-1">
                <HelpCircle size={14} className="text-blue-700" />
                <span>推奨モデル・利用Tips</span>
              </div>
              <p className="text-blue-800/90 text-[11px]">
                推奨モデル: <strong>{selectedSkillForInstall.recommendedModel || "Flash / Pro"}</strong>。スキルを導入後、Antigravity チャット内で自動判別または明示的に指定して呼び出せます。
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSkillForInstall(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 自作Skill登録申請モーダル */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                  MightyLINK CoE
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">自作Skillの社内登録申請</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                チームで作成・活用しているSKILL.mdを全社カタログに登録し、他プロジェクトでも利用可能にします。
              </p>
            </div>

            {isSubmittedSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check size={24} />
                </div>
                <h4 className="font-bold text-emerald-950 text-base">登録申請を受け付けました！</h4>
                <p className="text-xs text-emerald-800">
                  カタログ一覧に即時反映されました。CoEメンバーによる動作確認後、公式リポジトリにも同期されます。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Skill識別子 (半角英数字/ハイフン) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. git-conflict-resolver"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Skillタイトル (日本語名) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gitコンフリクト自動解消支援"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">カテゴリ</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="セキュリティ">セキュリティ</option>
                      <option value="テスト・QA">テスト・QA</option>
                      <option value="データ分析">データ分析</option>
                      <option value="フロントエンド">フロントエンド</option>
                      <option value="設計・アーキテクチャ">設計・アーキテクチャ</option>
                      <option value="AI基盤">AI基盤</option>
                      <option value="開発支援">開発支援</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      申請者名 / 所属チーム <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 山田 太郎 / 基盤開発部"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">概要説明</label>
                  <textarea
                    rows={2}
                    placeholder="このスキルが解決する課題や利用シーンを簡潔に記載してください。"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">SKILL.md 定義内容</label>
                    <button
                      type="button"
                      onClick={applyTemplate}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      + 雛形テンプレートを挿入
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="---&#10;name: my-skill&#10;description: ...&#10;---&#10;# My Skill Instructions"
                    value={formSnippet}
                    onChange={(e) => setFormSnippet(e.target.value)}
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Send size={13} />
                    <span>登録申請を送信</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
