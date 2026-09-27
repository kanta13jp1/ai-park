import ComingSoonPage from "@/components/ComingSoonPage";

export default function IdeaBoardPage() {
  return (
    <ComingSoonPage
      title="アイデア宣言ボード"
      subtitle="AIで自動化したい業務・作りたいエージェントのアイデアを共有する場所（準備中）"
      message="宣言の受付と一覧表示はまだ準備中です。アイデアは Google Chat の「AI勉強会」スペースで気軽に共有してください。"
      planned={["アイデアの宣言と一覧（部門・ステータスで絞り込み）", "既存の宣言をベースにした宣言", "完成したエージェントの報告"]}
      links={[
        { href: "/ai-projects", label: "社内AIプロジェクト一覧" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
    >
      {/* ご意見TODO-06：AIビジネスモデル提案コンテスト（暫定版） */}
      <details className="bg-white border border-amber-300 rounded-2xl p-5 shadow-2xs group">
        <summary className="cursor-pointer list-none flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-bold text-sm text-slate-900">🏆 社内AIビジネスモデル提案コンテスト（応募期間：2026/11/2〜12/18）</span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 self-start sm:self-center">
            暫定版：詳細は社長・杉村さんと協議のうえ正式決定します（クリックで詳細）
          </span>
        </summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <p><span className="font-bold text-slate-900">目的：</span>業務の効率化だけでなく、AIで新しい顧客価値や収益を生むビジネスモデルのアイデアを全社から集める</p>
            <p><span className="font-bold text-slate-900">対象：</span>全社員（個人・チームどちらでも可、1人何件でも応募可）</p>
            <p><span className="font-bold text-slate-900">応募期間：</span>2026年11月2日（月）〜12月18日（金）</p>
            <p><span className="font-bold text-slate-900">審査・表彰：</span>2027年1月中に審査し、全社の場で表彰</p>
            <p><span className="font-bold text-slate-900">審査員：</span>社長・杉村さん・AI推進担当</p>
            <p><span className="font-bold text-slate-900">審査の観点：</span>顧客にとっての価値／実現できるか／収益につながるか／AIならではの活かし方</p>
            <p><span className="font-bold text-slate-900">賞：</span>最優秀賞 1件・優秀賞 2件・アイデア賞（件数自由）。賞品の内容は協議のうえ決定</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
            <p className="font-bold text-amber-900">応募方法（社内のみで受付）</p>
            <p className="text-amber-900">
              アイデアには社外秘が含まれうるため、このサイトや GitHub では受け付けません。下の項目を記入し、
              Google Chat で AI推進担当 に DM で送ってください。
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-amber-900">
              <li>タイトル（ひとことで）</li>
              <li>誰のどんな困りごと・ニーズを解決するか</li>
              <li>AIをどう使うか</li>
              <li>どうやって収益・価値につながるか</li>
              <li>最初の一歩として試せること</li>
              <li>応募者（個人名またはチーム名・所属）</li>
            </ol>
            <p className="text-amber-800 pt-1">アイデアの種は、Google Chat の「AI勉強会」スペースで気軽に相談してからでもOKです。</p>
          </div>
        </div>
      </details>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-slate-900">📖 宣言するときのルール（予定）</h3>
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">1. アイデアの重複は恐れなくてOK</h4>
            <p className="text-slate-600 text-xs">
              「似たようなアイデアが既にあるかも」と遠慮する必要はありません。自部署ならではのユースケースや「既存の宣言をベースにして宣言」機能を使った派生開発を歓迎します。
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">2. 機密情報・顧客個人情報の非記載ルール</h4>
            <p className="text-slate-600 text-xs">
              宣言文および背景課題には、具体的な顧客企業名、エンドユーザーの個人情報、未公開案件コードネームを直接記載せず、一般化した業務名で記載してください。
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">3. 宣言したからといって「必ず作らなければならない」義務はありません</h4>
            <p className="text-slate-600 text-xs">
              「こんなのあったらいいな」という構想段階の宣言でも十分価値があります。他のエンジニアが「それ自分も欲しかったので作ります！」と手を挙げてくれることもあります。
            </p>
          </div>
        </div>
      </div>
    </ComingSoonPage>
  );
}
