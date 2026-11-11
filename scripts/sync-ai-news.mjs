/**
 * sync-ai-news.mjs
 * 各社公式フィード（Google DeepMind, Google Antigravity, OpenAI, Mistral AI, Hugging Face,
 * GitHub AI, Figma, Latent Space, The Gradient, Import AI 等）を自動巡回し、
 * 最新AIニュースを public/data/ai-news-live.json に自動反映するデータパイプラインスクリプト。
 * ベースニュースは src/data/ai-news.ts (aiNewsMaster) を唯一の情報源（SSOT）として参照する。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_FILE = path.join(__dirname, '..', 'public', 'data', 'ai-news-live.json');
const MASTER_TS_FILE = path.join(__dirname, '..', 'src', 'data', 'ai-news.ts');

// HTMLエンティティのデコード
function decodeHtmlEntities(str) {
  return (str || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&ndash;/gi, '-')
    .replace(/&mdash;/gi, '—')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// タイトルを単語途中で切らずに引用フォーマットするヘルパー
function formatTitleForQuote(title, maxLen = 85) {
  const clean = decodeHtmlEntities(title);
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced) + '...';
}

// RSS (<item>) および Atom (<entry>) 両対応のXMLパーサー
function parseFeedXml(xmlText) {
  const items = [];
  const itemMatches =
    xmlText.match(/<item[\s\S]*?<\/item>/gi) ||
    xmlText.match(/<entry[\s\S]*?<\/entry>/gi) ||
    [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);

    // RSS <link>url</link> または Atom <link href="url" .../>
    let link = '';
    const linkHrefMatch =
      itemXml.match(/<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/i) ||
      itemXml.match(/<link[^>]+href=["']([^"']+)["']/i);
    const linkTagMatch = itemXml.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    if (linkTagMatch && linkTagMatch[1].trim().startsWith('http')) {
      link = linkTagMatch[1].trim();
    } else if (linkHrefMatch) {
      link = linkHrefMatch[1].trim();
    }

    const descMatch =
      itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i) ||
      itemXml.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i) ||
      itemXml.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/i);

    const pubDateMatch =
      itemXml.match(/<pubDate[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i) ||
      itemXml.match(/<published[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/published>/i) ||
      itemXml.match(/<updated[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/updated>/i);

    if (titleMatch && link) {
      const title = decodeHtmlEntities(titleMatch[1].replace(/<[^>]+>/g, ''));
      let summary = descMatch ? decodeHtmlEntities(descMatch[1].replace(/<[^>]+>/g, '')) : '';
      if (summary.length > 260) {
        const sliced = summary.slice(0, 257);
        const lastSpace = sliced.lastIndexOf(' ');
        summary = (lastSpace > 180 ? sliced.slice(0, lastSpace) : sliced) + '...';
      }

      let dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
      if (pubDateMatch) {
        const d = new Date(pubDateMatch[1].trim());
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().slice(0, 10).replace(/-/g, '/');
        }
      }

      items.push({
        title,
        link,
        summary,
        date: dateStr,
      });
    }
  }
  return items;
}

// 静的マスター（src/data/ai-news.ts）から aiNewsMaster を単一情報源（SSOT）として読み込む
function loadStaticMasterNews() {
  try {
    if (!fs.existsSync(MASTER_TS_FILE)) return [];
    const content = fs.readFileSync(MASTER_TS_FILE, 'utf-8');
    const marker = 'export const aiNewsMaster: AINewsItem[] =';
    const idx = content.indexOf(marker);
    if (idx !== -1) {
      const arrayPart = content
        .slice(idx + marker.length)
        .trim()
        .replace(/;\s*$/, '');
      const parsed = new Function(`return (${arrayPart});`)();
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[WARN] Could not parse src/data/ai-news.ts:', err.message);
  }
  return [];
}

// 各社公式フィードの巡回設定（Issue #118 拡充対応）
const FEED_CONFIGS = [
  {
    feedId: 'deepmind',
    name: 'Google DeepMind',
    url: 'https://deepmind.google/blog/rss.xml',
    category: 'google',
    categoryLabel: 'Google / Antigravity',
    defaultImportance: 'hot',
    defaultImportanceLabel: 'HOT 🔥',
    maxItems: 4,
    defaultAudience: ['全社員', 'エンジニア', '企画・データ推進'],
    impactGenerator: (title) =>
      `Google DeepMindの最新知能・推論モデル「${formatTitleForQuote(title)}」に関する公式発表。社内での活用検証および業務効率化への適用を検討します。`,
    tagGenerator: () => ['Google DeepMind', 'Frontier AI', 'Gemini', '公式発表'],
  },
  {
    feedId: 'antigravity',
    name: 'Google Antigravity',
    url: 'https://antigravity.google/blog/rss.xml',
    category: 'google',
    categoryLabel: 'Google / Antigravity',
    defaultImportance: 'hot',
    defaultImportanceLabel: 'HOT 🔥',
    maxItems: 4,
    defaultAudience: ['全社員', 'エンジニア', 'モバイル開発者', 'セキュリティ担当'],
    impactGenerator: (title) =>
      `Google Antigravityの最新アップデート「${formatTitleForQuote(title)}」。公式プラグインやカスタムエージェントを活用した開発効率化と安全なリリースパイプラインを検証します。`,
    tagGenerator: () => ['Google Antigravity', 'Custom Agents', 'Plugins', '公式ブログ'],
  },
  {
    feedId: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com/news/rss.xml',
    category: 'model',
    categoryLabel: '基盤モデル・LLM',
    defaultImportance: 'official',
    defaultImportanceLabel: '公式発表',
    maxItems: 3,
    defaultAudience: ['全社員', 'エンジニア', 'ライター'],
    impactGenerator: (title) =>
      `OpenAIの最新機能・モデルアップデート「${formatTitleForQuote(title)}」。ドキュメント作成・コード生成の現場における生産性向上効果を検証します。`,
    tagGenerator: () => ['OpenAI', 'ChatGPT', 'Codex', '公式発表'],
  },
  {
    feedId: 'mistral',
    name: 'Mistral AI',
    url: 'https://mistral.ai/rss.xml',
    category: 'model',
    categoryLabel: '基盤モデル・LLM',
    defaultImportance: 'official',
    defaultImportanceLabel: '公式発表',
    maxItems: 2,
    defaultAudience: ['エンジニア', 'アーキテクト', 'セキュリティ担当'],
    impactGenerator: (title) =>
      `Mistral AIの公式発表「${formatTitleForQuote(title)}」。オープンウェイトモデルや高効率推論基盤の技術動向として確認します。`,
    tagGenerator: () => ['Mistral AI', 'Open Weights', '基盤モデル', '公式発表'],
  },
  {
    feedId: 'huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'agent_mcp',
    categoryLabel: '開発エージェント・MCP',
    defaultImportance: 'tech',
    defaultImportanceLabel: '技術解説',
    maxItems: 2,
    defaultAudience: ['エンジニア', 'データサイエンティスト', 'アーキテクト'],
    impactGenerator: (title) =>
      `Hugging Face公式ブログ「${formatTitleForQuote(title)}」。オープンソースAIエコシステム・モデル評価・エージェント実装の参考知見です。`,
    tagGenerator: () => ['Hugging Face', 'OSS AI', 'エージェント評価', '技術解説'],
  },
  {
    feedId: 'github-ai',
    name: 'GitHub Blog (AI & ML)',
    url: 'https://github.blog/ai-and-ml/feed/',
    category: 'agent_mcp',
    categoryLabel: '開発エージェント・MCP',
    defaultImportance: 'tech',
    defaultImportanceLabel: '技術解説',
    maxItems: 2,
    defaultAudience: ['全社員', 'エンジニア', 'テックリード'],
    impactGenerator: (title) =>
      `GitHub公式AIブログ「${formatTitleForQuote(title)}」。GitHub連携・PRレビュー・AIネイティブ開発ワークフローの改善に役立ちます。`,
    tagGenerator: () => ['GitHub', 'AI Coding', '開発ワークフロー', '技術解説'],
  },
  {
    feedId: 'figma',
    name: 'Figma Blog',
    url: 'https://www.figma.com/blog/feed/atom.xml',
    category: 'industry',
    categoryLabel: '業界・最新技術',
    defaultImportance: 'tech',
    defaultImportanceLabel: '技術解説',
    maxItems: 2,
    defaultAudience: ['デザイナー', 'フロントエンド開発者', 'プロダクトマネージャー'],
    impactGenerator: (title) =>
      `Figma公式ブログ「${formatTitleForQuote(title)}」。UI/UXデザインとAI・コード連携のワークフロー改善に参考となる情報です。`,
    tagGenerator: () => ['Figma', 'UI/UX', 'Design System', 'デザイン連携'],
  },
  {
    feedId: 'latentspace',
    name: 'Latent Space',
    url: 'https://www.latent.space/feed',
    category: 'industry',
    categoryLabel: '業界・最新技術',
    defaultImportance: 'tech',
    defaultImportanceLabel: '技術解説',
    maxItems: 2,
    defaultAudience: ['エンジニア', 'アーキテクト', 'AI推進担当'],
    impactGenerator: (title) =>
      `AIエンジニアリング専門メディア Latent Space「${formatTitleForQuote(title)}」。最新のAIエージェント設計・実務適用のトレンドを把握できます。`,
    tagGenerator: () => ['Latent Space', 'AI Engineering', 'Agentic AI', '技術動向'],
  },
  {
    feedId: 'importai',
    name: 'Import AI',
    url: 'https://importai.substack.com/feed',
    category: 'industry',
    categoryLabel: '業界・最新技術',
    defaultImportance: 'tech',
    defaultImportanceLabel: '技術解説',
    maxItems: 1,
    defaultAudience: ['エンジニア', 'リサーチャー', '企画担当'],
    impactGenerator: (title) =>
      `Import AI「${formatTitleForQuote(title)}」。AI安全性・評価ベンチマーク・先端研究の週次トレンドとして共有します。`,
    tagGenerator: () => ['Import AI', 'AI Research', 'AI安全性', '先端動向'],
  },
];

async function fetchFeedSafe(config) {
  try {
    console.log(`[INFO] Fetching official feed: ${config.name} (${config.url})...`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8秒タイムアウト

    const res = await fetch(config.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-Park-News-Bot/1.0',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[WARN] Feed ${config.name} returned status ${res.status}`);
      return [];
    }

    const xmlText = await res.text();
    const parsed = parseFeedXml(xmlText);
    console.log(`[SUCCESS] Extracted ${parsed.length} items from ${config.name}`);

    const limit = config.maxItems || 3;
    return parsed.slice(0, limit).map((item, idx) => {
      const urlSlug = (item.link || '')
        .split('?')[0]
        .replace(/\/$/, '')
        .split('/')
        .pop()
        ?.replace(/[^a-zA-Z0-9-_]/g, '')
        .slice(0, 48);
      const itemId = urlSlug
        ? `live-${config.feedId}-${urlSlug}`
        : `live-${config.feedId}-${item.date.replace(/\//g, '')}-${idx}`;
      return {
        id: itemId,
        title: `${config.name}: ${item.title}`,
        date: item.date,
        category: config.category,
        categoryLabel: config.categoryLabel,
        importance: config.defaultImportance,
        importanceLabel: config.defaultImportanceLabel,
        summary: item.summary || `${config.name} 公式アナウンスメント。最新の技術アップデートと提供開始情報です。`,
        impactForStaff: config.impactGenerator(item.title),
        recommendedFor: config.defaultAudience,
        sourceName: `${config.name} Official Feed`,
        sourceUrl: item.link,
        tags: config.tagGenerator(),
        isLiveSynced: true,
      };
    });
  } catch (err) {
    console.warn(`[WARN] Failed to fetch feed ${config.name}: ${err.message}. Failing open.`);
    return [];
  }
}

// メイン同期ルーチン
async function main() {
  console.log('==================================================');
  console.log('🚀 AI Park: Tech-to-Production Automated News Pipeline');
  console.log('==================================================');

  // 1. 静的マスター（src/data/ai-news.ts）の読み込み
  const baseNews = loadStaticMasterNews();
  console.log(`[INFO] Loaded ${baseNews.length} master news items from src/data/ai-news.ts`);

  // 2. 各社公式フィードから最新ニュースを自動巡回取得
  const liveItems = [];
  for (const config of FEED_CONFIGS) {
    const fetched = await fetchFeedSafe(config);
    liveItems.push(...fetched);
  }

  // 3. 重複排除とマージ（URL・タイトル・IDベース）
  const seenUrls = new Set();
  const seenTitles = new Set();
  const seenIds = new Set();
  const mergedItems = [];

  // ベース確定ニュース（詳細な日本語解説・要約付きマスタ）を優先
  for (const item of baseNews) {
    const cleanUrl = item.sourceUrl.split('?')[0].replace(/\/$/, '');
    if (!seenUrls.has(cleanUrl) && !seenTitles.has(item.title) && !seenIds.has(item.id)) {
      seenUrls.add(cleanUrl);
      seenTitles.add(item.title);
      seenIds.add(item.id);
      mergedItems.push(item);
    }
  }

  // フィードから取得した最新の未登録ニュースを追加
  for (const item of liveItems) {
    const cleanUrl = item.sourceUrl.split('?')[0].replace(/\/$/, '');
    if (!seenUrls.has(cleanUrl) && !seenTitles.has(item.title) && !seenIds.has(item.id)) {
      seenUrls.add(cleanUrl);
      seenTitles.add(item.title);
      seenIds.add(item.id);
      mergedItems.push(item);
    }
  }

  // 日付の降順でソート
  mergedItems.sort((a, b) => {
    const dateA = new Date(a.date.replace(/\//g, '-')).getTime() || 0;
    const dateB = new Date(b.date.replace(/\//g, '-')).getTime() || 0;
    return dateB - dateA;
  });

  const nowIso = new Date().toISOString();
  const payload = {
    lastSyncedAt: nowIso,
    lastSyncedAtFormatted: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    syncStatus: 'live',
    pipelineVersion: 'v1.2-auto',
    totalCount: mergedItems.length,
    activeSources: FEED_CONFIGS.map((c) => `${c.name} Official Feed`),
    items: mergedItems,
  };

  // 4. 出力先ディレクトリの確保と保存
  const outDir = path.dirname(TARGET_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(TARGET_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`[SUCCESS] Generated ${TARGET_FILE} with ${mergedItems.length} items.`);
  console.log(`[INFO] Last synced at: ${payload.lastSyncedAtFormatted}`);
}

main().catch((err) => {
  console.error('[FATAL ERROR] Automated News Pipeline failed:', err);
  process.exit(1);
});
