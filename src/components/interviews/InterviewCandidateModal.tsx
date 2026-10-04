"use client";

import { useState } from "react";
import { playCyberClick, playCyberSuccess } from "@/lib/sound";
import {
  X,
  Copy,
  Check,
  Send,
  Sparkles,
  Mic,
  User,
  Building,
  Key,
  Clock,
  TrendingUp,
  HelpCircle,
} from "lucide-react";

export interface InterviewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InterviewCandidateModal({
  isOpen,
  onClose,
}: InterviewCandidateModalProps) {
  const [candidateName, setCandidateName] = useState("");
  const [department, setDepartment] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [targetTool, setTargetTool] = useState("Google Antigravity 2.0 (Gemini 3.1 Pro)");
  const [useCaseTheme, setUseCaseTheme] = useState("定常業務の要約・ドラフト自動作成");
  const [metricImpact, setMetricImpact] = useState("週 2〜3 時間程度の工数削減");
  const [preferredTiming, setPreferredTiming] = useState("来週以降の平日オンライン（30分程度）");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // 生成される社内取材立候補ドラフト文面
  const generatedDraft = `【現場AI活用インタビュー 取材立候補】
━━━━━━━━━━━━━━━━━━━━━━━━
■ 立候補者: ${candidateName || "（氏名を入力）"}（${department || "（所属部署を入力）"}）
■ 会社メールアドレス: ${accountEmail || "（会社メールアドレスを入力）"}
■ 活用AIツール: ${targetTool}
■ 業務での活用テーマ: ${useCaseTheme}
■ 実感している効果・削減工数: ${metricImpact}
■ 取材希望時期・形式: ${preferredTiming}
━━━━━━━━━━━━━━━━━━━━━━━━
AI推進担当（編集部・梅澤）様、現場でのAI実践事例としてインタビュー掲載の検討をお願いいたします！`;

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
              <Mic size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-wide flex items-center gap-2">
                現場AI活用インタビュー 取材立候補
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  30分・オンライン
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                あなたのチームでのAI実践・時短ワザを全社ポータルで共有しませんか？
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

        {/* 入力フォーム */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <User size={14} className="text-indigo-600" />
                お名前 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例: 佐藤 花子"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Building size={14} className="text-indigo-600" />
                所属部署 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例: カスタマーサクセス部"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Key size={14} className="text-indigo-600" />
                会社メールアドレス
              </label>
              <input
                type="email"
                placeholder="user@ml-mightylink.com"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                活用しているAIツール
              </label>
              <select
                value={targetTool}
                onChange={(e) => setTargetTool(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="Google Antigravity 2.0 (Gemini 3.1 Pro)">Google Antigravity 2.0 (Gemini 3.1 Pro)</option>
                <option value="Gemini for Google Cloud (Vertex AI)">Gemini for Google Cloud (Vertex AI)</option>
                <option value="GitHub Copilot Enterprise">GitHub Copilot Enterprise</option>
                <option value="Claude 3.7 Sonnet (Anthropic Console)">Claude 3.7 Sonnet (Anthropic Console)</option>
                <option value="Cursor AI IDE">Cursor AI IDE</option>
                <option value="その他のAIツール">その他のAIツール</option>
              </select>
            </div>
          </div>

          {/* テーマと効果 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-indigo-600" />
                業務での活用テーマ
              </label>
              <select
                value={useCaseTheme}
                onChange={(e) => setUseCaseTheme(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="定常業務の要約・ドラフト自動作成">定常業務の要約・ドラフト自動作成</option>
                <option value="ソースコード生成・リファクタリング">ソースコード生成・リファクタリング</option>
                <option value="顧客問い合わせ要約・議事録作成">顧客問い合わせ要約・議事録作成</option>
                <option value="データ集計・SQL作成・可視化">データ集計・SQL作成・可視化</option>
                <option value="社内マニュアル・FAQの自動生成">社内マニュアル・FAQの自動生成</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-indigo-600" />
                実感している工数削減・成果
              </label>
              <select
                value={metricImpact}
                onChange={(e) => setMetricImpact(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="週 1〜2 時間程度の工数削減">週 1〜2 時間程度の工数削減</option>
                <option value="週 2〜4 時間程度の工数削減">週 2〜4 時間程度の工数削減</option>
                <option value="作業時間が半分以下に短縮 / ミス激減">作業時間が半分以下に短縮 / ミス激減</option>
                <option value="これまで着手できなかった新規施策を実現">これまで着手できなかった新規施策を実現</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Clock size={14} className="text-indigo-600" />
              取材希望時期・時間帯
            </label>
            <input
              type="text"
              placeholder="例: 来週水曜〜金曜の午後（13:00〜16:00の間）で30分"
              value={preferredTiming}
              onChange={(e) => setPreferredTiming(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* 自動生成プレビュー */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Send size={13} className="text-indigo-600" />
                生成される立候補ドラフト文面
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
            <Mic size={15} className="text-indigo-600 shrink-0" />
            <span>取材時間は約30分（オンライン）、原稿は本人・上長確認後に公開されます</span>
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
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-300 animate-bounce" />
                  <span>文面をコピーしました！</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>立候補文面をコピー</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
