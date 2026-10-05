"use client";

import { useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldCheck,
  Building,
  KeyRound,
  ExternalLink,
} from "lucide-react";

interface GeminiStatsSyncStatusProps {
  syncedAt: string;
  dataSource: string;
  isLive: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  projectId: string;
  syncMode?: "api_live" | "snapshot_verified";
  syncModeLabel?: string;
}

export default function GeminiStatsSyncStatus({
  syncedAt,
  dataSource,
  isLive,
  isLoading,
  onRefresh,
  projectId,
  syncMode = "api_live",
  syncModeLabel = "完全API自動同期中",
}: GeminiStatsSyncStatusProps) {
  const [isOpenFaq, setIsOpenFaq] = useState(false);

  return (
    <div id="sync-status" className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* ステータスバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin text-indigo-500" : ""}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                データ同期ステータス
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                syncMode === "api_live"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
                <CheckCircle2 size={11} />
                <span>{syncModeLabel}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                取得元: {dataSource}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              最終同期: <span className="font-bold text-slate-700">{syncedAt}</span> ｜ 対象: <span className="font-bold text-indigo-600">{projectId}</span> ｜ 請求先ステータス: <span className="font-bold text-emerald-600">ACTIVE (利用可能)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "同期中..." : "最新データを再同期"}</span>
          </button>
        </div>
      </div>

      {/* 反映されない場合の確認チェックリスト（アコーディオン） */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          onClick={() => setIsOpenFaq(!isOpenFaq)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">
              「利用回数が増えない・反映されない」ときの確認チェックリスト（4項目）
            </span>
          </div>
          {isOpenFaq ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </button>

        {isOpenFaq && (
          <div className="p-4 pt-1 border-t border-slate-200/70 space-y-3 text-xs text-slate-700 leading-relaxed bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* チェック1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <Building size={14} className="text-indigo-600" />
                  <span>① 会社アカウント（ml-mightylink.com）でのログイン確認</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Antigravity右上のユーザー設定で、私用Gmailではなく会社ドメインのアカウント（例: <code>k***@ml-mightylink.com</code>）でサインインしているか確認してください。
                </p>
              </div>

              {/* チェック2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <KeyRound size={14} className="text-cyan-600" />
                  <span>② プロジェクトID（antigravity-pj-xxxxxx）の指定</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Google Cloud の課金・監査ログはプロジェクトごとに集計されます。Antigravityの接続先プロジェクトが <code>antigravity-pj-xxxxxx</code> に指定されていることを確認してください。
                </p>
              </div>

              {/* チェック3 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <ShieldCheck size={14} className="text-amber-600" />
                  <span>③ Google Cloud 監査ログ（データアクセス）の有効化</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  GCP既定ではAPI利用ログ（Data Access）が無効です。Google Cloudコンソール「IAMと管理」&gt;「監査ログ」で Vertex AI および Generative Language の「データ読み取り / 書き込み」を有効にすると、利用回数が完全自動加算されます。
                </p>
              </div>

              {/* チェック4 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <RefreshCw size={14} className="text-emerald-600" />
                  <span>④ ブラウザキャッシュのクリアと再取得</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  ブラウザのキャッシュにより古い数値が表示されている場合があります。右上の「最新データを再同期」ボタンを押すか、<code>Ctrl + Shift + R</code>（強力な更新）をお試しください。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
