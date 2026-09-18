"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  PlusCircle,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  X,
  Send,
  Check,
  Tag,
  Filter,
  Search,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Idea {
  id: number;
  title: string;
  author: string;
  tags: string[];
  likes: number;
  comments: number;
  status: "検証中 (PoC)" | "アイデア募集中" | "本番開発中";
  description: string;
  isLiked?: boolean;
}

const initialIdeas: Idea[] = [
  {
    id: 1,
    title: "社内技術仕様・ナレッジ検索用 AI Agent の構築",
    author: "プロダクト開発チーム / 鈴木",
    tags: ["Agent", "RAG", "Gemini-2.5-Pro"],
    likes: 32,
    comments: 6,
    status: "検証中 (PoC)",
    description:
      "社内に蓄積された膨大な設計書・障害対応ナレッジから、エラーコードや不具合現象を入力するだけで過去の対処実績と手順書該当ページを即時抽出するエージェントを構築中。",
  },
  {
    id: 2,
    title: "社内FAQボットのマルチモーダル化（画像から回答）",
    author: "社内ヘルプデスク / 佐藤",
    tags: ["Gemini", "画像認識", "自動化"],
    likes: 24,
    comments: 3,
    status: "アイデア募集中",
    description:
      "PCや社内ツールのエラー画面のスクリーンショットを貼り付けるだけで、即座に解決策を提示してくれるボットを作りたいです。現在UI設計を一緒に検討してくれるメンバーを募集中。",
  },
  {
    id: 3,
    title: "システム障害時・仕様変更時の影響範囲自動シミュレーション",
    author: "SRE・運用自動化チーム / 高橋",
    tags: ["自動化", "データ分析", "Subagents"],
    likes: 41,
    comments: 9,
    status: "本番開発中",
    description:
      "マイクロサービス障害発生時、依存サービスへの影響範囲や代替切り替えルートをAIで高速シミュレーションする仕組み。Antigravityの並列サブエージェントを活用して検証中。",
  },
  {
    id: 4,
    title: "定例会議の議事録自動作成 & Todoチケット自動起票",
    author: "プロジェクトマネジメント室 / 伊藤",
    tags: ["会議自動化", "Slack連携", "Gemini"],
    likes: 28,
    comments: 4,
    status: "アイデア募集中",
    description:
      "Google Meet / Zoom の文字起こしデータから決定事項とネクストアクションを抽出し、担当者のGitHub IssueやBacklogチケットを自動生成するワークフローの実現を目指します。",
  },
];

export default function IdeaBoardPage() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [selectedStatus, setSelectedStatus] = useState<string>("すべて");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // フォーム用ステート
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formStatus, setFormStatus] = useState<Idea["status"]>("アイデア募集中");
  const [formTags, setFormTags] = useState("");
  const [formDesc, setFormDesc] = useState("");

  // いいね機能
  const handleToggleLike = (id: number) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === id) {
          const isLiked = !idea.isLiked;
          return {
            ...idea,
            likes: isLiked ? idea.likes + 1 : idea.likes - 1,
            isLiked,
          };
        }
        return idea;
      })
    );
  };

  // 投稿送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAuthor.trim() || !formDesc.trim()) {
      alert("必須項目（タイトル、提案者名、アイデア概要）を入力してください。");
      return;
    }

    const tagList = formTags
      .split(/[,、\s]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter((t) => t.length > 0);

    const newIdea: Idea = {
      id: Date.now(),
      title: formTitle.trim(),
      author: formAuthor.trim(),
      tags: tagList.length > 0 ? tagList : ["AI活用", "社内共創"],
      likes: 1,
      comments: 0,
      status: formStatus,
      description: formDesc.trim(),
      isLiked: true,
    };

    setIdeas([newIdea, ...ideas]);
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsModalOpen(false);
      setFormTitle("");
      setFormAuthor("");
      setFormTags("");
      setFormDesc("");
      setFormStatus("アイデア募集中");
    }, 1800);
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesStatus =
      selectedStatus === "すべて" || idea.status === selectedStatus;
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="アイデア宣言ボード"
        subtitle="社内AI活用のアイデア宣言・共創・コラボレーションの場"
      />
      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        {/* バナー: β版公開 */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>💡</span>
                  <span>アイデア宣言ボード（先行β版）稼働中</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  Phase 1 機能稼働
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                社内メンバーのAI活用アイデアを閲覧・起票し、「いいね」で応援できます。CoE相談室での具現化サポートも連携しています。
              </p>
            </div>
          </div>
        </div>

        {/* 投稿CTAセクション */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-800 text-base">あなたのAI活用アイデアを宣言してみませんか？</h3>
            <p className="text-xs text-slate-500 mt-1">
              「こんな業務を効率化したい」「この最新モデルを試してみたい」という宣言から仲間やCoEの支援が集まります。
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors shadow-xs"
          >
            <PlusCircle size={15} />
            <span>アイデアを宣言する</span>
          </button>
        </div>

        {/* 検索 & ステータスフィルター */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="キーワード、タグ、提案者で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-200/70 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
            {["すべて", "アイデア募集中", "検証中 (PoC)", "本番開発中"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedStatus === status
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* アイデアカード一覧 */}
        <div className="space-y-4">
          {filteredIdeas.map((idea) => {
            const statusBadgeColor =
              idea.status === "本番開発中"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : idea.status === "検証中 (PoC)"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-blue-50 text-blue-700 border-blue-200";

            return (
              <div
                key={idea.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-6 shadow-xs space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border ${statusBadgeColor}`}
                      >
                        {idea.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        提案: {idea.author}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{idea.title}</h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{idea.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3 text-slate-500">
                    <button
                      onClick={() => handleToggleLike(idea.id)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all text-xs font-semibold ${
                        idea.isLiked
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <ThumbsUp
                        size={14}
                        className={idea.isLiked ? "fill-current" : ""}
                      />
                      <span>{idea.likes}</span>
                    </button>

                    <div className="flex items-center space-x-1 text-slate-400 text-xs px-2 py-1">
                      <MessageSquare size={14} />
                      <span>{idea.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredIdeas.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
              <p className="text-sm font-semibold">該当するアイデアが見つかりませんでした。</p>
              <p className="text-xs text-slate-400">条件を変更するか、右上の「アイデアを宣言する」から新しいアイデアを投稿してください。</p>
            </div>
          )}
        </div>
      </div>

      {/* 新規アイデア投稿モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                MightyLINK AI 共創
              </span>
              <h3 className="text-lg font-bold text-slate-900">AI活用アイデアの宣言</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                業務効率化や新しいAI技術の検証アイデアを起票してください。CoEや他チームからのフィードバックが集まります。
              </p>
            </div>

            {isSubmittedSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check size={24} />
                </div>
                <h4 className="font-bold text-emerald-950 text-base">アイデアを宣言しました！</h4>
                <p className="text-xs text-emerald-800">
                  宣言ボードに即時反映されました。社内Slack（#ai-idea-board）への共有も推奨しています。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    アイデアタイトル <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 社内ドキュメント自動要約エージェントの作成"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      提案者名 / 所属チーム <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 田中 健太 / DX推進室"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">現在のステータス</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as Idea["status"])}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="アイデア募集中">アイデア募集中</option>
                      <option value="検証中 (PoC)">検証中 (PoC)</option>
                      <option value="本番開発中">本番開発中</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">タグ (カンマ区切り)</label>
                  <input
                    type="text"
                    placeholder="e.g. Gemini, 自動化, RAG, MCP"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    課題・アイデア概要 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="解決したい課題、使ってみたい技術、得られる効果などを記載してください。"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Send size={13} />
                    <span>アイデアを投稿する</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
