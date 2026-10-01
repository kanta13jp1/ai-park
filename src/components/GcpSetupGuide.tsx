import { Building2, UserCheck, UserPlus, AlertTriangle, Copy, Check, Wrench, ShieldAlert } from "lucide-react";
import StepCard, { type GuideStep } from "@/components/GuideStepCard";
import { useState } from "react";

// 会社のGoogle Cloudプロジェクト経由で Antigravity を使うための運用手順書
// 社内本番環境：ml-mightylink.com / antigravity-pj (antigravity-pj-509006)

export const COMPANY_GCP_INFO = {
  org: "ml-mightylink.com",
  projectName: "antigravity-pj",
  projectId: "antigravity-pj-509006",
  projectNumber: "470325701687",
  plan: "Agent Platform (Managed by your organization)",
  billingAccountId: "012EB1-1D4C87-D1B374",
};

const adminSteps: GuideStep[] = [
  {
    id: "A1",
    title: "プロジェクトに会社の支払い方法をひも付ける",
    who: "請求先アカウント管理者",
    path: "Google Cloud コンソール → 左上でプロジェクトを選択 → 左上「≡」→「課金」",
    link: { label: "Google Cloud コンソールを開く", href: "https://console.cloud.google.com/" },
    actions: [
      "画面左上のプロジェクト名をクリックし、社内プロジェクト「antigravity-pj」を選ぶ",
      "左上の「≡」メニューから「課金」を開く",
      "「このプロジェクトには請求先アカウントがありません」と表示されたら「請求先アカウントをリンク」をクリック",
      "会社の請求先アカウントを選んで「アカウントを設定」",
    ],
    note: "「請求先アカウントをリンク」が灰色で押せない場合は、開いた人に請求先アカウント管理者の権限がありません（利用者の権限では押せないのが正常です）。初めて Google Cloud を使う請求先アカウントには 300ドル分の無料トライアルクレジット（90日間）が付きます。90日経過かクレジットを使い切ると、有料アカウントへアップグレードしない限りプロジェクトが止まります。",
    image: "A1-link-billing.png",
    imageAlt: "課金画面の「請求先アカウントをリンク」ボタン",
  },
  {
    id: "A2",
    title: "AI の API を有効にする（Vertex AI & Cloud AI Companion）",
    who: "プロジェクトのオーナー",
    link: {
      label: "Vertex AI API を開く",
      href: "https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=antigravity-pj-509006",
    },
    actions: [
      "左のリンクを開き、画面上部のプロジェクトが「antigravity-pj」になっていることを確認して「有効にする」をクリック",
      "続けて「Cloud AI Companion API（cloudaicompanion.googleapis.com）」も検索して「有効にする」をクリック（Antigravity / Gemini Code Assist 連携に必須）",
    ],
    note: "「追加のアクセス権が必要です」という画面が出た場合は、開いた人にオーナー権限がありません。プロジェクトのオーナーに作業を依頼してください（一般利用者の権限では開けないのが正常です）。",
    imageAlt: "API ライブラリ画面の「有効にする」ボタン",
  },
  {
    id: "A3",
    title: "利用者に使う権限を付ける（ロール付与）",
    who: "プロジェクトのオーナー",
    path: "左上「≡」→「IAM と管理」→「IAM」",
    actions: [
      "「アクセス権を付与」をクリック",
      "「新しいプリンシパル」に利用者の会社メールアドレスを入力",
      "「ロールを選択」で「Cloud AI Companion ユーザー（roles/cloudaicompanion.user）」または「Vertex AI ユーザー（roles/aiplatform.user）」を選ぶ",
      "プロジェクト全体の閲覧が必要な場合は、合わせて「閲覧者（roles/viewer）」を付与し「保存」をクリック",
    ],
    note: "付けるのはこのロールだけで十分です。「オーナー」「編集者」は付けないでください。利用者がクレジット残高や請求レポートを確認したい場合は、別途「請求先アカウント」側で「請求先アカウント閲覧者（roles/billing.viewer）」を付与してください。",
    image: "A3-menu.png",
    imageAlt: "左上「≡」メニューから「IAM と管理」→「IAM」を開くところ",
  },
  {
    id: "A4",
    title: "月の利用上限を設定する（超えたら自動で一時停止）",
    who: "請求先アカウント管理者",
    path: "左上「≡」→「課金」→「予算とアラート」→「予算を作成」",
    link: {
      label: "公式の設定手順（Spend cap）",
      href: "https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps",
    },
    actions: [
      "作成方法で「Spend cap enforcement」（上限を超えたら停止する予算。日本語表示では名称が異なる場合があります）を選び、名前を入力（例：Antigravity 月上限）",
      "対象範囲：プロジェクトに Antigravity 用のプロジェクト、サービスに「Gemini Enterprise Agent Platform」を選ぶ",
      "目標金額に「3,000円 × 利用人数」を入力（例：2人なら 6,000円）",
      "「完了」をクリック",
    ],
    note: "上限はプロジェクト全体にかかります（ユーザーごとの上限は Google 側で未提供）。反映には少しタイムラグがあり、上限を少し超えることがあります。止まった月は翌月1日に自動で再開します。この機能はプレビュー版です。",
    imageAlt: "予算の作成画面で Spend cap を選んだ状態",
  },
  {
    id: "A5",
    title: "使った金額と計上先を確認する",
    who: "請求先アカウント管理者",
    path: "左上「≡」→「課金」→「レポート」",
    actions: [
      "利用者が少し使ったあとにレポートを開く",
      "Antigravity の利用料が「Gemini Enterprise Agent Platform」に計上されていることを確認（違うサービス名なら A4 の対象サービスをそれに合わせる）",
    ],
    imageAlt: "課金レポート画面",
  },
];

const userSteps: GuideStep[] = [
  {
    id: "U1",
    title: "Antigravity に会社アカウントでサインインする",
    who: "利用者",
    actions: [
      "Antigravity を起動し「Sign in」をクリック",
      "「Use business account」→「Continue with Google Cloud」を選ぶ",
      "ブラウザが開くので、会社の Google アカウント（@ml-mightylink.com）を選ぶ",
      "「You have successfully authenticated.」と出たら「Antigravity - Agentic Desktop Application を開く」をクリック",
      `アプリの「Select your license」で、社内プロジェクトID「${COMPANY_GCP_INFO.projectId}」を入力して「Next」`,
      "Region は「Global」のまま、「Use Agent Platform instead」を選んで「Next」",
      "利用規約を確認して「Finish」",
    ],
    note: "赤い「No license available for this project and location」は Gemini Enterprise を契約していないという意味で、Agent Platform（従量課金）で使う当社では問題ありません。「権限がない」「billing を有効にしてください」と表示された場合は、A1〜A3 が終わっていない可能性があります。画面のエラー文をそのまま AI推進担当 に送ってください。",
    image: ["S2-business-cloud.png", "S3-account-chooser.png", "S5-open-app.png", "S6-project-id.png", "S7-agent-platform.png", "S8-terms-finish.png"],
    imageAlt: "Antigravity のサインイン画面（Business account）",
  },
];

export default function GcpSetupGuide() {
  const [copied, setCopied] = useState(false);

  const handleCopyProjectId = () => {
    navigator.clipboard?.writeText(COMPANY_GCP_INFO.projectId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="company-setup" className="scroll-mt-6 space-y-6">
      <div className="space-y-1">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          会社の Google Cloud で Antigravity を使う（業務利用の標準）
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          会社のアカウントのまま使え、料金は使った分だけ会社の Google Cloud 請求にまとまります（個人の Pro 加入は不要）。
          管理者の初回設定（A1〜A5）→ 利用者のサインイン（U1）の順に進めてください。
        </p>
      </div>

      {/* 社内本番環境の確定情報カード */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">社内本番環境 接続情報</h4>
          </div>
          <span className="text-[11px] text-cyan-300 font-mono px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            Managed by your organization
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px] font-mono">Google Cloud 組織</span>
            <span className="font-bold text-slate-100 font-mono text-sm">{COMPANY_GCP_INFO.org}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px] font-mono">社内プロジェクトID（U1入力用）</span>
              <span className="font-bold text-emerald-300 font-mono text-sm tracking-wide">{COMPANY_GCP_INFO.projectId}</span>
            </div>
            <button
              onClick={handleCopyProjectId}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="プロジェクトIDをコピー"
            >
              {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
              <span>{copied ? "コピー済" : "コピー"}</span>
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px] font-mono">ライセンスプラン</span>
            <span className="font-bold text-indigo-300 font-mono text-sm">{COMPANY_GCP_INFO.plan}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
          <Building2 size={15} /> 管理者の初回設定（1回だけ）
        </h4>
        {adminSteps.map((s) => (
          <StepCard key={s.id} step={s} />
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
          <UserCheck size={15} /> 利用者の設定
        </h4>
        {userSteps.map((s) => (
          <StepCard key={s.id} step={s} />
        ))}
      </div>

      {/* 実機トラブルシューティング（実機検証で判明した2大エラーと解消法） */}
      <div className="bg-amber-500/5 border border-amber-300/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-amber-200/80 pb-3">
          <Wrench className="w-5 h-5 text-amber-600" />
          <h4 className="font-extrabold text-sm sm:text-base text-amber-950 tracking-tight">
            実機トラブルシューティング：セットアップ時のよくあるエラーと解消法
          </h4>
        </div>

        <div className="space-y-3.5 text-xs leading-relaxed text-amber-950">
          <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-2 shadow-2xs">
            <div className="flex items-start gap-2 font-extrabold text-rose-800 text-sm">
              <ShieldAlert size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span>エラー①：Google Cloud コンソールで「追加のアクセス権が必要です（billing.resourceCosts.get / getIamPolicy）」と表示される</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">原因：</strong>一般利用者アカウントには、他人の権限一覧（IAM）や請求先全体のレポートを見る管理者権限がないためです。セキュリティ上の正常な保護動作です。
            </p>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">対処法：</strong>Antigravity による開発・コード生成はそのまま行えます。もしAI推進担当者として「クレジット残高や利用金額レポート」を確認したい場合は、請求管理者に「<strong>請求先アカウント閲覧者（roles/billing.viewer）</strong>」の付与を依頼してください（設定変更はできない安全な閲覧権限です）。
            </p>
          </div>

          <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-2 shadow-2xs">
            <div className="flex items-start gap-2 font-extrabold text-rose-800 text-sm">
              <ShieldAlert size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span>エラー②：チャット送信時に「You can prompt the model to try again...」と出て応答が返らない</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">原因：</strong>プロジェクト側で必要なAPI（Cloud AI Companion API / Vertex AI API）が無効であるか、ユーザーにモデル実行ロールが付与されていない可能性があります。
            </p>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">対処法：</strong>
              <br />1. 管理者にプロジェクト「<code>antigravity-pj-509006</code>」で <code>cloudaicompanion.googleapis.com</code> の有効化と、自身のアカウントへ「<code>Cloud AI Companion ユーザー</code>（または Vertex AI ユーザー）」のロール付与を依頼する。
              <br />2. IDE側で「New Conversation（＋）」を開いて新規スレッドにするか、Settings &gt; Account から一度 Sign Out して再ログインする。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs">
        <h4 className="font-extrabold text-sm sm:text-base text-indigo-950 flex items-center gap-2 tracking-tight">
          <UserPlus size={16} className="text-indigo-600" />
          <span>利用者が増えたとき（毎回この2つだけ）</span>
        </h4>
        <ol className="list-decimal pl-5 text-xs text-indigo-950 space-y-1.5 leading-relaxed font-medium">
          <li>A3 の手順で、新しい利用者に「Cloud AI Companion ユーザー（または Vertex AI ユーザー）」を付ける</li>
          <li>A4 で作った予算を開き、目標金額を「3,000円 × 新しい人数」に変更する</li>
        </ol>
        <p className="text-xs text-indigo-800 flex items-start gap-1.5 pt-1.5">
          <AlertTriangle size={14} className="shrink-0 mt-0.5 text-indigo-600" />
          <span>上限は全員の合計です。1人で枠を使い切らないよう、月の途中で使いすぎに気づいたら AI推進担当 に共有してください。</span>
        </p>
      </div>
    </section>
  );
}
