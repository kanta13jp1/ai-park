"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { Info, Sparkles, MessageSquare, ShieldCheck, BookOpen, ExternalLink, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

export default function AwsInfoPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      {/* ヒーローバナー */}
      <HeroBanner title="AWS情報局" />

      {/* Office Hour 予約ボタンバー */}
      <OfficeHourBanner />

      {/* メインコンテンツエリア */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 space-y-12">
        {/* 1. クラウド推進デスク セクション */}
        <section className="flex flex-col items-center text-center">
          {/* デスク ビジュアルカード */}
          <div className="relative p-6 bg-gradient-to-b from-slate-50 to-amber-50/50 border-2 border-amber-200/80 shadow-md rounded-2xl max-w-[320px] w-full transform hover:scale-[1.01] transition-transform duration-200">
            <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3 text-3xl">
              ☁️
            </div>
            <h4 className="font-bold text-slate-800 text-base">AWS Cloud Support Desk</h4>
            <p className="text-xs text-amber-700 font-semibold mt-0.5">MightyLINK クラウド推進チーム</p>
            <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>平日 10:00〜18:00 受付中</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              AWS 相談デスク（Office Hour）
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              社内でのAWS活用・生成AI（Amazon Bedrockなど）の導入相談、PoC支援、AWSアカウント申請やアーキテクチャ設計レビューを随時受け付けています。
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>クラウドメンターに個別相談する（Office Hour）</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. 主な相談・支援テーマ */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-800">
              AWS情報局でサポートできること
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                ☁️
              </div>
              <h4 className="font-bold text-slate-900 mb-1">AWS基盤・アカウント支援</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                プロジェクト用AWSマルチアカウントの発行申請、IAM設定、コスト見積もり、社内ネットワーク連携など基盤構築をサポートします。
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
                🤖
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Amazon Bedrock / 生成AI</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Claude 3.5 / Amazon Titan 等の社内データ活用、Knowledge Basesを用いたRAG構築、Agents実装の技術相談・ハンズオンを提供します。
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                🛡️
              </div>
              <h4 className="font-bold text-slate-900 mb-1">社内ガバナンス・セキュリティ</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                MightyLINK標準のセキュリティチェックシート対応、暗号化基準、機密データ取り扱いルールのクリアに向けた助言を行います。
              </p>
            </div>
          </div>
        </section>

        {/* 3. 最新トピック・アップデート情報 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-800">
                AWS最新トピック & 社内ナレッジ
              </h3>
            </div>
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              🚧 サンプル展示中
            </span>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded">
                    おすすめ
                  </span>
                  <span className="text-xs text-slate-400">2026.09.15</span>
                </div>
                <h5 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  【ハンズオン資料】社内ドキュメントを即時検索するAmazon Bedrock Knowledge Bases入門
                </h5>
                <p className="text-xs text-slate-500">
                  社内S3バケットとOpenSearch Serverlessを連携させたセキュアな社内RAGシステムの構築手順書を公開しました。
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-4 mt-2" />
            </div>

            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded">
                    ガイドライン
                  </span>
                  <span className="text-xs text-slate-400">2026.09.01</span>
                </div>
                <h5 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  【2026年度版】社内AWS環境における機密データ取扱いルールと利用申請フロー
                </h5>
                <p className="text-xs text-slate-500">
                  個人情報や社外秘情報を取り扱う際のマスキング要件と、承認プロセスの簡易化についての変更点です。
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-4 mt-2" />
            </div>

            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded">
                    勉強会
                  </span>
                  <span className="text-xs text-slate-400">2026.08.28</span>
                </div>
                <h5 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  第12回 社内AWSもくもく会 & アーキテクチャ相談会 アーカイブ動画
                </h5>
                <p className="text-xs text-slate-500">
                  サーバーレス構成のコスト最適化とLambda SnapStartの活用事例についてのセッション録画です。
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-4 mt-2" />
            </div>
          </div>
        </section>

        {/* 4. 社内クイックリンク & FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-slate-700" />
              <h4 className="font-bold text-sm text-slate-900">よくある質問 (FAQ)</h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">Q.</span>
                <span>検証用のAWSサンドボックス環境は誰でも即日利用できますか？</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">Q.</span>
                <span>Bedrockの利用料は各部署の予算付けが必要ですか？</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">Q.</span>
                <span>相談会（Office Hour）は1名での参加でも大丈夫ですか？</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
              <h4 className="font-bold text-sm text-slate-900">社内リンク & 窓口</h4>
            </div>
            <div className="space-y-2 text-xs">
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-colors"
              >
                <span>社内AWSアカウント申請ワークフロー (ServiceNow)</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-colors"
              >
                <span>Slack チャンネル: #proj-aws-support</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-colors"
              >
                <span>MightyLINK クラウド利用ガイドライン</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* フッターのインフォメーションアイコン */}
        <div className="pt-8 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-400">
          <Info size={16} />
          <span>当ページは社内専用ポータル「AI Park」の公式情報局コンテンツです。無断転載・社外共有はご遠慮ください。</span>
        </div>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
