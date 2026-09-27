import Link from "next/link";
import BeginnerCheatsheet from "@/components/BeginnerCheatsheet";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import { GraduationCap } from "lucide-react";

export default function LearningPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200/90 pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            生成AI <span className="text-sky-600">学習コンテンツ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">AI エージェントを使い始めるための学習リソース</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        <Link
          href="/academy"
          className="flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl p-5 shadow-sm transition-colors"
        >
          <GraduationCap className="w-8 h-8 shrink-0" />
          <span>
            <span className="block font-black">Antigravity Academy</span>
            <span className="block text-xs text-indigo-100">動画と実践で学ぶ全12レッスン。評価テストに合格すると修了証を発行できます。</span>
          </span>
        </Link>

        <BeginnerCheatsheet />

        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：おすすめ講座・資格の一覧を準備しています"
          message="社内でおすすめする外部講座・資格と、受講・受験の補助制度はまだ決まっていません。決まり次第、ここに掲載します。"
        />
      </div>
    </div>
  );
}
