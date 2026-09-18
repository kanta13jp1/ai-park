"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import { UnderConstructionBanner } from "@/components/UnderConstruction";
import { PlusCircle, ThumbsUp, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";

export default function IdeaBoardPage() {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: "社内技術仕様・ナレッジ検索用 AI Agent の構築",
      author: "プロダクト開発チーム",
      tags: ["Agent", "RAG", "Bedrock"],
      likes: 32,
      comments: 6,
      status: "検証中 (PoC)",
      description: "社内に蓄積された膨大な設計書・障害対応ナレッジから、エラーコードや不具合現象を入力するだけで過去の対処実績と手順書該当ページを即時抽出するエージェントを構築中。",
    },
    {
      id: 2,
      title: "社内FAQボットのマルチモーダル化（画像から回答）",
      author: "社内ヘルプデスク",
      tags: ["Gemini", "画像認識"],
      likes: 24,
      comments: 3,
      status: "アイデア募集中",
      description: "PCや社内ツールのエラー画面のスクリーンショットを貼り付けるだけで、即座に解決策を提示してくれるボットを作りたいです。",
    },
    {
      id: 3,
      title: "システム障害時・仕様変更時の影響範囲自動シミュレーション",
      author: "SRE・運用自動化チーム",
      tags: ["自動化", "データ分析"],
      likes: 41,
      comments: 9,
      status: "本番開発中",
      description: "マイクロサービス障害発生時、依存サービスへの影響範囲や代替切り替えルートをAIで高速シミュレーションする仕組み。",
    },
  ]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="アイデア宣言ボード"
        subtitle="社内AI活用のアイデア宣言・共創・コラボレーションの場"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionBanner
          message="【展示中】アイデア宣言ボードは現在モック展示中です"
          submessage="今後、社内Slack（#ai-idea-board）や社内GitHub Discussionsとの双方向投稿・リアクション連携機能を実装予定です。"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
          <div>
            <h3 className="font-bold text-slate-800 text-base">あなたのAI活用アイデアを宣言してみませんか？</h3>
            <p className="text-xs text-slate-500 mt-1">「こんな業務を効率化したい」「このツールを試してみたい」という宣言から仲間やCoEの支援が集まります。</p>
          </div>
          <button
            onClick={() => alert("現在アイデア投稿フォームを準備中です。先行でのアイデア相談やPoC希望はCoEメンターまでご連絡ください。")}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg shrink-0 transition-colors border border-slate-300 shadow-xs"
          >
            <PlusCircle size={15} />
            <span>アイデアを投稿する</span>
            <span className="text-[10px] text-amber-700 font-normal">（🚧 準備中）</span>
          </button>
        </div>

        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {idea.status}
                    </span>
                    <span className="text-xs text-slate-400">投稿者: {idea.author}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{idea.title}</h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{idea.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-1.5">
                  {idea.tags.map((tag) => (
                    <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-slate-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                    <ThumbsUp size={14} />
                    <span>{idea.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                    <MessageSquare size={14} />
                    <span>{idea.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
