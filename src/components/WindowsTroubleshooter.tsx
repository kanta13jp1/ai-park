"use client";

import { useState } from "react";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import { playCyberClick, playCyberSuccess, playCyberHover } from "@/lib/sound";
import {
  Wrench,
  Copy,
  Check,
  Search,
  AlertTriangle,
  Terminal,
  ShieldAlert,
  Key,
  Database,
  ExternalLink,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface TroubleshootingItem {
  id: string;
  title: string;
  category: "PowerShell" | "GCP認証" | "ADC・クォータ" | "プロキシ・環境" | "課金・権限";
  errorSnippet: string;
  cause: string;
  command: string;
  commandExplanation: string;
  note?: string;
  docUrl?: string;
}

const troubleshootList: TroubleshootingItem[] = [
  {
    id: "ts-1",
    title: "PowerShell スクリプト実行禁止エラー",
    category: "PowerShell",
    errorSnippet: "このシステムではスクリプトの実行が無効になっているため、ファイル ...ps1 を読み込むことができません (PSSecurityException)",
    cause: "Windowsの初期セキュリティポリシーが「Restricted（スクリプト実行禁止）」になっているためです。",
    command: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser",
    commandExplanation: "現在のユーザー権限のみ安全なスクリプト実行（RemoteSigned）を許可します。管理者権限不要で適用可能です。",
    note: "一時的に1回だけスクリプトを実行したい場合は: powershell -ExecutionPolicy Bypass -File .\\スクリプト名.ps1",
  },
  {
    id: "ts-2",
    title: "Google Cloud 認証切れ・会社アカウント切替",
    category: "GCP認証",
    errorSnippet: "ERROR: (gcloud...) does not have permission / Reauthentication required.",
    cause: "OAuth認証のセッション期限切れ、または個人アカウント（@gmail.com）がアクティブになっているためです。",
    command: "gcloud auth login <会社のメールアドレス> --force",
    commandExplanation: "社用アカウント（@ml-mightylink.com）を指定してブラウザ認証を強制再取得します。",
    note: "ログイン後にアクティブアカウントを固定する場合: gcloud config set account <会社のメールアドレス>",
    docUrl: "https://cloud.google.com/sdk/gcloud/reference/auth/login",
  },
  {
    id: "ts-3",
    title: "ADC（アプリケーションデフォルト認証情報）未設定エラー",
    category: "ADC・クォータ",
    errorSnippet: "Could not automatically determine credentials / DefaultCredentialsError",
    cause: "Python SDKやNode.jsスクリプトが参照するローカル認証ファイル（application_default_credentials.json）が存在しないか無効です。",
    command: "gcloud auth application-default login",
    commandExplanation: "ブラウザが開き、ローカル開発ツール用の統一認証情報（ADC）を生成・保存します。",
    docUrl: "https://cloud.google.com/docs/authentication/provide-credentials-adc",
  },
  {
    id: "ts-4",
    title: "クォータプロジェクト未指定・権限不足エラー",
    category: "ADC・クォータ",
    errorSnippet: "Cannot add the project to ADC as the quota project / serviceusage.services.use denied",
    cause: "ADCによるAPI呼び出し時に、API利用枠（クォータ）を請求するプロジェクトが未指定または権限不足です。",
    command: "gcloud auth application-default set-quota-project mighty-link-ai-connect-xxxxxx",
    commandExplanation: "ご自身がオーナー権限を持つプロジェクトIDをクォータプロジェクトに指定してエラーを解消します。",
  },
  {
    id: "ts-5",
    title: "GCP対象プロジェクトIDの固定設定",
    category: "GCP認証",
    errorSnippet: "ERROR: Project [old-project-id] not found (404) / Permission denied on resource",
    cause: "gcloud CLIの既定プロジェクトが別のプロジェクトに向いているためです。",
    command: "gcloud config set project antigravity-pj-xxxxxx",
    commandExplanation: "社内Antigravity監視・利用対象プロジェクト（antigravity-pj-xxxxxx）を既定値として固定します。",
  },
  {
    id: "ts-6",
    title: "社内プロキシ・自己署名SSL証明書エラー",
    category: "プロキシ・環境",
    errorSnippet: "UNABLE_TO_GET_ISSUER_CERT_LOCALLY / self-signed certificate in certificate chain",
    cause: "社内セキュリティプロキシ（Zscalerやi-FILTER等）によるSSLインスペクションで証明書チェーンがブロックされています。",
    command: "npm config set strict-ssl false",
    commandExplanation: "npmのSSL厳格チェックを一時的に解除します。Python pipの場合は: pip config set global.trusted-host pypi.org",
    note: "PowerShellセッション限定で一時回避する場合: $env:NODE_TLS_REJECT_UNAUTHORIZED=\"0\"",
  },
  {
    id: "ts-7",
    title: "BigQuery 課金エクスポート保存時の権限エラー",
    category: "課金・権限",
    errorSnippet: "The user does not have permission 'billing.accounts.updateUsageExportSpec' on billing account",
    cause: "課金エクスポート設定には「請求先アカウント管理者（roles/billing.admin）」権限が必要です。一般のプロジェクト閲覧者では保存できません。",
    command: "gcloud billing accounts get-iam-policy 012EB1-xxxxxx-xxxxxx",
    commandExplanation: "請求先アカウントの管理者（小林雅水様）を確認し、コンソールの「アクセスをリクエスト」または社内Chatで設定依頼を行ってください。",
    docUrl: "https://cloud.google.com/billing/docs/how-to/export-data-bigquery",
  },
];

export default function WindowsTroubleshooter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["すべて", "PowerShell", "GCP認証", "ADC・クォータ", "プロキシ・環境", "課金・権限"];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      playCyberSuccess();
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredItems = troubleshootList.filter((item) => {
    const matchesCategory = selectedCategory === "すべて" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.errorSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.command.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="troubleshooter" className="my-12 scroll-mt-24">
      <TiltCard
        maxTilt={3}
        glareOpacity={0.12}
        className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden relative"
      >
        {/* 装飾光 */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* ヘッダー */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
                <Wrench size={13} className="animate-spin-slow" />
                <span>社内実務サポート (TODO-18)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Windows環境トラブルシューティング＆エラー解決早見表</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                社内PCでのスクリプト制限、GCP再認証、ADC未設定、クォータエラー等をワンクリックで解消する実戦コマンド集
              </p>
            </div>

            {/* 検索バー */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="エラー文・キーワードで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* カテゴリフィルタタブ */}
          <div className="flex flex-wrap items-center gap-2 pt-6 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playCyberClick();
                  setSelectedCategory(cat);
                }}
                onMouseEnter={() => playCyberHover()}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 scale-105"
                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 font-mono">
              該当件数: {filteredItems.length} 件
            </span>
          </div>

          {/* トラブルシューティングカード一覧 */}
          <div className="space-y-4 mt-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 sm:p-5 hover:border-cyan-500/40 transition-all duration-300 group shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* エラー症状 */}
                    <div className="flex items-start gap-2 bg-rose-950/20 border border-rose-900/30 rounded-lg px-3 py-2 text-xs text-rose-300">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5 text-rose-400" />
                      <span className="font-mono break-all">{item.errorSnippet}</span>
                    </div>

                    {/* 原因説明 */}
                    <p className="text-xs text-slate-300 pt-1">
                      <strong className="text-slate-200">【原因】</strong> {item.cause}
                    </p>
                  </div>
                </div>

                {/* 解決コマンド */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Terminal size={12} />
                      ワンクリック解決コマンド:
                    </span>
                    <span className="text-slate-400">{item.commandExplanation}</span>
                  </div>

                  <div className="relative flex items-center justify-between bg-slate-900/90 border border-cyan-500/20 rounded-xl p-3 text-slate-100 shadow-inner group/cmd hover:border-cyan-400/40 transition-colors">
                    <code className="font-mono text-xs text-cyan-300 break-all select-all mr-2">
                      {item.command}
                    </code>
                    <button
                      onClick={() => handleCopy(item.id, item.command)}
                      onMouseEnter={() => playCyberHover()}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      title="コマンドをコピー"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">コピー完了!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>コピー</span>
                        </>
                      )}
                    </button>
                  </div>

                  {item.note && (
                    <p className="text-[11px] text-amber-300/90 mt-2 font-mono bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-1.5">
                      💡 <strong>Tips:</strong> {item.note}
                    </p>
                  )}

                  {item.docUrl && (
                    <div className="mt-2 text-right">
                      <a
                        href={item.docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <span>公式リファレンスを見る</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                「{searchQuery}」に一致するトラブルシューティングは見つかりませんでした。
              </div>
            )}
          </div>
        </div>
      </TiltCard>
    </section>
  );
}
