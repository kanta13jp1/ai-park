import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import { AlertTriangle, CheckCircle2, Lock, ShieldCheck, XCircle } from "lucide-react";

const aiGuidelines = [
  {
    title: "機密・個人情報は入力先を選ぶ",
    body: "顧客の個人情報・社内機密・未公開ソースコードは、会社契約で学習不使用が担保されたAI（Level 1）にのみ入力します。個人アカウントのAIには入力しません。",
  },
  {
    title: "入力前にマスキングする",
    body: "Level 2 のツールでは、氏名・電話番号・メールアドレス・顧客名・案件名などを「顧客A」「xxx-xxxx」のように置き換えてから入力します。",
  },
  {
    title: "出力は必ず人が確認する",
    body: "AIの回答やコードには誤りが含まれます。事実・数値・法令・セキュリティに関わる内容は一次情報で確認し、コードはレビューとテストを通してから使います。",
  },
  {
    title: "成果物の責任は使った人が持つ",
    body: "AIで作った資料・コードでも、社外に出す・本番に反映する責任は利用者にあります。他者の著作物をそのまま出力させて使うことは避けます。",
  },
  {
    title: "迷ったら使う前に相談する",
    body: "新しいツールの業務利用や、扱ってよいデータか判断できない場合は、利用前にAI推進担当（お問い合わせ・Office Hour）へ相談してください。",
  },
];

export default function ToolsHubPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner title="AI Tools Hub" subtitle="社内AI利用のセキュリティ基準と注意事項" />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* セキュリティマトリクス基準表 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>社内データ取り扱いセキュリティ基準 (早見表)</span>
            </h3>
            <span className="text-xs text-slate-400">AI推進担当 作成</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Level 1: 社内機密・コード入力可</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                対象: <strong>会社契約のAI（会社の Google Cloud プロジェクト経由の Antigravity 等）</strong><br />
                会社として契約し、入力データをモデル学習に使わないことが契約上担保されているサービス。社内ソースコードや設計書の投入が可能です。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 font-bold">
                <AlertTriangle size={16} className="text-amber-600" />
                <span>Level 2: マスキング必須</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                対象: <strong>確認中（会社として利用を認めたツールが決まり次第掲載）</strong><br />
                個人情報（氏名、電話番号等）や特定顧客の識別情報は必ず別の文字に置き換えて（マスキングして）から入力してください。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <div className="flex items-center space-x-2 text-rose-800 font-bold">
                <XCircle size={16} className="text-rose-600" />
                <span>Level 3: 一般公開情報のみ</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                対象: <strong>個人アカウントのAIツール（個人アカウントの Antigravity を含む）</strong><br />
                個人向け規約が適用されるため、顧客情報・社内機密・未公開ソースコードは入力しないでください。公開情報を使った学習・試用にとどめます。
              </p>
            </div>
          </div>
        </div>

        {/* 社内AI利用の注意事項（案） */}
        <div id="ai-guidelines" className="scroll-mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>社内AI利用の注意事項 5箇条</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 self-start sm:self-center">
              暫定版（2026/09/26〜）：詳細は社長・杉村さんと協議のうえ正式決定します
            </span>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {aiGuidelines.map((g, i) => (
              <li key={g.title} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{g.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{g.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* データ種別ごとの入力可否判定表 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>データ種別ごとの入力可否判定表</span>
            </h3>
            <span className="text-xs text-slate-400">迷ったらここを確認</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-bold">データ種別</th>
                  <th className="py-2.5 px-3 font-bold text-emerald-700">Level 1 (会社契約)</th>
                  <th className="py-2.5 px-3 font-bold text-amber-700">Level 2 (確認中ツール)</th>
                  <th className="py-2.5 px-3 font-bold text-rose-700">Level 3 (個人アカウント)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">社内ソースコード（独自ロジック）</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-amber-700 font-medium">⚠️ 固有識別子を置換</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">社内設計書・技術仕様メモ</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-amber-700 font-medium">⚠️ 顧客名・案件名を置換</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">顧客情報（個人名・電話・メール・契約内容）</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 原則禁止（要事前承認）</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">❌ 入力禁止</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">社内連絡文・メール下書き（定型文作成）</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 氏名伏せ字で可</td>
                  <td className="py-2.5 px-3 text-amber-700 font-medium">⚠️ 完全一般化して可</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">一般技術の調査・言語仕様・エラー調査</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-medium">⭕ 入力可</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* マスキング実践ガイド */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>実践！マスキングの具体例 (Before / After)</span>
            </h3>
            <span className="text-xs text-slate-400">入力前のセルフチェック</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <XCircle size={15} /> 危険な入力例（NG）
              </span>
              <div className="p-3 bg-white rounded-lg border border-rose-200 font-mono text-[11px] text-slate-700 space-y-1">
                <p>「〇〇商事の佐藤部長（sato@example.com）から受領した受注テーブルのデータ移行SQLを書いて。接続先は 192.168.1.100、パスワードは P@ssw0rd です」</p>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                ※顧客企業名、担当者個人名、メールアドレス、内部IPアドレス、認証情報が生のまま含まれており重大インシデントに直結します。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={15} /> 安全な入力例（OK）
              </span>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-700 space-y-1">
                <p>「顧客A社の受注テーブル（カラム: id, amount, created_at）から新テーブルへデータ移行するPostgreSQLのSQLを作成してください。接続情報は環境変数から読み込む前提です」</p>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                ※企業名を抽象化し、個人情報や認証情報を完全に除外。必要なスキーマ構造のみを渡しているため安全です。
              </p>
            </div>
          </div>
        </div>

        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：会社として使えるAIツールの一覧を準備しています"
          message="会社として利用を認めるAIツールと、その利用申請の方法はまだ決まっていません。決まり次第、ここに掲載します。それまでは、使う前に AI推進担当へ相談してください。"
        />
      </div>
    </div>
  );
}
