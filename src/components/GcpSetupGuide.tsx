import { basePath } from "@/lib/basePath";
import { Building2, UserCheck, UserPlus, ImageIcon, ExternalLink, AlertTriangle } from "lucide-react";

// 会社のGoogle Cloudプロジェクト経由で Antigravity を使うための運用手順書
// 画面キャプチャは public/images/guide/ に置き、image にファイル名を指定する（未指定の間は枠のみ表示）

interface GuideStep {
  id: string;
  title: string;
  who: string;
  path?: string; // 画面の開き方（メニューのたどり方）
  link?: { label: string; href: string };
  actions: string[];
  note?: string;
  image?: string;
  imageAlt: string;
}

const adminSteps: GuideStep[] = [
  {
    id: "A1",
    title: "プロジェクトに会社の支払い方法をひも付ける",
    who: "請求先アカウント管理者",
    path: "Google Cloud コンソール → 左上でプロジェクトを選択 → 左上「≡」→「課金」",
    link: { label: "Google Cloud コンソールを開く", href: "https://console.cloud.google.com/" },
    actions: [
      "画面左上のプロジェクト名をクリックし、Antigravity 用のプロジェクトを選ぶ",
      "左上の「≡」メニューから「課金」を開く",
      "「請求先アカウントをリンク」をクリックし、会社の請求先アカウントを選んで「アカウントを設定」",
    ],
    note: "初めて Google Cloud を使う請求先アカウントには 300ドル分の無料トライアルクレジット（90日間）が付きます。90日経過かクレジットを使い切ると、有料アカウントへアップグレードしない限りプロジェクトが止まります。",
    imageAlt: "課金画面の「請求先アカウントをリンク」ボタン",
  },
  {
    id: "A2",
    title: "AI の API を有効にする",
    who: "プロジェクトのオーナー",
    link: {
      label: "API の画面を直接開く",
      href: "https://console.cloud.google.com/apis/library/aiplatform.googleapis.com",
    },
    actions: [
      "左のリンクを開き、画面上部のプロジェクトが Antigravity 用になっていることを確認",
      "「有効にする」をクリック（すでに「管理」と表示されていれば有効化済み）",
    ],
    note: "「追加のアクセス権が必要です」という画面が出た場合は、開いた人にオーナー権限がありません。プロジェクトのオーナーに作業を依頼してください（利用者の権限では開けないのが正常です）。",
    imageAlt: "API ライブラリ画面の「有効にする」ボタン",
  },
  {
    id: "A3",
    title: "利用者に使う権限を付ける",
    who: "プロジェクトのオーナー",
    path: "左上「≡」→「IAM と管理」→「IAM」",
    actions: [
      "「アクセス権を付与」をクリック",
      "「新しいプリンシパル」に利用者の会社メールアドレスを入力",
      "「ロールを選択」で「Agent Platform ユーザー」を選ぶ（画面によっては旧名の「Vertex AI ユーザー」と表示されます）",
      "「保存」をクリック",
    ],
    note: "付けるのはこのロールだけで十分です。「オーナー」「編集者」は付けないでください。",
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
      "「Business account」→「Continue with Google Cloud」を選ぶ",
      "ブラウザが開くので、会社の Google アカウントでログイン",
      "プロジェクトの選択画面で「Other」を選び、AI CoE から案内されたプロジェクト ID を入力",
      "ロケーションは「global」を選んで完了",
    ],
    note: "「権限がない」「billing を有効にしてください」と表示された場合は、A1〜A3 が終わっていない可能性があります。画面のエラー文をそのまま AI CoE に送ってください。",
    imageAlt: "Antigravity のサインイン画面（Business account）",
  },
];

function StepCard({ step }: { step: GuideStep }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white">{step.id}</span>
          <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
            作業する人：{step.who}
          </span>
        </div>
        {step.path && (
          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <span className="font-bold text-slate-700">開き方：</span>
            {step.path}
          </p>
        )}
        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
          {step.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ol>
        {step.link && (
          <a
            href={step.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
          >
            {step.link.label}
            <ExternalLink size={11} />
          </a>
        )}
        {step.note && (
          <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
            {step.note}
          </p>
        )}
      </div>
      {step.image ? (
        <a href={`${basePath}/images/guide/${step.image}`} target="_blank" rel="noopener noreferrer" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/images/guide/${step.image}`}
            alt={step.imageAlt}
            className="w-full rounded-lg border border-slate-200 shadow-xs"
          />
          <span className="block text-[11px] text-slate-400 mt-1">クリックで拡大</span>
        </a>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-6 min-h-40 text-slate-400">
          <ImageIcon size={28} />
          <span className="text-xs font-semibold mt-2">画面キャプチャ準備中</span>
          <span className="text-[11px] mt-0.5">{step.imageAlt}</span>
        </div>
      )}
    </div>
  );
}

export default function GcpSetupGuide() {
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

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 space-y-2">
        <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
          <UserPlus size={15} /> 利用者が増えたとき（毎回この2つだけ）
        </h4>
        <ol className="list-decimal pl-5 text-xs text-indigo-950 space-y-1 leading-relaxed">
          <li>A3 の手順で、新しい利用者に「Agent Platform ユーザー」を付ける</li>
          <li>A4 で作った予算を開き、目標金額を「3,000円 × 新しい人数」に変更する</li>
        </ol>
        <p className="text-xs text-indigo-800 flex items-start gap-1.5 pt-1">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          上限は全員の合計です。1人で枠を使い切らないよう、月の途中で使いすぎに気づいたら AI CoE に共有してください。
        </p>
      </div>
    </section>
  );
}
