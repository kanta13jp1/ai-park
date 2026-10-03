"use client";

import { useState, useRef } from "react";
import {
  Download,
  Upload,
  Copy,
  Check,
  Share2,
  RefreshCw,
  FileJson,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  loadProgress,
  exportProgressJSON,
  importProgressJSON,
  generateChatReportText,
  type CourseProgress,
} from "@/lib/academyProgress";
import { playCyberClick, playCyberHover, playCyberSuccess } from "@/lib/sound";
import TiltCard from "@/components/TiltCard";

interface ProgressManagerProps {
  totalLessons: number;
  doneLessons: number;
  onProgressUpdated: () => void;
}

export default function ProgressManager({
  totalLessons,
  doneLessons,
  onProgressUpdated,
}: ProgressManagerProps) {
  const [copiedType, setCopiedType] = useState<"json" | "chat" | null>(null);
  const [importText, setImportText] = useState("");
  const [showImportBox, setShowImportBox] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // JSONダウンロード
  const handleDownload = () => {
    playCyberClick();
    const jsonStr = exportProgressJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-park-academy-progress-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playCyberSuccess();
    setMessage({
      type: "success",
      text: "進捗JSONファイルをダウンロードしました。PC交換時や別ブラウザでの復元にご利用ください。",
    });
  };

  // JSONコピー
  const handleCopyJSON = async () => {
    playCyberClick();
    const jsonStr = exportProgressJSON();
    await navigator.clipboard.writeText(jsonStr);
    playCyberSuccess();
    setCopiedType("json");
    setTimeout(() => setCopiedType(null), 2500);
    setMessage({
      type: "success",
      text: "進捗JSONをクリップボードにコピーしました。",
    });
  };

  // Google Chat報告用コピー
  const handleCopyChatReport = async () => {
    playCyberClick();
    const all = loadProgress();
    const report = generateChatReportText(all, totalLessons, doneLessons);
    await navigator.clipboard.writeText(report);
    playCyberSuccess();
    setCopiedType("chat");
    setTimeout(() => setCopiedType(null), 2500);
    setMessage({
      type: "success",
      text: "Google Chat報告用テキストをコピーしました！推進担当へのチャットや日報にそのまま貼り付け可能です。",
    });
  };

  // ファイルアップロードからインポート
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importProgressJSON(content);
      if (res.success) {
        playCyberSuccess();
        setMessage({
          type: "success",
          text: `🎉 進捗データを正常に復元しました！（${res.count}コースのデータを同期）`,
        });
        onProgressUpdated();
      } else {
        setMessage({
          type: "error",
          text: `復元に失敗しました: ${res.error}`,
        });
      }
    };
    reader.readAsText(file);
    // 入力をリセット
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // テキスト貼り付けからインポート
  const handleTextImport = () => {
    playCyberClick();
    if (!importText.trim()) return;
    const res = importProgressJSON(importText);
    if (res.success) {
      playCyberSuccess();
      setMessage({
        type: "success",
        text: `🎉 進捗データを正常に復元しました！（${res.count}コースのデータを同期）`,
      });
      setImportText("");
      setShowImportBox(false);
      onProgressUpdated();
    } else {
      setMessage({
        type: "error",
        text: `復元に失敗しました: ${res.error}`,
      });
    }
  };

  return (
    <div id="progress-manager" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
              LOCAL DATA SYNC
            </span>
            <span className="text-xs text-slate-500 font-medium">ブラウザ内完結・安心バックアップ</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
            学習進捗のバックアップ・復元 & Google Chat報告
          </h3>
        </div>

        {/* チャット報告ワンクリックコピー */}
        <button
          onClick={handleCopyChatReport}
          onMouseEnter={() => playCyberHover()}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {copiedType === "chat" ? (
            <>
              <Check size={14} className="text-white" />
              <span>報告テキスト コピー完了！</span>
            </>
          ) : (
            <>
              <MessageSquare size={14} />
              <span>Google Chat 報告文をコピー</span>
            </>
          )}
        </button>
      </div>

      {/* お知らせバナー */}
      {message && (
        <div
          className={`flex items-start justify-between p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
            message.type === "success"
              ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
              : "bg-rose-50/90 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === "success" ? (
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* バックアップ操作カード群 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* エクスポート */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Download size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">進捗を書き出す（バックアップ）</h4>
              <p className="text-[11px] text-slate-500">PC交換やキャッシュ削除に備えてJSON保存</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleDownload}
              onMouseEnter={() => playCyberHover()}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <FileJson size={13} />
              <span>JSON保存 (.json)</span>
            </button>
            <button
              onClick={handleCopyJSON}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-all active:scale-95 cursor-pointer"
              title="JSONを直接コピー"
            >
              {copiedType === "json" ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>コピー</span>
            </button>
          </div>
        </div>

        {/* インポート */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Upload size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">進捗を読み込む（復元）</h4>
              <p className="text-[11px] text-slate-500">以前保存したJSONから進捗状態を復元</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              onClick={() => {
                playCyberClick();
                fileInputRef.current?.click();
              }}
              onMouseEnter={() => playCyberHover()}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              <Upload size={13} />
              <span>ファイルを選択</span>
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setShowImportBox(!showImportBox);
              }}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              <span>{showImportBox ? "閉じる" : "テキスト貼付"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON貼り付けインポートボックス */}
      {showImportBox && (
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3 animate-in fade-in duration-200">
          <label className="block text-xs font-bold text-indigo-950">
            エクスポートしたJSONテキストを直接貼り付け:
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{"version": "1.0", "progress": { ... }}'
            rows={4}
            className="w-full p-2.5 text-xs font-mono bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder:text-slate-400"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowImportBox(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-200/60"
            >
              キャンセル
            </button>
            <button
              onClick={handleTextImport}
              disabled={!importText.trim()}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              進捗を復元する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
