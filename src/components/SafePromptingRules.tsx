"use client";

import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Lock, EyeOff, AlertTriangle, FileText } from "lucide-react";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";

export default function SafePromptingRules() {
  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="safe-prompting-rules">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
              社内AI安全利用ルール ＆ 入力データ早見表
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              機密漏洩・セキュリティ事故を未然に防ぐための入力ガイドライン（全社員必読）
            </p>
          </div>
        </div>
      </div>

      {/* OK / NG 早見表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* NG カード */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-2xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4 h-full cursor-default"
          >
            <div className="flex items-center space-x-2 text-rose-800 font-extrabold text-sm">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>入力禁止（プロンプトに貼り付けてはいけないもの）</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>
                  <strong className="text-slate-900">顧客の個人情報・実名データ:</strong>{" "}
                  エンドユーザーの氏名、メールアドレス、電話番号、住所、口座情報など
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>
                  <strong className="text-slate-900">本番シークレット・認証情報:</strong>{" "}
                  APIキー、パスワード、秘密鍵（.pem）、AWS/GCPのクレデンシャルJSON
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>
                  <strong className="text-slate-900">未公開の社外秘契約・財務データ:</strong>{" "}
                  NDA締結中の顧客情報、未発表の提携資料、社外秘の売上原価明細
                </span>
              </li>
            </ul>
          </div>
        </TiltCard>

        {/* OK カード */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-2xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 h-full cursor-default"
          >
            <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>安全に入力できるもの（推奨される活用例）</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold shrink-0">◯</span>
                <span>
                  <strong className="text-slate-900">ダミーデータ・マスキング済みデータ:</strong>{" "}
                  「田中太郎」「user_01@example.com」などの架空値に置き換えたサンプル
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold shrink-0">◯</span>
                <span>
                  <strong className="text-slate-900">プログラムコード（ビジネスロジック・UI）:</strong>{" "}
                  Reactコンポーネント、TypeScript型定義、SQLクエリ、スクリプト
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold shrink-0">◯</span>
                <span>
                  <strong className="text-slate-900">一般的な技術調査・ドキュメント作成:</strong>{" "}
                  ライブラリの比較、エラーメッセージの解析、社内勉強会アジェンダの推敲
                </span>
              </li>
            </ul>
          </div>
        </TiltCard>
      </div>

      {/* 安全プロンプトの3大テクニック */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
          <EyeOff className="w-4 h-4 text-indigo-600" />
          <span>実務で使える「安全なプロンプト記述テクニック」</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-xl">
            <div
              onMouseEnter={() => playCyberHover()}
              className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 h-full cursor-default"
            >
              <span className="font-bold text-slate-800 block text-[11px] text-indigo-700">テクニック 1</span>
              <p className="font-bold text-slate-900">「プレースホルダー置換」</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                APIキーや本番URLは <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">&lt;API_KEY&gt;</code> や{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">https://api.example.com</code> に置き換えて質問する。
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-xl">
            <div
              onMouseEnter={() => playCyberHover()}
              className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 h-full cursor-default"
            >
              <span className="font-bold text-slate-800 block text-[11px] text-indigo-700">テクニック 2</span>
              <p className="font-bold text-slate-900">「変更範囲の明示」</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                「〇〇の関数だけを修正し、他の行やコメントはそのまま保持してください」と指定し、想定外のコード改変を防ぐ。
              </p>
            </div>
          </TiltCard>

          <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-xl">
            <div
              onMouseEnter={() => playCyberHover()}
              className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 h-full cursor-default"
            >
              <span className="font-bold text-slate-800 block text-[11px] text-indigo-700">テクニック 3</span>
              <p className="font-bold text-slate-900">「根拠・理由の同時出力」</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                「修正理由と注意点を箇条書きで添えてください」と指示し、AIの出力コードの信頼性を素早くレビューする。
              </p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
