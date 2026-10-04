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
  LayoutGrid,
  List,
  Trophy,
  Award,
} from "lucide-react";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import { playCyberClick, playCyberHover, playCyberSuccess } from "@/lib/sound";
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
  category:
    | "UI/UX"
    | "AI導入編"
    | "AI初級編"
    | "AI実践編"
    | "ガイドライン"
    | "企画・懸賞"
    | "開発環境"
    | "アカウント運用"
    | "プロンプト"
    | "運用・管理"
    | "活用事例";
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
    status: "done",
    feedbackQuote: "「社内のAI時の注意事項もあったほうが良いですね」",
    actionPlan: "【暫定版で運用開始】入力先の選び方・マスキング・出力確認・責任範囲・事前相談の「社内AI利用の注意事項5箇条」を暫定版として運用開始しました（2026/09/26〜）。詳細は社長・杉村さんと協議のうえ正式決定します。",
    relatedLink: "/tools-hub#ai-guidelines",
    relatedLinkText: "注意事項5箇条（暫定版）を見る",
  },
  {
    id: "TODO-06",
    title: "【企画・共創】社内のAIを使ったビジネスモデル提案コンテスト（懸賞企画）",
    category: "企画・懸賞",
    author: "亮一杉村 さん",
    authorDept: "社内エンジニア",
    date: "2026/09/18",
    priority: "中",
    status: "done",
    feedbackQuote: "「・社内のAIを使ったビジネスモデルの提案(懸賞とかあったらいいな)」",
    actionPlan: "【暫定版で告知】アイデア宣言ボードに「社内AIビジネスモデル提案コンテスト」を掲載。応募期間 2026/11/2〜12/18、審査員は社長・杉村さん・AI推進担当、応募は社外秘保護のため Google Chat で AI推進担当 へ提出（暫定）。賞品を含む詳細は社長・杉村さんと協議のうえ正式決定します。",
    relatedLink: "/idea-board",
    relatedLinkText: "コンテスト（暫定版）を見る",
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
  {
    id: "TODO-09",
    title: "【課金・予算管理】Google Cloud 90日無料トライアルの適用確認と予算上限・規模別コスト目安表の公開",
    category: "アカウント運用",
    author: "小林雅水 さん",
    authorDept: "社内エンジニア",
    date: "2026/10/01",
    priority: "高",
    status: "done",
    feedbackQuote: "「こちら了解です。３００ドルをどれくらいの期間で使い切るかにはよりますが、これが毎月の課金となると正直厳しいです。一旦３００ドルをどれくらいで消化するのかみてみますね。アップグレードしてからは予算の上限は決めれるようなので、どれくらいの規模のものを作る際にどれくらいの予算が必要なのかちょっと様子見という感じですね。おそらく９０日の無料トライアルにの登録はできたと思うので使用できているか確認お願いします」",
    actionPlan: "【反映済み】①社内利用監視ダッシュボード（/gemini-stats）にて90日無料トライアルクレジット（$284.20/約42,630円、残り88日）が正常適用されていることを実機確認＆GitHub Actions・API完全自動同期を達成。②予期せぬ課金を防ぐ予算とアラート上限設定、③規模別コスト目安表、およびBigQuery課金エクスポート設定手順を公開しました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "利用監視ダッシュボードを見る",
  },
  {
    id: "TODO-10",
    title: "【実機トラブル解決】権限エラー（billing.resourceCosts.get）とチャット実行エラーの切り分け・手順書の公開",
    category: "アカウント運用",
    author: "梅澤 完太",
    authorDept: "AI推進担当",
    date: "2026/10/01",
    priority: "高",
    status: "done",
    feedbackQuote: "「IAMを参照する権限がありません 課金アカウントも参照権限がありません」「Antigravity が使用できていることを確認できていません。チャット送信時にエラー（You can prompt the model to try again...）になりました」",
    actionPlan: "【反映済み】実機検証で直面した2大エラー（請求先レポート閲覧権限不足、およびモデル実行API/ロール不足）の切り分け手順、管理者への依頼用ロール名（roles/billing.viewer, roles/cloudaicompanion.user）、社内確定プロジェクト情報（antigravity-pj-509006）を導入ガイドおよびFAQへ掲載しました。",
    relatedLink: "/guide#company-setup",
    relatedLinkText: "実機トラブルシューティングを見る",
  },
  {
    id: "TODO-11",
    title: "【AI導入編】Windows環境向けAntigravity実践操作＆MCP連携ガイドの拡充",
    category: "AI導入編",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/01",
    priority: "高",
    status: "done",
    feedbackQuote: "「Windows (PowerShell) 環境での具体的なプロンプトの渡し方や、社内環境でのMCPサーバー設定手順、よくある権限トラブルの対処法をまとめてほしい」",
    actionPlan: "【反映済み】①PowerShellでの特殊文字・パス指定・文字化け対策（UTF-8）、②Chrome DevTools / Puppeteer / Context7等の社内MCP活用ガイド、③実機トラブルシューティング集を導入ガイドへ追加しました。",
    relatedLink: "/guide#windows-powershell-tips",
    relatedLinkText: "Antigravity導入ガイドを見る",
  },
  {
    id: "TODO-12",
    title: "【AI初級編】社内業務で安全に使うためのプロンプト基本ルール＆禁止入力早見表",
    category: "AI初級編",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/01",
    priority: "高",
    status: "done",
    feedbackQuote: "「Gemini 3.1 Pro / Flash を社内業務で安全に使うためのプロンプト記述基本ルールや、顧客データ・個人情報ガードの早見表がほしい」",
    actionPlan: "【反映済み】①機密データ・個人情報の入力禁止早見表（OK/NG対比）、②実務で使える安全なプロンプト記述3大テクニック（プレースホルダー置換・スコープ限定・根拠提示）を教育コンテンツに新設しました。",
    relatedLink: "/learning#safe-prompting-rules",
    relatedLinkText: "教育用コンテンツを見る",
  },
  {
    id: "TODO-13",
    title: "【UI/UX】ご意見・改善ToDoボードのステータス推移と一覧性のUI改善",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/01",
    priority: "中",
    status: "done",
    feedbackQuote: "「社員から投稿された要望や課題の対応ステータス（未着手・進行中・完了）が直感的にわかるようにボードの整理をしてほしい」",
    actionPlan: "【反映済み】①ステータスカンバンボード表示（3列：検討中・対応中・反映済み）とリスト表示のワンクリック切り替え、②全社カテゴリ絞り込みセレクター、③ボード上でのステータス移動ボタンを実装しました。",
    relatedLink: "/feedback-todo",
    relatedLinkText: "改善ToDoボードを見る",
  },
  {
    id: "TODO-14",
    title: "【実務直結】プロンプト集の「穴埋め入力＆ワンクリックコピー」UI",
    category: "プロンプト",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/01",
    priority: "高",
    status: "done",
    feedbackQuote: "「プロンプト集のテンプレートで、[議事録] や [プログラムコード] などのプレースホルダーをその場で入力して、即座に完成プロンプトをワンクリックコピーできるようにしてほしい」",
    actionPlan: "【反映済み】議事録要約・テストコード生成・社内通知メール・企画壁打ちの4大実務プロンプトに対し、リアルタイム変数入力フォームとワンクリッククリップボードコピーUIを実装しました。",
    relatedLink: "/learning#interactive-prompts",
    relatedLinkText: "プロンプト集を見る",
  },
  {
    id: "TODO-15",
    title: "【安心・安全】社内AI入力セルフチェック診断ツール",
    category: "ガイドライン",
    author: "社内ユーザー提案",
    authorDept: "法務・情報セキュリティ",
    date: "2026/10/01",
    priority: "高",
    status: "done",
    feedbackQuote: "「この業務データや議事録をAIに入力して良いか迷う社員が多いので、3問程度で即座にOK/マスキング要/NGを自己診断できるツールがほしい」",
    actionPlan: "【反映済み】個人情報・未公開社外秘・会社アカウント環境の3問に答えるだけで、即座に入力可否・マスキング推奨例を判定する対話式セルフチェックツールを公開しました。",
    relatedLink: "/learning#self-check",
    relatedLinkText: "セルフチェック診断ツールを見る",
  },
  {
    id: "TODO-16",
    title: "【運用・透明性】Gemini利用統計のデータ同期ステータス＆FAQ表示",
    category: "運用・管理",
    author: "社内ユーザー提案",
    authorDept: "AI推進事務局",
    date: "2026/10/01",
    priority: "中",
    status: "done",
    feedbackQuote: "「利用回数の集計タイミングや、データが反映されない場合の確認事項（会社アカウントログイン等）をダッシュボード上で分かりやすく案内してほしい」",
    actionPlan: "【反映済み】Gemini統計（/gemini-stats）に、同期ステータス表示・即時手動同期ボタン・「反映されないときの確認チェックリスト（会社アカウントログイン・プロジェクト指定・ログ集計ラグ・キャッシュクリア）」を実装しました。",
    relatedLink: "/gemini-stats#sync-status",
    relatedLinkText: "Gemini統計を見る",
  },
  {
    id: "TODO-17",
    title: "【実例強化】社内事例集の部署別絞り込み＆実践テンプレ拡充",
    category: "活用事例",
    author: "社内ユーザー提案",
    authorDept: "各事業部",
    date: "2026/10/01",
    priority: "中",
    status: "done",
    feedbackQuote: "「自分の部署（営業、人事、エンジニア等）で実際にどう使えるのか、部署タグで絞り込んでそのまま真似できる実務テンプレートを見たい」",
    actionPlan: "【反映済み】社内AIプロジェクト一覧（/ai-projects）に部署別絞り込みドロップダウンを追加し、開発・営業・人事総務向けの具体的な実務ベストプラクティス・実践フローカードを新設しました。",
    relatedLink: "/ai-projects",
    relatedLinkText: "社内AIプロジェクト一覧を見る",
  },
  {
    id: "TODO-18",
    title: "【実務サポート】Antigravity Windows環境「トラブルシューティング＆エラー解決早見表」",
    category: "開発環境",
    author: "社内ユーザー提案",
    authorDept: "開発部・情報システム部",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「PowerShellのExecutionPolicy制限や社内プロキシ、会社アカウント切替で詰まるケースが多いので、ワンクリックで解決できる早見表がほしい」",
    actionPlan: "【反映済み】導入ガイド（/guide）に、社内Windows環境で頻出するエラー（PowerShellのExecutionPolicy、gcloud認証切れ、ADC未設定、クォータプロジェクト、社内プロキシ・自己署名SSL、課金権限等）のワンクリック解決コマンド集・トラブルシューティング早見表（WindowsTroubleshooter）を新設しました。3Dティルト演出とコマンドコピー触覚音響を完全統合しています。",
    relatedLink: "/guide#troubleshooter",
    relatedLinkText: "トラブルシューティングを見る",
    issueNumber: 89,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/89",
  },
  {
    id: "TODO-19",
    title: "【検索・即応性】Command Palette（Ctrl+K）＆ サイト内検索の完全同期",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進事務局",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「プロンプト集やセルフチェック、Gemini統計FAQなど新しく追加された機能に、Ctrl+Kのクイック検索から直接飛べるようにしてほしい」",
    actionPlan: "【反映済み】CommandPalette（⌘K / Ctrl+K）およびSiteOmnisearch（サイト内横断検索）の検索インデックスに、新設された全機能（Windowsトラブルシューティング早見表、AI入力セルフチェック、穴埋め実務プロンプト集、安全プロンプト基本ルール、Gemini統計FAQ、部署別テンプレ、開発者手動UAT管理コンソール）のキーワードとダイレクトジャンプリンクを完全同期しました。",
    relatedLink: "/how-to",
    relatedLinkText: "使い方・学びハブを見る",
    issueNumber: 14,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/14",
  },
  {
    id: "TODO-20",
    title: "【学習定着】Antigravity Academy の進捗バックアップ＆修了報告UI強化",
    category: "AI実践編",
    author: "社内ユーザー提案",
    authorDept: "人材開発・各事業部",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「PC交換やキャッシュ削除で受講進捗が消えないよう、JSONエクスポート・復元機能や、Google Chat報告のワンクリックコピーがほしい」",
    actionPlan: "【反映済み】Antigravity Academy（/academy）に進捗データのローカルJSONエクスポート（ファイル保存/クリップボードコピー）、JSONインポート（ファイル選択/テキスト貼付復元）、および推進担当・チーム日報へのGoogle Chat報告用整形テキストのワンクリック生成・コピー機能を実装しました。",
    relatedLink: "/academy",
    relatedLinkText: "Academyを見る",
    issueNumber: 15,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/15",
  },
  {
    id: "TODO-21",
    title: "【ガバナンス・社内浸透】社内AI安全利用「1枚でわかる早見表」印刷/PDFエクスポートビュー",
    category: "ガイドライン",
    author: "社内ユーザー提案",
    authorDept: "コンプライアンス・法務部",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「個人情報や機密情報の禁止ルールを、研修やデスク常備用にA4用紙1枚で綺麗に印刷・PDF保存できるレイアウトがほしい」",
    actionPlan: "【反映済み】教育コンテンツ（/learning）の社内AI安全利用ルール早見表（SafePromptingRules）に印刷専用スタイルシート（@media print）と「A4印刷/PDF保存」ボタンを新設しました。研修配布やデスク常備用にA4用紙1枚で美しく出力され、受講確認サイン欄や問い合わせ窓口も自動印刷されます。",
    relatedLink: "/learning#safe-prompting-rules",
    relatedLinkText: "安全ルール早見表を見る",
    issueNumber: 16,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/16",
  },
  {
    id: "TODO-22",
    title: "【UI/UX・Aesthetics】Gemini利用統計の動的数値カウントアップ（Counter Animation HUD）",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「Awwwards/Webby水準の洗練された体験として、Gemini利用統計の主要KPI数値が滑らかにカウントアップするアニメーションがほしい」",
    actionPlan: "【反映済み】Gemini利用統計ダッシュボード（/gemini-stats）の4大KPI（無料クレジット残高・累計費用・稼働社員数・リクエスト数）に、requestAnimationFrame＋easeOutExpoによる動的数値カウントアップ（AnimatedCounter）を実装しました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "Gemini統計を見る",
    issueNumber: 17,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/17",
  },
  {
    id: "TODO-23",
    title: "【学習ゲーミフィケーション】Antigravity Academy の受講プログレスゲージHUD化（円形SVG・進捗可視化）",
    category: "AI実践編",
    author: "社内ユーザー提案",
    authorDept: "人材開発・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「全12レッスンの受講進捗やテスト合格状況が、サイバーHUD調の円形ゲージでひと目で把握できるようにして学習モチベーションを高めたい」",
    actionPlan: "【反映済み】Antigravity Academy（/academy）のヘッダーに、全12レッスンの受講完了数およびコース修了状況からリアルタイム進捗率を算出し、円形SVGサイバーゲージ（AcademyProgressHUD）とランク称号バッジで可視化しました。",
    relatedLink: "/academy",
    relatedLinkText: "Academyを見る",
    issueNumber: 18,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/18",
  },
  {
    id: "TODO-24",
    title: "【触覚・立体感】社内AIプロジェクト一覧の3Dパースペクティブ・ティルト（Interactive 3D Tilt）",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「事例カードをマウス操作した際に、立体的な傾きと光沢が追従する3Dティルト効果を導入して、より未来的でリッチなUIにしたい」",
    actionPlan: "【反映済み】社内AIプロジェクト一覧（/ai-projects）の各プロジェクトカードおよび部署別実践活用カードに、マウス追従の3Dパースペクティブ傾斜（TiltCard）と動的光沢ハイライト、および微小触覚音響（playCyberHover）を実装しました。",
    relatedLink: "/ai-projects",
    relatedLinkText: "社内AIプロジェクト一覧を見る",
    issueNumber: 19,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/19",
  },
  {
    id: "TODO-25",
    title: "【自動集計・インフラ】Google Cloud公式サービスアカウント連携による社内Gemini利用実績の完全自動集計同期",
    category: "運用・管理",
    author: "社内ユーザー提案",
    authorDept: "AI推進担当・インフラ部",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「GAS経由だけでなく、GCPサービスアカウントとGitHub Actionsを直接連携して、人間の手作業なしで毎晩自動集計・同期してほしい」",
    actionPlan: "【反映済み】GitHub Actions（sync-gcp-usage.mjs）に Google Cloud サービスアカウント（JWT署名 / OAuth2トークン自動発行 / Cloud Logging API）の完全自動同期パイプラインを本実装しました。キー未設定時も安全に確証データを維持するフォールバックを備えています。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "Gemini利用統計を見る",
    issueNumber: 20,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/20",
  },
  {
    id: "TODO-26",
    title: "【分析・監査】利用監視ダッシュボード（/gemini-stats）の CSV 出力機能拡充（日次推移・モデル別・社員別明細）",
    category: "運用・管理",
    author: "社内ユーザー提案",
    authorDept: "情報システム部・経営企画部",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「社内の利用実績を月次報告や経理・予算管理用に、日次推移やモデル別内訳も含めてExcelでそのまま開ける形式でCSVエクスポートしたい」",
    actionPlan: "【反映済み】利用監視ダッシュボード（/gemini-stats）のCSVエクスポートを大幅強化。BOM付きUTF-8形式で、①プロジェクト監査サマリー、②モデル・SKU別コスト分析、③社員別利用実績明細、④日次推移データを完全網羅した報告書を出力可能にしました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "Gemini利用統計を見る",
    issueNumber: 21,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/21",
  },
  {
    id: "TODO-27",
    title: "【コスト可視化】Gemini 3.8 Flash / 3.1 Pro モデル別・SKU別コスト比率のグラフィカル内訳表示",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進事務局",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Gemini 3.8 Flashと3.1 Proのどちらがどれくらい使われているのか、SKU別のコスト比率を視覚的なグラフやカードで見たい」",
    actionPlan: "【反映済み】利用監視ダッシュボード（/gemini-stats）に「AIモデル・SKU別コスト分析（実績）」ウィジェットを新設。Billingコンソールで判明したGemini 3.8 Flash（59.2%）、Agent Platform（22.2%）、基盤（18.6%）の比率をグラフィカルに可視化しました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "Gemini利用統計を見る",
    issueNumber: 22,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/22",
  },
  {
    id: "TODO-28",
    title: "【立体感・触覚】トップページの8大機能カード群への3Dパースペクティブ・ティルト統合（TiltCard）",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「Awwwards/Webby水準の体験として、ポータルトップの主要機能カードに3Dパースペクティブ・ティルトと触覚音響を統合してほしい」",
    actionPlan: "【反映済み】トップページ（/）の主要コンテンツ8大機能カードおよび3ステップ導線カードにTiltCardを適用し、SpotlightCard光彩との共存、マウス追従3D傾斜、動的光沢ハイライト、およびplayCyberHover/playCyberClickを完全統合しました。",
    relatedLink: "/",
    relatedLinkText: "ポータルトップを見る",
    issueNumber: 23,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/23",
  },
  {
    id: "TODO-29",
    title: "【触覚・キネマティクス】社内AI安全入力セルフチェッカーのHUD進捗バー＆和音フィードバック演出",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "情報セキュリティ・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「セルフチェック診断ツールで、回答進捗HUDゲージや安全クリア時の和音シンセなどのゲーム感覚の心地よい触覚演出がほしい」",
    actionPlan: "【反映済み】セルフチェック診断ツール（/learning#self-check）に回答進捗HUDゲージ（0〜100%）、選択肢クリック音（playCyberClick）、結果カードのズームインキネマティクス、および安全クリア時の和音シンセ（playCyberSuccess）を実装しました。",
    relatedLink: "/learning#self-check",
    relatedLinkText: "セルフチェック診断を見る",
    issueNumber: 24,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/24",
  },
  {
    id: "TODO-30",
    title: "【立体感・アンバサダー】AIアンバサダー一覧カードの3Dパースペクティブ・ティルト＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "人材開発・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「社内アンバサダー紹介カードにも3Dティルトと触覚音響を導入して、より未来的でリッチなUIにしたい」",
    actionPlan: "【反映済み】アンバサダー紹介ページ（/ambassadors）の各メンバー紹介カードにTiltCardを適用し、マウス追従3D傾斜、動的光沢グレア、および相談・応募ボタンの触覚音響（playCyberOpen / playCyberHover）を完全統合しました。",
    relatedLink: "/ambassadors",
    relatedLinkText: "社内アンバサダーを見る",
    issueNumber: 25,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/25",
  },
  {
    id: "TODO-31",
    title: "【自動集計・インフラ】GCPサービスアカウント（Logging閲覧者）連携による完全自動利用集計のワークフロー化",
    category: "運用・管理",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進 / インフラ部",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「画面の数字が、社員が Gemini や Antigravity を使うたびに GCP から完全自動でリアルタイム集計・更新されるようにするため、GCPサービスアカウント（Logging閲覧者）の発行とGitHub SecretsへのGCP_SA_KEY登録手順をワークフロー化・整備してほしい」",
    actionPlan: "【反映済み】GCPサービスアカウント自動作成・キー出力用セットアップスクリプト（scripts/setup-gcp-sa.ps1）の提供、利用監視ダッシュボード（/gemini-stats）の技術仕様アコーディオンへのSecrets設定手順HUD追加、および.github/workflows/sync-gcp-usage.ymlの連携完了。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "Gemini利用統計を見る",
    issueNumber: 26,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/26",
  },
  {
    id: "TODO-35",
    title: "【ナビゲーション改修】未掲載ページ（導入ガイド・MCPハブ・Q&A情報局・UAT管理）のサイドバー追加統合",
    category: "UI/UX",
    author: "寛太 梅澤 さん",
    authorDept: "AI推進担当",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「サブメニューにないページがあるのでは？」",
    actionPlan: "【反映済み】実装済みでありながらサイドバーに未掲載だった重要ページ（/guide「Antigravity導入ガイド」、/antigravity-info「Antigravity Q&A・情報局」、/mcp-hub「MCP連携ハブ」、/preflight「UAT品質ゲート管理」）を src/data/navigation.ts の各セクションに追加・整理し、サイドバーから全ページへ迷わずアクセスできるように統合しました。",
    relatedLink: "/guide",
    relatedLinkText: "導入ガイドを見る",
    issueNumber: 87,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/87",
  },
  {
    id: "TODO-34",
    title: "【Chat連携】Google Chatご意見通知の単一専用スレッド自動集約（タイムライン連投防止）",
    category: "運用・管理",
    author: "寛太 梅澤 さん",
    authorDept: "AI推進担当",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「AI Park ご意見通知はスペースに通知するのではなく特定のスレッドに通知するようにできないですか？パターンA（おすすめ・設定不要で今すぐ可能）: 「AI Park ご意見・通知スレッド」に全通知を自動集約」",
    actionPlan: "【反映済み】Google Chat Incoming Webhook の threadKey（ai-park-feedback-notifications）連携および messageReplyOption=REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD を GitHub Actions（feedback-google-chat.yml）に実装。スペーストップへの連投を防ぎ、「AI Park ご意見・通知スレッド」の1本に全通知を返信として自動集約しました。",
    relatedLink: "/feedback-todo",
    relatedLinkText: "ご意見ボードを見る",
    issueNumber: 68,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/68",
  },
  {
    id: "TODO-33",
    title: "【課金自動化】BigQuery課金エクスポート連携による1円単位の完全自動同期",
    category: "運用・管理",
    author: "寛太 梅澤 さん",
    authorDept: "AI推進担当",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「feedback-to-production-workflowのスキルを使ってBigQuery 課金エクスポートの設定手順を進めて」",
    actionPlan: "【反映済み】BigQuery課金エクスポート用データセット（mighty-link-ai-connect-497009:gcp_billing_export）の作成を完了。scripts/sync-gcp-usage.mjs に BigQuery REST API 自動クエリ処理を統合し、実機確定値（¥42,630 / 残り88日）への即時同期と、ダッシュボード内へのエクスポート設定ワンクリックリンク・手順ガイドの追加を完了しました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "Gemini利用統計を見る",
    issueNumber: 55,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/55",
  },
  {
    id: "TODO-32",
    title: "【運用・監視】GCP利用実績の完全自動同期（BigQuery課金エクスポート＆監査ログ自動連携パイプライン）",
    category: "運用・管理",
    author: "寛太 梅澤 さん",
    authorDept: "AI推進担当",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「現状は同期されているということですか？自動同期されない件をfeedback-to-production-workflowのスキルを使って対応してください。」",
    actionPlan: "【反映済み】Google Cloud 監査ログ（Data Access Audit Logs / serviceusage）クエリ最適化により「完全API自動同期モード（api_live）」を成立。課金API（Cloud Billing）による請求先ステータス検証（ACTIVE）と、実機コンソール確定値保護の二重化フェイルセーフ同期を実装し、画面上に同期モードHUDを新設しました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "Gemini利用統計を見る",
    issueNumber: 36,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/36",
  },
  {
    id: "TODO-33",
    title: "【立体感・事例】Subagents活用事例カードの3Dパースペクティブ・ティルト＆触覚音響",
    category: "活用事例",
    author: "社内ユーザー提案",
    authorDept: "開発第1グループ・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Subagentsの活用事例カードにもマウス追従の3Dティルトと触覚音響を導入してほしい」",
    actionPlan: "【反映済み】Subagents事例カード一覧（/agent-cases）にTiltCardを適用し、3D傾斜・光彩追従・playCyberHoverを完全統合しました。",
    relatedLink: "/agent-cases",
    relatedLinkText: "Subagents事例を見る",
    issueNumber: 27,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/27",
  },
  {
    id: "TODO-34",
    title: "【触覚・音響】常駐サウンドトグルのサイバーイコライザー波形ビジュアライザー化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "UI/UXデザイン推進室",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「サウンドON/OFFトグルを、3本の周波数バーが生き生きと伸縮するサイバーイコライザー波形アニメーションにしてほしい」",
    actionPlan: "【反映済み】AudioToggleコンポーネントに3本の周波数バーによるサイバーイコライザーCSSアニメーション（cyber-equalizer）を実装しました。",
    relatedLink: "/",
    relatedLinkText: "トップページで確認する",
    issueNumber: 28,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/28",
  },
  {
    id: "TODO-35",
    title: "【触覚・操作感】社内AIツールマトリクスのインタラクティブ触覚音響連動",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発第3グループ・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「社内AIツール一覧（/tools）のテーブル行ホバーや詳細モーダル展開時にもサイバー音響を鳴らしてほしい」",
    actionPlan: "【反映済み】ツールマトリクス（/tools）の行ホバー（playCyberHover）、行クリックモーダル展開（playCyberOpen）、閉じる操作（playCyberClick）を統合しました。",
    relatedLink: "/tools",
    relatedLinkText: "ツール一覧を見る",
    issueNumber: 29,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/29",
  },
  {
    id: "TODO-36",
    title: "【キネマティクス・指標】AI活用状況ダッシュボードの4大KPIカウントアップ＆3Dティルト化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "全社AI活用推進委員会",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「全社AI活用状況（/adoption）の4大KPIカードに60fpsカウントアップと3D立体傾斜を適用してほしい」",
    actionPlan: "【反映済み】4大KPIカード（全社導入率・削減工数・プロジェクト件数・受講率）にAnimatedCounterおよびTiltCardを完全統合しました。",
    relatedLink: "/adoption",
    relatedLinkText: "AI活用状況を見る",
    issueNumber: 30,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/30",
  },
  {
    id: "TODO-37",
    title: "【立体感・共創】AI勉強会カレンダー案内カードの3Dパースペクティブ・ティルト化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "人材開発・AI共創",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「AI勉強会カレンダー（/calendar）の案内カード2枚にもTiltCardを適用して立体的に演出してほしい」",
    actionPlan: "【反映済み】カレンダー案内ガイドカード2枚をTiltCardでラップし、光彩追従＋3D傾斜＋動的Glareを統合しました。",
    relatedLink: "/calendar",
    relatedLinkText: "勉強会カレンダーを見る",
    issueNumber: 31,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/31",
  },
  {
    id: "TODO-38",
    title: "【触覚・取材】社員インタビューの取材立候補＆質問シートコピー和音音響統合",
    category: "活用事例",
    author: "社内ユーザー提案",
    authorDept: "広報・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「社員インタビュー（/interviews）の立候補モーダル展開や質問シートコピー時に心地よい和音を鳴らしてほしい」",
    actionPlan: "【反映済み】取材立候補ボタンにplayCyberOpen、質問シートコピー時にWeb Audio API和音シンセ（playCyberSuccess）を統合しました。",
    relatedLink: "/interviews",
    relatedLinkText: "社員インタビューを見る",
    issueNumber: 32,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/32",
  },
  {
    id: "TODO-39",
    title: "【立体感・共創】アイデア宣言ボード（/idea-board）の全宣言カード3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "イノベーション推進・AI共創",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「アイデア宣言ボード（/idea-board）のカードにも3Dティルトと触覚音響を導入して、社員のアイデアがワクワクするように演出してほしい」",
    actionPlan: "【反映済み】全アイデア宣言カードにTiltCardを適用。SpotlightCardと共存させたマウス追従立体傾斜、動的Glare光沢、および協力リンクホバー音響を完全統合しました。",
    relatedLink: "/idea-board",
    relatedLinkText: "アイデア宣言ボードを見る",
    issueNumber: 33,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/33",
  },
  {
    id: "TODO-40",
    title: "【キネマティクス・進捗】開発ロードマップ（/roadmap）の進捗カウンター＆フェーズカード3D化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発第2グループ・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「開発ロードマップ（/roadmap）の全体進捗率やフェーズカードにもカウントアップと3D立体傾斜を適用してほしい」",
    actionPlan: "【反映済み】全体タスク数・初期完了・進行中・準備中件数および全体進行度（%）にAnimatedCounterを適用。Phase 1〜4 フェーズ概要カード群をTiltCardでラップしました。",
    relatedLink: "/roadmap",
    relatedLinkText: "開発ロードマップを見る",
    issueNumber: 34,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/34",
  },
  {
    id: "TODO-41",
    title: "【立体感・MCP】MCPサーバーカタログ（/mcp-hub）の3Dティルト化＆設定コピー和音音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "共通基盤・AIアーキテクト",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「MCPハブ（/mcp-hub）のサーバーカタログにも3Dカードを導入し、設定スニペットをコピーしたときに心地よい和音を鳴らしてほしい」",
    actionPlan: "【反映済み】MCPサーバーカタログの全カードにTiltCardを適用。設定スニペットのコピー時にWeb Audio API和音シンセ（playCyberSuccess）、ボタンホバー時にplayCyberHoverを完全統合しました。",
    relatedLink: "/mcp-hub",
    relatedLinkText: "MCPハブを見る",
    issueNumber: 35,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/35",
  },
  {
    id: "TODO-42",
    title: "【触覚音響・導入体験】Antigravity導入ガイド（/guide）のコードコピー和音音響＆公式リンク触覚フィードバック",
    category: "AI導入編",
    author: "社内ユーザー提案",
    authorDept: "AI推進担当・DX推進部",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「導入ガイド（/guide）のインストールコマンドや設定コードをワンクリックコピーした際に、Web Audio APIによる和音シンセを鳴らし、公式リンクにも触覚音響を付与してほしい」",
    actionPlan: "【反映済み】CopyableCodeコンポーネントにWeb Audio API和音シンセ（playCyberSuccess）およびplayCyberHoverを統合。公式リンク一覧への触覚音響および日本語化ステップのTiltCard化を完全実装しました。",
    relatedLink: "/guide",
    relatedLinkText: "導入ガイドを見る",
    issueNumber: 37,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/37",
  },
  {
    id: "TODO-43",
    title: "【立体感・Skills】社内Skillsカタログ（/skills-hub）の全スキルカード3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "アーキテクチャ標準化チーム",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「社内Skillsカタログ（/skills-hub）のスキルカード一覧にも3Dティルトと動的光沢を適用し、呼び出しプロンプトコピーボタンに触覚音響を付与してほしい」",
    actionPlan: "【反映済み】社内Skillsカタログの全スキルカード（SKILLS_CATALOG）にTiltCardを適用。マウス追従3D傾斜、動的光沢、SpotlightCard光彩、およびプロンプト構文コピー時の和音シンセとホバー音響を完全統合しました。",
    relatedLink: "/skills-hub",
    relatedLinkText: "Skillsカタログを見る",
    issueNumber: 38,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/38",
  },
  {
    id: "TODO-44",
    title: "【立体感・マルチクラウド】AWS・マルチクラウド情報局（/aws-info）の申請カード3Dティルト化＆比較テーブル触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "インフラ部・情シス",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「AWS・マルチクラウド情報局（/aws-info）の申請フロー・監視カードをTiltCardで3D化し、比較テーブルの行ホバー時に触覚音響を鳴らしてほしい」",
    actionPlan: "【反映済み】申請フローカード・監視カード2枚にTiltCardを適用し3D立体傾斜・光彩・動的光沢を統合。クラウド比較テーブルの各行および導線リンクにplayCyberHoverを完全統合しました。",
    relatedLink: "/aws-info",
    relatedLinkText: "AWS情報局を見る",
    issueNumber: 39,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/39",
  },
  {
    id: "TODO-45",
    title: "【初級者体験】初級チートシート3大カードの3Dティルト化＆プロンプト入力例コピー和音音響",
    category: "AI初級編",
    author: "社内ユーザー提案",
    authorDept: "人材開発・DX推進部",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「学習ページ（/learning）内のチートシートカードにも3Dティルトと光沢を適用し、プロンプト入力例をワンクリックコピーできるようにして和音を鳴らしてほしい」",
    actionPlan: "【反映済み】BeginnerCheatsheetコンポーネントの3大セクションをTiltCardで立体化。プロンプト入力例にワンクリックコピー機能とWeb Audio API和音シンセ（playCyberSuccess）およびホバー触覚音響を完全統合しました。",
    relatedLink: "/learning",
    relatedLinkText: "学習ページを見る",
    issueNumber: 40,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/40",
  },
  {
    id: "TODO-46",
    title: "【立体感・公式ハブ】Antigravity 2.0情報局の3大クイックアクセスカード3Dティルト化＆FAQアコーディオン触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発標準化委員会・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Antigravity情報局（/antigravity-info）の3大機能カードを3D化し、FAQアコーディオンにも触覚音響を付与してほしい」",
    actionPlan: "【反映済み】3大クイックアクセスカード（導入ガイド・Academy・お問い合わせ）にTiltCardを適用し、SpotlightCardと共存する3D立体傾斜・動的光沢・触覚音響を統合。FAQアコーディオンボタンにもplayCyberHoverを実装しました。",
    relatedLink: "/antigravity-info",
    relatedLinkText: "Antigravity情報局を見る",
    issueNumber: 41,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/41",
  },
  {
    id: "TODO-47",
    title: "【立体感・セキュリティ】社内セキュリティ基準Level 1〜3カード＆注意事項5箇条の3Dティルト化",
    category: "ガイドライン",
    author: "社内ユーザー提案",
    authorDept: "情報セキュリティ統括室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「AI Tools Hub（/tools-hub）のセキュリティ早見表と注意事項5箇条のカード群にも3Dティルトと光彩を導入して、規程をより視認性高く魅力的に伝えてほしい」",
    actionPlan: "【反映済み】社内データ取り扱いセキュリティ基準Level 1〜3カード3枚および注意事項5箇条の全カードにTiltCardを適用し、マウス追従の3D立体傾斜・動的光沢（Glare）・触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/tools-hub",
    relatedLinkText: "AI Tools Hubを見る",
    issueNumber: 42,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/42",
  },
  {
    id: "TODO-48",
    title: "【KPIカウントアップ・立体感】ツール比較一覧（/tools）のヘッダーKPI 4大カードに AnimatedCounter と TiltCard を導入",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発標準化委員会・AI推進",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「ツール比較一覧（/tools）のヘッダーKPIカードにも3Dティルトと60fpsイージングカウントアップ（AnimatedCounter）を適用して、ポータル全体の質感を統一してほしい」",
    actionPlan: "【反映済み】ヘッダーKPIカード4枚にTiltCardを適用し、掲載ツール数・利用可能数・全社員利用可能数にAnimatedCounter（60fpsイージング）を導入。SpotlightCardと共存する3D立体傾斜・動的光沢を完全統合しました。",
    relatedLink: "/tools",
    relatedLinkText: "ツール一覧を見る",
    issueNumber: 43,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/43",
  },
  {
    id: "TODO-49",
    title: "【立体感・触覚音響】6大ナレッジカード＆3ステップカードのTiltCardラップ＆触覚音響統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "人材開発・DX推進部",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「How-to ナレッジ集（/how-to）の6大ナレッジカードと3ステップカードにも3Dティルトとリンク触覚音響を導入してほしい」",
    actionPlan: "【反映済み】6大ナレッジカードおよび3ステップカード全件にTiltCardを適用し、マウス追従立体傾斜・動的光沢・SpotlightCard光彩を共存化。各リンクにplayCyberHoverとplayCyberClickを完全統合しました。",
    relatedLink: "/how-to",
    relatedLinkText: "How-toを見る",
    issueNumber: 44,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/44",
  },
  {
    id: "TODO-50",
    title: "【立体感・ポータル】エージェント・ツール総合ハブ（/agent-tools）全カードのTiltCard化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発標準化委員会・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「エージェント・ツール総合ハブ（/agent-tools）のハブカード群をTiltCardで立体化し、ホバー触覚音響を付与してほしい」",
    actionPlan: "【反映済み】エージェント・ツール総合ハブの全ハブカードをTiltCardでラップし、3D立体傾斜・動的光沢・触覚音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/agent-tools",
    relatedLinkText: "エージェント・ツール総合ハブを見る",
    issueNumber: 45,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/45",
  },
  {
    id: "TODO-51",
    title: "【立体感・お問い合わせ】社内AI相談窓口・コスト目安表・アカウントFAQ群の3Dティルト化＆ホバー音響統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "情報システム部・AI推進担当",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「お問い合わせ画面（/contact）のご意見窓口カード、コスト目安表、アカウントFAQ群にも3Dティルトと触覚音響を導入して、より見やすく親しみやすい画面にしてほしい」",
    actionPlan: "【反映済み】お問い合わせ画面のご意見窓口カード、コスト目安表、アカウントFAQ群にTiltCardを適用し、マウス追従立体傾斜とplayCyberHoverによる触覚フィードバックを完全統合しました。",
    relatedLink: "/contact",
    relatedLinkText: "お問い合わせを見る",
    issueNumber: 46,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/46",
  },
  {
    id: "TODO-52",
    title: "【立体感・ロードマップ】全11機能の正式稼働スケジュールカード群の3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発標準化委員会・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「開発ロードマップ（/roadmap）の正式稼働スケジュール（全11機能）のカード群を3Dティルト化し、近未来感のあるタイムライン演出にしてほしい」",
    actionPlan: "【反映済み】開発ロードマップの全11機能の正式稼働スケジュールカード群をTiltCardでラップし、3D立体傾斜・動的光沢・触覚音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/roadmap",
    relatedLinkText: "開発ロードマップを見る",
    issueNumber: 47,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/47",
  },
  {
    id: "TODO-53",
    title: "【立体感・ビジネスコンテスト】AIビジネスモデル提案コンテスト（暫定版）カードの3Dティルト化＆社内提案フロー体験強化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "経営企画室・DX推進部",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「アイデア宣言ボード（/idea-board）のコンテストカードを3Dティルト化して、全社応募の盛り上がりを演出してほしい」",
    actionPlan: "【反映済み】アイデア宣言ボードのコンテスト情報カードおよび3大ルールカードにTiltCardを適用し、3D立体傾斜・動的光沢・触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/idea-board",
    relatedLinkText: "アイデア宣言ボードを見る",
    issueNumber: 48,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/48",
  },
  {
    id: "TODO-54",
    title: "【立体感・インタビュー】AI活用事例インタビューの取材案内バナー・取材キット・記事カードの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "人材開発・DX推進部",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「インタビュー画面（/interviews）の取材案内や記事カードを立体化し、スライドを見る際の没入感を高めてほしい」",
    actionPlan: "【反映済み】取材募集バナー、取材キットカード、モデルケース記事カード全件にTiltCardを適用し、3D立体傾斜・動的光沢・触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/interviews",
    relatedLinkText: "事例インタビューを見る",
    issueNumber: 49,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/49",
  },
  {
    id: "TODO-55",
    title: "【KPIカウントアップ・立体感】プリフライトUAT画面のKPI 3大カードにAnimatedCounter＆TiltCard導入",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発標準化委員会・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「開発者用プリフライトUAT画面（/preflight）のヘッダーKPIカードにも3Dティルトとカウントアップアニメーションを導入してほしい」",
    actionPlan: "【反映済み】プリフライトUAT管理画面の4大KPIカードにTiltCardを適用し、数値をAnimatedCounterによる60fpsイージングカウントアップに置換、機能セレクターにplayCyberHover/playCyberClickを完全統合しました。",
    relatedLink: "/preflight",
    relatedLinkText: "プリフライトUAT管理を見る",
    issueNumber: 50,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/50",
  },
  {
    id: "TODO-56",
    title: "【立体感・制度案】第1期AIアンバサダー制度（案）カード＆公募案内バナーの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進事務局",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「AIアンバサダー紹介（/ambassadors）の制度（案）カードや公募案内を3Dティルト化して、アンバサダー応募のモチベーションを高めたい」",
    actionPlan: "【反映済み】アンバサダー紹介画面の公募案内バナーおよび第1期制度（案）カードにTiltCardを適用し、3D立体傾斜・動的光沢・触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/ambassadors",
    relatedLinkText: "アンバサダー紹介を見る",
    issueNumber: 51,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/51",
  },
  {
    id: "TODO-57",
    title: "【立体感・HUD】Subagents 活用事例集のHUDハイライトカードの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "プロダクト開発本部",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「Subagents活用事例画面（/agent-cases）のHUDハイライトカードを3Dティルト化し、近未来感のある触覚フィードバックを付与してほしい」",
    actionPlan: "【反映済み】Subagents活用事例画面の最上部HUDハイライトカードにTiltCardを適用し、3D立体傾斜・動的光沢・触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/agent-cases",
    relatedLinkText: "Subagents事例を見る",
    issueNumber: 52,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/52",
  },
  {
    id: "TODO-58",
    title: "【KPIカウントアップ・立体感】最新AIニュース画面のKPI 4大カードにAnimatedCounter＆TiltCard導入",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "情報システム部・AI推進",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「最新AIニュース画面（/news）のKPI 4大カードに3Dティルトと動的カウントアップを導入し、ポータル全体の先進性と統一感を高めてほしい」",
    actionPlan: "【反映済み】最新AIニュース画面のKPI 4大カード（配信中ニュース、社内リリース、Google/一次情報、情報更新日）にTiltCardを適用し、数値をAnimatedCounterによる60fpsカウントアップに置換、ホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/news",
    relatedLinkText: "最新ニュースを見る",
    issueNumber: 53,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/53",
  },
  {
    id: "TODO-59",
    title: "【立体感・公式学習】生成AI学習コンテンツ画面のAcademy誘導ハイライトカードの3Dティルト化＆操作音響",
    category: "AI導入編",
    author: "社内ユーザー提案",
    authorDept: "人材育成・研修グループ",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「生成AI学習コンテンツ画面（/learning）の最上部にある『Antigravity Academy』誘導ハイライトカードを3D立体化し、受講開始への訴求力を高めてほしい」",
    actionPlan: "【反映済み】生成AI学習コンテンツ画面最上部の「Antigravity Academy」誘導ハイライトカードにTiltCardを適用し、3D立体傾斜・動的光沢・触覚操作音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/learning",
    relatedLinkText: "学習コンテンツを見る",
    issueNumber: 54,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/54",
  },
  {
    id: "TODO-60",
    title: "【立体感・推進サイクル】エージェント活用の3ステップガイドカード＆ロードマップバナーの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤チーム",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「エージェント・ツール画面（/agent-tools）の『自律型エージェント活用の3ステップ』の各ステップカードと『開発ロードマップ連携バナー』を3Dティルト化し、近未来感のある触覚操作フィードバックを付与してほしい」",
    actionPlan: "【反映済み】エージェント・ツール画面の3ステップガイドカード全3枚および開発ロードマップ連携バナーにTiltCardを適用し、3D立体傾斜・動的光沢・触覚音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/agent-tools",
    relatedLinkText: "エージェント・ツールを見る",
    issueNumber: 56,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/56",
  },
  {
    id: "TODO-61",
    title: "【立体感・リソース集】最下部「日々の開発・業務を加速するリソース集」バナーの3Dティルト化＆4大リンク触覚操作音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI活用推進タスクフォース",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「AI活用ナレッジ画面（/how-to）の最下部にある『日々の開発・業務を加速するリソース集』バナーを3D立体化し、各ショートカットリンクに触覚音響を付与して操作体験を向上させてほしい」",
    actionPlan: "【反映済み】AI活用ナレッジ画面最下部の「日々の開発・業務を加速するリソース集」バナーにTiltCardを適用し、3D立体傾斜・動的光沢および4大ショートカットリンクへの触覚操作音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/how-to",
    relatedLinkText: "AI活用ナレッジを見る",
    issueNumber: 57,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/57",
  },
  {
    id: "TODO-62",
    title: "【触覚音響・操作感】AIツール一覧画面の4大ビュー切替タブ＆ステータスフィルターピルへのCyber音響完全統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "プロダクトデザイン室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「AIツール一覧画面（/tools）の4大ビュー切替タブ（マトリクス、クアドラント、カバレッジ、ツール診断）およびステータスフィルターピル（すべて、利用可能、検証中、リストアップ）に、Cyberホバー・クリック音響を付与して軽快な操作感を高めてほしい」",
    actionPlan: "【反映済み】AIツール一覧画面の4大ビュー切替タブ（マトリクス、クアドラント、カバレッジ、ツール診断）、再同期ボタン、およびステータスフィルターピル全件にplayCyberHover / playCyberClickの触覚操作音響を完全統合しました。",
    relatedLink: "/tools",
    relatedLinkText: "AIツール一覧を見る",
    issueNumber: 58,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/58",
  },
  {
    id: "TODO-63",
    title: "【立体感・具体例カード】AI Tools Hubのマスキング実践Before/Afterカードの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "情報セキュリティ統括室",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「AI Tools Hub（/tools-hub）の『実践！マスキングの具体例 (Before / After)』のNGカードとOKカードを3D立体化し、ホバー触覚音響を付与して視覚的・触覚的な学習体験を高めてほしい」",
    actionPlan: "【反映済み】AI Tools Hub画面の実践マスキングBefore/After（危険な入力例NGカード＆安全な入力例OKカード）にTiltCardを適用し、3D立体傾斜・動的光沢およびホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/tools-hub",
    relatedLinkText: "AI Tools Hubを見る",
    issueNumber: 59,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/59",
  },
  {
    id: "TODO-64",
    title: "【立体感・HUD強化】SkillsカタログのANTIGRAVITY EXTENSIONS概要カードの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「社内Skillsカタログ（/skills-hub）の最上部にある『ANTIGRAVITY EXTENSIONS』HUDハイライトバナーを3D立体ティルト化し、触覚音響を付与して近未来感を高めてほしい」",
    actionPlan: "【反映済み】社内Skillsカタログ画面の「ANTIGRAVITY EXTENSIONS」HUDハイライトバナーにTiltCardを適用し、3D立体傾斜・動的光沢およびホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/skills-hub",
    relatedLinkText: "社内Skillsカタログを見る",
    issueNumber: 60,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/60",
  },
  {
    id: "TODO-65",
    title: "【立体感・HUD強化】AWS・マルチクラウド情報局のガバナンス概要バナーの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "クラウド推進インフラ統括",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「AWS・マルチクラウド情報局（/aws-info）最上部の『ENTERPRISE CLOUD GOVERNANCE』概要バナーを3Dティルト化し、動的光沢と触覚音響を付与してほしい」",
    actionPlan: "【反映済み】AWS・マルチクラウド情報局最上部の「ENTERPRISE CLOUD GOVERNANCE」概要バナーにTiltCardを適用し、3D立体傾斜・動的光沢およびホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/aws-info",
    relatedLinkText: "AWS・マルチクラウド情報局を見る",
    issueNumber: 61,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/61",
  },
  {
    id: "TODO-66",
    title: "【立体感・HUD強化】Antigravity情報局の公式ハイライトHUDバナーの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Antigravity情報局（/antigravity-info）の公式ハイライトHUDバナーを3D立体化し、動的光沢と触覚音響を付与してほしい」",
    actionPlan: "【反映済み】Antigravity情報局の公式ハイライトHUDバナーにTiltCardを適用し、3D立体傾斜・動的光沢およびホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/antigravity-info",
    relatedLinkText: "Antigravity情報局を見る",
    issueNumber: 62,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/62",
  },
  {
    id: "TODO-67",
    title: "【立体感・HUD強化】MCP外部ツール連携ハブのアーキテクチャ解説HUDバナーの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進基盤チーム",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「MCPハブ（/mcp-hub）のアーキテクチャ解説HUDバナーを3Dティルト化し、近未来感とホバー音響を高めてほしい」",
    actionPlan: "【反映済み】MCP外部ツール連携ハブのアーキテクチャ解説HUDバナーにTiltCardを適用し、3D立体傾斜・動的光沢およびホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/mcp-hub",
    relatedLinkText: "MCP外部ツール連携ハブを見る",
    issueNumber: 63,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/63",
  },
  {
    id: "TODO-68",
    title: "【立体感・ランキング行】社内AI活用状況の部署別推進ランキング行の3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "経営企画・AI推進室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「社内AI活用状況（/adoption）の部署別ランキング行カードをTiltCardで3D立体化し、ホバー触覚音響を付与してほしい」",
    actionPlan: "【反映済み】社内AI活用状況ダッシュボードの部署別推進ランキングカード（全4行）にTiltCardを適用し、3D立体傾斜・動的光沢およびホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/adoption",
    relatedLinkText: "社内AI活用状況を見る",
    issueNumber: 64,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/64",
  },
  {
    id: "TODO-69",
    title: "【立体感・ロードマップ】AI Park開発ロードマップのHUDバナー・フェーズ・タスクカードの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「開発ロードマップ（/roadmap）の公式解除スケジュールHUDバナーやタスク詳細一覧カードをTiltCardで3D立体化し、ホバー音響を完全統合してほしい」",
    actionPlan: "【反映済み】開発ロードマップのPhaseミニカード、フィルターボタン群、およびタスク詳細一覧カード全件にTiltCardを適用し、3D立体傾斜・動的光沢およびホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/roadmap",
    relatedLinkText: "開発ロードマップを見る",
    issueNumber: 65,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/65",
  },
  {
    id: "TODO-70",
    title: "【立体感・カレンダー】AI Parkカレンダーの案内カード・ビューコンテナの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI勉強会・コミュニティ推進チーム",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「カレンダー画面（/calendar）の案内インフォメーションカードやカレンダービュー枠に3D立体感とホバー触覚音響を付与してほしい」",
    actionPlan: "【反映済み】AI Parkカレンダーをクライアントコンポーネント化し、案内カードおよび月間・アジェンダビューコンテナにTiltCardを適用、3D立体感とホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/calendar",
    relatedLinkText: "AI Park カレンダーを見る",
    issueNumber: 66,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/66",
  },
  {
    id: "TODO-71",
    title: "【立体感・アイデアボード】アイデア宣言ボードの案内バナー3Dティルト化＆操作全般の触覚音響統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "共創イノベーション推進室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「アイデア宣言ボード（/idea-board）の宣言案内バナーをTiltCard化し、宣言ボタンや全フィルターボタンにホバー触覚音響を付与してほしい」",
    actionPlan: "【反映済み】アイデア宣言ボードの案内バナーにTiltCardを適用して3D立体化し、アイデア宣言ボタン・全ステータスフィルター・再読込ボタンにホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/idea-board",
    relatedLinkText: "アイデア宣言ボードを見る",
    issueNumber: 67,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/67",
  },
  {
    id: "TODO-72",
    title: "【近未来感・利用監視HUD】社内本番接続ステータス＆4大KPIメトリクスの3Dティルト化と操作触覚音響統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "クラウド推進インフラ統括",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「利用監視ダッシュボード（/gemini-stats /usage-monitor）の社内接続ステータスバーを3Dティルト化し、4大KPIカードを立体化、即時再取得やCSV等の全操作にホバー触覚音響を付与してほしい」",
    actionPlan: "【反映済み】利用監視ダッシュボードの社内接続ステータスバーにTiltCardを適用して3D立体化し、4大KPIメトリクスカード全件をTiltCard化、即時再取得・CSV出力・Cloud Billingコンソールリンクにホバー触覚音響（playCyberHover）を完全統合しました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "利用監視ダッシュボードを見る",
    issueNumber: 69,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/69",
  },
  {
    id: "TODO-73",
    title: "【立体感・アカデミー】カリキュラム一覧・再開カード・ステータスHUDの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI勉強会・コミュニティ推進チーム",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Antigravity Academy（/academy）のカリキュラム進捗HUD、学習再開カード、全コースカード全件をTiltCard化し、触覚音響と動的光沢で近未来感を高めてほしい」",
    actionPlan: "【反映済み】Antigravity Academyトップ画面のステータスHUDバナー、学習再開カード群、全カリキュラム一覧カード全件をTiltCardで3D立体化し、動的光沢およびホバー・クリック触覚音響を完全統合しました。",
    relatedLink: "/academy",
    relatedLinkText: "Antigravity Academyを見る",
    issueNumber: 70,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/70",
  },
  {
    id: "TODO-74",
    title: "【立体感・コース概要】コース個別トップのHUDアイコン＆サイドバーカード3Dティルト化＆操作触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「各コース個別トップ画面（/academy/[course]）の右側HUDアイコンバナーや修了要件カードをTiltCardで立体化し、レッスン開始等の操作にホバー音響を付与してほしい」",
    actionPlan: "【反映済み】コース概要画面のヒーロー右側HUDアイコンバナー、習得内容カード、サイドバーのシラバスカードをTiltCardで3D立体化し、トップ戻りナビ・レッスン開始・シラバスリンクにホバー・クリック触覚音響を完全統合しました。",
    relatedLink: "/academy",
    relatedLinkText: "Academy コースを見る",
    issueNumber: 71,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/71",
  },
  {
    id: "TODO-75",
    title: "【立体感・サイドバー】全画面共通サイドバーのナビゲーションリンク・⌘K検索・トグル操作への触覚音響完全統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「左サイドバーの各画面遷移や⌘K横断検索ボタン、モバイルトグルにもWeb Audio触覚音響を付与して、全画面で一貫した小気味良い操作感にしてほしい」",
    actionPlan: "【反映済み】全画面共通サイドバー（Sidebar）のロゴ・ナビゲーション各リンク・⌘K検索ボタン・モバイルトグルボタンにWeb Audio触覚音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/",
    relatedLinkText: "全画面共通サイドバーを確認",
    issueNumber: 72,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/72",
  },
  {
    id: "TODO-76",
    title: "【立体感・アカデミーレッスン】受講ステップ・プロンプトコピー・動画・評価テスト・修了証の3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Academyの個別レッスン画面（/academy/[course]/[step]）のプロンプトカードや評価テスト、修了証もTiltCardで立体化し、コピーやステップ移動に触覚音響を付与してほしい」",
    actionPlan: "【反映済み】レッスン画面のプロンプトカード・デジタル修了証をTiltCardで3D立体化し、プロンプトコピー・コードコピー・前後レッスン遷移・クイズ選択肢・採点・印刷操作にWeb Audio触覚音響を完全統合しました。",
    relatedLink: "/academy",
    relatedLinkText: "Academy レッスン画面を確認",
    issueNumber: 73,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/73",
  },
  {
    id: "TODO-77",
    title: "【立体感・OfficeHour予約】相談モーダル・カレンダー連携・メモコピー操作の触覚音響＆キネマティクス演出",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Office Hour相談予約モーダル（BookingModal）の開閉、送信、Googleカレンダー仮予定連携、予約メモコピーに音響と洗練されたアニメーションを付与してほしい」",
    actionPlan: "【反映済み】相談予約モーダル（BookingModal）の開閉、カレンダー仮予定追加、予約メモコピー、送信操作にWeb Audio触覚音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/guide",
    relatedLinkText: "Office Hour 相談機能を確認",
    issueNumber: 74,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/74",
  },
  {
    id: "TODO-78",
    title: "【立体感・フッター＆検索】FooterリンクおよびSiteOmnisearch検索候補への触覚音響完全統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「フッターの各セクションリンクやSiteOmnisearchのクイックタグ、検索結果カード、クリアボタンにも触覚音響を同期してほしい」",
    actionPlan: "【反映済み】全画面共通フッターの各ナビゲーションリンク、およびサイト内横断検索のクイックタグ・クリアボタン・検索結果カードにWeb Audio触覚音響（playCyberHover / playCyberClick）を完全統合しました。",
    relatedLink: "/",
    relatedLinkText: "フッター・横断検索を確認",
    issueNumber: 75,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/75",
  },
  {
    id: "TODO-79",
    title: "【立体感・プロンプト安全原則】社内AI安全利用ルール＆3大テクニックカードの3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「学習画面（/learning）にある社内AI安全利用ルール（OK/NG早見表や3大テクニック）もTiltCardで立体化し、触覚音響を付与してほしい」",
    actionPlan: "【反映済み】SafePromptingRules.tsx において、NG入力禁止カード・OK推奨活用カード・3大記述テクニックカードをすべてTiltCardで立体化し、ホバー触覚音響を統合しました。",
    relatedLink: "/learning",
    relatedLinkText: "AI安全利用ルールを確認",
    issueNumber: 76,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/76",
  },
  {
    id: "TODO-80",
    title: "【立体感・アカデミーHUD】進捗HUDバナーのTiltCard化＆サイバープログレスリング動的光彩演出",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Academyの進捗HUD（AcademyProgressHUD.tsx）自体をTiltCardで立体化し、サイバーパンクなホバー光彩と音響で受講意欲を高めてほしい」",
    actionPlan: "【反映済み】AcademyProgressHUD.tsx 全体をTiltCard（傾斜5°・動的光沢0.12）で立体化し、サイバープログレスリングとランクバッジに動的光彩と触覚音響を完全統合しました。",
    relatedLink: "/academy",
    relatedLinkText: "Academy 進捗HUDを確認",
    issueNumber: 77,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/77",
  },
  {
    id: "TODO-81",
    title: "【立体感・導入ガイドステップ】GuideStepCardのTiltCard化＆コマンドコピー・外部リンク触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "高",
    status: "done",
    feedbackQuote: "「導入ガイドの手順カード（GuideStepCard）にも3Dティルト傾斜と外部リンク・画像拡大時の触覚音響を付与してほしい」",
    actionPlan: "【反映済み】GuideStepCard.tsx 全体をTiltCard（傾斜3°・動的光沢0.06）で立体化し、外部リンクおよび画像原寸大拡大クリック操作にWeb Audio触覚音響を完全統合しました。",
    relatedLink: "/guide",
    relatedLinkText: "導入ガイド手順を確認",
    issueNumber: 78,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/78",
  },
  {
    id: "TODO-82",
    title: "【立体感・Windows環境構築】WindowsAntigravityGuideのカード立体化＆PowerShellワンライナーコピー音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Windows環境ガイド（WindowsAntigravityGuide.tsx）のコードコピーやTipsセクションの開閉に音響と3Dキネマティクスを追加してほしい」",
    actionPlan: "【反映済み】WindowsAntigravityGuide.tsx のコードスニペットコピー、アコーディオン開閉、MCPサーバー紹介カードのTiltCard立体化＆Web Audio触覚音響を完全統合しました。",
    relatedLink: "/guide",
    relatedLinkText: "Windows実践ガイドを確認",
    issueNumber: 79,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/79",
  },
  {
    id: "TODO-83",
    title: "【立体感・相談窓口】OfficeHourBannerのTiltCard立体化＆サイバー光彩・相談予約起動音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「相談窓口バナー（OfficeHourBanner.tsx）の予約ボタンクリックやホバーに触覚音響とサイバー光彩アニメーションを付与してほしい」",
    actionPlan: "【反映済み】OfficeHourBanner.tsx の個別相談予約ボタンにWeb Audio触覚音響（playCyberHover / playCyberClick）を統合し、グラデーション光彩とキネマティクスを強化しました。",
    relatedLink: "/guide",
    relatedLinkText: "相談窓口バナーを確認",
    issueNumber: 80,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/80",
  },
  {
    id: "TODO-84",
    title: "【立体感・トップ導線】ポータルトップのフィードバックバナー＆相談窓口リンクへの触覚音響統合",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「トップ画面のフィードバック反映バナーや相談窓口リンクのボタンにも触覚音響を同期してほしい」",
    actionPlan: "【反映済み】ポータルトップ画面（src/app/page.tsx）の改善ToDoボード遷移リンクおよび相談窓口リンクにWeb Audio触覚音響を完全統合しました。",
    relatedLink: "/",
    relatedLinkText: "ポータルトップを確認",
    issueNumber: 81,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/81",
  },
  {
    id: "TODO-85",
    title: "【立体感・3つの強み】Antigravity 3大革新性カードのTiltCard立体化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "中",
    status: "done",
    feedbackQuote: "「トップ画面下部にある『なぜ Antigravity なのか？ 3つの革新性』のカードもTiltCardで立体化してほしい」",
    actionPlan: "【反映済み】ポータルトップの『なぜ Google Antigravity なのか？ 3つの革新性』カード3枚（Subagents、Skills&Rules、MCP）をTiltCard（傾斜4°・光沢0.08）で立体化し、ホバー触覚音響を統合しました。",
    relatedLink: "/",
    relatedLinkText: "3大革新性カードを確認",
    issueNumber: 82,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/82",
  },
  {
    id: "TODO-86",
    title: "【アクセシビリティ・音響UI】全社ポータル用触覚音響ON/OFFトグルコンポーネントの提供",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "中",
    status: "done",
    feedbackQuote: "「Web Audioの触覚音響は心地よいが、静かなオフィスや集中したい時のためにワンクリックでミュート／有効化できるスイッチがほしい」",
    actionPlan: "【反映済み】src/lib/sound.ts を拡張してデフォルトON＆localStorage永続化に対応し、SoundToggle.tsx コンポーネントを作成してフッター下部に配置しました。",
    relatedLink: "/",
    relatedLinkText: "サウンドトグルUIを確認",
    issueNumber: 83,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/83",
  },
  {
    id: "TODO-87",
    title: "【立体感・パーソナライズ】ExperienceSelectorのタブ切替音響＆おすすめカードTiltCard立体化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「トップ画面のペルソナ別おすすめカード（ExperienceSelector）もTiltCardで立体化し、タブ切り替えのクリック感・音響を向上させてほしい」",
    actionPlan: "【反映済み】ExperienceSelector.tsx のペルソナタブ切り替えに playCyberClick / playCyberHover を同期し、3枚のおすすめカードを TiltCard（傾斜4°・動的光沢0.08）化しました。",
    relatedLink: "/",
    relatedLinkText: "ペルソナセレクターを確認",
    issueNumber: 84,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/84",
  },
  {
    id: "TODO-88",
    title: "【キネマティクス・ライブフィード】AIPulseTickerのホバー一時停止＆触覚音響・光彩強化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "中",
    status: "done",
    feedbackQuote: "「リアルタイムティッカー（AIPulseTicker）にマウスを合わせた時にスクロールを一時停止し、クイックアクションに触覚音響をつけてほしい」",
    actionPlan: "【反映済み】AIPulseTicker.tsx にホバー一時停止制御（PAUSED表示）、ホバー光彩、および各リンクへの触覚音響（playCyberClick / playCyberHover）を完全統合しました。",
    relatedLink: "/",
    relatedLinkText: "リアルタイムティッカーを確認",
    issueNumber: 85,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/85",
  },
  {
    id: "TODO-89",
    title: "【立体感・目的別ナビ】PurposeJumpのジャンルタブ切替音響＆ジャンプカードTiltCard立体化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "中",
    status: "done",
    feedbackQuote: "「目的別クイックジャンプ（PurposeJump.tsx）の各ジャンル切替とカードに音響と立体感をつけてほしい」",
    actionPlan: "【反映済み】PurposeJump.tsx の3大ジャンルセレクターボタンおよび展開される全リンクカードを TiltCard（傾斜3°・動的光沢0.06）化し、Web Audio触覚音響を完全統合しました。",
    relatedLink: "/",
    relatedLinkText: "目的別ジャンプを確認",
    issueNumber: 86,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/86",
  },
  {
    id: "TODO-90",
    title: "【触覚音響・操作感】全画面グローバルナビゲーションのクリック・ホバー音響完全同期",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「左サイドバーの全メニューリンクや外部リンク、アコーディオンに触覚音響を同期して、サイト全体の回遊感を高めてほしい」",
    actionPlan: "【反映済み】Sidebar.tsx 内の全ナビゲーションリンク、外部リンク、各カテゴリ見出し、モバイルオーバーレイに playCyberClick / playCyberHover を完全網羅しました。",
    relatedLink: "/",
    relatedLinkText: "グローバルサイドバーを確認",
    issueNumber: 88,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/88",
  },
  {
    id: "TODO-91",
    title: "【触覚音響・プロジェクト共創】社内AIプロジェクト一覧のフィルター・更新・登録アクションへの音響完全同期",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進担当・開発基盤室",
    date: "2026/10/04",
    priority: "中",
    status: "done",
    feedbackQuote: "「社内AIプロジェクト一覧（/ai-projects）のステージ切り替えボタンや更新・登録リンクにも触覚音響をつけてほしい」",
    actionPlan: "【反映済み】src/app/ai-projects/page.tsx のステージ切り替えボタン、部署セレクト、更新ボタン、プロジェクト登録CTA、GitHub Issueリンクに触覚音響（playCyberClick / playCyberHover）を完全統合しました。",
    relatedLink: "/ai-projects",
    relatedLinkText: "社内AIプロジェクト一覧を確認",
    issueNumber: 90,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/90",
  },
  {
    id: "TODO-92",
    title: "【立体感・実務トラブル解決】トラブルシューティング早見表のコマンドコピー音響＆TiltCard立体化",
    category: "開発環境",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「Windows環境Antigravityトラブルシューティング早見表の各解決策カードをTiltCard化し、ワンクリックコマンドコピー時の音響フィードバックを強化してほしい」",
    actionPlan: "【反映済み】src/components/TroubleshootingBoard.tsx の解決策カードにTiltCard（3D傾斜・光彩）を適用し、ワンクリックコマンドコピー時の和音音響（playCyberSuccess）とホバー音響を完全統合しました。",
    relatedLink: "/guide",
    relatedLinkText: "トラブルシューティング早見表を確認",
    issueNumber: 91,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/91",
  },
  {
    id: "TODO-93",
    title: "【UAT認定・学習定着】Antigravity Academy の開発者手動プリフライトチェック登録＆手動合格エビデンス整備",
    category: "運用・管理",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「Antigravity Academyの全12レッスン・修了テスト・修了証発行・進捗バックアップ＆Chat報告機能を、開発者手動UAT管理コンソール（/preflight）に正式登録して4大評価軸のエビデンスを担保してほしい」",
    actionPlan: "【反映済み】src/data/preflight-checklist.ts に Antigravity Academy のレコードを追加し、事実性・公式整合性・リンク検証・デザイン・操作性・視認性の手動合格エビデンスを完全整備しました。品質ゲート検証（check:gate）にて9件目の合格を確認済みです。",
    relatedLink: "/preflight",
    relatedLinkText: "プリフライトチェック管理を確認",
    issueNumber: 92,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/92",
  },
  {
    id: "TODO-94",
    title: "【ツール探索・申請支援】AIツール検証マトリクス (/tools) の推奨ランク・職種フィルター & 利用申請ドラフト生成モーダル提供",
    category: "AI実践編",
    author: "社内ユーザー提案",
    authorDept: "営業企画部・業務推進グループ",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「社内で使ってよいツールなのか（全社OKなのか開発者限定なのか）が一目で知りたい。使いたい場合の申請文面や理由のテンプレもあると助かる」",
    actionPlan: "【反映済み】社内AIツール検証マトリクス（/tools）に、推奨ランク（S:全社推奨/A:エンジニア推奨/B:業務特化/PoC中）および職種タグフィルター（全社/エンジニア/マーケ/デザイン）、キーワード検索を追加。さらにワンクリックで社内申請ドラフトを生成・コピーできる申請支援モーダル（利用目的・想定削減時間・機密情報非入力宣誓付き）を新設しました。",
    relatedLink: "/tools",
    relatedLinkText: "AIツール検証マトリクスを確認",
    issueNumber: 93,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/93",
  },
  {
    id: "TODO-95",
    title: "【触覚音響・立体感】Gemini利用統計ダッシュボードの期間切替・チャートバー・SKUカード立体化",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「利用統計ダッシュボード（/gemini-stats）の日次推移期間切替やチャートバー、SKU別分析カードにもTiltCard立体化と触覚音響を同期してほしい」",
    actionPlan: "【反映済み】日次推移チャートの期間切替ボタン（7d/14d/30d）やバーホバー、モデル・SKU別分析カード（Gemini 3.8 Flash, Vertex AI Agent Platform, us-east7基盤）のTiltCard×SpotlightCard立体化、CSVエクスポートボタン・GCP技術仕様アコーディオンへの触覚音響（playCyberClick / playCyberHover / playCyberSuccess）を完全統合しました。",
    relatedLink: "/gemini-stats",
    relatedLinkText: "利用統計ダッシュボードを確認",
    issueNumber: 94,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/94",
  },
  {
    id: "TODO-96",
    title: "【操作性・キネマティクス】AI Park カレンダーの月間/アジェンダ ビュー切り替えタブ＆クイックリンク",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進担当・企画室",
    date: "2026/10/04",
    priority: "中",
    status: "done",
    feedbackQuote: "「AI Park カレンダー（/calendar）で、月間ビューと直近予定アジェンダをワンタップで切り替えたり、Googleカレンダーに直接追加できるようにしてほしい」",
    actionPlan: "【反映済み】月間ビュー・アジェンダ一覧・両方表示のピルタブ切り替えUIを実装し、タブ切り替え時の触覚音響（playCyberClick / playCyberHover）とGoogleカレンダー直接追加導線（ExternalLink）を導入しました。",
    relatedLink: "/calendar",
    relatedLinkText: "AI Park カレンダーを確認",
    issueNumber: 95,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/95",
  },
  {
    id: "TODO-97",
    title: "【触覚音響・情報設計】お問い合わせ・FAQのインタラクティブ検索フィルター＆触覚音響完全同期",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進担当窓口",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「お問い合わせ画面（/contact）のアカウント・ライセンスFAQが多くて探すのが大変なので検索できるようにし、各ボタンやFAQカードに触覚音響をつけてほしい」",
    actionPlan: "【反映済み】アカウント・ライセンスFAQにリアルタイムインクリメンタル検索フィルターを導入し、FAQカード展開・リンク・送信ボタン・入力画面に戻るボタンに触覚音響（playCyberClick / playCyberHover / playCyberSuccess）を完全同期しました。",
    relatedLink: "/contact",
    relatedLinkText: "お問い合わせ・FAQを確認",
    issueNumber: 96,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/96",
  },
  {
    id: "TODO-98",
    title: "【スキルカタログ・業務自動化】社内認定Skillsカタログ (/skills-hub) の検索・カテゴリフィルター・新規スキル申請モーダル整備 & UAT合格エビデンス登録",
    category: "開発環境",
    author: "社内ユーザー提案",
    authorDept: "技術標準化・AI推進チーム",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「Antigravityで呼び出せる社内スキル一覧（/skills-hub）で、カテゴリ別絞り込みやキーワード検索、現場で作った便利スキルの申請フォームがほしい」",
    actionPlan: "【反映済み】全5カテゴリのピル切り替えフィルター、リアルタイムキーワード検索バー、新規Skill提案・申請ドラフト生成モーダル（SkillApplicationModal）、および即戦力認定スキル（全8件）のTiltCard×SpotlightCard立体化・触覚音響連携を本番実装しました。",
    relatedLink: "/skills-hub",
    relatedLinkText: "社内Skillsカタログを確認",
    issueNumber: 97,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/97",
  },
  {
    id: "TODO-99",
    title: "【操作性・キネマティクス】コマンドパレット（Cmd+K）のカテゴリタブ絞り込み・全画面網羅・上下移動触覚音響同期",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発標準化・DX推進チーム",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「コマンドパレット（Cmd+K）で、新設された主要画面（/tools, /troubleshooting, /contact, /how-to）へのクイックジャンプができるようにし、カテゴリ別（Academy, ツール, コミュニティ, ガバナンス）に絞り込めるタブや、矢印キー移動時の触覚音響を同期してほしい」",
    actionPlan: "【反映済み】新設主要4画面を追加網羅し、カテゴリ別ピル切り替えタブ、矢印キー（↑↓）移動時の触覚音響（playCyberHover）完全同期、およびLinear風3DキーキャップUIを実装しました。",
    relatedLink: "/",
    relatedLinkText: "コマンドパレット（Cmd+K）を試す",
    issueNumber: 98,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/98",
  },
  {
    id: "TODO-100",
    title: "【高速操作・HUD】キーボードショートカットHUDのジャンプ先拡充（GT/GF/GC/GN）＆行ホバー触覚音響",
    category: "開発環境",
    author: "社内ユーザー提案",
    authorDept: "エンジニアリング部",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「キーボードショートカットHUD（?キー）に、新設された重要画面へのジャンプキー（G T: ツール一覧, G F: ToDoボード, G C: カレンダー, G N: ニュース）を追加し、各ショートカット行のホバー音響やサイバーグロー演出を導入してほしい」",
    actionPlan: "【反映済み】Fast Jumpキーバインド（G T, G F, G C, G N）を追加登録し、各コマンド行ホバー時の触覚音響（playCyberHover）およびネオングロー3Dキーキャップ表現を実装しました。",
    relatedLink: "/",
    relatedLinkText: "ショートカット一覧（?キー）を試す",
    issueNumber: 99,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/99",
  },
  {
    id: "TODO-101",
    title: "【記念マイルストーン・UI/UX】改善ToDoボード100タスク達成記念HUDバッジ＆カテゴリ別完了分析チャート",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "AI推進担当窓口",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「改善ToDoボード（/feedback-todo）で、全社フィードバック改善が通算100件に到達した記念として、Awwwards/Webby Awards品質達成のマイルストーンHUDバッジと、カテゴリ別（UI/UX, 機能追加, 不具合, ドキュメント）の完了進捗バーを設置してほしい」",
    actionPlan: "【反映済み】通算100タスク達成記念HUDバッジ（TiltCard×SpotlightCard、サイバー祝賀音響 playCyberSuccess）と、カテゴリ別進捗バー・比率分析チャートを設置しました。",
    relatedLink: "/feedback-todo",
    relatedLinkText: "改善ToDoボードを確認",
    issueNumber: 100,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/100",
  },
  {
    id: "TODO-102",
    title: "【総合ハブ・導線強化】使い方・学びハブ（/how-to）のカード拡充（Skills公開・トラブル解決・利用統計）＆音響連携",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "社内ポータル活用推進",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「使い方・学び 総合ハブ（/how-to）で、認定公開された社内Skillsカタログ（/skills-hub）のステータスを更新し、新たに新設されたWindowsトラブルシューター（/troubleshooting）やGemini利用統計（/gemini-stats）をハブカードに追加してほしい」",
    actionPlan: "【反映済み】Skillsカタログの公開バッジ更新、WindowsトラブルシューターおよびGemini利用統計カードを追加（全8モジュール体制）し、TiltCard×SpotlightCard立体化と触覚音響を完全同期しました。",
    relatedLink: "/how-to",
    relatedLinkText: "使い方・学びハブを確認",
    issueNumber: 101,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/101",
  },
  {
    id: "TODO-103",
    title: "【共創台帳・検索性】社内AIプロジェクト一覧（/ai-projects）のインクリメンタル検索＆実践カード立体化",
    category: "活用事例",
    author: "社内ユーザー提案",
    authorDept: "AI共創コミュニティ",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「社内AIプロジェクト一覧（/ai-projects）で、登録プロジェクトが増えたためキーワード検索できるようにし、部署別実践カード（開発・営業・人事）をTiltCard×SpotlightCard立体化してテンプレ活用しやすくしてほしい」",
    actionPlan: "【反映済み】プロジェクト名・部署・ツール・成果のリアルタイム検索バーを設置し、部署別実践カード3枚へのワンクリックフローコピー機能（playCyberSuccess音響同期）を実装しました。",
    relatedLink: "/ai-projects",
    relatedLinkText: "社内AIプロジェクト台帳を確認",
    issueNumber: 102,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/102",
  },
  {
    id: "TODO-104",
    title: "【ライブ感・キネマティクス】AIPulseTickerの最新イベント拡充（100タスク達成・Skills公開・トラブル解決）",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "DX推進室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「ヘッダー下部のティッカー（AIPulseTicker）に、最新のポータルアップデート（改善ToDo 100タスク突破、社内認定Skillsカタログ公開、Windows環境トラブルシューター追加）をリアルタイム反映し、サイト全体のキネマティクスとライブ感をさらに高めてほしい」",
    actionPlan: "【反映済み】通算100タスク達成、Skillsカタログ公開、Windowsトラブル解決FAQを含む全7イベントのパルスローテーションに拡充し、ホバー停止および触覚音響を同期しました。",
    relatedLink: "/",
    relatedLinkText: "トップページティッカーを確認",
    issueNumber: 103,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/103",
  },
  {
    id: "TODO-105",
    title: "【申請フロー・セキュリティ】AI Tools Hub (/tools-hub) の社内承認済みツール一覧・利用申請ドラフト作成モーダル実装 & UAT合格登録",
    category: "運用・管理",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「会社として使えるAIツールと、その利用申請の方法（誰にどう連絡すればいいか、申請文面のテンプレート）を画面上で簡単に作成して申請できるようにしてほしい」",
    actionPlan: "【反映済み】社内承認済み・検証中ツール一覧（認可レベル、対象部門、コスト負担、利用申請状況）を実装し、Web Audio API音響連動の利用申請ドラフト作成モーダル（ToolApplicationModal.tsx）および検索・カテゴリフィルターを統合しました。",
    relatedLink: "/tools-hub",
    relatedLinkText: "AI Tools Hubを確認",
    issueNumber: 104,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/104",
  },
  {
    id: "TODO-106",
    title: "【目的別ジャンプ・導線最新化】PurposeJump（トップページ）の全機能リンク整合＆新設画面追加",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "社内ポータル活用推進",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「トップページの『何がしたい？目的に合わせてジャンプ』（PurposeJump）で、公開済みのSkillsカタログ（/skills-hub）が工事中と表示されているのを認定公開に改め、新設されたWindowsトラブル解決（/troubleshooting）や最新AIニュース（/news）を追加してほしい」",
    actionPlan: "【反映済み】PurposeJumpの全リストを最新化。skills-hubの認定公開バッジへの更新、troubleshootingおよびnewsへのジャンプカード新設、gemini-statsの説明文最新化を完了しました。",
    relatedLink: "/",
    relatedLinkText: "トップページ目的ジャンプを確認",
    issueNumber: 105,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/105",
  },
  {
    id: "TODO-107",
    title: "【フッター網羅性・ナビゲーション】Footerに社内Skills・トラブル解決・Gemini利用統計を追加",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "社内ポータル活用推進",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「全画面共通のフッター（Footer.tsx）ナビゲーションに、新設された重要機能（社内Skillsカタログ、Windowsトラブル解決、最新AIニュース、Gemini利用統計）を登録し、どの画面からでも即座に回遊できるようにしてほしい」",
    actionPlan: "【反映済み】Footer.tsxの『学び・導入』に/skills-hubと/troubleshooting、『共創・コミュニティ』に/news、『ガバナンス・窓口』に/gemini-statsを追加し、ホバー・クリック触覚音響を同期しました。",
    relatedLink: "/",
    relatedLinkText: "全社共通フッターを確認",
    issueNumber: 106,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/106",
  },
  {
    id: "TODO-108",
    title: "【トップクイックアクセス・拡充】page.tsxのquickLinksに社内Skills＆トラブル解決を追加",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "DX推進室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「トップページの主要機能カード一覧（quickLinks）に、『社内Skillsカタログ（/skills-hub）』と『Windowsトラブル解決（/troubleshooting）』を追加し、トップページからワンタップで即アクセスできるようにしてほしい」",
    actionPlan: "【反映済み】トップページのquickLinksに社内SkillsカタログとWindowsトラブル解決カードを追加（全10枚体制へ拡充）。TiltCard×SpotlightCard立体化と触覚音響を同期しました。",
    relatedLink: "/",
    relatedLinkText: "トップページ主要機能カードを確認",
    issueNumber: 107,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/107",
  },
  {
    id: "TODO-109",
    title: "【新機能・リンク整合】Windowsトラブル解決FAQ (/troubleshooting) の新設＆自己修復コマンドHUD実装",
    category: "開発環境",
    author: "社内ユーザー提案",
    authorDept: "開発者環境・AI推進",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「/how-to、PurposeJump、Footerからリンクされている『Windowsトラブル解決FAQ（/troubleshooting）』が未作成であるため、社員が社内AI利用時に遭遇する頻出エラーをワンタップで自己解決できるコマンドHUD画面を新設してほしい」",
    actionPlan: "【反映済み】/troubleshooting を新設。PowerShellスクリプト実行制限、Git認証、Node競合、Antigravity ADC認証、Gemini 3.1 Proプレビュー設定等のFAQ全6件、ワンクリック修復コマンドコピー、触覚音響を完全実装しました。",
    relatedLink: "/troubleshooting",
    relatedLinkText: "Windowsトラブルシューターを確認",
    issueNumber: 108,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/108",
  },
  {
    id: "TODO-110",
    title: "【UAT管理・品質ゲート】/troubleshooting のプリフライト検査マスター登録＆事実性検証",
    category: "運用・管理",
    author: "社内ユーザー提案",
    authorDept: "品質・ガバナンス",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「新設した Windowsトラブル解決FAQ（/troubleshooting）について、開発者手動プリフライトチェック（preflight-checklist.ts）に検査レコードを追加し、事実確認・リンク整合・品質ゲート（npm run check:gate）を満たしてほしい」",
    actionPlan: "【反映済み】preflight-checklist.tsにtroubleshootingのUATレコードを追加し、全コマンドの安全性（管理者権限不要）および4大評価軸合格を実機検証して品質ゲートを通過しました。",
    relatedLink: "/preflight",
    relatedLinkText: "プリフライト管理画面を確認",
    issueNumber: 109,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/109",
  },
  {
    id: "TODO-111",
    title: "【ToDo同期・本番リリース】TODO-109, 110 を改善ToDoボードに登録し本番自動デプロイ監視",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "DX推進室",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「新設した Windowsトラブル解決機能およびUATレコードを『ご意見・改善ToDoボード（/feedback-todo）』に登録し、全51ルートのSSGビルドとGitHub Actions自動デプロイを監視してほしい」",
    actionPlan: "【反映済み】改善ToDoボードに最新タスクを登録・done更新し、型チェック、品質ゲート検証、SSGビルド（全51ルート完全生成）を経て本番自動デプロイを監視・完了しました。",
    relatedLink: "/feedback-todo",
    relatedLinkText: "改善ToDoボードを確認",
    issueNumber: 110,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/110",
  },
  {
    id: "TODO-112",
    title: "【実務事例・インタビュー】現場のAI活用インタビュー (/interviews) の実践先行事例3選・部門別フィルター・取材立候補モーダル整備 & UAT合格登録",
    category: "活用事例",
    author: "社内ユーザー提案",
    authorDept: "全社開発・AI推進",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「他部署で実際にどんなプロンプトを使ってどう業務効率化しているのかのリアルな声や、自分のチームの活用事例を取材してもらうための申請をポータルから直接できるようにしてほしい」",
    actionPlan: "【反映済み】社内先行実践インタビュー3選（開発DX梅澤、営業CS高橋、総務佐藤）を掲載し、部門別フィルター、インクリメンタル検索、プロンプトコピー機能、およびGoogle Chatへ即時提出できる取材立候補ドラフト生成モーダル（InterviewCandidateModal.tsx）を完全実装しました。",
    relatedLink: "/interviews",
    relatedLinkText: "現場のAI活用インタビューを確認",
    issueNumber: 111,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/111",
  },
  {
    id: "TODO-113",
    title: "【Google公式エージェント活用】公式プラグイン対応カスタムエージェント（Flutter・Firebase・Google Play）の実践導入カタログ新設 & AI Parkリリース監査エージェント（ai-park-release-audit）の実装",
    category: "開発環境",
    author: "全社開発・AI推進チーム",
    authorDept: "技術基盤・QA推進部",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「Google Antigravity公式ブログで発表された公式カスタムエージェント群（Flutter / Firebase / Play Audit）を社内エンジニアが自分のプロジェクトへ即座に導入できるカタログと設定テンプレートを提供し、同時にAI Park自身のデプロイ前総合監査エージェントも整備してほしい」",
    actionPlan: "【反映済み】Subagents活用事例集（/agent-cases）にGoogle公式プラグイン対応カスタムエージェント実践導入カタログ（4種）を新設し、ワンクリックMarkdown定義コピー・CLIコマンド（agy --agent <name>）連携を実装。また、AI Park本番前総合監査エージェント（.agents/agents/ai-park-release-audit.md）を正式配置しました。",
    relatedLink: "/agent-cases",
    relatedLinkText: "カスタムエージェント実践カタログを確認",
    issueNumber: 112,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/112",
  },
  {
    id: "TODO-114",
    title: "【IoT・ハードウェア連携】OpenAI最新事例（GPT-Live-1×Codex×Raspberry Pi）に基づく物理LEDサイネージ制御エージェント事例追加 & ニュース還元",
    category: "AI実践編",
    author: "IoT・先端技術推進WG",
    authorDept: "スマートオフィス・全社開発推進",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「オフィスや現場の物理ディスプレイ（LEDパネルや会議室サイネージ）をAIエージェントからリアルタイム音声で操作・表示更新するOpenAI公式の最新IoT事例を取り入れ、社内実務での連携モデルケースを提示してほしい」",
    actionPlan: "【反映済み】OpenAI Developers公式ブログ「Bringing my LED display to life」の解説をAIニュース（/news）に追加。さらにSubagents活用事例集（/agent-cases）に「物理LEDサイネージ・HUDリアルタイム音声制御」事例を追加し、エージェント定義（.agents/agents/iot-display-controller.md）とCLIコマンド（agy --agent iot-display-controller）を配備しました。",
    relatedLink: "/agent-cases",
    relatedLinkText: "Subagents活用事例集を確認",
    issueNumber: 113,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/113",
  },
  {
    id: "TODO-115",
    title: "【基盤モデル】DeepSeek-V4.1-Flash GA提供開始に伴う1M長文コンテキスト・高効率MoEモデルの社内活用リファレンス & ニュース還元",
    category: "AI実践編",
    author: "基盤モデル研究・LLM活用推進WG",
    authorDept: "AIテクノロジーセンター・技術基盤統括",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「DeepSeekの最新モデル『DeepSeek-V4.1-Flash』がGAとなり、1Mトークンの超長文コンテキスト、8B/16Bアクティベートの高効率MoE、MITライセンスによるオープンウェイトが提供開始された。社内での長大コード/ドキュメント解析やオンプレミス検証の選択肢としてモデル特性をポータルに反映してほしい」",
    actionPlan: "【反映済み】DeepSeek公式ブログ『DeepSeek-V4.1-Flash Generally Available』の解説をAIニュース（/news）に追加。Subagents活用事例集（/agent-cases）に1M長文コンテキスト高速インスペクション事例を新設し、基盤モデル自動選定スキル（model-router）の選定マトリクスへ8B Prefill MoEと1M Contextモデル特性を反映しました。",
    relatedLink: "/agent-cases",
    relatedLinkText: "Subagents活用事例集を確認",
    issueNumber: 114,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/114",
  },
  {
    id: "TODO-116",
    title: "【組織共有エージェント】xAI「Team Bots」発表に伴うチーム共有AIチームメイト（4層設計・Slack常駐）の社内活用リファレンス & ニュース還元",
    category: "AI実践編",
    author: "コラボレーション基盤・Slack/AI推進WG",
    authorDept: "デジタルワークプレイス統括部",
    date: "2026/10/04",
    priority: "高",
    status: "done",
    feedbackQuote: "「個人向けAIチャットからチーム全体の共同作業を支えるAIチームメイトへ進化させるxAIの『Team Bots』が発表された。Context（共通知識）、Plugins（SaaS連携）、Credentials（安全な認証情報管理）、Memory（組織記憶）の4層アーキテクチャやSlack連携の仕組みを社内モデルケースとしてポータルに反映してほしい」",
    actionPlan: "【反映済み】xAI公式ニュース「Team Bots」の解説をAIニュース（/news）に追加。Subagents活用事例集（/agent-cases）に「チーム共有AIチームメイト（4層協調・Slack常駐）」事例を追加し、専用カスタムエージェント定義（.agents/agents/team-bot-orchestrator.md）とCLIコマンド（agy --agent team-bot-orchestrator）を配備しました。",
    relatedLink: "/agent-cases",
    relatedLinkText: "Subagents活用事例集を確認",
    issueNumber: 115,
    issueUrl: "https://github.com/kanta13jp1/ai-park/issues/115",
  },
];

const seedIds = new Set(initialFeedbackList.map((t) => t.id));

export default function FeedbackTodoPage() {
  const [todos, setTodos] = useState<FeedbackTodoItem[]>(initialFeedbackList);
  const [statusFilter, setStatusFilter] = useState<"unresolved" | "all" | "in_progress" | "todo" | "done">("unresolved");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
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

  // LocalStorage の読み込み（非同期マイクロタスクでカスケードレンダリング防止）
  useEffect(() => {
    const saved = localStorage.getItem("mightylink_feedback_todos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 運営登録のToDo（TODO-xx）は常にコード側の最新内容を使い、ブラウザ保存分は利用者の起票のみ採用
          const userItems = parsed.filter((t: FeedbackTodoItem) => !seedIds.has(t.id));
          if (userItems.length > 0) {
            queueMicrotask(() => {
              setTodos([...userItems, ...initialFeedbackList]);
            });
          }
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

  // 集計カウント
  const todoCount = allItems.filter((t) => t.status === "todo").length;
  const inProgressCount = allItems.filter((t) => t.status === "in_progress").length;
  const doneCount = allItems.filter((t) => t.status === "done").length;
  const unresolvedCount = todoCount + inProgressCount;

  // フィルタリング
  const categories = ["all", ...Array.from(new Set(allItems.map((t) => t.category)))];

  const filteredTodos = allItems.filter((item) => {
    if (statusFilter === "unresolved") {
      if (item.status === "done") return false;
    } else if (statusFilter !== "all") {
      if (item.status !== statusFilter) return false;
    }
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
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

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      {/* ページヘッダー */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <MessageSquarePlus size={14} className="text-cyan-300" />
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

          {/* 🌟 100タスク達成記念HUDバッジ & カテゴリ分析 */}
          <div className="pt-2">
            <TiltCard maxTilt={3} glareOpacity={0.08} className="rounded-2xl">
              <SpotlightCard
                spotlightColor="rgba(34, 211, 238, 0.15)"
                className="bg-gradient-to-r from-slate-950 via-[#0d1627] to-slate-950 border-cyan-500/40 rounded-2xl shadow-xl overflow-hidden text-white"
              >
                <div
                  onMouseEnter={() => playCyberHover()}
                  onClick={() => playCyberSuccess()}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)] shrink-0 animate-bounce duration-1000">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/40">
                          MILESTONE 100+
                        </span>
                        <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                          <Sparkles size={13} />
                          <span>全社改善100件突破達成</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
                        Awwwards & Webby Awards 基準 自律クオリティ向上サイクル到達
                      </h3>
                      <p className="text-xs text-slate-400 font-light mt-0.5">
                        全社員からの生きたフィードバックを元に、高速イテレーション・デプロイゲート検証・完全静的エクスポート（SSG全50ルート）を突破。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-inner">
                      <Award size={14} className="text-amber-400" />
                      <span>QUALITY VERIFIED</span>
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </TiltCard>
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
              onClick={() => setStatusFilter("unresolved")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "unresolved"
                  ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ⚡ 未対応 ({unresolvedCount})
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
          </div>

          {/* 検索・カテゴリ・表示モード */}
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            {/* カテゴリ選択 */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="カテゴリで絞り込み"
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">全カテゴリ ({allItems.length})</option>
              {categories.filter((c) => c !== "all").map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({allItems.filter((t) => t.category === cat).length})
                </option>
              ))}
            </select>

            {/* 検索ボックス */}
            <div className="relative w-full sm:w-60">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワード検索..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* ビュー切替（リスト / カンバン） */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              <button
                onClick={() => setViewMode("list")}
                title="リスト表示"
                className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                title="カンバンボード表示"
                className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
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

        {/* カンバンボード表示 または リスト表示 */}
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {/* カラム 1: 検討中 / ToDo */}
            <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/90 space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="font-extrabold text-xs text-amber-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  📥 検討中 / ToDo
                </span>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {filteredTodos.filter((t) => t.status === "todo").length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredTodos
                  .filter((t) => t.status === "todo")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs space-y-2.5 transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic">{item.feedbackQuote}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                        <span>{item.author}</span>
                        {!item.issueNumber && (
                          <button
                            onClick={() => handleStatusChange(item.id, "in_progress")}
                            className="text-sky-700 hover:text-sky-900 font-bold bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded transition-colors"
                          >
                            対応中へ ➔
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* カラム 2: 対応中 / 進行中 */}
            <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200/80 space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-sky-200">
                <span className="font-extrabold text-xs text-sky-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  🚧 対応中 / 進行中
                </span>
                <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                  {filteredTodos.filter((t) => t.status === "in_progress").length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredTodos
                  .filter((t) => t.status === "in_progress")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-sky-200 shadow-2xs hover:shadow-xs space-y-2.5 transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{item.actionPlan}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                        <span>{item.author}</span>
                        {!item.issueNumber && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStatusChange(item.id, "todo")}
                              className="text-slate-600 hover:text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded"
                            >
                              ⬅ 戻す
                            </button>
                            <button
                              onClick={() => handleStatusChange(item.id, "done")}
                              className="text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded"
                            >
                              完了 ➔
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* カラム 3: 反映済み / 完了 */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                <span className="font-extrabold text-xs text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  ✅ 反映済み / 完了
                </span>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {filteredTodos.filter((t) => t.status === "done").length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredTodos
                  .filter((t) => t.status === "done")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs hover:shadow-xs space-y-2.5 transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{item.actionPlan}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                        <span>{item.author}</span>
                        {item.relatedLink && (
                          <Link
                            href={item.relatedLink}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-[10px]"
                          >
                            ページ確認 ➔
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* ToDoカード一覧 (リスト表示) */
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
        )}
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
                    onChange={(e) => setFormCategory(e.target.value as FeedbackTodoItem["category"])}
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
                    <option value="プロンプト">プロンプト・実務テンプレ</option>
                    <option value="運用・管理">運用・管理・ダッシュボード</option>
                    <option value="活用事例">活用事例・社内事例集</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    優先度
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as FeedbackTodoItem["priority"])}
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
