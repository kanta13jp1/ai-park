"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  User,
  Send,
  ExternalLink,
  Copy,
  Check,
  Building,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Antigravity IDE / CLI 導入・設定相談");
  const [preferredDate, setPreferredDate] = useState("");
  const [description, setDescription] = useState("");
  const [copiedMemo, setCopiedMemo] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName("");
    setDepartment("");
    setPreferredDate("");
    setDescription("");
    onClose();
  };

  // Google Calendar 追加リンクの作成
  const makeGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`【AI Office Hour】${topic} (${name}様)`);
    const details = encodeURIComponent(
      `【MightyLINK AI推進担当 Office Hour】\n\n相談者: ${name} (${department})\n相談テーマ: ${topic}\n希望候補: ${preferredDate}\n事前メモ:\n${description}\n\n※オンライン会議URL（Google Meet）は担当AI推進担当より別途ご案内します。`
    );
    const location = encodeURIComponent("Google Meet (社内オンライン相談)");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleCopyMemo = () => {
    const memo = `【AI Office Hour 予約受付メモ】\n相談者: ${name} (${department})\nテーマ: ${topic}\n希望日時: ${preferredDate}\n相談概要: ${description}`;
    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* モーダルヘッダー */}
        <div className="bg-[#3b4856] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-cyan-300" />
            <h3 className="font-bold text-base md:text-lg">AI Office Hour 予約</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* モーダル本体 */}
        {submitted ? (
          <div className="p-6 md:p-8 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-800">
                予約メモができました（まだ送信されていません）
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                下の「予約詳細メモをコピー」を押し、Google Chat で AI推進担当（担当：梅澤）に送ってください。日程が決まったら Google Meet の招待が届きます。
              </p>
            </div>

            {/* 予約内容サマリー */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                <span className="text-slate-400">相談者</span>
                <span className="font-bold">{name} ({department})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                <span className="text-slate-400">テーマ</span>
                <span className="font-semibold text-blue-700">{topic}</span>
              </div>
              {preferredDate && (
                <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                  <span className="text-slate-400">希望候補</span>
                  <span>{preferredDate}</span>
                </div>
              )}
            </div>

            {/* Google Calendar 連携ボタン */}
            <div className="space-y-2 pt-1">
              <a
                href={makeGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Calendar size={14} />
                <span>Google カレンダーに仮予定を追加</span>
                <ExternalLink size={12} className="opacity-80" />
              </a>

              <button
                type="button"
                onClick={handleCopyMemo}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors border border-slate-200"
              >
                {copiedMemo ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedMemo ? "予約メモをコピーしました" : "予約詳細メモをコピー"}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="text-slate-500 pb-2 border-b border-slate-100 leading-relaxed">
              Google Antigravity の導入設定、社内特化 Skills 開発、MCP外部ツール連携など、何でも気軽にご相談ください。
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  お名前 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="山田 太郎"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  所属部署 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="DX推進部 / クラウド基盤"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">ご相談テーマ</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              >
                <option value="Antigravity IDE / CLI 導入・設定相談">
                  Antigravity IDE / CLI (agy) 導入・設定相談
                </option>
                <option value="社内業務特化 Skill / Rule 作成相談">
                  社内業務特化 Skill / Rule 作成相談
                </option>
                <option value="MCP (Model Context Protocol) ツール連携">
                  MCP (Model Context Protocol) 外部ツール連携相談
                </option>
                <option value="Subagents 並列実行・エージェント設計">
                  Subagents 並列実行・エージェント設計相談
                </option>
                <option value="Gemini 3.1 Pro / プロンプト活用相談">
                  Gemini 3.1 Pro / プロンプト活用相談
                </option>
                <option value="AI推進担当相談・壁打ちブレスト">
                  その他（AI推進担当と壁打ち・ブレストしたい）
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                希望日時候補 (平日 10:00〜18:00)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="例: 来週火曜 14:00 または 木曜午後"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">相談概要・事前共有メモ</label>
              <textarea
                rows={3}
                placeholder="困っている点、試してみたいこと、対象プロジェクトの概要などがあればご記入ください。"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <Send size={14} />
                <span>予約リクエストを送信</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
