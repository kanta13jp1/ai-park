"use client";

import { useState } from "react";
import {
  Terminal,
  Cpu,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TiltCard from "@/components/TiltCard";
import TroubleshootingBoard from "@/components/TroubleshootingBoard";
import { playCyberClick, playCyberHover } from "@/lib/sound";

function CopyableCodeSnippet({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    playCyberClick();
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-1">
      {label && <span className="text-[11px] font-bold text-slate-700 font-mono">{label}</span>}
      <div className="relative flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 group shadow-inner">
        <code className="font-mono text-xs text-cyan-300 break-all select-all mr-2">{code}</code>
        <button
          onClick={handleCopy}
          onMouseEnter={() => playCyberHover()}
          className="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          title="コードをコピー"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function WindowsAntigravityGuide() {
  const [isMcpOpen, setIsMcpOpen] = useState(true);
  const [isPsOpen, setIsPsOpen] = useState(true);
  const [isFaqOpen, setIsFaqOpen] = useState(true);

  return (
    <div className="space-y-6" id="windows-powershell-tips">
      {/* 1. Windows (PowerShell) 実践Tips */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div
          className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer select-none"
          onClick={() => { playCyberClick(); setIsPsOpen(!isPsOpen); }} onMouseEnter={() => playCyberHover()}
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                Windows (PowerShell) 実践Tips・記法＆文字化け対策
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Windows環境でAntigravity CLIやエージェント操作を行う際の必須ノウハウ
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            {isPsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isPsOpen && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>パス区切り記号はスラッシュ（/）を推奨</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Windows標準のバックスラッシュ（\）は、JSONやエスケープシーケンスと競合してエラーの原因になりやすいです。コードやAIへの指示では常にスラッシュ（例:{" "}
                  <code className="text-slate-800 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    src/app/page.tsx
                  </code>
                  ）を使用してください。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>PowerShellの文字化け（UTF-8）対策</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PowerShell出力で日本語が化ける場合は、ターミナルの文字コードをUTF-8に設定します。
                </p>
                <CopyableCodeSnippet
                  code="[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8"
                  label="PowerShell UTF-8設定コマンド"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>特殊文字（$記号・引用符）のエスケープ</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PowerShellでは <code className="font-mono text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">$</code>{" "}
                  が変数展開されるため、インラインで渡す場合はバッククォート（`$）でエスケープするか、シングルクォートで文字列を囲みます。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>実行ポリシー（ExecutionPolicy）のエラー</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  スクリプト実行時に「スクリプトの実行が無効になっている」とエラーが出る場合は、カレントプロセスのみ一時許可します。
                </p>
                <CopyableCodeSnippet
                  code="Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process"
                  label="実行ポリシー一時緩和コマンド"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. MCP (Model Context Protocol) 連携手順 */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div
          className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer select-none"
          onClick={() => { playCyberClick(); setIsMcpOpen(!isMcpOpen); }} onMouseEnter={() => playCyberHover()}
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                社内MCP（Model Context Protocol）ツールの活用と安全設定
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                AIがブラウザ自動検証や公式ドキュメント参照を自律的に動かす仕組み
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            {isMcpOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isMcpOpen && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Antigravity は「MCP」標準にネイティブ対応しています。社内環境で検証済みのMCPサーバーを利用することで、ブラウザの自動検証やドキュメント参照をエージェントに直接実行させることができます。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-2xl">
                <div
                  onMouseEnter={() => playCyberHover()}
                  className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 space-y-2 h-full cursor-default"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-purple-900">chrome_devtools</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-200/60 text-purple-800">検証用</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ローカルのブラウザ画面のスナップショット取得、クリック・スクロール・フォーム自動入力・パフォーマンストレースの実行。
                  </p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-2xl">
                <div
                  onMouseEnter={() => playCyberHover()}
                  className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 space-y-2 h-full cursor-default"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-indigo-900">puppeteer</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-200/60 text-indigo-800">自動化</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ヘッドレスブラウザによるE2E画面操作、HTMLレンダリング後のテキスト抽出、スクリーンショット自動保存。
                  </p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={4} glareOpacity={0.08} className="rounded-2xl">
                <div
                  onMouseEnter={() => playCyberHover()}
                  className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/70 space-y-2 h-full cursor-default"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-cyan-900">context7</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-200/60 text-cyan-800">公式ドキュメント</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    最新のオープンソースライブラリやフレームワーク（Next.js, React, Tailwind等）の公式最新ドキュメント検索・参照。
                  </p>
                </div>
              </TiltCard>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950">
              <div className="flex items-center space-x-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>社内MCP利用におけるセキュリティ重要ルール</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
                <li>
                  <strong className="text-slate-900">認証トークン・シークレットの直接入力禁止:</strong>{" "}
                  MCPツールの引数やチャットプロンプトにAPIキー、パスワード、秘密鍵を直接記述しないでください。
                </li>
                <li>
                  <strong className="text-slate-900">破壊的操作の事前確認:</strong>{" "}
                  データベースの削除操作や大量データ削除を伴うコマンド実行前には、エージェントから必ず事前承認を求める設定となっています。
                </li>
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* 3. 実践トラブルシューティング＆エラー解決早見表（TODO-18） */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div
          className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer select-none"
          onClick={() => { playCyberClick(); setIsFaqOpen(!isFaqOpen); }} onMouseEnter={() => playCyberHover()}
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Windows環境 エラー解決＆トラブルシューティング早見表
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  確定コマンド集
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                PowerShell実行ポリシー、GCPアカウント・プロジェクト切替、文字化け、ポート競合のワンクリック解決コマンド
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            {isFaqOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isFaqOpen && (
          <div className="space-y-8">
            <TroubleshootingBoard />

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                社内実例Q&A・運用Tips
              </h4>
              <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <p className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="text-rose-600">Q.</span>
                  <span>チャット送信時に「You can prompt the model to try again」と出て進まない</span>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pl-4">
                  <strong className="text-slate-800">A.</strong>{" "}
                  Google Cloud の「Cloud AI Companion API」が無効化されているか、アカウントへの権限付与（<code className="bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-800 font-mono">roles/cloudaicompanion.user</code>）が完了していないことが原因です。社内管理者（AI推進担当）に権限付与を依頼してください。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <p className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="text-rose-600">Q.</span>
                  <span>長時間のタスク実行で「Task timeout」や途中で止まった場合は？</span>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pl-4">
                  <strong className="text-slate-800">A.</strong>{" "}
                  Antigravity は自動バックグラウンドタスク管理を備えています。チャット欄に「直前のステップでどこまで完了したか確認し、残りの作業を続けてください」と入力すると、エージェントがログと成果物ファイルを確認してスムーズに再開します。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <p className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="text-rose-600">Q.</span>
                  <span>モデル選択（Pro / Flash / Flash Lite）はどれを選ぶべき？</span>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pl-4">
                  <strong className="text-slate-800">A.</strong>{" "}
                  普段のコーディング・設計・リファクタリングには「Gemini 3.1 Pro」（高精度・マルチファイル把握）を推奨します。簡単な単一ファイルの関数作成やドキュメント調査など、速度重視の場合は「Flash」が最適です。
                </p>
              </div>
            </div>
          </div>
        </div>
        )}
      </section>
    </div>
  );
}
