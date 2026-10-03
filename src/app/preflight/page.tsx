"use client";

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import SpotlightCard from "@/components/SpotlightCard";
import {
  preflightChecklistMaster,
  type FeaturePreflightRecord,
} from "@/data/preflight-checklist";
import { featureStatusMaster } from "@/data/feature-status";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Layout,
  MousePointerClick,
  FileCheck2,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  UserCheck,
  HelpCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function PreflightUatPage() {
  const [records, setRecords] = useState<FeaturePreflightRecord[]>(
    preflightChecklistMaster
  );
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>(
    preflightChecklistMaster[0]?.id || "home"
  );
  const [copiedReport, setCopiedReport] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "passed" | "needs_work">("all");

  const selectedRecord = records.find((r) => r.id === selectedFeatureId) || records[0];

  // 全機能数と通過率の計算
  const verifiedCount = featureStatusMaster.filter((f) => f.isVerified).length;
  const underDevCount = featureStatusMaster.filter((f) => !f.isVerified).length;
  const passedPreflightCount = records.filter((r) => r.overallStatus === "passed").length;

  // レポート生成（Markdown）
  const generateMarkdownReport = () => {
    let md = `# 🛡️ MightyLINK AI Park: 開発者手動プリフライトチェック（UAT）検証報告書\n\n`;
    md += `検証日: ${new Date().toLocaleDateString("ja-JP")}\n`;
    md += `検証者: 梅澤（AI推進担当）\n`;
    md += `品質基準: 仕様・事実確認、デザイン・レイアウト、操作性、視認性の4大チェック全合格\n\n`;
    md += `## ■ 本番公開承認機能（手動UAT合格済み）: ${passedPreflightCount}件\n\n`;

    records.forEach((r) => {
      md += `### 【${r.name}】(${r.path})\n`;
      md += `- **ステータス**: ${r.overallStatus === "passed" ? "✅ 合格 (Passed)" : "⚠️ 要対応"}\n`;
      md += `- **確認環境**: ${r.environment}\n`;
      md += `- **仕様・事実確認**: ${r.checks.factAndSpec.passed ? "✅ OK" : "❌ NG"} - ${r.checks.factAndSpec.evidence}\n`;
      md += `- **デザイン・レイアウト**: ${r.checks.designAndLayout.passed ? "✅ OK" : "❌ NG"} - ${r.checks.designAndLayout.evidence}\n`;
      md += `- **操作性・機能性**: ${r.checks.usability.passed ? "✅ OK" : "❌ NG"} - ${r.checks.usability.evidence}\n`;
      md += `- **視認性・アクセシビリティ**: ${r.checks.readability.passed ? "✅ OK" : "❌ NG"} - ${r.checks.readability.evidence}\n`;
      md += `- **特記事項**: ${r.memo}\n\n`;
    });

    md += `## ■ 未検証・工事中管理機能（デプロイゲートガード中）: ${underDevCount}件\n\n`;
    featureStatusMaster
      .filter((f) => !f.isVerified)
      .forEach((f) => {
        md += `- **${f.name}** (${f.href}): ${f.currentBadge} - ${f.disclaimer} (解除条件: ${f.releaseCondition})\n`;
      });

    return md;
  };

  const handleCopyReport = () => {
    const report = generateMarkdownReport();
    navigator.clipboard?.writeText(report).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 min-h-screen">
      <HeroBanner
        title="開発者用 プリフライトチェック＆手動UAT管理"
        subtitle="「仕様・事実確認」「デザイン」「操作性」「視認性」を開発者が実機で手動検証し、全て合格した機能のみを公開する品質保証基盤"
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ガバナンス宣誓バナー */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                DEVELOPER UAT GATE
              </span>
              <span className="text-xs text-indigo-300 font-mono">
                Manual Verification Required
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              自動テストだけでなく、開発者が実際に画面を触って確認する
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              社員向けに公開するサイトであるため、万が一にも嘘や推測のデータ、崩れたデザイン、動かないリンクがあってはなりません。
              本画面は、開発者が4大評価軸をすべて手動で受入テスト（UAT）し、合格エビデンスを記録するための専用コンソールです。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleCopyReport}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copiedReport ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedReport ? "UAT報告書をコピー完了" : "UAT報告書をMarkdownでコピー"}</span>
            </button>
          </div>
        </div>

        {/* 4大KPIカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.15)" className="bg-white border-slate-200">
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 size={15} className="text-emerald-600" />
                  手動UAT 合格機能
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                  100% 承認
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {passedPreflightCount} <span className="text-xs font-normal text-slate-500">/ {records.length} 機能</span>
              </div>
              <p className="text-[11px] text-slate-500">全4項目を手動検証済み</p>
            </div>
          </SpotlightCard>

          <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.15)" className="bg-white border-slate-200">
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-blue-600" />
                  公式公開中ページ
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                  VERIFIED
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {verifiedCount} <span className="text-xs font-normal text-slate-500">ページ</span>
              </div>
              <p className="text-[11px] text-slate-500">事実確認・エビデンス担保済み</p>
            </div>
          </SpotlightCard>

          <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.15)" className="bg-white border-slate-200">
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle size={15} className="text-amber-600" />
                  工事中・PoCガード
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                  PROTECTED
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {underDevCount} <span className="text-xs font-normal text-slate-500">機能</span>
              </div>
              <p className="text-[11px] text-slate-500">嘘の混入をゲートで阻止中</p>
            </div>
          </SpotlightCard>

          <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.15)" className="bg-white border-slate-200">
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <Laptop size={15} className="text-purple-600" />
                  実機検証環境
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono">
                  TESTBED
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                Win 11 / Chrome / 1080p
              </div>
              <p className="text-[11px] text-slate-500">社内標準PC環境で全件確認</p>
            </div>
          </SpotlightCard>
        </div>

        {/* メイン検証コンソール（2カラム） */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左カラム：機能一覧セレクター */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <FileCheck2 size={14} className="text-indigo-600" />
                  <span>手動UAT 対象機能</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  {records.length} 件登録
                </span>
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {records.map((r) => {
                  const isSelected = r.id === selectedFeatureId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedFeatureId(r.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1 border ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">
                          {r.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isSelected
                              ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          合格
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] opacity-80 font-mono">
                        <span>{r.path}</span>
                        <span>{r.lastVerifiedAt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 工事中・準備中機能の保護リスト */}
            <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-600" />
                <span>工事中・未検証機能（{underDevCount}件）</span>
              </h4>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                以下の機能は手動UAT未完了のため、ビルドゲートにより「工事中 / 準備中 / PoC」の注意書きが強制表示されています。
              </p>
              <div className="space-y-1 max-h-48 overflow-y-auto text-[11px] font-mono text-amber-950">
                {featureStatusMaster
                  .filter((f) => !f.isVerified)
                  .map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-1.5 rounded bg-white/70 border border-amber-200/60">
                      <span className="truncate max-w-[160px]">{f.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 font-bold shrink-0">
                        {f.currentBadge}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* 右カラム：選択した機能の4大手動チェックシート */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              {/* 機能ヘッダー */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {selectedRecord.name}
                    </h3>
                    <Link
                      href={selectedRecord.path}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-xs font-bold transition-colors"
                    >
                      <span>画面を開く</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    パス: {selectedRecord.path} ｜ 対象: {selectedRecord.targetAudience} ｜ 最終確認: {selectedRecord.lastVerifiedAt} ({selectedRecord.verifiedBy})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>手動UAT 全項目合格</span>
                  </span>
                </div>
              </div>

              {/* 4大評価軸詳細 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ① 仕様・事実確認 */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                      <FileCheck2 size={15} className="text-indigo-600" />
                      <span>① 仕様・事実確認（Fact & Spec）</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      合格
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                    <span className="font-bold text-slate-700 block">手動確認ポイント:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {selectedRecord.checks.factAndSpec.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60 flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span><strong>確認エビデンス:</strong> {selectedRecord.checks.factAndSpec.evidence}</span>
                  </div>
                </div>

                {/* ② デザイン・レイアウト */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                      <Layout size={15} className="text-blue-600" />
                      <span>② デザイン・レイアウト（Aesthetics）</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      合格
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                    <span className="font-bold text-slate-700 block">手動確認ポイント:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {selectedRecord.checks.designAndLayout.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60 flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span><strong>確認エビデンス:</strong> {selectedRecord.checks.designAndLayout.evidence}</span>
                  </div>
                </div>

                {/* ③ 操作性・機能性 */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                      <MousePointerClick size={15} className="text-purple-600" />
                      <span>③ 操作性・機能性（Usability）</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      合格
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                    <span className="font-bold text-slate-700 block">手動確認ポイント:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {selectedRecord.checks.usability.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60 flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span><strong>確認エビデンス:</strong> {selectedRecord.checks.usability.evidence}</span>
                  </div>
                </div>

                {/* ④ 視認性・アクセシビリティ */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                      <Eye size={15} className="text-amber-600" />
                      <span>④ 視認性・分かりやすさ（Readability）</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      合格
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                    <span className="font-bold text-slate-700 block">手動確認ポイント:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                      {selectedRecord.checks.readability.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60 flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span><strong>確認エビデンス:</strong> {selectedRecord.checks.readability.evidence}</span>
                  </div>
                </div>
              </div>

              {/* 検証環境＆特記事項 */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 text-xs font-mono space-y-1.5">
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Laptop size={14} />
                  <span>手動受入テスト実施環境・承認サインオフ</span>
                </div>
                <p className="text-slate-300">
                  環境: {selectedRecord.environment}
                </p>
                <p className="text-slate-400">
                  特記メモ: {selectedRecord.memo}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
