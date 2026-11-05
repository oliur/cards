// Enforces the 4pt grid: fails on half-step spacing classes (p-1.5, gap-2.5 …)
// and arbitrary pixel spacing that isn't a multiple of 4 (px-[14px]).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const props = "p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|size|w|h|min-w|min-h|max-w|max-h|top|right|bottom|left|inset|inset-x|inset-y|translate-x|translate-y|scroll-m|scroll-mt|scroll-p";
const half = new RegExp(`(?<![\\w-])-?(?:${props})-\\d+\\.5(?![\\w.])`, "g");
const arbitrary = new RegExp(`(?<![\\w-])-?(?:${props})-\\[(\\d+(?:\\.\\d+)?)px\\]`, "g");
// 1–2px hairlines (borders, underlines) are allowed
const allowed = new Set(["h-0.5", "w-0.5"]);

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|css)$/.test(name) && !path.endsWith("guidelines.ts") && !path.endsWith("prompt.ts")) files.push(path);
  }
};
walk(fileURLToPath(new URL("../src", import.meta.url)));

const problems = [];
for (const file of files) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    for (const m of line.matchAll(half)) if (!allowed.has(m[0].replace(/^-/, ""))) problems.push(`${file}:${i + 1}  ${m[0]}`);
    for (const m of line.matchAll(arbitrary)) if (Number(m[1]) % 4 !== 0) problems.push(`${file}:${i + 1}  ${m[0]}`);
  });
}

if (problems.length) {
  console.error(`Off-grid spacing (use multiples of 4px):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`4pt grid: ${files.length} files clean`);
