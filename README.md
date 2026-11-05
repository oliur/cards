# Cards

**A design system studio you can make your own.** Tune color, neutrals, fonts, radius, density and shadows live, then take the result anywhere: as shadcn/ui components, as an AI prompt, or as an agent skill.

**→ Try it at [cards.uidesigncourse.com](https://cards.uidesigncourse.com)**

Cards is a systematic design language built on **shadcn/ui** conventions (Radix primitives, cva, `cn()`, `data-slot`) with its own semantic token layer (`bg-surface` / `text-fg` / `ring-line` colors, `text-ui-sm`-style type). The site and the prompt you copy read from the same source files, so they can't drift apart.

## Installation

Open [cards.uidesigncourse.com](https://cards.uidesigncourse.com), adjust the settings, then click **Copy prompt**. Every option below carries your colors, fonts and radius. The links in this section use the default settings (`cards`); the site gives you a link with your own settings encoded in it.

### Option 1: Install the components (shadcn/ui projects)

You need a project that uses Tailwind CSS v4 and has shadcn/ui set up with Radix. If you're starting from scratch:

```bash
npx create-next-app@latest my-app
cd my-app
npx shadcn@latest init
```

Then add Cards:

```bash
npx shadcn@latest add https://cards.uidesigncourse.com/r/cards.json
```

This installs:

- **Tokens:** neutral and primary ramps, semantic colors for light and dark mode, the type scale, radius scale and shadows. These are added to your global CSS, and your existing Tailwind palette is left in place.
- **Components** in `components/ui/`: accordion, alert, avatar, badge, brand icons, button, card, checkbox, dialog, image placeholder, input, label, radio, radio group, select, separator, slider, switch, tabs, textarea, tile group, tooltip and more.
- **Helpers** in `lib/`: `utils` (`cn()`) and `gradients`.
- **Dependencies:** `class-variance-authority`, `clsx`, `lucide-react`, `radix-ui` and `tailwind-merge`.

Last step: the CLI prints the font `<link>` tags for your settings. Paste them into your document `<head>` (in Next.js, `app/layout.tsx`). They're also in the **Copy prompt** dialog.

### Option 2: Paste the AI prompt

Copy the prompt from the site and paste it into any AI builder, chat, or rules file (`CLAUDE.md`, `AGENTS.md`, `.cursorrules` and so on). It describes the whole system in words: tokens, type, principles, do's and don'ts, and component recipes. This works with any stack, not only React.

### Option 3: Add it as an agent skill

Save the prompt as a skill so coding agents pick it up when they're working on UI:

```bash
mkdir -p .claude/skills/cards && curl -fsSL https://cards.uidesigncourse.com/skill/cards.md -o .claude/skills/cards/SKILL.md
```

## Running the studio locally

Requires Node 20+ and pnpm 9. There's no database and no environment variables.

```bash
git clone https://github.com/oliur/cards.git
cd cards
pnpm install
pnpm dev       # http://localhost:3000
```

Other commands:

```bash
pnpm lint      # eslint, plus the 4px spacing-grid and token checks
pnpm build     # production build (regenerates src/app/theme.css first)
pnpm start     # serve the production build
```

## Where things live

| File | What it is |
| --- | --- |
| `src/design-system/guidelines.ts` | **The aesthetic**: name, principles, color rules, do/don't, component recipes. Edit this to make the system yours. |
| `src/design-system/config.ts` | What's customizable: defaults, fonts, color and theme presets, share-link encoding. |
| `src/design-system/tokens.ts` | Turns a config into CSS variables (neutral and primary ramps, semantic tokens for light and dark, shadcn bridge, radius scale). |
| `src/design-system/theme.ts` | Tailwind v4 `@theme` mapping, type scale, shadows. `pnpm theme` writes it to `src/app/theme.css` (this runs automatically before `dev` and `build`). |
| `src/design-system/prompt.ts` | Builds the copyable AI prompt and the CSS-only export. |
| `src/design-system/registry.ts` | Builds the shadcn registry item served at `/r/<settings>.json`. |
| `src/components/ui/*` | The component library. |
| `src/components/studio/*` | The website: customizer, showcase, prompt dialog. |

## Deploying your own copy

Cards is a standard Next.js app (`pnpm build` then `pnpm start`), so it runs on any Node host. Before you deploy:

- Change `siteUrl` and `repoUrl` in `src/design-system/guidelines.ts`.
- Remove or replace the Plausible analytics tag in `src/app/layout.tsx`. It currently reports to cards.uidesigncourse.com.

Every response sends `Cache-Control` headers, so a CDN in front can serve almost all traffic: pages are static, and `/r/*` and `/skill/*` are pure functions of the URL.

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `pnpm lint` and `pnpm build`. Design changes belong in `src/design-system/` so the site and the copied prompt stay in sync.

## License

[MIT](LICENSE). Cards builds on shadcn/ui, Radix UI, the Tailwind CSS default palette, Lucide, Simple Icons and the Inter and DM Mono fonts. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for their licenses. Cards is not affiliated with shadcn.
