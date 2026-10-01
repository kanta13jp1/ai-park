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
    a: "できます。会社のGoogle Cloudプロジェクトに接続する方式（Business account → Continue with Google Cloud）でサインインすると、Workspaceアカウントのまま利用でき、Google Cloudの利用規約とデータ保護のもとで動作します。社内ではこの方式を業務利用の標準とします（利用したい方はAI推進担当へ権限付与を依頼してください）。",
    source: { label: "Antigravity Enterprise", href: "https://antigravity.google/docs/enterprise/" },
  },
  {
    q: "会社のGoogle Cloud経由で使う場合、料金は月額ですか？",
    a: "月額定額ではなく、使った分だけ会社のGoogle Cloud請求に計上される従量課金です。個人のGoogle AI Proへの加入や経費精算は不要です。使いすぎを防ぐため、管理者がCloud Billingで月額の上限（Spend cap）を設定しており、上限に達するとその月はAI APIの利用が一時停止します。",
    source: { label: "Antigravity Enterprise", href: "https://antigravity.google/docs/enterprise/" },
  },
  {
    q: "Google Cloudに表示される「300ドル分のクレジット」とは何ですか？",
    a: "Google Cloudを初めて使う請求先アカウントに付く無料トライアルのクレジットで、90日間有効です。期間中の利用料はこのクレジットから差し引かれ、請求は発生しません。90日経過またはクレジットを使い切ると、有料アカウントへアップグレードしない限りプロジェクトが停止するため、継続利用する場合はアップグレードが必要です。",
    source: { label: "Google Cloud 無料トライアル FAQ", href: "https://cloud.google.com/signup-faqs" },
  },
  {
    q: "90日無料トライアルが適用できているか、どうやって確認すればよいですか？",
    a: "Google Cloud コンソール（console.cloud.google.com）にログインし、左上メニューの「お支払い (Billing)」を選択してください。「概要」画面上部に「無料トライアル クレジット: 〇〇円 / $300 のうち残り〇〇円（残り〇〇日）」と緑色のバーが表示されていれば正常に適用されています。Antigravity側では、IDE右上のステータスバーに会社アカウントまたはプロジェクト名が表示されていれば接続完了です。",
    source: { label: "Google Cloud 請求先アカウント確認", href: "https://console.cloud.google.com/billing" },
  },
  {
    q: "300ドルを使い切った後、毎月の課金はどれくらいかかりますか？",
    a: "Antigravity（Gemini 1.5 Pro / Flash、Gemini 3.1 Pro）のAPI利用料はトークン従量課金です。小規模なコード生成やプロンプト質問であれば月数百円、日常的な開発・レビューでも月1,000円〜2,000円程度に収まるケースが一般的です。300ドルのクレジットがあれば、一般的な開発業務では数ヶ月〜半年程度は十分に検証可能です。下の「開発規模別コスト目安表」をご確認ください。",
    source: { label: "Google Cloud Vertex AI 料金表", href: "https://cloud.google.com/vertex-ai/pricing" },
  },
  {
    q: "予期せぬ高額課金を防ぐために、月の利用上限は設定できますか？",
    a: "はい、Google Cloudの「予算とアラート（Budgets & Alerts）」機能で月額の上限（例: 月3,000円）を設定できます。50%, 90%, 100% 達成時にメールやGoogle Chatへ自動通知を飛ばすことができ、管理者がAPIの一時停止を設定することも可能です。",
    source: { label: "Cloud Billing 予算とアラートの設定", href: "https://cloud.google.com/billing/docs/how-to/budgets" },
  },
  {
    q: "個人アカウントで Antigravity を業務に使ってもよいですか？",
    a: "個人アカウントには個人向けの利用規約が適用されます。顧客情報・社内機密・未公開ソースコードは入力せず、公開情報での学習・試用にとどめてください。業務では会社のGoogle Cloudプロジェクト経由で利用してください。",
    source: { label: "社内AI利用の注意事項", href: "/tools-hub#ai-guidelines", internal: true },
  },
  {
    q: "Google Cloud コンソールで「追加のアクセス権が必要です（billing.resourceCosts.get）」と表示され、クレジット残高が見られません",
    a: "一般利用者アカウントには請求先レポートの閲覧権限がないための正常なセキュリティ制限です。Antigravityでの開発には支障ありませんが、AI推進担当として残高や利用金額をモニタリングしたい場合は、請求管理者に「請求先アカウント閲覧者（roles/billing.viewer）」のロール付与を依頼してください（設定変更等はできない安全な閲覧権限です）。",
    source: { label: "Cloud Billing ロールの詳細", href: "https://cloud.google.com/billing/docs/how-to/billing-access" },
  },
  {
    q: "Antigravity IDE でチャット送信時に「You can prompt the model to try again...」とエラーになり応答しません",
    a: "プロジェクト側で「Cloud AI Companion API（cloudaicompanion.googleapis.com）」または「Vertex AI API」が未有効化であるか、アカウントに「Cloud AI Companion ユーザー（roles/cloudaicompanion.user）」ロールが付与されていない可能性があります。管理者にプロジェクト設定を確認してもらうか、IDE側で新規チャット（＋ボタン）の開始・サインアウトからの再ログインをお試しください。",
    source: { label: "Google Cloud 導入手順書", href: "/guide#company-setup", internal: true },
  },
  {
    q: "（個人利用の場合）無料プランと Google AI Pro では何が違いますか？",
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
        subtitle="AI Park運営・AI推進担当へのご意見・ご質問"
      />
      <OfficeHourBanner />

      <div className="max-w-2xl w-full mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">AI推進担当（担当：梅澤）へのお問い合わせ</h3>
            <p className="text-xs text-slate-500">
              ツールの新規申請相談、バグ報告、機能リクエスト等、お気軽にお問い合わせください。
            </p>
          </div>

          {sent ? (
            <div className="p-6 bg-emerald-50 text-emerald-800 rounded-lg text-center space-y-2">
              <h4 className="font-bold">問い合わせ内容をコピーしました（まだ送信されていません）</h4>
              <p className="text-xs leading-relaxed">
                Google Chat で AI推進担当（担当：梅澤）に貼り付けて送ってください。内容を確認して折り返しご連絡します。
              </p>
              <button type="button" onClick={() => setSent(false)} className="text-xs underline">
                入力画面に戻る
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // サーバーが無いため送信はせず、Google Chat に貼り付けられるよう内容をコピーする
                const f = new FormData(e.currentTarget);
                const text = [
                  "【AI Park お問い合わせ】",
                  `お名前: ${f.get("name")}`,
                  `メール: ${f.get("email")}`,
                  `種別: ${f.get("kind")}`,
                  "内容:",
                  String(f.get("body") ?? ""),
                ].join("\n");
                navigator.clipboard?.writeText(text).catch(() => {});
                setSent(true);
              }}
              className="space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  お名前
                </label>
                <input
                  name="name"
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
                  name="email"
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
                <select name="kind" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
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
                  name="body"
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
                <span>内容をコピーして Google Chat で送る</span>
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

        {/* 開発規模ごとのコスト目安 & 予算上限設定ガイド（ご意見TODO-09への対応） */}
        <section id="cost-guidelines" className="mt-8 bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs space-y-6 scroll-mt-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono uppercase">
                COST MANAGEMENT
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-1">
                Antigravity 開発規模別コスト目安表 & 予算アラート設定
              </h3>
            </div>
            <span className="text-xs text-slate-400">社内エンジニア向け（小林さんご意見反映）</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Google Cloud の無料トライアル（$300クレジット・約45,000円相当）期間中は、このクレジットから利用料が差し引かれます。
            一般的な開発業務における月額コストの目安は以下の通りです。
          </p>

          {/* コスト目安テーブル */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-bold">開発規模・利用シーン</th>
                  <th className="py-2.5 px-3 font-bold">主な作業内容</th>
                  <th className="py-2.5 px-3 font-bold text-indigo-700">月間想定コスト</th>
                  <th className="py-2.5 px-3 font-bold text-emerald-700">$300枠での稼働目安</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    🟢 小規模・ライト利用
                  </td>
                  <td className="py-3 px-3">
                    単体関数の作成、エラーログの質問、簡単なSQL・正規表現の作成（週数回）
                  </td>
                  <td className="py-3 px-3 text-indigo-700 font-bold font-mono">
                    $0.5〜$2 / 月<br /><span className="text-[10px] font-normal text-slate-500">(約75〜300円)</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">
                    1年以上十分にカバー
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    🔵 中規模・日常開発
                  </td>
                  <td className="py-3 px-3">
                    複数ファイルの修正、機能追加、ユニットテスト作成、日常的なコードレビュー（毎日）
                  </td>
                  <td className="py-3 px-3 text-indigo-700 font-bold font-mono">
                    $3〜$10 / 月<br /><span className="text-[10px] font-normal text-slate-500">(約450〜1,500円)</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">
                    半年〜1年程度カバー
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    🟣 大規模・エージェント並列
                  </td>
                  <td className="py-3 px-3">
                    Subagentsの常時並列実行、大規模リファクタリング、全自動E2Eテスト反復実行
                  </td>
                  <td className="py-3 px-3 text-indigo-700 font-bold font-mono">
                    $15〜$30 / 月<br /><span className="text-[10px] font-normal text-slate-500">(約2,250〜4,500円)</span>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">
                    約3〜5ヶ月程度カバー
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 予算上限・アラート設定手順 */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🛡️ 予期せぬ課金を防ぐ「予算アラート」の3ステップ設定</span>
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 leading-relaxed">
              <li>
                <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">
                  Google Cloud コンソール「お支払い (Billing)」
                </a>
                を開き、左メニューの「<strong>予算とアラート</strong>」をクリックします。
              </li>
              <li>
                「<strong>予算を作成</strong>」を押し、予算名（例: <code>Antigravity開発月額上限</code>）と目標金額（例: <code>3,000円</code> または <code>$20</code>）を入力します。
              </li>
              <li>
                アラートしきい値（デフォルトで50%, 90%, 100%）を確認し、通知先に自身のメールアドレスまたは社内Chat通知Webhookを指定して「終了」を押します。
              </li>
            </ol>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              ※社内管理プロジェクトでは、管理者がプロジェクト単位のハードリミット（Spend Cap）を設定することも可能です。上限設定の代行希望は AI推進担当（担当：梅澤）へご連絡ください。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
