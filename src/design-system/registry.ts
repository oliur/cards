import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type ThemeConfig, fontStylesheets } from "./config";
import { tailwindTheme } from "./theme";
import { primaryRamp, semanticTokens, staticTokens } from "./tokens";

/** Component files shipped by the registry. The color picker is studio-only, so it stays out. */
const uiFiles = [
  "accordion", "alert", "avatar", "badge", "brand-icons", "button", "card", "checkbox", "dialog", "image-placeholder",
  "input", "label", "misc", "radio", "radio-group", "select", "separator", "slider", "switch", "tabs", "textarea", "tile-group", "tooltip",
];
const libFiles = ["utils", "gradients"];
const dependencies = ["class-variance-authority", "clsx", "lucide-react", "radix-ui", "tailwind-merge"];

type CssTree = { [selector: string]: string | CssTree };

/** Parses the small, well-formed subset of CSS in theme.ts into the nested object the registry format expects. */
function parseCss(source: string): CssTree {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  const parseBlock = (): CssTree => {
    const tree: CssTree = {};
    let buffer = "";
    while (i < text.length) {
      const char = text[i++];
      if (char === "{") {
        const selector = buffer.trim().replace(/\s+/g, " ");
        tree[selector] = parseBlock();
        buffer = "";
      } else if (char === "}") {
        return tree;
      } else if (char === ";") {
        const colon = buffer.indexOf(":");
        if (colon > 0) tree[buffer.slice(0, colon).trim()] = buffer.slice(colon + 1).trim();
        buffer = "";
      } else {
        buffer += char;
      }
    }
    return tree;
  };
  return parseBlock();
}

export function registryItem(config: ThemeConfig, files: { path: string; type: string; content: string }[]) {
  // shadcn projects already declare the dark variant.
  const { "@theme inline": themeBlock, ...rules } = parseCss(tailwindTheme.replace(/@custom-variant[^;]*;/, ""));
  // Wildcard resets are dropped: an existing project keeps its Tailwind palette and only gains tokens.
  const theme = Object.fromEntries(
    Object.entries(themeBlock as Record<string, string>)
      .filter(([key]) => !key.includes("*") && key !== "--color-transparent" && key !== "--color-current")
      .map(([key, value]) => [key.replace(/^--/, ""), value]),
  );
  // A CSS @import can't follow Tailwind's, so fonts are loaded with links in the document head.
  const fontLinks = fontStylesheets(config).map((href) => `<link rel="stylesheet" href="${href}" />`).join("\n");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "cards",
    // Only theme items may overwrite the color variables shadcn init created.
    type: "registry:theme",
    title: "Cards",
    description: "The Cards design system: tokens, type, elevation and components for a shadcn/ui project.",
    dependencies,
    cssVars: {
      theme,
      light: { ...staticTokens(config), ...semanticTokens(config, "light") },
      dark: { ...primaryRamp(config.primaryDark), ...semanticTokens(config, "dark") },
    },
    css: rules,
    docs: `Cards is installed. Add these font links to your document head:\n\n${fontLinks}\n`,
    files,
  };
}

/** Source files only change on deploy, so read them once per server process. */
let filesPromise: ReturnType<typeof readRegistryFiles> | undefined;
export function registryFiles() {
  filesPromise ??= readRegistryFiles().catch((error) => {
    filesPromise = undefined;
    throw error;
  });
  return filesPromise;
}

async function readRegistryFiles() {
  const read = (path: string) => readFile(join(process.cwd(), "src", path), "utf8");
  return Promise.all([
    ...uiFiles.map(async (name) => ({ path: `ui/${name}.tsx`, type: "registry:ui", content: await read(`components/ui/${name}.tsx`) })),
    ...libFiles.map(async (name) => ({ path: `lib/${name}.ts`, type: "registry:lib", content: await read(`lib/${name}.ts`) })),
  ]);
}
