"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import Link from "next/link";
import GcpSetupGuide from "@/components/GcpSetupGuide";
import StepCard, { type GuideStep } from "@/components/GuideStepCard";
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
  // 手順は公式ドキュメント・公式 codelab（2026/09/26 確認）に基づく。アプリ画面のキャプチャは順次追加
  const steps: GuideStep[] = [
    {
      id: "STEP 1",
      title: "インストーラーをダウンロードする",
      link: { label: "ダウンロードページを開く", href: "https://antigravity.google/download" },
      actions: [
        "左のリンクからダウンロードページを開く",
        "① 画面中ほどの「Windows」をクリック",
        "②「Antigravity 2.0」の下にある黒い「Download for x64」をクリック",
        "画面下や右上に出るダウンロード表示で、ファイルの保存が終わるまで待つ",
      ],
      note: "ほとんどの Windows PC は「x64」です。Snapdragon など ARM 版の PC の場合だけ「Download for ARM64」を選びます。必要な環境は Windows 10（64bit）以降です。",
      image: "G1-download-app.png",
      imageAlt: "ダウンロードページで Windows を選び Download for x64 を押すところ",
    },
    {
      id: "STEP 2",
      title: "インストールする",
      actions: [
        "エクスプローラーで「ダウンロード」フォルダを開き、ダウンロードしたファイル（.exe）をダブルクリック",
        "青い画面「Windows によって PC が保護されました」が出たら、「詳細情報」→「実行」をクリック（出なければそのまま次へ）",
        "以前のバージョンが入っていて「Keep Both」「Replace」を聞かれたら「Replace」を選ぶ",
        "画面の案内に沿って進め、インストールが終わるまで待つ",
      ],
      note: "「詳細情報」→「実行」は、公式サイト（antigravity.google）からダウンロードしたファイルの場合だけ行ってください。",
      imageAlt: "インストーラーの画面",
    },
    {
      id: "STEP 3",
      title: "起動してサインインする",
      actions: [
        "スタートメニューから「Antigravity」を起動",
        "業務で使う場合：「Use business account」を選び、会社アカウントでサインイン（詳しくは下の「会社の Google Cloud で Antigravity を使う」の U1）",
        "個人の学習用に使う場合：「Continue with Google」を選び、個人の Google アカウントでサインイン",
        "ブラウザでのログインが終わったら、表示される「Open Antigravity」をクリックしてアプリに戻る",
      ],
      imageAlt: "サインイン方法を選ぶ画面",
    },
    {
      id: "STEP 4",
      title: "初期設定を済ませる",
      actions: [
        "好きなテーマ（画面の色）を選ぶ",
        "Google プラグインの選択画面は、分からなければ何も選ばずに進んでOK",
        "利用規約を確認して「Accept」をクリック",
        "「Finish」をクリックするとメイン画面が開く",
      ],
      imageAlt: "初期設定（テーマ選択〜Finish）の画面",
    },
    {
      id: "STEP 5",
      title: "作業フォルダをプロジェクトとして登録する",
      actions: [
        "左側の「Projects」にある「Create New Project」をクリック",
        "開いたフォルダ選択画面で、AI に作業させたいフォルダ（Git リポジトリなど）を選ぶ",
        "プロジェクト名の横の歯車アイコンから設定を開き、「Security Preset」でターミナルのコマンド実行やファイル操作の前に確認（レビュー）を求める設定になっていることを確認",
        "「New Conversation」から AI への依頼（チャット）を始める",
      ],
      note: "慣れるまでは、AI がコマンドを実行したりファイルを書き換えたりする前に必ず確認する設定で使ってください。頼み方のコツは「教育用コンテンツ」の初級編チートシートを参照。",
      imageAlt: "Projects の Create New Project ボタン",
    },
    {
      id: "STEP 6",
      title: "（任意）エディタ付きの IDE を追加する",
      link: { label: "ダウンロードページを開く", href: "https://antigravity.google/download" },
      actions: [
        "コードを見ながら作業したい人向け。アプリ右上の「Install IDE」をクリック（またはダウンロードページの下のほうにある「Antigravity IDE (Standalone)」の「Download for x64」）",
        "STEP 2 と同じ手順でインストールする",
        "IDE を日本語で使いたい場合は、下の「IDEの日本語化」へ",
      ],
      image: "G6-download-ide.png",
      imageAlt: "ダウンロードページの Antigravity IDE (Standalone) の Download for x64",
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
          <span className="font-bold text-slate-700 shrink-0">公式ドキュメント（2026/09/26 確認）</span>
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
            業務では会社のGoogle Cloudプロジェクト経由で利用します（料金は会社の請求に従量課金でまとまり、個人のPro加入は不要）。
            個人アカウントで利用する場合は個人向けの利用規約が適用されます。扱ってよいデータは、必ず
            <Link href="/tools-hub#ai-guidelines" className="underline font-bold mx-0.5">社内AI利用の注意事項</Link>
            を確認してください。
          </p>
        </div>

        {/* セットアップステップ */}
        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-600" />
            <span>初期導入ステップ（はじめての方はここから・所要15分）</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            上から順番に進めれば使い始められます。右側の画像の赤枠の場所をクリックしてください。
            表示が英語の画面もありますが、ボタン名は手順に書いた文字と同じです（バージョンによって見た目が少し違うことがあります）。
          </p>
          <div className="space-y-3">
            {steps.map((s) => (
              <StepCard key={s.id} step={s} />
            ))}
          </div>
        </section>

        <GcpSetupGuide />

        {/* 日本語化 */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Languages className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">IDEの日本語化（STEP 6 で IDE を入れた方向け・3つの設定）</h3>
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
