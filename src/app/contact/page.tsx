"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="お問い合わせ"
        subtitle="AI Park運営・AI CoE事務局へのご意見・ご質問"
      />
      <OfficeHourBanner />

      <div className="max-w-2xl w-full mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">AI CoE 事務局へのお問い合わせ</h3>
            <p className="text-xs text-slate-500">
              ツールの新規申請相談、バグ報告、機能リクエスト等、お気軽にお問い合わせください。
            </p>
          </div>

          {sent ? (
            <div className="p-6 bg-emerald-50 text-emerald-800 rounded-lg text-center space-y-2">
              <h4 className="font-bold">送信完了しました</h4>
              <p className="text-xs">担当者より折り返しご連絡いたします。</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  お名前
                </label>
                <input
                  type="text"
                  required
                  placeholder="山田 太郎"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  メールアドレス (社内メール)
                </label>
                <input
                  type="email"
                  required
                  placeholder="taro.yamada@mightylink.co.jp"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  お問い合わせ種別
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>ツールの新規利用申請について</option>
                  <option>AI Parkの掲載内容について</option>
                  <option>セキュリティ・利用規定の確認</option>
                  <option>その他・ご要望</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  内容
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="お問い合わせ内容をご記入ください"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Send size={15} />
                <span>送信する</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
