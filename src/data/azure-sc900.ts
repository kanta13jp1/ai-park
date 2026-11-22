// 出典: Microsoft Learn Exam SC-900 公式試験ガイド (Study guide for Exam SC-900)
import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  AzureDomain,
  AzureComparisonTable,
  AzureArchitecturePattern,
  AzurePitfall,
  AzureKeyFact,
  AzureOfficialResource,
} from "./azure-types";

export const sc900ExamFacts: CertExamFact[] = [
  {
    label: "対象試験",
    value: "Exam SC-900",
    detail: "Security, Compliance, and Identity Fundamentals",
  },
  { label: "試験時間", value: "45 分", detail: "着席目安 65 分・全体案内含む" },
  { label: "合格スコア", value: "700 / 1000", detail: "スケールスコア 100〜1000 点" },
  { label: "有効期限", value: "無期限（更新不要）", detail: "Fundamentals 資格は失効しない" },
  { label: "受験形式", value: "Pearson VUE", detail: "テストセンター / オンライン監督試験" },
  { label: "試験形式", value: "選択・分類問題", detail: "ドラッグ＆ドロップ・複数選択等" },
];

export const sc900Domains: AzureDomain[] = [
  {
    id: "sc900-domain-1",
    number: "01",
    title: "セキュリティ・コンプライアンス・ID の概念",
    englishTitle: "Describe the concepts of security, compliance, and identity",
    weight: "10〜15%",
    accentColor: "indigo",
    summary:
      "ゼロトラストの 3 原則、責任共有モデル、多層防御、CIA 三要素などの基礎理念に加え、暗号化・ハッシュ化・GRC（ガバナンス・リスク・コンプライアンス）、認証/認可とフェデレーションの仕組みを理解します。",
    topics: [
      {
        id: "sc900-1-1",
        code: "1.1",
        title: "ゼロトラスト・責任共有モデル・多層防御・CIA 三要素",
        services: ["ゼロトラスト", "責任共有モデル", "多層防御", "CIA 三要素"],
        keyPoints: [
          "ゼロトラストは『明示的に検証する（Verify explicitly）』『最小特権アクセスを使う（Use least privilege access）』『侵害を前提とする（Assume breach）』の 3 原則に基づき、社内ネットワーク内であっても暗黙の信頼を行わない",
          "責任共有モデルでは、物理セキュリティ（データセンター・ホスト・ネットワーク）は常にクラウドプロバイダー（Microsoft）責任、情報・データ、デバイス、アカウント・ID は IaaS・PaaS・SaaS のいずれでも常に顧客責任となる",
          "多層防御（Defense in Depth）は、物理・ID とアクセス・境界・ネットワーク・コンピューティング・アプリケーション・データの 7 層で独立した保護を張り、1 層が破られても被害拡大を防ぐ考え方",
          "CIA 三要素は情報セキュリティの 3 本柱であり、機密性（Confidentiality：許可された者のみ閲覧可）、完全性（Integrity：改ざん防止と正確性）、可用性（Availability：必要な時に利用可能）を指す",
        ],
        examTip:
          "『VPN 接続済み社内端末でも毎回検証する』＝ ゼロトラスト、『1 つの防御が突破されても次の層で止める』＝ 多層防御、『データと ID はどの形態でも顧客責任』＝ 責任共有モデル。",
      },
      {
        id: "sc900-1-2",
        code: "1.2",
        title: "暗号化・ハッシュ化・GRC と認証・認可・フェデレーション",
        services: ["暗号化 / ハッシュ化", "GRC", "認証 / 認可", "フェデレーション / IdP"],
        keyPoints: [
          "暗号化（Encryption）は鍵を用いてデータを判読不能にし復号鍵で元に戻せる可逆変換（保存中・転送中・使用中を保護）であり、対称暗号は暗号化と復号に同じ鍵、非対称暗号は公開鍵と秘密鍵のペアを用いる",
          "ハッシュ化（Hashing）は任意長の入力から固定長のダイジェスト値を生成する不可逆の一方向変換であり、元のデータへ復号できないためパスワードの安全な保存やファイル改ざん検知（完全性検証）に用いる",
          "GRC はガバナンス（Governance：組織の方針・統制枠組み）、リスク（Risk：脅威の評価と軽減）、コンプライアンス（Compliance：法令・規制・業界標準の遵守）を統合管理する枠組み",
          "認証（Authentication）は『誰であるか』を検証する処理、認可（Authorization）は認証済み主体に『何の操作を許可するか』を判定する処理。フェデレーションは異なる組織やドメイン間で信頼関係を結び、ID プロバイダ（IdP）が発行するトークンで複数システムへサインインできるようにする",
        ],
        examTip:
          "『元に戻して読める必要がある保護』＝ 暗号化、『元に戻さず改ざん有無や一致確認を行う』＝ ハッシュ化、『本人確認は認証、アクセス権限付与は認可』。",
      },
    ],
  },
  {
    id: "sc900-domain-2",
    number: "02",
    title: "Microsoft Entra の機能",
    englishTitle: "Describe the capabilities of Microsoft Entra",
    weight: "25〜30%",
    accentColor: "cyan",
    summary:
      "Microsoft Entra ID（旧 Azure AD）のハイブリッド ID・外部 ID（B2B/B2C）、パスワードレスを含む認証手法、条件付きアクセス・ID Protection・Permissions Management・PIM によるアクセス統制を学びます。",
    topics: [
      {
        id: "sc900-2-1",
        code: "2.1",
        title: "Microsoft Entra ID・ハイブリッド ID・External ID (B2B/B2C)",
        services: [
          "Microsoft Entra ID",
          "Microsoft Entra Connect",
          "PHS / PTA / フェデレーション",
          "Entra External ID",
        ],
        keyPoints: [
          "Microsoft Entra ID（旧 Azure AD）はクラウドベースの統合 ID・アクセス管理（IAM）サービスであり、ユーザー・グループ・デバイス・アプリケーション ID の管理、SSO、外部連携を提供する",
          "ハイブリッド ID はオンプレミスの Active Directory Domain Services (AD DS) と Entra ID を Microsoft Entra Connect（または Entra Cloud Sync）で同期し、単一資格情報でのクラウドアクセスを実現する",
          "ハイブリッド認証にはパスワード ハッシュ同期（PHS：パスワードハッシュのハッシュを同期し可用性と漏洩検出に優れる）、パススルー認証（PTA：オンプレミスエージェントで都度検証）、フェデレーション（AD FS 等でオンプレミス IdP に認証委任）がある",
          "Microsoft Entra External ID は外部ユーザー連携を担い、B2B コラボレーション（パートナー企業ユーザーが自組織の資格情報のままゲストとしてリソースへアクセス）や、B2C / 顧客向けアプリの認証・登録基盤を提供する",
        ],
        examTip:
          "『オンプレミス障害時もクラウド認証を継続でき構成が最もシンプル』＝ PHS、『自社外の取引先ユーザーを招待して自社リソースへアクセスさせる』＝ External ID (B2B)。",
      },
      {
        id: "sc900-2-2",
        code: "2.2",
        title: "認証手法（MFA・Windows Hello・パスワードレス・FIDO2・SSPR）",
        services: [
          "多要素認証 (MFA)",
          "Windows Hello for Business",
          "パスワードレス / FIDO2",
          "SSPR",
        ],
        keyPoints: [
          "多要素認証（MFA）は『知っているもの（パスワード/PIN）』『持っているもの（スマホ/トークン）』『生体情報（指紋/顔）』のうち 2 つ以上の異なる要素を組み合わせ、パスワード漏洩時の不正サインインを大幅に抑止する",
          "パスワードレス認証ではパスワード入力自体を排除し、Windows Hello for Business（端末の TPM に紐づく暗号鍵＋PIN または生体認証）、Microsoft Authenticator（番号一致・生体承認）、FIDO2 セキュリティキー（USB/NFC 等）を使用する",
          "セキュリティの既定値群（Security Defaults）は追加ライセンスなしで基本的な MFA 強制やレガシー認証プロトコルブロックを即時有効化できる既定保護設定（条件付きアクセスと併用不可）",
          "セルフサービス パスワード リセット（SSPR）は、ユーザーが事前登録した認証方法を用いて管理者に依頼せず自分でパスワードの再設定やアカウントロック解除を行える機能",
        ],
        examTip:
          "『Windows 端末の TPM と生体認証/PIN で二要素かつパスワードレスを実現』＝ Windows Hello for Business、『共有端末向けハードウェア鍵』＝ FIDO2 セキュリティキー。",
      },
      {
        id: "sc900-2-3",
        code: "2.3",
        title: "条件付きアクセス・ID Protection・Permissions Management・PIM",
        services: [
          "条件付きアクセス",
          "Entra ID Protection",
          "Entra Permissions Management",
          "Entra PIM",
        ],
        keyPoints: [
          "条件付きアクセス（Conditional Access）は、ユーザー・場所（IP）・デバイスの準拠状態・アプリ・リアルタイムリスク等のシグナルを評価し、アクセス許可・MFA 要求・ブロックなどの制御を動的適用するゼロトラストの中核エンジン",
          "Microsoft Entra ID Protection は機械学習で『サインイン リスク（匿名 IP・異常な移動等）』と『ユーザー リスク（資格情報漏洩等）』を検知し、条件付きアクセスと連携してパスワード変更強制やブロックを自動実行する",
          "Microsoft Entra Permissions Management は CIEM（Cloud Infrastructure Entitlement Management）ソリューションとして、Azure・AWS・GCP に跨がる ID（人およびワークロード）の過剰・未使用権限を可視化し最小権限へ是正する",
          "Microsoft Entra Privileged Identity Management (PIM) は、管理者ロールへの常時割り当てを排除し、時間制限付きの Just-In-Time (JIT) 有効化・承認ワークフロー・MFA 要求・定期的なアクセスレビューを提供する",
        ],
        examTip:
          "『必要な時だけ期限付きで特権ロールへ昇格＋承認フロー』＝ PIM、『マルチクラウド全体の過剰権限を検出・削減（CIEM）』＝ Entra Permissions Management、『漏洩資格情報や異常サインインの自動検知』＝ Entra ID Protection。",
      },
    ],
  },
  {
    id: "sc900-domain-3",
    number: "03",
    title: "Microsoft セキュリティ ソリューションの機能",
    englishTitle: "Describe the capabilities of Microsoft security solutions",
    weight: "35〜40%",
    accentColor: "emerald",
    summary:
      "Azure ネットワーク＆キー管理基盤、Microsoft Defender for Cloud（CSPM/CWPP）、クラウドネイティブ SIEM/SOAR の Microsoft Sentinel、そして Microsoft Defender XDR と Security Copilot を網羅します。",
    topics: [
      {
        id: "sc900-3-1",
        code: "3.1",
        title: "Azure ネットワーク＆インフラ防御（DDoS・Firewall・WAF・NSG・Bastion・Key Vault）",
        services: [
          "Azure DDoS Protection",
          "Azure Firewall",
          "Web Application Firewall (WAF)",
          "NSG",
          "Azure Bastion",
          "Azure Key Vault",
        ],
        keyPoints: [
          "Azure DDoS Protection は大規模なトラフィック洪水攻撃（ボリューム攻撃・プロトコル攻撃）から Azure 公開 IP とネットワークを自動緩和で保護する（Standard/Network Protection では攻撃テレメトリやコスト保護も提供）",
          "ネットワーク セキュリティ グループ（NSG）はサブネットや NIC 単位で送信元/宛先 IP・ポート・プロトコルに基づく L3/L4 通信フィルタを行い、Azure Firewall は FQDN フィルタリングや脅威インテリジェンス連携・TLS 検査を備えたマネージド L3〜L7 ファイアウォール",
          "Web Application Firewall（WAF）は Application Gateway や Azure Front Door 上で動作し、SQL インジェクションやクロスサイトスクリプティング（XSS）など OWASP の HTTP/HTTPS L7 攻撃から Web アプリを保護する",
          "Azure Bastion は VM にパブリック IP を付与せずブラウザから TLS 経由で安全に RDP/SSH 接続できる PaaS 踏み台サービス。Azure Key Vault はシークレット・暗号化鍵・TLS/SSL 証明書を集中保護・アクセス制御する保管庫",
        ],
        examTip:
          "『OWASP SQL インジェクション対策（L7 Web 防御）』＝ WAF、『VM にパブリック IP 無しでブラウザ経由 RDP/SSH』＝ Azure Bastion、『API キーや暗号鍵の一元管理』＝ Azure Key Vault。",
      },
      {
        id: "sc900-3-2",
        code: "3.2",
        title: "Microsoft Defender for Cloud（CSPM・セキュアスコア・ワークロード保護）",
        services: [
          "Microsoft Defender for Cloud",
          "CSPM",
          "セキュアスコア",
          "Defender ワークロード保護",
        ],
        keyPoints: [
          "Microsoft Defender for Cloud は Azure・AWS・GCP およびオンプレミス（Azure Arc 連携）に跨がるクラウドセキュリティ態勢管理（CSPM）とクラウドワークロード保護（CWPP）を統合提供する",
          "CSPM 機能では環境の設定不備を継続評価して改善推奨事項を提示し、現在のセキュリティ態勢を単一数値化した『セキュアスコア（Secure Score）』と各種規制コンプライアンス準拠状況（MCSB・ISO・PCI-DSS 等）を可視化する",
          "Defender CSPM プランでは攻撃パス分析（Attack Path Analysis）やエージェントレス脆弱性スキャンにより、インターネット露出リソースから重要資産へ到達可能なリスク経路を優先特定できる",
          "拡張セキュリティ（CWPP：Defender プラン）を有効化すると、サーバー/VM・コンテナー・ストレージ・SQL データベース・Key Vault・App Service など特定ワークロードへのリアルタイム脅威検知とマルウェア対策が機能する",
        ],
        examTip:
          "『クラウド設定ミスの可視化とセキュリティ強化度合いをスコアで確認』＝ Defender for Cloud（CSPM / セキュアスコア）、『マルチクラウドのサーバーやストレージへの脅威検知』＝ Defender プラン（CWPP）。",
      },
      {
        id: "sc900-3-3",
        code: "3.3",
        title: "Microsoft Sentinel（クラウドネイティブ SIEM ＋ SOAR）",
        services: [
          "Microsoft Sentinel",
          "SIEM / SOAR",
          "分析ルール / ワークブック",
          "プレイブック (Logic Apps)",
        ],
        keyPoints: [
          "Microsoft Sentinel はクラウドネイティブな SIEM（セキュリティ情報イベント管理）および SOAR（セキュリティ オーケストレーション・自動応答）ソリューションであり、マルチクラウドやオンプレミスを含む組織全体のログを集約分析する",
          "データ コネクタを通じて Microsoft 製品やサードパーティ製ファイアウォール・Syslog 等から大量のセキュリティデータを Log Analytics ワークスペースへ収集し、ワークブックでダッシュボード可視化する",
          "分析ルール（Analytics Rules）と脅威インテリジェンス・ML 異常検知により複数ソースを横断した脅威を検知・インシデント化し、ハンティング機能（KQL クエリ）で潜在脅威を能動調査できる",
          "SOAR 機能である『プレイブック（Playbooks：Azure Logic Apps ベース）』を使うと、インシデント発生時にアカウント自動停止・IP ブロック・チケット起票・通知などの対応手順を自動実行できる",
        ],
        examTip:
          "『複数製品・他社機器のログ横断集約（SIEM）』＋『Logic Apps による自動修復アクション（SOAR/プレイブック）』＝ Microsoft Sentinel。",
      },
      {
        id: "sc900-3-4",
        code: "3.4",
        title: "Microsoft Defender XDR と Microsoft Security Copilot",
        services: [
          "Microsoft Defender XDR",
          "Defender for Endpoint",
          "Defender for Office 365",
          "Defender for Identity",
          "Defender for Cloud Apps",
          "Microsoft Security Copilot",
        ],
        keyPoints: [
          "Microsoft Defender XDR はエンドポイント・メール/コラボ・ID・SaaS アプリのシグナルを自動相関して単一インシデントへ統合し、攻撃チェーン全体（キルチェーン）の自動遮断と自己修復を行う統合 XDR 基盤",
          "Microsoft Defender for Endpoint は端末の EDR・脆弱性管理・攻撃面縮小を提供し、Defender for Office 365 は安全なリンク/安全な添付ファイルによるフィッシングやマルウェア対策をメール・Teams・SharePoint へ適用する",
          "Microsoft Defender for Identity はオンプレミス AD 等の信号を監視して横展開や特権昇格を検知し、Defender for Cloud Apps（CASB）はシャドー IT の検出やクラウドアプリ利用ポリシー・セッション制御を担う",
          "Microsoft Security Copilot はセキュリティ専用の生成 AI アシスタントであり、Microsoft Defender ポータルや Sentinel・Entra・Purview と連携してインシデント要約・KQL 生成・悪意スクリプト解析を自然言語で支援する",
        ],
        examTip:
          "『フィッシングメール対策＝Defender for Office 365』『シャドー IT 検出・CASB＝Defender for Cloud Apps』『オンプレ AD 標的の横展開検知＝Defender for Identity』『AI によるインシデント要約と調査支援＝Security Copilot』。",
      },
    ],
  },
  {
    id: "sc900-domain-4",
    number: "04",
    title: "Microsoft コンプライアンス ソリューションの機能",
    englishTitle: "Describe the capabilities of Microsoft compliance solutions",
    weight: "20〜25%",
    accentColor: "amber",
    summary:
      "Service Trust Portal とプライバシー原則、Microsoft Purview コンプライアンススコア、秘密度ラベル・DLP・保持/レコード管理、インサイダーリスク・eDiscovery・監査・Priva、および Azure/Purview ガバナンスを習得します。",
    topics: [
      {
        id: "sc900-4-1",
        code: "4.1",
        title: "Service Trust Portal・プライバシー原則・Purview コンプライアンススコア",
        services: [
          "Service Trust Portal",
          "Microsoft プライバシー原則",
          "Purview コンプライアンスポータル",
          "コンプライアンス マネージャー",
        ],
        keyPoints: [
          "Service Trust Portal（STP）は、ISO 27001・SOC 1/2/3・GDPR・FedRAMP など独立した第三者機関による Microsoft クラウドサービスの監査レポートやセキュリティ/プライバシー白書を公開・ダウンロードできる公式ポータル",
          "Microsoft のプライバシー原則は『制御（Control）』『透明性（Transparency）』『セキュリティ（Security）』『強力な法的保護』『コンテンツに基づくターゲティングなし』『ユーザーへの利益』の 6 原則で構成される",
          "Microsoft Purview コンプライアンス ポータルは組織の規制対応・リスク管理・データ保護機能を一元提供する管理画面であり、中核機能の『コンプライアンス マネージャー』が法令要件を管理コントロールへ変換する",
          "コンプライアンス スコアは、Microsoft 側が実施済みの基盤対策と、顧客側が実施すべき改善アクション（Improvement Actions）の達成度合いから算出され、規制準拠の進捗を数値で追跡できる",
        ],
        examTip:
          "『Microsoft 自身の第三者監査報告書（SOC/ISO）を入手したい』＝ Service Trust Portal、『自組織テナントの規制準拠状況と改善アクション点数を確認』＝ Purview コンプライアンス マネージャー（コンプライアンススコア）。",
      },
      {
        id: "sc900-4-2",
        code: "4.2",
        title: "情報保護とデータ ライフサイクル管理（秘密度ラベル・DLP・保持・レコード管理）",
        services: [
          "秘密度ラベル",
          "データ損失防止 (DLP)",
          "アイテム保持ポリシー / ラベル",
          "レコード管理",
        ],
        keyPoints: [
          "Microsoft Purview Information Protection の『秘密度ラベル（Sensitivity Labels）』は、文書・メール・Teams サイト等に機密度（社外秘等）を分類付与し、ラベルに応じた自動暗号化やヘッダー/透かし挿入を行う（ファイルが組織外へ移動しても保護が追従）",
          "データ損失防止（DLP）ポリシーは、クレジットカード番号やマイナンバー等の機密情報（SIT：機密情報の種類）を監視し、意図しない外部送信・Teams 共有・USB コピーなどを検知してブロックやユーザー警告を行う",
          "データ ライフサイクル管理のアイテム保持ポリシー（コンテナー単位）および保持ラベル（ファイル/メール単位）は、コンプライアンス上必要な期間の削除防止（保持）と、期間満了後の自動削除を管理する",
          "レコード管理（Records Management）は法的・規制上重要な文書を『レコード』または『規制レコード』として宣言して編集・削除をロックし、イベントベースの保持期間管理や破棄前の人手による廃棄レビュー（Disposition Review）を実現する",
        ],
        examTip:
          "『文書を暗号化し透かしを入れて社外持ち出し時も保護』＝ 秘密度ラベル、『機密番号を含むメール送信を自動ブロック』＝ DLP、『一定期間データを消させない／期間後に自動破棄』＝ 保持ポリシー・レコード管理。",
      },
      {
        id: "sc900-4-3",
        code: "4.3",
        title: "インサイダー リスク管理・eDiscovery・監査（Audit）・Microsoft Priva",
        services: [
          "インサイダー リスク管理",
          "eDiscovery",
          "Microsoft Purview Audit",
          "Microsoft Priva",
        ],
        keyPoints: [
          "インサイダー リスク管理（Insider Risk Management）は退職予定者の大量ファイルダウンロードや機密データ持ち出しなどの内部脅威兆候を相関検知し、調査時はユーザー名を既定で匿名化（仮名化）してプライバシーへ配慮する",
          "電子情報開示（eDiscovery：Standard / Premium）は、訴訟や監査に備えて関連メール・Teams チャット・SharePoint 文書を検索し、削除・改変を防ぐ『訴訟ホールド（Hold）』の適用、レビューセットでの精査、証拠エクスポートを行う",
          "Microsoft Purview Audit（Standard / Premium）は Microsoft 365 上のユーザーおよび管理者アクティビティを記録し、Premium では最大 10 年の長期保持やメールアイテム参照等の高度なフォレンジック調査イベントを記録できる",
          "Microsoft Priva は個人情報・プライバシー対策に特化し、過剰公開や無活動データの検出・社内データ転送監視を行う『プライバシー リスク管理』と、法規制（GDPR 等）に基づく『サブジェクト権利要求（データ主体の開示・削除請求）』対応を支援する",
        ],
        examTip:
          "『離職前社員の大量データ持ち出し検知』＝ インサイダー リスク管理、『訴訟向けの検索と証拠保全（ホールド）』＝ eDiscovery、『GDPR 等の個人情報開示・削除請求ワークフロー』＝ Microsoft Priva。",
      },
      {
        id: "sc900-4-4",
        code: "4.4",
        title: "Azure Policy・リソースロック・Purview データ ガバナンス",
        services: ["Azure Policy", "リソースロック", "Purview Data Map", "Purview Unified Catalog"],
        keyPoints: [
          "Azure Policy はリソースの作成・更新・監査時に『デプロイ許可リージョンの制限』『必須タグ付け』『指定 VM サイズの強制』などの組織ルールを自動評価し、違反リソースの作成拒否やコンプライアンス可視化を行う",
          "リソースロック（Resource Locks）はサブスクリプション・リソースグループ・リソースに適用して誤操作を防止し、`CanNotDelete`（削除のみ不可・変更可）と `ReadOnly`（読み取り専用・削除も変更も不可）の 2 種類で所有者権限者による誤削除も防ぐ",
          "Microsoft Purview データ ガバナンス（Data Map / Unified Catalog）は、オンプレミス・Azure・マルチクラウド・SaaS に散在するデータ資産を自動スキャン・分類し、ビジネス用語集やデータの発生元から加工先までのデータ系統（Lineage）を一元管理する",
        ],
        examTip:
          "『Azure リソース構成ルールの強制（許可リージョン限定など）』＝ Azure Policy、『重要リソースの誤削除防止』＝ リソースロック、『クラウド内外のデータ資産カタログ化と系統追跡』＝ Purview データ ガバナンス。",
      },
    ],
  },
];

export const sc900Comparisons: AzureComparisonTable[] = [
  {
    id: "sc900-comp-entra-access",
    category: "ネットワーク・セキュリティ",
    title: "Microsoft Entra ID のアクセス統制・脅威保護サービス比較",
    subtitle: "動的ポリシー判定・リスク検知・特権管理・マルチクラウド権限最小化の使い分け",
    columns: ["サービス / 機能", "主な評価・制御対象", "必要な代表的機能・タイミング", "試験で問われる適用シーン"],
    rows: [
      {
        feature: "条件付きアクセス (Conditional Access)",
        values: [
          "ユーザー・場所・端末準拠状態・アプリ・リスク",
          "サインイン時の動的 if-then ポリシー評価",
          "社外 IP や非準拠端末からのアクセスに多要素認証 (MFA) 要求またはブロック",
        ],
      },
      {
        feature: "Microsoft Entra ID Protection",
        values: [
          "ユーザーリスク（資格情報漏洩）＆サインインリスク",
          "ML による異常兆候の自動検知・スコア化",
          "匿名 IP 経由や異常移動を検知し、自動でパスワード変更や MFA を強制",
        ],
      },
      {
        feature: "Privileged Identity Management (PIM)",
        values: [
          "Microsoft Entra ロールおよび Azure リソース特権ロール",
          "時間制限付き Just-In-Time (JIT) 昇格・承認・アクセスレビュー",
          "全体管理者などの常時特権をなくし、作業時のみ理由と承認付きで有効化",
        ],
      },
      {
        feature: "Entra Permissions Management",
        values: [
          "Azure・AWS・GCP に跨がる人＆ワークロード ID の権限",
          "CIEM による過剰・未使用アクセス権の検出と是正",
          "マルチクラウド環境で不要な高権限が放置された ID を特定し最小権限化",
        ],
      },
      {
        feature: "ハイブリッド認証 (PHS / PTA / フェデレーション)",
        values: [
          "オンプレミス AD DS と Microsoft Entra ID の認証連携",
          "Microsoft Entra Connect / Cloud Sync による同期・認証方式選定",
          "耐障害性と簡素性重視なら PHS、社内検証必須なら PTA、独自 IdP 連携はフェデレーション",
        ],
      },
    ],
    decisionRule:
      "条件に基づくサインイン制御は条件付きアクセス、異常リスク検知は ID Protection、期限付き特権昇格は PIM、マルチクラウド権限削減は Permissions Management。",
  },
  {
    id: "sc900-comp-network-defense",
    category: "ネットワーク・セキュリティ",
    title: "Azure ネットワーク＆インフラ防御サービス比較",
    subtitle: "レイヤー（L3/L4 vs L7）・保護対象・運用の違いによる使い分け",
    columns: ["サービス", "保護対象・レイヤー", "主な防御・セキュリティ機能", "適したユースケース"],
    rows: [
      {
        feature: "Azure DDoS Protection",
        values: [
          "Azure 仮想ネットワーク上のパブリック IP（L3/L4）",
          "大規模トラフィック洪水・プロトコル攻撃の常時自動緩和",
          "公開 Web サイトや API の可用性を大規模 DDoS 攻撃から守る",
        ],
      },
      {
        feature: "ネットワーク セキュリティ グループ (NSG)",
        values: [
          "サブネットおよび VM NIC（L3/L4 5タプル制御）",
          "送信元/宛先 IP・ポート・プロトコルによる許可/拒否ルール",
          "VNet 内のサブネット間・VM 単位での基本的な通信制御",
        ],
      },
      {
        feature: "Azure Firewall",
        values: [
          "VNet 境界（L3〜L7 ステートフル ファイアウォール）",
          "FQDN フィルタ・脅威インテリジェンス・TLS 検査（Premium）",
          "ハブ VNet で拠点間や外向き FQDN 通信を集中監査・制御",
        ],
      },
      {
        feature: "Web Application Firewall (WAF)",
        values: [
          "HTTP / HTTPS Web アプリケーション（L7）",
          "OWASP ルールによる SQL インジェクション・XSS・ボット防御",
          "Application Gateway や Front Door で公開 Web アプリを保護",
        ],
      },
      {
        feature: "Azure Bastion",
        values: [
          "Azure VM への管理接続（RDP / SSH）",
          "VM にパブリック IP を持たせずブラウザ経由 TLS (443) 接続",
          "踏み台サーバーの構築・パッチ保守なしで安全に VM へ管理ログイン",
        ],
      },
      {
        feature: "Azure Key Vault",
        values: [
          "シークレット・暗号化キー・TLS/SSL 証明書",
          "HSM/ソフトウェア鍵管理・RBAC 制御・ソフト削除保護",
          "アプリコードから DB 接続文字列や API キーを排除して安全保管",
        ],
      },
    ],
    decisionRule:
      "L3/L4 基本制御は NSG、FQDN 含む一元 L3-L7 制御は Azure Firewall、Web 攻撃 (SQLi/XSS) は WAF、VM 踏み台は Bastion、鍵・シークレット保管は Key Vault。",
  },
  {
    id: "sc900-comp-defender-workloads",
    category: "コンピュート",
    title: "Defender for Cloud と Defender XDR の保護対象比較",
    subtitle: "クラウドインフラ/ワークロード保護（CWPP/CSPM）とエンドポイント/業務基盤 XDR の整理",
    columns: ["ソリューション", "主な保護対象領域", "コア機能", "代表的な脅威検知・防御例"],
    rows: [
      {
        feature: "Microsoft Defender for Cloud (CSPM / Defender ワークロード保護 CWPP)",
        values: [
          "Azure・AWS・GCP・オンプレミス（Arc）のサーバー/コンテナー/DB",
          "セキュアスコア評価・規制基準監査・攻撃パス分析・ワークロード保護",
          "設定不備の発見、VM や AKS コンテナー・Storage の異常アクセス検知",
        ],
      },
      {
        feature: "Microsoft Defender for Endpoint",
        values: [
          "Windows・macOS・Linux・モバイル等のクライアント/サーバー端末",
          "次世代マルウェア対策・EDR・脅威と脆弱性の管理・自動調査",
          "不審なプロセス実行やランサムウェア挙動の検知と端末の自動隔離",
        ],
      },
      {
        feature: "Microsoft Defender for Identity",
        values: [
          "オンプレミス Active Directory / AD FS / Entra Connect",
          "ドメインコントローラー信号の監視による ID 攻撃検知",
          "偵察・ブルートフォース・Pass-the-Hash・横展開（Lateral Movement）の検知",
        ],
      },
      {
        feature: "Microsoft Defender for Office 365",
        values: [
          "Exchange Online・Teams・SharePoint・OneDrive",
          "安全な添付ファイル（サンドボックス検証）・安全なリンク（クリック時検査）",
          "フィッシングメール・ビジネスメール詐欺（BEC）・悪意ある URL の遮断",
        ],
      },
      {
        feature: "Microsoft Defender for Cloud Apps",
        values: [
          "SaaS アプリケーション全般（Microsoft 外サービス含む）",
          "Cloud Access Security Broker（CASB）・シャドー IT 検出・セッション制御",
          "未許可 SaaS への大容量データアップロード検知や非管理端末のダウンロード制限",
        ],
      },
    ],
    decisionRule:
      "クラウド基盤の姿勢管理とサーバー/コンテナー保護は Defender for Cloud、端末 EDR・メール・オンプレ AD・SaaS の統合防御は Defender XDR 群。",
  },
  {
    id: "sc900-comp-secops-ai",
    category: "AI・機械学習",
    title: "SecOps・AI 支援・インテリジェンス（Sentinel / XDR / Security Copilot）比較",
    subtitle: "ログ横断分析（SIEM）・自動対応（SOAR）・生成 AI 支援の役割分担",
    columns: ["ソリューション", "位置づけ・技術基盤", "強み・主な機能", "SOC 運用での役割"],
    rows: [
      {
        feature: "Microsoft Sentinel",
        values: [
          "クラウドネイティブ SIEM ＋ SOAR（Log Analytics 基盤）",
          "分析ルール・ワークブック・ML 異常検知・Logic Apps プレイブック",
          "組織全体の横断相関分析、KQL 脅威ハンティング、自動修復ワークフロー実行",
        ],
      },
      {
        feature: "Microsoft Defender XDR",
        values: [
          "統合 XDR（Extended Detection and Response）",
          "エンドポイント・ID・メール・SaaS シグナルの自動相関と攻撃遮断",
          "個別アラートを 1 つのインシデントへ自動統合し、侵害端末やアカウントを自動修復",
        ],
      },
      {
        feature: "Microsoft Security Copilot",
        values: [
          "セキュリティ専用 生成 AI アシスタント（LLM＋専用プラグイン）",
          "自然言語でのインシデント要約・KQL 生成・難読化スクリプト解析・対応手順提案",
          "SOC アナリストの調査速度と一次トリアージ品質を自然言語対話で底上げ",
        ],
      },
      {
        feature: "Microsoft Defender 脅威インテリジェンス",
        values: [
          "脅威インテリジェンス（TI）分析プラットフォーム",
          "攻撃者グループ・インフラ（IP/ドメイン）・IoC（侵害指標）情報の集約",
          "調査中の不審ドメインや攻撃手法の背景を最新脅威データと照合して把握",
        ],
      },
    ],
    decisionRule:
      "マルチベンダーログの長期集約・相関と自動プレイブックは Sentinel、Microsoft 環境の自動修復 XDR は Defender XDR、生成 AI 調査支援は Security Copilot。",
  },
  {
    id: "sc900-comp-purview-data",
    category: "ストレージ・DB",
    title: "Microsoft Purview 情報保護・DLP・データライフサイクル比較",
    subtitle: "データの分類暗号化・持ち出し防止・保持破棄・全社データカタログの整理",
    columns: ["機能・ソリューション", "対象データ・スコープ", "主な制御メカニズム", "適用シナリオ"],
    rows: [
      {
        feature: "秘密度ラベル (Information Protection)",
        values: [
          "Office 文書・メール・PDF・Teams/サイト・Power BI",
          "分類タグ付け＋暗号化・権限設定・ヘッダー/透かし挿入",
          "『社外秘』ラベルで暗号化し、ファイルが外部転送されても閲覧権限を制御",
        ],
      },
      {
        feature: "データ損失防止 (DLP)",
        values: [
          "Exchange・SharePoint・OneDrive・Teams・エンドポイント端末",
          "機密情報の種類（SIT）を検出してブロック・暗号化・警告通知",
          "顧客のカード番号や個人情報を含むファイルの社外送信・USB コピーを遮断",
        ],
      },
      {
        feature: "アイテム保持ポリシー / 保持ラベル",
        values: [
          "メールボックス・サイト・Teams チャット・ファイル",
          "指定期間の削除防止（保持）および期間満了後の自動削除",
          "法令義務期間中の削除禁止や、不要な古いチャットログの計画的自動消去",
        ],
      },
      {
        feature: "レコード管理 (Records Management)",
        values: [
          "契約書・財務記録など法的証拠価値のあるドキュメント",
          "不変レコード宣言・イベント起点保持・廃棄レビュー承認",
          "契約終了後から法定保持期間中の改変ロックと、満了時の担当者レビュー後の廃棄記録",
        ],
      },
      {
        feature: "Purview Unified Catalog (Data Map / データ ガバナンス)",
        values: [
          "Azure SQL・Blob Storage・マルチクラウド・オンプレミス DB",
          "自動スキャン・機密データ分類・用語集・データ系統（Lineage）",
          "全社データストアに散在する個人データの所在把握とデータ系譜の可視化",
        ],
      },
    ],
    decisionRule:
      "文書ごとの暗号化・透かしは秘密度ラベル、情報漏洩アクションの阻止は DLP、保存と自動削除は保持、不変証明と廃棄承認はレコード管理、DB 横断棚卸しは Purview Data Map。",
  },
  {
    id: "sc900-comp-compliance-gov",
    category: "ガバナンス・監視・コスト",
    title: "コンプライアンス評価・監査・プライバシー・Azure 統制比較",
    subtitle: "第三者監査情報・自組織準拠スコア・内部リスク・法的開示・リソース保護の整理",
    columns: ["ツール / サービス", "対象領域・視点", "提供される価値・成果物", "使い分けの判断基準"],
    rows: [
      {
        feature: "Service Trust Portal (STP) / Microsoft プライバシー原則",
        values: [
          "Microsoft クラウド基盤側のコンプライアンス証明と GRC 指針",
          "ISO・SOC・FedRAMP 等の第三者監査報告書とプライバシー設計原則",
          "クラウド採用審査で Microsoft 自体のセキュリティ認証・監査結果を確認する時",
        ],
      },
      {
        feature: "Purview コンプライアンスポータル（コンプライアンス マネージャー）",
        values: [
          "顧客テナント側の規制準拠管理とコンプライアンススコア",
          "法令テンプレート（GDPR/ISO 等）別の改善アクションと数値スコア",
          "自社の M365/Azure 設定が規制基準をどれだけ満たしているか追跡・改善する時",
        ],
      },
      {
        feature: "インサイダー リスク管理",
        values: [
          "内部ユーザーによるデータ漏洩・不正持ち出し兆候",
          "退職予定者の大量ダウンロード等の相関アラート（既定で仮名化）",
          "悪意あるまたは過失による社内情報持ち出しをプライバシー配慮しつつ調査する時",
        ],
      },
      {
        feature: "eDiscovery / Microsoft Purview Audit",
        values: [
          "訴訟・法令調査（eDiscovery）と操作証跡ログ（Audit）",
          "訴訟ホールド・検索エクスポート（eDiscovery）／操作履歴追跡（Audit）",
          "法的紛争での証拠保全・提出は eDiscovery、誰が何を閲覧/変更したかの追跡は Audit",
        ],
      },
      {
        feature: "Microsoft Priva",
        values: [
          "個人データのプライバシーリスクと権利請求対応",
          "過剰共有・地域間データ転送検知とサブジェクト権利要求 (SRR)",
          "個人データの放置リスク削減や本人からの開示・削除請求（GDPR 等）を処理する時",
        ],
      },
      {
        feature: "Azure Policy / リソースロック",
        values: [
          "Azure リソースの作成構成ルールと誤削除防止",
          "非準拠リソース作成阻止（Policy）／CanNotDelete・ReadOnly ロック",
          "許可リージョン等の構成強制は Policy、本番リソースの削除凍結はリソースロック",
        ],
      },
    ],
    decisionRule:
      "Microsoft 監査資料は STP、自社準拠スコアはコンプライアンス マネージャー、訴訟保全は eDiscovery、操作証跡は Audit、権利請求は Priva、Azure 構成統制は Policy/ロック。",
  },
];

export const sc900Patterns: AzureArchitecturePattern[] = [
  {
    id: "sc900-pat-1",
    title: "ゼロトラストに基づくパスワードレス認証・JIT 特権管理構成",
    badge: "Zero Trust Identity",
    flow: [
      "ユーザー端末 (Windows Hello / FIDO2)",
      "Microsoft Entra ID Protection",
      "条件付きアクセス (準拠・リスク評価)",
      "Microsoft Entra PIM (JIT 特権昇格)",
    ],
    summary:
      "パスワードレス認証で資格情報窃取を防ぎ、サインインリスクと端末準拠状態を動的に評価した上で、管理者権限も PIM による期限付き承認昇格へ限定するゼロトラスト ID 構成です。",
    keyDesignPoints: [
      "パスワードを使わない認証（Windows Hello for Business / Authenticator / FIDO2）によりフィッシング耐性を確保",
      "常時管理者割り当てを排除し、PIM の Just-In-Time 有効化とアクセスレビューで最小特権原則を徹底",
    ],
  },
  {
    id: "sc900-pat-2",
    title: "多層防御による Azure ネットワーク境界・アプリ保護構成",
    badge: "Network Defense in Depth",
    flow: [
      "Azure DDoS Protection (L3/L4 緩和)",
      "Web Application Firewall / Azure Firewall",
      "NSG (サブネット・NIC 通信分離)",
      "Azure Bastion & Azure Key Vault",
    ],
    summary:
      "DDoS 防御・L7 Web アプリ保護（WAF）・L3〜L7 ファイアウォール・サブネット単位の NSG を階層配置し、管理接続は Bastion、秘密情報は Key Vault へ分離する多層防御構成です。",
    keyDesignPoints: [
      "公開 Web アプリへの OWASP 攻撃は WAF で遮断し、内部通信は Azure Firewall と NSG で多段階制御",
      "VM へのパブリック IP 付与を廃止して Azure Bastion 経由のみ許可し、キーや証明書は Key Vault で一元保護",
    ],
  },
  {
    id: "sc900-pat-3",
    title: "Defender XDR ＋ Sentinel ＋ Security Copilot 統合 SecOps 構成",
    badge: "SIEM + SOAR & XDR",
    flow: [
      "Microsoft Defender XDR (端末・メール・ID・SaaS)",
      "Microsoft Sentinel (SIEM 横断分析)",
      "SOAR プレイブック自動修復 (Logic Apps)",
      "Microsoft Security Copilot (AI 調査支援)",
    ],
    summary:
      "エンドポイントやメール・ID の攻撃を Defender XDR で自動相関し、他社機器ログを含めて Microsoft Sentinel へ集約、プレイブック自動対応と Security Copilot による迅速な調査を実現する構成です。",
    keyDesignPoints: [
      "Defender XDR が Microsoft 環境の攻撃チェーンを自動遮断し、Sentinel がマルチベンダー全体のログを統合相関",
      "Logic Apps ベースのプレイブックで定型初動を自動化し、Security Copilot でインシデント要約や KQL 作成を効率化",
    ],
  },
  {
    id: "sc900-pat-4",
    title: "マルチクラウド＆ハイブリッド CSPM / ワークロード保護構成",
    badge: "CSPM & CWPP",
    flow: [
      "Azure / AWS / GCP / オンプレミス (Azure Arc)",
      "Microsoft Defender for Cloud",
      "セキュアスコア＆攻撃パス分析 (CSPM)",
      "Defender プラン (サーバー・DB 脅威防御)",
    ],
    summary:
      "Azure Arc 連携によりオンプレミスや他社クラウドも含めて Defender for Cloud に統合し、セキュアスコアに基づく姿勢改善（CSPM）とワークロードごとの脅威防御（CWPP）を一元運用する構成です。",
    keyDesignPoints: [
      "セキュアスコアと規制コンプライアンス評価で設定ミスを優先度順に是正し、攻撃経路を事前に遮断",
      "サーバー・コンテナー・Storage・SQL などの重要資産には CWPP（Defender プラン）を適用してリアルタイム検知",
    ],
  },
  {
    id: "sc900-pat-5",
    title: "Microsoft Purview 情報保護・DLP・ライフサイクル統制構成",
    badge: "Information Protection",
    flow: [
      "Purview 秘密度ラベル (分類・暗号化)",
      "データ損失防止 (DLP ポリシー制御)",
      "アイテム保持ポリシー / 保持ラベル",
      "レコード管理 (不変保持・廃棄レビュー)",
    ],
    summary:
      "機密ファイルに秘密度ラベルを付与してファイル単位で保護しつつ、DLP で意図しない外部流出を遮断し、保持ポリシーとレコード管理で保存から破棄までのライフサイクルを統制する構成です。",
    keyDesignPoints: [
      "秘密度ラベルによる暗号化はドキュメントに埋め込まれるため、組織外へ共有された後もアクセス制御が維持される",
      "法的証跡文書はレコード管理で改ざん・誤削除をロックし、保存期間満了時は廃棄レビューを経て安全に処分",
    ],
  },
  {
    id: "sc900-pat-6",
    title: "プライバシー保護・内部リスク・法的開示統合コンプライアンス構成",
    badge: "Compliance & Privacy",
    flow: [
      "Purview コンプライアンス マネージャー",
      "Microsoft Priva (プライバシーリスク・SRR)",
      "インサイダー リスク管理 (兆候検知)",
      "Purview Audit ＆ eDiscovery (証拠保全)",
    ],
    summary:
      "コンプライアンススコアで規制対応状況を管理しながら、Priva で個人データリスクと開示請求へ対応し、内部脅威検知と監査ログ・eDiscovery による法的調査体制を整備する構成です。",
    keyDesignPoints: [
      "インサイダー リスク管理は既定でユーザー名を仮名化表示し、調査対象者のプライバシー保護と脅威対策を両立",
      "訴訟や規制調査が発生した場合は eDiscovery の訴訟ホールドで関連データを即時保全し、Audit で操作履歴を検証",
    ],
  },
];

export const sc900Pitfalls: AzurePitfall[] = [
  {
    id: "sc900-pit-1",
    trap: "「社内ネットワーク（または VPN 接続済み環境）からのアクセスであればゼロトラストでも検証を省略して信頼できる」と考える",
    whyWrong:
      "ゼロトラストの基本原則は『侵害を前提とする（Assume breach）』と『明示的に検証する（Verify explicitly）』であり、ネットワーク境界の内外を問わずすべてのアクセス要求で ID・端末状態・リスクを検証する必要があります。",
    correctApproach:
      "社内ネットワークであっても暗黙の信頼（暗黙的許可）を行わず、条件付きアクセス等で毎回明示的検証と最小特権を適用する点を確認する。",
  },
  {
    id: "sc900-pit-2",
    trap: "「パスワードを保存するときは復号可能な暗号化を用い、機密文書の保護には一方向ハッシュ化を使う」と逆転して覚える",
    whyWrong:
      "ハッシュ化は不可逆の一方向変換であるため元のデータを取り出せず、機密文書やデータの読み書き保護には使えません。逆にパスワード保存は万一の漏洩時に元パスワードを復元されないよう不可逆なハッシュ化（＋ソルト）を用います。",
    correctApproach:
      "『復号して使うデータ保護（保存・通信）＝暗号化』『元に戻さず一致検証や改ざん検知を行う（パスワード保存・完全性確認）＝ハッシュ化』と切り分ける。",
  },
  {
    id: "sc900-pit-3",
    trap: "「ネットワーク セキュリティ グループ（NSG）を設定すれば SQL インジェクションや XSS などの Web アプリ攻撃（L7）も防げる」と誤解する",
    whyWrong:
      "NSG は送信元/宛先 IP・ポート・プロトコルを扱う L3/L4 レベルのフィルタであり、HTTP/HTTPS パケット内部の悪意ある SQL クエリやスクリプト payload を検査・遮断することはできません。",
    correctApproach:
      "L3/L4 通信許可制御は NSG、FQDN フィルタ含む L3〜L7 境界制御は Azure Firewall、OWASP Top 10 の Web アプリ攻撃防御は Web Application Firewall (WAF) を選択する。",
  },
  {
    id: "sc900-pit-4",
    trap: "「Microsoft Defender for Cloud があれば SIEM としての他社機器ログ集約や Logic Apps 自動応答（SOAR）も不要になる」と混同する",
    whyWrong:
      "Defender for Cloud はクラウド資源の姿勢評価（CSPM）とワークロード脅威保護（CWPP）に特化しています。マルチベンダー機器ログの長期蓄積・相関分析（SIEM）と自動化プレイブック（SOAR）は Microsoft Sentinel の役割です。",
    correctApproach:
      "クラウド資産の設定評価と保護＝Defender for Cloud、全社・他社ログ統合と SOAR 自動応答＝Microsoft Sentinel、Microsoft 365/端末の統合防御＝Defender XDR と役割を整理する。",
  },
  {
    id: "sc900-pit-5",
    trap: "「Microsoft Purview の秘密度ラベルを付ければ、法的保持期間中にユーザーがファイルを削除することも自動で防げる」と誤解する",
    whyWrong:
      "秘密度ラベルはデータの分類・暗号化・透かし等による情報漏洩保護（機密性）が目的であり、ファイルの削除防止や保存期限管理はアイテム保持ポリシー／保持ラベルおよびレコード管理の機能です。",
    correctApproach:
      "誰が見られるか・暗号化するか＝『秘密度ラベル』、持ち出し操作の禁止＝『DLP』、いつまで消さずに残すか・期限後に消すか＝『アイテム保持／レコード管理』と使い分ける。",
  },
  {
    id: "sc900-pit-6",
    trap: "「自社の Microsoft 365 テナントの準拠状況（コンプライアンススコア）を確認するために Service Trust Portal を使う」と混同する",
    whyWrong:
      "Service Trust Portal は Microsoft 自身のクラウド基盤に関する第三者監査報告書（ISO/SOC 等）やセキュリティ資料を公開するポータルです。顧客テナントの準拠点数管理は Microsoft Purview コンプライアンス マネージャーの役割です。",
    correctApproach:
      "Microsoft の監査報告書取得＝Service Trust Portal、自社テナント設定のコンプライアンススコアと改善アクション管理＝Microsoft Purview コンプライアンス ポータル（コンプライアンス マネージャー）。",
  },
];

export const sc900KeyFacts: AzureKeyFact[] = [
  {
    id: "sc900-kf-1",
    target: "Exam SC-900 合格基準",
    value: "700 / 1000 点（無期限）",
    detail: "試験時間 45 分・100〜1000 のスケールスコアで判定され Fundamentals 資格は失効しない",
  },
  {
    id: "sc900-kf-2",
    target: "ゼロトラストの 3 原則",
    value: "明示的に検証・最小特権・侵害を前提",
    detail: "境界内外を問わず ID・端末・場所・リスクを毎回検証し最小権限のみ付与する",
  },
  {
    id: "sc900-kf-3",
    target: "多層防御（Defense in Depth）の 7 層",
    value: "物理・ID・境界・ネット・計算・アプリ・データ",
    detail: "各層で独立した防御を設け、単一防御の突破が全体侵害へ波及するのを防ぐ",
  },
  {
    id: "sc900-kf-4",
    target: "責任共有モデル（常に顧客責任）",
    value: "情報・データ、デバイス、アカウントと ID",
    detail: "IaaS・PaaS・SaaS のいずれでもデータ保護と ID 管理は常に顧客責任に残る",
  },
  {
    id: "sc900-kf-5",
    target: "暗号化 vs ハッシュ化",
    value: "可逆（復号可） vs 不可逆（一方向）",
    detail: "機密保護には暗号化、完全性検証やパスワード保存にはハッシュ化を使用する",
  },
  {
    id: "sc900-kf-6",
    target: "パスワードレス認証の主要 3 手法",
    value: "Windows Hello / Authenticator / FIDO2",
    detail: "パスワード入力を排し、TPM 鍵・生体認証・FIDO2 ハードウェアキー等で認証する",
  },
  {
    id: "sc900-kf-7",
    target: "Entra PIM（Privileged Identity Management）",
    value: "JIT 有効化・承認フロー・アクセスレビュー",
    detail: "常時特権を廃止し、必要な時だけ期限・理由・MFA 付きで管理者権限を有効化する",
  },
  {
    id: "sc900-kf-8",
    target: "Microsoft Defender for Cloud",
    value: "CSPM（セキュアスコア）＋ CWPP",
    detail: "Azure/AWS/GCP/オンプレに跨がり態勢評価・規制準拠・ワークロード保護を提供",
  },
  {
    id: "sc900-kf-9",
    target: "Microsoft Sentinel",
    value: "クラウドネイティブ SIEM ＋ SOAR",
    detail: "Log Analytics 上で横断ログ収集・脅威分析し、Logic Apps プレイブックで自動対応",
  },
  {
    id: "sc900-kf-10",
    target: "Service Trust Portal vs コンプライアンススコア",
    value: "Microsoft 監査報告書 vs 自社準拠スコア",
    detail: "第三者監査証明の参照は STP、自社テナントのコンプライアンス改善管理は Purview",
  },
];

export const sc900QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "『明示的検証・最小特権アクセス・侵害を前提とする』の 3 原則に基づくセキュリティモデル",
    category: "基礎概念",
    recommended: "ゼロトラスト（Zero Trust）",
    reason: "社内ネットワーク内外に関わらずすべてのアクセス要求を信頼せず毎回検証します。",
  },
  {
    keyword: "物理〜ID〜境界〜ネットワーク〜計算〜アプリ〜データの 7 層で独立防御を重ねる戦略",
    category: "基礎概念",
    recommended: "多層防御（Defense in Depth）",
    reason: "ある防御層が突破されても後続の層で攻撃を食い止め、データ侵害を防ぎます。",
  },
  {
    keyword: "データが許可なく改ざん・破壊されず正確で完全な状態に保たれていることを指す要素",
    category: "基礎概念",
    recommended: "完全性（Integrity：CIA 三要素）",
    reason: "ハッシュ検証やデジタル署名等によってデータの改ざんがないことを保証します。",
  },
  {
    keyword: "元のデータへ復号できず、ファイル改ざん検知やパスワードの安全な保存に使われる変換",
    category: "基礎概念",
    recommended: "ハッシュ化（Hashing）",
    reason: "不可逆の一方向関数により固定長のダイジェスト値を生成します。",
  },
  {
    keyword: "異なる組織・ドメイン間で信頼関係を結び、IdP のトークンで別システムへログインする仕組み",
    category: "基礎概念",
    recommended: "フェデレーション（Federation）",
    reason: "複数環境で資格情報を複製せず、SAML や OIDC 等により安全に SSO 連携できます。",
  },
  {
    keyword: "オンプレミス AD DS と Entra ID でパスワードハッシュのハッシュを同期する最も単純な認証",
    category: "Microsoft Entra",
    recommended: "パスワード ハッシュ同期（PHS）",
    reason: "オンプレミス回線障害時もクラウド認証が継続でき、資格情報漏洩検出にも対応します。",
  },
  {
    keyword: "取引先企業ユーザーが自社の資格情報のままゲストとして組織リソースへアクセスする機能",
    category: "Microsoft Entra",
    recommended: "Microsoft Entra External ID（B2B コラボレーション）",
    reason: "外部パートナー用に新規パスワードを発行・管理する負担なく安全に共同作業できます。",
  },
  {
    keyword: "端末内の暗号鍵（TPM）と生体認証または PIN でパスワードなしサインインを行う機能",
    category: "Microsoft Entra",
    recommended: "Windows Hello for Business",
    reason: "端末に紐づく暗号鍵と生体/PIN により二要素かつパスワードレス認証を実現します。",
  },
  {
    keyword: "ユーザーが管理者へ連絡せず自分でパスワードリセットやロック解除を行える機能",
    category: "Microsoft Entra",
    recommended: "セルフサービス パスワード リセット（SSPR）",
    reason: "事前登録した MFA 手段等で本人確認し、ヘルプデスク負荷を抑えつつ復旧できます。",
  },
  {
    keyword: "場所・端末の準拠状態・ユーザー/サインインリスクを評価して MFA や拒否を動的に強制",
    category: "Microsoft Entra",
    recommended: "条件付きアクセス（Conditional Access）",
    reason: "ゼロトラストの中核エンジンとしてコンテキストに応じたアクセス制御を行います。",
  },
  {
    keyword: "匿名 IP 利用や資格情報漏洩などのユーザーリスク・サインインリスクを ML で自動検知",
    category: "Microsoft Entra",
    recommended: "Microsoft Entra ID Protection",
    reason: "検知したリスクレベルを条件付きアクセスへ連携し自動ブロックやパスワード変更を行えます。",
  },
  {
    keyword: "Azure・AWS・GCP に跨がる ID やワークロードの過剰・未使用権限を検出し最小権限化（CIEM）",
    category: "Microsoft Entra",
    recommended: "Microsoft Entra Permissions Management",
    reason: "マルチクラウド全体の権限使用状況を可視化し、不要な高権限リスクを削減します。",
  },
  {
    keyword: "特権管理者ロールを常時有効にせず、承認と期限付きで Just-In-Time (JIT) 昇格させる機能",
    category: "Microsoft Entra",
    recommended: "Microsoft Entra PIM（Privileged Identity Management）",
    reason: "管理者アカウント侵害時の被害範囲を抑え、定期的なアクセスレビューも実施できます。",
  },
  {
    keyword: "OWASP Top 10（SQL インジェクションや XSS 等）の L7 攻撃から Web アプリを保護する機能",
    category: "ネットワーク・基盤防御",
    recommended: "Azure Web Application Firewall (WAF)",
    reason: "Application Gateway や Front Door 上で HTTP/HTTPS トラフィックの悪意あるペイロードを遮断します。",
  },
  {
    keyword: "Azure VM にパブリック IP を付与せずブラウザ経由の TLS 通信だけで安全に RDP/SSH 接続",
    category: "ネットワーク・基盤防御",
    recommended: "Azure Bastion",
    reason: "マネージド PaaS 踏み台として動作し、VM の管理ポートをインターネットへ直接公開せずに済みます。",
  },
  {
    keyword: "アプリケーションで使用する API シークレット・暗号化鍵・TLS 証明書を集中保護するサービス",
    category: "ネットワーク・基盤防御",
    recommended: "Azure Key Vault",
    reason: "コードへの秘密情報直書きを排除し、HSM 対応鍵管理や RBAC・ローテーションを実現します。",
  },
  {
    keyword: "マルチクラウド全体のセキュリティ設定評価（セキュアスコア）とワークロード脅威保護を統合提供",
    category: "脅威保護・SecOps",
    recommended: "Microsoft Defender for Cloud",
    reason: "CSPM による姿勢管理と Defender プランによる CWPP（サーバー/DB/コンテナー保護）を担います。",
  },
  {
    keyword: "全社・他社製品ログを横断集約（SIEM）し、Logic Apps プレイブックで自動対応（SOAR）",
    category: "脅威保護・SecOps",
    recommended: "Microsoft Sentinel",
    reason: "KQL による脅威ハンティングや複数ソース間の相関検知、自動修復をクラウド規模で実行します。",
  },
  {
    keyword: "エンドポイント・メール・ID・SaaS の脅威信号を単一インシデントへ自動相関して修復",
    category: "脅威保護・SecOps",
    recommended: "Microsoft Defender XDR",
    reason: "Defender for Endpoint / Office 365 / Identity / Cloud Apps を統合した XDR プラットフォームです。",
  },
  {
    keyword: "自然言語でインシデント要約・KQL 生成・スクリプト解析を支援するセキュリティ専用生成 AI",
    category: "脅威保護・SecOps",
    recommended: "Microsoft Security Copilot",
    reason: "Defender ポータルや Sentinel と統合され、SOC アナリストの調査と対応を高速化します。",
  },
  {
    keyword: "Microsoft クラウドの ISO・SOC 等の第三者監査レポートやセキュリティ文書を公開する窓口",
    category: "コンプライアンス・Purview",
    recommended: "Service Trust Portal (STP)",
    reason: "顧客が Microsoft 基盤のセキュリティ・プライバシー適合性を監査報告書の一次資料で確認できます。",
  },
  {
    keyword: "ファイルやメールに機密区分を付与し暗号化や透かしで組織外移動後も保護する機能",
    category: "コンプライアンス・Purview",
    recommended: "Microsoft Purview 秘密度ラベル（Information Protection）",
    reason: "ラベル自体に保護設定が紐づくため、外部共有や別クラウドへの保存後も制御が維持されます。",
  },
  {
    keyword: "退職予定者の大量持ち出し等の内部脅威をユーザー名を仮名化したまま相関検知する機能",
    category: "コンプライアンス・Purview",
    recommended: "Microsoft Purview インサイダー リスク管理",
    reason: "プライバシーに配慮しつつ内部不正や過失による機密データ漏洩の兆候を早期発見します。",
  },
  {
    keyword: "個人情報のリスク検知に加え、GDPR 等のデータ主体からの開示・削除請求（SRR）を処理する製品",
    category: "コンプライアンス・Purview",
    recommended: "Microsoft Priva",
    reason: "プライバシー リスク管理とサブジェクト権利要求のワークフロー自動化に特化しています。",
  },
];

export const sc900PracticeQuestions: CertQuestion[] = [
  {
    id: "sc900-q1",
    domainId: "sc900-domain-1",
    domainLabel: "01: セキュリティ・コンプライアンス・ID の概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "ゼロトラストセキュリティモデルの 3 つの基本原則の組み合わせとして正しいものはどれですか？",
    options: [
      "明示的に検証する・最小特権アクセスを使う・侵害を前提とする",
      "社内ネットワークを無条件に信頼する・全員へ管理者権限を付与する・境界のみ監視する",
      "物理セキュリティを無効化する・暗号化を省略する・パスワードを定期共有する",
      "オンプレミスのみ保護する・クラウドは完全委任する・認証ログを破棄する",
    ],
    correctIndices: [0],
    explanation:
      "ゼロトラストの 3 原則は『明示的に検証する（Verify explicitly）』『最小特権アクセスを使う（Use least privilege access）』『侵害を前提とする（Assume breach）』です。",
    keywords: ["ゼロトラスト", "3 原則", "最小特権"],
  },
  {
    id: "sc900-q2",
    domainId: "sc900-domain-1",
    domainLabel: "01: セキュリティ・コンプライアンス・ID の概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "クラウドの責任共有モデルにおいて、IaaS・PaaS・SaaS のいずれの形態を採用しても常に顧客側の責任範囲に残る項目はどれですか？",
    options: [
      "物理データセンターの電源と空調設備の保守",
      "物理サーバーホストおよびハイパーバイザーのパッチ管理",
      "情報・データ、デバイス、およびアカウントと ID の管理",
      "クラウド基盤の物理ネットワークケーブルの監視",
    ],
    correctIndices: [2],
    explanation:
      "どのサービスモデルを選んでも『情報・データ』『デバイス』『アカウントと ID』の保護・管理は常に顧客責任です。物理設備やハイパーバイザーはクラウドプロバイダー（Microsoft）が担います。",
    keywords: ["責任共有モデル", "顧客責任"],
  },
  {
    id: "sc900-q3",
    domainId: "sc900-domain-1",
    domainLabel: "01: セキュリティ・コンプライアンス・ID の概念",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ソフトウェアの配布ファイルがダウンロード途中で改ざんされていないかを確認するため、元のデータへ戻す必要のない固定長の値（ダイジェスト）を生成して比較したい場合、用いられる暗号技術はどれですか？",
    options: [
      "ハッシュ化（Hashing）",
      "対称鍵暗号化（Symmetric Encryption）",
      "ハードウェア仮想化（Hyper-V）",
      "フェデレーション（Federation）",
    ],
    correctIndices: [0],
    explanation:
      "ハッシュ化は任意のデータから固定長のハッシュ値を生成する一方向（不可逆）変換であり、データが改ざんされていないこと（完全性）の検証やパスワードの安全な保存に用いられます。",
    keywords: ["ハッシュ化", "完全性", "CIA 三要素"],
  },
  {
    id: "sc900-q4",
    domainId: "sc900-domain-1",
    domainLabel: "01: セキュリティ・コンプライアンス・ID の概念",
    difficulty: "標準",
    selectCount: 1,
    question:
      "あるユーザーが ID とパスワードでログインした後に、「このユーザーには対象ファイルの読み取りだけを許可し、削除は許可しない」と判定・制御する仕組みを指す用語はどれですか？",
    options: [
      "認証（Authentication）",
      "認可（Authorization）",
      "ハッシュ化（Hashing）",
      "可用性（Availability）",
    ],
    correctIndices: [1],
    explanation:
      "ユーザーが誰であるかを検証するのが『認証（Authentication）』、認証された主体に対してどのリソースへ何の操作を許すかを制御するのが『認可（Authorization）』です。",
    keywords: ["認証", "認可", "アクセス制御"],
  },
  {
    id: "sc900-q5",
    domainId: "sc900-domain-1",
    domainLabel: "01: セキュリティ・コンプライアンス・ID の概念",
    difficulty: "応用",
    selectCount: 2,
    question:
      "多層防御（Defense in Depth）およびフェデレーションに関する説明として正しいものを 2 つ選択してください。",
    options: [
      "多層防御では物理・ID とアクセス・境界・ネットワーク・コンピューティング・アプリ・データの各層に独立した防御策を配置する",
      "フェデレーションを用いると、信頼関係にある ID プロバイダ（IdP）が発行するトークンを使って異なる組織やシステムのアプリへアクセスできる",
      "多層防御とはファイアウォール 1 台だけにすべての防御機能を集中させ、他層のセキュリティを省く設計である",
      "フェデレーションを使うと、すべての連携先サービスへユーザーの生パスワードをそのまま複製保存する必要がある",
    ],
    correctIndices: [0, 1],
    explanation:
      "多層防御は 7 層で独立した防御を重ねて被害の波及を防ぐ戦略です。フェデレーションは組織・ドメイン間の信頼関係により資格情報を複製せずトークンベースでアクセス連携を行います。",
    keywords: ["多層防御", "フェデレーション", "ID プロバイダ"],
  },
  {
    id: "sc900-q6",
    domainId: "sc900-domain-2",
    domainLabel: "02: Microsoft Entra の機能",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "オンプレミスの Active Directory Domain Services (AD DS) と Microsoft Entra ID をハイブリッド接続する際、最も構成がシンプルで、オンプレミスのサーバーが一時停止してもクラウド側のサインイン認証を継続でき、漏洩資格情報の検出にも対応できる方式はどれですか？",
    options: [
      "パスワード ハッシュ同期（PHS）",
      "パススルー認証（PTA）",
      "AD FS によるフェデレーション認証のみ",
      "手動 CSV インポートのみ",
    ],
    correctIndices: [0],
    explanation:
      "パスワード ハッシュ同期（PHS）はパスワードハッシュのさらにハッシュ値を同期するため、オンプレミス障害時でもクラウド側で認証継続が可能であり、Microsoft Entra ID Protection の資格情報漏洩検出にも対応します。",
    keywords: ["PHS", "ハイブリッド ID", "Entra Connect"],
  },
  {
    id: "sc900-q7",
    domainId: "sc900-domain-2",
    domainLabel: "02: Microsoft Entra の機能",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "社外のパートナー企業の担当者を自社の Microsoft Teams チームや SharePoint サイトへゲストとして招待し、相手企業が普段利用している既存の仕事用アカウントのまま認証して共同作業を行いたい場合、活用すべき機能はどれですか？",
    options: [
      "Microsoft Entra External ID（B2B コラボレーション）",
      "Windows Hello for Business",
      "Azure Bastion",
      "Microsoft Sentinel プレイブック",
    ],
    correctIndices: [0],
    explanation:
      "Microsoft Entra External ID の B2B コラボレーション機能を使うと、外部パートナーに新規アカウントやパスワードを発行することなく、相手側の資格情報のままゲストとして安全に連携できます。",
    keywords: ["External ID", "B2B", "ゲストアクセス"],
  },
  {
    id: "sc900-q8",
    domainId: "sc900-domain-2",
    domainLabel: "02: Microsoft Entra の機能",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ユーザーがパスワードを記憶・入力することなく、PC 本体の TPM チップに保存された非対称暗号鍵と生体認証（顔・指紋）または専用 PIN を組み合わせて強固な 2 要素認証を行える Microsoft のパスワードレス認証手法はどれですか？",
    options: [
      "Windows Hello for Business",
      "セルフサービス パスワード リセット（SSPR）",
      "レガシー基本認証（Basic Auth）",
      "IP 許可リストのみ",
    ],
    correctIndices: [0],
    explanation:
      "Windows Hello for Business はデバイス固有の暗号鍵（持っているもの）と生体情報または PIN（生体/知っているもの）により、パスワードを使わずに二要素認証を実現します。",
    keywords: ["Windows Hello for Business", "パスワードレス", "TPM"],
  },
  {
    id: "sc900-q9",
    domainId: "sc900-domain-2",
    domainLabel: "02: Microsoft Entra の機能",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Microsoft Entra ID において、「全体管理者などの特権ロールを常時有効にせず、必要な作業時だけ承認と理由の入力・MFA を経て 2 時間限定で権限を昇格させたい」という要件を満たす機能はどれですか？",
    options: [
      "Microsoft Entra Privileged Identity Management (PIM)",
      "Microsoft Entra Permissions Management",
      "Microsoft Purview Audit",
      "Azure DDoS Protection",
    ],
    correctIndices: [0],
    explanation:
      "PIM は Just-In-Time (JIT) による期限付き特権アクティブ化、承認ワークフロー、MFA 強制、アクセスレビューを提供し、常設の過剰特権リスクを排除します。",
    keywords: ["PIM", "JIT", "特権アクセス管理"],
  },
  {
    id: "sc900-q10",
    domainId: "sc900-domain-2",
    domainLabel: "02: Microsoft Entra の機能",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Microsoft Entra のアクセス制御およびマルチクラウド権限・リスク管理に関する正しい記述を 2 つ選択してください。",
    options: [
      "条件付きアクセスはユーザーの場所・デバイスの準拠状態・アプリ・リスク等のシグナルに基づきアクセス許可や MFA 要求を制御できる",
      "Microsoft Entra Permissions Management は Azure・AWS・GCP に跨がる ID の過剰権限や未使用権限を可視化・是正する CIEM 機能である",
      "Microsoft Entra ID Protection は物理データセンターの入退室カメラ映像だけを監視するサービスである",
      "セルフサービス パスワード リセット（SSPR）を有効にすると、ユーザーは毎回必ず情報システム担当者の手動入力を待つ必要がある",
    ],
    correctIndices: [0, 1],
    explanation:
      "条件付きアクセスはコンテキストに応じた動的制御を行い、Entra Permissions Management はマルチクラウドの過剰権限を最小化する CIEM です。ID Protection はユーザー/サインインリスクを検知し、SSPR はユーザー自身でのリセットを可能にします。",
    keywords: ["条件付きアクセス", "Permissions Management", "CIEM"],
  },
  {
    id: "sc900-q11",
    domainId: "sc900-domain-3",
    domainLabel: "03: Microsoft セキュリティ ソリューションの機能",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Azure 上に公開している Web アプリケーションに対し、SQL インジェクションやクロスサイトスクリプティング（XSS）などの HTTP/HTTPS レイヤー（L7）の脆弱性を狙う攻撃を検査・遮断するために導入すべきサービスはどれですか？",
    options: [
      "Web Application Firewall (WAF)",
      "Azure Key Vault",
      "ネットワーク セキュリティ グループ (NSG)",
      "Azure Bastion",
    ],
    correctIndices: [0],
    explanation:
      "Web Application Firewall（WAF）は Application Gateway や Azure Front Door に統合され、OWASP Top 10 に代表される L7 の Web アプリケーション攻撃を防御します。NSG は L3/L4 の IP・ポート単位制御です。",
    keywords: ["WAF", "SQL インジェクション", "OWASP"],
  },
  {
    id: "sc900-q12",
    domainId: "sc900-domain-3",
    domainLabel: "03: Microsoft セキュリティ ソリューションの機能",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Azure VM に対してパブリック IP アドレスを一切割り当てずに、Azure Portal のブラウザ上から TLS（HTTPS）経由で安全に RDP または SSH 管理接続を行えるマネージド PaaS サービスはどれですか？",
    options: [
      "Azure Bastion",
      "Azure DDoS Protection",
      "Microsoft Defender for Office 365",
      "Microsoft Priva",
    ],
    correctIndices: [0],
    explanation:
      "Azure Bastion は VNet 内にデプロイされるマネージド踏み台サービスであり、VM の RDP/SSH ポートをインターネットに公開せずブラウザから安全に接続できます。",
    keywords: ["Azure Bastion", "RDP/SSH", "パブリック IP 不要"],
  },
  {
    id: "sc900-q13",
    domainId: "sc900-domain-3",
    domainLabel: "03: Microsoft セキュリティ ソリューションの機能",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure・AWS・GCP およびオンプレミス（Azure Arc 連携）のクラウドリソースに対し、セキュリティ設定の健全性を『セキュアスコア』として数値化し、規制基準への準拠状況確認（CSPM）やサーバー・ストレージ等の脅威保護（CWPP）を統合提供するサービスはどれですか？",
    options: [
      "Microsoft Defender for Cloud",
      "Service Trust Portal",
      "Microsoft Purview レコード管理",
      "Azure Policy のみ",
    ],
    correctIndices: [0],
    explanation:
      "Microsoft Defender for Cloud はマルチクラウド・ハイブリッド環境の CSPM（セキュアスコア・推奨事項・攻撃パス分析）と CWPP（各ワークロード向け Defender プラン）を統合提供します。",
    keywords: ["Defender for Cloud", "CSPM", "セキュアスコア"],
  },
  {
    id: "sc900-q14",
    domainId: "sc900-domain-3",
    domainLabel: "03: Microsoft セキュリティ ソリューションの機能",
    difficulty: "標準",
    selectCount: 2,
    question:
      "クラウドネイティブ SIEM ＋ SOAR である Microsoft Sentinel の主要機能として正しいものを 2 つ選択してください。",
    options: [
      "データ コネクタを用いて Microsoft 製品だけでなくサードパーティ製ファイアウォールや他社クラウドのログも収集し相関分析できる",
      "Azure Logic Apps ベースのプレイブック（Playbooks）を使い、インシデント検出時のアカウント停止やチケット起票を自動化できる",
      "Microsoft Sentinel はオンプレミス環境や他社クラウドからのログ収集を一切サポートしていない",
      "Microsoft Sentinel を使うと暗号化鍵や TLS 証明書の HSM 保管庫として利用できる",
    ],
    correctIndices: [0, 1],
    explanation:
      "Microsoft Sentinel はデータコネクタによるマルチベンダーログ集約（SIEM）と、Logic Apps プレイブックによる自動応答（SOAR）を提供します。鍵や証明書の保管庫は Azure Key Vault です。",
    keywords: ["Microsoft Sentinel", "SIEM", "SOAR", "プレイブック"],
  },
  {
    id: "sc900-q15",
    domainId: "sc900-domain-3",
    domainLabel: "03: Microsoft セキュリティ ソリューションの機能",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Microsoft Defender XDR ファミリーおよび Microsoft Security Copilot の役割に関する正しい組み合わせを 2 つ選択してください。",
    options: [
      "Microsoft Defender for Office 365 は、安全なリンクや安全な添付ファイル検証によりメールや Teams 上のフィッシング攻撃を防ぐ",
      "Microsoft Security Copilot は、生成 AI を活用して自然言語でインシデントの要約、KQL クエリ作成、攻撃スクリプト解析を支援する",
      "Microsoft Defender for Cloud Apps は、Azure VNet の L3/L4 パケットをルーティングする仮想ルーターである",
      "Microsoft Defender for Identity は、物理データセンターの停電を復旧させる無停電電源装置である",
    ],
    correctIndices: [0, 1],
    explanation:
      "Defender for Office 365 はメール/コラボ保護、Security Copilot は SecOps 向け生成 AI アシスタントです。Defender for Cloud Apps は SaaS を保護する CASB、Defender for Identity はオンプレ AD 等の ID 脅威検知を担います。",
    keywords: ["Defender for Office 365", "Security Copilot", "Defender XDR"],
  },
  {
    id: "sc900-q16",
    domainId: "sc900-domain-4",
    domainLabel: "04: Microsoft コンプライアンス ソリューションの機能",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "法務・監査部門から「Microsoft のクラウドサービスが ISO 27001 や SOC 2 などの独立した第三者監査基準を満たしている証明資料（監査レポート）を確認したい」と依頼された場合、最初に案内すべき公式ポータルはどれですか？",
    options: [
      "Microsoft Service Trust Portal (STP)",
      "Microsoft Entra ID Protection",
      "Azure Bastion",
      "Microsoft Defender for Endpoint",
    ],
    correctIndices: [0],
    explanation:
      "Service Trust Portal は Microsoft クラウドサービスに対する独立監査人の監査報告書（ISO・SOC・FedRAMP 等）やセキュリティ・プライバシー関連ホワイトペーパーを提供する公開ポータルです。",
    keywords: ["Service Trust Portal", "第三者監査", "コンプライアンス"],
  },
  {
    id: "sc900-q17",
    domainId: "sc900-domain-4",
    domainLabel: "04: Microsoft コンプライアンス ソリューションの機能",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "社員が機密 Word 文書に「社外秘」の分類マークを付け、同時にファイルの暗号化とアクセス権限制限・透かし挿入を適用して、メール添付や外部ストレージへ移動した後も文書自体に保護が追従するようにしたい場合、使用する機能はどれですか？",
    options: [
      "Microsoft Purview 秘密度ラベル（Sensitivity Labels）",
      "Azure DDoS Protection",
      "リソースロック（CanNotDelete）",
      "Azure Firewall",
    ],
    correctIndices: [0],
    explanation:
      "Microsoft Purview Information Protection の秘密度ラベルは、コンテンツの分類と同時に暗号化・閲覧権限・透かしをファイル自体に埋め込み、保存場所が変わっても保護を維持します。",
    keywords: ["秘密度ラベル", "Information Protection", "Microsoft Purview"],
  },
  {
    id: "sc900-q18",
    domainId: "sc900-domain-4",
    domainLabel: "04: Microsoft コンプライアンス ソリューションの機能",
    difficulty: "標準",
    selectCount: 1,
    question:
      "従業員がクレジットカード番号やマイナンバーを含むファイルを Microsoft Teams や Exchange メールで社外宛てに送信しようとした瞬間に、内容を自動検知して送信をブロックし警告ポリシーヒントを表示したい場合、構成すべき機能はどれですか？",
    options: [
      "Microsoft Purview データ損失防止（DLP）",
      "Azure Bastion",
      "Microsoft Entra Connect",
      "Service Trust Portal",
    ],
    correctIndices: [0],
    explanation:
      "データ損失防止（DLP）は機密情報の種類（SIT）を含むデータの不適切な共有・送信・コピーをリアルタイムに監視し、ブロックやユーザーへのポリシーヒント表示を行います。",
    keywords: ["DLP", "データ損失防止", "機密情報の種類"],
  },
  {
    id: "sc900-q19",
    domainId: "sc900-domain-4",
    domainLabel: "04: Microsoft コンプライアンス ソリューションの機能",
    difficulty: "標準",
    selectCount: 1,
    question:
      "訴訟案件の発生に伴い、関係する従業員のメールボックス・Teams メッセージ・SharePoint ドキュメントを対象に検索を行い、訴訟終了までデータが削除・改変されないよう法的に保全（ホールド）して証拠データをエクスポートしたい場合、利用すべき Microsoft Purview 機能はどれですか？",
    options: [
      "電子情報開示（eDiscovery）",
      "Azure Key Vault",
      "Windows Hello for Business",
      "ネットワーク セキュリティ グループ（NSG）",
    ],
    correctIndices: [0],
    explanation:
      "Microsoft Purview eDiscovery（Standard / Premium）は、法的調査や訴訟における対象コンテンツの検索・訴訟ホールド（法的保全）・レビュー・エクスポートを一貫して支援します。",
    keywords: ["eDiscovery", "訴訟ホールド", "電子情報開示"],
  },
  {
    id: "sc900-q20",
    domainId: "sc900-domain-4",
    domainLabel: "04: Microsoft コンプライアンス ソリューションの機能",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Microsoft Purview のコンプライアンス機能および Azure ガバナンスに関する正しい記述を 2 つ選択してください。",
    options: [
      "インサイダー リスク管理は退職予定者の大量ファイル持ち出し等のリスク指標を相関検知し、調査時は既定でユーザー名を仮名化してプライバシーを保護する",
      "Azure Policy は許可リージョンの制限や必須タグなどリソース構成ルールを強制し、リソースロック（CanNotDelete / ReadOnly）は誤削除・誤変更を防ぐ",
      "Microsoft Priva は Azure 仮想マシンの CPU 使用率とネットワーク帯域だけを計測するインフラ監視ツールである",
      "Microsoft Purview コンプライアンス スコアは、Microsoft のデータセンター所在地一覧だけを表示し自社の改善アクションは扱わない",
    ],
    correctIndices: [0, 1],
    explanation:
      "インサイダー リスク管理は仮名化によりプライバシーに配慮しつつ内部脅威を検知します。Azure Policy はリソース構成の準拠性統制、リソースロックは削除/変更凍結を担います。Microsoft Priva は個人情報リスクとサブジェクト権利要求を扱い、コンプライアンス スコアは自社の改善アクション達成度を評価します。",
    keywords: ["インサイダー リスク管理", "Azure Policy", "リソースロック", "Priva"],
  },
];

export const sc900OfficialResources: AzureOfficialResource[] = [
  {
    title: "Microsoft Certified: Security, Compliance, and Identity Fundamentals 認定公式ページ",
    description:
      "SC-900 認定資格の概要、対象スキル、無期限（更新不要）ルール、受験予約への公式ハブです。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/security-compliance-and-identity-fundamentals/",
    badge: "公式認定ページ",
  },
  {
    title: "Exam SC-900 公式試験ガイド (Study Guide)",
    description:
      "4 つの出題ドメイン（10〜15% / 25〜30% / 35〜40% / 20〜25%）の最新評価項目を確認できる一次情報です。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/sc-900",
    badge: "公式試験ガイド",
  },
  {
    title: "Microsoft ゼロ トラスト ガイダンス センター",
    description:
      "ゼロトラスト原則（明示的検証・最小特権・侵害想定）に基づく ID・デバイス・ネットワーク・データ防御の公式アーキテクチャガイドです。",
    url: "https://learn.microsoft.com/ja-jp/security/zero-trust/",
    badge: "公式セキュリティガイド",
  },
  {
    title: "Microsoft Learn 公式トレーニング (SC-900T00)",
    description:
      "セキュリティ概念、Microsoft Entra、Defender / Sentinel、Microsoft Purview を体系的に学べる公式モジュール群です。",
    url: "https://learn.microsoft.com/ja-jp/training/courses/sc-900t00",
    badge: "公式トレーニング",
  },
];
