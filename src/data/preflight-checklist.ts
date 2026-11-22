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
    lastVerifiedAt: "2026/10/05",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "Google Cloud Billing 実機コンソール画面（2026/10/05 00:40 照合）と完全一致確認。無料トライアルクレジット残高 ¥32,352.49（残り87日 / 2026年12月31日終了）、合計費用 ¥2.29万 - コスト削減 ¥2.29万 = 総費用 ¥0 を完全検証済み。",
        points: [
          "API連携が本物か",
          "フォールバックJSONが正確か",
          "集計ラグの公式仕様注記があるか",
          "リンク先が実在するか",
        ],
        subChecks: [
          {
            id: "stats-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "GCP基盤実在ID・組織情報の完全一致",
            detail: "プロジェクトID「antigravity-pj-xxxxxx」、組織「ml-mightylink.com」、請求先ID「012EB1-xxxxxx-xxxxxx」が実在する社内本番リソースと完全一致していること。",
            verified: true,
          },
          {
            id: "stats-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "無料クレジット・消化額の確定データ整合",
            detail: "無料トライアル残額（¥32,352.49 / 元の資金 ¥47,813、残り87日）および10/01〜10/05合計費用（費用 ¥2.29万 - 削減 ¥2.29万 = 総費用 ¥0）が、Google Cloud Billing実機コンソール確定数値と完全合致していること。",
            verified: true,
          },
          {
            id: "stats-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "社内アカウント・利用モデルの事実性",
            detail: "社内アカウント（利用者A・利用者Bの2名、匿名化済み）および利用モデル（Gemini 3.8 Flash / 3.1 Pro）の実績と一致していること。",
            verified: true,
          },
          {
            id: "stats-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・正確性検証）",
            label: "SKU別コスト比率・モデル分類の事実性",
            detail: "Gemini 3.8 Flash（59.2%）、Agent Platform / 3.1 Pro（22.2%）、us-east7基盤（18.6%）のSKU内訳が、Cloud Billingのエクスポート実績データに基づいていること。",
            verified: true,
          },
          {
            id: "stats-policy-01",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "会社プロジェクト経由利用（個人課金不要）原則の明示",
            detail: "社員個人への直接請求が発生せず、全額会社のGoogle Cloudクレジットから相殺・一元管理されている実態と公式アナウンスが合致していること。",
            verified: true,
          },
          {
            id: "stats-policy-02",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "集計ラグ・データ反映遅延（4大チェックリスト）の周知整合",
            detail: "Cloud Billing・Cloud Loggingの確定までに数時間〜最大1日の反映ラグが存在する公式仕様と、「利用回数が増えないときの確認手順①〜④」が正しく一致していること。",
            verified: true,
          },
          {
            id: "stats-policy-03",
            category: "official_announcement",
            groupTitle: "② 公式アナウンス・安全基準と一致しているか（整合性・周知遵守）",
            label: "予算アラート・月額上限ガイドラインの整合",
            detail: "月額上限予算（$20 / 3,000円）の管理基準が、社内AI運用ポリシーおよび安全枠内で設定されていること。",
            verified: true,
          },
          {
            id: "stats-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "Cloud Billingコンソールへの外部リンク疎通",
            detail: "ヘッダー内の「Cloud Billing コンソール」リンクが、実在する請求先レポート（https://console.cloud.google.com/billing/...）へ正常に遷移すること（確認済み）。",
            verified: true,
          },
          {
            id: "stats-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "CSVエクスポート機能の正常性",
            detail: "「CSV出力」ボタンをクリックした際に、文字化け（BOM付与）のないUTF-8 CSVファイル（利用実績データ）が正常にダウンロードされること。",
            verified: true,
          },
          {
            id: "stats-link-03",
            category: "link_integrity",
            groupTitle: "③ リンク先が実在するか（リンク検証・確認済み）",
            label: "同期API（GAS Web API / fallback）の正常疎通",
            detail: "「最新データを再同期」実行時に、GAS Live API またはフォールバックJSON（public/data/gcp-usage-live.json）からエラーなくデータを取得・更新できること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        evidence: "KPIカード4枚、グラフ、同期ステータスバー、FAQアコーディオンの配置確認",
        points: ["カード数値の整列", "アコーディオン開閉時のスムーズさ", "ステータスバッジの明瞭さ", "モバイル表示"],
      },
      usability: {
        passed: true,
        evidence: "「最新データを再同期」ボタンのローディング動作、CSV出力、FAQ展開を確認",
        points: ["再同期ボタン押下時の動作", "CSVが文字化けせず開けるか", "FAQクリックの反応"],
      },
      readability: {
        passed: true,
        evidence: "「反映されないときの4大チェックリスト」の文字サイズとアイコン配置の視認性を確認",
        points: ["確認手順（①〜④）が迷わず読めるか", "フォントの強弱が適切か", "数値の桁区切り・通貨単位"],
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
    lastVerifiedAt: "2026/10/03",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        evidence: "4大評価軸、チェックリスト項目、エビデンス記録要件が実運用基準に合致していることを確認",
        points: ["チェック項目に漏れがないか", "事実確認の基準が明確か"],
        subChecks: [
          {
            id: "preflight-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・検証基準の厳格性）",
            label: "手動UAT対象機能（全7機能）の実在性とステータス整合",
            detail: "ポータルトップ、導入ガイド、学習コンテンツ、Gemini利用統計、社内AIプロジェクト一覧、ToDoボード、プリフライトの7機能が実在し、承認状況が実際の受入テスト結果と過不足なく完全一致していること。",
            verified: true,
          },
          {
            id: "preflight-fact-02",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・検証基準の厳格性）",
            label: "未検証機能（全11機能）の工事中・PoCガード実態一致",
            detail: "AIツール一覧、アンバサダー、インタビュー、AWS情報局、MCP連携等の11機能が手動UAT未完了として正しく集計され、偽りの公開表示になっていないこと。",
            verified: true,
          },
          {
            id: "preflight-fact-03",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・検証基準の厳格性）",
            label: "手動UAT承認者・検証日付の事実性",
            detail: "各機能の最終確認日（2026/10/01 または 2026/10/03）および検証担当者（梅澤（AI推進担当））が実在の記録であり、架空の承認者が記載されていないこと。",
            verified: true,
          },
          {
            id: "preflight-fact-04",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・検証基準の厳格性）",
            label: "実機検証環境（Testbed）スペックの事実性",
            detail: "検証環境「Windows 11 / Chrome / 1920x1080」が社内エンジニアの標準貸与PC実機環境およびエミュレーション環境と完全に合致していること。",
            verified: true,
          },
          {
            id: "preflight-policy-01",
            category: "official_announcement",
            groupTitle: "② 品質ゲート・全社ガバナンス規程と一致しているか（整合性・周知遵守）",
            label: "CI/CDデプロイ前品質ゲート（verify-deployment-gate）との完全連動",
            detail: "scripts/verify-deployment-gate.mjs の検査ロジックと本画面のデータソース（preflight-checklist.ts）が1対1で整合し、未承認項目がある場合にデプロイを即座にブロックできること。",
            verified: true,
          },
          {
            id: "preflight-policy-02",
            category: "official_announcement",
            groupTitle: "② 品質ゲート・全社ガバナンス規程と一致しているか（整合性・周知遵守）",
            label: "4大評価軸（仕様・デザイン・操作性・視認性）の網羅性",
            detail: "Fact & Spec、Aesthetics、Usability、Readability の4大軸がすべての対象機能に漏れなく設定され、確認ポイントと確認エビデンスが明文化されていること。",
            verified: true,
          },
          {
            id: "preflight-policy-03",
            category: "official_announcement",
            groupTitle: "② 品質ゲート・全社ガバナンス規程と一致しているか（整合性・周知遵守）",
            label: "「自動テストだけでなく人間が触る」ガバナンス宣誓の遵守",
            detail: "全社公開サイトとして推測や嘘の混入を絶対阻止するため、自動テストを過信せず人間による実機手動受入テスト（UAT）を必須とする基本方針が明記されていること。",
            verified: true,
          },
          {
            id: "preflight-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "各機能への「画面を開く」内部リンク疎通確認",
            detail: "ヘッダーの「画面を開く（別タブ）」リンクが、各機能の実URL（/、/guide、/learning、/gemini-stats、/ai-projects、/feedback-todo、/preflight）へ正確に遷移すること（確認済み）。",
            verified: true,
          },
          {
            id: "preflight-link-02",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "「UAT報告書をMarkdownでコピー」機能の動作確認",
            detail: "ヘッダー右上の「UAT報告書をMarkdownでコピー」押下時に、全7機能のUAT合否結果・エビデンス・検証環境が整形されたMarkdownとしてクリップボードへ正常コピーされること。",
            verified: true,
          },
          {
            id: "preflight-link-03",
            category: "link_integrity",
            groupTitle: "③ リンク先・出力機能が実在するか（機能・リンク検証確認済み）",
            label: "工事中・未検証機能への誘導リンク正常性",
            detail: "左サイドバー下部の「工事中・未検証機能（11件）」の各バッジ・リンクをクリックした際、該当する各ページ（工事中告知・PoC明示）へ正しく遷移すること。",
            verified: true,
          },
        ],
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
    lastVerifiedAt: "2026/11/23",
    verifiedBy: "梅澤（AI推進担当）",
    overallStatus: "passed",
    checks: {
      factAndSpec: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "公開リポジトリのため議事メモ本文・社員メールアドレス・生電話番号を非掲載とし、src/data/study-archive.ts に出どころコメント明記の 2026-11-18 Google Drive 録画 URL（未ログイン時 iframe HTTP 401 保護確認）および Google Docs 議事メモ URL・次回開催予定（2026-12-16 15:00〜16:00）のみ掲載していることを確認。",
        points: [
          "議事メモ本文や社員個人情報・機密識別情報が公開コードに含まれていないか",
          "Google Drive 録画・Google Docs 議事メモの限定共有と次回予定の記載が事実と一致しているか",
        ],
        subChecks: [
          {
            id: "study-fact-01",
            category: "no_fiction",
            groupTitle: "① 嘘や推測のデータがないか（事実性・実在性確認済み）",
            label: "議事メモ本文・個人情報・架空予定の非掲載",
            detail:
              "src/data/study-archive.ts に議事メモ本文・社員メールアドレス・電話番号を載せず、開催回メタ情報と課題ガイドのみ記載していること。",
            verified: true,
          },
          {
            id: "study-fact-02",
            category: "official_announcement",
            groupTitle: "② 共有権限と告知内容が一致しているか（整合性確認済み）",
            label: "Google Workspace 限定公開保護と次回予定整合",
            detail:
              "未認証ブラウザで Drive / Docs の /preview iframe が HTTP 401 で保護されること、および次回予定（2026-12-16 15:00〜16:00）が告知内容と一致していること。",
            verified: true,
          },
          {
            id: "study-link-01",
            category: "link_integrity",
            groupTitle: "③ リンク先と導線が実在するか（機能確認済み）",
            label: "Drive/Docs 直接リンク・/calendar・/guide 導線整合",
            detail:
              "録画/議事メモの別タブリンクおよび /calendar・/guide への内部リンクが正しく設定されていること。",
            verified: true,
          },
        ],
      },
      designAndLayout: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "本番 GitHub Pages 実機ブラウザにて 1280x800（body 幅 1274 <= 1280）・768x1024（固定 288px サイドバー下で html/body 幅 762 <= 768・main 474px・tablist 幅 392px で重なり/クリップゼロ）・375x812（html/body/main 幅 369 <= 375、横溢れゼロ）および見出し階層（h1→h2→h3→h4 スキップ 0 件）を確認。",
        points: [
          "1280x800・768x1024・375x812 で横溢れ・要素重なり・クリップがないか",
          "見出し階層（h1〜h4）にスキップがないか",
        ],
      },
      usability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "WAI-ARIA タブのキーボード操作（ArrowRight→End→Home でのフォーカス＆選択・パネル連動）、および「この回のリンクをコピー」（URLをコピーしました表示）・「Google Chat 用に課題をコピー」（コピーしました表示＋role=\"status\" テキスト「課題一覧をクリップボードにコピーしました。」更新、JS エラー 0 件）を本番実機で確認。",
        points: [
          "キーボード操作（ArrowRight/End/Home）でタブとパネルが連動するか",
          "リンクコピー・課題コピーボタンが権限環境下でエラーなく動作するか",
        ],
      },
      readability: {
        passed: true,
        checkedAt: "2026/11/23",
        inspector: "梅澤（AI推進担当）",
        evidence:
          "role=\"tablist\"・role=\"tab\"・aria-selected・aria-controls・role=\"tabpanel\"・aria-pressed・aria-live=\"polite\" の実装、末尾 / なし（/study-archive）の HTTP 200 解決、存在しない URL での 404 Hydration エラー 0 件、およびコンソールエラー 0 件を確認。",
        points: [
          "WAI-ARIA APG タブ・ライブ通知属性が揃っているか",
          "末尾 / なしアクセスと 404 ページで Hydration/JS エラーが発生しないか",
        ],
      },
    },
    environment: "Windows 11 / Chromium / 1280x800・768x1024・375x812 + GitHub Pages 本番実測",
    memo: "β版（Google Drive 録画・Google Docs 議事メモ社内限定共有・WAI-ARIA APG 対応）の本番実機 UAT 完了",
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
];
