"use client";

import { useState } from "react";
import { X, Calendar, Clock, CheckCircle2, User, Send } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("AWS / Bedrock 導入相談");
  const [preferredDate, setPreferredDate] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // 成功後3秒でリセットして閉じる
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* モーダルヘッダー */}
        <div className="bg-[#3b4856] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-lg">AI Office Hour 予約</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* モーダル本体 */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-bold text-slate-800">予約リクエストを受け付けました！</h4>
            <p className="text-sm text-slate-600">
              担当者（MightyLINK AI推進チーム / Antigravity CoEメンター）より、Google Calendar招待および事前ヒアリングのご連絡をお送りいたします。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-xs text-slate-500 pb-1 border-b border-slate-100">
              Antigravity活用、社内Agent開発、業務特化Skills作成、MCP連携など何でもお気軽にご相談ください。
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  所属部署 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="DXソリューション部 / クラウド基盤部"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ご相談テーマ
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="Antigravity IDE / CLI 導入・設定相談">Antigravity IDE / CLI (agy) 導入・設定相談</option>
                <option value="社内業務特化 Skill / Rule 作成相談">社内業務特化 Skill / Rule 作成相談</option>
                <option value="MCP (Model Context Protocol) ツール連携">MCP (Model Context Protocol) 外部ツール連携相談</option>
                <option value="Subagents 並列実行・エージェント設計">Subagents 並列実行・エージェント設計相談</option>
                <option value="Gemini 3.1 Pro / プロンプト活用相談">Gemini 3.1 Pro / プロンプト活用相談</option>
                <option value="CoEメンター相談・雑談歓迎">その他（CoEメンターとブレストしたい）</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                希望日時候補 (平日 10:00〜18:00)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="例: 来週火曜 14:00 または 木曜午後"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                相談概要・事前共有メモ
              </label>
              <textarea
                rows={3}
                placeholder="現在困っていること、試してみたいことなどがあればご記入ください"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
              >
                <Send size={16} />
                <span>予約を送信する</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
