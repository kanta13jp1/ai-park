import ComingSoonPage from "@/components/ComingSoonPage";

export default function AwsInfoPage() {
  return (
    <ComingSoonPage
      title="AWS・クラウド情報局"
      subtitle="社内での AWS・クラウド活用の情報（準備中）"
      message="社内の AWS の利用ルールや相談窓口は、まだ決まっていません。決まり次第、このページに掲載します。"
      planned={["社内での AWS・クラウドの利用ルールと申請方法", "相談窓口", "社内勉強会の資料・録画"]}
      links={[
        { href: "/guide", label: "Antigravity 導入ガイド" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
    />
  );
}
