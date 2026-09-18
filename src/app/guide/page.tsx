"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { Terminal, Download, CheckCircle, Lightbulb, Code2, Play, ExternalLink } from "lucide-react";

export default function GuidePage() {
  const steps = [
    {
      step: "01",
      title: "Antigravity IDE / 拡張機能のインストール",
      desc: "社内ソフトウェアカタログから「Google Antigravity」インストーラーを取得し、インストールを実行します。VS CodeやJetBrainsを使用している場合はGemini Code Assistプラグインも併せて有効化します。",
      command: "# インストーラー実行または社内ポータルからワンクリックインストール",
    },
    {
      step: "02",
      title: "社内Googleアカウント (ADC) でのログイン",
      desc: "MightyLINKのGoogle WorkspaceアカウントでSSOログインを行います。これにより社内プロキシを安全に通過し、コードの外部非学習が保証されたEnterprise環境で接続されます。",
      command: "gcloud auth application-default login",
    },
    {
      step: "03",
      title: "CLIツール (agy) の有効化 (任意)",
      desc: "ターミナルからエージェントを直接動かしたい場合は、agy CLIを利用できます。PowerShellやBashからいつでもAIペアプログラミングを開始できます。",
      command: "npm install -g @google/antigravity-cli",
    },
    {
      step: "04",
      title: "社内共通Skills & Rulesの取得",
      desc: "社内公式のGitリポジトリから、MightyLINK標準のコーディング規約（`user_rules`）や共通テストスキルを取り込みます。",
      command: "git clone https://github.com/mightylink/antigravity-skills ~/.gemini/config/skills",
    },
  ];

  const slashCommands = [
    { cmd: "/goal", desc: "目標達成まで自律的に思考・試行錯誤・検証をやり切る長距離実行モード" },
    { cmd: "/browser", desc: "ヘッドレスブラウザ（Playwright/Puppeteer）を起動してWeb画面の動作や表示を自律検証" },
    { cmd: "/grill-me", desc: "仕様や設計方針を対話形式でヒアリング・壁打ちし、最適な実装計画を固める" },
    { cmd: "/schedule", desc: "定期実行タスクやワンショットタイマーをバックグラウンドに設定" },
    { cmd: "/learn", desc: "ユーザーからの指摘やプロジェクト固有の知見を学習し、次回以降に永続化" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="Antigravity 導入ガイド"
        subtitle="環境構築から基本操作・便利なスラッシュコマンドまで完全網羅"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-10">
        {/* セットアップステップ */}
        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-600" />
            <span>初期導入ステップ（4ステップで完了）</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-600 text-white">
                      STEP {s.step}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                {s.command && (
                  <div className="mt-3 p-2 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
                    {s.command}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* スラッシュコマンド一覧 */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Terminal className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 text-base">便利なスラッシュコマンド集</h3>
          </div>
          <p className="text-xs text-slate-500">
            チャット入力欄で「/」を入力すると、強力な拡張ワークフローを呼び出すことができます。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {slashCommands.map((c) => (
              <div
                key={c.cmd}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-3"
              >
                <code className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded font-mono">
                  {c.cmd}
                </code>
                <p className="text-xs text-slate-600 leading-snug">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
