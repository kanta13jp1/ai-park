import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mcpDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(mcpDir, "..");

async function loadTsModule(relPath) {
  const fullPath = path.join(repoRoot, relPath);
  const result = await esbuild.build({
    entryPoints: [fullPath],
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
    target: "es2022",
    external: ["next"],
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(code, "utf8").toString("base64")}`;
  return import(dataUrl);
}

function readJson(relPath) {
  const fullPath = path.join(repoRoot, relPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, ""));
}

async function main() {
  const [
    routeMetaMod,
    navMod,
    featureMod,
    preflightMod,
    tsMod,
    skillsMod,
    mcpHubMod,
  ] = await Promise.all([
    loadTsModule("src/data/route-metadata.ts"),
    loadTsModule("src/data/navigation.ts"),
    loadTsModule("src/data/feature-status.ts"),
    loadTsModule("src/data/preflight-checklist.ts"),
    loadTsModule("src/data/troubleshooting-commands.ts"),
    loadTsModule("src/data/skills-hub.ts"),
    loadTsModule("src/data/mcp-hub.ts"),
  ]);

  const aiNewsLive = readJson("public/data/ai-news-live.json");
  const gcpUsageLive = readJson("public/data/gcp-usage-live.json");

  const preflightSummary = (preflightMod.preflightChecklistMaster ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    path: item.path,
    targetAudience: item.targetAudience,
    lastVerifiedAt: item.lastVerifiedAt,
    verifiedBy: item.verifiedBy,
    overallStatus: item.overallStatus,
    environment: item.environment,
    memo: item.memo,
    checks: {
      factAndSpec: {
        passed: Boolean(item.checks?.factAndSpec?.passed),
        evidence: item.checks?.factAndSpec?.evidence ?? "",
      },
      designAndLayout: {
        passed: Boolean(item.checks?.designAndLayout?.passed),
        evidence: item.checks?.designAndLayout?.evidence ?? "",
      },
      usability: {
        passed: Boolean(item.checks?.usability?.passed),
        evidence: item.checks?.usability?.evidence ?? "",
      },
      readability: {
        passed: Boolean(item.checks?.readability?.passed),
        evidence: item.checks?.readability?.evidence ?? "",
      },
    },
  }));

  const snapshot = {
    generatedFrom: "kanta13jp1/ai-park SSOT",
    siteBaseUrl: "https://kanta13jp1.github.io/ai-park",
    githubRepo: "kanta13jp1/ai-park",
    routeMetadata: routeMetaMod.ROUTE_METADATA ?? {},
    navigationSections: navMod.navigationSections ?? [],
    featureStatusMaster: featureMod.featureStatusMaster ?? [],
    preflightChecklistSummary: preflightSummary,
    troubleshootingCommands: tsMod.troubleshootingCommands ?? [],
    workspaceSkills: skillsMod.WORKSPACE_SKILLS ?? [],
    mcpGuide: {
      configLocations: mcpHubMod.MCP_CONFIG_LOCATIONS ?? [],
      configTemplates: (mcpHubMod.MCP_CONFIG_TEMPLATES ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        serverKey: t.serverKey,
        transport: t.transport,
        packageOrEndpoint: t.packageOrEndpoint,
        summary: t.summary,
        docUrl: t.docUrl,
      })),
      safetyChecklist: mcpHubMod.MCP_SAFETY_CHECKLIST ?? [],
      officialLinks: mcpHubMod.MCP_OFFICIAL_LINKS ?? [],
    },
    aiNewsFallback: {
      lastSyncedAt: aiNewsLive.lastSyncedAt ?? "",
      lastSyncedAtFormatted: aiNewsLive.lastSyncedAtFormatted ?? "",
      syncStatus: aiNewsLive.syncStatus ?? "snapshot",
      totalCount: aiNewsLive.totalCount ?? (aiNewsLive.items?.length ?? 0),
      activeSources: aiNewsLive.activeSources ?? [],
      items: aiNewsLive.items ?? [],
    },
    gcpUsageFallback: gcpUsageLive,
  };

  const outDir = path.join(mcpDir, "src", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "portal-snapshot.json");
  fs.writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  console.error(
    `[generate-snapshot] wrote ${path.relative(repoRoot, outPath)} (${
      Object.keys(snapshot.routeMetadata).length
    } routes, ${snapshot.featureStatusMaster.length} features, ${
      snapshot.aiNewsFallback.items.length
    } news items)`
  );
}

main().catch((err) => {
  console.error("[generate-snapshot] failed:", err);
  process.exit(1);
});
