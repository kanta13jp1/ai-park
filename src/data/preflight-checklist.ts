/**
/**
 * MightyLINK AI Park: 開発者手動プリフライトチェック（UAT）マスターデータ
 * 
 * すべての機能はユーザーに公開する前に、開発者による実機手動確認
 * （仕様・事実確認、デザイン、操作性、視認性）をクリアする必要があります。
 */

export interface UatCheckItem {
  passed: boolean;
  checkedAt?: string;
  inspector?: string;
  evidence: string;
}

export interface FeaturePreflightRecord {
  id: string;
  name: string;
  path: string;
  targetAudience: "全社員" | "開発者・エンジニア" | "推進担当・管理者";
  lastVerifiedAt: string;
  verifiedBy: string;
  overallStatus: "passed" | "needs_work" | "under_review";
  // 4大手動評価軸
  checks: {
    // 1. 仕様・事実確認（Fact & Spec）
    factAndSpec: UatCheckItem & {
      points: string[];
    };
    // 2. デザイン・レイアウト（Design & Aesthetics）
    designAndLayout: UatCheckItem & {
      points: string[];
    };
    // 3. 操作性・インタラクション（Usability & Interaction）
    usability: UatCheckItem & {
      points: string[];
    };
    // 4. 視認性・アクセシビリティ（Readability & Accessibility）
    readability: UatCheckItem & {
      points: string[];
    };
  };
  environment: string; // 例: "Windows 11 / Chrome 129 / 1920x1080 & 375x812 (Mobile)"
  memo: string;
}

export const preflightChecklistMaster: FeaturePreflightRecord[] = [
  {
    id: "home",
    name: "ポータルトップ",
    path: "/",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/10/01",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "全社アナウンス、サイト目的、実在する機能へのリンクであることを確認済み",
        points: ["嘘や推測のデータがないか", "リンク先が実在するか", "公式アナウンスと一致しているか"],
      },
      designAndLayout: {
        passed: true,
        evidence: "HeroBanner、SpotlightCard、グリッドレイアウトのレスポンシブ破綻なし",
        points: ["PC/スマホで崩れがないか", "フォントサイズ・余白が適切か", "ダーク/ライト調和"],
      },
      usability: {
        passed: true,
        evidence: "クイック導線、検索バー、カードクリック、ヘッダー遷移の正常動作を確認",
        points: ["クリックやタップが軽快か", "意図せぬ画面遷移がないか", "キーボード操作可能か"],
      },
      readability: {
        passed: true,
        evidence: "3ステップの導入フローが平易な日本語で記述されていることを確認",
        points: ["専門用語に説明があるか", "次のアクションが明確か", "コントラストが十分か"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080 & スマホ実機エミュレーション",
    memo: "初期バージョン公開前の総合プリフライトチェック完了",
  },
  {
    id: "guide",
    name: "Antigravity導入ガイド",
    path: "/guide",
    targetAudience: "開発者・エンジニア",
    lastVerifiedAt: "2026/10/01",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "Google公式ドキュメントおよび社内GCPプロジェクトID（antigravity-pj-509006）との整合を確認",
        points: ["公式コマンドと一致しているか", "社内プロジェクトIDが正確か", "課金上限の記載が正しいか"],
      },
      designAndLayout: {
        passed: true,
        evidence: "WindowsAntigravityGuide、SafetySelfCheckerの配置、コードブロックの折返し確認",
        points: ["コードブロックが見やすいか", "タブ切り替えでレイアウトが崩れないか", "モバイル表示"],
      },
      usability: {
        passed: true,
        evidence: "ワンクリックコードコピー、外部リンク、セルフチェック質問のリアルタイム診断動作を確認",
        points: ["コピーボタンが動くか", "外部リンクが別タブで開くか", "診断が正しく再計算されるか"],
      },
      readability: {
        passed: true,
        evidence: "初心者にも分かりやすいPowerShellコマンドの実行例と警告アイコンの明示を確認",
        points: ["警告や注意点が目立つか", "コマンドの解説があるか", "手順番号が追えるか"],
      },
    },
    environment: "Windows 11 / PowerShell 7 / Chrome 129",
    memo: "Windows環境向け実践ガイドおよびセルフチェック診断ツールの追加確認完了",
  },
  {
    id: "learning",
    name: "生成AI 学習コンテンツ（プロンプト集＆セルフチェック）",
    path: "/learning",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/10/01",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "社内業務（議事録要約・テスト・通知・壁打ち）に準拠したプロンプトであることを確認",
        points: ["社内ルールに反するプロンプトがないか", "個人情報・社外秘のマスキング例が的確か"],
      },
      designAndLayout: {
        passed: true,
        evidence: "穴埋めフォーム（InteractivePromptLibrary）とリアルタイムプレビューの枠組み確認",
        points: ["フォーム入力時のガタつきがないか", "プレビュー欄が読みやすいか"],
      },
      usability: {
        passed: true,
        evidence: "リアルタイム入力反映、初期化リセット、ワンクリックコピー、セルフチェック診断動作を確認",
        points: ["リアルタイムで置換されるか", "ワンクリックコピーが動作するか", "診断結果が正しく切り替わるか"],
      },
      readability: {
        passed: true,
        evidence: "プレースホルダーの説明と変数の色分け、セキュリティ注意事項の視認性を確認",
        points: ["入力すべき箇所が明瞭か", "注意喚起（黄/赤色）が正しく認識できるか"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080",
    memo: "TODO-14（穴埋めプロンプト集）およびTODO-15（セルフチェック診断）の手動UAT完了",
  },
  {
    id: "gemini-stats",
    name: "Gemini利用統計ダッシュボード",
    path: "/gemini-stats",
    targetAudience: "推進担当・管理者",
    lastVerifiedAt: "2026/10/01",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "GAS Live Web API (v4) からの実数値取得、GCPプロジェクトID・課金アカウントIDの確定データ確認",
        points: ["API連携が本物か", "フォールバックJSONが正確か", "集計ラグの公式仕様注記があるか"],
      },
      designAndLayout: {
        passed: true,
        evidence: "KPIカード4枚、グラフ、同期ステータスバー、FAQアコーディオンの配置確認",
        points: ["カード数値の整列", "アコーディオン開閉時のスムーズさ", "ステータスバッジの明瞭さ"],
      },
      usability: {
        passed: true,
        evidence: "「最新データを再同期」ボタンのローディング動作、CSV出力、FAQ展開を確認",
        points: ["再同期ボタン押下時の動作", "CSVが文字化けせず開けるか", "FAQクリックの反応"],
      },
      readability: {
        passed: true,
        evidence: "「反映されないときの4大チェックリスト」の文字サイズとアイコン配置の視認性を確認",
        points: ["確認手順（①〜④）が迷わず読めるか", "フォントの強弱が適切か"],
      },
    },
    environment: "Windows 11 / Chrome / Excel (CSV出力確認)",
    memo: "TODO-16（データ同期ステータス＆FAQ表示）の実機UAT確認完了",
  },
  {
    id: "ai-projects",
    name: "社内AIプロジェクト一覧",
    path: "/ai-projects",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/10/01",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "実在する推進担当プロジェクト2件（COE-01, COE-02）とGitHub Issue連携の確認",
        points: ["架空のプロジェクトがないか", "Issue登録時の機密注意書きがあるか", "部署別プラクティスが実用的か"],
      },
      designAndLayout: {
        passed: true,
        evidence: "ステータスタグ、部署別ドロップダウン、実務フローカードの3列グリッド確認",
        points: ["フィルターバーの折り返し", "実務フローカードのレイアウト", "モバイル幅での表示"],
      },
      usability: {
        passed: true,
        evidence: "ステータス絞り込み、部署別絞り込み、Issue登録ボタン、更新ボタンの動作を確認",
        points: ["絞り込みが即座に連動するか", "該当なし表示が機能するか", "外部リンクが正常か"],
      },
      readability: {
        passed: true,
        evidence: "各部署の実務課題・実践手順（1〜3ステップ）・削減効果の明瞭なテキスト構成を確認",
        points: ["ステップ番号が追いやすいか", "効果が一目でわかるか"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080",
    memo: "TODO-17（部署別絞り込み＆実践テンプレ）の手動UAT完了",
  },
  {
    id: "feedback-todo",
    name: "ご意見・改善ToDoボード",
    path: "/feedback-todo",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/10/01",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "社内Google Chatで寄せられた実在のご意見・GitHub Issueのリアルタイム同期を確認",
        points: ["捏造された意見がないか", "GitHub Issue連携が本番リポジトリと一致しているか"],
      },
      designAndLayout: {
        passed: true,
        evidence: "リスト表示と3列カンバンボード（検討中・対応中・反映済み）の切り替え確認",
        points: ["カンバンボードの横スクロール/レスポンシブ", "ステータスバッジの視認性"],
      },
      usability: {
        passed: true,
        evidence: "カテゴリ絞り込み、ステータス切り替え、起票モーダル、CSV出力の動作を確認",
        points: ["モーダル開閉", "CSVエクスポート動作", "検索フィルターの即応性"],
      },
      readability: {
        passed: true,
        evidence: "引用メッセージ、対応方針、関連リンクの視認性を確認",
        points: ["誰からの意見か、何をするかが明瞭か"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080",
    memo: "TODO-13（カンバン表示＆カテゴリフィルター）の手動UAT完了",
  },
  {
    id: "preflight",
    name: "開発者手動UAT管理（プリフライト）",
    path: "/preflight",
    targetAudience: "推進担当・管理者",
    lastVerifiedAt: "2026/10/03",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "4大評価軸、チェックリスト項目、エビデンス記録要件が実運用基準に合致していることを確認",
        points: ["チェック項目に漏れがないか", "事実確認の基準が明確か"],
      },
      designAndLayout: {
        passed: true,
        evidence: "KPIカード4枚、機能セレクター、4大評価軸カード、報告書コピーボタンのレスポンシブ配置確認",
        points: ["カードやグリッドの整列", "コピーボタンの視認性", "配色の調和"],
      },
      usability: {
        passed: true,
        evidence: "機能切り替え、Markdownレポート生成＆クリップボードコピー、外部リンクの動作を確認",
        points: ["レポートコピーが動作するか", "機能選択で右ペインが即座に切り替わるか"],
      },
      readability: {
        passed: true,
        evidence: "ガバナンス宣誓文、各評価軸の確認ポイントと合格エビデンスの明瞭なテキスト構成を確認",
        points: ["開発者が迷わずチェックできるか", "承認基準が一目でわかるか"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080",
    memo: "手動UAT管理コンソールの実機動作確認完了",
  },
];
