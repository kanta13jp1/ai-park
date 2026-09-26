// レッスン本文（src/data/academy.ts）から動画の台本 JSON を自動生成する。
// 使い方: npx tsc src/data/academy.ts --outDir <tmp> --module es2022 --target es2022
//         node scripts/academy-video/generate_specs.mjs <tmp>/academy.js
// 出力:   scripts/academy-video/specs/<course>-<lesson>.json（手書きの台本がある install は除く）

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { courses } = await import(pathToFileURL(path.resolve(process.argv[2])).href);
const outDir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "specs");
fs.mkdirSync(outDir, { recursive: true });

const HANDWRITTEN = new Set(["antigravity-101-install"]);
const TTS = { provider: "gemini", model: "gemini-3.8-flash-tts", voice: "Kore", style: "落ち着いた、分かりやすい研修講師の話し方" };

const sentence = (t) => (/[。！？]$/.test(t) ? t : `${t}。`);
const clip = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

// 読み上げ専用の置き換え（字幕は正しい表記のまま）
const forSpeech = (t) =>
  t
    .replace(/\bagy\b/g, "エー・ジー・ワイ")
    .replace(/git add \. && git commit -m "\.\.\."/g, "git add と git commit")
    .replace(/ -c feature\/xxx/g, "")
    .replace(/ <file>/g, "")
    .replace(/git status \/ git diff/g, "git status と git diff")
    .replace(/Level (\d)/g, "レベル$1")
    // 検証で誤読が見つかった箇所（Gemini による文字起こしで確認）
    .replace(/経由の Antigravity/g, "経由のアンチグラビティ")
    .replace(/「社内AI利用の注意事項」を確認してください/g, "社内AI利用の注意事項のページで確認してください");

for (const course of courses) {
  course.lessons.forEach((lesson) => {
    const id = `${course.id}-${lesson.id}`;
    if (HANDWRITTEN.has(id)) return;
    // 表紙：タイトル＋概要文
    const slides = [{ title: lesson.title, lead: lesson.summary, say: lesson.summary }];
    let cur = null;
    const push = () => {
      if (cur && (cur.say || cur.image)) slides.push(cur);
      cur = null;
    };
    const ensure = () => (cur ??= { title: lesson.title, bullets: [], say: "" });
    let codeMentioned = false;
    for (const b of lesson.blocks) {
      if (b.type === "h") {
        push();
        cur = { title: b.text, bullets: [], say: "" };
      } else if (b.type === "p") ensure().say += sentence(b.text);
      else if (b.type === "steps") {
        // 手順は1項目ずつスライドを分け、読んでいる項目を強調表示する
        // 直前の説明文は、画像があれば画像のスライドに残し、無ければ最初の手順のスライドで読む
        const title = ensure().title;
        let lead = "";
        if (cur.image) push();
        else {
          lead = cur.say;
          cur = null;
        }
        b.items.forEach((item, i) => {
          slides.push({ title, bullets: b.items.map((t) => clip(t, 34)), highlight: i, say: (i === 0 ? lead : "") + sentence(item) });
        });
        cur = { title, bullets: [], say: "" };
      } else if (b.type === "tip") ensure().say += `ポイントです。${sentence(b.text)}`;
      else if (b.type === "warn") ensure().say += `注意してください。${sentence(b.text)}`;
      else if (b.type === "code" && !codeMentioned) {
        ensure().say += "コマンドは、レッスンのページからコピーできます。";
        codeMentioned = true;
      } else if (b.type === "image") {
        if (cur?.image) push();
        ensure().image = b.file;
      }
    }
    push();
    for (const s of slides) {
      if (!s.say) s.say = "画面では、このように表示されます。";
      if (!s.image && !s.lead && !s.bullets?.length) s.lead = s.say;
      if (s.bullets && !s.bullets.length) delete s.bullets;
      if (s.bullets) s.bullets = s.bullets.slice(0, 6);
      if (s.image) delete s.bullets;
      const spoken = forSpeech(s.say);
      if (spoken !== s.say) s.speak = spoken;
    }
    const spec = { id, course: course.title.split("：")[0], tts: TTS, slides };
    fs.writeFileSync(path.join(outDir, `${id}.json`), JSON.stringify(spec, null, 2) + "\n");
    console.log(`${id}: ${slides.length} slides`);
  });
}
