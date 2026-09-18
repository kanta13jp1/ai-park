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
      { name: "AIツール一覧", href: "/tools", icon: "🤖" },
      { name: "教育用コンテンツ", href: "/learning", icon: "✍️", badge: "公開中" },
      { name: "AI活用インタビュー", href: "/interviews", icon: "🎙️" },
      { name: "AWS・クラウド情報局", href: "/aws-info", icon: "☁️" },
      { name: "社内Skillsカタログ", href: "/skills-hub", icon: "🛠️", badge: "β" },
    ]
  },
  {
    title: "🖥️ エージェント・ツール",
    items: [
      { name: "アイデア宣言ボード", href: "/idea-board", icon: "💡", badge: "β公開" },
      { name: "Subagents活用事例", href: "/agent-cases", icon: "🟣", badge: "公開中" },
      { name: "社内AI活用状況", href: "/adoption", icon: "👀", badge: "公開中" },
      { name: "利用状況ダッシュボード", href: "/gemini-stats", icon: "💎", badge: "稼働中" },
      { name: "AI Tools Hub", href: "/tools-hub", icon: "📍", badge: "公開中" },
    ]
  },
  {
    title: "🗨️ コミュニティ",
    items: [
      { name: "AIアンバサダー", href: "/ambassadors", icon: "🤝", badge: "稼働中" },
      { name: "ご意見・改善ToDo", href: "/feedback-todo", icon: "📋", badge: "新着" },
    ]
  },
  {
    items: [
      { name: "お問い合わせ", href: "/contact" },
      { name: "AIガバナンス(🌐リンク)", href: "https://antigravity.google/docs/permissions", isExternal: true },
    ]
  }
];
