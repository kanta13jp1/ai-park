import ComingSoonPage from "@/components/ComingSoonPage";

export default function AgentCasesPage() {
  return (
    <ComingSoonPage
      title="Subagents活用事例"
      subtitle="社内でのエージェント活用事例（準備中）"
      message="社内の実際の活用事例を集めています。事例がそろい次第、効果とあわせて掲載します。"
      planned={["社内で実際に使っているエージェントの構成", "導入前後の作業時間などの効果（実測値）"]}
      links={[
        { href: "/ai-projects", label: "社内AIプロジェクト一覧" },
        { href: "/interviews", label: "取材に立候補する" },
      ]}
    />
  );
}
