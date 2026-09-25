// AIツール検証マトリックス ⇔ 社内Google Sheets（AIツールマスター）連携
// シートを「ウェブに公開（CSV）」した URL から取得し、列名（1行目）でマッピングする。

// 公開CSVのURL（未設定の間はページ内の組込みデータを表示）
export const TOOLS_SHEET_CSV_URL = "";

type Score = 1 | 2 | 3;

export interface SheetTool {
  id: number;
  initial: string;
  initialBg: string;
  name: string;
  form: string;
  manualUrl?: string;
  applyRequired?: boolean;
  status: "全社員利用可能" | "利用可能" | "社内セキュア網" | "検証中" | "リストアップ";
  statusNote?: string;
  licenseCount?: string;
  dev: { score: Score; note: string };
  doc: { score: Score; note: string };
  research: { score: Score; note: string };
  auto: { score: Score; note: string };
  coverage: string;
  coverageRatio: number;
  description: string;
  securityLevel: string;
  impactScore: number;
  easeScore: number;
}

const statuses = ["全社員利用可能", "利用可能", "社内セキュア網", "検証中", "リストアップ"] as const;

// RFC 4180 準拠の最小CSVパーサ（ダブルクォート内の改行・カンマ・"" に対応）
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

const toScore = (v: string): Score => {
  const n = Number(v);
  return n >= 3 ? 3 : n >= 2 ? 2 : 1;
};

const toNumber = (v: string, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && v.trim() !== "" ? n : fallback;
};

export function csvToTools(text: string): SheetTool[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) return [];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  const get = (r: string[], key: string) => (idx[key] !== undefined ? (r[idx[key]] ?? "").trim() : "");

  return rows
    .filter((r) => get(r, "name"))
    .map((r, i) => {
      const status = get(r, "status");
      const name = get(r, "name");
      return {
        id: toNumber(get(r, "id"), i + 1),
        initial: get(r, "initial") || name.charAt(0).toUpperCase(),
        initialBg: get(r, "initialBg") || "bg-slate-600 text-white",
        name,
        form: get(r, "form"),
        manualUrl: get(r, "manualUrl") || undefined,
        applyRequired: get(r, "applyRequired").toUpperCase() === "TRUE" || undefined,
        status: (statuses as readonly string[]).includes(status)
          ? (status as SheetTool["status"])
          : "リストアップ",
        statusNote: get(r, "statusNote") || undefined,
        licenseCount: get(r, "licenseCount") || undefined,
        dev: { score: toScore(get(r, "dev_score")), note: get(r, "dev_note") },
        doc: { score: toScore(get(r, "doc_score")), note: get(r, "doc_note") },
        research: { score: toScore(get(r, "research_score")), note: get(r, "research_note") },
        auto: { score: toScore(get(r, "auto_score")), note: get(r, "auto_note") },
        coverage: get(r, "coverage"),
        coverageRatio: Math.min(1, Math.max(0, toNumber(get(r, "coverageRatio"), 0))),
        description: get(r, "description"),
        securityLevel: get(r, "securityLevel"),
        impactScore: toNumber(get(r, "impactScore"), 5),
        easeScore: toNumber(get(r, "easeScore"), 5),
      };
    });
}

export async function fetchSheetTools(signal?: AbortSignal): Promise<SheetTool[]> {
  const res = await fetch(TOOLS_SHEET_CSV_URL, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`Sheets CSV ${res.status}`);
  const tools = csvToTools(await res.text());
  if (!tools.length) throw new Error("Sheets CSV has no rows");
  return tools;
}
