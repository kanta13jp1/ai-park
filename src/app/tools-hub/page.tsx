"use client";

import { useState, useMemo } from "react";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import ToolApplicationModal from "@/components/tools/ToolApplicationModal";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  ShieldCheck,
  XCircle,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  FileText,
  Clock,
  Key,
  BadgeCheck,
  Layers,
  Cpu,
  PlusCircle,
} from "lucide-react";
import { playCyberHover, playCyberClick } from "@/lib/sound";

export interface CompanyAiTool {
  id: string;
  name: string;
  vendor: string;
  category: "approved" | "engineer" | "poc";
  categoryLabel: string;
  level: "Level 1" | "Level 2" | "Level 3";
  levelBadge: string;
  status: "利用可能" | "申請制" | "PoC検証中";
  statusColor: string;
  costModel: string;
  targetAudience: string;
  description: string;
  governanceNote: string;
  officialDocUrl: string;
}

const companyAiToolsList: CompanyAiTool[] = [
  {
    id: "tool-antigravity",
    name: "Google Antigravity 2.0 (Gemini 3.1 Pro)",
    vendor: "Google Cloud",
    category: "approved",
    categoryLabel: "会社認可済（全社標準）",
    level: "Level 1",
    levelBadge: "Level 1: 社内機密・コード入力可",
    status: "利用可能",
    statusColor: "emerald",
    costModel: "会社契約 GCP従量課金（90日無料トライアル枠適用中）",
    targetAudience: "全社員（エンジニア・ビジネス職）",
    description: "Google DeepMindの最高峰推論モデル Gemini 3.1 Pro を搭載した公式次世代IDE・エージェント基盤。長大なコンテキスト・マルチエージェント自律実行に対応。",
    governanceNote: "会社アカウント（@ml-mightylink.com）および会社GCPプロジェクト経由でのアクセスが学習不使用契約の適用条件です。",
    officialDocUrl: "https://antigravity.google/",
  },
  {
    id: "tool-vertex-ai",
    name: "Gemini for Google Cloud (Vertex AI)",
    vendor: "Google Cloud",
    category: "approved",
    categoryLabel: "会社認可済（全社標準）",
    level: "Level 1",
    levelBadge: "Level 1: 社内機密・コード入力可",
    status: "利用可能",
    statusColor: "emerald",
    costModel: "GCPプロジェクト課金（Spend Cap設定済）",
    targetAudience: "開発者・インフラ・データ分析担当",
    description: "Cloud Console上でのSQL支援、エラー診断、BigQueryコード補完、Vertex AI Model GardenからのAPI呼び出し。",
    governanceNote: "Spend Cap（利用上限）が適用されたプロジェクト内でのみ利用可能。個人カード登録は厳禁。",
    officialDocUrl: "https://cloud.google.com/vertex-ai",
  },
  {
    id: "tool-github-copilot",
    name: "GitHub Copilot Enterprise",
    vendor: "GitHub / Microsoft",
    category: "engineer",
    categoryLabel: "エンジニア向け（申請制）",
    level: "Level 1",
    levelBadge: "Level 1: 社内機密・コード入力可",
    status: "申請制",
    statusColor: "indigo",
    costModel: "月額固定シート課金（事業部按分）",
    targetAudience: "ソフトウェアエンジニア（VS Code / JetBrains利用者）",
    description: "エディタ統合型のインライン補完・チャット機能。社内リポジトリのインデックス連携により、独自フレームワークに沿ったコード提案が可能。",
    governanceNote: "会社GitHub Organization参加アカウントへのライセンス割り当てが必要。テレメトリ収集オプトアウト設定必須。",
    officialDocUrl: "https://github.com/features/copilot",
  },
  {
    id: "tool-claude-console",
    name: "Claude 3.7 Sonnet (Anthropic Console)",
    vendor: "Anthropic",
    category: "poc",
    categoryLabel: "PoC検証枠",
    level: "Level 2",
    levelBadge: "Level 2: マスキング必須",
    status: "PoC検証中",
    statusColor: "amber",
    costModel: "従量課金（APIトークン消費・検証予算）",
    targetAudience: "アーキテクト・AI推進検証メンバー",
    description: "高度な論理推論と長大アーキテクチャ設計、Claude Code CLIとの連携検証。ハイブリッド思考モードを搭載。",
    governanceNote: "個人情報や社外秘データの入力時は固有名詞マスキングが義務付けられます。",
    officialDocUrl: "https://www.anthropic.com/claude",
  },
  {
    id: "tool-cursor",
    name: "Cursor AI IDE (Business / Team)",
    vendor: "Anysphere",
    category: "poc",
    categoryLabel: "PoC検証枠",
    level: "Level 2",
    levelBadge: "Level 2: マスキング必須",
    status: "PoC検証中",
    statusColor: "amber",
    costModel: "月額固定シート（検証予算）",
    targetAudience: "フロントエンド・フルスタック開発者",
    description: "マルチファイル編集・コードベース全体インデックスによる高速プロトタイピング環境。社内開発環境での適合性検証中。",
    governanceNote: "設定画面にて「Privacy Mode (Do not store/train)」が有効化されていることを必ず確認の上で利用。",
    officialDocUrl: "https://www.cursor.com/",
  },
  {
    id: "tool-manus",
    name: "Manus AI / Manus Studio (Video Editor 搭載)",
    vendor: "Manus",
    category: "poc",
    categoryLabel: "PoC検証枠",
    level: "Level 3",
    levelBadge: "Level 3: 一般公開情報のみ",
    status: "PoC検証中",
    statusColor: "amber",
    costModel: "クレジット従量制（社内検証枠）",
    targetAudience: "企画・リサーチ・広報動画制作・データ自動化担当",
    description: "自律型Webリサーチ・ファイル生成に加え、デスクトップ版（Manus Studio）に全レイヤー独立マルチトラックの「Video Editor」を搭載。社内録画の要約ショート動画化や製品紹介動画の制作に対応。",
    governanceNote: "顧客データ・社内機密コードの投入は厳禁。公開情報のリサーチおよび社内限定公開コンテンツ（公開済セミナー等）の動画編集に限定して利用すること。",
    officialDocUrl: "https://manus.im/ja/blog/introducing-video-editor",
  },
  {
    id: "tool-devin",
    name: "Devin (Cognition 自律型AIエンジニア)",
    vendor: "Cognition",
    category: "poc",
    categoryLabel: "PoC検証枠",
    level: "Level 2",
    levelBadge: "Level 2: マスキング必須",
    status: "PoC検証中",
    statusColor: "amber",
    costModel: "月額シート + コンピュート従量制（検証予算）",
    targetAudience: "ソフトウェアエンジニア・アーキテクト・SRE/QA担当",
    description: "Issue自律解決、レガシーライブラリ移行、CIテストの自動修復・プルリクエスト作成までを完遂する自律型AIエンジニア。GE AerospaceやRivian、NVIDIA等で導入実績多数。",
    governanceNote: "機密認証情報・顧客個人情報がリポジトリに含まれないことを確認の上、サンドボックス検証環境にて利用すること。",
    officialDocUrl: "https://cognition.com/blog/1b-run-rate",
  },
  {
    id: "tool-meta-vision",
    name: "Meta SAM & DINO (Vision Foundation Models)",
    vendor: "Meta AI",
    category: "poc",
    categoryLabel: "PoC検証枠",
    level: "Level 3",
    levelBadge: "Level 3: 一般公開情報のみ",
    status: "PoC検証中",
    statusColor: "amber",
    costModel: "オープンウェイト / オープンソース（無償・オンプレミス/エッジ可）",
    targetAudience: "IoT/組み込みエンジニア・画像処理研究者・スマートオフィス推進・アクセシビリティ担当",
    description: "Metaが公開する基礎ビジョンモデル群。SAM（高精度ゼロショット画像セグメンテーション・自動アノテーション）およびDINOv2/v3（自己教師あり視覚特徴量抽出）。ピッツバーグ大学HERLのスマート車椅子・支援ロボティクス（RAMMP）などエッジ現場で実用化。",
    governanceNote: "オープンウェイトライセンス条項に準拠して利用すること。社内カメラ映像や個人を特定可能な顔画像データを取り扱う際は、必ず事前にデータ匿名化・プライバシー事前審査を実施すること。",
    officialDocUrl: "https://ai.meta.com/blog/assistive-robotics-university-of-pittsburgh-sam-dino/",
  },
  {
    id: "tool-mistral",
    name: "Mistral AI (Le Chat / Vibe / Open Weights)",
    vendor: "Mistral AI",
    category: "poc",
    categoryLabel: "PoC検証枠",
    level: "Level 2",
    levelBadge: "Level 2: マスキング必須 (※セルフホスト時はLevel 1可)",
    status: "PoC検証中",
    statusColor: "amber",
    costModel: "オープンウェイト無償 / API従量制 / エンタープライズ専用基盤",
    targetAudience: "セキュリティ担当・インフラ/MLOps・金融/製造系エンジニア・全社DX推進",
    description: "欧州発のフロンティアAI。完全閉域網・オンプレミスで稼働するオープンウェイトモデル（Mistral Small 4 / Medium 3.5 / OCR 4）と、自律コーディングエージェント「Vibe for Code」を提供。Samsung主導で30億ユーロ調達しソブリンAIを主導。",
    governanceNote: "クラウドAPI（Le Chat / Mistral API）利用時はLevel 2運用（個人情報・未公開ソースコードはマスキング）。社内閉域網（プライベートクラウド/オンプレミスGPU）でのオープンウェイトセルフホスト検証時は社内セキュリティ審査を経てLevel 1適用可。",
    officialDocUrl: "https://mistral.ai/news/mistral-makes-sovereign-open-weight-ai-to-frontier/",
  },
  {
    id: "tool-thinkingbox",
    name: "ThinkingBox (Agent State Evaluator & Benchmark)",
    vendor: "Microsoft & Hugging Face",
    category: "poc",
    categoryLabel: "PoC検証枠",
    level: "Level 1",
    levelBadge: "Level 1: 社内データ利用可 (OSSセルフホスト時)",
    status: "PoC検証中",
    statusColor: "amber",
    costModel: "オープンソース（MITライセンス・無償・セルフホスト）",
    targetAudience: "AIエージェント開発者・QAエンジニア・SRE・エンタープライズアーキテクト",
    description: "MicrosoftとHugging Faceが共同開発した、ステートフル業務エージェントの決定論的評価フレームワーク。単なる会話ログやTool Call成否ではなく、MCP（Model Context Protocol）経由のバックエンドDB状態と副作用、および20回連続実行（Observed 20/20）による再現性を検証。",
    governanceNote: "オープンソースコード（GitHub/Hugging Face）であり、社内の完全閉域ローカルテスト環境（Docker/uv）にて検証可能。実機DBと連動させる場合は、テスト専用サンドボックス環境にて副作用検証を行うこと。",
    officialDocUrl: "https://huggingface.co/blog/microsoft/thinkingbox",
  },
];

const aiGuidelines = [
  {
    title: "機密・個人情報は入力先を選ぶ",
    body: "顧客の個人情報・社内機密・未公開ソースコードは、会社契約で学習不使用が担保されたAI（Level 1）にのみ入力します。個人アカウントのAIには入力しません。",
  },
  {
    title: "入力前にマスキングする",
    body: "Level 2 のツールでは、氏名・電話番号・メールアドレス・顧客名・案件名などを「顧客A」「xxx-xxxx」のように置き換えてから入力します。",
  },
  {
    title: "出力は必ず人が確認する",
    body: "AIの回答やコードには誤りが含まれます。事実・数値・法令・セキュリティに関わる内容は一次情報で確認し、コードはレビューとテストを通してから使います。",
  },
  {
    title: "成果物の責任は使った人が持つ",
    body: "AIで作った資料・コードでも、社外に出す・本番に反映する責任は利用者にあります。他者の著作物をそのまま出力させて使うことは避けます。",
  },
  {
    title: "迷ったら使う前に相談する",
    body: "新しいツールの業務利用や、扱ってよいデータか判断できない場合は、利用前にAI推進担当（お問い合わせ・Office Hour）へ相談してください。",
  },
];

export default function ToolsHubPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetToolName, setTargetToolName] = useState<string>("Google Antigravity 2.0 (Gemini 3.1 Pro)");

  const filteredTools = useMemo(() => {
    return companyAiToolsList.filter((tool) => {
      if (selectedFilter !== "all" && tool.category !== selectedFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.description.toLowerCase().includes(q);
        const matchVendor = tool.vendor.toLowerCase().includes(q);
        const matchTarget = tool.targetAudience.toLowerCase().includes(q);
        return matchName || matchDesc || matchVendor || matchTarget;
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  const handleOpenApplicationModal = (initialName?: string) => {
    playCyberClick();
    if (initialName) {
      setTargetToolName(initialName);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Tools Hub & 申請フロー"
        subtitle="社内認定AIツール一覧・ライセンス利用申請・セキュリティ基準"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* 上部アクションバー */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <BadgeCheck size={13} />
              社内認可AIツール即時申請対応
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              業務に必要なAIツールの利用権限をスムーズに申請
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Google Antigravity 2.0 や Copilot などの利用権限・ライセンス割り当て申請を、所定のセキュリティ誓約とともにGoogle Chat窓口へ即座に提出できます。
            </p>
          </div>
          <button
            onClick={() => handleOpenApplicationModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 transition-all active:scale-95 shrink-0"
          >
            <PlusCircle size={16} />
            <span>AIツールの利用を申請する</span>
          </button>
        </div>

        {/* 検索 & フィルター */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ツール名、ベンダー、対象部署、説明文で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px] shrink-0">
              <Filter size={12} />
              カテゴリ:
            </span>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedFilter("all");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedFilter === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              すべて ({companyAiToolsList.length})
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedFilter("approved");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedFilter === "approved"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              会社認可済（全社標準） (2)
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedFilter("engineer");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedFilter === "engineer"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              エンジニア向け (1)
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedFilter("poc");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedFilter === "poc"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              PoC検証枠 (3)
            </button>
          </div>
        </div>

        {/* ツールカード一覧 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>社内認定・検証中AIツール一覧</span>
            </h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              該当 {filteredTools.length} / 全 {companyAiToolsList.length} 件
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map((tool) => (
              <TiltCard key={tool.id} maxTilt={4} glareOpacity={0.06} className="h-full rounded-2xl">
                <SpotlightCard className="h-full rounded-2xl p-5 border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* カード上部 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                          {tool.vendor}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {tool.name}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          tool.status === "利用可能"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : tool.status === "申請制"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {tool.status}
                      </span>
                    </div>

                    {/* セキュリティLevelバッジ */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          tool.level === "Level 1"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : tool.level === "Level 2"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        <ShieldCheck size={13} />
                        {tool.levelBadge}
                      </span>
                    </div>

                    {/* 概要 */}
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {tool.description}
                    </p>

                    {/* メタ情報 */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">対象者:</span>
                        <span className="font-medium text-slate-800">{tool.targetAudience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">課金モデル:</span>
                        <span className="font-medium text-slate-800">{tool.costModel}</span>
                      </div>
                    </div>

                    {/* ガバナンス注記 */}
                    <p className="text-[11px] text-slate-500 leading-normal border-l-2 border-indigo-300 pl-2">
                      💡 <strong>社内利用ルール:</strong> {tool.governanceNote}
                    </p>
                  </div>

                  {/* カード下部アクション */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={tool.officialDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>公式サイト</span>
                    </a>

                    <button
                      onClick={() => handleOpenApplicationModal(tool.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                    >
                      <FileText size={13} />
                      <span>利用申請ドラフト作成</span>
                    </button>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* セキュリティマトリクス基準表 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>社内データ取り扱いセキュリティ基準 (早見表)</span>
            </h3>
            <span className="text-xs text-slate-400">AI推進担当 作成</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-xl">
              <div
                onMouseEnter={() => playCyberHover()}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2 h-full"
              >
                <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Level 1: 社内機密・コード入力可</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  対象: <strong>会社契約のAI（会社の Google Cloud プロジェクト経由の Antigravity 等）</strong><br />
                  会社として契約し、入力データをモデル学習に使わないことが契約上担保されているサービス。社内ソースコードや設計書の投入が可能です。
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-xl">
              <div
                onMouseEnter={() => playCyberHover()}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 h-full"
              >
                <div className="flex items-center space-x-2 text-amber-800 font-bold">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <span>Level 2: マスキング必須</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  対象: <strong>PoC検証中ツール（Claude Console / Cursor等）</strong><br />
                  個人情報（氏名、電話番号等）や特定顧客の識別情報は必ず別の文字に置き換えて（マスキングして）から入力してください。
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-xl">
              <div
                onMouseEnter={() => playCyberHover()}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2 h-full"
              >
                <div className="flex items-center space-x-2 text-rose-800 font-bold">
                  <XCircle size={16} className="text-rose-600" />
                  <span>Level 3: 一般公開情報のみ</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  対象: <strong>個人アカウントのAIツールおよびWeb自律エージェント試用枠</strong><br />
                  個人向け規約が適用されるため、顧客情報・社内機密・未公開ソースコードは入力しないでください。公開情報を使った学習・試用にとどめます。
                </p>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* 社内AI利用の注意事項（案） */}
        <div id="ai-guidelines" className="scroll-mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>社内AI利用の注意事項 5箇条</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-center">
              全社標準運用中（2026/10/01 制定）
            </span>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs list-none p-0">
            {aiGuidelines.map((g, i) => (
              <li key={g.title}>
                <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-xl">
                  <div
                    onMouseEnter={() => playCyberHover()}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 h-full cursor-default"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{g.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{g.body}</p>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ol>
        </div>

        {/* データ種別ごとの入力可否判定表 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>データ種別ごとの入力可否判定表</span>
            </h3>
            <span className="text-xs text-slate-400">迷ったらここを確認</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-bold">データ種別</th>
                  <th className="py-2.5 px-3 font-bold text-emerald-700">Level 1 (会社契約)</th>
                  <th className="py-2.5 px-3 font-bold text-amber-700">Level 2 (確認中ツール)</th>
                  <th className="py-2.5 px-3 font-bold text-rose-700">Level 3 (個人アカウント)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">社内ソースコード（独自ロジック）</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-amber-700 font-medium">⚠️ 固有識別子を置換</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">社内設計書・技術仕様メモ</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-amber-700 font-medium">⚠️ 顧客名・案件名を置換</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">顧客情報（個人名・電話・メール・契約内容）</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 原則禁止（要事前承認）</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">社内連絡文・メール下書き（定型文作成）</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 氏名伏せ字で可</td>
                  <td className="py-2.5 px-3 text-amber-700 font-medium">⚠️ 完全一般化して可</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">一般技術の調査・言語仕様・エラー調査</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* マスキング実践ガイド */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>実践！マスキングの具体例 (Before / After)</span>
            </h3>
            <span className="text-xs text-slate-400">入力前のセルフチェック</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-xl">
              <div
                onMouseEnter={() => playCyberHover()}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2 h-full cursor-default"
              >
                <span className="font-bold text-rose-800 flex items-center gap-1.5">
                  <XCircle size={15} /> 危険な入力例（NG）
                </span>
                <div className="p-3 bg-white rounded-lg border border-rose-200 font-mono text-[11px] text-slate-700 space-y-1">
                  <p>「〇〇商事の佐藤部長（sato@example.com）から受領した受注テーブルのデータ移行SQLを書いて。接続先は 192.168.1.100、パスワードは P@ssw0rd です」</p>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  ※顧客企業名、担当者個人名、メールアドレス、内部IPアドレス、認証情報が生のまま含まれており重大インシデントに直結します。
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-xl">
              <div
                onMouseEnter={() => playCyberHover()}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2 h-full cursor-default"
              >
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> 安全な入力例（OK）
                </span>
                <div className="p-3 bg-white rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-700 space-y-1">
                  <p>「顧客A社の受注テーブル（カラム: id, amount, created_at）から新テーブルへデータ移行するPostgreSQLのSQLを作成してください。接続情報は環境変数から読み込む前提です」</p>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  ※企業名を抽象化し、個人情報や認証情報を完全に除外。必要なスキーマ構造のみを渡しているため安全です。
                </p>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* 運用ステータス案内 */}
        <UnderConstructionAlert
          statusType="poc"
          title="🧪 社内AIツール利用申請フロー（試作運用中）"
          message="Google Antigravity 2.0 および主要ツールの利用申請ドラフト作成が稼働中です。申請文面をコピーして Google Chat（AI推進窓口・梅澤）へご提出ください。社内ワークフロー自動連携（SSO・Slack Bot）を順次開発中です。"
        />
      </div>

      {/* 申請モーダル */}
      <ToolApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialToolName={targetToolName}
      />
    </div>
  );
}
