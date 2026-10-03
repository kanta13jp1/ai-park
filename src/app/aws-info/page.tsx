"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  Cloud,
  ShieldCheck,
  Server,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  Database,
  Cpu,
  FileCheck2,
  CheckCircle2,
  FileText
} from "lucide-react";
import Link from "next/link";

interface CloudComparisonItem {
  serviceType: string;
  awsService: string;
  gcpService: string;
  internalGuideline: string;
}

const CLOUD_COMPARISONS: CloudComparisonItem[] = [
  {
    serviceType: "生成AI基盤モデル",
    awsService: "Amazon Bedrock (Claude / Titan)",
    gcpService: "Vertex AI (Gemini 3.1 Pro / Flash)",
    internalGuideline: "社内コード支援は Gemini Code Assist 推奨。固有LLM検証時は事前申請。"
  },
  {
    serviceType: "オブジェクトストレージ",
    awsService: "Amazon S3",
    gcpService: "Google Cloud Storage (GCS)",
    internalGuideline: "原則としてパブリックアクセス防止（PAB）および社内組織ポリシー適用必須。"
  },
  {
    serviceType: "サーバーレス実行環境",
    awsService: "AWS Lambda",
    gcpService: "Cloud Functions / Cloud Run",
    internalGuideline: "コンテナ化されたワークロードは Cloud Run / ECS への集約を推奨。"
  },
  {
    serviceType: "データウェアハウス",
    awsService: "Amazon Redshift",
    gcpService: "Google BigQuery",
    internalGuideline: "社内共通分析基盤は BigQuery に統合。クエリ課金上限アラート必須。"
  }
];

export default function AwsInfoPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="AWS・マルチクラウド情報局"
        subtitle="社内クラウド利用ガイドライン・申請フロー・セキュア環境構築ポータル"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中・利用規程策定中（準備中）"
          message="社内における AWS およびマルチクラウドの利用ルール・申請フロー・相談窓口を策定中です。情シス・セキュリティ委員会での公式規程制定後、正確な情報を掲載します。"
          prepDetails="社内クラウド利用規程およびデータ分類レベル基準の公式策定、アカウント払い出しワークフローの整備を進めています。"
          releaseDate="未定（社内規程決定次第）"
        />

        {/* クラウドガバナンスHUDバナー */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40 cursor-default"
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                  <Cloud size={14} className="text-cyan-400" />
                  <span>ENTERPRISE CLOUD GOVERNANCE</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  セキュアで迅速なマルチクラウド活用へ
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  MightyLINK では、Google Cloud と AWS を適材適所で安全に活用するための統合ガバナンスを推進しています。
                  環境の払い出し、踏み台接続、権限管理（IAM）、月次コストモニタリングを一元管理し、開発者の自由な試作と企業のセキュリティ要件を両立させます。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0 font-mono text-xs space-y-2">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>SECURITY LEVEL: CLASS-A</span>
                </div>
                <div className="text-slate-300">・組織SCP（サービスコントロールポリシー）適用</div>
                <div className="text-slate-300">・SSO（シングルサインオン）連携必須</div>
                <div className="text-slate-300">・月次利用料金アラートの自動通知</div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 比較テーブル */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3.5">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>主要クラウドサービス社内マッピング（参考）</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              AWS と Google Cloud の主要プロダクト対応表および社内利用ガイドライン
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-mono text-slate-700">
                  <th className="py-3 px-4 rounded-l-xl">領域</th>
                  <th className="py-3 px-4">AWS (Amazon Web Services)</th>
                  <th className="py-3 px-4">Google Cloud (GCP)</th>
                  <th className="py-3 px-4 rounded-r-xl">社内方針・注意事項</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {CLOUD_COMPARISONS.map((row, idx) => (
                  <tr
                    key={idx}
                    onMouseEnter={() => playCyberHover()}
                    className="hover:bg-slate-50/60 transition-colors cursor-default"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">{row.serviceType}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-700 font-semibold">{row.awsService}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-700 font-semibold">{row.gcpService}</td>
                    <td className="py-3.5 px-4 text-xs leading-relaxed">{row.internalGuideline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 申請フローと相談窓口 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.12)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <div className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                    <FileCheck2 size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    クラウド環境利用申請（準備中）
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    新規開発プロジェクトやPoC（概念実証）で専用のクラウド環境（AWS Account / GCP Project）が必要な場合、正式ワークフローが制定され次第こちらから申請可能になります。
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-500">
                    <span>ステータス: 申請フロー設計中（情シス協議中）</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">受付開始予定: 2026年Q4</span>
                  <Link
                    href="/contact"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-800 font-mono cursor-pointer"
                  >
                    <span>個別事前相談はこちら</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(99, 102, 241, 0.12)"
              className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
            >
              <div className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    社内セキュリティ・コスト監視
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Google Cloud の社内利用状況および $300 無料クレジットの残高・推移は「社内利用状況（Gemini利用モニタ）」からリアルタイムで確認可能です。
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-500">
                    <span>監視基盤: Gemini Live Monitoring API 稼働中</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">更新間隔: リアルタイム</span>
                  <Link
                    href="/gemini-stats"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 font-mono cursor-pointer"
                  >
                    <span>モニタ画面を見る</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
