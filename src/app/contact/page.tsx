"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { Mail, MessageSquare, Send, HelpCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// ご意見TODO-08への対応（Google公式情報 2026/09/25 確認）
const accountFaqs = [
  {
    q: "会社のGoogle Workspaceアカウントで Google AI Pro に加入できますか？",
    a: "できません。Google AI Pro / Ultra は個人のGoogleアカウント向けのプランで、Workspaceアカウントからは加入できません。Workspaceでは管理者が契約するGemini（Workspace / Gemini Enterprise）を利用します。",
    source: { label: "Antigravity Plans", href: "https://antigravity.google/docs/plans/" },
  },
  {
    q: "Antigravity は会社のアカウントでログインできますか？",
    a: "Antigravity は現在、個人のGoogleアカウント向けに提供されています。公式FAQでもWorkspaceアカウントで問題がある場合は @gmail.com のアカウントを使うよう案内されています。チームでの利用は Google Cloud の規約のもと Gemini Enterprise 経由で提供されています。",
    source: { label: "Antigravity FAQ", href: "https://antigravity.google/docs/faq/" },
  },
  {
    q: "個人アカウントで Antigravity を業務に使ってもよいですか？",
    a: "個人アカウントには個人向けの利用規約が適用されます。顧客情報・社内機密・未公開ソースコードは入力せず、公開情報での学習・試用にとどめてください。業務での本格利用の方針（会社契約の要否・経費精算）はAI CoEで整理中です。",
    source: { label: "社内AI利用の注意事項", href: "/tools-hub#ai-guidelines", internal: true },
  },
  {
    q: "無料プランと Google AI Pro では何が違いますか？",
    a: "どちらもGeminiモデルと主要機能を利用できます。違いは利用上限で、無料（Base）プランは週単位、Google AI Pro は5時間ごとにクォータが回復し上限も高く設定されています。",
    source: { label: "Antigravity Plans", href: "https://antigravity.google/docs/plans/" },
  },
];

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

        {/* アカウント・ライセンスFAQ */}
        <section className="mt-8 bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">よくある質問：アカウント・ライセンス</h3>
          </div>
          <div className="space-y-3">
            {accountFaqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <summary className="cursor-pointer font-bold text-sm text-slate-900 list-none flex items-start gap-2">
                  <span className="text-indigo-600">Q.</span>
                  <span>{f.q}</span>
                </summary>
                <div className="mt-2 pl-5 space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed">{f.a}</p>
                  {f.source.internal ? (
                    <Link href={f.source.href} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline">
                      {f.source.label}
                    </Link>
                  ) : (
                    <a
                      href={f.source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
                    >
                      出典: {f.source.label}
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
