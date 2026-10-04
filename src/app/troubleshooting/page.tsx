"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import { playCyberHover, playCyberClick, playCyberSuccess } from "@/lib/sound";
import {
  Wrench,
  Terminal,
  ShieldAlert,
  Search,
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Flame,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  Cpu,
  GitBranch,
  Code2,
} from "lucide-react";

interface TroubleshootingItem {
  id: string;
  category: "powershell" | "git" | "node" | "antigravity" | "vscode";
  categoryLabel: string;
  categoryColor: string;
  title: string;
  symptom: string;
  cause: string;
  solutionSummary: string;
  command?: string;
  notes?: string;
  difficulty: "初級" | "中級" | "上級";
  applicableEnv: string;
}

const troubleshootingMaster: TroubleshootingItem[] = [
  {
    id: "trouble-1",
    category: "powershell",
    categoryLabel: "PowerShell",
    categoryColor: "bg-blue-500/15 text-blue-700 border-blue-300/60",
    title: "スクリプト実行ポリシー制限エラー（Running scripts is disabled）",
    symptom: "powershell で npm やスクリプトを実行した際に「このシステムではスクリプトの実行が無効になっているため...」と表示されて停止する。",
    cause: "Windows PowerShell のデフォルト実行ポリシーが Restricted（スクリプト実行禁止）に設定されているため。",
    solutionSummary: "現在のユーザー権限のみでスクリプト実行を許可（RemoteSigned）します（管理者権限不要）。",
    command: "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force",
    notes: "-Scope CurrentUser を指定するため全社PCの管理者権限がなくても安全に設定できます。",
    difficulty: "初級",
    applicableEnv: "Windows 11 / 10 (PowerShell 5.1 / 7+)",
  },
  {
    id: "trouble-2",
    category: "git",
    categoryLabel: "Git / GitHub",
    categoryColor: "bg-orange-500/15 text-orange-700 border-orange-300/60",
    title: "Git push / pull 時の認証失敗（Authentication failed）",
    symptom: "git push や clone 時に「fatal: Authentication failed」となりパスワード入力が弾かれる。",
    cause: "GitHubではパスワード認証が廃止され、Personal Access Token または GitHub CLI (gh auth) によるブラウザ認証が必須なため。",
    solutionSummary: "GitHub CLI（gh）でブラウザ認証を再初期化するか、古い認証情報をクリアします。",
    command: "gh auth login -w -p https",
    notes: "社内プロキシ配下で弾かれる場合は「git config --global http.sslBackend schannel」を実行してください。",
    difficulty: "初級",
    applicableEnv: "全Windows環境",
  },
  {
    id: "trouble-3",
    category: "antigravity",
    categoryLabel: "Antigravity / agy",
    categoryColor: "bg-cyan-500/15 text-cyan-700 border-cyan-300/60",
    title: "Google Cloud / Antigravity ADC 認証切れ（Credentials missing）",
    symptom: "agy CLI や Vertex AI 連携スクリプトの実行時に「Could not automatically determine credentials」と表示される。",
    cause: "ローカルの Application Default Credentials（ADC）トークンの有効期限が切れているか、初回認証が行われていないため。",
    solutionSummary: "ブラウザ経由で社内Googleアカウントにサインインし、ADCトークンを即時再発行します。",
    command: "gcloud auth application-default login",
    notes: "社内AIプロジェクト用のデフォルトプロジェクト設定は「gcloud config set project [PROJECT_ID]」で行います。",
    difficulty: "中級",
    applicableEnv: "Google Cloud SDK 導入済みの全環境",
  },
  {
    id: "trouble-4",
    category: "vscode",
    categoryLabel: "VS Code / IDE",
    categoryColor: "bg-indigo-500/15 text-indigo-700 border-indigo-300/60",
    title: "Gemini 3.1 Pro プレビューモデルがモデルセレクターに表示されない",
    symptom: "IDE（VS Code / IntelliJ）の Gemini Code Assist チャット枠で「Gemini 3.1 Pro」の選択肢が出ない。",
    cause: "Gemini 3.1 Pro は現在プレビュー提供中のため、設定で「Preview Features」がオフになっていると一覧に表示されません。",
    solutionSummary: "VS Code の settings.json にプレビュー機能を有効化する設定を追記します。",
    command: 'code $PROFILE; # または .vscode/settings.json に { "general": { "previewFeatures": true } } を追記',
    notes: "VS Code の Settings (Ctrl+,) から「Gemini Code Assist: Preview Features」を検索してチェックを入れることでも反映できます。",
    difficulty: "初級",
    applicableEnv: "VS Code / Google Cloud Code 拡張機能",
  },
  {
    id: "trouble-5",
    category: "node",
    categoryLabel: "Node.js / npm",
    categoryColor: "bg-emerald-500/15 text-emerald-700 border-emerald-300/60",
    title: "npm install 時のファイルロック・EPERMエラー（EPERM unlink）",
    symptom: "パッケージインストール時や Next.js 起動時に「npm ERR! code EPERM: operation not permitted」と怒られる。",
    cause: "別プロセス（VS Code のターミナルや実行中サーバー）が node_modules 内のファイルをロックしているか、npm キャッシュが破損しているため。",
    solutionSummary: "開発サーバーを停止し、キャッシュをクリーンアップした上で再インストールします。",
    command: "npm cache clean --force; Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue; npm install",
    notes: "ウイルス対策ソフトが一時的にロックしている場合もあります。短時間待って再試行すると解消することがあります。",
    difficulty: "中級",
    applicableEnv: "Node.js 20+ / Windows 11",
  },
  {
    id: "trouble-6",
    category: "powershell",
    categoryLabel: "PowerShell",
    categoryColor: "bg-blue-500/15 text-blue-700 border-blue-300/60",
    title: "PowerShell コンソールの文字化け（UTF-8 出力エンコード不整合）",
    symptom: "CLI ツールや git log、Python スクリプトの日本語出力が「???」や記号に化けてしまう。",
    cause: "Windows PowerShell (5.1) のデフォルト出力エンコードが Shift-JIS (cp932) になっているため。",
    solutionSummary: "コンソールの入出力エンコードを一時的、またはプロファイルで UTF-8 に固定します。",
    command: "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8",
    notes: "PowerShell 7 (pwsh) を導入するとデフォルトで UTF-8 が適用されるため、根本解決としておすすめです。",
    difficulty: "初級",
    applicableEnv: "Windows PowerShell 5.1",
  },
];

export default function TroubleshootingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "すべて", icon: Wrench },
    { id: "powershell", label: "PowerShell", icon: Terminal },
    { id: "git", label: "Git / GitHub", icon: GitBranch },
    { id: "antigravity", label: "Antigravity", icon: Cpu },
    { id: "vscode", label: "VS Code", icon: Code2 },
    { id: "node", label: "Node.js", icon: FolderOpen },
  ];

  const filteredItems = useMemo(() => {
    return troubleshootingMaster.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchQuery =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.command && item.command.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyCommand = (id: string, command: string) => {
    navigator.clipboard.writeText(command);
    playCyberSuccess();
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="Windows 環境トラブルシューター"
        subtitle="PowerShell 実行権限・Git 認証・Node 競合・Antigravity ADC 認証の自己修復コマンド集"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* HUD サマリーバナー */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-700/50 p-6 sm:p-8 text-white shadow-xl cursor-default"
          >
            <div className="absolute top-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
                    SELF-REPAIR RUNBOOK
                  </span>
                  <span className="text-xs text-indigo-200">社内Windows環境特化・自己解決支援</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  エラーが出たら、コマンドを1クリックコピーして即修復
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  社内のWindows PCでAIツールや開発環境を導入する際につまずきやすい「実行権限」「認証」「ファイルロック」などの頻出エラーを体系化。IT部門への問い合わせ前に、ワンステップで安全に自己解決できます。
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-2 bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/30 font-mono text-xs text-cyan-300">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">登録済みFAQ:</span>
                  <span className="font-bold text-white text-sm">{troubleshootingMaster.length} 件</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">管理者権限不要:</span>
                  <span className="font-bold text-emerald-400">全件対応</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">対象OS:</span>
                  <span className="font-bold text-indigo-300">Windows 11 / 10</span>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 検索・カテゴリーツールバー */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* 検索入力欄 */}
            <div className="relative w-full sm:max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="エラーメッセージ、コマンド、キーワードで検索..."
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5 self-end sm:self-center">
              <span>該当件数:</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                {filteredItems.length} 件
              </span>
            </div>
          </div>

          {/* カテゴリーピルタブ */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? troubleshootingMaster.length
                  : troubleshootingMaster.filter((i) => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playCyberClick();
                    setSelectedCategory(cat.id);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  <Icon size={13} />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* トラブルシューティングカード一覧 */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                該当するトラブル項目が見つかりませんでした
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                キーワードを変更するか、上部のカテゴリーフィルターを「すべて」に戻してお試しください。
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  playCyberClick();
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2"
              >
                <span>フィルターをリセット</span>
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <TiltCard key={item.id} maxTilt={2} glareOpacity={0.04} className="rounded-2xl">
                <SpotlightCard
                  spotlightColor="rgba(99, 102, 241, 0.12)"
                  className="bg-white border-slate-200/90 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.categoryColor}`}>
                        {item.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        難易度: {item.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        環境: {item.applicableEnv}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-start gap-2">
                      <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{item.title}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100/80 space-y-1">
                      <p className="font-bold text-rose-900 flex items-center gap-1">
                        <span>⚠️ 症状・発生エラー</span>
                      </p>
                      <p className="text-rose-800 leading-relaxed font-light">{item.symptom}</p>
                    </div>

                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100/80 space-y-1">
                      <p className="font-bold text-amber-900 flex items-center gap-1">
                        <span>🔍 原因</span>
                      </p>
                      <p className="text-amber-800 leading-relaxed font-light">{item.cause}</p>
                    </div>
                  </div>

                  {/* 解決策 ＆ コマンド */}
                  <div className="p-4 bg-slate-900 rounded-xl text-white space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-cyan-400" />
                        <span>解決手順: {item.solutionSummary}</span>
                      </p>
                      {item.command && (
                        <button
                          onClick={() => handleCopyCommand(item.id, item.command!)}
                          onMouseEnter={() => playCyberHover()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check size={12} className="text-emerald-300" />
                              <span className="text-emerald-300">コピー完了</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>コマンドをコピー</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {item.command && (
                      <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto select-all">
                        <code>{item.command}</code>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        💡 {item.notes}
                      </p>
                    )}
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))
          )}
        </div>

        {/* 相談窓口リンク */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">
              解決しないトラブルや、PC固有の特殊なエラーですか？
            </h4>
            <p className="text-xs text-slate-600">
              社内AI推進担当（担当：梅澤）が個別環境の切り分けやサポートを実施します。
            </p>
          </div>
          <Link
            href="/contact"
            onClick={() => playCyberClick()}
            onMouseEnter={() => playCyberHover()}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            <span>AI推進担当に相談する</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
