"use client";

import { useState } from "react";
import { X, Copy, Check, Sparkles, ShieldCheck, Wrench, Send, AlertTriangle } from "lucide-react";
import { playCyberClick, playCyberSuccess } from "@/lib/sound";

interface SkillApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillApplicationModal({ isOpen, onClose }: SkillApplicationModalProps) {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState<string>("コード・品質");
  const [description, setDescription] = useState("");
  const [triggerPhrase, setTriggerPhrase] = useState("");
  const [timeSavings, setTimeSavings] = useState("週1〜2時間");
  const [applicantDept, setApplicantDept] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [securityChecked, setSecurityChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedDraft = `【社内認定Skill 登録・提案申請】
--------------------------------------------------
■ スキル名: ${skillName || "（未入力）"}
■ カテゴリ: ${category}
■ 申請者: ${applicantDept || "（部署未入力）"} ${applicantName || "（氏名未入力）"}
■ 想定削減効果: ${timeSavings}
■ 呼び出しプロンプト構文:
  ${triggerPhrase || "（未入力）"}

■ スキル概要・自動化する定常業務:
${description || "（未入力）"}

■ セキュリティ・規約遵守チェック:
  [${securityChecked ? "x" : " "}] APIキー・顧客情報・機密トークンをコード内に含有していない
  [${securityChecked ? "x" : " "}] 破壊的コマンド（DROP/TRUNCATE/rm -rf等）の実行抑止を確認済
  [${securityChecked ? "x" : " "}] 社内ガイドライン準拠（Antigravity 2.0 stdio安全実行設計）
--------------------------------------------------
上記スキルの社内公式ライブラリへの採用・セキュリティ審査をお願いいたします。`;

  const handleCopy = () => {
    playCyberClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedDraft).then(() => {
        playCyberSuccess();
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const isFormValid =
    skillName.trim().length > 0 &&
    description.trim().length > 0 &&
    triggerPhrase.trim().length > 0 &&
    securityChecked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* ヘッダー */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Wrench className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">新規社内Skill 登録・提案申請</h3>
              <p className="text-xs text-slate-300 font-mono mt-0.5">Antigravity Certified Skill Submission</p>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォームボディ */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                スキル名 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例: Git コミット規約自動スキャナ"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium bg-white"
              >
                <option value="コード・品質">コード・品質</option>
                <option value="データ・SQL">データ・SQL</option>
                <option value="ドキュメント・要件">ドキュメント・要件</option>
                <option value="セキュリティ">セキュリティ</option>
                <option value="運用自動化">運用自動化</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              呼び出しプロンプト構文（Trigger Phrase） <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例: @skill commit-lint 差分チェック"
              value={triggerPhrase}
              onChange={(e) => setTriggerPhrase(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              スキルの概要・解決する業務課題 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="どのような定常作業を自動化し、どのような手順でエージェントが実行するかを記述してください"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">想定削減時間</label>
              <select
                value={timeSavings}
                onChange={(e) => setTimeSavings(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                <option value="週1〜2時間">週 1〜2 時間</option>
                <option value="週2〜3時間">週 2〜3 時間</option>
                <option value="週5時間以上">週 5 時間以上（大幅効率化）</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">申請者 部署</label>
              <input
                type="text"
                placeholder="例: 開発基盤アーキテクチャ室"
                value={applicantDept}
                onChange={(e) => setApplicantDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">申請者 氏名</label>
              <input
                type="text"
                placeholder="例: 山田 太郎"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* セキュリティ宣誓 */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed text-indigo-950 font-medium">
              <input
                type="checkbox"
                checked={securityChecked}
                onChange={(e) => {
                  playCyberClick();
                  setSecurityChecked(e.target.checked);
                }}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
              />
              <span>
                <strong>セキュリティ宣誓:</strong> 本スキルは社内機密情報・APIキー・顧客個人情報を含まず、破壊的コマンド（テーブル削除・不可逆なインフラ操作等）を抑止する安全設計であることを確認しました。
              </span>
            </label>
          </div>

          {/* プレビューエリア */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600">申請文面プレビュー（Google Chat / Issue 用）</span>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl font-mono text-xs whitespace-pre-wrap max-h-36 overflow-y-auto border border-slate-800">
              {generatedDraft}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>コピーした文面を社内Google Chat（AI推進窓口）へご提出ください。</span>
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                playCyberClick();
                onClose();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              閉じる
            </button>
            <button
              onClick={handleCopy}
              disabled={!isFormValid}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer ${
                isFormValid
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>クリップボードにコピー完了！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
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
