// Fails on Tailwind default palette colors (gray-500, blue-600 …).
// The theme resets the palette, so these silently render as currentColor — and
// the system only allows semantic tokens (bg-surface, text-fg-*, ring-line-*, black/white …).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const utilities = "bg|text|border|border-[trblxyse]|ring|ring-offset|outline|divide|fill|stroke|from|via|to|decoration|shadow|accent|caret|placeholder";
// black and white are allowed: the theme defines them as static tokens.
const palette = "slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const re = new RegExp(`(?<![\\w-])(?:[\\w-]+:)*(?:${utilities})-(?:${palette})(?:-\\d{2,3})?(?:/[\\w.\\[\\]]+)?(?![\\w-])`, "g");

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.tsx?$/.test(name) && !/(guidelines|prompt)\.ts$/.test(path)) files.push(path);
  }
};
walk(fileURLToPath(new URL("../src/components", import.meta.url)));

const problems = [];
for (const file of files) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    for (const m of line.matchAll(re)) problems.push(`${file}:${i + 1}  ${m[0]}`);
  });
}
if (problems.length) {
  console.error(`Raw palette colors (use semantic tokens or black/white):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`tokens: ${files.length} files clean`);
