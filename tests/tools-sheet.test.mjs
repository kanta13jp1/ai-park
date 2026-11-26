import assert from "node:assert/strict";
import test from "node:test";
import { csvToTools, parseCsv } from "../src/lib/toolsSheet.ts";

test("parseCsv strips UTF-8 BOM and handles LF and CRLF line endings", () => {
  const lfCsv = "\uFEFFname,form,status\nTool Alpha,Web,利用可能\nTool Beta,CLI,検証中\n";
  assert.deepEqual(parseCsv(lfCsv), [
    ["name", "form", "status"],
    ["Tool Alpha", "Web", "利用可能"],
    ["Tool Beta", "CLI", "検証中"],
  ]);

  const crlfCsv = "\uFEFFname,form,status\r\nTool Alpha,Web,利用可能\r\nTool Beta,CLI,検証中\r\n";
  assert.deepEqual(parseCsv(crlfCsv), [
    ["name", "form", "status"],
    ["Tool Alpha", "Web", "利用可能"],
    ["Tool Beta", "CLI", "検証中"],
  ]);
});

test("parseCsv handles quoted commas, embedded newlines, escaped quotes, and blank rows", () => {
  const csv = [
    'name,description,note',
    '"Tool Alpha, Pro","Line 1\nLine 2","Said ""Ready"""',
    '"Tool Beta","Line A\r\nLine B","Quoted ""A, B"" item"',
    "   , \t ,  ",
    "",
    '""',
    '"Tool Gamma","Simple","Plain"',
  ].join("\r\n");

  assert.deepEqual(parseCsv(csv), [
    ["name", "description", "note"],
    ["Tool Alpha, Pro", "Line 1\nLine 2", 'Said "Ready"'],
    ["Tool Beta", "Line A\r\nLine B", 'Quoted "A, B" item'],
    ["Tool Gamma", "Simple", "Plain"],
  ]);
});

test("csvToTools returns empty array for empty or whitespace-only CSV", () => {
  assert.deepEqual(csvToTools(""), []);
  assert.deepEqual(csvToTools("\uFEFF"), []);
  assert.deepEqual(csvToTools("\uFEFF  \r\n , \t \n"), []);
});

test("csvToTools trims headers, maps columns, filters empty names, and applies fallbacks", () => {
  const csv = [
    "\uFEFF  name , id , initial , initialBg , status , applyRequired , coverageRatio , dev_score , doc_score , research_score , auto_score , form , description , securityLevel , impactScore , easeScore ",
    "  , 99 , X , bg-blue-600 , 利用可能 , TRUE , 0.5 , 3 , 2 , 1 , 0 , Web , Ignored , Low , 8 , 7 ",
    " tool alpha , , , , 全社員利用可能 , TRUE , 1.5 , 5 , 3 , 2 , 1 , Web , Alpha desc , High , 9 , 8 ",
    " Tool Beta , 42 , TB , bg-emerald-600 text-white , 社内セキュア網 , true , -0.25 , 0 , -4 , , 2.7 , CLI , Beta desc , Medium , , ",
    " Tool Gamma , not-a-number , , , 検証中 , false , 0.75 , 1.2 , abc , 3 , 99 , IDE , Gamma desc , Standard , 6 , 4 ",
    " Tool Delta , 7 , , , 未定ステータス , , invalid , , 0 , 1 , 2 , API , Delta desc , Low , 5 , 5 ",
  ].join("\r\n");

  const tools = csvToTools(csv);
  assert.equal(tools.length, 4);

  const [alpha, beta, gamma, delta] = tools;

  assert.equal(alpha.id, 1);
  assert.equal(alpha.name, "tool alpha");
  assert.equal(alpha.initial, "T");
  assert.equal(alpha.initialBg, "bg-slate-600 text-white");
  assert.equal(alpha.status, "全社員利用可能");
  assert.equal(alpha.applyRequired, true);
  assert.equal(alpha.coverageRatio, 1);
  assert.deepEqual(
    [alpha.dev.score, alpha.doc.score, alpha.research.score, alpha.auto.score],
    [3, 3, 2, 1]
  );

  assert.equal(beta.id, 42);
  assert.equal(beta.initial, "TB");
  assert.equal(beta.initialBg, "bg-emerald-600 text-white");
  assert.equal(beta.status, "社内セキュア網");
  assert.equal(beta.applyRequired, true);
  assert.equal(beta.coverageRatio, 0);
  assert.deepEqual(
    [beta.dev.score, beta.doc.score, beta.research.score, beta.auto.score],
    [0, 0, 0, 2]
  );
  assert.equal(beta.impactScore, 5);
  assert.equal(beta.easeScore, 5);

  assert.equal(gamma.id, 3);
  assert.equal(gamma.initial, "T");
  assert.equal(gamma.status, "検証中");
  assert.equal(gamma.applyRequired, undefined);
  assert.equal(gamma.coverageRatio, 0.75);
  assert.deepEqual(
    [gamma.dev.score, gamma.doc.score, gamma.research.score, gamma.auto.score],
    [1, 0, 3, 3]
  );

  assert.equal(delta.id, 7);
  assert.equal(delta.status, "リストアップ");
  assert.equal(delta.applyRequired, undefined);
  assert.equal(delta.coverageRatio, 0);
  assert.deepEqual(
    [delta.dev.score, delta.doc.score, delta.research.score, delta.auto.score],
    [0, 0, 1, 2]
  );
});

test("csvToTools preserves all valid status values and optional fields", () => {
  const csv = [
    "name,status,manualUrl,statusNote,licenseCount,coverage,dev_note,doc_note,research_note,auto_note",
    "Tool One,利用可能,https://example.com/manual,Ready,10,Full,Dev ok,Doc ok,Res ok,Auto ok",
    "Tool Two,リストアップ,,,,,,,,",
  ].join("\n");

  const [one, two] = csvToTools(csv);
  assert.equal(one.status, "利用可能");
  assert.equal(one.manualUrl, "https://example.com/manual");
  assert.equal(one.statusNote, "Ready");
  assert.equal(one.licenseCount, "10");
  assert.equal(one.coverage, "Full");
  assert.equal(one.dev.note, "Dev ok");
  assert.equal(one.doc.note, "Doc ok");
  assert.equal(one.research.note, "Res ok");
  assert.equal(one.auto.note, "Auto ok");

  assert.equal(two.status, "リストアップ");
  assert.equal(two.manualUrl, undefined);
  assert.equal(two.statusNote, undefined);
  assert.equal(two.licenseCount, undefined);
});
