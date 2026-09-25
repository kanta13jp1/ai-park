"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import Link from "next/link";
import { Terminal, Download, Languages, GitBranch, AlertTriangle, ExternalLink } from "lucide-react";

// 手順は Google Antigravity 公式ドキュメント（2026年9月25日確認）に基づく
const officialLinks = [
  { label: "ダウンロード", href: "https://antigravity.google/download" },
  { label: "Getting Started", href: "https://antigravity.google/docs/getting-started" },
  { label: "CLI インストール", href: "https://antigravity.google/docs/cli/install/" },
  { label: "プラン", href: "https://antigravity.google/docs/plans/" },
  { label: "FAQ", href: "https://antigravity.google/docs/faq/" },
];

export default function GuidePage() {
  const steps = [
    {
      step: "01",
      title: "動作環境の確認",
      desc: "Windows 10（64bit）以降、macOS 12（Monterey）以降、または glibc 2.28 以降の Linux が必要です。",
    },
    {
      step: "02",
      title: "インストーラーのダウンロードと実行",
      desc: "公式サイト（antigravity.google/download）からOSに合ったインストーラーを取得して実行します。Windowsで SmartScreen の警告が出た場合は、配布元が公式サイトであることを確認のうえ「詳細情報」→「実行」を選びます。既存版の置き換え確認が出たら「Replace（置き換え）」を選択します。",
    },
    {
      step: "03",
      title: "Googleアカウントでサインイン",
      desc: "初回起動時にブラウザが開き、Googleアカウントでサインインします。Antigravity は個人のGoogleアカウント向けに提供されており、会社のGoogle Workspaceアカウントでは利用できない場合があります（詳しくはお問い合わせページのFAQを参照）。",
    },
    {
      step: "04",
      title: "作業フォルダを開いて信頼設定",
      desc: "作業するフォルダ（Gitリポジトリ）を開き、「このフォルダを信頼するか」の確認で信頼を選びます。エージェントは信頼したフォルダ内のファイルを読み書きします。",
    },
  ];

  const japaneseSteps = [
    {
      title: "日本語言語パックを入れる",
      desc: "左側の拡張機能アイコンを開き「Japanese Language Pack」を検索して「Japanese Language Pack for Visual Studio Code」をインストールします。",
    },
    {
      title: "表示言語を切り替えて再起動",
      desc: "インストール後に表示される「言語を変更して再起動」を押します。表示されない場合は「View → Command Palette」から「Configure Display Language」を実行し「ja」を選んで再起動します。",
    },
    {
      title: "AIの回答も日本語にする",
      desc: "メニューが日本語になってもAIの回答は英語のままのことがあります。チャットで「以降は日本語で回答してください」と伝えるか、プロジェクトのルール（エージェントへの常設指示）に「回答は日本語で」と書いておくと確実です。",
    },
  ];

  const gitBasics = [
    { cmd: "git clone <URL>", desc: "リモートリポジトリを手元に複製する（最初の1回）" },
    { cmd: "git switch -c feature/xxx", desc: "作業用ブランチを作って切り替える（mainで直接作業しない）" },
    { cmd: "git status / git diff", desc: "何が変わったかを確認する。AIが編集した内容もここで必ず確認" },
    { cmd: "git add . && git commit -m \"...\"", desc: "変更を記録する。AIにコミットメッセージ案を書かせるのも有効" },
    { cmd: "git push -u origin feature/xxx", desc: "リモートに送ってプルリクエストでレビューを依頼する" },
    { cmd: "git restore <file>", desc: "AIの変更が意図と違ったとき、コミット前の変更を取り消す" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="Antigravity 導入ガイド（AI導入編）"
        subtitle="インストール・日本語化・Git連携までの手順（公式ドキュメント準拠）"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-10">
        {/* 公式ドキュメント */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
          <span className="font-bold text-slate-700 shrink-0">公式ドキュメント（2026/09/25 確認）</span>
          <div className="flex flex-wrap gap-2">
            {officialLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                {l.label}
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>

        {/* アカウントの注意 */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p>
            <span className="font-bold">業務で使う前に：</span>
            個人アカウントで利用する場合、入力したコードやプロンプトの取り扱いは個人向けの利用規約に従います。
            顧客情報や社内機密を扱う業務での利用可否は、必ず
            <Link href="/tools-hub#ai-guidelines" className="underline font-bold mx-0.5">社内AI利用の注意事項</Link>
            を確認してください。
          </p>
        </div>

        {/* セットアップステップ */}
        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-600" />
            <span>初期導入ステップ（IDE版）</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-600 text-white">
                    STEP {s.step}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 日本語化 */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Languages className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">IDEの日本語化（3つの設定）</h3>
          </div>
          <ol className="space-y-3">
            {japaneseSteps.map((s, i) => (
              <li key={s.title} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CLI */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Terminal className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 text-base">CLI（agy）のインストール（任意）</h3>
          </div>
          <p className="text-xs text-slate-500">
            ターミナルからエージェントを使いたい場合のみ。インストール後はブラウザが開いてサインインを求められます。
          </p>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-700">Windows（PowerShell）</span>
              <pre className="mt-1 p-2 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
                irm https://antigravity.google/cli/install.ps1 | iex
              </pre>
            </div>
            <div>
              <span className="font-bold text-slate-700">macOS / Linux</span>
              <pre className="mt-1 p-2 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
                curl -fsSL https://antigravity.google/cli/install.sh | bash
              </pre>
            </div>
          </div>
        </section>

        {/* Git 連携 */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <GitBranch className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-800 text-base">Git / GitHub との付き合い方</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            AIエージェントは複数のファイルを一度に書き換えます。<span className="font-bold">作業前にブランチを切り、変更をGitで確認してから取り込む</span>
            のが事故を防ぐいちばんの方法です。IDE左側の「ソース管理」からも同じ操作をGUIで行えます。
            Gitが未インストールの場合は <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">git-scm.com</a> から導入してください。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gitBasics.map((g) => (
              <div key={g.cmd} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <code className="text-xs font-bold text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded font-mono break-all">
                  {g.cmd}
                </code>
                <p className="text-xs text-slate-600 leading-snug">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
