"use client";

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import Link from "next/link";
import GcpSetupGuide from "@/components/GcpSetupGuide";
import WindowsAntigravityGuide from "@/components/WindowsAntigravityGuide";
import SafetySelfChecker from "@/components/SafetySelfChecker";
import StepCard, { type GuideStep } from "@/components/GuideStepCard";
import SpotlightCard from "@/components/SpotlightCard";
import {
  Terminal,
  Download,
  Languages,
  GitBranch,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Layers,
  ShieldCheck,
} from "lucide-react";

// 手順は Google Antigravity 公式ドキュメント（2026年9月25日確認）に基づく
const officialLinks = [
  { label: "ダウンロード", href: "https://antigravity.google/download" },
  { label: "Getting Started", href: "https://antigravity.google/docs/getting-started" },
  { label: "CLI インストール", href: "https://antigravity.google/docs/cli/install/" },
  { label: "プラン & クォータ", href: "https://antigravity.google/docs/plans/" },
  { label: "FAQ・よくある質問", href: "https://antigravity.google/docs/faq/" },
];

function CopyableCode({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-1">
      {label && <span className="text-[11px] font-bold text-slate-700 font-mono">{label}</span>}
      <div className="relative flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 group shadow-inner">
        <code className="font-mono text-xs text-cyan-300 break-all select-all mr-2">{code}</code>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          title="コードをコピー"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function GuidePage() {
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
        "ダウンロードが終わったら、Chrome 右上のダウンロード表示にある「Antigravity-x64.exe」をクリック（エクスプローラーの「ダウンロード」フォルダからダブルクリックでもOK）",
        "青い画面「Windows によって PC が保護されました」が出たら、「詳細情報」→「実行」をクリック（出なければそのまま次へ）",
        "以前のバージョンが入っていて「Keep Both」「Replace」を聞かれたら「Replace」を選ぶ",
        "「Antigravity セットアップ」の画面で「インストールしています。しばらくお待ちください…」と表示されるので、終わるまで待つ",
      ],
      note: "「詳細情報」→「実行」は、公式サイト（antigravity.google）からダウンロードしたファイルの場合だけ行ってください。",
      image: "G2-install.png",
      imageAlt: "ダウンロード完了表示とインストール中の画面",
    },
    {
      id: "STEP 3",
      title: "起動してサインインする",
      actions: [
        "スタートメニューから「Antigravity」を起動",
        "業務で使う場合：「Use business account」を選び、会社アカウントでサインイン（詳しくは下の「会社の Google Cloud で Antigravity を使う」の U1）",
        "個人の学習用に使う場合：「Continue with Google」を選び、個人の Google アカウントでサインイン",
        "ブラウザでのログインが終わったら、表示される「Antigravity - Agentic Desktop Application を開く」をクリックしてアプリに戻る",
      ],
      image: ["S1-signin.png", "S5-open-app.png"],
      imageAlt: "サインイン方法を選ぶ画面",
    },
    {
      id: "STEP 4",
      title: "初期設定を済ませる",
      actions: [
        "業務で使う場合：「Select your license」の画面でプロジェクト ID を入力し、「Use Agent Platform instead」を選んで「Next」（詳しくは下の U1）",
        "「Terms of Service & Data Use」の内容を確認する",
        "「Finish」をクリックするとメイン画面が開く",
      ],
      image: "S8-terms-finish.png",
      imageAlt: "利用規約の確認と Finish の画面",
    },
    {
      id: "STEP 5",
      title: "作業フォルダを登録して、AI に依頼してみる",
      actions: [
        "① 左側の「Projects」の右にあるフォルダ＋のアイコンをクリックし、AI に作業させたいフォルダ（Git リポジトリなど）を選ぶ",
        "② 左上の「New Conversation」をクリック",
        "画面中央の入力欄（Ask anything...）に、やってほしいことを日本語で書いて Enter",
        "入力欄の下の「Local」は自分の PC のフォルダで作業するという意味です。最初はそのままでOK",
      ],
      note: "頼み方のコツは「教育用コンテンツ」の初級編チートシートを参照。右上の「Open IDE」は STEP 7 で IDE を入れた場合に使います。",
      image: ["G5-main.png", "L4-running.png", "L5-answer.png"],
      imageAlt: "メイン画面（プロジェクト追加・New Conversation・Settings の場所）",
    },
    {
      id: "STEP 6",
      title: "安全設定を確認する（最初に必ず）",
      actions: [
        "③ 左下の「Settings」をクリックし、① 「General」を開く",
        "② 「Security Preset」の ▼ をクリックし「Default」を選ぶ（ターミナルのコマンド実行と、作業フォルダの外のファイル操作の前に必ず確認が入る設定）",
        "③ 「Plan Review Policy」の ▼ をクリックし「Always Ask」を選ぶ（作業を始める前に計画を見せて確認を求める設定）",
        "右上の × で設定を閉じる",
      ],
      note: "「Full machine」は PC 内のどのファイルでも読み書きでき、「Turbo mode」は安全のための確認がすべて無くなります。業務では使わないでください。",
      image: ["G6-settings.png", "G6-settings-options.png"],
      imageAlt: "Settings の General（Security Preset と Plan Review Policy）",
    },
    {
      id: "STEP 7",
      title: "（任意）エディタ付きの IDE を追加する",
      link: { label: "ダウンロードページを開く", href: "https://antigravity.google/download" },
      actions: [
        "コードを見ながら作業したい人向け。アプリ右上のボタン（未インストールなら「Install IDE」、インストール済みなら「Open IDE」）をクリック",
        "ダウンロードページから入れる場合は、下のほうにある「Antigravity IDE (Standalone)」の「Download for x64」をクリックし、STEP 2 と同じ手順でインストール",
        "「Open IDE」を押すと「An external application wants to open ...」という確認が出ます。自分で押した場合だけ「Yes」をクリック（身に覚えがないときは「No」）",
        "IDE を日本語で使いたい場合は、下の「IDEの日本語化」へ",
      ],
      image: ["G7-download-ide.png", "G7-open-ide-dialog.png"],
      imageAlt: "ダウンロードページの Antigravity IDE (Standalone) の Download for x64",
    },
  ];

  const japaneseSteps = [
    {
      title: "日本語言語パックを入れる",
      desc: "左側の拡張機能アイコン（Ctrl+Shift+X）を開き「Japanese Language Pack」を検索して「Japanese Language Pack for Visual Studio Code」をインストールします。",
    },
    {
      title: "表示言語を切り替えて再起動",
      desc: "インストール後に表示される「言語を変更して再起動」を押します。表示されない場合は「View → Command Palette (Ctrl+Shift+P)」から「Configure Display Language」を実行し「ja」を選んで再起動します。",
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
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title={
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
            <span>Antigravity 導入ガイド</span>
            <span className="inline-block whitespace-nowrap text-cyan-300">
              （AI導入編）
            </span>
          </span>
        }
        subtitle="公式ドキュメント準拠のセットアップ・安全設定・IDE日本語化・Git連携完全マニュアル"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* 公式ドキュメントリンク HUD バー */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 text-xs">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-extrabold text-slate-900 tracking-tight whitespace-nowrap">Google 公式ドキュメント</span>
            <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">| 2026/09/26 確認済み</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {officialLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold transition-all text-[11px]"
              >
                <span>{l.label}</span>
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>

        {/* アカウント利用に関するセキュリティ注意バナー */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-950 leading-relaxed shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-amber-900 text-sm">業務で使う前に必ずご確認ください</h4>
            <p className="text-slate-700 leading-relaxed">
              業務利用時は会社の Google Cloud プロジェクト経由で利用します（従量課金・個人のPro加入は不要）。
              個人アカウント利用時は個人向け規約が適用されます。
              <span className="inline-block">取り扱ってよいデータ範囲は、</span>
              必ず
              <Link href="/tools-hub#ai-guidelines" className="underline font-bold text-amber-900 mx-1 hover:text-amber-700 whitespace-nowrap">
                社内AI利用のセキュリティ基準（Level 1〜3）
              </Link>
              を遵守してください。
            </p>
          </div>
        </div>

        {/* 初期導入ステップ一覧 */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              初期導入ステップ（はじめての方はここから・所要15〜20分）
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            上から順番に進めるだけで即日エージェント開発環境が整います。画像の赤枠の場所を順番にクリックしてください。
          </p>
          <div className="space-y-4">
            {steps.map((s) => (
              <StepCard key={s.id} step={s} />
            ))}
          </div>
        </section>

        {/* GCP 連携ガイド */}
        <GcpSetupGuide />

        {/* Windows 実践Tips & MCP活用ガイド */}
        <WindowsAntigravityGuide />

        {/* 社内AI入力セルフチェック診断ツール */}
        <SafetySelfChecker />

        {/* IDE 日本語化ガイド */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
            <Languages className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                IDE の日本語化（STEP 7 で IDE を入れた方向け・3つの設定）
              </h3>
              <p className="text-xs text-slate-500 font-normal">UIメニューとAIエージェントの返答言語の両方を日本語に最適化します</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {japaneseSteps.map((s, i) => (
              <div key={s.title} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                  0{i + 1}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CLI インストールガイド */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
            <Terminal className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                CLI（agy）のワンクリック・インストール（任意）
              </h3>
              <p className="text-xs text-slate-500 font-normal">ターミナルからエージェントを直接呼び出したい場合に使用します</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CopyableCode
              label="Windows (PowerShell)"
              code="irm https://antigravity.google/cli/install.ps1 | iex"
            />
            <CopyableCode
              label="macOS / Linux (Bash)"
              code="curl -fsSL https://antigravity.google/cli/install.sh | bash"
            />
          </div>
        </section>

        {/* Git 連携プラクティス */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
            <GitBranch className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                Git / GitHub との付き合い方（事故を防ぐ必須ルール）
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                AIエージェントは複数ファイルを一括生成・編集します。作業前ブランチの作成と変更確認を徹底してください。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {gitBasics.map((g) => (
              <SpotlightCard
                key={g.cmd}
                spotlightColor="rgba(249, 115, 22, 0.12)"
                className="bg-slate-50/60 border-slate-200/80"
              >
                <div className="p-4 space-y-2 h-full flex flex-col justify-between">
                  <div className="space-y-1">
                    <CopyableCode code={g.cmd} />
                    <p className="text-xs text-slate-600 leading-snug pt-1">{g.desc}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
