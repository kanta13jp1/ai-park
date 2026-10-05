import ComingSoonPage from "@/components/ComingSoonPage";

export default function AntigravityInfoPage() {
  return (
    <ComingSoonPage
      title="Antigravity情報局"
      subtitle="Antigravity の社内向けお知らせ（準備中）"
      message="社内向けのお知らせ・よくある質問を準備しています。使い方は導入ガイドと Antigravity Academy をご覧ください。"
      planned={["Antigravity の社内向けお知らせ（アップデート・設定変更など）", "よくある質問", "社内で共有する Rules・Skills の案内"]}
      links={[
        { href: "/guide", label: "Antigravity 導入ガイド" },
        { href: "/academy", label: "Antigravity Academy" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
    />
  );
}
