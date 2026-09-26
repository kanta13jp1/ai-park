"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquarePlus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Search,
  Tag,
  User,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  Send,
  Building,
  Check,
  ChevronRight,
  HelpCircle,
  Calendar,
  CircleDot,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  GITHUB_REPO,
  FEEDBACK_LABEL,
  IN_PROGRESS_LABEL,
  buildNewIssueUrl,
  fetchFeedbackIssues,
} from "@/lib/githubFeedback";

export interface FeedbackTodoItem {
  id: string;
  title: string;
  category: "UI/UX" | "AI導入編" | "AI初級編" | "AI実践編" | "ガイドライン" | "企画・懸賞" | "開発環境" | "アカウント運用";
  author: string;
  authorDept: string;
  date: string;
  priority: "高" | "中" | "低";
  status: "todo" | "in_progress" | "done";
  feedbackQuote: string;
  actionPlan: string;
  relatedLink?: string;
  relatedLinkText?: string;
  issueNumber?: number; // GitHub Issue から同期された項目
  issueUrl?: string;
}

const initialFeedbackList: FeedbackTodoItem[] = [
  {
    id: "TODO-01",
    title: "初学者が迷子にならない「シンプル導入3ステップ導線」の新設",
    category: "UI/UX",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "高",
    status: "done",
    feedbackQuote: "「社内ポータルであればもっとシンプルなほうが良いかなと思いました。いざ使ってみようとなったときに情報量多すぎて迷子になりそうな気がしました・・・」",
    actionPlan: "【反映済み】トップページ最上部に「導入編」「初級編」「実践編」の3ステップカードを配置し、初めての社員でも迷わず始められる導線を実装しました。",
    relatedLink: "/",
    relatedLinkText: "トップページのシンプル導線を見る",
  },
  {
    id: "TODO-02",
    title: "【AI導入編】Antigravity導入とIDE日本語設定などの手順書",
    category: "AI導入編",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "高",
    status: "done",
    feedbackQuote: "「コンテンツとしてはこのくらいでどうでしょう：・AI導入編 ⇒ antigravityの導入とIDEの日本語設定などの手順」",
    actionPlan: "【反映済み】導入ガイドを公式ドキュメント準拠で全面改訂。動作環境・インストール・サインイン・日本語化（言語パック／表示言語／AI回答の日本語化の3設定）・CLI導入を掲載しました。",
    relatedLink: "/guide",
    relatedLinkText: "導入ガイド（改訂版）を見る",
  },
  {
    id: "TODO-03",
    title: "【AI初級編】「ここ見てやってみて」と言えるAntigravity使い方・基本手順書",
    category: "AI初級編",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "高",
    status: "done",
    feedbackQuote: "「最初の導入だけ手順とガイドラインなどを作って人が増えた場合は「ここ見てやってみて」って言える情報があればよいかなと」",
    actionPlan: "【反映済み】「頼み方の4点セット」「ファイル編集を任せるときの流れ」「エラー時の対処」を1枚にまとめたAI初級編チートシートを学習ページ先頭に掲載しました。",
    relatedLink: "/learning",
    relatedLinkText: "初級編チートシートを見る",
  },
  {
    id: "TODO-04",
    title: "【AI実践編】AIに聞いてもわからない「社内のAI関連プロジェクト状況」の一覧化",
    category: "AI実践編",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "高",
    status: "done",
    feedbackQuote: "「・AI実践編 ⇒ 社内のAI関連プロジェクトの状況。あとはAIに聞いてもわからない社内の状況とかがあればよいかなと思った次第です」",
    actionPlan: "【反映済み】「社内AIプロジェクト一覧」ページを新設。各部署がGitHub Issueのフォームから登録すると一覧に自動掲載され、Google Chatにも通知されます。状況（検討中／PoC中／本番運用中／終了）は登録者がIssueを編集して更新します。",
    relatedLink: "/ai-projects",
    relatedLinkText: "社内AIプロジェクト一覧を見る",
  },
  {
    id: "TODO-05",
    title: "【注意事項】社内AI利用時の注意事項・セキュリティガイドラインの明文化",
    category: "ガイドライン",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "高",
    status: "in_progress",
    feedbackQuote: "「社内のAI時の注意事項もあったほうが良いですね」",
    actionPlan: "【ドラフト掲載】入力先の選び方・マスキング・出力確認・責任範囲・事前相談の「社内AI利用の注意事項5箇条（案）」を掲載し、早見表の記載も実態に合わせて修正しました。社内承認後に正式版へ移行します。",
    relatedLink: "/tools-hub#ai-guidelines",
    relatedLinkText: "注意事項5箇条（案）を見る",
  },
  {
    id: "TODO-06",
    title: "【企画・共創】社内のAIを使ったビジネスモデル提案コンテスト（懸賞企画）",
    category: "企画・懸賞",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "中",
    status: "in_progress",
    feedbackQuote: "「・社内のAIを使ったビジネスモデルの提案(懸賞とかあったらいいな)」",
    actionPlan: "【企画案を掲載】アイデア宣言ボードに「社内AIビジネスモデル提案コンテスト（企画案）」を掲載し、目的・対象・審査の観点（案）を公開しました。開催期間・賞品・審査員・応募方法（社内フォーム）は社内決裁後に確定します。",
    relatedLink: "/idea-board",
    relatedLinkText: "コンテスト企画案を見る",
  },
  {
    id: "TODO-07",
    title: "【開発環境】今後のGit利用を見据えたGit/GitHub連携ガイドの追加",
    category: "開発環境",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "中",
    status: "done",
    feedbackQuote: "「あー、あとは今後Gitを使うとすると、そのあたりの情報も追加ですかね」",
    actionPlan: "【反映済み】導入ガイドに「Git / GitHubとの付き合い方」を追加。ブランチ運用、AIの変更を差分で確認する流れ、変更の取り消し方を掲載しました。",
    relatedLink: "/guide",
    relatedLinkText: "Git連携の手順を見る",
  },
  {
    id: "TODO-08",
    title: "【アカウント運用】Google Workspace環境とProプラン（個人アカウント）の利用整理",
    category: "アカウント運用",
    author: "小林雅水 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "中",
    status: "done",
    feedbackQuote: "「調べて行ったら、個人アカウントのgoogleからしかProプランには加入できないようです。会社側でWorkspaceを使用して加入はできないと書いてありました」",
    actionPlan: "【反映済み】お問い合わせページに「アカウント・ライセンス」FAQを追加。Google AI ProはWorkspaceアカウントでは加入できないこと、Antigravityは個人アカウント向けでチーム利用はGemini Enterprise経由であることを公式情報の出典付きで掲載しました。業務利用は会社のGoogle Cloudプロジェクト経由（従量課金・個人Pro加入不要）を標準とし、300ドルの無料トライアルクレジットの扱いもFAQに追記しました。",
    relatedLink: "/contact",
    relatedLinkText: "アカウントFAQを見る",
  },
];

const seedIds = new Set(initialFeedbackList.map((t) => t.id));

export default function FeedbackTodoPage() {
  const [todos, setTodos] = useState<FeedbackTodoItem[]>(initialFeedbackList);
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in_progress" | "done">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // GitHub Issue 同期
  const [githubItems, setGithubItems] = useState<FeedbackTodoItem[]>([]);
  const [syncState, setSyncState] = useState<"loading" | "ok" | "error">("loading");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // 新規登録フォーム用State
  const [formAuthor, setFormAuthor] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<FeedbackTodoItem["category"]>("UI/UX");
  const [formPriority, setFormPriority] = useState<FeedbackTodoItem["priority"]>("高");
  const [formQuote, setFormQuote] = useState("");
  const [formActionPlan, setFormActionPlan] = useState("");

  // LocalStorage の読み込み
  useEffect(() => {
    const saved = localStorage.getItem("mightylink_feedback_todos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 運営登録のToDo（TODO-xx）は常にコード側の最新内容を使い、ブラウザ保存分は利用者の起票のみ採用
          const userItems = parsed.filter((t: FeedbackTodoItem) => !seedIds.has(t.id));
          setTodos([...userItems, ...initialFeedbackList]);
        }
      } catch (e) {
        console.error("Failed to load feedback todos", e);
      }
    }
  }, []);

  const loadGithubIssues = (signal?: AbortSignal) =>
    fetchFeedbackIssues(signal).then(
      (items) => {
        setGithubItems(items);
        setSyncState("ok");
        setLastSyncedAt(new Date());
      },
      (e) => {
        if (signal?.aborted) return;
        console.error("Failed to sync GitHub issues", e);
        setSyncState("error");
      }
    );

  const syncGithubIssues = () => {
    setSyncState("loading");
    loadGithubIssues();
  };

  useEffect(() => {
    const controller = new AbortController();
    loadGithubIssues(controller.signal);
    return () => controller.abort();
  }, []);

  const allItems = [...githubItems, ...todos];

  // 保存処理
  const saveTodos = (newTodos: FeedbackTodoItem[]) => {
    setTodos(newTodos);
    localStorage.setItem("mightylink_feedback_todos", JSON.stringify(newTodos));
  };

  // ステータス変更
  const handleStatusChange = (id: string, newStatus: FeedbackTodoItem["status"]) => {
    const updated = todos.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveTodos(updated);
  };

  // 新規投稿
  const handleCreateTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAuthor.trim()) return;

    // 「GitHub Issueとして起票」: Issue フォームへプリフィルして遷移（公開後ボードへ自動同期）
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (submitter?.value === "github") {
      const url = buildNewIssueUrl({
        title: formTitle,
        author: formAuthor,
        dept: formDept,
        quote: formQuote,
        actionPlan: formActionPlan,
      });
      window.open(url, "_blank", "noopener,noreferrer");
      setIsModalOpen(false);
      return;
    }

    const newId = `MY-${String(todos.filter((t) => !seedIds.has(t.id)).length + 1).padStart(2, "0")}`;
    const today = new Date();
    const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

    const newItem: FeedbackTodoItem = {
      id: newId,
      title: formTitle,
      category: formCategory,
      author: `${formAuthor} さん`,
      authorDept: formDept || "社内",
      date: dateStr,
      priority: formPriority,
      status: "todo",
      feedbackQuote: formQuote ? `「${formQuote}」` : "（チャット・口頭でのご意見）",
      actionPlan: formActionPlan || "対応方針を検討・反映予定",
    };

    saveTodos([newItem, ...todos]);
    setIsModalOpen(false);

    // フォームリセット
    setFormTitle("");
    setFormAuthor("");
    setFormDept("");
    setFormQuote("");
    setFormActionPlan("");
  };

  // CSVエクスポート
  const handleExportCsv = () => {
    const header = ["ID", "タイトル", "カテゴリ", "起票者", "所属", "起票日", "優先度", "ステータス", "ご意見原文", "対応方針"];
    const rows = allItems.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.author,
      t.authorDept,
      t.date,
      t.priority,
      t.status === "done" ? "完了" : t.status === "in_progress" ? "対応中" : "検討中",
      `"${t.feedbackQuote.replace(/"/g, '""')}"`,
      `"${t.actionPlan.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ai_park_feedback_todos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // フィルタリング
  const filteredTodos = allItems.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.feedbackQuote.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const todoCount = allItems.filter((t) => t.status === "todo").length;
  const inProgressCount = allItems.filter((t) => t.status === "in_progress").length;
  const doneCount = allItems.filter((t) => t.status === "done").length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* ページヘッダー */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <MessageSquarePlus size={14} />
                <span>みんなのフィードバックからつくるAI広場</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ご意見・改善ToDoボード
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Google Chatや勉強会、日常の雑談でいただいた社員のみなさまからのご意見・改善要望をToDoとして蓄積し、
                優先順位をつけてポータルへ随時反映していくバックログ管理システムです。
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download size={15} />
                <span>CSV出力</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center space-x-1.5 transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer"
              >
                <Plus size={16} />
                <span>ご意見を起票する</span>
              </button>
            </div>
          </div>

          {/* 4大KPI統計 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <span className="text-xs text-slate-400 block font-medium">蓄積されたご意見</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {allItems.length} <span className="text-xs font-normal text-slate-400">件</span>
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <span className="text-xs text-amber-300 block font-medium">📥 検討中・ToDo</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 block">
                {todoCount} <span className="text-xs font-normal text-slate-400">件</span>
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <span className="text-xs text-sky-300 block font-medium">🚧 対応中 / 進行中</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1 block">
                {inProgressCount} <span className="text-xs font-normal text-slate-400">件</span>
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <span className="text-xs text-emerald-300 block font-medium">✅ 反映済み・完了</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 block">
                {doneCount} <span className="text-xs font-normal text-slate-400">件</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* メインエリア */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* フィルター＆検索ツールバー */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          {/* ステータス切り替えピル */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              すべて ({allItems.length})
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "in_progress"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🚧 対応中 ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter("todo")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "todo"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📥 検討中 ({todoCount})
            </button>
            <button
              onClick={() => setStatusFilter("done")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "done"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ✅ 反映済み ({doneCount})
            </button>
          </div>

          {/* 検索ボックス */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ご意見やキーワードで検索..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* GitHub Issue 同期ステータス */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs text-xs">
          <div className="flex items-center gap-2 text-slate-600 flex-wrap">
            <CircleDot size={15} className="text-slate-800 shrink-0" />
            <span className="font-bold text-slate-800">GitHub Issue 連携</span>
            {syncState === "loading" && <span className="text-slate-500">同期中...</span>}
            {syncState === "ok" && (
              <span className="text-emerald-700">
                ✅ {githubItems.length} 件を同期
                {lastSyncedAt && `（${lastSyncedAt.toLocaleTimeString("ja-JP")}）`}
              </span>
            )}
            {syncState === "error" && (
              <span className="text-rose-600">
                ⚠️ 同期に失敗しました（ブラウザ保存分のみ表示中）
              </span>
            )}
            <span className="text-slate-400">
              ラベル「{FEEDBACK_LABEL}」付き Issue を自動掲載 / 「{IN_PROGRESS_LABEL}」で対応中・Closeで完了
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://github.com/${GITHUB_REPO}/issues?q=label%3A${FEEDBACK_LABEL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Issue一覧
              <ExternalLink size={12} />
            </a>
            <button
              onClick={() => syncGithubIssues()}
              disabled={syncState === "loading"}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-white font-bold disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={12} className={syncState === "loading" ? "animate-spin" : ""} />
              再同期
            </button>
          </div>
        </div>

        {/* ToDoカード一覧 */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <AlertCircle size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                該当するご意見・ToDoは見つかりませんでした
              </p>
              <p className="text-xs text-slate-400">
                検索条件を変更するか、右上の「ご意見を起票する」から新しく追加してください。
              </p>
            </div>
          ) : (
            filteredTodos.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 space-y-4"
              >
                {/* カード上部：タグ、ID、ステータス */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                    {item.issueUrl ? (
                      <a
                        href={item.issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded"
                      >
                        <CircleDot size={12} />#{item.issueNumber}
                      </a>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        item.priority === "高"
                          ? "bg-rose-100 text-rose-700"
                          : item.priority === "中"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      優先度: {item.priority}
                    </span>
                  </div>

                  {/* ステータスセレクター（GitHub同期項目・運営登録項目は表示のみ） */}
                  {item.issueUrl || seedIds.has(item.id) ? (
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-bold border ${
                          item.status === "done"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : item.status === "in_progress"
                            ? "bg-sky-100 text-sky-800 border-sky-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {item.status === "done" ? "✅ 完了" : item.status === "in_progress" ? "🚧 対応中" : "📥 検討中"}
                      </span>
                      {item.issueUrl && (
                        <a
                          href={item.issueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1 rounded-md font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 inline-flex items-center gap-1"
                        >
                          GitHubで更新
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  ) : (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleStatusChange(item.id, "todo")}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        item.status === "todo"
                          ? "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      📥 検討中
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, "in_progress")}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        item.status === "in_progress"
                          ? "bg-sky-100 text-sky-800 border border-sky-300 font-bold"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      🚧 対応中
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, "done")}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        item.status === "done"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      ✅ 完了
                    </button>
                  </div>
                  )}
                </div>

                {/* カードタイトル */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* いただいたご意見の原文 */}
                <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold flex items-center space-x-1 text-slate-700">
                      <User size={13} className="text-indigo-600" />
                      <span>{item.author} ({item.authorDept}) からのご意見</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    {item.feedbackQuote}
                  </p>
                </div>

                {/* ポータルでの対応方針・実装状況 */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" />
                    ポータルでの対応方針・進捗
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5 border-l-2 border-indigo-200">
                    {item.actionPlan}
                  </p>
                </div>

                {/* 関連リンク（実装済み・対応中の場合） */}
                {item.relatedLink && (
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={item.relatedLink}
                      className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>{item.relatedLinkText || "関連ページを確認"}</span>
                      <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 新規ご意見起票モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <MessageSquarePlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    新しいご意見・改善ToDoを起票
                  </h3>
                  <p className="text-xs text-slate-500">
                    チャットや会議でいただいた意見を登録してタスク化します
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTodo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    お名前 / 起票元 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="例: 亮一杉村"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    所属部署 / チーム
                  </label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    placeholder="例: クラウド開発部"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    カテゴリ
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="UI/UX">UI/UX・導線改善</option>
                    <option value="AI導入編">AI導入編・セットアップ</option>
                    <option value="AI初級編">AI初級編・操作手順書</option>
                    <option value="AI実践編">AI実践編・社内プロジェクト</option>
                    <option value="ガイドライン">注意事項・セキュリティ</option>
                    <option value="企画・懸賞">企画・ビジネスモデル懸賞</option>
                    <option value="開発環境">開発環境・Git連携</option>
                    <option value="アカウント運用">アカウント運用・ライセンス</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    優先度
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="高">高 (早急に反映)</option>
                    <option value="中">中 (次回スプリント)</option>
                    <option value="低">低 (検討・順次対応)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  ToDoタスク名（対応テーマ） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="例: 【AI導入編】Antigravityの初期セットアップ動画の追加"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  いただいたご意見の原文・引用メモ
                </label>
                <textarea
                  rows={3}
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="チャットでいただいたコメントをそのまま貼り付けて蓄積できます"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  ポータルでの対応方針・アクションプラン
                </label>
                <textarea
                  rows={2}
                  value={formActionPlan}
                  onChange={(e) => setFormActionPlan(e.target.value)}
                  placeholder="具体的にポータルのどこにどのようなコンテンツを追加・改修するか"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <p className="text-slate-500 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                「GitHub Issueとして起票」を押すと入力内容がプリフィルされたIssueフォームが開きます。
                Issue作成後はこのボードへ自動掲載され、Google Chatにも通知されます。
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  value="local"
                  title="このブラウザにのみ保存されます（他のメンバーには共有されません）"
                  className="px-4 py-2 rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-bold flex items-center space-x-1.5"
                >
                  <Send size={14} />
                  <span>ブラウザに一時保存</span>
                </button>
                <button
                  type="submit"
                  value="github"
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <CircleDot size={14} />
                  <span>GitHub Issueとして起票（全員に共有）</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
