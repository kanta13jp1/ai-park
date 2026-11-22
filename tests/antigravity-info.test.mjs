import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

function assertAllButtonsHaveTypeButton(source, fileLabel) {
  const buttonMatches = [...source.matchAll(/<button\b/g)];
  assert.ok(buttonMatches.length > 0, `${fileLabel} should contain buttons`);
  for (let i = 0; i < buttonMatches.length; i++) {
    const start = buttonMatches[i].index;
    const nextStart = i + 1 < buttonMatches.length ? buttonMatches[i + 1].index : source.length;
    const chunk = source.slice(start, Math.min(nextStart, start + 350));
    assert.match(
      chunk,
      /\btype="button"/,
      `${fileLabel}: button at index ${start} is missing type="button"`
    );
  }
}

function assertUniqueNonEmptyIds(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    const val = item[key];
    assert.ok(typeof val === "string" && val.trim().length > 0, `${label}: empty ${key}`);
    assert.ok(!seen.has(val), `${label}: duplicate ${key} "${val}"`);
    seen.add(val);
  }
}

test("antigravity-info data arrays satisfy minimum counts, unique IDs, and schema constraints", async () => {
  const dataPath = path.join(rootDir, "src", "data", "antigravity-info.ts");
  const mod = await import(pathToFileURL(dataPath).href);

  assert.ok(Array.isArray(mod.antigravitySurfaces) && mod.antigravitySurfaces.length >= 4);
  assert.ok(Array.isArray(mod.antigravityFeatures) && mod.antigravityFeatures.length >= 13);
  assert.ok(Array.isArray(mod.modalityComparison) && mod.modalityComparison.length >= 6);
  assert.ok(Array.isArray(mod.practicalExamples) && mod.practicalExamples.length >= 11);
  assert.ok(Array.isArray(mod.antigravityShortcuts) && mod.antigravityShortcuts.length >= 12);
  assert.ok(Array.isArray(mod.antigravityConfigTemplates) && mod.antigravityConfigTemplates.length >= 4);
  assert.ok(Array.isArray(mod.antigravityFaqs) && mod.antigravityFaqs.length >= 11);
  assert.ok(Array.isArray(mod.swarmWorkspaceModes) && mod.swarmWorkspaceModes.length === 3);
  assert.ok(Array.isArray(mod.swarmRolePatterns) && mod.swarmRolePatterns.length >= 4);
  assert.ok(Array.isArray(mod.swarmLifecycleSteps) && mod.swarmLifecycleSteps.length >= 4);
  assert.ok(Array.isArray(mod.workflowAdvisorScenarios) && mod.workflowAdvisorScenarios.length >= 6);
  assert.ok(Array.isArray(mod.officialDocLinks) && mod.officialDocLinks.length >= 8);

  assertUniqueNonEmptyIds(mod.antigravitySurfaces, "id", "antigravitySurfaces");
  assertUniqueNonEmptyIds(mod.antigravityFeatures, "id", "antigravityFeatures");
  assertUniqueNonEmptyIds(mod.modalityComparison, "modality", "modalityComparison");
  assertUniqueNonEmptyIds(mod.practicalExamples, "id", "practicalExamples");
  assertUniqueNonEmptyIds(mod.antigravityConfigTemplates, "id", "antigravityConfigTemplates");
  assertUniqueNonEmptyIds(mod.antigravityFaqs, "id", "antigravityFaqs");
  assertUniqueNonEmptyIds(mod.swarmWorkspaceModes, "mode", "swarmWorkspaceModes");
  assertUniqueNonEmptyIds(mod.swarmRolePatterns, "role", "swarmRolePatterns");
  assertUniqueNonEmptyIds(mod.swarmLifecycleSteps, "step", "swarmLifecycleSteps");
  assertUniqueNonEmptyIds(mod.workflowAdvisorScenarios, "id", "workflowAdvisorScenarios");
  assertUniqueNonEmptyIds(mod.officialDocLinks, "href", "officialDocLinks");

  const validWorkspaces = new Set(["inherit", "share", "branch"]);
  let hasShareScenario = false;
  for (const s of mod.workflowAdvisorScenarios) {
    assert.ok(s.label && s.taskType && s.recommendedSurface && s.recommendedMode && s.reason && s.starterPrompt);
    if (s.recommendedWorkspace !== undefined) {
      assert.ok(validWorkspaces.has(s.recommendedWorkspace), `Invalid recommendedWorkspace in ${s.id}`);
      if (s.recommendedWorkspace === "share") hasShareScenario = true;
    }
  }
  assert.ok(hasShareScenario, "workflowAdvisorScenarios should include at least one share scenario");
});

test("antigravity-info external doc URLs use official https hosts and data contains no PII", async () => {
  const dataPath = path.join(rootDir, "src", "data", "antigravity-info.ts");
  const raw = fs.readFileSync(dataPath, "utf8");
  const mod = await import(pathToFileURL(dataPath).href);

  const allowedHosts = new Set(["antigravity.google", "github.com"]);
  const urls = [
    ...mod.officialDocLinks.map((l) => l.href),
    ...mod.antigravitySurfaces.map((s) => s.docUrl),
    ...mod.antigravityFeatures.map((f) => f.docUrl),
  ];

  for (const url of urls) {
    assert.ok(typeof url === "string" && !/\s/.test(url), `URL contains whitespace: "${url}"`);
    const parsed = new URL(url);
    assert.equal(parsed.protocol, "https:", `Non-HTTPS URL: ${url}`);
    assert.ok(allowedHosts.has(parsed.hostname), `Unexpected doc host in ${url}`);
  }

  assert.equal(/@ml-mightylink\.com/i.test(raw), false, "Employee email domain must not appear");
  assert.equal(/\b0\d{1,3}-\d{2,4}-\d{4}\b/.test(raw), false, "Raw phone number must not appear");
});

test("antigravity-info page and components enforce WAI-ARIA APG, safe inline code, and button hygiene", () => {
  const pageSrc = fs.readFileSync(path.join(rootDir, "src", "app", "antigravity-info", "page.tsx"), "utf8");
  const swarmSrc = fs.readFileSync(
    path.join(rootDir, "src", "components", "antigravity", "AgentSwarmsSection.tsx"),
    "utf8"
  );
  const advisorSrc = fs.readFileSync(
    path.join(rootDir, "src", "components", "antigravity", "WorkflowModeAdvisor.tsx"),
    "utf8"
  );
  const inlineCodeSrc = fs.readFileSync(
    path.join(rootDir, "src", "components", "antigravity", "InlineCodeText.tsx"),
    "utf8"
  );

  assertAllButtonsHaveTypeButton(pageSrc, "src/app/antigravity-info/page.tsx");
  assertAllButtonsHaveTypeButton(swarmSrc, "src/components/antigravity/AgentSwarmsSection.tsx");
  assertAllButtonsHaveTypeButton(advisorSrc, "src/components/antigravity/WorkflowModeAdvisor.tsx");

  for (const token of [
    'role="tablist"',
    'role="tab"',
    "aria-selected",
    "aria-controls",
    'role="tabpanel"',
    "aria-labelledby",
    "aria-pressed",
    "aria-expanded",
    'aria-live="polite"',
    "ArrowRight",
    "ArrowLeft",
    "Home",
    "End",
    "min-w-[640px]",
    "whitespace-nowrap",
    "UnderConstructionAlert",
  ]) {
    assert.ok(pageSrc.includes(token), `antigravity-info/page.tsx missing required token: ${token}`);
  }

  for (const token of ["aria-pressed", 'role="group"', 'aria-live="polite"', ".catch("]) {
    assert.ok(advisorSrc.includes(token), `WorkflowModeAdvisor.tsx missing required token: ${token}`);
  }

  assert.equal(/dangerouslySetInnerHTML\s*=/.test(inlineCodeSrc), false, "InlineCodeText must not use dangerouslySetInnerHTML");
});

test("antigravity-info layout exports Next.js metadata via getRouteMetadata SSOT", () => {
  const layoutSrc = fs.readFileSync(
    path.join(rootDir, "src", "app", "antigravity-info", "layout.tsx"),
    "utf8"
  );
  assert.match(layoutSrc, /export const metadata:\s*Metadata\s*=\s*getRouteMetadata\("\/antigravity-info"\)/);
});
