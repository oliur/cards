// Writes the default-settings skill to skills/cards/SKILL.md, the layout the `skills` CLI
// (npx skills add oliur/cards) installs from. `--check` fails instead if the file is stale.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

// The design-system modules use the app's `@/` alias and extensionless imports; map both for Node.
const src = new URL("../src/", import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    let url: URL | undefined;
    if (specifier.startsWith("@/")) url = new URL(specifier.slice(2), src);
    else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith("file:") && !/\.[cm]?[jt]sx?$/.test(specifier)) url = new URL(specifier, context.parentURL);
    if (url) {
      const file = [".ts", ".tsx", "/index.ts"].map((ext) => fileURLToPath(url) + ext).find(existsSync);
      if (file) return next(pathToFileURL(file).href, context);
    }
    return next(specifier, context);
  },
});

const { generateSkill } = await import("../src/design-system/skill.ts");
const { defaultConfig } = await import("../src/design-system/config.ts");

const dir = new URL("../skills/cards/", import.meta.url);
const out = new URL("SKILL.md", dir);
const content = generateSkill(defaultConfig);

if (process.argv.includes("--check")) {
  const current = existsSync(out) ? readFileSync(out, "utf8") : "";
  if (current !== content) {
    console.error("skills/cards/SKILL.md is out of date. Run `pnpm skill` and commit the result.");
    process.exit(1);
  }
} else {
  mkdirSync(dir, { recursive: true });
  writeFileSync(out, content);
  console.log("wrote skills/cards/SKILL.md");
}
