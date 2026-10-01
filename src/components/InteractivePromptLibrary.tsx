"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  FileText,
  Code2,
  Mail,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";

interface PromptTemplate {
  id: string;
  title: string;
  category: "minutes" | "code" | "mail" | "planning";
  categoryLabel: string;
  categoryIcon: typeof FileText;
  description: string;
  placeholders: {
    key: string;
    label: string;
    placeholder: string;
    defaultValue: string;
    type?: "input" | "textarea" | "select";
    options?: string[];
  }[];
  templateFn: (values: Record<string, string>) => string;
}

const TEMPLATES: PromptTemplate[] = [
  {
    id: "minutes-summary",
    title: "会議議事録の要約＆ToDo抽出",
    category: "minutes",
    categoryLabel: "議事録・要約",
    categoryIcon: FileText,
    description: "長い文字起こしやメモから、決定事項とネクストアクション（担当者・期日付き）を整理します。",
    placeholders: [
      {
        key: "meetingName",
        label: "会議・定例名",
        placeholder: "例: 2026年10月期 開発進捗定例",
        defaultValue: "2026年10月期 開発進捗定例",
        type: "input",
      },
      {
        key: "focus",
        label: "特に重視して抽出したいこと",
        placeholder: "例: 決定事項と各メンバーの宿題ToDo",
        defaultValue: "決定事項と各メンバーの宿題ToDo",
        type: "input",
      },
      {
        key: "rawNotes",
        label: "メモ・文字起こし本文",
        placeholder: "会議のメモや発言ログをここに貼り付けてください（個人名は仮名または役職に置き換えてください）",
        defaultValue: "・来週月曜までにAntigravityの社内利用規程の初稿を作成する（担当：田中）\n・GAS連携の同期不具合について、APIエンドポイントの権限を再確認する\n・次回ミーティングは木曜15時〜",
        type: "textarea",
      },
    ],
    templateFn: (v) => `あなたは優秀な社内業務アシスタントです。
以下の会議メモをもとに、社内メンバーがひと目で把握できる構造化された議事要約を作成してください。

■ 会議名: ${v.meetingName || "（未指定）"}
■ 重視する点: ${v.focus || "決定事項とToDo"}

【入力メモ】
${v.rawNotes || "（ここにメモを記入）"}

【出力フォーマット】
1. 会議のゴール・背景（2〜3行）
2. 決定したこと（箇条書き）
3. 保留・次回持ち越し事項（箇条書き）
4. ネクストアクション（ToDo一覧：| 担当者 | タスク | 期限 | 形式の表）

※推測による事実の捏造は避け、メモに書かれていない事項は「未定・確認中」と明記してください。`,
  },
  {
    id: "code-test-gen",
    title: "TypeScript / React コンポーネントのテストコード生成",
    category: "code",
    categoryLabel: "開発・コード",
    categoryIcon: Code2,
    description: "既存の関数やコンポーネントコードから、エッジケースを考慮したJest/Vitest単体テストを作成します。",
    placeholders: [
      {
        key: "framework",
        label: "テストフレームワーク",
        placeholder: "Vitest / Jest",
        defaultValue: "Vitest / Testing Library",
        type: "select",
        options: ["Vitest / Testing Library", "Jest", "Playwright", "Node.js組み込みテスト"],
      },
      {
        key: "targetFile",
        label: "対象ファイル名",
        placeholder: "例: src/utils/formatDate.ts",
        defaultValue: "src/utils/formatDate.ts",
        type: "input",
      },
      {
        key: "codeSnippet",
        label: "テスト対象コード",
        placeholder: "テスト対象の関数やReactコンポーネントのソースコードを貼り付けてください",
        defaultValue: `export function formatDate(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "不正な日付";
  return d.toISOString().split("T")[0];
}`,
        type: "textarea",
      },
    ],
    templateFn: (v) => `あなたはシニアフロントエンドエンジニアです。
以下の対象コードに対する、網羅的で堅牢な単体テストコードを作成してください。

■ テストツール: ${v.framework}
■ 対象ファイル: ${v.targetFile}

【対象コード】
\`\`\`typescript
${v.codeSnippet}
\`\`\`

【要件】
- 正常系テスト（一般的な引数・動作）
- 異常系・境界値テスト（null, undefined, 不正値, 空文字など）
- テストケース名（it / test）は日本語でわかりやすく意図を記述
- モックや前準備が必要な場合は最小限で記述`,
  },
  {
    id: "mail-draft",
    title: "社内通知・お知らせメールの下書き作成",
    category: "mail",
    categoryLabel: "案内・メール",
    categoryIcon: Mail,
    description: "全社や部署向けのお知らせメールを、失礼のないトーンと要点が伝わる構成で作成します。",
    placeholders: [
      {
        key: "targetAudience",
        label: "宛先（誰向けか）",
        placeholder: "例: 全社員、プロジェクト関係者各位",
        defaultValue: "全社社員の皆様",
        type: "input",
      },
      {
        key: "purpose",
        label: "お知らせの主旨・目的",
        placeholder: "例: Antigravity利用統計ダッシュボードの公開について",
        defaultValue: "社内AIポータル「AI Park」にWindows向け実践ガイドが追加された件",
        type: "input",
      },
      {
        key: "keyPoints",
        label: "伝えたいポイント（箇条書き）",
        placeholder: "日程、URL、対象者、依頼事項など",
        defaultValue: "・Windows (PowerShell) 環境でのエラー対策ガイドを新設\n・プロンプトの安全利用ルール早見表を公開\n・不明点はお問い合わせまたはOffice Hourへ",
        type: "textarea",
      },
    ],
    templateFn: (v) => `以下の条件で、社内アナウンス用の丁寧かつ要点が明確な通知文を作成してください。

■ 宛先: ${v.targetAudience}
■ 目的: ${v.purpose}

【盛り込みたい要点】
${v.keyPoints}

【作成ルール】
- 忙しい社員でも「結論・実施すべきこと」が冒頭でわかる構成
- 重要な期日やURL、リンク先は目立たせる
- 問い合わせ先（AI推進事務局）を末尾に添える`,
  },
  {
    id: "planning-ideation",
    title: "業務改善アイデアの壁打ち＆課題分析",
    category: "planning",
    categoryLabel: "企画・壁打ち",
    categoryIcon: Lightbulb,
    description: "「こんなことをやってみたい」というざっくりとしたアイデアから、課題や実現手順を構造化します。",
    placeholders: [
      {
        key: "currentPain",
        label: "現在困っていること・現状の課題",
        placeholder: "例: 毎月末の請求書チェックに半日かかっていてミスが起きやすい",
        defaultValue: "毎月末の経費精算やレシート確認を手作業で突合しており、時間がかかっている",
        type: "textarea",
      },
      {
        key: "idea",
        label: "やってみたいこと・イメージ",
        placeholder: "例: AIでレシート画像から金額と日付を抽出して自動突合したい",
        defaultValue: "Gemini 3.1 Proのマルチモーダル機能でレシート画像を読み取り、スプレッドシートに自動記入したい",
        type: "input",
      },
    ],
    templateFn: (v) => `あなたは社内業務変革（DX）コンサルタントです。
以下の業務課題とアイデアをもとに、実現可能性・リスク・導入ステップを多角的に分析・提案してください。

■ 現状の課題:
${v.currentPain}

■ やってみたいアイデア:
${v.idea}

【出力構成】
1. アイデアの評価（実現難易度: 低/中/高、費用対効果の期待度）
2. 期待されるメリット・業務削減効果
3. 想定されるリスク・懸念点（セキュリティ、読み取り精度、例外対応）
4. PoC（実験検証）に向けた最初の3ステップ`,
  },
];

export default function InteractivePromptLibrary() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    TEMPLATES[0].placeholders.forEach((p) => {
      init[p.key] = p.defaultValue;
    });
    return init;
  });
  const [isCopied, setIsCopied] = useState(false);

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  const handleTemplateSelect = (tmpl: PromptTemplate) => {
    setSelectedTemplateId(tmpl.id);
    const newValues: Record<string, string> = {};
    tmpl.placeholders.forEach((p) => {
      newValues[p.key] = p.defaultValue;
    });
    setValues(newValues);
    setIsCopied(false);
  };

  const handleValueChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setIsCopied(false);
  };

  const handleReset = () => {
    const defaultVals: Record<string, string> = {};
    currentTemplate.placeholders.forEach((p) => {
      defaultVals[p.key] = p.defaultValue;
    });
    setValues(defaultVals);
    setIsCopied(false);
  };

  const generatedPrompt = currentTemplate.templateFn(values);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // フォールバック
      const textarea = document.createElement("textarea");
      textarea.value = generatedPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <section id="interactive-prompts" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              実務ですぐ使えるプロンプト集（穴埋め入力＆ワンクリックコピー）
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            プレースホルダーに業務内容を入力するだけで、社内ルールに即した安全なプロンプトがリアルタイムで完成します。
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 self-start sm:self-auto">
          <span>⚡ コピペですぐ動く</span>
        </div>
      </div>

      {/* テンプレート選択タブ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TEMPLATES.map((tmpl) => {
          const Icon = tmpl.categoryIcon;
          const isSelected = tmpl.id === selectedTemplateId;
          return (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateSelect(tmpl)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
              }`}
            >
              <Icon size={14} className={isSelected ? "text-cyan-300" : "text-slate-400"} />
              <span>{tmpl.title}</span>
            </button>
          );
        })}
      </div>

      {/* メイン編集エリア：左に入力フォーム、右にプレビュー＆コピー */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 左側：穴埋め入力フォーム */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sliders size={14} className="text-indigo-600" />
              変数（プレースホルダー）の入力
            </span>
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold cursor-pointer transition-colors"
            >
              <RotateCcw size={12} />
              初期値に戻す
            </button>
          </div>

          <div className="space-y-3.5">
            {currentTemplate.placeholders.map((p) => (
              <div key={p.key} className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {p.label}
                </label>
                {p.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={values[p.key] ?? ""}
                    onChange={(e) => handleValueChange(p.key, e.target.value)}
                    placeholder={p.placeholder}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  />
                ) : p.type === "select" ? (
                  <select
                    value={values[p.key] ?? ""}
                    onChange={(e) => handleValueChange(p.key, e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    {p.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={values[p.key] ?? ""}
                    onChange={(e) => handleValueChange(p.key, e.target.value)}
                    placeholder={p.placeholder}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  />
                )}
              </div>
            ))}
          </div>

          {/* セーフティリマインダー */}
          <div className="flex items-start gap-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-800">
            <ShieldAlert size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>社内セキュリティ注意:</strong> お客様の個人情報（氏名・メールアドレス・電話番号等）や本番アクセスキーは直接入力せず、仮名（「田中様」「&lt;API_KEY&gt;」等）に置換してください。
            </p>
          </div>
        </div>

        {/* 右側：生成されたプロンプトプレビュー＆ワンクリックコピー */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles size={14} />
                完成プロンプト（リアルタイムプレビュー）
              </span>
              <button
                onClick={handleCopy}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCopied
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check size={14} />
                    <span>コピー完了！</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>プロンプトをコピー</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 max-h-[380px] overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-300">
                {generatedPrompt}
              </pre>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span>💡 Antigravity または Gemini Webの入力欄へそのまま貼り付けて実行できます</span>
            <span className="font-mono text-slate-500">{generatedPrompt.length} 文字</span>
          </div>
        </div>
      </div>
    </section>
  );
}
