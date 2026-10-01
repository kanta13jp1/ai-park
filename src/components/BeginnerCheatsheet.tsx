import Link from "next/link";
import SpotlightCard from "@/components/SpotlightCard";
import { BookOpen, MessageSquareText, FileCheck2, LifeBuoy, Sparkles } from "lucide-react";

// ご意見TODO-03「ここ見てやってみて」と言える AI初級編 チートシート
const sections = [
  {
    icon: MessageSquareText,
    color: "text-sky-600",
    bgIcon: "bg-sky-50 text-sky-600 border-sky-100",
    spotlightColor: "rgba(14, 165, 233, 0.15)",
    title: "1. 頼み方の基本（4点セット）",
    items: [
      "目的：何のためにやるか（例：問い合わせ対応を早くしたい）",
      "対象：どのファイル・どの画面か（ファイル名を具体的に明記）",
      "条件：変えてはいけないこと・使う言語や社内ルール",
      "完了の形：どうなれば終わりか（例：テストが通る・画面に正しく表示される）",
    ],
    example: "「src/app/contact/page.tsx の送信ボタンを、必須項目が空のときは押せないようにしてください。デザインと配置は変えないでください。」",
  },
  {
    icon: FileCheck2,
    color: "text-emerald-600",
    bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-100",
    spotlightColor: "rgba(16, 185, 129, 0.15)",
    title: "2. ファイル編集を任せるときの流れ",
    items: [
      "作業前に必ず Git でブランチを切る（導入ガイドの Git 手順を参照）",
      "まず「どう直すか計画だけ出して」と頼み、方針を確認してから実行させる",
      "AIが提示する変更（差分）を読んでから承認する。分からない変更は理由を質問する",
      "終わったら画面・テストで動作を確認し、問題なければコミットする",
    ],
  },
  {
    icon: LifeBuoy,
    color: "text-rose-600",
    bgIcon: "bg-rose-50 text-rose-600 border-rose-100",
    spotlightColor: "rgba(244, 63, 94, 0.15)",
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
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              AI初級編：まずはこれだけチートシート
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            インストールがまだの方は先に
            <Link href="/guide" className="underline font-bold text-indigo-600 mx-1 hover:text-indigo-700">導入ガイド</Link>
            へ。AIエージェントに仕事を頼むときの基本を1枚に凝縮しました。
            体系的に学んで修了証を取りたい方は
            <Link href="/academy" className="underline font-bold text-cyan-600 mx-1 hover:text-cyan-700">Antigravity Academy</Link>
            へ。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {sections.map((s) => (
          <SpotlightCard
            key={s.title}
            spotlightColor={s.spotlightColor}
            className="bg-slate-50/60 border-slate-200/80"
          >
            <div className="p-5 space-y-3 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${s.bgIcon} shadow-2xs`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug tracking-tight">
                    {s.title}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc pl-4 font-normal">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {s.example && (
                <div className="mt-2 text-xs bg-white/90 border border-sky-200/80 rounded-xl p-3 text-slate-700 leading-relaxed shadow-2xs">
                  <span className="font-bold text-sky-700 block mb-1">プロンプト入力例:</span>
                  <span className="italic text-slate-600">&ldquo;{s.example}&rdquo;</span>
                </div>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
