"use client";

import React, { useState } from "react";
import { X, Copy, Check, Sparkles, Shield, Clock, FileCheck } from "lucide-react";
import { playCyberClick, playCyberSuccess } from "@/lib/sound";

interface MatrixToolRef {
  id: number;
  name: string;
  form: string;
  status: string;
  securityLevel: string;
}

interface ToolApplicationDraftModalProps {
  tool: MatrixToolRef | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolApplicationDraftModal({
  tool,
  isOpen,
  onClose,
}: ToolApplicationDraftModalProps) {
  const [purpose, setPurpose] = useState<string>("業務効率化・資料作成");
  const [estimatedHours, setEstimatedHours] = useState<string>("週2〜3時間");
  const [customDetail, setCustomDetail] = useState<string>("");
  const [securityChecked, setSecurityChecked] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !tool) return null;

  const draftText = `【AIツール利用・ライセンス申請ドラフト】
■ 申請対象ツール: ${tool.name} (${tool.form})
■ 社内ステータス: ${tool.status}
■ セキュリティ区分: ${tool.securityLevel}
■ 主な利用目的: ${purpose}
■ 具体的想定用途: ${customDetail.trim() ? customDetail.trim() : "社内業務の迅速化、および定型業務の自動化検証"}
■ 想定削減効果: 約 ${estimatedHours} / 週
■ セキュリティ・コンプライアンス遵守宣誓:
  - 顧客情報、個人情報、未公開の社内機密データは絶対に入力しません
  - 社内AI安全利用ガイドラインおよび推進担当の指示を遵守します
--------------------------------------------------
※ 本文を社内Google Chat（AI推進窓口）または社内申請ワークフローに貼り付けてご提出ください。`;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(draftText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = draftText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      playCyberSuccess();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5">
        {/* ヘッダー */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                利用申請ドラフト作成
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {tool.name} の申請文面をワンクリック生成
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 入力フォーム */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-700 font-bold block mb-1">
              ① 主な利用目的
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            >
              <option value="業務効率化・資料作成">業務効率化・資料作成（要約・下書き）</option>
              <option value="ソースコード開発・レビュー">ソースコード開発・レビュー・検証</option>
              <option value="データ分析・リサーチ">データ分析・市場リサーチ</option>
              <option value="PoC・新規事業プロトタイプ">PoC・新規事業プロトタイプ作成</option>
              <option value="画像・デザイン素材生成">画像・デザイン素材生成</option>
            </select>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">
              ② 想定削減時間（週あたり）
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["週1〜2時間", "週2〜3時間", "週5時間以上"].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setEstimatedHours(hrs);
                  }}
                  className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${
                    estimatedHours === hrs
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Clock size={12} className="inline mr-1 opacity-70" />
                  {hrs}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">
              ③ 具体的な用途・対象業務（任意）
            </label>
            <textarea
              rows={2}
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              placeholder="例: 月次レポートの下書き作成、および社内FAQナレッジの要約"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* セキュリティ確認 */}
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 flex items-start space-x-2">
            <input
              type="checkbox"
              id="securityCheck"
              checked={securityChecked}
              onChange={(e) => setSecurityChecked(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="securityCheck" className="text-[11px] text-amber-900 leading-snug cursor-pointer">
              <span className="font-bold">機密情報非入力の宣誓:</span> 顧客個人情報や未公開機密データは絶対に入力せず、社内規程に準拠して利用することに同意します。
            </label>
          </div>

          {/* プレビューエリア */}
          <div>
            <span className="text-slate-500 font-semibold block mb-1">
              ドラフトプレビュー
            </span>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-36">
              {draftText}
            </pre>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            キャンセル
          </button>

          <button
            type="button"
            disabled={!securityChecked}
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
              !securityChecked
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : copied
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} className="stroke-[2.5]" />
                <span>コピー完了！</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>申請文面をコピー</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
