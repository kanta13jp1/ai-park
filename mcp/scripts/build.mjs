import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mcpDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(mcpDir, "..");

const BANNER_JS =
  "import { createRequire as __aiParkCreateRequire } from 'node:module';" +
  "const require = globalThis.require ?? __aiParkCreateRequire(import.meta.url);";

async function main() {
  // 1. Refresh portal SSOT snapshot
  execFileSync(process.execPath, [path.join(__dirname, "generate-snapshot.mjs")], {
    cwd: mcpDir,
    stdio: "inherit",
  });

  // 2. Bundle single-file MCP App UI HTML
  const uiOut = await esbuild.build({
    entryPoints: ["ui/app.ts"],
    absWorkingDir: mcpDir,
    bundle: true,
    minify: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: "es2022",
    sourcemap: false,
    logLevel: "warning",
  });

  const uiJs = uiOut.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
  const uiCss = fs
    .readFileSync(path.join(mcpDir, "ui", "styles.css"), "utf8")
    .replace(/<\/style/gi, "<\\/style");

  const html = [
    "<!doctype html>",
    '<html lang="ja">',
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    "  <title>MightyLINK AI Park コンソール</title>",
    `  <style>${uiCss}</style>`,
    "</head>",
    "<body>",
    '  <div id="app"></div>',
    `  <script>${uiJs}</script>`,
    "</body>",
    "</html>",
    "",
  ].join("\n");

  const distDir = path.join(mcpDir, "dist");
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, "app.html"), html, "utf8");

  const generatedDir = path.join(mcpDir, "src", "generated");
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(
    path.join(generatedDir, "app-html.ts"),
    `export const APP_HTML = ${JSON.stringify(html)};\n`,
    "utf8"
  );

  // 3. Bundle Stdio server to mcp/dist/stdio.mjs and .agents/plugins/ai-park-mcp/bin/server.mjs
  const pluginBinDir = path.join(repoRoot, ".agents", "plugins", "ai-park-mcp", "bin");
  fs.mkdirSync(pluginBinDir, { recursive: true });

  const stdioOutputs = [
    path.join(distDir, "stdio.mjs"),
    path.join(pluginBinDir, "server.mjs"),
  ];
  for (const outfile of stdioOutputs) {
    await esbuild.build({
      entryPoints: ["src/stdio.ts"],
      absWorkingDir: mcpDir,
      bundle: true,
      minify: false,
      platform: "node",
      target: "node22",
      format: "esm",
      sourcemap: false,
      banner: { js: BANNER_JS },
      outfile,
      logLevel: "warning",
    });
  }

  // 4. Bundle Streamable HTTP server if src/http.ts exists
  const httpEntry = path.join(mcpDir, "src", "http.ts");
  if (fs.existsSync(httpEntry)) {
    await esbuild.build({
      entryPoints: ["src/http.ts"],
      absWorkingDir: mcpDir,
      bundle: true,
      minify: false,
      platform: "node",
      target: "node22",
      format: "esm",
      sourcemap: false,
      banner: { js: BANNER_JS },
      outfile: path.join(distDir, "http.mjs"),
      logLevel: "warning",
    });
  }

  // 5. Bundle Cloudflare Worker adapter if worker/index.ts exists
  const workerEntry = path.join(mcpDir, "worker", "index.ts");
  if (fs.existsSync(workerEntry)) {
    await esbuild.build({
      entryPoints: ["worker/index.ts"],
      absWorkingDir: mcpDir,
      bundle: true,
      minify: false,
      platform: "browser",
      conditions: ["worker", "browser"],
      format: "esm",
      target: "es2022",
      sourcemap: false,
      outfile: path.join(distDir, "worker.mjs"),
      logLevel: "warning",
    });
  }

  console.error("[mcp build] generated app.html, stdio.mjs, http.mjs, worker.mjs, and plugin bin/server.mjs");
}

main().catch((err) => {
  console.error("[mcp build] failed:", err);
  process.exit(1);
});
