"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { PlayCircle, FileText, CheckCircle2, Award, Clock } from "lucide-react";

export default function LearningPage() {
  const courses = [
    {
      title: "【必修】全社員向け生成AI利用基礎 & セキュリティガイドライン",
      level: "初級",
      duration: "30分",
      format: "e-Learning (動画 + 理解度テスト)",
      description: "業務で安全に生成AIを活用するための社内ルール、著作権・情報漏洩対策、プロンプトの基本ルールを学びます。",
      completed: true,
    },
    {
      title: "今日から使える！プロンプトエンジニアリング実践講座",
      level: "中級",
      duration: "45分",
      format: "ハンズオン動画教材",
      description: "思考の連鎖 (CoT)、Few-Shot、ロール付与テクニックを用いて、GeminiやClaudeからの回答品質を劇的に高める実践術。",
      completed: false,
    },
    {
      title: "Amazon Bedrock & RAGシステム開発 実践マスター",
      level: "エンジニア向け",
      duration: "90分",
      format: "Cloud9 ハンズオン教材",
      description: "Knowledge BasesとOpenSearch Serverlessを用いた社内データ連携検索システムの構築フローをハンズオン形式で習得。",
      completed: false,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="教育用コンテンツ"
        subtitle="全社員向け基礎教育からエンジニア向けハンズオン教材まで"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【制作中】教育用e-Learningコンテンツは現在カリキュラム制作中です"
          submessage="全社員向け基礎教育動画およびAntigravityエンジニア向けハンズオン教材は、2026年Q4の公開に向けて現在撮影・環境構築中です。"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow opacity-95"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                    {course.level}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{course.duration}</span>
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">{course.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{course.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{course.format}</span>
                <button
                  onClick={() => alert("現在カリキュラム制作中です。公開まで今しばらくお待ちください。")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-200"
                >
                  <PlayCircle size={14} />
                  <span>🚧 制作中</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
