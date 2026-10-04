"use client";

import { useState } from "react";
import { playCyberClick, playCyberSuccess } from "@/lib/sound";
import {
  X,
  Copy,
  Check,
  Send,
  ShieldCheck,
  Sparkles,
  Layers,
  User,
  Building,
  Key,
  HelpCircle,
} from "lucide-react";

export interface ToolApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToolName?: string;
}

export default function ToolApplicationModal({
  isOpen,
  onClose,
  initialToolName = "Google Antigravity 2.0 (Gemini 3.1 Pro)",
}: ToolApplicationModalProps) {
  const [toolName, setToolName] = useState(initialToolName);
  const [applicantName, setApplicantName] = useState("");
  const [department, setDepartment] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [purpose, setPurpose] = useState("コード生成・高速リファクタリング");
  const [targetProject, setTargetProject] = useState("");
  const [expectedRoi, setExpectedRoi] = useState("週 2〜4 時間程度の工数削減");
  const [securityAgreed, setSecurityAgreed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // 生成される社内申請ドラフト文面
  const generatedDraft = `【社内AIツール利用申請】
━━━━━━━━━━━━━━━━━━━━━━━━
■ 申請ツール: ${toolName}
■ 申請者: ${applicantName || "（氏名を入力）"}（${department || "（所属部署を入力）"}）
■ 対象アカウント: ${accountEmail || "（会社メールアドレスを入力）"}
■ 利用目的: ${purpose}
■ 対象案件・業務: ${targetProject || "（担当プロジェクト・案件名を入力）"}
■ 想定される効果・工数削減: ${expectedRoi}
■ セキュリティ遵守宣誓:
  - 社内セキュリティ基準（Level 1/2/3 ガイドライン）を遵守します
  - 顧客個人情報や未承認の認証情報をマスキングなしで投入しません
  - 生成物の品質・セキュリティは利用者が責任を持って検証します
━━━━━━━━━━━━━━━━━━━━━━━━
AI推進担当（梅澤）様、ご確認および利用権限・ライセンスの割り当てをお願いいたします。`;

  const handleCopy = () => {
    playCyberSuccess();
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    playCyberClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
                社内AIツール利用申請ドラフト作成
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  即時発行
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                必要事項を入力すると、Google Chat（AI推進窓口）へ提出する申請文面が自動生成されます
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* フォーム入力部 */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* ツール選択 & アカウント */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Layers size={14} className="text-indigo-600" />
                希望ツール <span className="text-rose-500">*</span>
              </label>
              <select
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="Google Antigravity 2.0 (Gemini 3.1 Pro)">Google Antigravity 2.0 (Gemini 3.1 Pro)</option>
                <option value="Gemini for Google Cloud (Vertex AI)">Gemini for Google Cloud (Vertex AI)</option>
                <option value="GitHub Copilot Enterprise">GitHub Copilot Enterprise</option>
                <option value="Claude 3.7 Sonnet (Anthropic Console)">Claude 3.7 Sonnet (Anthropic Console)</option>
                <option value="Cursor AI IDE (社内検証枠)">Cursor AI IDE (社内検証枠)</option>
                <option value="Manus AI / 自律エージェント試用">Manus AI / 自律エージェント試用</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Key size={14} className="text-indigo-600" />
                対象アカウント (会社メール) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="user@ml-mightylink.com"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* 申請者情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <User size={14} className="text-indigo-600" />
                申請者 氏名 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例: 山田 太郎"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Building size={14} className="text-indigo-600" />
                所属部署・プロジェクト <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例: 開発第一部 / 案件Aチーム"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* 利用目的 & 効果 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-indigo-600" />
                主な利用目的
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="コード生成・高速リファクタリング">コード生成・高速リファクタリング</option>
                <option value="仕様書・ドキュメント作成・要約">仕様書・ドキュメント作成・要約</option>
                <option value="BigQuery/SQL作成・データ分析支援">BigQuery/SQL作成・データ分析支援</option>
                <option value="UI/UXデザインモック・コンポーネント試作">UI/UXデザインモック・コンポーネント試作</option>
                <option value="自動テスト・CI/CDパイプライン整備">自動テスト・CI/CDパイプライン整備</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                想定される時短効果
              </label>
              <select
                value={expectedRoi}
                onChange={(e) => setExpectedRoi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="週 1〜2 時間程度の工数削減">週 1〜2 時間程度の工数削減</option>
                <option value="週 2〜4 時間程度の工数削減">週 2〜4 時間程度の工数削減</option>
                <option value="週 5時間以上の大幅な生産性向上">週 5時間以上の大幅な生産性向上</option>
              </select>
            </div>
          </div>

          {/* 案件名 */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              適用対象の業務・案件詳細（任意）
            </label>
            <input
              type="text"
              placeholder="例: 自社ポータル開発 / 顧客向けWebシステム移行"
              value={targetProject}
              onChange={(e) => setTargetProject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* セキュリティ宣誓チェック */}
          <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="security-consent"
              checked={securityAgreed}
              onChange={(e) => {
                setSecurityAgreed(e.target.checked);
                playCyberClick();
              }}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="security-consent" className="text-xs text-slate-700 cursor-pointer leading-relaxed">
              <span className="font-bold text-indigo-950 flex items-center gap-1">
                <ShieldCheck size={14} className="text-indigo-600" />
                社内セキュリティ基準（Level 1/2/3 ガイドライン）に同意します
              </span>
              個人情報や未承認の認証情報を入力しないこと、出力内容を責任を持って確認することを誓約します。
            </label>
          </div>

          {/* 自動生成プレビュー */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Send size={13} className="text-indigo-600" />
                生成される申請文面プレビュー
              </span>
              <span className="text-[11px] text-slate-400">
                Google Chat（AI推進窓口）へ貼り付けて送信
              </span>
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800 select-all">
              {generatedDraft}
            </pre>
          </div>
        </div>

        {/* フッターアクション */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
            <span>申請後、AI推進担当（梅澤）より 1〜2 営業日以内に認可通知が届きます</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              閉じる
            </button>
            <button
              onClick={handleCopy}
              disabled={!securityAgreed}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                securityAgreed
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-300 animate-bounce" />
                  <span>文面をコピーしました！</span>
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
    </div>
  );
}
