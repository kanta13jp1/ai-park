import Link from "next/link";
import { BookOpen, MessageSquareText, FileCheck2, LifeBuoy } from "lucide-react";

// ご意見TODO-03「ここ見てやってみて」と言える AI初級編 チートシート
const sections = [
  {
    icon: MessageSquareText,
    color: "text-sky-600",
    title: "1. 頼み方の基本（4点セット）",
    items: [
      "目的：何のためにやるか（例：問い合わせ対応を早くしたい）",
      "対象：どのファイル・どの画面か（ファイル名を具体的に）",
      "条件：変えてはいけないこと・使う言語やルール",
      "完了の形：どうなれば終わりか（例：テストが通る・画面に表示される）",
    ],
    example: "「src/app/contact/page.tsx の送信ボタンを、必須項目が空のときは押せないようにしてください。見た目は変えないでください。」",
  },
  {
    icon: FileCheck2,
    color: "text-emerald-600",
    title: "2. ファイル編集を任せるときの流れ",
    items: [
      "作業前に Git でブランチを切る（導入ガイドの Git 手順を参照）",
      "まず「どう直すか計画だけ出して」と頼み、方針を確認してから実行させる",
      "AIが提示する変更（差分）を読んでから承認する。分からない変更は理由を質問する",
      "終わったら画面・テストで動作を確認し、問題なければコミットする",
    ],
  },
  {
    icon: LifeBuoy,
    color: "text-rose-600",
    title: "3. エラーが出たときの対処",
    items: [
      "エラーメッセージを省略せず全文そのまま貼り、「原因と直し方を説明して」と頼む",
      "直前に何をしたか（実行したコマンド・変更したファイル）も一緒に伝える",
      "同じ修正を3回繰り返しても直らないときは、いったん git restore で元に戻して頼み方を変える",
      "解決しないときはエラー文を添えて Office Hour / お問い合わせへ",
    ],
  },
];

export default function BeginnerCheatsheet() {
  return (
    <section className="bg-white border border-amber-200 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
              📖 AI初級編：まずはこれだけチートシート
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            インストールがまだの方は先に
            <Link href="/guide" className="underline font-semibold text-sky-700 mx-0.5">導入ガイド</Link>
            へ。AIエージェントに仕事を頼むときの基本を1枚にまとめました。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              {s.title}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed list-disc pl-4">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {s.example && (
              <p className="text-xs bg-white border border-sky-200 rounded-lg p-2.5 text-slate-700 leading-relaxed">
                <span className="font-bold text-sky-700">例：</span>
                {s.example}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
