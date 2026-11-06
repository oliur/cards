---
name: cards
description: Applies the Cards design system (colors, type, radius, spacing, shadows and component rules) to any UI work. Use whenever creating, editing or reviewing UI, components, pages or styles in this project.
---

# Cards — design system instructions

You are building user interfaces with the Cards design system. Apply every rule below to all UI you create or edit in this project. When something isn't covered, extrapolate from these principles rather than falling back to generic defaults.

## Aesthetic
Quiet, precise and tactile, and card-based. Every screen is a very light grey canvas with content grouped into white cards; hairline strokes and generous whitespace do the rest, and color is reserved for intent (actions, status, focus) so it always means something. Depth comes from one crisp, small shadow rather than borders or heavy drop shadows. Typography does the heavy lifting: tight tracking, medium-weight labels and a clear size hierarchy.

## Stack & conventions
- React + Tailwind CSS v4. Components follow **shadcn/ui** conventions: Radix UI primitives (`radix-ui`), variants with `class-variance-authority`, a `cn()` helper (clsx + tailwind-merge), `data-slot` attributes, `asChild` via Radix Slot. Colors and type come only from Cards's semantic tokens (defined below).
- Icons: Lucide (`lucide-react`), the shadcn/ui default. Outline by default, size-5 (20px). Lucide has no brand logos, so use inline SVGs from Simple Icons for those.
- Fonts: Inter Variable for UI text, Inter Display for headings (text-heading-*), DM Mono for code/numbers. Headings use weight 500.
- Load fonts in the document head:
  `<link rel="stylesheet" href="https://rsms.me/inter/inter.css">`
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap">`
- Default mode: light. Dark mode is class-based (`.dark` on <html>) and handled entirely by tokens — never write `dark:` color overrides for semantic tokens.
- Configure tailwind-merge so `text-heading-*`, `text-ui-*`, `text-body-*` and `text-overline-*` are treated as font sizes (so they don't conflict with text colors like `text-fg-muted`):
```ts
const twMerge = extendTailwindMerge({ extend: { classGroups: { "font-size": [{ text: [/* every heading-*, ui-*, body-*, overline-* name */] }], shadow: [{ shadow: ["focus", "focus-primary", "focus-danger", "field", "control", "button", "primary", "inverse", "danger", "badge", "menu"] }] } } });
```

## Principles
1. **Neutral first, color with intent.** 95% of any screen is neutral tokens (surface/canvas backgrounds, fg-* text, line-* strokes). Primary appears on the single most important action and on focus/selection. Status colors only communicate state, never decoration.
2. **Semantic tokens only.** Never use raw hex values or Tailwind's default palette. Use semantic tokens (bg-surface, text-fg-muted, ring-line). They flip automatically in dark mode.
3. **Cards on a canvas.** The page background is always bg-canvas (very light grey). All content lives in white cards: rounded-2xl bg-surface shadow-sm. Never put content directly on the canvas except page titles and section headings. Don't nest cards; divide a card's sections with full-bleed h-px bg-line dividers.
4. **One shadow, scaled.** Elevation is a single shadow scaled into a ladder: shadow-xs on resting inputs, shadow-sm on cards, shadow-md on floating layers (popovers, toasts), shadow-lg on dialogs. Buttons, badges and menus sit outside the ladder with their own crisp tokens: shadow-button, shadow-primary, shadow-inverse, shadow-danger, shadow-badge and shadow-menu, a fine ring and a tight drop in light mode, a solid 0.5px outline and a black drop in dark. Shadowed surfaces (cards, popovers, dialogs) get no border or ring: the shadow alone defines the edge, and a stroke on top of it reads as a muddy double edge. Rings are for controls (inputs, checkboxes) that carry no real shadow. Never invent new shadows.
5. **One radius, scaled.** Every corner derives from a single base radius. Buttons use their own tokens, rounded-button (medium) and rounded-button-sm (compact), which either follow the scale or are pills. Other controls use rounded-lg (base), compact controls rounded-md, small marks rounded-xs/sm, cards rounded-2xl, dialogs rounded-3xl. People (avatars) and toggles are always rounded-full.
6. **Higher is lighter in dark mode.** In dark mode elevation is shown with lightness, not shadow: the page is a dark grey, never black, cards are one shade lighter, and the further above the page something sits, the lighter its surface. Always pick the surface token for the element's height (canvas → surface → raised → floating; subtle for recessed wells) instead of reusing surface everywhere, and never hard-code dark colours. Dark strokes are translucent white so they read the same on every level.
7. **Concentric corners.** When a rounded element sits inside another with a small gap (segmented triggers in their tray, menu items in a popover, content hugging a card's corner), the inner radius is the outer radius minus the gap so both curves share a centre. Put rounded-parent-{size} on the container and rounded-concentric-{n} on the child, where n is the container's padding in spacing steps (p-2 → rounded-concentric-2). Never give a nested element the same radius as its container.
8. **Type tokens, not font utilities.** Set type with the named styles (text-heading-4, text-ui-sm, text-body-sm, text-overline-xs) which bundle size, line-height, tracking and weight. Do not combine them with font-size, leading, tracking or font-weight utilities. Never set words or sentences in full uppercase unless the user asks for it.
9. **One spacing unit.** Every padding, margin, gap, offset and size is a whole multiple of the spacing unit (4px by default; the density setting changes the unit and scales the type with it, so a whole UI gets denser or airier together): use whole Tailwind steps only (1 = one unit, 2 = two …) and never half steps (1.5, 2.5, 3.5) or arbitrary pixel values. Inside components 2–4 (8–16px); between related elements 4–6 (16–24px); card padding 5–6 (20–24px); between sections 8–12 (32–48px). Control heights: 40 / 36 / 32 / 28. Only 1–2px hairlines (borders, rings, underlines) sit off the grid.
10. **Hover shifts, press squeezes, focus sharpens.** Hover changes color only, one step, and nothing moves or grows. Buttons squeeze slightly when pressed. Buttons and select triggers show focus-visible with a 2px outline at a 2px offset (outline-line-focus); other controls add a 2px offset halo using the shadow-focus, shadow-focus-primary and shadow-focus-danger tokens. Every interactive element has both.
11. **Icons are line, 20px, muted.** Use Lucide icons at size-5 inside medium fields and size-4 in compact ones. Buttons and select triggers always use size-4 at a 1.5px rendered stroke. Icons default to text-fg-subtle and darken to text-fg-muted on interaction. Fill an icon with currentColor only for media controls and ratings. Lucide has no brand logos, so use inline SVGs from Simple Icons for those.

## Color usage
- Surfaces by height: bg-canvas (page) → bg-surface (cards, sidebars) → bg-raised (things sitting on a card, e.g. the selected segmented tab) → bg-floating (popovers, menus, dialogs). Recessed wells inside a card (code blocks) use bg-subtle; the tray behind segmented tabs uses bg-tray. Table header rows use bg-table-head: a faint well in light mode, lighter than the card in dark mode. Selected tabs rise a level: bg-raised + the system shadow (shadow-sm), no ring. Selected tiles also add a 1px ring-[rgb(0_0_0/0.5)] border in light mode, and a white one in dark mode (dark:ring-[rgb(255_255_255/0.5)] dark:shadow-control). Never a heavy solid outline. Hover and highlighted states use bg-hover, a translucent tint that darkens in light mode and lightens in dark mode on any level. Exception: anything with a border (form fields, select triggers, tiles, outline buttons) never goes gray on hover; they stay white with their shadow and only the border darkens (hover:ring-line-strong). Focused or open fields get ring-line-focus + the focus shadow. Text fields (inputs, textareas) use bg-field + shadow-field + ring-field-line: white with a border in light mode; in dark mode a shade darker than the card, with an inner shadow and no border. Select triggers and outline buttons are controls, not text fields: white buttons and select triggers use bg-control + shadow-button, white in light mode and a shade lighter than the card in dark mode. Gray fills on fields mean disabled. In light mode the levels are all white and depth comes from shadow; in dark mode each level up is lighter.
- Primary text: text-fg. Secondary text and descriptions: text-fg-muted. Placeholders, meta and icons: text-fg-subtle. Disabled: text-fg-disabled.
- Borders and dividers: line (default) or line-strong (controls that need more contrast). line-focus only for focused inputs.
- Inverted surfaces (tooltips, neutral buttons): bg-inverse with text-fg-inverse.
- Primary tints: bg-primary-subtle for selected rows, primary-subtle-strong and primary-subtle-stronger for focus halos.
- Status: use {state}-subtle backgrounds with {state} icons/text for inline messages; solid {state} fills only for small high-signal marks (badges, dots).
- Text on primary uses text-primary-foreground (automatically black or white for contrast).

Primary color: `#000000` in light mode, `#F2F2F2` in dark mode. Neutral ramp: gray.

## Image placeholders
Wherever an image would go (thumbnails, covers, album art, app icons), and no real image exists, use one of these top-to-bottom sky gradients. Never use stock photos, generated art or grey boxes. They stay the same in light and dark mode. Write them as `linear-gradient(to bottom in oklab, top, bottom)`.
- Morning: First Light #A9C8E8 → #FBDCC8; Dawn Rose #B7B4DC → #F9CFCB; Soft Haze #D5DEE8 → #F7E8D8; Golden Hour #BFD9E6 → #FDE3A8; Mist #C9D8DE → #EEF1EA
- Day: Clear Sky #5BA4EC → #CFE7F8; High Noon #2F86E0 → #9AD0F5; Summer #49B4EA → #E6F6FB; Thin Cloud #9CC4E8 → #F1F5F8; Coastal #4FA3C7 → #D4EFE6
- Sunset: Dusk #6C63A8 → #F8A878; Ember #B4506A → #F9B26C; Coral #E8748A → #FCC98F; Afterglow #3E4A89 → #EE8D83; Last Light #8D5FA6 → #F6C1A0
- Night: Midnight #0B1026 → #2C3A68; Deep Blue #050A1C → #14305C; Blue Hour #1C2A5A → #5A6CA8; Aubergine #120C2C → #45305F; Moonlit #10181F → #3A4C5C

## Typography
Type scales with density (default: ×1); sizes below are already scaled and line-heights snap to the 4px grid. Use only these styles (Tailwind class `text-{token}`). Each sets size, line-height, letter-spacing and weight. Headings automatically use the display font.

| Token | Size / line | Use for |
|---|---|---|
| text-heading-1 | 56/64 | Marketing hero only |
| text-heading-2 | 48/56 | Marketing section titles |
| text-heading-3 | 40/48 | Large page heroes |
| text-heading-4 | 32/40 | Page titles in marketing / onboarding |
| text-heading-5 | 24/32 | App page titles, empty states |
| text-heading-6 | 20/28 | Section titles inside apps |
| text-ui-xl | 24/32 | Large numbers / stats |
| text-ui-lg | 18/24 | Prominent labels, card stats |
| text-ui-md | 16/24 | Card, dialog and list-item titles |
| text-ui-sm | 14/20 | Buttons, form labels, nav items (default UI label) |
| text-ui-xs | 12/16 | Small labels, table headers |
| text-body-lg | 18/24 | Lead paragraphs |
| text-body-md | 16/24 | Long-form body |
| text-body-sm | 14/20 | Default UI body, descriptions, input text |
| text-body-xs | 12/16 | Hints, captions, meta |
| text-overline-xs | 12/16 | Eyebrows / group labels |
| text-overline-2xs | 11/12 | Small badges, tiny eyebrows |

## Radius scale (stop 4 of 7, base 8px)
rounded-xs 3px · rounded-sm 5px · rounded-md 6px · rounded-lg 8px · rounded-xl 10px · rounded-2xl 13px · rounded-3xl 19px · rounded-full
- Buttons: always `rounded-button` (medium) / `rounded-button-sm` (small and below) — currently 8px / 6px, matching the scale. Never hard-code a button radius.
- Inputs and selects: rounded-lg; compact: rounded-md.
- Concentric corners: a container that holds tightly-nested rounded children uses `rounded-parent-{size}`; each child uses `rounded-concentric-{n}` (n = the container's padding step), giving inner radius = outer radius − padding. The two utilities are defined in the stylesheet below. Checkbox / kbd: rounded-xs. Badges: always rounded-full.
- Alerts, menu items' containers: rounded-xl. Cards and popovers: rounded-2xl. Dialogs and sheets: rounded-3xl.

## Layout
Card-based: the page is `bg-canvas` (very light grey) and every block of content is a white card (`bg-surface`). Page titles and section headings sit on the canvas; everything else goes in cards.

## Spacing (default density — 4pt grid)
Tailwind's spacing base is 4px (`--spacing: var(--ds-spacing)`, set to 4px in the tokens). Every padding, margin, gap and control height is a whole multiple of it — never half steps (`p-1.5`, `gap-2.5`, `px-3.5`) or arbitrary pixel values. Changing density only changes the unit, so always use the step classes below.

| Class step | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|
| px | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 |

- Icon ↔ label and inside controls: 2 (8px). Control padding: px-3 / px-4.
- Between fields or related items: 4–6. Card padding: p-5 / p-6. Gap between cards: 6.
- Between page sections: 8–12. Control heights: h-9 (h-11 on phones) / h-8 / h-7 / h-6 (36 / 32 / 28 / 24px at this density).
- Only hairlines (1–2px borders, rings, underlines) are exempt.

## Elevation
Generated from one card shadow (y 1px, blur 2px, spread 0px, 10% opacity in light mode and 30% in dark mode, neutral), scaled into a ladder. Values are in the tokens below.
- shadow-xs — Resting inputs: `0 0.5px 1px 0px rgb(0 0 0 / 0.088)`
- shadow-sm — Cards: `0 1px 2px 0px rgb(0 0 0 / 0.1)`
- shadow-md — Popovers, tooltips, toasts: `0 4px 8px 0px rgb(0 0 0 / 0.175)`
- shadow-lg — Dialogs and sheets: `0 8px 16px 0px rgb(0 0 0 / 0.275)`
- shadow-button (white buttons, select triggers, neutral badges), shadow-primary / shadow-inverse / shadow-danger (solid buttons), shadow-badge (tinted badges, edge drawn from their own text color), shadow-menu (select and dropdown menus): crisp and fixed, they don't scale with the card shadow
- shadow-focus / shadow-focus-primary / shadow-focus-danger — focus-visible halos on fields and other controls; buttons and select triggers use a 2px outline instead

## Component recipes
### Button
API: variant = primary | neutral | danger, mode = solid | outline | soft | ghost | raised, size = medium (h-9, h-11 on phones) | small (h-8) | xsmall (h-7) | xxsmall (h-6), flat = true for a button with no shadow or press squeeze. Built with cva + Radix Slot (asChild).
```
base:    inline-flex items-center justify-center gap-1 whitespace-nowrap text-ui-sm outline-none
         [&_svg]:size-4 [&_svg]:[stroke-width:2.25] (a 1.5px rendered stroke)
         focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-line-focus
         transition-[color,background-color,box-shadow,filter,scale] duration-150 ease-tactile
         active:scale-[0.97] (icon-only active:scale-[0.94]); hover changes color only, nothing moves or grows
         disabled:opacity-60 (icon-only disabled:opacity-40) disabled:active:scale-100
medium:  h-9 max-md:h-11 rounded-button px-4      small: h-8 rounded-button-sm px-4      xsmall: h-7 rounded-button-sm px-2      xxsmall: h-6 rounded-button-sm px-2
leading icon: the icon side is tighter, has-[>svg:first-child]:pl-3
primary/solid:   bg-primary text-primary-foreground shadow-primary hover:bg-primary-hover
                 shadow-primary is a lit top line, a ring in its own fill and two tight drops (inset 0 1px rgb(255 255 255/.16), 0 0 0 1px fill, 0 1px 2px, 0 3px 6px -2px)
                 dark:disabled:bg-control dark:disabled:text-fg-disabled dark:disabled:opacity-100 dark:disabled:shadow-none
primary/outline and soft: bg-control text-primary shadow-button hover:bg-control-hover
primary/ghost:   bg-transparent text-primary hover:bg-primary-subtle
neutral/solid:   bg-inverse text-fg-inverse shadow-inverse hover:bg-inverse-hover, plus the same dark disabled classes as primary/solid
neutral/outline, soft and raised (the white button, on the grey page or a white card; never a grey fill):
                 bg-control text-fg shadow-button [&_svg]:text-fg-subtle (icon-only [&_svg]:text-fg-muted) hover:bg-control-hover
neutral/ghost:   bg-transparent text-fg-muted hover:bg-hover hover:text-fg
danger/solid (the final confirm inside a dialog): bg-danger text-white shadow-danger hover:brightness-95
danger/outline (the trigger that opens it): bg-control text-danger-fg shadow-button hover:bg-danger-subtle
danger/soft:     bg-danger-subtle text-danger-fg ring-[0.5px] ring-danger-line hover:bg-danger-line
danger/ghost:    bg-transparent text-danger hover:bg-danger-subtle
flat:            shadow-none active:scale-100; white buttons (primary and neutral outline and soft, danger outline, raised) add ring-1 ring-inset ring-line hover:ring-line-strong
```

### Input
Wrapper div carries the styling; the <input> inside is transparent. Optional leading icon/trailing slot.
```
wrapper: group flex h-9 max-md:h-11 w-full items-center gap-2 rounded-lg bg-field px-3 shadow-field ring-1 ring-inset ring-field-line transition
         hover:ring-line-strong (stays white with its shadow; only the border darkens)
         focus-within:shadow-focus focus-within:ring-line-focus
         [&_svg]:size-5 [&_svg]:text-fg-subtle
error:   ring-danger focus-within:shadow-focus-danger
input:   w-full bg-transparent text-body-sm text-fg outline-none placeholder:text-fg-subtle
label:   text-ui-sm text-fg   (optional hint suffix: text-body-sm text-fg-muted)
message: flex items-center gap-1 text-body-xs text-fg-muted [&_svg]:size-4
```

### Select / Dropdown
Radix Select. The trigger is the white button, not a field. The menu opens from its trigger and is drawn with one crisp shadow.
```
trigger: flex h-9 max-md:h-11 w-full items-center gap-2 rounded-lg bg-control px-3 text-body-sm text-fg shadow-button
         hover:bg-control-hover active:scale-[0.97] data-[state=open]:bg-control-hover
         focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-line-focus
         chevron: size-4 text-fg-subtle, turns over while open: group-data-[state=open]:rotate-180 duration-150 ease-tactile
menu (select, dropdown): rounded-parent-2xl bg-floating p-2 shadow-menu
         origin-(--radix-select-content-transform-origin) animate-menu-in data-[state=closed]:animate-menu-out
         (150ms in, 120ms out, from scale .97; reduced motion: motion-reduce:animate-menu-fade-in, fade only)
item:    flex items-center gap-2 rounded-concentric-2 p-2 text-body-sm text-fg-muted not-first:mt-1
         highlighted: bg-hover text-fg       chosen: bg-selected text-fg, no tick; a highlight stays a step below chosen
other floating layers (popover, combobox): rounded-parent-2xl bg-floating p-2 shadow-md
group label: px-2 py-1 text-overline-xs text-fg-subtle
```

### Checkbox, Radio, Switch
```
checkbox: size-4 rounded-xs bg-surface shadow-xs ring-1 ring-inset ring-line-strong
          checked: bg-primary ring-primary, white 1.6px check stroke
radio:    size-4 rounded-full (same states), checked: bg-primary with a size-2 white dot
switch:   track h-6 w-10 rounded-full bg-track p-1 → checked bg-switch-on (the primary, or a mid grey in dark mode when the primary is near-white, since the thumb is always white)
          thumb size-4 rounded-full bg-white shadow-sm, translate-x-4 when checked
all:      focus-visible:shadow-focus-primary; disabled: bg-track no ring/shadow
```

### Accordion
Radix Accordion. Use type="multiple" for settings panels, type="single" collapsible for FAQs.
```
item:    border-b border-line (none on the last item)
trigger: flex flex-1 items-center justify-between gap-2 py-4 text-ui-sm text-fg
         chevron ChevronDownIcon size-5 text-fg-subtle, rotates 180° when open
         row actions (e.g. Reset) sit beside the trigger, never inside it
content: pb-5, height animates open/closed (200ms ease-out-expo)
```

### Tile group
Single-choice tiles (plans, layouts, swatches, options). Radix RadioGroup underneath, so arrow keys move the selection.
```
group:   grid gap-2 (set columns per use)
tile:    flex flex-col items-center justify-center gap-2 rounded-parent-lg p-2 text-ui-xs text-fg-muted
         ring-1 ring-inset ring-line hover:ring-line-strong hover:text-fg (no gray fill)
selected: bg-raised text-fg shadow-sm ring-[rgb(0_0_0/0.5)] dark:ring-[rgb(255_255_255/0.5)] dark:shadow-control
inner content hugging the tile edge: rounded-concentric-2
```

### Card
```
page:    min-h-screen bg-canvas, cards laid out with gap-6 (24px)
card:    rounded-2xl bg-surface shadow-sm
header:  flex items-start gap-4 p-5
         icon: size-10 rounded-full ring-1 ring-inset ring-line text-fg-muted [&_svg]:size-5
         title: text-ui-md text-fg   description: text-body-sm text-fg-muted
divider: h-px bg-line (full-bleed between sections)
content: p-5        footer: flex items-center gap-3 px-5 py-4 (actions right-aligned)
```

### Dialog
```
overlay: fixed inset-0 bg-overlay backdrop-blur-[6px]
content: max-w-[440px] rounded-3xl bg-floating shadow-lg, enters with fade + 4px rise (160ms, ease-out-expo)
layout:  header (as Card header, title in text-ui-md) / body with border-t / footer with border-t, buttons right-aligned
close:   absolute top-4 right-4 size-6 rounded-md text-fg-muted hover:bg-hover
```

### Tabs
```
segmented: list rounded-parent-lg bg-tray p-1 gap-1; trigger h-7 flex-1 rounded-concentric-1 text-ui-sm text-fg-muted
           active: bg-raised text-fg shadow-sm
line:      list flex gap-6 border-b border-line; trigger h-12 text-ui-sm text-fg-muted
           active: text-fg with a 2px bg-primary bar on the bottom edge, icon turns text-primary
```

### Badge & status
```
badge:   inline-flex h-5 items-center gap-1 rounded-full px-2 text-ui-xs tabular-nums, in every size and at every radius
         soft (default): bg-{state}-subtle text-{state}-fg shadow-badge (its edge is drawn from its own text color)
         neutral soft: bg-control text-fg-muted shadow-button (never a grey fill)
         tint: bg-{state}-line text-{state}-fg     solid: bg-{state} text-white
         outline: bg-transparent ring-1 ring-inset ring-{state}-line text-{state}
status pill (tables): h-6 rounded-full bg-control px-2 text-ui-xs text-fg-muted shadow-button + size-2 dot in bg-{state}
```

### Alert, Tooltip, Avatar
```
alert:   flex items-start gap-3 rounded-xl p-4 bg-{state}-subtle, Ri*Fill icon size-5 text-{state},
         title text-ui-sm text-fg, body text-body-sm text-fg-muted
tooltip: rounded-md bg-inverse px-2 py-1 text-body-xs text-fg-inverse shadow-md
avatar:  rounded-full, sizes 24/32/40/48/64; fallback initials on bg-{state}-line text-{state}-fg
         groups overlap -space-x-2 with ring-2 ring-line-inverse
```

## Do
- Group related content in white Cards on the canvas (rounded-2xl, shadow-sm, no border) with a header row of icon-in-ring + title + description.
- Pair a label (text-ui-sm) with every input; put helper/error text below in text-body-xs.
- Use sentence case for all UI copy, including labels, badges, buttons and section eyebrows.
- Right-align primary actions in footers; neutral outline button for cancel, solid primary for confirm.
- Use dividers (h-px bg-line) to separate card sections instead of nested boxes.

## Don't
- Never use full uppercase for words or sentences, by typing it or with the uppercase class or text-transform, unless the user asks for it. Acronyms, codes and initials (API, LAX, #FFFFFF) keep their normal form.
- Don't use more than one solid primary button per view.
- Don't use shadows larger than shadow-sm on in-flow content, or white backgrounds for the page itself.
- Don't mix arbitrary radii (rounded-[7px]) — use the scale.
- Don't use gradients, glows or saturated backgrounds for large areas.
- Don't use raw Tailwind colors (gray-500, blue-600) or hex values in components.

## Setup: tokens
Put this in the global stylesheet (e.g. `app/globals.css`). It is the complete token set — do not add other colors.

```css
@import "tailwindcss";

/* Theme values (generated for this configuration) */
:root {
  --neutral-0: #FFFFFF;
  --neutral-50: #FAFAFA;
  --neutral-100: #F5F5F5;
  --neutral-200: #E5E5E5;
  --neutral-300: #D4D4D4;
  --neutral-400: #A1A1A1;
  --neutral-500: #737373;
  --neutral-600: #525252;
  --neutral-700: #404040;
  --neutral-800: #262626;
  --neutral-900: #171717;
  --neutral-950: #0A0A0A;
  --primary-50: #F7F7F7;
  --primary-100: #EDEDED;
  --primary-200: #DEDEDE;
  --primary-300: #C7C7C7;
  --primary-400: #ABABAB;
  --primary-500: #000000;
  --primary-600: #000000;
  --primary-700: #000000;
  --primary-800: #000000;
  --primary-900: #000000;
  --primary-950: #000000;
  --ds-font-sans: "InterVariable", "Inter", ui-sans-serif, system-ui, sans-serif;
  --ds-font-display: "InterDisplay", "Inter", ui-sans-serif, system-ui, sans-serif;
  --ds-font-mono: "DM Mono", ui-monospace, monospace;
  --ds-heading-weight: 500;
  --ds-spacing: 4px;
  --ds-font-scale: 1;
  --ds-radius-xs: 3px;
  --ds-radius-sm: 5px;
  --ds-radius-md: 6px;
  --ds-radius-lg: 8px;
  --ds-radius-xl: 10px;
  --ds-radius-2xl: 13px;
  --ds-radius-3xl: 19px;
  --ds-radius-button: 8px;
  --ds-radius-button-sm: 6px;
  --canvas: #F5F5F5;
  --inverse: #0A0A0A;
  --inverse-hover: #1B1B1B;
  --track-strong: #D4D4D4;
  --track: #E5E5E5;
  --subtle: #FAFAFA;
  --tray: #E5E5E5;
  --surface: #FFFFFF;
  --raised: #FFFFFF;
  --floating: #FFFFFF;
  --field: #FFFFFF;
  --control: #FFFFFF;
  --control-hover: #FAFAFA;
  --field-line: #E5E5E5;
  --table-head: #FAFAFA;
  --hover: rgb(10 10 10 / 0.04);
  --selected: rgb(10 10 10 / 0.08);
  --fg: #0A0A0A;
  --fg-muted: #525252;
  --fg-subtle: #A1A1A1;
  --fg-disabled: #D4D4D4;
  --fg-inverse: #FFFFFF;
  --line-focus: #0A0A0A;
  --line-strong: #D4D4D4;
  --line: #E5E5E5;
  --line-inverse: #FFFFFF;
  --primary: #000000;
  --primary-hover: #121212;
  --primary-active: #090909;
  --primary-foreground: #FFFFFF;
  --switch-on: #000000;
  --switch-on-hover: #010101;
  --primary-subtle-stronger: rgb(0 0 0 / 0.24);
  --primary-subtle-strong: rgb(0 0 0 / 0.16);
  --primary-subtle: rgb(0 0 0 / 0.1);
  --black: #0A0A0A;
  --white: #FFFFFF;
  --neutral-fg: #262626;
  --neutral: #737373;
  --neutral-line: #E5E5E5;
  --neutral-subtle: #F5F5F5;
  --overlay: rgb(10 10 10 / 0.24);
  --danger: #FB2C36;
  --danger-fg: #82181A;
  --danger-line: #FFC9C9;
  --danger-subtle: #FEF2F2;
  --warning: #FF6900;
  --warning-fg: #7E2A0C;
  --warning-line: #FFD6A7;
  --warning-subtle: #FFF7ED;
  --success: #00C950;
  --success-fg: #0D542B;
  --success-line: #B9F8CF;
  --success-subtle: #F0FDF4;
  --info: #2B7FFF;
  --info-fg: #1C398E;
  --info-line: #BEDBFF;
  --info-subtle: #EFF6FF;
  --highlight: #8E51FF;
  --highlight-fg: #4D179A;
  --highlight-line: #DDD6FF;
  --highlight-subtle: #F5F3FF;
  --caution: #FFB900;
  --caution-fg: #7B3306;
  --caution-line: #FEE685;
  --caution-subtle: #FFFBEB;
  --ds-shadow-xs: 0 0.5px 1px 0px rgb(0 0 0 / 0.088);
  --ds-shadow-sm: 0 1px 2px 0px rgb(0 0 0 / 0.1);
  --ds-shadow-md: 0 4px 8px 0px rgb(0 0 0 / 0.175);
  --ds-shadow-lg: 0 8px 16px 0px rgb(0 0 0 / 0.275), 0 0 0 1px rgb(14 18 27 / 0.04);
  --ds-shadow-field: 0 0.5px 1px 0px rgb(0 0 0 / 0.088);
  --ds-shadow-control: 0 0.5px 1px 0px rgb(0 0 0 / 0.088);
  --ds-shadow-button: 0 0 0 1px rgb(10 10 10 / 0.08), 0 1px 2px 0 rgb(10 10 10 / 0.12);
  --ds-shadow-primary: inset 0 1px 0 0 rgb(255 255 255 / 0.16), 0 0 0 1px #000000, 0 1px 2px 0 rgb(10 10 10 / 0.24), 0 3px 6px -2px rgb(10 10 10 / 0.2);
  --ds-shadow-inverse: inset 0 1px 0 0 rgb(255 255 255 / 0.16), 0 0 0 1px #0A0A0A, 0 1px 2px 0 rgb(10 10 10 / 0.24), 0 3px 6px -2px rgb(10 10 10 / 0.2);
  --ds-shadow-danger: inset 0 1px 0 0 rgb(255 255 255 / 0.16), 0 0 0 1px #FB2C36, 0 1px 2px 0 rgb(10 10 10 / 0.24), 0 3px 6px -2px rgb(10 10 10 / 0.2);
  --ds-shadow-badge: 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent), 0 1px 2px 0 color-mix(in srgb, currentColor 16%, transparent);
  --ds-shadow-menu: 0 0 0 1px rgb(10 10 10 / 0.08), 0 1px 2px 0 rgb(10 10 10 / 0.12), 0 4px 8px -4px rgb(10 10 10 / 0.16);
  --background: #F5F5F5;
  --foreground: #0A0A0A;
  --card: #FFFFFF;
  --card-foreground: #0A0A0A;
  --popover: #FFFFFF;
  --popover-foreground: #0A0A0A;
  --secondary: #FAFAFA;
  --secondary-foreground: #0A0A0A;
  --muted-foreground: #525252;
  --muted: #FAFAFA;
  --accent: rgb(10 10 10 / 0.04);
  --accent-foreground: #0A0A0A;
  --destructive: #FB2C36;
  --destructive-foreground: #FFFFFF;
  --border: #E5E5E5;
  --input: #E5E5E5;
  --ring: #000000;
  --chart-1: #2B7FFF;
  --chart-2: #00C950;
  --chart-3: #FF6900;
  --chart-4: #8E51FF;
  --chart-5: #FB2C36;
  --sidebar: #FFFFFF;
  --sidebar-foreground: #0A0A0A;
  --sidebar-primary: #000000;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: rgb(10 10 10 / 0.04);
  --sidebar-accent-foreground: #0A0A0A;
  --sidebar-border: #E5E5E5;
  --sidebar-ring: #000000;
}

.dark {
  --canvas: #171717;
  --inverse: #FFFFFF;
  --inverse-hover: #EEEEEE;
  --track-strong: #525252;
  --track: #404040;
  --subtle: #202020;
  --tray: #171717;
  --surface: #252525;
  --raised: #2C2C2C;
  --floating: #343434;
  --field: #1E1E1E;
  --control: #2C2C2C;
  --control-hover: #343434;
  --field-line: transparent;
  --table-head: #2C2C2C;
  --hover: rgb(255 255 255 / 0.06);
  --selected: rgb(255 255 255 / 0.12);
  --fg: #FFFFFF;
  --fg-muted: #A1A1A1;
  --fg-subtle: #737373;
  --fg-disabled: #525252;
  --fg-inverse: #0A0A0A;
  --line-focus: #FFFFFF;
  --line-strong: rgb(255 255 255 / 0.18);
  --line: rgb(255 255 255 / 0.07);
  --line-inverse: #252525;
  --primary: #F2F2F2;
  --primary-hover: #E2E2E2;
  --primary-active: #C4C4C4;
  --primary-foreground: #0A0A0A;
  --switch-on: #737373;
  --switch-on-hover: #888888;
  --primary-subtle-stronger: rgb(242 242 242 / 0.24);
  --primary-subtle-strong: rgb(242 242 242 / 0.16);
  --primary-subtle: rgb(242 242 242 / 0.1);
  --black: #0A0A0A;
  --white: #FFFFFF;
  --neutral-fg: #E5E5E5;
  --neutral: #737373;
  --neutral-line: #404040;
  --neutral-subtle: rgb(255 255 255 / 0.1);
  --overlay: rgb(0 0 0 / 0.6);
  --danger: #FB2C36;
  --danger-fg: #FFC9C9;
  --danger-line: rgb(251 44 54 / 0.24);
  --danger-subtle: rgb(251 44 54 / 0.16);
  --warning: #FF6900;
  --warning-fg: #FFD6A7;
  --warning-line: rgb(255 105 0 / 0.24);
  --warning-subtle: rgb(255 105 0 / 0.16);
  --success: #00C950;
  --success-fg: #B9F8CF;
  --success-line: rgb(0 201 80 / 0.24);
  --success-subtle: rgb(0 201 80 / 0.16);
  --info: #2B7FFF;
  --info-fg: #BEDBFF;
  --info-line: rgb(43 127 255 / 0.24);
  --info-subtle: rgb(43 127 255 / 0.16);
  --highlight: #8E51FF;
  --highlight-fg: #DDD6FF;
  --highlight-line: rgb(142 81 255 / 0.24);
  --highlight-subtle: rgb(142 81 255 / 0.16);
  --caution: #FFB900;
  --caution-fg: #FEE685;
  --caution-line: rgb(255 185 0 / 0.24);
  --caution-subtle: rgb(255 185 0 / 0.16);
  --ds-shadow-xs: 0 0.5px 1px 0px rgb(0 0 0 / 0.263);
  --ds-shadow-sm: 0 0 0 1px #343434, 0 1px 2px 0px rgb(0 0 0 / 0.3);
  --ds-shadow-md: 0 0 0 1px #424242, 0 4px 8px 0px rgb(0 0 0 / 0.525);
  --ds-shadow-lg: 0 0 0 1px #424242, 0 8px 16px 0px rgb(0 0 0 / 0.8);
  --ds-shadow-field: inset 0 1px 2px 0px rgb(0 0 0 / 0.3);
  --ds-shadow-control: 0 1px 2px 0px rgb(0 0 0 / 0.3);
  --ds-shadow-button: 0 0 0 0.5px #434343, 0 1px 2px 0 rgb(0 0 0 / 0.5);
  --ds-shadow-primary: 0 0 0 0.5px #F2F2F2, 0 1px 2px 0 rgb(0 0 0 / 0.5);
  --ds-shadow-inverse: 0 0 0 0.5px #FFFFFF, 0 1px 2px 0 rgb(0 0 0 / 0.5);
  --ds-shadow-danger: 0 0 0 0.5px #FB2C36, 0 1px 2px 0 rgb(0 0 0 / 0.5);
  --ds-shadow-badge: 0 0 0 0.5px color-mix(in srgb, currentColor 34%, #000), 0 1px 2px 0 rgb(0 0 0 / 0.5);
  --ds-shadow-menu: 0 0 0 0.5px #434343, 0 1px 2px 0 rgb(0 0 0 / 0.5), 0 4px 8px -4px rgb(0 0 0 / 0.5);
  --background: #171717;
  --foreground: #FFFFFF;
  --card: #252525;
  --card-foreground: #FFFFFF;
  --popover: #343434;
  --popover-foreground: #FFFFFF;
  --secondary: #202020;
  --secondary-foreground: #FFFFFF;
  --muted-foreground: #A1A1A1;
  --muted: #202020;
  --accent: rgb(255 255 255 / 0.06);
  --accent-foreground: #FFFFFF;
  --destructive: #FB2C36;
  --destructive-foreground: #FFFFFF;
  --border: rgb(255 255 255 / 0.07);
  --input: rgb(255 255 255 / 0.07);
  --ring: #F2F2F2;
  --chart-1: #2B7FFF;
  --chart-2: #00C950;
  --chart-3: #FF6900;
  --chart-4: #8E51FF;
  --chart-5: #FB2C36;
  --sidebar: #252525;
  --sidebar-foreground: #FFFFFF;
  --sidebar-primary: #F2F2F2;
  --sidebar-primary-foreground: #0A0A0A;
  --sidebar-accent: rgb(255 255 255 / 0.06);
  --sidebar-accent-foreground: #FFFFFF;
  --sidebar-border: rgb(255 255 255 / 0.07);
  --sidebar-ring: #F2F2F2;
}

/* Tailwind mapping, type scale, elevation, base styles */
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  /* ---------- color: raw ramps ---------- */
  --color-*: initial;
  --color-transparent: transparent;
  --color-current: currentColor;
  --color-neutral-0: var(--neutral-0);
  --color-neutral-50: var(--neutral-50);
  --color-neutral-100: var(--neutral-100);
  --color-neutral-200: var(--neutral-200);
  --color-neutral-300: var(--neutral-300);
  --color-neutral-400: var(--neutral-400);
  --color-neutral-500: var(--neutral-500);
  --color-neutral-600: var(--neutral-600);
  --color-neutral-700: var(--neutral-700);
  --color-neutral-800: var(--neutral-800);
  --color-neutral-900: var(--neutral-900);
  --color-neutral-950: var(--neutral-950);
  --color-primary-50: var(--primary-50);
  --color-primary-100: var(--primary-100);
  --color-primary-200: var(--primary-200);
  --color-primary-300: var(--primary-300);
  --color-primary-400: var(--primary-400);
  --color-primary-500: var(--primary-500);
  --color-primary-600: var(--primary-600);
  --color-primary-700: var(--primary-700);
  --color-primary-800: var(--primary-800);
  --color-primary-900: var(--primary-900);
  --color-primary-950: var(--primary-950);

  /* ---------- color: semantic ---------- */
  --color-canvas: var(--canvas);
  --color-tray: var(--tray);
  --color-inverse: var(--inverse);
  --color-inverse-hover: var(--inverse-hover);
  --color-track-strong: var(--track-strong);
  --color-track: var(--track);
  --color-subtle: var(--subtle);
  --color-surface: var(--surface);
  --color-field: var(--field);
  --color-control: var(--control);
  --color-control-hover: var(--control-hover);
  --color-table-head: var(--table-head);
  --color-field-line: var(--field-line);
  --color-raised: var(--raised);
  --color-floating: var(--floating);
  --color-hover: var(--hover);
  --color-selected: var(--selected);

  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-fg-subtle: var(--fg-subtle);
  --color-fg-disabled: var(--fg-disabled);
  --color-fg-inverse: var(--fg-inverse);

  --color-line-focus: var(--line-focus);
  --color-line-strong: var(--line-strong);
  --color-line: var(--line);
  --color-line-inverse: var(--line-inverse);

  --color-primary: var(--primary);
  --color-switch-on: var(--switch-on);
  --color-switch-on-hover: var(--switch-on-hover);
  --color-primary-hover: var(--primary-hover);
  --color-primary-active: var(--primary-active);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-subtle-stronger: var(--primary-subtle-stronger);
  --color-primary-subtle-strong: var(--primary-subtle-strong);
  --color-primary-subtle: var(--primary-subtle);

  --color-black: var(--black);
  --color-white: var(--white);
  --color-overlay: var(--overlay);

  --color-danger-fg: var(--danger-fg);
  --color-danger: var(--danger);
  --color-danger-line: var(--danger-line);
  --color-danger-subtle: var(--danger-subtle);
  --color-warning-fg: var(--warning-fg);
  --color-warning: var(--warning);
  --color-warning-line: var(--warning-line);
  --color-warning-subtle: var(--warning-subtle);
  --color-success-fg: var(--success-fg);
  --color-success: var(--success);
  --color-success-line: var(--success-line);
  --color-success-subtle: var(--success-subtle);
  --color-info-fg: var(--info-fg);
  --color-info: var(--info);
  --color-info-line: var(--info-line);
  --color-info-subtle: var(--info-subtle);
  --color-highlight-fg: var(--highlight-fg);
  --color-highlight: var(--highlight);
  --color-highlight-line: var(--highlight-line);
  --color-highlight-subtle: var(--highlight-subtle);
  --color-caution-fg: var(--caution-fg);
  --color-caution: var(--caution);
  --color-caution-line: var(--caution-line);
  --color-caution-subtle: var(--caution-subtle);
  --color-neutral-fg: var(--neutral-fg);
  --color-neutral: var(--neutral);
  --color-neutral-line: var(--neutral-line);
  --color-neutral-subtle: var(--neutral-subtle);

  /* shadcn/ui bridge (primary above doubles as the shadcn token) */
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* ---------- spacing: one base unit (4px by default; density presets change it) ---------- */
  --spacing: var(--ds-spacing);

  /* ---------- type ---------- */
  --font-sans: var(--ds-font-sans);
  --font-display: var(--ds-font-display);
  --font-mono: var(--ds-font-mono);

  --text-heading-1: round(calc(3.5rem * var(--ds-font-scale)), 1px);
  --text-heading-1--line-height: round(calc(4rem * var(--ds-font-scale)), 4px);
  --text-heading-1--letter-spacing: -0.01em;
  --text-heading-1--font-weight: var(--ds-heading-weight);
  --text-heading-2: round(calc(3rem * var(--ds-font-scale)), 1px);
  --text-heading-2--line-height: round(calc(3.5rem * var(--ds-font-scale)), 4px);
  --text-heading-2--letter-spacing: -0.01em;
  --text-heading-2--font-weight: var(--ds-heading-weight);
  --text-heading-3: round(calc(2.5rem * var(--ds-font-scale)), 1px);
  --text-heading-3--line-height: round(calc(3rem * var(--ds-font-scale)), 4px);
  --text-heading-3--letter-spacing: -0.01em;
  --text-heading-3--font-weight: var(--ds-heading-weight);
  --text-heading-4: round(calc(2rem * var(--ds-font-scale)), 1px);
  --text-heading-4--line-height: round(calc(2.5rem * var(--ds-font-scale)), 4px);
  --text-heading-4--letter-spacing: -0.005em;
  --text-heading-4--font-weight: var(--ds-heading-weight);
  --text-heading-5: round(calc(1.5rem * var(--ds-font-scale)), 1px);
  --text-heading-5--line-height: round(calc(2rem * var(--ds-font-scale)), 4px);
  --text-heading-5--letter-spacing: 0em;
  --text-heading-5--font-weight: var(--ds-heading-weight);
  --text-heading-6: round(calc(1.25rem * var(--ds-font-scale)), 1px);
  --text-heading-6--line-height: round(calc(1.75rem * var(--ds-font-scale)), 4px);
  --text-heading-6--letter-spacing: 0em;
  --text-heading-6--font-weight: var(--ds-heading-weight);

  --text-ui-xl: round(calc(1.5rem * var(--ds-font-scale)), 1px);
  --text-ui-xl--line-height: round(calc(2rem * var(--ds-font-scale)), 4px);
  --text-ui-xl--letter-spacing: -0.015em;
  --text-ui-xl--font-weight: 500;
  --text-ui-lg: round(calc(1.125rem * var(--ds-font-scale)), 1px);
  --text-ui-lg--line-height: round(calc(1.5rem * var(--ds-font-scale)), 4px);
  --text-ui-lg--letter-spacing: -0.015em;
  --text-ui-lg--font-weight: 500;
  --text-ui-md: round(calc(1rem * var(--ds-font-scale)), 1px);
  --text-ui-md--line-height: round(calc(1.5rem * var(--ds-font-scale)), 4px);
  --text-ui-md--letter-spacing: -0.011em;
  --text-ui-md--font-weight: 500;
  --text-ui-sm: round(calc(0.875rem * var(--ds-font-scale)), 1px);
  --text-ui-sm--line-height: round(calc(1.25rem * var(--ds-font-scale)), 4px);
  --text-ui-sm--letter-spacing: -0.006em;
  --text-ui-sm--font-weight: 500;
  --text-ui-xs: round(calc(0.75rem * var(--ds-font-scale)), 1px);
  --text-ui-xs--line-height: round(calc(1rem * var(--ds-font-scale)), 4px);
  --text-ui-xs--letter-spacing: 0em;
  --text-ui-xs--font-weight: 500;

  --text-body-xl: round(calc(1.5rem * var(--ds-font-scale)), 1px);
  --text-body-xl--line-height: round(calc(2rem * var(--ds-font-scale)), 4px);
  --text-body-xl--letter-spacing: -0.015em;
  --text-body-xl--font-weight: 400;
  --text-body-lg: round(calc(1.125rem * var(--ds-font-scale)), 1px);
  --text-body-lg--line-height: round(calc(1.5rem * var(--ds-font-scale)), 4px);
  --text-body-lg--letter-spacing: -0.015em;
  --text-body-lg--font-weight: 400;
  --text-body-md: round(calc(1rem * var(--ds-font-scale)), 1px);
  --text-body-md--line-height: round(calc(1.5rem * var(--ds-font-scale)), 4px);
  --text-body-md--letter-spacing: -0.011em;
  --text-body-md--font-weight: 400;
  --text-body-sm: round(calc(0.875rem * var(--ds-font-scale)), 1px);
  --text-body-sm--line-height: round(calc(1.25rem * var(--ds-font-scale)), 4px);
  --text-body-sm--letter-spacing: -0.006em;
  --text-body-sm--font-weight: 400;
  --text-body-xs: round(calc(0.75rem * var(--ds-font-scale)), 1px);
  --text-body-xs--line-height: round(calc(1rem * var(--ds-font-scale)), 4px);
  --text-body-xs--letter-spacing: 0em;
  --text-body-xs--font-weight: 400;

  --text-overline-md: round(calc(1rem * var(--ds-font-scale)), 1px);
  --text-overline-md--line-height: round(calc(1.5rem * var(--ds-font-scale)), 4px);
  --text-overline-md--letter-spacing: 0em;
  --text-overline-md--font-weight: 500;
  --text-overline-sm: round(calc(0.875rem * var(--ds-font-scale)), 1px);
  --text-overline-sm--line-height: round(calc(1.25rem * var(--ds-font-scale)), 4px);
  --text-overline-sm--letter-spacing: 0em;
  --text-overline-sm--font-weight: 500;
  --text-overline-xs: round(calc(0.75rem * var(--ds-font-scale)), 1px);
  --text-overline-xs--line-height: round(calc(1rem * var(--ds-font-scale)), 4px);
  --text-overline-xs--letter-spacing: 0em;
  --text-overline-xs--font-weight: 500;
  --text-overline-2xs: round(calc(0.6875rem * var(--ds-font-scale)), 1px);
  --text-overline-2xs--line-height: round(calc(0.75rem * var(--ds-font-scale)), 4px);
  --text-overline-2xs--letter-spacing: 0em;
  --text-overline-2xs--font-weight: 500;

  /* ---------- radius (scales from one base value) ---------- */
  --radius-xs: var(--ds-radius-xs);
  --radius-sm: var(--ds-radius-sm);
  --radius-md: var(--ds-radius-md);
  --radius-lg: var(--ds-radius-lg);
  --radius-xl: var(--ds-radius-xl);
  --radius-2xl: var(--ds-radius-2xl);
  --radius-3xl: var(--ds-radius-3xl);
  --radius-button: var(--ds-radius-button);
  --radius-button-sm: var(--ds-radius-button-sm);

  /* ---------- elevation ---------- */
  --shadow-xs: var(--ds-shadow-xs);
  --shadow-field: var(--ds-shadow-field);
  --shadow-control: var(--ds-shadow-control);
  --shadow-button: var(--ds-shadow-button);
  --shadow-primary: var(--ds-shadow-primary);
  --shadow-inverse: var(--ds-shadow-inverse);
  --shadow-danger: var(--ds-shadow-danger);
  --shadow-badge: var(--ds-shadow-badge);
  --shadow-menu: var(--ds-shadow-menu);
  --shadow-sm: var(--ds-shadow-sm);
  --shadow-md: var(--ds-shadow-md);
  --shadow-lg: var(--ds-shadow-lg);
  --shadow-focus-primary: 0 0 0 2px var(--surface), 0 0 0 4px var(--primary-subtle-stronger);
  --shadow-focus: 0 0 0 2px var(--surface), 0 0 0 4px rgb(161 161 161 / 0.24);
  --shadow-focus-danger: 0 0 0 2px var(--surface), 0 0 0 4px rgb(251 44 54 / 0.24);

  --ease-tactile: cubic-bezier(0.23, 1, 0.32, 1);
  --animate-in: ds-in 160ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-menu-in: ds-menu-in 150ms cubic-bezier(0.23, 1, 0.32, 1);
  --animate-menu-out: ds-menu-out 120ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
  --animate-menu-fade-in: ds-fade 150ms ease-out;
  --animate-menu-fade-out: ds-fade-out 120ms ease-out forwards;
  --animate-accordion-down: ds-accordion-down 200ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-accordion-up: ds-accordion-up 160ms ease-out;
}

/*
 * Concentric radius: inner radius = outer radius − the padding between them.
 *   parent: rounded-parent-{size}  (sets its radius and exposes it as --radius-parent)
 *   child:  rounded-concentric-{n} (n = parent padding in spacing steps, e.g. p-2 → 2)
 * Clamped at 0 so tight paddings never go negative.
 */
@utility rounded-parent-* {
  border-radius: --value(--radius-*);
  --radius-parent: --value(--radius-*);
}
@utility rounded-concentric-* {
  border-radius: max(0px, calc(var(--radius-parent, 0px) - var(--spacing) * --value(integer)));
}

@keyframes ds-accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes ds-accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

@keyframes ds-fade {
  from {
    opacity: 0;
  }
}

@keyframes ds-fade-out {
  to {
    opacity: 0;
  }
}

@keyframes ds-menu-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
}

@keyframes ds-menu-out {
  to {
    opacity: 0;
    transform: scale(0.97);
  }
}

@keyframes ds-in {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
}

@layer base {
  *,
  ::before,
  ::after {
    border-color: var(--line);
  }
  html {
    color-scheme: light;
  }
  html.dark {
    color-scheme: dark;
  }
  body {
    background: var(--canvas);
    color: var(--fg);
    font-family: var(--ds-font-sans);
    font-feature-settings: "cv11", "ss01";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  /* Headings always use the display face. */
  [class*="text-heading-"] {
    font-family: var(--ds-font-display);
  }
  ::selection {
    background: var(--primary-subtle-stronger);
  }
}
```
