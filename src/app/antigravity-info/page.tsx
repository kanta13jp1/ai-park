"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  Sparkles,
  MessageSquare,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  Terminal,
  Cpu,
  Boxes,
  Zap,
  CheckCircle2,
  Download,
  Info,
  Bot
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

export default function AntigravityInfoPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      {/* ヒーローバナー */}
      <HeroBanner
        title="Antigravity情報局"
        subtitle="Google Antigravity & 次世代AIエージェント社内推進拠点"
      />

      {/* Office Hour 予約ボタンバー */}
      <OfficeHourBanner />

      {/* メインコンテンツエリア */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 space-y-12">
        {/* 1. Antigravity CoE 相談デスク セクション */}
        <section className="flex flex-col items-center text-center">
          {/* CoE ビジュアルカード */}
          <div className="relative p-6 bg-gradient-to-b from-slate-50 to-blue-50/50 border-2 border-blue-200/80 shadow-md rounded-2xl max-w-[320px] w-full transform hover:scale-[1.01] transition-transform duration-200">
            <div className="relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
              <Bot size={48} className="animate-pulse" />
              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-1 shadow-xs">
                <Sparkles size={14} />
              </div>
            </div>
            <h4 className="font-bold text-slate-800 text-base">Antigravity CoE Desk</h4>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">MightyLINK AI推進チーム</p>
            <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>平日 10:00〜18:00 受付中</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Antigravity CoE / メンター相談窓口</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Antigravity 相談室（Office Hour）
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Google Antigravity（IDE / CLI `agy`）の環境構築から、業務特化Skillsの開発、MCP外部連携、Subagents並列実行の設計レビューまで、AI推進チームの専任メンターが何でもサポートします！
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CoEメンターに個別相談する（Office Hour 予約）</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Antigravity情報局でサポートできること */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">
              Antigravity情報局でサポートできること
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                <Terminal className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">IDE & CLI (`agy`) 導入支援</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                社内端末へのAntigravity IDEインストール、Google ADC認証・社内Proxy連携、CLIツール（`agy`）の初期設定をハンズオンでサポートします。
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3">
                <Boxes className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">社内Skills & Rules 開発</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                あなたの部署固有の定型業務やコード生成ルールを `SKILL.md` や `RULE` としてパッケージ化。社内標準化・チーム配布を支援します。
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">MCP連携 & Subagent設計</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                BigQuery、GitHub、Jira、社内DBとAntigravityをつなぐMCPサーバー構築や、リサーチ・コーディング・テストを自律分担するサブエージェント設計を支援します。
              </p>
            </div>
          </div>
        </section>

        {/* 3. Antigravity コア機能・社内クイックカード */}
        <section className="bg-gradient-to-br from-slate-900 via-[#1e293b] to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md">
          <div className="max-w-2xl space-y-2 mb-6">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Antigravity 2.0 / Gemini 3.1 Pro 対応
            </span>
            <h3 className="text-xl md:text-2xl font-bold">
              AIと対話する時代から、AIエージェントに「委任」する開発へ
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Antigravityは単なるチャットアシスタントではありません。ファイルの読み書き、ターミナルコマンドの実行、バックグラウンドでの並列サブエージェント起動、自律的なリグレッション検証までを一気通貫で実行します。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="font-bold text-blue-300 text-sm mb-1">Subagents</div>
              <div className="text-slate-300">
                重たい調査やテスト、並行作業を複数のサブエージェントに自律委任。メインの作業をブロックしません。
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="font-bold text-amber-300 text-sm mb-1">Skills System</div>
              <div className="text-slate-300">
                `SKILL.md` を置くだけでエージェントが専門スキルを自動習得。社内ベストプラクティスを即座にコード化。
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="font-bold text-emerald-300 text-sm mb-1">MCP Integration</div>
              <div className="text-slate-300">
                Model Context Protocolにより、社内API、データベース、ブラウザ自動操作ツールと自在に接続。
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="font-bold text-purple-300 text-sm mb-1">Planning Mode</div>
              <div className="text-slate-300">
                大きな変更前に計画書（Implementation Plan）を自動作成。レビュー承認を経てから安全に実行。
              </div>
            </div>
          </div>
        </section>

        {/* 4. 最新トピック & 社内ナレッジ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-800">
                Antigravity 最新トピック & 社内ナレッジ
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">随時更新</span>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                    重要アップデート
                  </span>
                  <span className="text-xs text-slate-400">2026.09.18</span>
                </div>
                <h5 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  【プレビュー公開】Gemini 3.1 Pro / 3.8 Flash のモデルセレクタ解放と有効化手順
                </h5>
                <p className="text-xs text-slate-500">
                  Antigravity IDEの設定で「Preview Features」を有効にすることで、超長文コンテキストと高速推論を誇る最新Geminiモデルが利用可能になりました。
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-4 mt-2" />
            </div>

            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded">
                    スキル配布
                  </span>
                  <span className="text-xs text-slate-400">2026.09.12</span>
                </div>
                <h5 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  【社内標準】MightyLINK向けコーディング規約Rule & テスト自動化Skill（v2.1）リリース
                </h5>
                <p className="text-xs text-slate-500">
                  Git commit規約、KISS/YAGNI原則、セキュリティチェックを自動検証する社内公式Skillパッケージが追加されました。
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-4 mt-2" />
            </div>

            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-800 rounded">
                    MCP連携
                  </span>
                  <span className="text-xs text-slate-400">2026.09.04</span>
                </div>
                <h5 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  【解説】社内BigQueryとAntigravityをMCPで直結！自然言語でデータ分析を行う構成例
                </h5>
                <p className="text-xs text-slate-500">
                  BigQuery MCPサーバーを登録し、Antigravityからスキーマ検索・集計クエリ作成・可視化を一気に行うハンズオン資料です。
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-4 mt-2" />
            </div>
          </div>
        </section>

        {/* 5. 社内クイックリンク & FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-slate-700" />
              <h4 className="font-bold text-sm text-slate-900">Antigravity よくある質問 (FAQ)</h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">Q.</span>
                <span>社内機密コードやAPIキーが外部に学習されるリスクはありませんか？</span>
              </li>
              <li className="text-[11px] text-slate-500 pl-5">
                → Enterprise契約およびADC認証により、入力コード・コンテキストはモデルの学習には一切使用されません。
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">Q.</span>
                <span>Windows環境（PowerShell）でも問題なく動作しますか？</span>
              </li>
              <li className="text-[11px] text-slate-500 pl-5">
                → はい。AntigravityはWindowsネイティブ（PowerShell/cmd）に完全対応しています。
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">Q.</span>
                <span>Skillsは自分で作ってチーム内で共有できますか？</span>
              </li>
              <li className="text-[11px] text-slate-500 pl-5">
                → はい。フォルダに `SKILL.md` を作成しGitで共有するだけで全員が利用可能です。
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
              <h4 className="font-bold text-sm text-slate-900">社内リンク & ドキュメント</h4>
            </div>
            <div className="space-y-2 text-xs">
              <a
                href="https://antigravity.google/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-colors"
              >
                <span>Google Antigravity 公式ドキュメントポータル</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-colors"
              >
                <span>社内リポジトリ: mightylink/antigravity-skills-catalog</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-colors"
              >
                <span>Slack チャンネル: #proj-antigravity-hub</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
              <a
                href="/guide"
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-colors"
              >
                <span>社内向け Antigravity はじめかたガイド (社内Wiki)</span>
                <ArrowRight size={13} className="text-blue-500" />
              </a>
            </div>
          </div>
        </div>

        {/* フッター情報 */}
        <div className="pt-8 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-400">
          <Info size={16} />
          <span>当ページは社内専用ポータル「AI Park」の公式情報局コンテンツです。Google Antigravity CoEが運営しています。</span>
        </div>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
