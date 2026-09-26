export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  badge?: string;
  isExternal?: boolean;
}

export interface NavSection {
  title?: string;
  href?: string;
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
    href: "/how-to",
    items: [
      { name: "AIツール一覧", href: "/tools", icon: "🤖", badge: "🧪 PoC中" },
      { name: "教育用コンテンツ", href: "/learning", icon: "✍️" },
      { name: "AI活用インタビュー", href: "/interviews", icon: "🎙️", badge: "📋 準備中" },
      { name: "AWS・クラウド情報局", href: "/aws-info", icon: "☁️" },
      { name: "社内Skillsカタログ", href: "/skills-hub", icon: "🛠️", badge: "β版" },
    ]
  },
  {
    title: "🖥️ エージェント・ツール",
    href: "/agent-tools",
    items: [
      { name: "社内AIプロジェクト一覧", href: "/ai-projects", icon: "🏢", badge: "β版" },
      { name: "アイデア宣言ボード", href: "/idea-board", icon: "💡", badge: "β版" },
      { name: "Subagents活用事例", href: "/agent-cases", icon: "🟣", badge: "🧪 PoC中" },
      { name: "社内AI活用状況", href: "/adoption", icon: "👀", badge: "🧪 PoC中" },
      { name: "Gemini利用率", href: "/gemini-stats", icon: "✦", badge: "🚧 工事中" },
      { name: "AI Tools Hub", href: "/tools-hub", icon: "📍", badge: "🚧 工事中" },
    ]
  },
  {
    title: "🗨️ コミュニティ",
    items: [
      { name: "AIアンバサダー", href: "/ambassadors", icon: "🤝", badge: "📋 準備中" },
      { name: "AI Park カレンダー", href: "/calendar", icon: "🗓️", badge: "🚧 工事中" },
      { name: "ご意見・改善ToDo", href: "/feedback-todo", icon: "📋", badge: "β版" },
    ]
  },
  {
    items: [
      { name: "お問い合わせ", href: "/contact" },
      { name: "AIガバナンス(🌐リンク)", href: "https://antigravity.google/docs/permissions", isExternal: true },
    ]
  }
];
