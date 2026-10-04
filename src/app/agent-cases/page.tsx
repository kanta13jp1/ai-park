"use client";

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  Bot,
  Sparkles,
  GitFork,
  Cpu,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Users,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Shield,
  Layers,
  Smartphone,
  Flame,
  BookOpen,
  X
} from "lucide-react";
import Link from "next/link";

interface AgentCase {
  id: string;
  title: string;
  department: string;
  summary: string;
  subagentRoles: string[];
  estimatedHoursSaved: string;
  status: "PoC検証中" | "試作モデルケース";
  keyBenefits: string[];
}

const AGENT_CASES: AgentCase[] = [
  {
    id: "case-legacy-refactor",
    title: "レガシーNext.js/TSコードの型安全リファクタリング",
    department: "開発第1グループ",
    summary: "親エージェントが全体依存関係を解析し、Subagentが各モジュールの型定義修正とユニットテスト実行を並列で自律処理。",
    subagentRoles: ["Codebase Inspector (Flash)", "Type Refactorer (Pro)", "Test Runner (CLI)"],
    estimatedHoursSaved: "月間約 38 時間削減（PoC試算）",
    status: "PoC検証中",
    keyBenefits: [
      "20ファイル以上の型エラーを一括解消",
      "Gitコミット履歴を汚さない安全なブランチ実行",
      "人的レビュー時間を約65%圧縮"
    ]
  },
  {
    id: "case-sql-optimization",
    title: "BigQuery複雑クエリのコスト最適化 & インデックス設計",
    department: "データ基盤チーム",
    summary: "実行ログからスキャンバイト数の多い重いクエリを特定し、パーティショニングとクラスタリングを最適化。",
    subagentRoles: ["Query Profiler (Flash)", "BigQuery Optimizer (Pro)"],
    estimatedHoursSaved: "月間約 24 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "DRY-RUN検証によるクエリスキャン量の半減",
      "日次バッチ処理時間を42分から18分に短縮",
      "クラウド利用コストの削減に寄与"
    ]
  },
  {
    id: "case-playwright-e2e",
    title: "Playwright E2E UIリグレッション自動テスト生成",
    department: "QA・品質管理部",
    summary: "画面仕様書とDOM構造からPlaywrightテストシナリオを自動合成し、ヘッドレスブラウザで視覚差分を検証。",
    subagentRoles: ["DOM Crawler (Flash)", "Scenario Synthesizer (Pro)", "Visual Diff Checker"],
    estimatedHoursSaved: "月間約 30 時間削減（PoC検証中）",
    status: "PoC検証中",
    keyBenefits: [
      "回帰テストのスクリプト作成工数をゼロ化",
      "PR作成時の自動CI連携による不具合即時検知",
      "主要画面40パターンのクロスブラウザ検証"
    ]
  },
  {
    id: "case-iot-led-display",
    title: "物理LEDサイネージ・HUDリアルタイム音声制御（Voice/Researcher/Pixel協調）",
    department: "スマートオフィス・IoT開発推進チーム",
    summary: "全二重音声モデル（GPT-Live-1）が常時リスニングしながらタスクをクライアント委譲し、推論モデル（GPT-5.6 Luna）とRaspberry Pi上のローカルレンダラが128×64 LEDパネルへシーン・RGBフレームをDDPプロトコルでリアルタイム配信。",
    subagentRoles: [
      "Voice Listener (GPT-Live-1 / Full-Duplex)",
      "Task Researcher (GPT-5.6 Luna / Responses API)",
      "Pixel Renderer (Raspberry Pi / DDP)"
    ],
    estimatedHoursSaved: "月間約 45 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "会議室・オフィスの案内サイネージを音声対話でハンズフリー即時更新",
      "会話中に割り込み（interrupt）可能な全二重クライアント委譲アーキテクチャ",
      "回路図・ESP32配線トラブルシューティングにおけるCodex画像解析の活用"
    ]
  },
  {
    id: "case-repo-inspection-moe",
    title: "超長文1Mコンテキストによるモノレポ全件依存解析 & 規程一括監査",
    department: "基盤技術・全社アーキテクチャ統括",
    summary: "100万トークン（1M）の長大コンテキストウィンドウとMoE（8B Prefill/16B Decode）高効率推論を活かし、モノレポ全体の数千ファイルや全社セキュリティ規程を一括読込。循環参照や脆弱性パターンを高速に網羅検出。",
    subagentRoles: [
      "Repo Crawler (DeepSeek-V4.1-Flash / 1M Context)",
      "Dependency Auditor (Flash MoE)",
      "Report Generator (Pro / Inherit)"
    ],
    estimatedHoursSaved: "月間約 52 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "1Mトークンによるチャンク分割不要のモノレポ全域一括インスペクション",
      "8BアクティベートMoEによる超高速Prefillと大幅なAPIコスト圧縮",
      "MITライセンスオープンウェイトモデルによるオンプレミス検証の実現可能性"
    ]
  },
  {
    id: "case-team-bot-collab",
    title: "チーム共有AIチームメイト（4層協調・Slack常駐・個別プライバシー保護）",
    department: "デジタルワークプレイス・全社DX推進部",
    summary: "Context（チーム規程・設計書）、Plugins（GitHub/Notion/Salesforce）、Credentials（安全なAPI鍵管理）、Memory（プロジェクト運用記憶）の4層で協調する共有AIチームメイトをSlackチャンネルに常駐。",
    subagentRoles: [
      "Slack Listener & Context Matcher (Flash)",
      "SaaS Tool Delegator (Plugins / MCP)",
      "Project Memory Keeper (Long-term DB)"
    ],
    estimatedHoursSaved: "月間約 60 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "Slackチャンネル常駐ハンドルによるシームレスなチーム協働",
      "個別対話のプライバシーを担保した安全な社内情報共有",
      "退職・異動時もプロジェクト文脈が失われない組織記憶（Memory）の維持"
    ]
  },
  {
    id: "case-video-multitrack-editor",
    title: "長時間会議・研修動画のAIマルチトラック要約 & ショート動画自動編集",
    department: "社内広報・ナレッジメディア推進チーム",
    summary: "Manus Studio（Video Editor）アーキテクチャを活用し、タウンホールや勉強会の長時間録画（2時間超）から数十〜数百のクリップを一括解析。文字起こし・冗長部カット・BGMダッキング・独立テロップトラック生成を一気通貫で自動合成。",
    subagentRoles: [
      "Transcript & Scene Extractor (Flash)",
      "Timeline & Storyboard Synthesizer (Pro)",
      "Multi-track Audio/Visual Compositor"
    ],
    estimatedHoursSaved: "月間約 48 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "全素材（映像・テロップ・BGM・効果音）の独立トラック化によるミリ秒単位の手戻り防止",
      "自然言語での「BGMを下げて」「テンポよく」指示とタイムライン直接操作のシームレス往復",
      "社内勉強会アーカイブからの要約ショート動画制作時間を80%短縮"
    ]
  },
  {
    id: "case-autonomous-legacy-migration",
    title: "大規模自律エージェントによるレガシー移行 & CI自動修復",
    department: "システム基盤・モダナイゼーション推進チーム",
    summary: "Cognition Devinのエンタープライズ協働アーキテクチャに倣い、リポジトリ全体を走査してフレームワークのバージョン移行・非推奨API置換・壊れたCIテストの自動修復・プルリクエスト作成までを自律型エージェント群が反復実行。",
    subagentRoles: [
      "Issue & Dependency Scanner (Flash)",
      "Autonomous Refactoring Engine (Pro)",
      "CI Test & Regression Verifier"
    ],
    estimatedHoursSaved: "月間約 85 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "単なるコード提案を超えた、ブランチ作成・ビルド検証・テスト修正までの自律反復完遂",
      "レガシーコード（旧バージョン依存）の機械的一括置換による移行手戻りの撲滅",
      "CI失敗時のエラーログ原因特定からパッチ作成までのリードタイムを70%短縮"
    ]
  },
  {
    id: "case-edge-assistive-robotics",
    title: "エッジビジョンAI × SAM/DINOによるオフィス・現場バリアフリー自律支援",
    department: "スマートモビリティ・IoT研究タスクフォース",
    summary: "Metaのオープンビジョン基盤（DINOv3/DINOv2埋め込み＋SAM自動アノテーション）を活用し、オフィスや作業現場での障害物・段差・自動ドア開閉ボタンをバッテリー駆動のエッジカメラ上で360度リアルタイム検知。通信途絶時でも安全な移動支援と自律ナビゲーションを実現。",
    subagentRoles: [
      "Edge Sensor Stream Parser (DINO)",
      "Object & Barrier Segmenter (SAM)",
      "Safety & Mobility Action Planner"
    ],
    estimatedHoursSaved: "月間約 60 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "クラウド通信に依存しないオンデバイス推論（RF-DETR + DINO埋め込み）によるゼロ遅延の安全回避",
      "SAMを用いた多様な照明・角度の実環境データ自動アノテーションによる学習コスト90%削減",
      "車椅子やスマートカート利用時の段差・危険物接触リスクを未然に防止し、現場のアクセシビリティ向上"
    ]
  },
  {
    id: "case-sovereign-airgapped-agent",
    title: "ソブリンAI・完全オンプレミス環境での自律コーディング & 規程監査",
    department: "基盤セキュリティ統括・金融システム開発室",
    summary: "Mistralのオープンウェイトモデル（Mistral Small 4 / Vibe Code / Mistral Medium）を社内プライベートGPU基盤（オンプレミス）に配備。顧客個人情報や未公開知的財産を外部クラウドへ一切送信せず、閉域網内でリポジトリ解析・脆弱性スキャン・規程準拠テストを自律協調実行。",
    subagentRoles: [
      "Air-Gapped Repository Scanner (Mistral Small)",
      "Sovereign Compliance Auditor (Mistral Medium)",
      "Local Patch Synthesizer (Vibe Code)"
    ],
    estimatedHoursSaved: "月間約 52 時間削減（試作モデルケース）",
    status: "試作モデルケース",
    keyBenefits: [
      "外部通信を一切行わない完全閉域網での自律コーディングとセキュリティパッチ生成",
      "特定クラウドへの依存・API課金変動・利用規約改定リスクの完全排除（ベンダーロックイン防止）",
      "金融・防衛基準の監査ログ保持とオンプレミス完結によるコンプライアンス適合性100%"
    ]
  }
];

export default function AgentCasesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<OfficialAgentItem | null>(null);

  const handleCopy = (text: string, id: string) => {
    playCyberClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="Subagents 活用事例集"
        subtitle="Antigravity 2.0 の並列自律エージェントを活用した社内実測モデルケース"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <UnderConstructionAlert
          statusType="poc"
          title="🧪 PoC検証中・試作モデルケース表示"
          message="現在社内パイロットプロジェクトにてSubagents（自律サブエージェント協調）の実測効果をヒアリング・検証中です。正式運用データが揃い次第更新します。"
          prepDetails="社内パイロットチームでの工数削減実績・安全な権限設定ガイドラインの客観評価を取りまとめています。"
          releaseDate="2026年11月上旬予定"
        />

        {/* Google公式プラグイン対応カスタムエージェント実践導入カタログ */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold tracking-wider uppercase mb-2">
                <Sparkles size={13} className="text-indigo-600" />
                <span>BUILD WITH GOOGLE PLUGINS</span>
              </div>
              <h3 className="font-black text-slate-900 text-xl sm:text-2xl flex items-center gap-2.5">
                <Bot className="w-6 h-6 text-indigo-600" />
                <span>Google公式プラグイン対応 カスタムエージェント実践カタログ</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Google公式ブログ（2026/09/28発表）準拠。Flutter・Firebase・Google Play・AI Park専用の各カスタムエージェント定義（<code className="text-indigo-700 font-mono bg-indigo-50 px-1 py-0.5 rounded">.agents/agents/&lt;name&gt;.md</code>）と、Terminalから即座に呼び出せるCLIコマンドを整備しました。
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto shrink-0">
              全 {OFFICIAL_CUSTOM_AGENTS.length} エージェント
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OFFICIAL_CUSTOM_AGENTS.map((agent) => (
              <TiltCard key={agent.id} maxTilt={4} glareOpacity={0.08} className="h-full rounded-2xl">
                <SpotlightCard
                  spotlightColor="rgba(99, 102, 241, 0.12)"
                  className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl flex flex-col justify-between p-6 space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${agent.badgeColor}`}>
                        {agent.category}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-500">
                        {agent.targetRole}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                        {agent.id.includes("play") && <Smartphone className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {agent.id.includes("ai-park") && <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />}
                        {agent.id.includes("flutter") && <Layers className="w-5 h-5 text-cyan-600 shrink-0" />}
                        {agent.id.includes("firebase") && <Flame className="w-5 h-5 text-amber-600 shrink-0" />}
                        <span>{agent.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>

                    {/* CLI呼び出しコマンド */}
                    <div className="bg-slate-950 text-slate-200 rounded-xl p-3 border border-slate-800 font-mono text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                        <Terminal size={14} className="text-indigo-400 shrink-0" />
                        <span className="text-indigo-300 select-all">{agent.cliCommand}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(agent.cliCommand, `cli-${agent.id}`)}
                        onMouseEnter={() => playCyberHover()}
                        title="CLIコマンドをコピー"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                      >
                        {copiedId === `cli-${agent.id}` ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>

                    {/* 主な能力 */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-mono font-bold text-slate-700">コア検証機能:</div>
                      {agent.keyCapabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* フッターアクション */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 truncate">
                      {agent.agentFilePath}
                    </span>
                    <button
                      onClick={() => {
                        playCyberClick();
                        setSelectedAgentForModal(agent);
                      }}
                      onMouseEnter={() => playCyberHover()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200/60 shrink-0"
                    >
                      <BookOpen size={13} />
                      <span>定義を表示</span>
                    </button>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* HUDハイライトカード */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div onMouseEnter={() => playCyberHover()} className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                  <Bot size={14} className="text-purple-400" />
                  <span>MULTI-AGENT ARCHITECTURE</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  単一プロンプトから「自律協調チーム」への進化
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Antigravity 2.0 の Subagents 機能により、親エージェントがタスクを分割し、調査役（Flash）・実装役（Pro）・テスト実行役（CLI）をバックグラウンドで並列起動。
                  開発者は複雑な指示を待つことなく、完成された差分とテストログを受け取ることが可能になります。
                </p>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 font-mono text-xs space-y-2">
                <div className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>POC HIGHLIGHTS</span>
                </div>
                <div className="text-slate-200">・並列実行による待ち時間 70% 削減</div>
                <div className="text-slate-200">・独立ブランチでの安全なサンドボックス実行</div>
                <div className="text-slate-200">・Flashモデル併用によるトークンコスト半減</div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 社内パイロット事例カード一覧 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <GitFork className="w-5 h-5 text-purple-600" />
                <span>社内パイロット先行事例・モデルケース</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                各部署で進行中のPoC検証シナリオと想定工数削減効果
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/80">
              全 {AGENT_CASES.length} 事例
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {AGENT_CASES.map((item) => (
              <TiltCard
                key={item.id}
                maxTilt={6}
                glareOpacity={0.12}
                className="h-full rounded-2xl"
              >
                <SpotlightCard
                  spotlightColor="rgba(168, 85, 247, 0.15)"
                  className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
                >
                  <div className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-2 font-mono">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {item.status}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {item.department}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-1.5 font-mono">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Subagent Roles</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.subagentRoles.map((role, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-semibold"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-700 font-mono">主要な検証成果:</div>
                        {item.keyBenefits.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-mono">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Clock size={12} />
                        <span>{item.estimatedHoursSaved}</span>
                      </span>
                      <Link
                        href="/how-to"
                        onClick={() => playCyberClick()}
                        onMouseEnter={() => playCyberHover()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-800 transition-colors"
                      >
                        <span>操作手順を見る</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* エージェント詳細定義モーダル */}
        {selectedAgentForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider">
                    {selectedAgentForModal.agentFilePath}
                  </div>
                  <h3 className="text-lg font-black mt-0.5 flex items-center gap-2">
                    <span>{selectedAgentForModal.title}</span>
                  </h3>
                </div>
                <button
                  onClick={() => {
                    playCyberClick();
                    setSelectedAgentForModal(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase mb-1">
                    Terminal 呼び出しコマンド
                  </div>
                  <div className="bg-slate-950 text-indigo-300 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                    <code>{selectedAgentForModal.cliCommand}</code>
                    <button
                      onClick={() => handleCopy(selectedAgentForModal.cliCommand, "modal-cli")}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      {copiedId === "modal-cli" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                      エージェント設定ファイル定義 (Markdown)
                    </span>
                    <button
                      onClick={() => handleCopy(selectedAgentForModal.configMarkdown, "modal-md")}
                      className="inline-flex items-center gap-1 text-xs font-mono text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      {copiedId === "modal-md" ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span>コピーしました</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>定義をコピー</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 overflow-x-auto whitespace-pre-wrap">
                    {selectedAgentForModal.configMarkdown}
                  </pre>
                </div>

                <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 leading-relaxed">
                  💡 <strong>導入手順:</strong> ご利用のプロジェクトルートに <code className="font-mono bg-white px-1 py-0.5 rounded border border-indigo-200">{selectedAgentForModal.agentFilePath}</code> を作成し、上記内容を保存してください。Terminalから <code className="font-mono bg-white px-1 py-0.5 rounded border border-indigo-200">{selectedAgentForModal.cliCommand}</code> を実行すると専用エージェントが起動します。
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    playCyberClick();
                    setSelectedAgentForModal(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Google公式プラグイン対応カスタムエージェントの定義
interface OfficialAgentItem {
  id: string;
  name: string;
  title: string;
  category: "Google Play" | "Portal Release" | "Flutter & Dart" | "Firebase" | "IoT & 物理サイネージ" | "Team Bot & 組織共有";
  badgeColor: string;
  description: string;
  targetRole: string;
  cliCommand: string;
  agentFilePath: string;
  keyCapabilities: string[];
  configMarkdown: string;
}

const OFFICIAL_CUSTOM_AGENTS: OfficialAgentItem[] = [
  {
    id: "play-release-audit",
    name: "play-release-audit",
    title: "Google Play 事前リリース監査ゲートエージェント",
    category: "Google Play",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Google Play Developer Programポリシー、パーミッション、Intent安全宣言、R8/DEX最適化を事前監査する読み取り専用ゲート。",
    targetRole: "Android開発者 / モバイルリード / QA",
    cliCommand: "agy --agent play-release-audit",
    agentFilePath: ".agents/agents/play-release-audit.md",
    keyCapabilities: [
      "AndroidManifest.xml の制限付き権限監査",
      "コンポーネントの android:exported 宣言検証",
      "R8難読化での過剰削除・Keepルール検証",
      "[ APPROVED | CONDITIONAL | BLOCKED ] 判定出力"
    ],
    configMarkdown: `---
name: play-release-audit
description: Google Play Pre-submission Release Gate Auditor.
tools:
  - run_command
  - view_file
---

# Google Play Pre-submission Release Gate Auditor
Strict Read-Only Mode. Run deterministically before Play Console submission.`
  },
  {
    id: "ai-park-release-audit",
    name: "ai-park-release-audit",
    title: "AI Park 本番デプロイ前総合リリース監査エージェント",
    category: "Portal Release",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "MightyLINK AI Parkの公開前総合監査ゲート。未完了注記、手動UAT合格ステータス、静的エクスポート整合性、404ハンドラを検証。",
    targetRole: "フロントエンド開発者 / レビュー担当 / PM",
    cliCommand: "agy --agent ai-park-release-audit",
    agentFilePath: ".agents/agents/ai-park-release-audit.md",
    keyCapabilities: [
      "11画面の未確認・工事中注記（npm run check:gate）検証",
      "開発者手動プリフライト（UAT 4大評価軸）全件合格確認",
      "Next.js 16 静的エクスポート（404.html含む）ビルド検証",
      "Fail-Closed 設計による厳格な合否レポート出力"
    ],
    configMarkdown: `---
name: ai-park-release-audit
description: MightyLINK AI Park デプロイ前総合リリース監査ゲートエージェント。
tools:
  - run_command
  - view_file
---

# AI Park Pre-submission Release Gate Auditor
Strict Read-Only Mode. Verify gate before merging to main.`
  },
  {
    id: "flutter-a11y",
    name: "flutter-a11y",
    title: "Flutter アクセシビリティ自動修正エージェント",
    category: "Flutter & Dart",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    description: "宣言的UIツリーからセマンティックラベル欠落や48x48dp未満のタッチターゲットを自動検知し、安全なFlutterコード修正を提案。",
    targetRole: "Flutter開発者 / UI・アクセシビリティ担当",
    cliCommand: "agy --agent flutter-a11y",
    agentFilePath: ".agents/agents/flutter-a11y.md",
    keyCapabilities: [
      "タッチターゲットサイズ（48x48 dp基準）の自動検出",
      "Semantics / Tooltip ウィジェットの自動ラッピング",
      "W3C WCAG 2.2 準拠のコントラスト比検証",
      "宣言的Widgetツリーへの安全な最小限差分適用"
    ],
    configMarkdown: `---
name: flutter-a11y
description: Flutter Accessibility Custom Agent.
tools:
  - run_command
  - view_file
  - replace_file_content
---

# Flutter Accessibility Custom Agent
Audit and repair semantic labels and touch target sizes.`
  },
  {
    id: "firebase-rules",
    name: "firebase-rules",
    title: "Firebase セキュリティルール堅牢化エージェント",
    category: "Firebase",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "データモデルと認証要件を解析し、過剰なアクセス権限（allow read, write: if true）を未然に防止するFirestoreルールを自動合成。",
    targetRole: "バックエンドエンジニア / クラウドアーキテクト",
    cliCommand: "agy --agent firebase-rules",
    agentFilePath: ".agents/agents/firebase-rules.md",
    keyCapabilities: [
      "過剰権限ルール（ワイルドカード許可）の自動検知",
      "request.auth.uid 準拠のきめ細かなRBACルール生成",
      "Firestore Rules Emulator 向けユニットテストの自動合成",
      "本番デプロイ前のセキュリティ回帰チェック"
    ],
    configMarkdown: `---
name: firebase-rules
description: Firebase Security Rules Custom Agent.
tools:
  - run_command
  - view_file
  - write_to_file
---

# Firebase Security Rules Custom Agent
Generate and statically verify strict Firestore security rules.`
  },
  {
    id: "iot-display-controller",
    name: "iot-display-controller",
    title: "IoT・物理LEDディスプレイ制御エージェント",
    category: "IoT & 物理サイネージ",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "OpenAI最新事例（GPT-Live-1×Codex×Raspberry Pi）準拠。全二重音声対話、クライアント委譲、128×64低解像度RGBレンダリング、ESP32 WLED-MM DDPプロトコル配信を支援。",
    targetRole: "IoTエンジニア / スマートオフィス推進 / 組み込み開発者",
    cliCommand: "agy --agent iot-display-controller",
    agentFilePath: ".agents/agents/iot-display-controller.md",
    keyCapabilities: [
      "全二重音声対話（GPT-Live-1等）とタスク推論のクライアント委譲設計",
      "128×64 RGB LEDパネル向け低解像度ピクセルレンダリング検証",
      "ESP32 WLED-MM DDPプロトコル（UDP 4048）通信・フレームレート調整",
      "配線写真・ピンアサイン照合とPipeWire音声入出力トラブルシューティング"
    ],
    configMarkdown: `---
name: iot-display-controller
description: IoT・物理LEDディスプレイ・オフィスサイネージ制御エージェント。
tools:
  - run_command
  - view_file
---

# IoT & Smart Display Controller Agent
Full-Duplex Voice & Realtime DDP Display Control.`
  },
  {
    id: "team-bot-orchestrator",
    name: "team-bot-orchestrator",
    title: "組織共有AIチームメイト統括エージェント",
    category: "Team Bot & 組織共有",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    description: "xAI Team Botsアーキテクチャ準拠。Context（規程・設計書）、Plugins（GitHub/Notion/Salesforce）、Credentials（API鍵安全管理）、Memory（組織運用記憶）の4層を調停・管理。",
    targetRole: "全社DX推進 / プロジェクトリーダー / Slackインテグレーター",
    cliCommand: "agy --agent team-bot-orchestrator",
    agentFilePath: ".agents/agents/team-bot-orchestrator.md",
    keyCapabilities: [
      "チーム共通Context（ドキュメント・スキル）と個別対話の分離設計",
      "Salesforce / Notion / GitHub 統合プラグイン（MCP）の調停",
      "暗号化Credentials保管と最小権限トークン委譲の監査",
      "長期運用記憶（Memory）のスキーマ定義とSlackメンションハンドラ検証"
    ],
    configMarkdown: `---
name: team-bot-orchestrator
description: 組織共有AIチームメイト（Team Bots 4層アーキテクチャ）統括エージェント。
tools:
  - run_command
  - view_file
---

# Team Bot Orchestrator Agent
Coordinate shared Context, Plugins, Credentials, and Memory for team bots.`
  }
];

