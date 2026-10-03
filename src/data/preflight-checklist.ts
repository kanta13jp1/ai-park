/**
/**
 * MightyLINK AI Park: 開発者手動プリフライトチェック（UAT）マスターデータ
 * 
 * すべての機能はユーザーに公開する前に、開発者による実機手動確認
 * （仕様・事実確認、デザイン、操作性、視認性）をクリアする必要があります。
 */

export interface DetailedSubCheck {
  id: string;
  category: "no_fiction" | "official_announcement" | "link_integrity" | "other";
  groupTitle: string; // 例: "嘘や推測のデータがないか（事実性検証）"
  label: string;      // 短いチェック項目名
  detail: string;     // 具体的な手動点検ポイント・対象箇所
  verified: boolean;  // 実機確認結果
}

export interface UatCheckItem {
  passed: boolean;
  checkedAt?: string;
  inspector?: string;
  evidence: string;
  points: string[];
  subChecks?: DetailedSubCheck[];
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
    factAndSpec: UatCheckItem;
    // 2. デザイン・レイアウト（Design & Aesthetics）
    designAndLayout: UatCheckItem;
    // 3. 操作性・インタラクション（Usability & Interaction）
    usability: UatCheckItem;
    // 4. 視認性・アクセシビリティ（Readability & Accessibility）
    readability: UatCheckItem;
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
        points: [
          "【事実性】組織名・AI推進担当・Google CloudプロジェクトID等の実在確認",
          "【事実性】提供モデル（Gemini 3.1 Pro）および会社アカウントの実態一致",
          "【事実性】ヒーロー数値（12 Academy Lessons, LIVE Issue Sync, CoE Office Hour）の根拠確認",
          "【事実性】社員フィードバック引用（杉村さん・小林さん）が社内Chat実在データであることの確認",
          "【事実性】未検証・PoC機能（AIツール一覧等）が「工事中/準備中」で正しく保護されているか確認",
          "【整合性】ポータル理念（みんなでつくるAI広場）が全社アナウンス通知内容と一致しているか",
          "【整合性】3ステップ導線（導入→初級→実践）が公式案内通りの推奨利用フローとなっているか",
          "【整合性】セキュリティ注意・機密情報入力禁止ポリシーへの誘導が公式ルールに準拠しているか",
          "【整合性】AIPulseTickerや告知バナーの募集スケジュールが社内カレンダーと合致しているか",
          "【実在性】全リンク先（Academy, 導入ガイド, 事例集, カレンダー, ToDoボード等）の実在・疎通確認済",
        ],
        subChecks: [
          {
            id: "fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "組織・担当者・GCP基盤の実在性",
            detail: "会社名（株式会社Mighty LINK）、AI推進担当（梅澤）、GCPプロジェクトID（antigravity-pj-509006）が実在情報であり、架空の部署や架空の担当者が書かれていないこと。",
            verified: true,
          },
          {
            id: "fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "AIモデル・社内利用権限の実態一致",
            detail: "「Gemini 3.1 Pro & Google Antigravity」の表記が、社内会社アカウント（@ml-mightylink.com）に実際に割り当てられているモデル・認可環境と完全一致していること。",
            verified: true,
          },
          {
            id: "fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "ヒーローKPIバッジ数値の正確性",
            detail: "「12 Academy Lessons」が実際のレッスン総数（全3コース・12レッスン）と一致し、「LIVE Issue & Task Sync」「CoE Weekly Office Hour」の実稼働事実が存在すること。",
            verified: true,
          },
          {
            id: "fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "社員フィードバック引用の事実性",
            detail: "アナウンスバナーの「杉村さんからのシンプル導線・導入初級実践編」「小林さんからのアカウント疑問」等の引用が、社内Google Chatで実際に投稿された実在のフィードバックであること（捏造された架空の声でないこと）。",
            verified: true,
          },
          {
            id: "fact-05",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "未検証機能の「工事中/準備中」ガード遵守",
            detail: "トップページに並ぶ全カードにおいて、未連携・検証中の機能（AIツール一覧：PoC中、アンバサダー：準備中、セキュリティ基準：工事中等）が正しくガードされ、虚偽の「公開中」表示になっていないこと。",
            verified: true,
          },
          {
            id: "ann-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンスと一致しているか（整合性・周知遵守）",
            label: "ポータル趣旨・スローガンの合致",
            detail: "「みんなでつくるAI広場 — MightyLINK × Google Antigravity」というポータルの趣旨・目的が、全社メール・社内チャットのアナウンス内容と合致していること。",
            verified: true,
          },
          {
            id: "ann-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンスと一致しているか（整合性・周知遵守）",
            label: "3ステップ推奨導線の整合性",
            detail: "「Step 1: 導入編（所要10分） ➔ Step 2: 初級編 ➔ Step 3: 実践編」の推奨順序が、AI推進担当から全社員に通知された公式利用開始ステップと合致していること。",
            verified: true,
          },
          {
            id: "ann-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンスと一致しているか（整合性・周知遵守）",
            label: "セキュリティ原則・機密情報保護の徹底",
            detail: "個人情報や機密情報の入力禁止、会社アカウント利用徹底という全社セキュリティガイドラインに反する誤った誘導がないこと。",
            verified: true,
          },
          {
            id: "ann-04",
            category: "official_announcement",
            groupTitle: "② 公式アナウンスと一致しているか（整合性・周知遵守）",
            label: "イベント・募集スケジュールの整合性",
            detail: "AIPulseTickerやバナーで告知している「社内AI共創プロジェクト募集」「Weekly Office Hour」の内容が、社内カレンダー・公式告知と一致していること。",
            verified: true,
          },
          {
            id: "link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "全内部・外部リンクの疎通確認",
            detail: "Antigravity Academy、導入ガイド、社内AIプロジェクト、カレンダー、ToDoボード、アイデア宣言ボード等、トップページ内の全導線が実在ページへ遷移すること（確認済み）。",
            verified: true,
          },
        ],
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
        points: [
          "【事実性】社内組織名（ml-mightylink.com）およびプロジェクトID（antigravity-pj-509006）の正確性",
          "【事実性】Google公式ダウンロードURLおよびCLIインストールコマンド（PowerShell / Bash）の一致",
          "【事実性】利用料金（3,000円/人 目安）およびSpend cap（課金上限）設定手順の事実性",
          "【事実性】付与必須ロール（Cloud AI Companion ユーザー）および過大権限禁止の正確性",
          "【整合性】社内セキュリティ基準（Level 1〜3）および会社アカウント利用ルールの整合",
          "【整合性】安全設定（Security Preset: Default、Plan Review Policy: Always Ask）の遵守案内",
          "【整合性】セルフチェック診断ツール（3問判定）と社内機密情報保護規程の整合",
          "【整合性】トラブルシューティング（権限エラー・API未有効エラー）の解消手順の事実性",
          "【実在性】全公式外部リンクおよび社内関連リンク（/tools-hub, /learning等）の疎通確認済",
        ],
        subChecks: [
          {
            id: "guide-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "社内GCP接続情報の正確性",
            detail: "Google Cloud 組織（ml-mightylink.com）、社内プロジェクトID（antigravity-pj-509006）、プラン（Agent Platform）が実在情報であり、誤記がないこと。",
            verified: true,
          },
          {
            id: "guide-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "Google公式コマンド・URLの一致",
            detail: "ダウンロードURL（antigravity.google）やCLIインストールコマンド（irm ... | iex 等）がGoogle公式仕様と完全に一致していること。",
            verified: true,
          },
          {
            id: "guide-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "課金上限・予算試算ルールの事実性",
            detail: "「3,000円 × 利用人数」の予算作成手順、Spend cap enforcement仕様、無料トライアルクレジットの注意事項がGoogle Cloud仕様と合致していること。",
            verified: true,
          },
          {
            id: "guide-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "ロール権限・付与手順の正確性",
            detail: "一般利用者に付与するロール（roles/cloudaicompanion.user 等）および付与禁止ロール（オーナー/編集者禁止）が社内セキュリティポリシーに準拠していること。",
            verified: true,
          },
          {
            id: "guide-ann-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "社内セキュリティ基準（Level 1〜3）との整合",
            detail: "会社プロジェクト経由利用（個人Pro加入不要）および「社内AI利用のセキュリティ基準（Level 1〜3）」遵守の案内が全社アナウンスと一致していること。",
            verified: true,
          },
          {
            id: "guide-ann-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "安全設定（Security Preset）の遵守案内",
            detail: "STEP 6の安全設定（Security Preset: Default、Plan Review Policy: Always Ask、Full machineやTurbo modeの業務利用禁止）がAI推進室の公式ルールと一致していること。",
            verified: true,
          },
          {
            id: "guide-ann-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "セルフチェック診断ツール基準の合致",
            detail: "個人情報・社外秘情報・会社アカウントの3問判定ロジックが全社機密情報保護規程と完全一致していること。",
            verified: true,
          },
          {
            id: "guide-ann-04",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "トラブルシューティング手順の整合性",
            detail: "「追加のアクセス権が必要です（billing.resourceCosts.get）」「You can prompt the model to try again」の原因・対処法が実機検証済みの手順であること。",
            verified: true,
          },
          {
            id: "guide-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "全内部・外部リンクの疎通確認",
            detail: "Google公式ダウンロード、GCPコンソール、API有効化リンク、社内セキュリティ基準（/tools-hub）、教育コンテンツ（/learning）等の全導線が実在ページへ遷移すること（確認済み）。",
            verified: true,
          },
        ],
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
