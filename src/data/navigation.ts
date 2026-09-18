export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  badge?: string;
  isExternal?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    items: [
      { name: "ホーム", href: "/" },
      { name: "開発ロードマップ", href: "/roadmap", icon: "🗺️", badge: "進行中" }
    ]
  },
  {
    title: "■ 使い方・学び",
    items: [
      { name: "Antigravity導入ガイド", href: "/guide", icon: "🚀" },
      { name: "社内Skillsカタログ", href: "/skills-hub", icon: "🛠️", badge: "準備中" },
      { name: "MCP外部ツール連携", href: "/mcp-hub", icon: "🔌" },
      { name: "Antigravity情報局", href: "/antigravity-info", icon: "🌌" },
    ]
  },
  {
    title: "🖥️ エージェント・ツール",
    items: [
      { name: "アイデア宣言ボード", href: "/idea-board", icon: "💡", badge: "準備中" },
      { name: "Subagents活用事例", href: "/agent-cases", icon: "🟣", badge: "準備中" },
      { name: "社内AI活用状況", href: "/adoption", icon: "👀", badge: "準備中" },
      { name: "利用状況ダッシュボード", href: "/gemini-stats", icon: "💎", badge: "モック" },
      { name: "AI Tools Hub", href: "/tools-hub", icon: "📍", badge: "準備中" },
    ]
  },
  {
    title: "🗨️ コミュニティ",
    items: [
      { name: "AIアンバサダー", href: "/ambassadors", badge: "準備中" },
    ]
  },
  {
    items: [
      { name: "お問い合わせ", href: "/contact" },
      { name: "AIガバナンス(🌐リンク)", href: "https://antigravity.google/docs/permissions", isExternal: true },
    ]
  }
];
