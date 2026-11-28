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
          "【事実性】ヒーロー数値（3 Academy Courses, LIVE Issue & Task Sync, Office Hour 相談）の根拠確認",
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
            detail: "会社名（株式会社Mighty LINK）、AI推進担当（梅澤）、GCPプロジェクトID（antigravity-pj-xxxxxx）が実在情報であり、架空の部署や架空の担当者が書かれていないこと。",
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
    id: "news",
    name: "最新AIニュース & リリースレーダー",
    path: "/news",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/10/03",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/10/03",
        inspector: "梅澤（AI推進担当）",
        evidence: "実在する公式発表（Google DeepMind Gemini 4 Argon、Gemini 3.1 Pro、Antigravity、Vertex AI、MCP、社内リリース）の一次ソースおよび実動機能との100%整合を確認",
        points: [
          "架空や推測のニュース・発表が含まれていないか",
          "社内リリース（preflight稼働、ToDoフィルター新設等）の事実性",
          "一次ソースリンク（公式ドキュメント・ポータル）が実在し404にならないか"
        ],
        subChecks: [
          {
            id: "news-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "Gemini 4 Argon, Claude Opus 5.5, DeepSeek-V4.1-Flash 等の事実性",
            detail: "Google DeepMind（Gemini 4 Argon）、Anthropic（Claude Opus 5.5 / Fable 5.1）、DeepSeek（V4.1-Flash）、xAI（Grok 4.7）の各社公式発表・技術仕様と完全一致していること。",
            verified: true,
          },
          {
            id: "news-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "OpenAI Codex/Canvas(dots), Manus, Devin等の実動性",
            detail: "OpenAIのCanvas（dots編集）、Manus（汎用自律エージェント）、Cognition（Devin CI連携）の一次情報・公式仕様に実在すること。",
            verified: true,
          },
          {
            id: "news-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "Model Context Protocol (MCP) 標準化動向の実在性",
            detail: "オープン標準仕様（modelcontextprotocol.io）および対応ツールエコシステムの急拡大が実在事実であること。",
            verified: true,
          },
          {
            id: "news-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "社内AI Park更新（プリフライト・ToDo）の完全一致",
            detail: "AI Parkの/preflight稼働および/feedback-todo未対応フィルター新設が、社内本番リポジトリの実稼働状況と100%一致していること。",
            verified: true,
          },
          {
            id: "news-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "社内Antigravity・Gemini 3.1 Pro 認可状況との合致",
            detail: "全社アナウンスされたGCPプロジェクト（antigravity-pj-xxxxxx）および認可アカウント規程に準拠した内容であること。",
            verified: true,
          },
          {
            id: "news-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "社内実務へのインパクト解説の的確性",
            detail: "各ニュースカードに記載された「社内実務への影響」「おすすめ対象」が過剰な誇大広告にならず、実務の安全性に配慮されていること。",
            verified: true,
          },
          {
            id: "news-policy-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "社内推奨クイックアクションの妥当性",
            detail: "サイドバーに掲載された導入ガイド（/guide）、プロンプト集（/learning）、ToDoボード（/feedback-todo）が実在ページと連動していること。",
            verified: true,
          },
          {
            id: "news-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "全10件の一次情報外部リンク（別タブ）疎通確認",
            detail: "各ニュースの「一次情報を見る」ボタンが外部公式ドキュメント（Google, Anthropic, MDN, Playwright等）へ安全にリンクしていること。",
            verified: true,
          },
          {
            id: "news-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "記事URL共有（アンカー付きリンク）コピー機能の正常性",
            detail: "「共有」ボタン押下時に、該当記事ID付きURLがクリップボードに正確にコピーされトースト通知が表示されること。",
            verified: true,
          },
          {
            id: "news-link-03",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "情報提供窓口（ご意見ToDoボード）への内部リンク疎通",
            detail: "サイドバーの「改善ToDoボードから起票する」リンクが /feedback-todo へ正常遷移すること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/10/03",
        inspector: "梅澤（AI推進担当）",
        evidence: "KPIカード4枚、検索・重要度・カテゴリツールバー、TiltCardグリッド、右サイドバーのレスポンシブ配置確認",
        points: [
          "カードやグリッドの整列",
          "重要度バッジ（HOT, 公式発表, 社内リリース）の視認性",
          "モバイル幅での折り返し・単語泣き別れ防止（break-keep）"
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/10/03",
        inspector: "梅澤（AI推進担当）",
        evidence: "カテゴリ絞り込み、重要度フィルター、リアルタイム検索、共有URLコピー、外部リンク、触感音響（Web Audio）動作確認",
        points: [
          "カテゴリ・重要度切り替えで即座にリストが更新されるか",
          "URL共有コピーが正しく動作しトーストが出るか",
          "検索クリアボタンが機能するか"
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/10/03",
        inspector: "梅澤（AI推進担当）",
        evidence: "各ニュースの要約文・社内実務インパクト・おすすめ対象の明瞭なテキスト構成、単語泣き別れ排除を確認",
        points: [
          "ニュースの要約が簡潔で分かりやすいか",
          "社内実務へのメリットが一目で把握できるか",
          "タグや日付の視認性が適切か"
        ],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080",
    memo: "最新AIニュース＆リリースレーダーの実機動作確認完了（全10項目詳細チェック合格）",
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
        evidence: "Google公式ドキュメントおよび社内GCPプロジェクトID（antigravity-pj-xxxxxx）との整合を確認",
        points: [
          "【事実性】社内組織名（ml-mightylink.com）およびプロジェクトID（antigravity-pj-xxxxxx）の正確性",
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
            detail: "Google Cloud 組織（ml-mightylink.com）、社内プロジェクトID（antigravity-pj-xxxxxx）、プラン（Agent Platform）が実在情報であり、誤記がないこと。",
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
    lastVerifiedAt: "2026/10/03",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "社内業務（議事録要約・テスト・通知・壁打ち）に準拠したプロンプトであることを確認",
        points: [
          "社内ルールに反するプロンプトがないか",
          "個人情報・社外秘のマスキング例が的確か",
          "公式アナウンス・安全基準と一致しているか",
          "リンク先が実在するか",
        ],
        subChecks: [
          {
            id: "learning-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "社内業務プロンプト実例の事実性",
            detail: "穴埋めプロンプト（議事録要約・テストコード生成・社内通知・業務壁打ち）が社内で実際に行われている業務フローに合致し、架空のシステム名や嘘の社内用語が含まれていないこと。",
            verified: true,
          },
          {
            id: "learning-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "マスキング・置換ルールの具体性と正確性",
            detail: "「田中太郎」「user_01@example.com」「<API_KEY>」「https://api.example.com」など、個人情報やシークレットのマスキング例が具体的で、安全な記述サンプルとして誤りがないこと。",
            verified: true,
          },
          {
            id: "learning-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "Academyレッスン数および修了証仕様の事実一致",
            detail: "「全12レッスン + 修了証」「ブラウザ内で即時修了証（SVG証明書）を発行・印刷」の表記が、Antigravity Academy（全3コース・12レッスン）の実装・発行機能と完全一致していること。",
            verified: true,
          },
          {
            id: "learning-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "未決定制度の工事中ガード遵守",
            detail: "おすすめ外部講座・資格および受講・受験補助制度が「社内でおすすめする外部講座・資格と、受講・受験の補助制度はまだ決まっていません。決まり次第、ここに掲載します。」と正しく工事中ガードされており、架空の制度や嘘の資格手当が書かれていないこと。",
            verified: true,
          },
          {
            id: "learning-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "社内AI安全利用ルール（全社員必読）の整合性",
            detail: "「入力禁止（顧客個人情報・本番シークレット・未公開社外秘）」「安全に入力できるもの（ダミーデータ・プログラムコード・一般的な技術調査）」が全社セキュリティポリシーと完全に整合していること。",
            verified: true,
          },
          {
            id: "learning-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "セルフチェック診断ツール（3問）の判定基準整合",
            detail: "Q1（個人情報）、Q2（未公開社外秘）、Q3（会社指定アカウント）の設問と判定ロジックが、会社のAI利用規程（Level 1〜3）および社内Googleアカウント利用原則と合致していること。",
            verified: true,
          },
          {
            id: "learning-policy-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "チートシート「頼み方の基本4点セット」の周知整合",
            detail: "「目的・対象・条件・完了の形」およびGitブランチ作成・差分確認・エラー対処の手順が、AI推進担当から周知された標準利用プラクティスと合致していること。",
            verified: true,
          },
          {
            id: "learning-policy-04",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "セキュリティ注意喚起（プレースホルダー上部）の明示",
            detail: "穴埋めプロンプト入力欄の上部に「社内セキュリティ注意: お客様の個人情報や本番アクセスキーは直接入力せず、仮名に置換してください」との明確な注意喚起が表示されていること。",
            verified: true,
          },
          {
            id: "learning-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "全内部導線の疎通確認",
            detail: "Antigravity Academy（/academy）、導入ガイド（/guide）、セキュリティ基準（/tools-hub#ai-guidelines）、開発ロードマップ（/roadmap）等、ページ内の全リンクが実在し404エラーなく正常に遷移すること（確認済み）。",
            verified: true,
          },
          {
            id: "learning-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "相談・問い合わせ窓口の整合確認",
            detail: "チートシート末尾の「Office Hour / お問い合わせへ」の誘導が、毎週水曜開催のCoE窓口（梅澤担当）および社内問い合わせ先と合致していること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "穴埋めフォーム（InteractivePromptLibrary）とリアルタイムプレビューの枠組み確認",
        points: ["フォーム入力時のガタつきがないか", "プレビュー欄が読みやすいか", "モバイル表示"],
      },
      usability: {
        passed: true,
        evidence: "リアルタイム入力反映、初期化リセット、ワンクリックコピー、セルフチェック診断動作を確認",
        points: ["リアルタイムで置換されるか", "ワンクリックコピーが動作するか", "診断結果が正しく切り替わるか"],
      },
      readability: {
        passed: true,
        evidence: "プレースホルダーの説明と変数の色分け、セキュリティ注意事項の視認性を確認",
        points: ["入力すべき箇所が明瞭か", "注意喚起（黄/赤色）が正しく認識できるか", "手順番号が追えるか"],
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
    lastVerifiedAt: "2026/11/28",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "2026/11/27 Google Cloud Billing 実機コンソールおよび IAM/Logging 実測と照合済み（残りクレジット ¥19,745.72 / 元の資金 ¥47,813 / 残り 33 日・2026-12-31 終了 / 過去90日 SKU 小計 約¥56,100 を無料トライアル枠で全額相殺・実質 ¥0 / 登録 3 名匿名化表示）。sync-gcp-usage.mjs の課金データ反映修正および単体テスト追加、公開画面で生の社員個人情報・GCP識別子が非露出であることを本番確認済み。",
        points: [
          "Cloud Billing・IAM 実測値とフォールバックJSONが一致しているか",
          "生のGCPプロジェクトID・請求先ID・社員メールアドレスが非露出か",
          "集計ラグ・Workspace枠利用注記・sync-gcp-usage.mjsの自動テストが整合しているか",
          "リンク先と実機画面の表示が実在・疎通しているか",
        ],
        subChecks: [
          {
            id: "stats-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "GCP基盤マスク済みID・組織情報の完全一致",
            detail:
              "プロジェクトID（antigravity-pj-xxxxxx）、組織（ml-mightylink.com）、請求先ID（012EB1-xxxxxx-xxxxxx）がマスク表記で公開され、生の識別子や個人メールアドレスが画面・DOM に露出していないこと。",
            verified: true,
          },
          {
            id: "stats-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "無料クレジット・消化額の確定データ整合（2026/11/27 照合）",
            detail:
              "無料トライアル残額（¥19,745.72 / 元の資金 ¥47,813、残り 33 日・2026/12/31 終了）および過去90日 SKU 小計（約 ¥56,100、トライアルクレジット相殺で実質 ¥0）が実機コンソール画面と合致していること。",
            verified: true,
          },
          {
            id: "stats-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "社内アカウント（3名匿名化）・Workspace枠注記の事実性",
            detail:
              "IAM で確認済みの社内アカウント 3 名（利用者A〜C として匿名化）と、Antigravity 標準利用（Workspace 枠利用）および Vertex AI 従量利用の切り分け注記が実態と一致していること。",
            verified: true,
          },
          {
            id: "stats-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "SKU別コスト比率・同期スクリプト改修の事実性",
            detail:
              "Cloud Billing 実測の SKU 内訳（Gemini 3.8 Flash Input/Caching/Output/Image・Gemini 3.5 Flash Lite 等）と、scripts/sync-gcp-usage.mjs の課金集計修正・自動テスト合格が一致していること。",
            verified: true,
          },
          {
            id: "stats-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "会社プロジェクト経由利用（個人課金不要）原則の明示",
            detail:
              "社員個人への直接請求が発生せず、無料トライアルクレジット相殺および組織アカウントで管理されている実態が公式案内と合致していること。",
            verified: true,
          },
          {
            id: "stats-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "集計ラグ・データ反映遅延（4項目チェックリスト）の周知整合",
            detail:
              "Workspace 枠利用分・BigQuery 課金エクスポート未接続・監査ログ未有効時における「利用回数が増えない・反映されないときの確認チェックリスト（4項目）」が実態と一致していること。",
            verified: true,
          },
          {
            id: "stats-policy-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "予算アラート・月額上限ガイドラインの整合",
            detail:
              "月額上限予算（$50 / 7,500円）の管理基準およびオーナー作業依頼中ステータスが社内運用と整合していること。",
            verified: true,
          },
          {
            id: "stats-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "Cloud Billingコンソール・正規/末尾リダイレクト疎通",
            detail:
              "ヘッダー内の「Cloud Billing コンソール」外部リンク、および /gemini-stats/ の HTTP 200 と末尾スラッシュなし /gemini-stats の HTTP 301 リダイレクトが実測確認済みであること。",
            verified: true,
          },
          {
            id: "stats-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "CSVエクスポート機能の正常性",
            detail:
              "「CSV出力」ボタン押下で BOM 付き UTF-8 CSV ファイルがブラウザから生成・出力できること。",
            verified: true,
          },
          {
            id: "stats-link-03",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "同期JSON参照と安全フォールバック表示",
            detail:
              "public/data/gcp-usage-live.json（syncedAt=2026-11-27 21:38）をエラーなく読み込み、本番ブラウザでコンソールエラー 0 件で描画されること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザ（2026/11/28）にて 1280x800（html/body 幅 1274 <= 1280、main 幅 986、HeroBanner h1 と Search ボタン垂直間隔 27.5px で非重複）および 768x1024（html/body 幅 762 <= 768、main 幅 474、KPI カード 2x2 折り返し x=313..737・期間フィルタボタン折り返し・横溢れゼロ）を実測しスクリーンショット目視確認済み。",
        points: [
          "1280x800・768x1024 で横溢れ・要素重なり・クリップがないか",
          "KPIカード・ボタン群・テーブル横スクロールが狭幅環境で崩れないか",
          "HeroBanner 見出しと Search ボタンが重ならないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番実機ブラウザにて FAQ 確認チェックリストのアコーディオン開閉（aria-expanded false→true→false）および日次推移期間フィルタ（過去7日・過去14日・過去30日の aria-pressed 切替とサマリー更新）がコンソールエラー 0 件で動作することを確認。",
        points: [
          "期間フィルタ（過去7日/14日/30日）の切り替え動作",
          "確認チェックリストのアコーディオン開閉（aria-expanded連動）",
          "CSV出力・再同期操作時のエラーゼロ",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "2026/11/27 確定スナップショット（¥19,745.72・残り33日・登録3名）と実機スクショ目視での文字切れゼロ・コンソールエラー 0 件を確認。",
        points: [
          "確認手順（4項目）とスナップショット注記が迷わず読めるか",
          "数値の桁区切り・通貨単位・マスク表記が明瞭か",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024 + GitHub Pages 本番実測",
    memo: "2026/11/27 Cloud Billing/IAM 実数値同期＆2026/11/28 本番実機ビジュアルUAT完了",
  },
  {
    id: "ai-projects",
    name: "社内AIプロジェクト一覧",
    path: "/ai-projects",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/10/03",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "実在する推進担当プロジェクト2件（COE-01, COE-02）とGitHub Issue連携の確認",
        points: [
          "架空のプロジェクトがないか",
          "Issue登録時の機密注意書きがあるか",
          "部署別プラクティスが実用的か",
          "リンク先が実在するか",
        ],
        subChecks: [
          {
            id: "project-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "公式推進プロジェクトの実在性",
            detail: "登録されている2件のプロジェクト（AI Parkポータル構築・運用、Antigravity社内環境整備）が、AI推進担当（梅澤）が実際に推進している実在の施策であり、架空のプロジェクトが混入していないこと。",
            verified: true,
          },
          {
            id: "project-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "成果・課題実績の事実性",
            detail: "「Google Chatでいただいたご意見8件のうち6件を反映済み」「請求先アカウントのリンクと月額上限の設定待ち」等の進捗・課題が実際の運用状況と一致していること。",
            verified: true,
          },
          {
            id: "project-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "部署別実践モデルの実行可能性",
            detail: "開発（単体テスト・型補完）、営業（提案骨子・比較表）、人事・総務（社内規程QA）の3フローが、各部署で実際に利用可能なプロンプト・ツール構成に基づいていること。",
            verified: true,
          },
          {
            id: "project-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "未実装・PoCステータスの誠実な表示",
            detail: "検討中(0)、PoC中(1)、本番運用中(1)、終了(0)の各ステータスバッジが実態通りに表示され、未完了のPoC施策が「本番運用中」と誤認されないこと。",
            verified: true,
          },
          {
            id: "project-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "機密情報・顧客データ保護の事前警告徹底",
            detail: "「※ 社外公開リポジトリのIssueに登録されます。顧客名・契約情報・機密データは記載しないでください。」という全社セキュリティ警告が登録ボタン直前に明瞭に記載されていること。",
            verified: true,
          },
          {
            id: "project-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "社内Googleアカウント利用原則の整合",
            detail: "人事・総務の実践フロー等において「会社アカウント環境必須」「個人情報のマスキング」が明記され、公式安全基準と合致していること。",
            verified: true,
          },
          {
            id: "project-policy-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "月額上限予算ルールの遵守",
            detail: "Antigravity業務利用の案件において「利用者1人あたり月3,000円を目安に上限を設定」という公式アナウンスの利用基準が明記されていること。",
            verified: true,
          },
          {
            id: "project-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "GitHub Issue新規登録リンクの疎通確認",
            detail: "「+ プロジェクトを登録する」ボタンが、実在するリポジトリのテンプレート（template=ai-project.yml）へ正しくリンクしていること（確認済み）。",
            verified: true,
          },
          {
            id: "project-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "GitHub Issue同期・一覧リンクの正常性",
            detail: "フッターの「GitHub Issue (label: ai-project)」および「更新」ボタンが、実在するラベル検索URLへ疎通し、エラーなく動作すること。",
            verified: true,
          },
          {
            id: "project-link-03",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "プロンプト集・導入ガイドへの内部相互リンク",
            detail: "実践フロー内のプロンプト集（/learning）や導入ガイド（/guide）への導線が実在ページと整合していること。",
            verified: true,
          },
        ],
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
        points: ["ステップ番号が追いやすいか", "効果が一目でわかるか", "注意書きの視認性"],
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
    lastVerifiedAt: "2026/10/03",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "社内Google Chatで寄せられた実在のご意見・GitHub Issueのリアルタイム同期を確認",
        points: [
          "捏造された意見がないか",
          "GitHub Issue連携が本番リポジトリと一致しているか",
          "集計KPIの実績一致",
          "リンク先が実在するか",
        ],
        subChecks: [
          {
            id: "todo-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "社内フィードバック実発言の事実性",
            detail: "杉村さん（シンプル導入3ステップ、Antigravity導入手順）、小林さん（個人Proアカウント制約、GCPトライアル消化懸念）、梅澤（権限エラー・実機トラブル）等の引用が、社内Google Chat等で実際に発言・協議された実在の声であること。",
            verified: true,
          },
          {
            id: "todo-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "GitHub Issue連携数値・リアルタイム同期の正確性",
            detail: "GitHub REST APIからラベル「feedback」を持つ実在のIssue群（#6〜#29）を正常に取得し、Issue番号・タイトル・起票者（kanta13jp1 等）・ステータス（Open/Closed）が本番リポジトリと完全一致していること。",
            verified: true,
          },
          {
            id: "todo-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "集計KPI（蓄積総数・対応中・反映済）の実績一致",
            detail: "蓄積総数（54件）、検討中（8件）、対応中（1件）、反映済み（45件）の合算および内訳が、ローカルマスターToDo（TODO-01〜TODO-17）とGitHub Issue同期データの結合結果と過不足なく一致していること。",
            verified: true,
          },
          {
            id: "todo-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "対応方針・反映進捗の事実性",
            detail: "各ToDoの「ポータルでの対応方針・進捗」が、実際にポータル内に実装・反映された機能（導入ガイド改訂、プロンプト集新設、Gemini統計実装等）の事実と合致していること。",
            verified: true,
          },
          {
            id: "todo-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "起票時の機密情報・顧客データ入力ガード",
            detail: "「ご意見を起票する」モーダルおよびGitHub Issueテンプレートにおいて、「社外公開リポジトリのIssueに登録されます。顧客名・契約情報・機密データは記載しないでください。」という全社セキュリティ警告が徹底されていること。",
            verified: true,
          },
          {
            id: "todo-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "ステータス運用ルール（検討中・対応中・完了）の遵守",
            detail: "ラベル運用（feedback、status:in-progress、Issue Close ➔ 完了）が、社内AI推進チームの開発フロー規約に準拠していること。",
            verified: true,
          },
          {
            id: "todo-policy-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "個人アカウント・会社GCPクレジット運用の透明性",
            detail: "TODO-08, 09, 10 等のアカウント運用課題に対する解決方針が、会社の公式アナウンス（会社プロジェクト経由・上限設定）と完全一致していること。",
            verified: true,
          },
          {
            id: "todo-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "各ToDoのポータル内機能リンクの疎通確認",
            detail: "各ToDoカード末尾の「導入ガイドを見る」「学習ページを見る」「Gemini統計を見る」等のリンクが実在し、404エラーなく正常遷移すること（確認済み）。",
            verified: true,
          },
          {
            id: "todo-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "GitHub Issue個別リンク・一覧リンクの正常性",
            detail: "各カードの「[#番号]」「GitHubで更新」および上部「Issue一覧」リンクが、実在するGitHubリポジトリ（https://github.com/kanta13jp1/ai-park/issues/...）へ正常に遷移すること。",
            verified: true,
          },
          {
            id: "todo-link-03",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "CSVエクスポート・再同期ボタンの正常動作",
            detail: "「CSV出力」で全ToDoデータが文字化けのないUTF-8 BOM付きCSVとして保存され、「再同期」ボタン押下時にGitHub APIから最新データを正常再取得できること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "リスト表示と3列カンバンボード（検討中・対応中・反映済み）の切り替え確認",
        points: ["カンバンボードの横スクロール/レスポンシブ", "ステータスバッジの視認性", "モバイル表示"],
      },
      usability: {
        passed: true,
        evidence: "カテゴリ絞り込み、ステータス切り替え、起票モーダル、CSV出力の動作を確認",
        points: ["モーダル開閉", "CSVエクスポート動作", "検索フィルターの即応性"],
      },
      readability: {
        passed: true,
        evidence: "引用メッセージ、対応方針、関連リンクの視認性を確認",
        points: ["誰からの意見か、何をするかが明瞭か", "引用の背景・文脈の明示"],
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
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "KPIカード4枚（登録21件・公式公開13ページ・工事中保護15機能・Win 11 / Chrome・Chromium）と feature-status.ts の件数整合、および未検証リスト15件のリンク実在を確認",
        points: ["KPI件数が実データと一致しているか", "事実確認・承認基準が明瞭に記録されているか"],
        subChecks: [
          {
            id: "preflight-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・検証基準の厳格性）",
            label: "手動UAT登録機能と公開中13ページの整合性",
            detail: "feature-status.ts の公式公開中13ページすべてを含む preflightChecklistMaster 登録全件（2026/11/23 時点 21件）が実在し、推測や架空の合格記録が含まれていないこと。",
            verified: true,
          },
          {
            id: "preflight-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・検証基準の厳格性）",
            label: "未検証機能（15機能）の工事中・PoCガード実態一致",
            detail: "feature-status.ts の isVerified: false 15機能が工事中・準備中・PoCガード対象として正しく集計され、各詳細ページへの導線になっていること。",
            verified: true,
          },
          {
            id: "preflight-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・検証基準の厳格性）",
            label: "実機検証環境表記と承認記録の事実一致",
            detail: "実機検証環境（Win 11 / Chrome・Chromium、Desktop・Tablet(768px)・Mobile で確認）や承認日時・担当者が実際の確認事実に基づいていること。",
            verified: true,
          },
          {
            id: "preflight-policy-01",
            category: "official_announcement",
            groupTitle: "② 品質ゲート・全社ガバナンス規程と一致しているか（整合性・周知遵守）",
            label: "CI/CDデプロイ前品質ゲート（verify-deployment-gate）との完全連動",
            detail: "scripts/verify-deployment-gate.mjs の検査ロジックと preflight-checklist.ts が連動し、未承認項目やエビデンス欠落時にビルドゲートで検出できること。",
            verified: true,
          },
          {
            id: "preflight-policy-02",
            category: "official_announcement",
            groupTitle: "② 品質ゲート・全社ガバナンス規程と一致しているか（整合性・周知遵守）",
            label: "「自動テストだけでなく人間が触る」ガバナンス宣誓の遵守",
            detail: "全社公開サイトとして推測や嘘の混入を阻止するため、4大評価軸のチェック内容と確認エビデンスを明示していること。",
            verified: true,
          },
          {
            id: "preflight-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "選択機能の「画面を開く」および工事中保護リスト（15件）リンク疎通",
            detail: "詳細パネルの「画面を開く」別タブリンクおよび左下「工事中・未検証機能」リスト内15件のクリック可能 Link（初回href=/ai-park/tools/等）が実在ページへ向いていること。",
            verified: true,
          },
          {
            id: "preflight-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "「UAT報告書をMarkdownでコピー」機能の動作と失敗時ガード",
            detail: "「UAT報告書をMarkdownでコピー」押下時に全件のUAT結果・未検証機能一覧がクリップボードへコピーされ、失敗時の例外捕捉・ボタン表示・live通知が備わっていること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "本番 GitHub Pages 実機ブラウザにて 1280x800（body幅 1274px / main 986px）・768x1024（固定288pxサイドバー下で body幅 762px / main幅 474px）・375x812（body幅 369px）で横溢れ・要素重なり0件、および見出し階層15件（h1→h2→h3→h4 レベル飛び0件）を確認。なお 1280x800 / 768x1024 目視時に第4 KPIカード文字列が省略途切れしたため truncate 解除を反映。",
        points: ["1280x800・768x1024・375x812 で横溢れ・要素重なり・クリップがないか", "見出し階層（h1〜h4）にスキップがないか"],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "縦型タブリスト（role=tablist / aria-orientation=vertical）で ArrowDown→End→Home 操作時に選択状態（aria-selected）と右パネル（aria-labelledby / h2）が連動切替すること、工事中未検証リスト15件が Link として描画されること、および Markdown コピーボタン動作（JSエラー0件）を本番実機で確認。",
        points: ["縦型タブのキーボード操作（ArrowDown/ArrowUp/Home/End）で詳細パネルが切り替わるか", "レポートコピーボタンと工事中機能リンクが機能するか"],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "role=tablist・role=tab・aria-selected・aria-controls・role=tabpanel・role=status（aria-live=polite）の実装、末尾 / なし（/preflight）の HTTP 200 リダイレクト解決、および本番ページでのコンソールエラー0件を確認。",
        points: ["WAI-ARIA APG タブ・ライブ通知属性と末尾 / なし解決が正常か", "本番環境でコンソールエラーが発生しないか"],
      },
    },
    environment: "Windows 11 / Chrome・Chromium / 1280x800・768x1024・375x812 + GitHub Pages 本番実測",
    memo: "WAI-ARIA APG 縦型タブ・クリック可能未検証リスト15件・liveNotice保持・KPIカード全文表示を含む最新手動UAT完了",
  },
  {
    id: "academy",
    name: "Antigravity Academy",
    path: "/academy",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/10/04",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "全3コース・12レッスン・評価テスト・修了証発行・進捗JSONバックアップ/復元・Google Chat報告の実在・動作を確認済み",
        points: [
          "【事実性】3コース（基礎・実践・安全）12レッスンの全教材が実在すること",
          "【事実性】進捗データがブラウザ内（localStorage）で安全に保持され、外部送信されないこと",
          "【事実性】評価テスト合否（80%以上）による修了証発行ロジックの実装確認",
          "【事実性】JSONエクスポート・復元・Google Chat報告文生成が正しく機能すること",
          "【整合性】社内AI安全利用ガイドラインおよび推進担当公式学習推奨カリキュラムと合致していること",
          "【実在性】全動的ルート（/academy/[course]/[step]）のSSG正常生成とナビゲーション疎通確認",
        ],
        subChecks: [
          {
            id: "academy-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "全3コース・12レッスンの実在性",
            detail: "Antigravity 101（基礎）、実践活用、社内安全利用の3コース・計12レッスンがすべて実在の教材コンテンツで構成されていること。",
            verified: true,
          },
          {
            id: "academy-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "完全ローカル進捗管理（安全設計）",
            detail: "学習進捗・テスト結果がブラウザの localStorage にのみ保存され、外部サーバーへ個人学習履歴が不要に送信されない安全仕様であること。",
            verified: true,
          },
          {
            id: "academy-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "修了判定および修了証発行ロジックの正確性",
            detail: "各コースの全レッスン読了かつ評価テスト80%以上正解で修了証が発行され、発行IDと日付が正しく刻印されること。",
            verified: true,
          },
          {
            id: "academy-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性）",
            label: "進捗JSONバックアップ・復元・Chat報告の実在性",
            detail: "PC交換やキャッシュ削除対策としてのJSONエクスポート/インポート機能、およびGoogle Chat報告用整形テキスト生成が正しく動作すること。",
            verified: true,
          },
          {
            id: "academy-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・社内ルールとの整合性",
            label: "社内AI安全利用ガイドラインとの整合",
            detail: "安全利用コースの内容が、コンプライアンス部・法務部が承認した社内AI利用ルール（機密データ入力禁止・著作権配慮）と完全一致していること。",
            verified: true,
          },
          {
            id: "academy-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・社内ルールとの整合性",
            label: "推進担当への修了報告フローの整合",
            detail: "修了時にGoogle ChatでAI推進窓口へワンクリック報告できる手順が、全社アナウンスの受講推奨フローと整合していること。",
            verified: true,
          },
          {
            id: "academy-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "全12レッスンおよびテストへの動的SSG疎通確認",
            detail: "全動的ルート（/academy/[course]/[step]）がSSG静的ビルドされ、前後のレッスン遷移・テスト画面へリンク切れなく遷移できること。",
            verified: true,
          },
          {
            id: "academy-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "修了証・バックアップ出力の動作確認",
            detail: "修了証の画像生成/印刷プレビュー、進捗JSONファイルのダウンロードおよびクリップボードコピーが正常動作すること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "HUD進捗カード、3大コースカード、進行中セクション、進捗マネージャーのレスポンシブ配置確認",
        points: ["進捗HUDの視認性", "コースカードの整列", "モバイル表示でのボタン折り返し"],
      },
      usability: {
        passed: true,
        evidence: "レッスン完了トグル、クイズ採点、JSONエクスポート/復元、Google Chat報告文コピー、触覚音響の動作を確認",
        points: ["レッスン完了の即時反映", "クイズ合否判定", "JSON復元時のHUD即時更新", "音響フィードバック"],
      },
      readability: {
        passed: true,
        evidence: "レッスンステップ、クイズ解説、修了証デザイン、バックアップ手順の明瞭なテキスト構成を確認",
        points: ["レッスンの要点が明確か", "合格基準が一目でわかるか", "バックアップ手順が平易か"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080 & Mobile",
    memo: "TODO-20 / Issue #15（進捗バックアップ＆Google Chat報告）含む全機能の手動UAT完了",
  },
  {
    id: "skills-hub",
    name: "社内Skillsカタログ",
    path: "/skills-hub",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/20",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "架空スキル・未確認の認定表記を除外し、工事中アラート（UnderConstructionAlert）と「作成・確認済みの Skills はまだありません」の誠実な案内、および新規Skill提案モーダルのみが公開されていることを確認",
        points: ["工事中アラートの表示", "架空スキル・認定表記の非掲載", "新規Skill提案モーダルの書式"],
        subChecks: [
          {
            id: "skills-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "架空スキル・未確認認定の非掲載",
            detail: "社内で作成・セキュリティ確認が済んだスキルがそろうまでカタログ配列を空とし、工事中表示を維持していること。",
            verified: true,
          },
          {
            id: "skills-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "導入ガイド導線・新規Skill申請モーダルの動作確認",
            detail: "導入ガイド（/guide）へのリンクおよび新規Skill申請モーダルの文面生成・コピーが動作すること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "工事中バナー、HUDハイライト、フィルターバー、0件時の空状態カードの整列確認",
        points: ["工事中バナーの視認性", "空状態カードの配置", "モーダルのセンタリング"],
      },
      usability: {
        passed: true,
        evidence: "検索・カテゴリ操作、新規Skill提案モーダル開閉・ドラフト生成の動作を確認",
        points: ["検索・カテゴリUIの操作性", "モーダル開閉", "音響フィードバック"],
      },
      readability: {
        passed: true,
        evidence: "準備中・工事中である旨が誤認なく伝わるテキスト構成を確認",
        points: ["正式公開前であることが明確に伝わるか"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080 & Mobile",
    memo: "工事中状態（スキル0件・新規申請受付のみ）としての誠実表示UAT完了",
  },
  {
    id: "tools-hub",
    name: "AI Tools Hub & 申請フロー",
    path: "/tools-hub",
    targetAudience: "全社員",
    overallStatus: "passed",
    lastVerifiedAt: "2026/11/20",
    verifiedBy: "梅澤（AI推進担当）",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "利用を認めるツールと申請方法の決定待ちとして工事中バナーを表示し、暫定版の「セキュリティ基準（Level 1〜3）と注意事項5箇条」のみを公開していることを確認",
        points: ["工事中バナーの表示", "セキュリティ基準（Level 1〜3）と暫定版注意事項5箇条の整合性", "未確定申請フローの非掲載"],
        subChecks: [
          {
            id: "th-spec-1",
            category: "official_announcement",
            groupTitle: "仕様・事実性確認",
            label: "暫定版セキュリティ基準の整合性",
            verified: true,
            detail: "Level 1〜3の入力基準と注意事項5箇条に「暫定版（2026/09/26〜）」の注記があり、未決定の承認フローを事実のように載せていないこと。",
          },
          {
            id: "th-spec-2",
            category: "no_fiction",
            groupTitle: "仕様・事実性確認",
            label: "架空ツール・未承認ライセンス枠の非掲載",
            verified: true,
            detail: "未確認のツール認定や申請フォームを除外し、工事中ページとして誠実に案内されていること。",
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "工事中アラート、セキュリティLevelカード、注意事項5箇条の整列確認",
        points: ["セキュリティLevelバッジの配色", "注意事項5箇条の視認性"],
      },
      usability: {
        passed: true,
        evidence: "関連ページ（/guide, /contact）への遷移とUI表示を確認",
        points: ["導線リンクの遷移確認"],
      },
      readability: {
        passed: true,
        evidence: "Level 1〜3の区分と注意事項5箇条・マスキング例が平易に読めることを確認",
        points: ["禁止事項と安全な入力例が直感的に理解できるか"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080 & Mobile",
    memo: "工事中状態（暫定版セキュリティ基準・注意事項5箇条のみ公開）としての誠実表示UAT完了",
  },
  {
    id: "troubleshooting",
    name: "Windows 環境トラブルシューター",
    path: "/troubleshooting",
    targetAudience: "全社員",
    overallStatus: "passed",
    lastVerifiedAt: "2026/10/04",
    verifiedBy: "梅澤（AI推進担当）",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "PowerShell実行権限、Git認証、Node競合、Antigravity ADC認証、VS Codeプレビュー設定の全6件のコマンドが実機で動作確認済み",
        points: ["PowerShell 5.1/7でのSet-ExecutionPolicyの安全性", "gh auth login のブラウザ連動", "gcloud ADC認証の実在性"],
        subChecks: [
          {
            id: "tb-spec-1",
            category: "official_announcement",
            groupTitle: "仕様・事実性確認",
            label: "管理者権限不要の安全なコマンド設計",
            verified: true,
            detail: "Set-ExecutionPolicy -Scope CurrentUser 等、全コマンドが管理者権限なしで安全に実行できること。",
          },
          {
            id: "tb-spec-2",
            category: "no_fiction",
            groupTitle: "仕様・事実性確認",
            label: "Gemini 3.1 Pro プレビュー設定の整合性",
            verified: true,
            detail: "VS Codeでの general.previewFeatures: true の設定仕様が公式アナウンスと一致していること。",
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "HUDサマリーバナー、カテゴリーピル、立体トラブルシューターカード、ダークコードブロックのコントラスト確認",
        points: ["難易度バッジ・環境バッジの視認性", "コードブロックのシンタックスハイライト風配色"],
      },
      usability: {
        passed: true,
        evidence: "リアルタイム検索、カテゴリ切り替え、ワンクリックコマンドコピー、Web Audio API触覚音響の動作を確認",
        points: ["コピー完了トーストの自動復帰", "検索結果0件時のリセット操作"],
      },
      readability: {
        passed: true,
        evidence: "症状（赤枠）・原因（黄枠）・解決手順（黒枠）の3段構成による直感的なエラー切り分けの確認",
        points: ["エラー症状が一目で特定できるか", "補足メモの注意点が明確か"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080 & Mobile",
    memo: "TODO-109 / Issue #108（Windowsトラブル解決FAQ画面の新設＆自己修復HUD）の手動UAT完了",
  },
  {
    id: "interviews",
    name: "現場のAI活用インタビュー",
    path: "/interviews",
    targetAudience: "全社員",
    overallStatus: "passed",
    lastVerifiedAt: "2026/11/20",
    verifiedBy: "梅澤（AI推進担当）",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "未取材の架空事例を除外し、準備中バナー・取材キット（流れ5ステップ・質問5項目）・取材立候補モーダル（Google Chat提出用文面コピー）のみを公開していることを確認",
        points: ["準備中バナーの表示", "取材フロー・質問項目の正確性", "取材立候補モーダル（文面生成・コピー）の動作"],
        subChecks: [
          {
            id: "iv-spec-1",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "未取材・架空インタビューの非掲載",
            detail: "実際の取材と本人・上長の原稿確認が済むまでインタビュー記事配列を空とし、準備中表示を維持していること。",
            verified: true,
          },
          {
            id: "iv-spec-2",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "取材立候補モーダルの文面生成・コピー動作",
            detail: "立候補モーダルで入力内容から Google Chat 提出用の応募文面を生成し、クリップボードへコピーできること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "準備中アラート、取材募集バナー、取材キットカード、空状態表示の整列確認",
        points: ["取材ステップの視認性", "モーダルのレスポンシブ配置"],
      },
      usability: {
        passed: true,
        evidence: "取材立候補モーダル起動、入力、Google Chat 提出用文面コピーの動作を確認",
        points: ["モーダル開閉と入力補助", "Web Audio API触覚音響の連動"],
      },
      readability: {
        passed: true,
        evidence: "準備中であることと立候補方法が初見で迷わず理解できるテキスト構成を確認",
        points: ["取材の流れが5ステップで明瞭か"],
      },
    },
    environment: "Windows 11 / Chrome / 1920x1080 & Mobile",
    memo: "準備中状態（記事0件・取材キット＆立候補受付のみ公開）としての誠実表示UAT完了",
  },
  {
    id: "gcp-info",
    name: "GCP・Google Cloud情報局",
    path: "/gcp-info",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/22",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/22",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "社内GCP利用ルール・資格取得支援制度が未確定のため UnderConstructionAlert（工事中バナー）およびナビゲーション（🚧 工事中）で誠実に保護されていることを確認。全11資格（CDL/GAIL/ACE/ADP/PCA/PDE/PMLE/PCSE/PCDE/PCD/PCNE）の試験時間・問題数（PDE 40〜50問、PCA 50〜60問）・有効期限（ACE 3年）・受験基盤（CertMetrics / Pearson VUE）・公式スコア非公開表記、および公式学習リソース43ユニークURL全件のHTTP 200疎通を実測確認済み。",
        points: [
          "未確定の社内GCP利用ルール・資格取得支援制度が工事中バナーで正しく保護されているか",
          "全11資格の試験仕様（ACE有効期限3年・PDE 40〜50問・PCA 50〜60問・CertMetrics）がGoogle Cloud公式一次情報と一致しているか",
          "全43ユニーク公式学習リソースURLがHTTP 200で疎通し404/403が存在しないか",
        ],
        subChecks: [
          {
            id: "gcp-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "未確定社内ルール・架空補助制度の非掲載",
            detail:
              "社内のGCP利用規定・補助金額・申請窓口などの架空記述を一切載せず、UnderConstructionAlert（releaseDate: 未定）で準備中であることを明示していること。",
            verified: true,
          },
          {
            id: "gcp-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "公式非公開合格スコアの誤認防止",
            detail:
              "各資格の examFacts で「公式スコア非公開（Pass / Fail のみ通知）」と明記し、本アプリ演習の 70% 目安と混同しない表記に統一していること。",
            verified: true,
          },
          {
            id: "gcp-fact-03",
            category: "official_announcement",
            groupTitle: "② 公式一次情報と一致しているか（整合性検証確認済み）",
            label: "全11資格 試験仕様・有効期限・受験基盤の一次情報整合",
            detail:
              "ACE の有効期限（3年間）、PDE の問題数（40〜50問）、PCA の問題数（50〜60問）、GAIL/CDL の試験時間（90分・1問90秒タイマー）、および CertMetrics / Pearson VUE 表記が Google Cloud 公式ページと一致していること。",
            verified: true,
          },
          {
            id: "gcp-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（HTTP 200 実測確認済み）",
            label: "公式認定ページ・日本語ガイドPDF・公式ドキュメント 43 URL 全件 HTTP 200",
            detail:
              "全11資格の officialResources 掲載 URL（ユニーク 43 件）すべてが HTTP 200 を返し、旧 403 パスや不要な他言語リダイレクトを含まないこと。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/22",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "静的ビルド済み画面（1280x800 PC / 768x1024 タブレット / 375x812 スマホ）の3ビューポートで横スクロール溢出ゼロ（scrollWidth <= innerWidth）、固定サイドバー 288px 下での HUD/資格切替/比較表の破綻なしを確認。",
        points: [
          "PC (1280x800)・タブレット (768x1024)・スマホ (375x812) で横溢れや文字切れがないか",
          "6ドメイン資格でもクイズ正答率バーが6列均等整列するか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/22",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "初期チャンク 865 KB → 135.4 KB への動的チャンク分割後も資格切替（CDL/GAIL/PCDE/ACE/PDE）、クイック検索チップ（責任ある AI / SLO 含む全件ヒット）、比較ジャンプ、バックアップ形式検証の正常動作を実機確認。",
        points: [
          "11資格の動的切り替えとチャンク遅延読み込みがエラーなく完了するか",
          "別資格のバックアップJSON誤上書き防止ガードとMarkdownコピーが動作するか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/22",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "WAI-ARIA APG タブ（tablist/tab/tabpanel・左右/Home/Endキー操作）・progressBar・アコーディオン（aria-expanded/controls）・比較テーブル scope/caption・入力欄 aria-label・focus-visible を備え、工事中ステータスが初見で正確に伝わることを確認。",
        points: [
          "WAI-ARIA ロール・フォーカス表示・ラベル未設定入力ゼロが維持されているか",
          "工事中バナーと学習コンテンツの範囲が明確に区別されているか",
        ],
      },
    },
    environment:
      "Windows 11 / Chromium (Chrome DevTools MCP) / 1280x800・768x1024・375x812 + Next.js 16.3.5 Static Export 実測",
    memo: "工事中状態（Google Cloud 全11資格学習ハブ先行公開・社内GCP利用ルールおよび資格取得支援制度は準備中）としての誠実表示＆実機UAT完了",
  },
  {
    id: "aws-info",
    name: "AWS・クラウド情報局",
    path: "/aws-info",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "社内AWS利用ルール・資格受験補助制度が未確定のため UnderConstructionAlert（🚧 工事中・正式稼働予定: 未定）と isVerified: false で誠実に保護されていることを確認。全6資格（CLF-C02/AIF-C01/SAA-C03/DVA-C03/SOA-C03/SAP-C03）を 2026-11 AWS 公式試験ガイドへ照合済み（SAP-C03 の 5ドメイン 25/25/15/15/20・22問化、DVA-C03 のテストとデプロイ・Guardrails・EKS 対応、CLF-C02 の最新サポート4区分および2027年レガシー終了注記、AIF-C01 の4出題形式、ESL +30分英語受験限定・日本語受験対象外注記）、および公式リソース24ユニークURL全件のHTTP 200ダイレクト疎通（リダイレクト0件）を実測確認済み。",
        points: [
          "未確定の社内AWS利用ルール・資格受験補助制度が工事中バナーとナビ表示で誠実に保護されているか",
          "全6資格（SAP-C03/DVA-C03/CLF-C02/AIF-C01/SAA-C03/SOA-C03）と ESL +30分ルールがAWS一次公式ガイドと一致しているか",
          "全24ユニーク公式リソースURLが旧転送ドメイン（explore.skillbuilder.aws）なしで HTTP 200 ダイレクト応答するか",
        ],
        subChecks: [
          {
            id: "aws-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "未確定社内AWS利用ルール・補助制度・架空事例の非掲載",
            detail:
              "社内の AWS アカウント申請ルール・資格受験補助制度・問い合わせ窓口・社内部署名・実名等の架空記述を載せず、UnderConstructionAlert（releaseDate: 未定）と isVerified: false で準備中であることを明示していること。",
            verified: true,
          },
          {
            id: "aws-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "ESL +30分延長の英語受験限定条件の正確表記",
            detail:
              "ピアソンVUE の ESL +30 MINUTES 申請について「非英語母語者が英語で受験する場合に限り（日本語受験は対象外）」と全6資格の試験当日チェックリストで正確に明記していること。",
            verified: true,
          },
          {
            id: "aws-fact-03",
            category: "official_announcement",
            groupTitle: "② 公式一次情報と一致しているか（整合性検証確認済み）",
            label: "SAP-C03 / DVA-C03 / CLF-C02 サポート4区分 / AIF-C01 / SOA-C03 の最新ガイド一致",
            detail:
              "SAP-C03（5ドメイン 25/25/15/15/20%・Bedrock/VPC Lattice/RCP/FIS）、DVA-C03（30/26/22/22%・テストとデプロイ・Guardrails/EKS）、CLF-C02 タスク4.3（Basic/ビジネスサポート+/エンタープライズサポート/Unified Operations・2027年移行注記）、AIF-C01（4形式: 択一/複数/並べ替え/内容一致）が公式試験ガイドと一致していること。",
            verified: true,
          },
          {
            id: "aws-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（HTTP 200 実測確認済み）",
            label: "全6資格 公式リソース 24ユニークURL 全件 HTTP 200 ダイレクト",
            detail:
              "全6資格の officialResources に掲載したユニーク24 URL（Skill Builder 正規 URL および全6資格の日本語公式試験ガイド HTML 含む）がすべてリダイレクトなしの HTTP 200 を返すこと。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "静的エクスポート実機ブラウザ（Chromium）にて 1280x800（scrollWidth 1274 <= 1280）・768x1024（固定288pxサイドバー下で scrollWidth 762 <= 768、h1左端304pxで重なりゼロ）・エミュレート 375x812（scrollWidth 375 <= 375）の横溢れゼロ、見出し階層スキップ 0 件、および存在しないURLでの404画面正常描画（Hydration/JSランタイムエラー 0 件）を確認。",
        points: [
          "PC (1280x800)・固定サイドバー併設タブレット (768x1024)・スマホ (375x812) で横溢れや要素重なりがないか",
          "見出し階層（h1〜h4）のスキップや存在しないパスへの404レンダリング破綻がないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "初期ページチャンク 510.9 KB → 151.7 KB（初期総JS 1213.2 KB → 854.1 KB）への5資格オンデマンド動的 import 分割後も SAP-C03（チャンク1912 HTTP 200・5ドメイン描画）・DVA-C03・CLF-C02・AIF-C01 切替、サービスバッジ「IAM」クリックでの比較タブ自動検索ジャンプ、および SAA-C03 上での SAP バックアップJSON投入拒否ガード動作を実機確認。",
        points: [
          "初期チャンク削減と5資格の動的切り替えがエラーなく機能するか",
          "サービスバッジ・クイック検索チップの0件ヒット防止と他資格バックアップ誤復元防止ガードが機能するか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "WAI-ARIA APG タブ（ArrowRight キーでのフォーカス＆選択移動を実機確認済み）・aria-controls・progressbar・比較表 min-w-[640px] + caption/scope を備え、一部工事中ステータスと学習ハブ範囲が明確に区別されていることを確認（JSランタイム/Hydrationエラー0件、Next 16.3.5 静的出力特有のサイドバーRSC事前取得 .txt 404のみログ分離確認）。",
        points: [
          "WAI-ARIA APG タブのキーボード操作とラベル付き入力が機能するか",
          "一部工事中バナーと学習コンテンツの区分が明確でコンソールにJS/Hydrationエラーがないか",
        ],
      },
    },
    environment:
      "Windows 11 / Chromium (Chrome DevTools MCP) / 1280x800・768x1024・375x812(emulated) + Next.js 16.3.5 Static Export 実測",
    memo: "工事中状態（AWS 全6資格統合学習ハブ先行公開・社内AWS利用ルールおよび資格受験補助制度は準備中）としての誠実表示＆実機UAT完了",
  },
  {
    id: "study-archive",
    name: "AI勉強会アーカイブ",
    path: "/study-archive",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/28",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "公開リポジトリのため議事メモ・週次進捗本文・社員メールアドレス・生電話番号を非掲載とし、src/data/study-archive.ts に出どころコメント明記の 2026-11-18 Google Drive 録画 URL、Google Docs 議事メモ URL、および新規「週次進捗」タブ用の社内限定共有 Google スプレッドシート URL（未ログイン時 /preview HTTP 401 保護をライブ疎通＋分離ブラウザで実測確認済み。ログイン済みの社内 Workspace Chrome でのシート実表示は別途確認）のみ掲載していることを確認。",
        points: [
          "議事メモ本文・週次進捗本文・社員個人情報・機密識別情報が公開コードに含まれていないか",
          "Google Drive 録画・Google Docs 議事メモ・週次進捗シートの社内限定共有（未ログイン時 HTTP 401）と次回予定が事実と一致しているか",
        ],
        subChecks: [
          {
            id: "study-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "議事メモ・週次進捗本文および個人情報の非掲載",
            detail:
              "src/data/study-archive.ts に議事メモ本文・週次進捗の社員実名/内容・メールアドレス・電話番号を載せず、開催回メタ情報・課題ガイド・限定共有シート参照メタのみ記載していること。",
            verified: true,
          },
          {
            id: "study-fact-02",
            category: "official_announcement",
            groupTitle: "② 共有権限と告知内容が一致しているか（整合性確認済み）",
            label: "Google Workspace 限定公開保護（HTTP 401）と次回予定整合",
            detail:
              "未認証環境で Drive / Docs / Spreadsheets の /preview iframe が HTTP 401 で保護されること（ログイン済み社内ブラウザでは閲覧可能）、および次回予定（2026-12-16 15:00〜16:00）が告知内容と一致していること。",
            verified: true,
          },
          {
            id: "study-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先と導線が実在するか（機能確認済み）",
            label: "週次進捗シート・Drive/Docs 直接リンク・内部導線整合",
            detail:
              "週次進捗シート別タブリンク（target=_blank, rel=noopener noreferrer）、録画/議事メモの別タブリンク、および /calendar・/guide への内部リンクが正しく設定されていること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザ（?tab=progress, 2026/11/28）にて 1280x800（html/body 幅 1274 <= 1280、main 幅 986、HeroBanner h1 と Search ボタン非重複、iframe 920x680）および 768x1024（html/body 幅 762 <= 768、main 幅 474、tablist 幅 392 で 4 タブ右端クリップなし、iframe 幅 424 <= 474 で重なり・横溢れゼロ）を実測＋スクリーンショット目視確認。見出し階層（h1→h2→h3 スキップ 0 件）も確認。",
        points: [
          "1280x800・768x1024 で横溢れ・要素重なり・クリップがないか",
          "4タブ（「週次進捗」含む）と埋め込み iframe が狭幅環境で収まるか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番実機ブラウザにて ?tab=progress 直遷移時の初期選択（study-archive-tab-progress aria-selected=true / study-archive-panel-progress 表示）、WAI-ARIA タブのキーボード操作（ArrowLeft→Home→End でのフォーカス＆選択連動）、および別タブリンク（target=_blank, rel=noopener noreferrer）の正常動作（JS エラー 0 件）を確認。",
        points: [
          "?tab=progress 初期表示とキーボード操作（ArrowLeft/Home/End）の連動",
          "未ログイン時の保護表示下でも案内文・別タブリンクが操作できるか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/28",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "role=tablist・role=tab・aria-selected・aria-controls・role=tabpanel・aria-live=polite の実装、末尾 / なし（/study-archive）の HTTP 301→200 解決、存在しない URL での 404 Hydration エラー 0 件、およびコンソールエラー 0 件を確認。",
        points: [
          "WAI-ARIA APG タブ・ライブ通知属性が揃っているか",
          "末尾 / なしリダイレクトと 404 ページで Hydration/JS エラーが発生しないか",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024 + GitHub Pages 本番実測",
    memo: "β版（録画・議事メモ＋社内限定「週次進捗」シート埋め込み・WAI-ARIA APG 4タブ対応）の本番実機 UAT 完了",
  },
  {
    id: "calendar",
    name: "AI Park カレンダー",
    path: "/calendar",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "社内 Google Workspace 限定共有の「AI Park イベント」カレンダー埋め込み、GAS アジェンダ自動付与案内、および /study-archive 相互導線バナー（最新開催回 2026-11-18 表示）の事実整合を確認。",
        points: [
          "社内限定共有カレンダーの案内と架空予定非掲載が守られているか",
          "Google カレンダー直接リンクと /study-archive 導線が有効か",
        ],
        subChecks: [
          {
            id: "cal-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "社内限定共有カレンダーとガイド案内の整合",
            detail:
              "Workspace ログイン時のみ予定表示される旨の案内と、GAS による勉強会アジェンダ自動付与説明が運用実態と一致していること。",
            verified: true,
          },
          {
            id: "cal-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先と導線が実在するか（機能確認済み）",
            label: "Google カレンダー直接リンク・/study-archive 相互導線",
            detail:
              "Google カレンダー直接追加 URL および /study-archive 相互導線リンクが正しく設定されていること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザにて 1280x800・768x1024（html/body 幅 762 <= 768、表示モード 3 ボタンが y=722.33 で 1 行収容＋直接リンクが y=762.33 へ折り返し、重なり/クリップゼロ）・375x812（html/body/main 幅 369 <= 375、横溢れゼロ）および見出し階層（h1→h2）を確認。",
        points: [
          "1280x800・768x1024・375x812 で表示モードボタンやバナーにクリップ・横溢れがないか",
          "見出し階層（h1→h2）が保たれているか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "「すべて表示」「月間カレンダー」「アジェンダ一覧」の 3 ボタン切替と aria-pressed（true/false）および iframe 表示件数（2 件↔1 件）の連動を本番実機で確認。",
        points: [
          "3 種類のビュー切り替えと aria-pressed 状態が連動するか",
          "/study-archive への相互導線バナーがクリック遷移できるか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "role=\"group\"（aria-label=\"カレンダー表示モード\"）・type=\"button\"・末尾 / なし（/calendar）の HTTP 200 解決、およびページ側 React/JS コンソールエラー 0 件を確認（1280x800 時は外部 calendar.google.com iframe 側の report-only CSP 通知のみ分離観測、768x1024・375x812 はコンソール出力 0 件）。",
        points: [
          "操作グループの WAI-ARIA 属性と末尾 / なし解決が正常か",
          "ページ側の JS/Hydration エラーが 0 件であるか",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024・375x812 + GitHub Pages 本番実測",
    memo: "β版（社内カレンダー埋め込み＋/study-archive 相互導線＋768px 狭幅対応）の本番実機 UAT 完了",
  },
  {
    id: "antigravity-info",
    name: "Antigravity情報局",
    path: "/antigravity-info",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "Google Antigravity 公式ドキュメントおよび組み込みガイド（antigravity-guide / swarm-orchestrator / run-workflow）の仕様整合、公式 URL 全 11 件の HEAD HTTP 200 疎通、および一部工事中ガード（UnderConstructionAlert）の維持を確認。",
        points: [
          "架空の社内制度・数値・事例・個人情報が含まれていないか",
          "Antigravity 2.0・IDE・CLI（agy）・SDK・Skills・Rules・MCP・Subagents・run_workflow・Agent Swarms（/swarm）の解説が公式仕様と一致しているか",
          "社内お知らせ・社内固有 FAQ が未作成である事実を一部工事中として誠実に表示しているか",
          "全 11 件の公式ドキュメント外部 URL およびポータル内リンクが疎通するか",
        ],
        subChecks: [
          {
            id: "ag-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "架空情報・数値・社員識別情報の非掲載確認",
            detail:
              "実在しない人物・部署名・効果数値・未定のスケジュールや社員メールアドレス（@ml-mightylink.com）等が掲載されていないこと（tests/antigravity-info.test.mjs の PII 検査通過確認済み）。",
            verified: true,
          },
          {
            id: "ag-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "Antigravity 公式機能仕様・実行例データの正確性",
            detail:
              "Surfaces（2.0 / IDE / CLI agy / SDK）、機能解説 13 件、モダリティ比較 6 行、実務実行例 11 件、ショートカット 12 件、テンプレート 4 件、FAQ 11 問、実行モード診断 6 シナリオが公式仕様と一致していること。",
            verified: true,
          },
          {
            id: "ag-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "一部工事中ガード（社内お知らせ・FAQ 未作成）の誠実表示",
            detail:
              "feature-status.ts の isVerified: false 維持およびページ上部の UnderConstructionAlert により、社内向けお知らせ・社内固有 FAQ が準備中であることを明示していること。",
            verified: true,
          },
          {
            id: "ag-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "権限・Sandbox・Swarm ワークスペース安全ガイドの準拠",
            detail:
              "Tool Execution Policy・Terminal Sandbox・workspace inherit/share/branch の違い、および kill 前のコミット統合必須や安全フォールバック案内が標準方針と一致していること。",
            verified: true,
          },
          {
            id: "ag-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "公式ドキュメント外部 URL 全 11 件の HTTP 200 実測",
            detail:
              "antigravity.google/docs 配下（docs, skills, rules-workflows, mcp, ide/browser, permissions, sandbox, plugins, cli/features）、changelog、および github.com/google-antigravity/antigravity-sdk-python の全 11 URL が HEAD リクエストで HTTP 200 を返すこと（2026/11/22 実測）。",
            verified: true,
          },
          {
            id: "ag-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "ポータル内相互導線リンクの整合",
            detail:
              "導入ガイド（/guide）・Antigravity Academy（/academy）・社内 Skills カタログ（/skills-hub）・MCP 連携ハブ（/mcp-hub）・エージェント/Swarm ガイド（/agent-cases）・トラブルシューター（/troubleshooting）への遷移が有効であること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザにて 1280x800（html/body 幅 1274px、HeroBanner Search ボタンと h1 の非重複確認）、768x1024（固定 288px サイドバー下で html/body 幅 762px、main 幅 474px、タブ・診断ボタン・テーブルの重なり/クリップなし）、375x812（html/body/main 幅 369px、全表 min-w-640px が 335px 横スクロールコンテナ内に収容）および見出し階層 h1〜h5 スキップ 0 件を確認。",
        points: [
          "1280x800・768x1024・375x812 で横溢れ・要素重なり・クリップがないか",
          "見出し階層（h1〜h5）にスキップがないか",
          "テーブルの狭幅横スクロール（min-w-[640px]）が崩れていないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番実機にて WAI-ARIA タブのキーボード操作（ArrowRight・End・Home による aria-selected と role=tabpanel の連動）、実行モード診断のリポジトリ状態切替（share から安全フォールバック inherit 案内表示）、プロンプト・テンプレート全 4 件のコピー時 コピー済み 遷移、Swarm 実行例ジャンプボタン連動、および FAQ 全 11 問の aria-expanded 切替を確認。",
        points: [
          "キーボード操作（ArrowRight/End/Home）でタブとパネルが連動するか",
          "実行モード診断・リポジトリ状態切替・Swarm 実行例ジャンプが動作するか",
          "コピーボタン・検索絞り込み・FAQ アコーディオンが正常動作するか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "InlineCodeText により FAQ 全 11 問に加え実行モード診断の選定理由および機能解説の概要・実務のコツも code タグ描画し、全テーブル scope=col・tabpanel tabIndex=0・copyTimeoutRef 競合解消を反映。本番ページで ConsoleErrors 0 件、末尾 / なしアクセス HTTP 200 解決、および 404 パス Hydration エラー 0 件を確認。",
        points: [
          "インラインコードが code タグで描画され、生バッククォートが露出していないか",
          "末尾 / なし解決と 404 ページでコンソール/Hydration エラーが 0 件か",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024・375x812 + GitHub Pages 本番実測",
    memo: "公式機能解説・Agent Swarms・実行モード診断・実行例11件・リファレンスFAQの公開版（社内お知らせ等は一部工事中）本番実機 UAT 完了",
  },
  {
    id: "how-to",
    name: "使い方・学び 総合ハブ",
    path: "/how-to",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "feature-status.ts と整合する /tools の 🧪 PoC中 バッジ表示、公開済み /study-archive（β版）カード追加、架空表現の排除、および全13カードと3ステップの実在ページ導線を確認。",
        points: [
          "各機能カード・バッジが feature-status.ts と矛盾していないか",
          "全13カード・3ステップ・便利リンクの実在導線が揃っているか",
        ],
        subChecks: [
          {
            id: "howto-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "PoC/工事中バッジ整合と架空表現排除",
            detail: "/tools が 🧪 PoC中 バッジで誠実に案内され、未確認の社内標準表現を含まないこと。",
            verified: true,
          },
          {
            id: "howto-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先と導線が実在するか（機能確認済み）",
            label: "/study-archive 追加と13カード・3ステップ導線",
            detail: "AI勉強会アーカイブ（/study-archive, β版）を含む13枚のコンテンツカード、3ステップ、および便利リソースリンクが実在ルートへ設定されていること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "本番 GitHub Pages 実機ブラウザにて 1280x800（body幅 1274px / main 986px）・768x1024（固定288pxサイドバー下で body幅 762px / main幅 474px）・375x812（body幅 369px）で横溢れ・要素重なり0件、および見出し階層全23件（h1→h2→h3）レベル飛び0件を確認。",
        points: [
          "1280x800・768x1024・375x812 で横溢れや重なりがないか",
          "見出し階層（h1→h2→h3）にスキップがないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "各モジュールカード・3ステップカード・クイックリソースリンクの構成および末尾 / なし（/how-to）の HTTP 200 リダイレクト解決を本番環境で確認。",
        points: [
          "13カード・3ステップの導線と末尾 / なしURL解決が正常か",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "公開中・β版・PoC中・準備中・工事中バッジの視覚識別性および本番ページでのコンソールエラー0件を確認。",
        points: [
          "ステータスバッジが明確に区別でき、コンソールエラーが0件か",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024・375x812 + GitHub Pages 本番実測",
    memo: "公開中ハブ（13カード＋3ステップ＋リソースリンク）の見出し階層・PoC整合・768px対応の本番実機 UAT 完了",
  },
  {
    id: "agent-tools",
    name: "エージェント・ツール 総合ハブ",
    path: "/agent-tools",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "/agent-cases カードの実運用エージェント6種・Swarmガイド説明と 🚧 工事中 バッジ整合、およびロードマップ連携バナーからの未確定予定日表現排除を確認。",
        points: [
          "配下7機能の説明とステータスバッジが実態と一致しているか",
          "未確定の稼働予定日を示唆する表現がないか",
        ],
        subChecks: [
          {
            id: "agent-tools-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "/agent-cases 実態整合と予定日表現排除",
            detail: "/agent-cases がリポジトリ実在エージェント6種・Swarmガイド＋部署事例準備中として誠実に説明され、ロードマップバナーが解除条件ベースで記述されていること。",
            verified: true,
          },
          {
            id: "agent-tools-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先と導線が実在するか（機能確認済み）",
            label: "配下7機能・3ステップ・/roadmap 導線整合",
            detail: "7枚の機能カード、3ステップ導線、および開発ロードマップ（/roadmap）リンクが実在ルートへ接続されていること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "本番 GitHub Pages 実機ブラウザにて 1280x800（body幅 1274px / main 986px）・768x1024（body幅 762px / main幅 474px）・375x812（body幅 369px）で横溢れ・重なり0件、および見出し階層全17件（h1→h2→h3）レベル飛び0件を確認。",
        points: [
          "1280x800・768x1024・375x812 でカード・3ステップ・バナーに横溢れがないか",
          "見出し階層（h1→h2→h3）が正しく保たれているか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "配下7機能カード・3ステップガイド・ロードマップバナーの導線構成および末尾 / なし（/agent-tools）の HTTP 200 リダイレクト解決を本番実機で確認。",
        points: [
          "各機能カード・バナー遷移と末尾 / なしURL解決が正常か",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "β版・🚧 工事中の視覚識別性、ステップ番号と説明の可読性、および本番環境でのコンソールエラー0件を確認。",
        points: [
          "進捗ステータスが一目で識別でき、JS/コンソールエラーが0件か",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024・375x812 + GitHub Pages 本番実測",
    memo: "配下7機能＋3ステップ＋ロードマップ導線の事実整合・見出し階層・768px対応の本番実機 UAT 完了",
  },
  {
    id: "idea-board",
    name: "アイデア宣言ボード",
    path: "/idea-board",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "GitHub Issues（label: idea）とのライブ連携仕様、Google Chat 通知・機密情報非記載注意・アイデア宣言3大ルールおよび暫定版ビジネスモデル提案コンテスト案内を確認。",
        points: [
          "GitHub Issues 連携元と機密情報非記載ルールが明示されているか",
          "暫定版コンテスト案内が開閉式detailsで区別されているか",
        ],
        subChecks: [
          {
            id: "idea-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "GitHub Issues 実データ同期と0件時誠実表示",
            detail: "src/lib/githubIdeas.ts 経由で実在リポジトリの idea ラベル Issue のみを取得し、0件時にも架空サンプルを入れず誠実に空状態メッセージを表示すること。",
            verified: true,
          },
          {
            id: "idea-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先と導線が実在するか（機能確認済み）",
            label: "GitHub Issue 宣言フォーム・一覧リンク有効性",
            detail: "「アイデアを宣言する」URL（template=idea.yml）とデータソース GitHub Issues リンクが rel=noopener noreferrer 付きで正しく設定されていること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "本番 GitHub Pages 実機ブラウザにて 1280x800（body幅 1274px / main 986px）・768x1024（body幅 762px / main幅 474px）・375x812（body幅 369px）で横溢れ・重なり0件、および可視見出し9件（h1→h2→h3）レベル飛び0件を確認。",
        points: [
          "1280x800・768x1024・375x812 でフィルター・検索欄・カードに横溢れがないか",
          "可視見出し階層（h1→h2→h3）にレベル飛びがないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "GitHub 同期状態遷移（GitHub同期中...→0 件）、フィルター群（role=group）クリック時の aria-pressed 切替、検索入力欄（label for=idea-search-input / input#idea-search-input）入力・クリア、再読込ボタン動作、および暫定版コンテスト details の開閉を本番実機で確認。",
        points: [
          "ステージ絞り込み・キーワード検索・再読込・details 開閉が実機動作するか",
          "末尾 / なし（/idea-board）が HTTP 200 で解決するか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence: "role=status（aria-live=polite）による同期状態通知、アイデア宣言3大ルールの構造化、全工程コンソールエラー0件、および存在しないURLでの404 Hydrationエラー0件を確認。",
        points: [
          "WAI-ARIA 属性（role=group / aria-pressed / label / role=status）が揃っているか",
          "コンソールエラー・404 Hydration エラーが0件か",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024・375x812 + GitHub Pages 本番実測",
    memo: "β版（GitHub Issues live連携＋WAI-ARIA＋768px対応＋404確認）の本番実機 UAT 完了",
  },
  {
    id: "azure-info",
    name: "Azure・Microsoft Azure情報局",
    path: "/azure-info",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/27",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "社内 Azure 利用ルール・資格取得支援制度が未確定のため UnderConstructionAlert（🚧 一部工事中・学習ハブ先行公開）および feature-status.ts（isVerified: false）で誠実に保護されていることを確認。全8資格（AZ-900 / AI-900 / DP-900 / SC-900 / AZ-104 / AI-103 / AI-200 / AZ-305、うち AI-103 / AI-200 は旧 AI-102 / AZ-204 後継）・バッジ/検索チップ100%ヒット・learn.microsoft.com 資格別4ユニークURL（計32件）の妥当性を tests/azure-cert.test.mjs で検証済み。",
        points: [
          "未確定の社内 Azure 利用ルール・資格取得支援制度が工事中バナーと isVerified: false で保護されているか",
          "全8資格のバッジ・quickSearchChips が 5 セクション横断検索で 0 ミス（100%ヒット）となるか",
          "AI-103 / AI-200 の後継試験注記と learn.microsoft.com 公式 URL 一意性が保たれているか",
        ],
        subChecks: [
          {
            id: "azure-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "未確定社内ルール・架空補助制度の非掲載",
            detail:
              "社内の Azure 利用申請窓口・補助金額・架空担当者等の記述を一切載せず、UnderConstructionAlert（releaseDate: 未定）と isVerified: false で準備中であることを明示していること。",
            verified: true,
          },
          {
            id: "azure-fact-02",
            category: "official_announcement",
            groupTitle: "② 公式一次情報・テスト契約と一致しているか（整合性確認済み）",
            label: "全8資格・後継試験注記・100%逆引きヒット検証",
            detail:
              "tests/azure-cert.test.mjs にて全8資格（AZ-900〜AZ-305）・AI-103（旧AI-102後継）/AI-200（旧AZ-204後継）注記・20問/24カード整合・サービスバッジ＆検索チップ100%ヒットが自動テストで合格していること。",
            verified: true,
          },
          {
            id: "azure-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先・公式URL衛生が保たれているか（テスト固定済み）",
            label: "learn.microsoft.com 全32 URL の一意性・旧404/Soft-404除外",
            detail:
              "全8資格の officialResources（各4件・一意）が https://learn.microsoft.com/ 配下であり、旧404（ai-103t00-a）・/training/browse/ リダイレクト・重複 /exams/ URL を含まないこと。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザ（Chromium）にて 1280x800（html/body 幅 1274px・main 幅 986px）・768x1024（固定 288px サイドバー下で html/body 幅 762px・main 幅 474px、比較 table 実測幅 640px を親ラッパー幅 376px 内に横スクロール収容）の横溢れ 0 件を確認（viewportSize / boundingBox 実測および本番 404 実画面スクリーンショット確認による検証）。",
        points: [
          "1280x800 および固定サイドバー併設 768x1024 で横溢れ・レイアウト破綻がないか",
          "比較表 min-w-[640px] が 768px 幅の横スクロールコンテナ内に正しく収容されるか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "azureCertRegistry.ts による初期 az900 のみ静的 import＋残り 7 資格（各 36〜48KB）の動的 import() チャンク分割とレースガード（loadRequestGenRef）・再読込UIを実装。本番画面で「AI Apps & Agents (AI-103)」クリック時にチャンク 2402.68c05dd17dae7e42.js が HTTP 200 で読み込まれ 0/13 トピック・0/24 カード・0/20 演習が描画されること、検索チップ「Microsoft Foundry」で比較表 6 件→2 件絞込、末尾 / なし（/azure-info）の HTTP 200 リダイレクト解決を確認。",
        points: [
          "7資格の動的チャンク読み込み・切り替えとチップ検索がエラーなく動作するか",
          "末尾 / なしアクセスが /azure-info/ へ正常リダイレクト解決するか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "WAI-ARIA APG タブ（tablist/tab/aria-selected/aria-controls/tabpanel）・aria-pressed・aria-expanded・role=\"status\"（aria-live=\"polite\"）・Markdown メモ出力（handleExportNotesMarkdown）を備え、本番操作を通じて ConsoleErrors 0 件を確認。",
        points: [
          "WAI-ARIA APG 属性とライブ通知が揃い、コンソールエラーが 0 件か",
        ],
      },
    },
    environment:
      "Windows 11 / Chromium (Built-in Browser Subagent) / 1280x800・768x1024 + GitHub Pages 本番実測",
    memo: "工事中状態（Azure 全8資格統合学習ハブ先行公開・動的チャンク分割対応）の本番実機・CI回帰テスト UAT 完了",
  },
  {
    id: "lpic-info",
    name: "LPIC・Linux情報局",
    path: "/lpic-info",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/27",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "社内の資格取得支援・受験補助ルール等が未確定のため UnderConstructionAlert（🚧 一部工事中・学習ハブ先行公開）および feature-status.ts（isVerified: false）で誠実に保護されていることを確認。全6トラック（LPIC-1 / LPIC-2 / LPIC-3 300/303/305/306）の各20問・24カード・コマンドバッジ＆検索チップ100%ヒット・LPI公式URL（旧404 URL除外）の整合を tests/lpic-cert.test.mjs で検証済み。",
        points: [
          "未確定の社内資格取得支援・受験補助ルールが工事中バナーと isVerified: false で保護されているか",
          "全6トラックのコマンドバッジ・quickSearchChips が 0 ミス（100%ヒット）となるか",
          "LPI 公式リソース URL が有効で旧 404 URL を含まないか",
        ],
        subChecks: [
          {
            id: "lpic-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "未確定社内支援制度・架空数値の非掲載",
            detail:
              "社内の受験補助金額・取得奨励金・申請窓口等の未確定事項を載せず、UnderConstructionAlert（releaseDate: 未定）と isVerified: false で準備中であることを明示していること。",
            verified: true,
          },
          {
            id: "lpic-fact-02",
            category: "official_announcement",
            groupTitle: "② 公式仕様・回帰テストと一致しているか（整合性確認済み）",
            label: "全6トラック試験要綱・100%逆引きヒット検証",
            detail:
              "tests/lpic-cert.test.mjs にて全6トラックの試験時間（90分）・合格ライン（500点）・有効期限/前提資格表記・20問/24カード整合・コマンド＆検索チップ100%ヒットが自動テストで合格していること。",
            verified: true,
          },
          {
            id: "lpic-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先・公式URL衛生が保たれているか（テスト固定済み）",
            label: "LPI 公式サイト配下 URL 一意性・旧404除外",
            detail:
              "各トラックの officialResources（各3件以上・一意）が LPI 公式サイト配下（www/wiki/learning.lpi.org）であり、旧404パス（learning-materials/lpic-*、LPIC-3_30X 等）を含まないこと。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザ（Chromium）にて 1280x800（html/body 幅 1274px・main 幅 986px）・768x1024（html/body 幅 762px・main 幅 474px）の横溢れ 0 件を確認。初回 QA 時に 1280x800 で検出した「学習レベル・専門トラック選択」見出し右端と「基盤」グループの重なりを上下2段配置へ修正（59d701e）し、再デプロイ後の本番 1280x800 スクリーンショット（read_file 直接目視）および boundingBox 実測（ラベル y=464..484、基盤 x=335..651、LPIC-3 専門 x=659..1192）で重なり・見切れの完全解消を確認済み。",
        points: [
          "1280x800 でトラック選択見出しと基盤ボタングループが重ならないか",
          "1280x800 および 768x1024 で横溢れや比較表の崩れがないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "lpicCertRegistry.ts による初期 lpic-1 のみ静的 import＋残り 5 トラックの動的 import() 分割とレースガード（loadRequestGenRef）・再読込UIを実装。本番画面で「LPIC-2 (201 / 202)」クリック時に見出し「LPIC-2（201-450 / 202-450）合格対策学習ハブ」へ切り替わり 0/13 トピック（Topic 200〜212）・0/24 カード・0/20 演習がエラー 0 件で正常表示されることを確認。",
        points: [
          "トラック切り替え時に遅延データが正常ロードされエラーが出ないか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "WAI-ARIA APG タブ・aria-pressed・aria-expanded・aria-controls・role=\"status\"（aria-live=\"polite\"）・比較表 min-w-[640px]・lg:min-w-[360px] を備え、本番操作および再検証で ConsoleErrors 0 件を確認。",
        points: [
          "WAI-ARIA APG 属性とライブ通知が揃い、コンソールエラーが 0 件か",
        ],
      },
    },
    environment:
      "Windows 11 / Chromium (Built-in Browser Subagent) / 1280x800（実画面スクリーンショット目視確認済）・768x1024 + GitHub Pages 本番実測",
    memo: "工事中状態（LPIC 全6トラック学習ハブ先行公開・動的チャンク分割＋1280pxラベル重なり修正済）の本番実機・目視 UAT 完了",
  },
  {
    id: "ipa-info",
    name: "情報処理技術者試験情報局",
    path: "/ipa-info",
    targetAudience: "全社員",
    lastVerifiedAt: "2026/11/27",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "社内の資格取得支援・受験補助ルール等が未確定のため UnderConstructionAlert（🚧 一部工事中・学習ハブ先行公開）および feature-status.ts（isVerified: false）で誠実に保護されていることを確認。全13区分（IP/SG/FE/AP/SC/DB/NW/ES/ST/SA/PM/SM/AU）の試験要綱・キーワードバッジ100%ヒット・IPA公式シラバスURL（https://www.ipa.go.jp/shiken/syllabus/gaiyou.html、旧404 /shiken/syllabus.html 非混入）を tests/cert-data.test.mjs および tests/ipa-cert.test.mjs で検証済み。",
        points: [
          "未確定の社内資格取得支援・受験補助ルールが工事中バナーと isVerified: false で保護されているか",
          "全13区分のトピック・問題・カード件数とキーワードバッジ100%ヒットが検証されているか",
          "IPA 公式シラバス URL が有効（syllabus/gaiyou.html）で旧 404 URL を含まないか",
        ],
        subChecks: [
          {
            id: "ipa-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "未確定社内支援制度・架空情報の非掲載",
            detail:
              "社内の受験料補助・報奨金制度等の未確定情報を載せず、UnderConstructionAlert（releaseDate: 未定）と isVerified: false で準備中であることを明示していること。",
            verified: true,
          },
          {
            id: "ipa-fact-02",
            category: "official_announcement",
            groupTitle: "② 公式要綱・回帰テストと一致しているか（整合性確認済み）",
            label: "IPA 全13区分メタ・件数・ID一意性・100%逆引きヒット検証",
            detail:
              "tests/cert-data.test.mjs および tests/ipa-cert.test.mjs にて全13区分の IPA_EXAM_METAS・IPA_EXAM_COUNTS・全IDプレフィックス一意性・キーワードバッジ100%ヒットが自動テストで合格していること。",
            verified: true,
          },
          {
            id: "ipa-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先・公式URL衛生が保たれているか（テスト固定済み）",
            label: "IPA 公式サイト URL（syllabus/gaiyou.html）採用・旧404除外",
            detail:
              "IPA_OFFICIAL_RESOURCES 3件が https://www.ipa.go.jp/ 配下で一意であり、正規シラバス URL（/shiken/syllabus/gaiyou.html）を含み、旧 404（/shiken/syllabus.html）を含まないこと。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザ（Chromium）にて 1280x800（html/body 幅 1274px・main 幅 986px）・768x1024（初期および PM 表示時とも html/body 幅 762px・main 幅 474px）で横溢れ 0 件を確認（viewportSize / boundingBox 実測、および min-w-0・lg:min-w-[360px]・比較表 min-w-[640px] を実装・確認）。",
        points: [
          "1280x800 および固定サイドバー併設 768x1024 で横溢れ・レイアウト崩れがないか",
          "全13区分セレクター・横断進捗サマリ・比較表がタブレット幅でも崩れないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "ipaCertRegistry.ts による初期 foundation 階層のみ静的 import＋specialist（89KB）・management（88KB）階層の動的 import() 分割とレースガード（loadRequestGenRef）・再読込UIを実装。本番画面で「安全確保支援士 (SC)」（0/7 トピック・0/10 カード・0/12 演習）および「プロジェクトマネージャ (PM)」（0/5 トピック・0/10 カード・0/12 演習）の階層切替がエラー 0 件で完了することを確認。",
        points: [
          "基礎/専門/管理の3階層切り替え時に動的データ読み込み・表示がエラーなく動作するか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/27",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "WAI-ARIA APG タブ・role=\"group\"＋aria-pressed・aria-expanded・role=\"status\"（aria-live=\"polite\"）を備え、本番操作での ConsoleErrors 0 件および存在しない URL での 404 画面描画（React Hydration / JS エラー 0 件・スクリーンショット目視確認済み）を確認。",
        points: [
          "WAI-ARIA APG 属性とライブ通知が揃い、コンソール・404 Hydration エラーが 0 件か",
        ],
      },
    },
    environment:
      "Windows 11 / Chromium (Built-in Browser Subagent) / 1280x800・768x1024 + GitHub Pages 本番実測",
    memo: "工事中状態（IPA 全13区分統合学習ハブ先行公開・階層別動的チャンク分割対応）の本番実機・CI回帰テスト UAT 完了",
  },
];
