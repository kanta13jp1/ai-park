import type { Metadata } from "next";

export interface RouteMetaEntry {
  title: string;
  description: string;
}

export const ROUTE_METADATA: Record<string, RouteMetaEntry> = {
  "/academy": {
    title: "Antigravity Academy",
    description: "公式ドキュメントと実機確認に基づく動画・図解付きカリキュラム（3コース・全12レッスン・評価テスト）",
  },
  "/adoption": {
    title: "社内AI活用状況（工事中）",
    description: "利用ログやアンケートなどの実データ連携に向けて準備中のページです。",
  },
  "/agent-cases": {
    title: "Subagents活用事例（工事中）",
    description: "社内で実際に稼働しているエージェント活用事例の収集・掲載に向けた準備中ページです。",
  },
  "/agent-tools": {
    title: "エージェント・ツール 総合ハブ",
    description: "社内AIプロジェクト一覧・アイデア宣言ボード・利用監視・MCP連携ガイドなどへの総合ハブ",
  },
  "/ai-projects": {
    title: "社内AIプロジェクト一覧",
    description: "社内で進行中のAI活用プロジェクトの可視化と GitHub Issue 連携ボード（β版）",
  },
  "/ambassadors": {
    title: "社内AIアンバサダー（準備中）",
    description: "第1期アンバサダーの公募・選定および相談窓口の案内ページ（準備中）",
  },
  "/antigravity-info": {
    title: "Antigravity 情報局",
    description: "Google Antigravity の機能解説・Agent Swarms・実行環境比較・実務実行例・リファレンスFAQ",
  },
  "/aws-info": {
    title: "AWS・クラウド情報局",
    description: "AWS 認定 6 資格（CLF-C02 / AIF-C01 / SAA-C03 / DVA-C02 / SOA-C03 / SAP-C02）統合学習ハブ",
  },
  "/azure-info": {
    title: "Azure・Microsoft Azure情報局",
    description: "Microsoft Azure 認定 8 資格（AZ-900 / AI-900 / DP-900 / SC-900 / AZ-104 / AI-103 / AI-200 / AZ-305）統合学習ハブ",
  },
  "/calendar": {
    title: "AI Park カレンダー",
    description: "社内AI勉強会やイベント予定の共有カレンダー（社内Googleアカウントで表示）",
  },
  "/contact": {
    title: "お問い合わせ・ライセンスFAQ",
    description: "AI推進担当への相談窓口、AI Office Hour 予約メモ作成、アカウント・ライセンスFAQ",
  },
  "/feedback-todo": {
    title: "ご意見・改善ToDoボード",
    description: "社員のご意見・改善要望と GitHub Issues をリアルタイム同期する改善バックログ（β版）",
  },
  "/gcp-info": {
    title: "GCP・Google Cloud情報局",
    description: "Google Cloud 認定全 11 資格（CDL / GAIL / ACE / ADP / PCA / PDE / PMLE / PCSE / PCDE / PCD / PCNE）統合学習ハブ",
  },
  "/gemini-stats": {
    title: "Antigravity / Gemini 利用監視",
    description: "社内 Google Cloud プロジェクトの無料トライアル残高・課金推移・利用実績の自動同期ダッシュボード（β版）",
  },
  "/guide": {
    title: "Google Antigravity 導入ガイド",
    description: "IDE・CLI（agy）の導入手順、会社 Google Cloud 設定、日本語化、安全な入力セルフチェック診断",
  },
  "/how-to": {
    title: "使い方・学び 総合ハブ",
    description: "導入ガイド・Academy・基礎チートシート・各種認定学習ハブへの総合案内ページ",
  },
  "/idea-board": {
    title: "アイデア宣言ボード",
    description: "業務改善・AI活用アイデアの宣言と協力者募集ボード（GitHub Issues・Google Chat連携 / β版）",
  },
  "/interviews": {
    title: "現場のAI活用インタビュー（準備中）",
    description: "社内の実践者インタビュー記事の取材・公開に向けた準備および立候補受付ページ",
  },
  "/ipa-info": {
    title: "情報処理技術者試験情報局",
    description: "IPA 情報処理技術者試験・安全確保支援士 全 13 区分（IP / SG / FE / AP / 高度9区分）統合学習ハブ",
  },
  "/learning": {
    title: "生成AI 学習コンテンツ",
    description: "AI初級編チートシート、穴埋め実務プロンプト集、安全利用の基本ルール",
  },
  "/lpic-info": {
    title: "LPIC・Linux情報局",
    description: "LPIC-1（101/102）・LPIC-2（201/202）・LPIC-3（300/303/305/306）統合学習ハブ",
  },
  "/mcp-hub": {
    title: "MCP 外部ツール連携ガイド",
    description: "Model Context Protocol の仕組み解説、mcp_config.json 設定テンプレート、安全利用チェックリスト",
  },
  "/news": {
    title: "最新AIニュース & リリースレーダー",
    description: "公式 RSS / Atom フィード自動巡回による生成AI・Antigravity 最新リリース動向",
  },
  "/preflight": {
    title: "開発者手動UAT管理（プリフライト）",
    description: "4大評価軸（仕様・デザイン・操作性・視認性）に基づくリリース前手動受入テスト管理コンソール",
  },
  "/roadmap": {
    title: "開発ロードマップ & 実装スケジュール",
    description: "AI Park の準備中・PoC中・工事中機能の解除条件と開発マイルストーン一覧",
  },
  "/skills-hub": {
    title: "社内Skillsカタログ",
    description: "AI Park 実運用 Skills（4件）、カスタマイズ機能比較、SKILL.md スターターテンプレート",
  },
  "/study-archive": {
    title: "AI勉強会アーカイブ",
    description: "AI勉強会の録画動画・議事メモ・次回課題の社内限定アーカイブ（β版）",
  },
  "/tools": {
    title: "AIツール検証マトリックス（PoC中）",
    description: "社内マスターシート同期中のAIツール一覧・PoC確認状況ビュー",
  },
  "/tools-hub": {
    title: "AI Tools Hub & セキュリティ基準",
    description: "社内AI利用のデータ取り扱いセキュリティ基準（Level 1〜3）と注意事項5箇条（暫定版）",
  },
  "/troubleshooting": {
    title: "Windows トラブルシューティング & FAQ",
    description: "PowerShell 実行ポリシー、Git 認証、gcloud/ADC、ポート競合の解決コマンド集",
  },
  "/usage-monitor": {
    title: "Antigravity / Gemini 利用監視",
    description: "社内 Google Cloud プロジェクトの無料トライアル残高・課金推移・利用実績ダッシュボード",
  },
};

export function getRouteMetadata(routePath: string): Metadata {
  const entry = ROUTE_METADATA[routePath];
  if (!entry) {
    return {};
  }
  return {
    title: entry.title,
    description: entry.description,
  };
}
