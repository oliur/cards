import { gradientGroups } from "@/lib/gradients";
import { densities, fontStylesheets, radiusStopNumber, radiusStops, resolveHeadingWeight, textScale, type ThemeConfig } from "./config";
import { aesthetic, colorRules, doAndDont, principles, recipes, systemName } from "./guidelines";
import { tailwindTheme } from "./theme";
import { generateThemeCss, primaryFor, radiusScale, shadowLevels, shadowValue } from "./tokens";

export const typeScale = [
  { token: "heading-1", size: 56, line: 64, use: "Marketing hero only" },
  { token: "heading-2", size: 48, line: 56, use: "Marketing section titles" },
  { token: "heading-3", size: 40, line: 48, use: "Large page heroes" },
  { token: "heading-4", size: 32, line: 40, use: "Page titles in marketing / onboarding" },
  { token: "heading-5", size: 24, line: 32, use: "App page titles, empty states" },
  { token: "heading-6", size: 20, line: 28, use: "Section titles inside apps" },
  { token: "ui-xl", size: 24, line: 32, use: "Large numbers / stats" },
  { token: "ui-lg", size: 18, line: 24, use: "Prominent labels, card stats" },
  { token: "ui-md", size: 16, line: 24, use: "Card, dialog and list-item titles" },
  { token: "ui-sm", size: 14, line: 20, use: "Buttons, form labels, nav items (default UI label)" },
  { token: "ui-xs", size: 12, line: 16, use: "Small labels, table headers" },
  { token: "body-lg", size: 18, line: 24, use: "Lead paragraphs" },
  { token: "body-md", size: 16, line: 24, use: "Long-form body" },
  { token: "body-sm", size: 14, line: 20, use: "Default UI body, descriptions, input text" },
  { token: "body-xs", size: 12, line: 16, use: "Hints, captions, meta" },
  { token: "overline-xs", size: 12, line: 16, use: "Eyebrows / group labels" },
  { token: "overline-2xs", size: 11, line: 12, use: "Small badges, tiny eyebrows" },
];

export function generatePrompt(config: ThemeConfig) {
  const r = radiusScale(config.radius);
  const weight = resolveHeadingWeight(config);
  const density = densities.find((d) => d.id === config.density)!;
  const unit = density.unit;
  const scale = textScale(config.density);
  const fontsLine =
    config.fontDisplay === config.fontSans
      ? `${config.fontSans} for all UI text and headings, ${config.fontMono} for code/numbers.`
      : `${config.fontSans} for UI text, ${config.fontDisplay} for headings (text-heading-*), ${config.fontMono} for code/numbers.`;

  return `# ${systemName} — design system instructions

You are building user interfaces with the ${systemName} design system. Apply every rule below to all UI you create or edit in this project. When something isn't covered, extrapolate from these principles rather than falling back to generic defaults.

## Aesthetic
${aesthetic}

## Stack & conventions
- React + Tailwind CSS v4. Components follow **shadcn/ui** conventions: Radix UI primitives (\`radix-ui\`), variants with \`class-variance-authority\`, a \`cn()\` helper (clsx + tailwind-merge), \`data-slot\` attributes, \`asChild\` via Radix Slot. Colors and type come only from ${systemName}'s semantic tokens (defined below).
- Icons: Lucide (\`lucide-react\`), the shadcn/ui default. Outline by default, size-5 (20px). Lucide has no brand logos, so use inline SVGs from Simple Icons for those.
- Fonts: ${fontsLine} Headings use weight ${weight}.
- Load fonts in the document head:
${fontStylesheets(config).map((href) => `  \`<link rel="stylesheet" href="${href}">\``).join("\n")}
- Default mode: ${config.mode}. Dark mode is class-based (\`.dark\` on <html>) and handled entirely by tokens — never write \`dark:\` color overrides for semantic tokens.
- Configure tailwind-merge so \`text-heading-*\`, \`text-ui-*\`, \`text-body-*\` and \`text-overline-*\` are treated as font sizes (so they don't conflict with text colors like \`text-fg-muted\`):
\`\`\`ts
const twMerge = extendTailwindMerge({ extend: { classGroups: { "font-size": [{ text: [/* every heading-*, ui-*, body-*, overline-* name */] }], shadow: [{ shadow: ["focus", "focus-primary", "focus-danger", "field", "control", "button", "primary", "inverse", "danger", "badge", "menu"] }] } } });
\`\`\`

## Principles
${principles.map((p, i) => `${i + 1}. **${p.title}.** ${p.body}`).join("\n")}

## Color usage
${colorRules.map((c) => `- ${c}`).join("\n")}

Primary color: \`${primaryFor(config, "light")}\` in light mode, \`${primaryFor(config, "dark")}\` in dark mode. Neutral ramp: ${config.neutral}.

## Image placeholders
Wherever an image would go (thumbnails, covers, album art, app icons), and no real image exists, use one of these top-to-bottom sky gradients. Never use stock photos, generated art or grey boxes. They stay the same in light and dark mode. Write them as \`linear-gradient(to bottom in oklab, top, bottom)\`.
${gradientGroups.map((group) => `- ${group.title}: ${group.gradients.map((g) => `${g.name} ${g.top} → ${g.bottom}`).join("; ")}`).join("\n")}

## Typography
Type scales with density (${density.label.toLowerCase()}: ×${scale}); sizes below are already scaled and line-heights snap to the 4px grid. Use only these styles (Tailwind class \`text-{token}\`). Each sets size, line-height, letter-spacing and weight. Headings automatically use the display font.

| Token | Size / line | Use for |
|---|---|---|
${typeScale.map((t) => `| text-${t.token} | ${Math.round(t.size * scale)}/${Math.round((t.line * scale) / 4) * 4} | ${t.use} |`).join("\n")}

## Radius scale (stop ${radiusStopNumber(config.radius)} of ${radiusStops.length}, base ${config.radius}px)
rounded-xs ${r.xs} · rounded-sm ${r.sm} · rounded-md ${r.md} · rounded-lg ${r.lg} · rounded-xl ${r.xl} · rounded-2xl ${r["2xl"]} · rounded-3xl ${r["3xl"]} · rounded-full
- Buttons: always \`rounded-button\` (medium) / \`rounded-button-sm\` (small and below) — currently ${config.buttonShape === "pill" ? "fully rounded pills (icon-only buttons are circles)" : `${r.lg} / ${r.md}, matching the scale`}. Never hard-code a button radius.
- Inputs and selects: rounded-lg; compact: rounded-md.
- Concentric corners: a container that holds tightly-nested rounded children uses \`rounded-parent-{size}\`; each child uses \`rounded-concentric-{n}\` (n = the container's padding step), giving inner radius = outer radius − padding. The two utilities are defined in the stylesheet below. Checkbox / kbd: rounded-xs. Badges: always rounded-full.
- Alerts, menu items' containers: rounded-xl. Cards and popovers: rounded-2xl. Dialogs and sheets: rounded-3xl.

## Layout
Card-based: the page is \`bg-canvas\` (very light grey) and every block of content is a white card (\`bg-surface\`). Page titles and section headings sit on the canvas; everything else goes in cards.

## Spacing (${density.label.toLowerCase()} density — ${unit}pt grid)
Tailwind's spacing base is ${unit}px (\`--spacing: var(--ds-spacing)\`, set to ${unit}px in the tokens). Every padding, margin, gap and control height is a whole multiple of it — never half steps (\`p-1.5\`, \`gap-2.5\`, \`px-3.5\`) or arbitrary pixel values. Changing density only changes the unit, so always use the step classes below.

| Class step | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|
| px | ${[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => n * unit).join(" | ")} |

- Icon ↔ label and inside controls: 2 (8px). Control padding: px-3 / px-4.
- Between fields or related items: 4–6. Card padding: p-5 / p-6. Gap between cards: 6.
- Between page sections: 8–12. Control heights: h-9 (h-11 on phones) / h-8 / h-7 / h-6 (${[9, 8, 7, 6].map((n) => n * unit).join(" / ")}px at this density).
- Only hairlines (1–2px borders, rings, underlines) are exempt.

## Elevation
Generated from one card shadow (y ${config.shadow.y}px, blur ${config.shadow.blur}px, spread ${config.shadow.spread}px, ${config.shadow.opacity}% opacity in light mode and ${config.shadow.opacityDark}% in dark mode, ${config.shadow.color === "primary" ? "primary-tinted" : "neutral"}), scaled into a ladder. Values are in the tokens below.
${shadowLevels.map((l) => `- shadow-${l.name} — ${l.use.replace(" — the shadow you edit", "")}: \`${shadowValue(config, "light", l.k)}\``).join("\n")}
- shadow-button (white buttons, select triggers, neutral badges), shadow-primary / shadow-inverse / shadow-danger (solid buttons), shadow-badge (tinted badges, edge drawn from their own text color), shadow-menu (select and dropdown menus): crisp and fixed, they don't scale with the card shadow
- shadow-focus / shadow-focus-primary / shadow-focus-danger — focus-visible halos on fields and other controls; buttons and select triggers use a 2px outline instead

## Component recipes
${recipes
  .map((rc) => `### ${rc.name}\n${rc.notes ? rc.notes + "\n" : ""}\`\`\`\n${rc.code}\n\`\`\``)
  .join("\n\n")}

## Do
${doAndDont.do.map((d) => `- ${d}`).join("\n")}

## Don't
${doAndDont.dont.map((d) => `- ${d}`).join("\n")}

## Setup: tokens
Put this in the global stylesheet (e.g. \`app/globals.css\`). It is the complete token set — do not add other colors.

\`\`\`css
@import "tailwindcss";

/* Theme values (generated for this configuration) */
${generateThemeCss(config)}

/* Tailwind mapping, type scale, elevation, base styles */
${tailwindTheme.trim()}
\`\`\`
`;
}
