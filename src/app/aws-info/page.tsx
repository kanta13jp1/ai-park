"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  Cloud,
  ShieldCheck,
  Server,
  Key,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  FileText,
  DollarSign,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface CloudService {
  name: string;
  provider: "AWS" | "GCP";
  category: string;
  policy: string;
  securityLevel: "Level 1" | "Level 2" | "Level 3";
  description: string;
}

const CLOUD_SERVICES: CloudService[] = [
  {
    name: "Amazon Bedrock (Claude 3.5 / Llama 3)",
    provider: "AWS",
    category: "生成AI基盤",
    policy: "社内利用可（データ学習不使用契約）",
    securityLevel: "Level 1",
    description: "AWSのマネージド生成AI。社内AWSアカウント配下のVPCエンドポイント経由で利用可能。入力データはモデルの学習に一切使用されません。"
  },
  {
    name: "Google Agent Platform / Vertex AI",
    provider: "GCP",
    category: "エージェント基盤",
    policy: "社内標準（Antigravity利用環境）",
    securityLevel: "Level 1",
    description: "Antigravity IDEの公式バックエンド。組織（ml-mightylink.com）配下で管理され、安全な社内コード・ドキュメントの解析が可能です。"
  },
  {
    name: "AWS Lambda / ECS / Fargate",
    provider: "AWS",
    category: "コンテナ・サーバーレス",
    policy: "申請制（本番・PoC環境）",
    securityLevel: "Level 1",
    description: "社内ウェブアプリやAI APIの実行基盤。インフラチームによるTerraformコードレビューを経て自動デプロイされます。"
  },
  {
    name: "Google BigQuery / Cloud Storage",
    provider: "GCP",
    category: "データウェアハウス・分析",
    policy: "社内データ統合基盤",
    securityLevel: "Level 1",
    description: "全社的な分析・ログ集計基盤。権限管理（IAM）に基づき、必要最小限のアクセス権が付与されます。"
  }
];

const APPLICATION_STEPS = [
  {
    step: 1,
    title: "利用目的と月額予算の確認",
    detail: "PoC利用か本番運用かを明確にし、月額の想定コスト（例: 月 $50 以内）を試算します。"
  },
  {
    step: 2,
    title: "社内申請（GitHub Issue または Office Hour）",
    detail: "インフラチームへ利用サービスとアカウント発行を依頼します。通常1〜2営業日で発行されます。"
  },
  {
    step: 3,
    title: "IAM権限とMFA（二要素認証）の設定",
    detail: "会社のGoogle Workspace SSOまたはAWS IAM Identity Center経由で安全にログインします。"
  },
  {
    step: 4,
    title: "予算アラートの設定",
    detail: "予算の80%および100%に達した際にSlack/メールへ通知するアラートを設定して利用開始します。"
  }
];

export default function AwsInfoPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AWS・クラウド情報局"
        subtitle="社内におけるAWS・Google Cloud環境の利用ガイドライン・申請手順・セキュリティ基準"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* クラウド利用基本方針 */}
        <div className="bg-gradient-to-r from-sky-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold">
                <Cloud size={14} />
                <span>社内マルチクラウド運用方針</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                安心・安全なクラウド基盤で、迅速なAI・開発PoCを加速する
              </h2>
              <p className="text-sky-200 text-xs leading-relaxed">
                当社では、生成AIエージェント基盤として **Google Cloud (Agent Platform / Antigravity)** を、
                社内システムおよび本番インフラとして **AWS (Amazon Web Services)** を適材適所で活用しています。
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs space-y-2 shrink-0">
              <div className="font-bold flex items-center gap-1.5 text-sky-200">
                <ShieldCheck size={14} />
                <span>社内統制・セキュリティ遵守</span>
              </div>
              <ul className="space-y-1 text-slate-200 text-[11px]">
                <li>• 個人クレカでの会社業務利用禁止</li>
                <li>• 全アカウントでMFA（二要素認証）必須</li>
                <li>• 予算アラートによるコスト超過防止</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 主要クラウドサービス一覧とセキュリティ水準 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <span>認定クラウドサービス ＆ 利用可能範囲</span>
            </h3>
            <span className="text-xs text-slate-400">インフラ管理部 承認済み</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLOUD_SERVICES.map((srv) => (
              <div
                key={srv.name}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        srv.provider === "AWS"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}>
                        {srv.provider}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{srv.category}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {srv.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {srv.securityLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                  運用ポリシー: <span className="text-slate-800 font-bold">{srv.policy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* クラウド環境の申請・利用開始フロー */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <span>クラウド環境・アカウント申請の流れ (4ステップ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              新しくAWSやGCPのリソースを使いたい場合の社内標準フロー
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {APPLICATION_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {step.step}
                </div>
                <h4 className="font-bold text-slate-900 text-xs">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-indigo-950 space-y-0.5">
              <div className="font-bold">申請や構成で迷ったときは？</div>
              <p className="text-[11px] text-indigo-800">
                毎週水曜のOffice Hourまたはお問い合わせ窓口にて、インフラ担当者が直接構成相談を受け付けています。
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>利用・構成の相談をする</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
