"use client";

import { useState } from "react";
import Link from "next/link";
import BeginnerCheatsheet from "@/components/BeginnerCheatsheet";
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  Video,
  FileText,
  AlertTriangle,
  PlayCircle,
  X,
  ChevronRight,
  Maximize2,
  Building,
  HelpCircle,
} from "lucide-react";

interface LearningItem {
  id: string;
  type: "udemy" | "cert" | "internal";
  typeLabel: string;
  typeBadgeColor: string;
  duration: string;
  title: string;
  recommendedBy?: string;
  warningNote?: string;
  description: string;
  tags: string[];
  level: "初級・全社" | "中級・実務" | "エンジニア";
  syllabus?: string[];
  linkUrl?: string;
}

const learningData: LearningItem[] = [
  // --- Udemy推奨講座 (参考サイト完全準拠) ---
  {
    id: "udemy-01",
    type: "udemy",
    typeLabel: "Udemy講座",
    typeBadgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    duration: "5時間",
    title: "【生成AI】【Dify講座】社内文書を学習した実用的なチャットボットを作ってみよう【非エンジニア向け】【ノーコード】",
    recommendedBy: "AI推進チームおすすめUdemy✨",
    warningNote: "社内文書をアップロードする際は機密情報・個人情報のマスキングをお忘れなく！",
    description: "生成AIを組み合わせプログラミング不要で高度なAIアプリを構築する方法を解説しています。社内文書を登録して社内特化チャットボットを作るノウハウが身につきます。",
    tags: ["Dify", "ノーコード", "社内チャットボット", "非エンジニア歓迎"],
    level: "初級・全社",
    syllabus: [
      "第1章: Difyの概要とアカウント作成",
      "第2章: ナレッジ（社内文書）のアップロードと前処理",
      "第3章: チャットボットのプロンプト設計と調整",
      "第4章: Web公開と社内共有のベストプラクティス",
    ],
    linkUrl: "https://www.udemy.com/",
  },
  {
    id: "udemy-02",
    type: "udemy",
    typeLabel: "Udemy講座",
    typeBadgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    duration: "3.5時間",
    title: "Difyで作るRAG実装とAIエージェント入門 | AIワークフロー大全vol.1",
    recommendedBy: "AI推進チームおすすめUdemy✨",
    warningNote: "⚠️ 第2章Step2のAPIキー直接設定箇所は社内セキュアゲートウェイ環境ではスキップしてください！",
    description: "AIワークフロー大全シリーズ第1弾。DifyでRAGシステムを構築し、ワークフローを通じてSlack/Teamsに回答できるAIアプリケーションの自作手順を徹底解説。",
    tags: ["Dify", "RAG", "AIエージェント", "ワークフロー"],
    level: "中級・実務",
    syllabus: [
      "第1章: RAG（検索拡張生成）の基礎アーキテクチャ",
      "第2章: Difyワークフローのノード設計（条件分岐・LLM連携）",
      "第3章: 外部APIとWebhookを活用した業務システム連携",
      "第4章: Slack / 社内ツールへの通知自動化",
    ],
    linkUrl: "https://www.udemy.com/",
  },
  {
    id: "udemy-03",
    type: "udemy",
    typeLabel: "Udemy講座",
    typeBadgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    duration: "7時間",
    title: "【2026年のAI新常識】AIトレンドを完全攻略 -AIエージェント、世界モデルなど10の必須キーワードの仕組みを理解！",
    recommendedBy: "AIアンバサダー推薦✨",
    description: "2026年のビジネスと社会を動かす「10の必須キーワード」に的を絞り、非エンジニアの方にも分かりやすくその本質と未来予測を解説。全社的なAIリテラシー底上げに最適です。",
    tags: ["2026年トレンド", "世界モデル", "マルチモーダル", "ビジネス教養"],
    level: "初級・全社",
    syllabus: [
      "第1章: 生成AI第2フェーズ（自律型エージェント時代）",
      "第2章: 世界モデル（World Models）と空間知能",
      "第3章: 推論モデル（o1/Gemini Flash Thinking）の衝撃",
      "第4章: 2026年以降の企業における生成AI実装ロードマップ",
    ],
    linkUrl: "https://www.udemy.com/",
  },
  {
    id: "udemy-04",
    type: "udemy",
    typeLabel: "Udemy講座",
    typeBadgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    duration: "1.5時間",
    title: "【2026年最新】AIエージェントの教科書｜基礎知識からカテゴリ別分類、ツール紹介、事例まで徹底網羅",
    recommendedBy: "全社員向け必修レベル✨",
    description: "AIエージェントの基礎知識を根本から学べる教科書的な講座。自律型エージェントの仕組みから最新ツールのカテゴリ別分類、現場での具体的な活用事例までを短時間でキャッチアップできます。",
    tags: ["AIエージェント", "自律化", "ツール分類", "短時間受講"],
    level: "初級・全社",
    syllabus: [
      "第1章: 単なる対話AIと「AIエージェント」の決定的な違い",
      "第2章: ツール利用・ブラウジング・コード実行の自律ループ",
      "第3章: 主要エージェントツールの特性マップ",
      "第4章: 現場業務への組み込みパターン",
    ],
    linkUrl: "https://www.udemy.com/",
  },
  {
    id: "udemy-05",
    type: "udemy",
    typeLabel: "Udemy講座",
    typeBadgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    duration: "4時間",
    title: "Google Antigravity実践マスター｜自律並列SubagentsとSkillsで開発工数を半減させる方法",
    recommendedBy: "クラウド開発部推薦✨",
    description: "次世代AI IDE / CLI「Antigravity」の実践活用法。マルチエージェントオーケストレーション、Skills/Rulesの作成、MCPツール連携による自律コーディングの手順を習得します。",
    tags: ["Antigravity", "Subagents", "MCP", "コード生成"],
    level: "エンジニア",
    syllabus: [
      "第1章: AntigravityのアーキテクチャとCLI (agy) の基本",
      "第2章: スラッシュコマンド（/goal, /browser）の応用",
      "第3章: 独自Skillsの設計とRulesファイルによる規約強制",
      "第4章: MCP（Model Context Protocol）による社内基盤直結",
    ],
    linkUrl: "/guide",
  },
  {
    id: "udemy-06",
    type: "udemy",
    typeLabel: "Udemy講座",
    typeBadgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    duration: "3時間",
    title: "プロンプトエンジニアリング実践マスター｜要件定義・レビュー・データ抽出の実践テクニック",
    recommendedBy: "初学者おすすめ✨",
    description: "Few-shot, Chain-of-Thought, Markdown構造化プロンプトなど、業務で思い通りの出力精度を引き出すプロンプト設計ノウハウ。",
    tags: ["プロンプト", "Chain-of-Thought", "要件定義", "精度向上"],
    level: "初級・全社",
    syllabus: [
      "第1章: プロンプトの3大基本要素（役割・入力・出力形式）",
      "第2章: 思考プロセスの誘導（Chain-of-Thoughtと推論制御）",
      "第3章: 社内文書からの高精度な表データ抽出",
      "第4章: 業務別プロンプトテンプレート集",
    ],
    linkUrl: "/guide",
  },

  // --- 資格情報 ---
  {
    id: "cert-01",
    type: "cert",
    typeLabel: "資格情報",
    typeBadgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    duration: "学習目安: 15〜25時間",
    title: "生成AIパスポート試験（GUGA主催）",
    recommendedBy: "全社員向け推奨資格🏆",
    description: "生成AIに関する基礎知識やリスクリテラシー、著作権法、プロンプトの基礎を体系的に網羅。非エンジニア・営業・企画職の受講率No.1資格です。",
    tags: ["資格試験", "GUGA", "基礎リテラシー", "受験料全額補助対象"],
    level: "初級・全社",
    syllabus: [
      "AI（人工知能）の基礎概念と歴史",
      "生成AIの仕組みと代表的モデルの特徴",
      "現在の動向とビジネス活用事例",
      "情報モラル・セキュリティ・著作権などの法規制",
    ],
    linkUrl: "https://guga.or.jp/",
  },
  {
    id: "cert-02",
    type: "cert",
    typeLabel: "資格情報",
    typeBadgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    duration: "学習目安: 30〜50時間",
    title: "JDLA Deep Learning for GENERAL (G検定)",
    recommendedBy: "実務リーダー推奨資格🏆",
    description: "ディープラーニングの基礎技術、機械学習の手法、ビジネス実装、倫理・法律を網羅する国内最大規模のAIジェネラリスト検定。",
    tags: ["JDLA", "G検定", "機械学習", "受験料全額補助対象"],
    level: "中級・実務",
    syllabus: [
      "人工知能の定義と課題",
      "機械学習の具体的手法（教師あり/なし/強化学習）",
      "ディープラーニングの要素技術とモデル構造",
      "AI倫理・知的所有権・産業への応用",
    ],
    linkUrl: "https://www.jdla.org/certificate/general/",
  },
  {
    id: "cert-03",
    type: "cert",
    typeLabel: "資格情報",
    typeBadgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    duration: "学習目安: 20〜40時間",
    title: "AWS Certified AI Practitioner (AIF)",
    recommendedBy: "クラウドエンジニア推奨🏆",
    description: "AWS上での生成AIおよび機械学習サービスの活用能力、セキュリティ、責任あるAIのフレームワークを問う国際認定資格。",
    tags: ["AWS", "クラウドAI", "Amazon Bedrock", "合格報奨金対象"],
    level: "中級・実務",
    syllabus: [
      "AI/MLの基礎とクラウド概念",
      "生成AIの基盤モデルとAmazon Bedrockの活用",
      "責任あるAI（Responsible AI）とセキュリティ",
      "AWS上でのプロンプトエンジニアリングとファインチューニング",
    ],
    linkUrl: "https://aws.amazon.com/certification/certified-ai-practitioner/",
  },
  {
    id: "cert-04",
    type: "cert",
    typeLabel: "資格情報",
    typeBadgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    duration: "学習目安: 15〜30時間",
    title: "Google Cloud - Introduction to Generative AI (Skill Badge)",
    recommendedBy: "社内標準インフラ認定🏆",
    description: "Google CloudのVertex AI、Geminiモデル群、プロンプト設計、Responsible AIの基礎を網羅する公式学習バッジプログラム。",
    tags: ["Google Cloud", "Gemini", "Vertex AI", "オンライン無料"],
    level: "初級・全社",
    syllabus: [
      "Introduction to Generative AI",
      "Introduction to Large Language Models",
      "Introduction to Responsible AI",
      "Generative AI Studio & Vertex AI Hands-on",
    ],
    linkUrl: "https://cloud.google.com/training",
  },

  // --- 社内研修・勉強会アーカイブ ---
  {
    id: "internal-01",
    type: "internal",
    typeLabel: "社内研修",
    typeBadgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    duration: "25分 (e-Learning)",
    title: "【必修】MightyLINK 社内AI利用規約 & セキュリティ基礎",
    recommendedBy: "全社必修受講✨",
    description: "社内データを安全に取り扱うためのセキュリティガイドライン、個人情報・機密情報のマスキング、著作権・利用許諾の重要ポイントを網羅。",
    tags: ["必修", "セキュリティ", "マスキング", "確認テスト付き"],
    level: "初級・全社",
    syllabus: [
      "生成AI利用の社内基本原則",
      "機密情報・ソースコード送信のルール",
      "著作権・成果物の商用利用基準",
      "確認テスト (全10問・合格基準80点)",
    ],
    linkUrl: "/tools-hub",
  },
  {
    id: "internal-02",
    type: "internal",
    typeLabel: "社内研修",
    typeBadgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    duration: "40分 (ハンズオン動画)",
    title: "Google Antigravity IDE / CLI 導入 & スラッシュコマンド実践",
    recommendedBy: "AI推進チーム必読✨",
    description: "Antigravityのインストールから、VS Code連携、CLI (agy) の基本コマンド、スラッシュコマンド（/goal, /browser 等）の使い方を動画で習得。",
    tags: ["Antigravity", "ハンズオン", "動画解説", "IDE設定"],
    level: "初級・全社",
    syllabus: [
      "Antigravity アーキテクチャ概要",
      "agy コマンドの初期設定とログイン",
      "スラッシュコマンド活用テクニック",
      "Gemini 3.1 Pro モデル切り替え手順",
    ],
    linkUrl: "/guide",
  },
  {
    id: "internal-03",
    type: "internal",
    typeLabel: "社内研修",
    typeBadgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    duration: "45分 (アーカイブ動画)",
    title: "第3回 全社生成AI勉強会「Claude Code & 自律エージェントの現場活用」",
    recommendedBy: "勉強会アーカイブ✨",
    description: "2026年9月開催。ターミナル型エージェントClaude Codeの社内セキュア網での活用法と、QA自動化の実務デモを録画アーカイブで視聴できます。",
    tags: ["Claude Code", "勉強会", "実務デモ", "動画あり"],
    level: "中級・実務",
    syllabus: [
      "Claude Code の機能概要と社内利用ルール",
      "現場エンジニアによるE2Eテスト自動化デモ",
      "質疑応答と今後のトライアル枠募集",
    ],
    linkUrl: "/agent-cases",
  },
];

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<"all" | "udemy" | "cert" | "internal">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

  // フィルタリング処理
  const filteredList = learningData.filter((item) => {
    if (activeTab !== "all" && item.type !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* ページタイトルヘッダー（参考サイト準拠） */}
      <div className="bg-white border-b border-slate-200/90 pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            生成AI <span className="text-sky-600">学習コンテンツ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Udemy講座や資格試験など、AIスキルの向上に役立つリソース
          </p>

          {/* ピル型タブフィルター（参考サイト完全再現） */}
          <div className="pt-4 flex items-center justify-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              すべて ({learningData.length})
            </button>
            <button
              onClick={() => setActiveTab("udemy")}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "udemy"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Udemy講座 (6)
            </button>
            <button
              onClick={() => setActiveTab("cert")}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "cert"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              資格情報 (4)
            </button>
            <button
              onClick={() => setActiveTab("internal")}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "internal"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              社内研修・アーカイブ (3)
            </button>
          </div>
        </div>
      </div>

      {/* メイングリッドエリア */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        <BeginnerCheatsheet />

        {/* 検索ボックス ＆ 受講サポート案内 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">
              社内Udemyアカウント受講・資格受験料の全額会社補助に対応しています
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="講座名やキーワードで検索..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        {/* 講座カードグリッド（参考サイト完全再現） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* バッジ行（種別 + 所要時間） */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${item.typeBadgeColor}`}
                  >
                    {item.typeLabel}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {item.duration}
                  </span>
                </div>

                {/* タイトル */}
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>

                {/* 推薦者コメント */}
                {item.recommendedBy && (
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    {item.recommendedBy}
                  </p>
                )}

                {/* つまずき注意Tips */}
                {item.warningNote && (
                  <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 flex items-start space-x-1.5 leading-relaxed">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>{item.warningNote}</span>
                  </div>
                )}

                {/* 概要説明 */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* フッターアクション（概要を読む ⛶） */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50/70 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>概要を読む</span>
                  <Maximize2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 社内学習サポートバナー */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-semibold">
              <Award size={14} />
              社内スキルアップ支援制度
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              Udemy法人アカウント＆資格受験料の全額会社補助
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              MightyLINKでは全社員の生成AIスキル習得を推進しています。Udemy Businessの無償アカウント発行や、資格試験（G検定・AWS・Google Cloud等）の受験費用補助・合格報奨金制度を利用できます。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white text-center transition-colors shadow-xs"
            >
              Udemy利用・資格補助を申請
            </Link>
            <Link
              href="/how-to"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white text-center transition-colors"
            >
              使い方・学びハブへ戻る
            </Link>
          </div>
        </div>
      </div>

      {/* 詳細モーダル（概要を読む） */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${selectedItem.typeBadgeColor}`}
                  >
                    {selectedItem.typeLabel}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {selectedItem.duration}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedItem.recommendedBy && (
                <p className="font-semibold text-slate-700">
                  {selectedItem.recommendedBy}
                </p>
              )}

              {selectedItem.warningNote && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 leading-relaxed flex items-start space-x-2">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>{selectedItem.warningNote}</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">講座概要・学習内容</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedItem.description}
                </p>
              </div>

              {selectedItem.syllabus && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 block">主なカリキュラム・章構成</span>
                  <ul className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                    {selectedItem.syllabus.map((s, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <CheckCircle2 size={13} className="text-sky-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-sky-50/70 border border-sky-100 rounded-lg p-3 space-y-1">
                <span className="font-bold text-sky-900 block">社内受講・費用精算について</span>
                <p className="text-sky-800 leading-relaxed">
                  社内Udemy Businessのアカウントから無償で直接受講可能です。資格試験の受験料はAI推進担当の全額補助制度をご利用ください。
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                閉じる
              </button>
              {selectedItem.linkUrl && (
                <a
                  href={selectedItem.linkUrl}
                  target={selectedItem.linkUrl.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white flex items-center space-x-1.5 shadow-xs"
                >
                  <span>受講・詳細ページへ</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
