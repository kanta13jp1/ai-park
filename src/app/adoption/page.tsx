import ComingSoonPage from "@/components/ComingSoonPage";

export default function AdoptionPage() {
  return (
    <ComingSoonPage
      title="社内AI活用状況"
      subtitle="全社・部署ごとの AI 活用状況（準備中）"
      message="利用ログやアンケートなどの実データと連携できるまでは、数値を表示しません。"
      planned={["全社・部署ごとの AI ツールの利用状況", "削減できた作業時間などの効果"]}
      links={[{ href: "/ai-projects", label: "社内AIプロジェクト一覧" }]}
    />
  );
}
