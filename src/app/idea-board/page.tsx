"use client";

import {
  Search,
  Plus,
  Wand2,
  ThumbsUp,
  X,
  Building,
  User,
} from "lucide-react";
import { useState } from "react";

interface Declaration {
  id: string;
  numId: number;
  title: string;
  department: string;
  authors: string[];
  dateStr: string;
  status: "進行中" | "PoC検証中" | "完成・稼働中";
  statusColor: string;
  backgroundIssue: string;
  targetAgent: string;
  tools: string[];
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
}

const initialDeclarations: Declaration[] = [
  {
    id: "#0135",
    numId: 135,
    title: "タスク自動登録エージェント",
    department: "クラウド基盤推進部",
    authors: ["鈴木 誠"],
    dateStr: "今日",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "Slackやメールで依頼されたインフラ調査やアカウント作業の起票漏れ・二重管理が発生している。",
    targetAgent: "Slackの特定リアクションやメンションを検知し、要件・期日・依頼者を抽出してJira/Backlogへ自動登録するエージェント。",
    tools: ["Gemini 1.5 Flash", "Slack Webhook", "Jira API"],
    likes: 18,
    commentsCount: 4,
  },
  {
    id: "#0134",
    numId: 134,
    title: "課題進捗自動要約・転記エージェント",
    department: "クラウド基盤推進部",
    authors: ["鈴木 誠"],
    dateStr: "今日",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "週次定例前に各案件チケットを巡回し、前週からの差分やブロッカーを手動でレポートにまとめる作業に毎週2時間を要している。",
    targetAgent: "GitHub Issues / Jira の更新差分を毎朝クロールし、重要度の高い変更点と遅延リスクを箇条書き要約してチャンネルに自動投稿する。",
    tools: ["Antigravity", "GitHub REST API", "Gemini 1.5 Pro"],
    likes: 24,
    commentsCount: 6,
  },
  {
    id: "#0133",
    numId: 133,
    title: "【基幹チーム用】工数自動入力エージェント",
    department: "基幹システム開発部",
    authors: ["小林 健太", "井上 翔"],
    dateStr: "今日",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "毎週末の社内工数システム入力が煩雑で、カレンダーやコミット履歴を見返しながら手動計算している。",
    targetAgent: "Google Calendarの会議予定とGitコミットログを自動照合し、プロジェクト別の実稼働時間を按分推計して下書き入力するエージェント。",
    tools: ["Gemini 1.5 Flash", "Google Calendar API", "Git CLI"],
    likes: 35,
    commentsCount: 9,
  },
  {
    id: "#0132",
    numId: 132,
    title: "AI一次見解ドラフト生成エージェント",
    department: "品質管理・QA部",
    authors: ["本間 俊作"],
    dateStr: "昨日",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "社内問い合わせ窓口に寄せられる技術的な質問に対し、初動回答を作成するまでの調査・回答案作成に時間がかかっている。",
    targetAgent: "問い合わせ内容から関連仕様書とFAQログをRAG検索し、担当者が送信する「一次見解（ドラフト）」を即時生成するボット。",
    tools: ["Amazon Bedrock", "Claude 3.5 Sonnet", "社内ドキュメントRAG"],
    likes: 29,
    commentsCount: 5,
  },
  {
    id: "#0131",
    numId: 131,
    title: "社内アカウント有効期限通知・更新案内",
    department: "コーポレートIT・情シス",
    authors: ["吉野 明美"],
    dateStr: "昨日",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "外部委託メンバーや検証用マルチクラウドアカウントの期限切れによる利用停止が突発的に発生している。",
    targetAgent: "有効期限30日前・14日前・3日前にSlackで利用責任者へパーソナライズ通知を送り、更新申請のワンクリックリンクを案内する。",
    tools: ["Google Workspace API", "Slack Bot", "Cloud Functions"],
    likes: 15,
    commentsCount: 2,
  },
  {
    id: "#0130",
    numId: 130,
    title: "QA担当者自動アサイン & テストマトリクス生成",
    department: "品質管理・QA部",
    authors: ["松原 英雄", "高橋 誠"],
    dateStr: "3日前",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "新規機能リリースのPRが作成された際、変更影響のあるテストケースの網羅確認と担当アサインが属人化している。",
    targetAgent: "コード変更差分（diff）から影響範囲のテストシナリオを自動抽出・提案し、担当QAエンジニアを自動メンションするエージェント。",
    tools: ["Antigravity Subagents", "GitHub Actions", "Gemini 1.5 Pro"],
    likes: 42,
    commentsCount: 11,
  },
  {
    id: "#0129",
    numId: 129,
    title: "コミットメッセージ提案・PR概要自動化エージェント",
    department: "DXソリューション部",
    authors: ["越智 拓也"],
    dateStr: "4日前",
    status: "完成・稼働中",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    backgroundIssue: "コミットメッセージやPRのDescriptionが人によってまちまちで、レビュー前の事前把握に時間がかかっていた。",
    targetAgent: "git staged の差分からConventional Commits形式のメッセージと、変更動機・影響範囲を含むPRテンプレートを1コマンドで生成。",
    tools: ["Antigravity CLI", "Gemini 2.5 Flash", "Git Hook"],
    likes: 56,
    commentsCount: 14,
  },
  {
    id: "#0128",
    numId: 128,
    title: "BIデータ自動抽出・社内レポートドラフト作成AI",
    department: "データアナリティクス部",
    authors: ["中村 陽子", "大西 裕司", "黄 翊軒"],
    dateStr: "4日前",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "事業部ごとのKPI速報値をBigQueryから抽出し、定型スライドやSlackレポートに整形する反復作業が多い。",
    targetAgent: "自然言語で「先週のMAUと部署別推移を出して」と指示すると、SQL生成・実行・チャート描画・サマリー文生成まで完結するエージェント。",
    tools: ["BigQuery", "Gemini 1.5 Pro", "Python DataFrames"],
    likes: 47,
    commentsCount: 8,
  },
  {
    id: "#0127",
    numId: 127,
    title: "社内利用AIエージェント適合度判定ツール",
    department: "DXソリューション部",
    authors: ["大島 浩司", "ジョセフ アガスティン"],
    dateStr: "4日前",
    status: "PoC検証中",
    statusColor: "bg-purple-50 text-purple-700 border-purple-200",
    backgroundIssue: "社内に多数のAIツールや自作Agentが増え、現場が「どのタスクにどれを使えば安全で最適か」判断に迷っている。",
    targetAgent: "業務要件や取り扱いデータの機密区分を入力すると、公認ツール・推奨モデル・過去のベストプラクティスをレコメンドする診断ボット。",
    tools: ["Gemini 1.5 Pro", "AI Park マトリクスAPI"],
    likes: 38,
    commentsCount: 7,
  },
  {
    id: "#0126",
    numId: 126,
    title: "障害速報・システム稼働状況まとめエージェント",
    department: "SRE・運用自動化チーム",
    authors: ["星島 結乃花"],
    dateStr: "6日前",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "システム障害発生時、DatadogやCloudWatchのアラートが複数チャンネルに乱立し、統括報告の作成に手を取られる。",
    targetAgent: "アラート通知とSlack障害対策チャンネルの発言ログを集約し、発生時刻・事象・影響範囲・暫定対処のタイムラインを自動更新する。",
    tools: ["Datadog Webhook", "Gemini 1.5 Flash", "Slack Bot"],
    likes: 31,
    commentsCount: 6,
  },
  {
    id: "#0125",
    numId: 125,
    title: "決定事項・ネクストアクション即時サマリーエージェント",
    department: "クラウド基盤推進部",
    authors: ["平野 保"],
    dateStr: "7日前",
    status: "完成・稼働中",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    backgroundIssue: "1時間のオンライン会議終了後、議事録の要点整理と決定事項の周知に時間がかかりネクストアクションの着手が遅れる。",
    targetAgent: "Google Meetの文字起こしテキストから「決定事項」「ToDo（担当者・期限）」「未決課題」を抽出し、会議終了後3分以内にチャンネル共有。",
    tools: ["Google Meet 文字起こし", "Gemini 1.5 Flash", "Google Docs"],
    likes: 64,
    commentsCount: 17,
  },
  {
    id: "#0124",
    numId: 124,
    title: "審査結果通知・定型案内メール自動作成（下書き）",
    department: "コーポレートIT・情シス",
    authors: ["大石 真希"],
    dateStr: "7日前",
    status: "進行中",
    statusColor: "bg-sky-50 text-sky-700 border-sky-200",
    backgroundIssue: "申請承認後のユーザー宛案内メールの文面作成や添付マニュアルの選定を1件ずつ手動で行っている。",
    targetAgent: "ワークフロー承認結果をトリガーに、申請者の所属や権限に応じた初期設定手順をGmail下書きに自動生成するエージェント。",
    tools: ["Gmail API", "ServiceNow Webhook", "Gemini 1.5 Flash"],
    likes: 22,
    commentsCount: 3,
  },
  {
    id: "#0123",
    numId: 123,
    title: "チャットボットによる業務マニュアル対話要約レコメンド",
    department: "カスタマーサクセス部",
    authors: ["齋藤 慎矢", "山本 雄二"],
    dateStr: "9日前",
    status: "PoC検証中",
    statusColor: "bg-purple-50 text-purple-700 border-purple-200",
    backgroundIssue: "数百ページある顧客対応マニュアルから、該当する規定や例外ルールを探し出すのに新任スタッフが苦労している。",
    targetAgent: "顧客からの問い合わせ文を貼り付けると、適用すべき規約条文と回答テンプレート、過去類似事例を即座に提示する支援ボット。",
    tools: ["Amazon Bedrock", "Knowledge Bases RAG", "Slack Bolt"],
    likes: 49,
    commentsCount: 12,
  },
];

const departmentsList = [
  "すべて",
  "クラウド基盤推進部",
  "DXソリューション部",
  "基幹システム開発部",
  "品質管理・QA部",
  "データアナリティクス部",
  "コーポレートIT・情シス",
  "SRE・運用自動化チーム",
  "カスタマーサクセス部",
];

export default function IdeaBoardPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>(initialDeclarations);
  const [activeTab, setActiveTab] = useState<"list" | "dashboard" | "report" | "rules" | "guide">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState("すべて");

  const [selectedDecl, setSelectedDecl] = useState<Declaration | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [forkSourceId, setForkSourceId] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState(departmentsList[1]);
  const [formAuthor, setFormAuthor] = useState("");
  const [formBackground, setFormBackground] = useState("");
  const [formTargetAgent, setFormTargetAgent] = useState("");
  const [formTools, setFormTools] = useState("");

  const filteredDeclarations = declarations.filter((d) => {
    const matchesSearch =
      searchQuery === "" ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.backgroundIssue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetAgent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === "すべて" || d.department === selectedDept;

    const matchesStatus =
      selectedStatus === "すべて" ||
      (selectedStatus === "進行中" && d.status === "進行中") ||
      (selectedStatus === "PoC検証中" && d.status === "PoC検証中") ||
      (selectedStatus === "完成・稼働中" && d.status === "完成・稼働中");

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleToggleLike = (id: string) => {
    setDeclarations((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const isLiked = !d.isLiked;
          return {
            ...d,
            isLiked,
            likes: isLiked ? d.likes + 1 : d.likes - 1,
          };
        }
        return d;
      })
    );
    if (selectedDecl && selectedDecl.id === id) {
      setSelectedDecl((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likes: !prev.isLiked ? prev.likes + 1 : prev.likes - 1,
            }
          : null
      );
    }
  };

  const handleCreateDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAuthor || !formBackground) return;

    const newNum = declarations.length + 121;
    const newId = `#0${newNum}`;
    const newEntry: Declaration = {
      id: newId,
      numId: newNum,
      title: formTitle,
      department: formDept,
      authors: [formAuthor],
      dateStr: "今日",
      status: "進行中",
      statusColor: "bg-sky-50 text-sky-700 border-sky-200",
      backgroundIssue: formBackground,
      targetAgent: formTargetAgent || "詳細設計中",
      tools: formTools ? formTools.split(",").map((s) => s.trim()) : ["Gemini 1.5 Pro"],
      likes: 1,
      commentsCount: 0,
      isLiked: true,
    };

    setDeclarations([newEntry, ...declarations]);
    setIsNewModalOpen(false);
    setIsForkModalOpen(false);
    resetForm();
    alert(`🎉 宣言「${newId}: ${formTitle}」を登録しました！社内ポータルで共有されました。`);
  };

  const handleOpenForkModal = (baseDecl?: Declaration) => {
    const target = baseDecl || declarations[0];
    setForkSourceId(target.id);
    setFormTitle(`【${target.department.slice(0, 4)}向けアレンジ】${target.title}`);
    setFormBackground(`（ベース宣言: ${target.id}「${target.title}」を参考に自部署向けにカスタマイズ）\n${target.backgroundIssue}`);
    setFormTargetAgent(target.targetAgent);
    setFormTools(target.tools.join(", "));
    setIsForkModalOpen(true);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormAuthor("");
    setFormBackground("");
    setFormTargetAgent("");
    setFormTools("");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 1. 専用ダークネイビー・ヘッダーバー */}
      <div className="bg-[#111827] text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl sm:text-3xl">🚀</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                <span>アイデア宣言ボード</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  β版運用中
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                社内のAIエージェント開発・自動化アイデアの事前宣言 & チーム横断コラボレーション台帳
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => {
                resetForm();
                setIsNewModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ 新規宣言</span>
            </button>
            <button
              onClick={() => handleOpenForkModal()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">🪄 既存の宣言をベースにして宣言</span>
              <span className="sm:hidden">🪄 ベース宣言</span>
            </button>
          </div>
        </div>

        {/* 2. サブタブナビゲーション */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-4 border-t border-slate-800/80 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("list")}
            className={`py-3 px-3 font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "list"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            宣言一覧 ({declarations.length})
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-3 px-3 font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            ダッシュボード 📊
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`py-3 px-3 font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "report"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            エージェント完成報告 🔗
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`py-3 px-3 font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "rules"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            ルールブック 🔗
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`py-3 px-3 font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "guide"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            投稿手順書 🔗
          </button>
        </div>
      </div>

      {/* 3. メインコンテンツエリア */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* タブ1: 宣言一覧 */}
        {activeTab === "list" && (
          <div className="space-y-4">
            {/* 3軸フィルタ・検索バー */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="テーマで検索... (例: タスク自動登録, 障害要約, 議事録)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="w-full md:w-56 shrink-0">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="すべて">部門を選択してください (全{departmentsList.length - 1}部門)</option>
                  {departmentsList.slice(1).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-44 shrink-0">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="すべて">すべてのステータス</option>
                  <option value="進行中">進行中</option>
                  <option value="PoC検証中">PoC検証中</option>
                  <option value="完成・稼働中">完成・稼働中</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                該当案件: <strong className="text-slate-800 font-bold">{filteredDeclarations.length}</strong> 件
                （全 {declarations.length} 件中）
              </span>
              <span className="text-[11px] text-slate-400">
                ※行をクリックすると背景課題・構成詳細・応援コメントを閲覧できます
              </span>
            </div>

            {/* データテーブル */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 font-bold tracking-wider">
                      <th className="py-3 px-4 w-20">ID</th>
                      <th className="py-3 px-4">
                        テーマ <span className="text-[10px] text-blue-600 font-normal">▶ クリックで詳細</span>
                      </th>
                      <th className="py-3 px-4 w-44">部門</th>
                      <th className="py-3 px-4 w-36">宣言者</th>
                      <th className="py-3 px-4 w-24">宣言日</th>
                      <th className="py-3 px-4 w-28 text-center">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredDeclarations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          検索条件に一致する宣言は見つかりませんでした。
                        </td>
                      </tr>
                    ) : (
                      filteredDeclarations.map((d) => (
                        <tr
                          key={d.id}
                          onClick={() => setSelectedDecl(d)}
                          className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500 font-semibold">
                            {d.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center space-x-2">
                              <span>{d.title}</span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1.5 text-[11px] text-slate-400 font-normal">
                                <span className="flex items-center">
                                  <ThumbsUp className="w-3 h-3 mr-0.5 text-amber-500" />
                                  {d.likes}
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                              {d.backgroundIssue}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-[11px]">
                              {d.department}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                            {d.authors.join(", ")}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                            {d.dateStr}
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${d.statusColor}`}
                            >
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* タブ2: ダッシュボード */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold">累計宣言数</span>
                <p className="text-3xl font-black text-slate-900 mt-1">135 <span className="text-xs text-emerald-600 font-bold">+12件 (今月)</span></p>
                <p className="text-[11px] text-slate-400 mt-2">全社12部門からの開発エントリー</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold">進行中・PoC検証中</span>
                <p className="text-3xl font-black text-blue-600 mt-1">94 <span className="text-xs text-slate-500 font-normal">案件</span></p>
                <p className="text-[11px] text-slate-400 mt-2">平均開発サイクル: 約2.5週間</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold">完成・本番稼働率</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">41 <span className="text-xs text-slate-500 font-normal">案件 (30.3%)</span></p>
                <p className="text-[11px] text-slate-400 mt-2">全社共通ツールへの昇格: 8件</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold">推計月間削減工数</span>
                <p className="text-3xl font-black text-purple-600 mt-1">1,280 <span className="text-xs text-slate-500 font-normal">時間/月</span></p>
                <p className="text-[11px] text-slate-400 mt-2">定例レポート・起票の自動化が最多</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">部門別アイデア宣言エントリー状況</h3>
              <div className="space-y-3">
                {[
                  { name: "クラウド基盤推進部", count: 32, pct: "85%" },
                  { name: "DXソリューション部", count: 28, pct: "75%" },
                  { name: "品質管理・QA部", count: 22, pct: "60%" },
                  { name: "基幹システム開発部", count: 19, pct: "52%" },
                  { name: "データアナリティクス部", count: 16, pct: "44%" },
                  { name: "コーポレートIT・情シス", count: 12, pct: "32%" },
                  { name: "SRE・運用自動化チーム", count: 6, pct: "18%" },
                ].map((dept, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{dept.name}</span>
                      <span className="text-slate-900 font-bold">{dept.count} 件</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: dept.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* タブ3: エージェント完成報告 */}
        {activeTab === "report" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">🎉 エージェント完成報告フロー</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                アイデア宣言したエージェントが完成し、実際に業務で稼働を開始した際は、こちらの完成報告を行ってください。CoEによるセキュリティ確認後、「AI Agent Case」や社内カタログへの公式登録、全社表彰の対象となります。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-blue-600 font-mono">STEP 1</span>
                <h4 className="font-bold text-sm text-slate-800">ステータス変更</h4>
                <p className="text-xs text-slate-500">
                  自身の宣言チケットを「完成・稼働中」にステータス変更し、実際に得られた工数削減効果を入力します。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-blue-600 font-mono">STEP 2</span>
                <h4 className="font-bold text-sm text-slate-800">AI CoE 簡易レビュー</h4>
                <p className="text-xs text-slate-500">
                  個人情報・機密データの取り扱いおよびAPIキーの安全な管理（Secret Manager等）を確認します。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-blue-600 font-mono">STEP 3</span>
                <h4 className="font-bold text-sm text-slate-800">全社カタログ掲載</h4>
                <p className="text-xs text-slate-500">
                  「Subagents活用事例」や「AI Tool Hub」に掲載され、社内インタビュー取材の案内が届きます。
                </p>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => alert("エージェント完成報告フォーム（社内ワークフロー）へ遷移します。")}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                完成報告フォームを開く ↗
              </button>
            </div>
          </div>
        )}

        {/* タブ4: ルールブック */}
        {activeTab === "rules" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">📖 アイデア宣言ボード ルールブック</h3>
              <p className="text-xs text-slate-500">
                本ボードは、全社で自律型AIエージェントの開発をオープンに推進するための社内専用コミュニティです。
              </p>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900">1. アイデアの重複は恐れなくてOK</h4>
                <p className="text-slate-600 text-xs">
                  「似たようなアイデアが既にあるかも」と遠慮する必要はありません。自部署ならではのユースケースや「既存の宣言をベースにして宣言」機能を使った派生開発を歓迎します。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900">2. 機密情報・顧客個人情報の非記載ルール</h4>
                <p className="text-slate-600 text-xs">
                  宣言文および背景課題には、具体的な顧客企業名、エンドユーザーの個人情報、未公開案件コードネームを直接記載せず、一般化した業務名で記載してください。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900">3. 宣言したからといって「必ず作らなければならない」義務はありません</h4>
                <p className="text-slate-600 text-xs">
                  「こんなのあったらいいな」という構想段階の宣言でも十分価値があります。他のエンジニアが「それ自分も欲しかったので作ります！」と手を挙げてくれることもあります。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* タブ5: 投稿手順書 */}
        {activeTab === "guide" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">📝 宣言の投稿手順マニュアル</h3>
              <p className="text-xs text-slate-500">
                わずか2分で起票できる、効果的なアイデア宣言のフォーマットと書き方ガイド
              </p>
            </div>
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">「+ 新規宣言」ボタンをクリック</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    画面右上の青い「+ 新規宣言」または右下のフローティングボタンを押します。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">「テーマ（何をするエージェントか）」を命名</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    「〇〇自動要約エージェント」「〇〇起票ボット」など、目的が端的に伝わる名前にします。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">「現場の課題」をありのままに書く</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    技術的な解決策よりも「誰が・どんな作業で・どのくらい時間を取られているか」を書くことが、協力者やメンターを集めるコツです。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      {selectedDecl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="space-y-1.5 pr-6">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedDecl.id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${selectedDecl.statusColor}`}
                  >
                    {selectedDecl.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    宣言日: {selectedDecl.dateStr}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  {selectedDecl.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDecl(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-700">
              <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center space-x-1.5 text-xs">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">部門:</span>
                  <span className="font-bold text-slate-900">{selectedDecl.department}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">宣言者:</span>
                  <span className="font-bold text-slate-900">{selectedDecl.authors.join(", ")}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>解決したい現場の課題・背景</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed text-slate-800">
                  {selectedDecl.backgroundIssue}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>目指すエージェント像・自動化ワークフロー</span>
                </h4>
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 leading-relaxed text-slate-800">
                  {selectedDecl.targetAgent}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900">使用予定のLLM / 連携ツール</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDecl.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleToggleLike(selectedDecl.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                    selectedDecl.isLiked
                      ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${selectedDecl.isLiked ? "fill-amber-500 text-amber-500" : ""}`} />
                  <span>応援する・いいね ({selectedDecl.likes})</span>
                </button>
                <span className="text-xs text-slate-400">
                  💬 コメント {selectedDecl.commentsCount} 件
                </span>
              </div>

              <button
                onClick={() => {
                  const base = selectedDecl;
                  setSelectedDecl(null);
                  handleOpenForkModal(base);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>この宣言をベースにして宣言する</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新規宣言モーダル */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-lg font-black text-slate-900">新規アイデア宣言</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeclaration} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">
                  宣言テーマ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: タスク自動登録エージェント"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">
                    所属部門 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                  >
                    {departmentsList.slice(1).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">
                    宣言者名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: 山田 太郎 (チーム連名可)"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">
                  解決したい課題・背景 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="どんな業務で・誰が困っているか、現状の課題を具体的に記入してください。"
                  value={formBackground}
                  onChange={(e) => setFormBackground(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">目指すエージェント像（任意）</label>
                <textarea
                  rows={2}
                  placeholder="どんな入力を受け取り、どんなアウトプットを自動生成するか"
                  value={formTargetAgent}
                  onChange={(e) => setFormTargetAgent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">想定ツール・LLM（カンマ区切り）</label>
                <input
                  type="text"
                  placeholder="例: Gemini 1.5 Pro, Slack Bot, Antigravity"
                  value={formTools}
                  onChange={(e) => setFormTools(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition-all cursor-pointer"
                >
                  宣言を起票する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 既存宣言ベース（フォーク）モーダル */}
      {isForkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">
                  既存の宣言をベースにして宣言 (フォーク起票)
                </h3>
              </div>
              <button
                onClick={() => setIsForkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeclaration} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center space-x-2">
                <span>💡</span>
                <span>
                  先行する他部署の宣言構成を引き継ぎ、自分の部門・チーム用にアレンジして派生宣言を作成できます。
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">ベースにする宣言</label>
                <select
                  value={forkSourceId}
                  onChange={(e) => {
                    const target = declarations.find((d) => d.id === e.target.value);
                    if (target) {
                      setForkSourceId(target.id);
                      setFormTitle(`【${target.department.slice(0, 4)}向けアレンジ】${target.title}`);
                      setFormBackground(`（ベース宣言: ${target.id}「${target.title}」を参考に自部署向けにカスタマイズ）\n${target.backgroundIssue}`);
                      setFormTargetAgent(target.targetAgent);
                      setFormTools(target.tools.join(", "));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden font-mono text-xs"
                >
                  {declarations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} - {d.title} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">
                  アレンジ後のテーマ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">
                    あなたの所属部門 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                  >
                    {departmentsList.slice(1).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">
                    宣言者名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: 佐藤 恵美"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-900">自部署での課題・適用したい背景</label>
                <textarea
                  required
                  rows={3}
                  value={formBackground}
                  onChange={(e) => setFormBackground(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsForkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>派生宣言を登録する</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 右下フローティングアクションボタン (FAB) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            resetForm();
            setIsNewModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer group"
          title="新規宣言を作成"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
