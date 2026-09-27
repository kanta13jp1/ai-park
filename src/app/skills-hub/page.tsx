import ComingSoonPage from "@/components/ComingSoonPage";

export default function SkillsHubPage() {
  return (
    <ComingSoonPage
      title="社内Skillsカタログ"
      subtitle="社内で共有する Antigravity の Skills（準備中）"
      message="社内で共有している Skills はまだありません。作成・確認が済んだものから掲載します。"
      planned={["社内で作った Skills の一覧と使い方", "Skills の作り方・共有のしかた"]}
      links={[
        { href: "/academy", label: "Antigravity Academy" },
        { href: "/contact", label: "Skills を作りたい・相談したい" },
      ]}
    />
  );
}
