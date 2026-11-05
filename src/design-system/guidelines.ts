/**
 * The written half of the design system. The studio renders these on the site
 * and the prompt generator includes them verbatim, so the two never drift.
 * Edit this file to change the aesthetic's rules.
 */

export const systemName = "Cards";
export const repoUrl = "https://github.com/oliur/cards";
export const siteUrl = "https://cards.uidesigncourse.com";

export const aesthetic =
  "Quiet, precise and tactile, and card-based. Every screen is a very light grey canvas with content grouped into white cards; hairline strokes and generous whitespace do the rest, and color is reserved for intent (actions, status, focus) so it always means something. Depth comes from one crisp, small shadow rather than borders or heavy drop shadows. Typography does the heavy lifting: tight tracking, medium-weight labels and a clear size hierarchy.";

export const principles = [
  {
    title: "Neutral first, color with intent",
    body: "95% of any screen is neutral tokens (surface/canvas backgrounds, fg-* text, line-* strokes). Primary appears on the single most important action and on focus/selection. Status colors only communicate state, never decoration.",
  },
  {
    title: "Semantic tokens only",
    body: "Never use raw hex values or Tailwind's default palette. Use semantic tokens (bg-surface, text-fg-muted, ring-line). They flip automatically in dark mode.",
  },
  {
    title: "Cards on a canvas",
    body: "The page background is always bg-canvas (very light grey). All content lives in white cards: rounded-2xl bg-surface shadow-sm. Never put content directly on the canvas except page titles and section headings. Don't nest cards; divide a card's sections with full-bleed h-px bg-line dividers.",
  },
  {
    title: "One shadow, scaled",
    body: "Elevation is a single shadow scaled into a ladder: shadow-xs on resting inputs, shadow-sm on cards, shadow-md on floating layers (popovers, toasts), shadow-lg on dialogs. Buttons, badges and menus sit outside the ladder with their own crisp tokens: shadow-button, shadow-primary, shadow-inverse, shadow-danger, shadow-badge and shadow-menu, a fine ring and a tight drop in light mode, a solid 0.5px outline and a black drop in dark. Shadowed surfaces (cards, popovers, dialogs) get no border or ring: the shadow alone defines the edge, and a stroke on top of it reads as a muddy double edge. Rings are for controls (inputs, checkboxes) that carry no real shadow. Never invent new shadows.",
  },
  {
    title: "One radius, scaled",
    body: "Every corner derives from a single base radius. Buttons use their own tokens, rounded-button (medium) and rounded-button-sm (compact), which either follow the scale or are pills. Other controls use rounded-lg (base), compact controls rounded-md, small marks rounded-xs/sm, cards rounded-2xl, dialogs rounded-3xl. People (avatars) and toggles are always rounded-full.",
  },
  {
    title: "Higher is lighter in dark mode",
    body: "In dark mode elevation is shown with lightness, not shadow: the page is a dark grey, never black, cards are one shade lighter, and the further above the page something sits, the lighter its surface. Always pick the surface token for the element's height (canvas → surface → raised → floating; subtle for recessed wells) instead of reusing surface everywhere, and never hard-code dark colours. Dark strokes are translucent white so they read the same on every level.",
  },
  {
    title: "Concentric corners",
    body: "When a rounded element sits inside another with a small gap (segmented triggers in their tray, menu items in a popover, content hugging a card's corner), the inner radius is the outer radius minus the gap so both curves share a centre. Put rounded-parent-{size} on the container and rounded-concentric-{n} on the child, where n is the container's padding in spacing steps (p-2 → rounded-concentric-2). Never give a nested element the same radius as its container.",
  },
  {
    title: "Type tokens, not font utilities",
    body: "Set type with the named styles (text-heading-4, text-ui-sm, text-body-sm, text-overline-xs) which bundle size, line-height, tracking and weight. Do not combine them with font-size, leading, tracking or font-weight utilities. Never set words or sentences in full uppercase unless the user asks for it.",
  },
  {
    title: "One spacing unit",
    body: "Every padding, margin, gap, offset and size is a whole multiple of the spacing unit (4px by default; the density setting changes the unit and scales the type with it, so a whole UI gets denser or airier together): use whole Tailwind steps only (1 = one unit, 2 = two …) and never half steps (1.5, 2.5, 3.5) or arbitrary pixel values. Inside components 2–4 (8–16px); between related elements 4–6 (16–24px); card padding 5–6 (20–24px); between sections 8–12 (32–48px). Control heights: 40 / 36 / 32 / 28. Only 1–2px hairlines (borders, rings, underlines) sit off the grid.",
  },
  {
    title: "Hover shifts, press squeezes, focus sharpens",
    body: "Hover changes color only, one step, and nothing moves or grows. Buttons squeeze slightly when pressed. Buttons and select triggers show focus-visible with a 2px outline at a 2px offset (outline-line-focus); other controls add a 2px offset halo using the shadow-focus, shadow-focus-primary and shadow-focus-danger tokens. Every interactive element has both.",
  },
  {
    title: "Icons are line, 20px, muted",
    body: "Use Lucide icons at size-5 inside medium fields and size-4 in compact ones. Buttons and select triggers always use size-4 at a 1.5px rendered stroke. Icons default to text-fg-subtle and darken to text-fg-muted on interaction. Fill an icon with currentColor only for media controls and ratings. Lucide has no brand logos, so use inline SVGs from Simple Icons for those.",
  },
];

export const colorRules = [
  "Surfaces by height: bg-canvas (page) → bg-surface (cards, sidebars) → bg-raised (things sitting on a card, e.g. the selected segmented tab) → bg-floating (popovers, menus, dialogs). Recessed wells inside a card (code blocks) use bg-subtle; the tray behind segmented tabs uses bg-tray. Table header rows use bg-table-head: a faint well in light mode, lighter than the card in dark mode. Selected tabs rise a level: bg-raised + the system shadow (shadow-sm), no ring. Selected tiles also add a 1px ring-[rgb(0_0_0/0.5)] border in light mode, and a white one in dark mode (dark:ring-[rgb(255_255_255/0.5)] dark:shadow-control). Never a heavy solid outline. Hover and highlighted states use bg-hover, a translucent tint that darkens in light mode and lightens in dark mode on any level. Exception: anything with a border (form fields, select triggers, tiles, outline buttons) never goes gray on hover; they stay white with their shadow and only the border darkens (hover:ring-line-strong). Focused or open fields get ring-line-focus + the focus shadow. Text fields (inputs, textareas) use bg-field + shadow-field + ring-field-line: white with a border in light mode; in dark mode a shade darker than the card, with an inner shadow and no border. Select triggers and outline buttons are controls, not text fields: white buttons and select triggers use bg-control + shadow-button, white in light mode and a shade lighter than the card in dark mode. Gray fills on fields mean disabled. In light mode the levels are all white and depth comes from shadow; in dark mode each level up is lighter.",
  "Primary text: text-fg. Secondary text and descriptions: text-fg-muted. Placeholders, meta and icons: text-fg-subtle. Disabled: text-fg-disabled.",
  "Borders and dividers: line (default) or line-strong (controls that need more contrast). line-focus only for focused inputs.",
  "Inverted surfaces (tooltips, neutral buttons): bg-inverse with text-fg-inverse.",
  "Primary tints: bg-primary-subtle for selected rows, primary-subtle-strong and primary-subtle-stronger for focus halos.",
  "Status: use {state}-subtle backgrounds with {state} icons/text for inline messages; solid {state} fills only for small high-signal marks (badges, dots).",
  "Text on primary uses text-primary-foreground (automatically black or white for contrast).",
];

export const doAndDont = {
  do: [
    "Group related content in white Cards on the canvas (rounded-2xl, shadow-sm, no border) with a header row of icon-in-ring + title + description.",
    "Pair a label (text-ui-sm) with every input; put helper/error text below in text-body-xs.",
    "Use sentence case for all UI copy, including labels, badges, buttons and section eyebrows.",
    "Right-align primary actions in footers; neutral outline button for cancel, solid primary for confirm.",
    "Use dividers (h-px bg-line) to separate card sections instead of nested boxes.",
  ],
  dont: [
    "Never use full uppercase for words or sentences, by typing it or with the uppercase class or text-transform, unless the user asks for it. Acronyms, codes and initials (API, LAX, #FFFFFF) keep their normal form.",
    "Don't use more than one solid primary button per view.",
    "Don't use shadows larger than shadow-sm on in-flow content, or white backgrounds for the page itself.",
    "Don't mix arbitrary radii (rounded-[7px]) — use the scale.",
    "Don't use gradients, glows or saturated backgrounds for large areas.",
    "Don't use raw Tailwind colors (gray-500, blue-600) or hex values in components.",
  ],
};

/** Exact class recipes for the core components (mirrors src/components/ui). */
export const recipes: { name: string; notes?: string; code: string }[] = [
  {
    name: "Button",
    notes:
      "API: variant = primary | neutral | danger, mode = solid | outline | soft | ghost | raised, size = medium (h-9, h-11 on phones) | small (h-8) | xsmall (h-7) | xxsmall (h-6), flat = true for a button with no shadow or press squeeze. Built with cva + Radix Slot (asChild).",
    code: `base:    inline-flex items-center justify-center gap-1 whitespace-nowrap text-ui-sm outline-none
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
flat:            shadow-none active:scale-100; white buttons (primary and neutral outline and soft, danger outline, raised) add ring-1 ring-inset ring-line hover:ring-line-strong`,
  },
  {
    name: "Input",
    notes: "Wrapper div carries the styling; the <input> inside is transparent. Optional leading icon/trailing slot.",
    code: `wrapper: group flex h-9 max-md:h-11 w-full items-center gap-2 rounded-lg bg-field px-3 shadow-field ring-1 ring-inset ring-field-line transition
         hover:ring-line-strong (stays white with its shadow; only the border darkens)
         focus-within:shadow-focus focus-within:ring-line-focus
         [&_svg]:size-5 [&_svg]:text-fg-subtle
error:   ring-danger focus-within:shadow-focus-danger
input:   w-full bg-transparent text-body-sm text-fg outline-none placeholder:text-fg-subtle
label:   text-ui-sm text-fg   (optional hint suffix: text-body-sm text-fg-muted)
message: flex items-center gap-1 text-body-xs text-fg-muted [&_svg]:size-4`,
  },
  {
    name: "Select / Dropdown",
    notes: "Radix Select. The trigger is the white button, not a field. The menu opens from its trigger and is drawn with one crisp shadow.",
    code: `trigger: flex h-9 max-md:h-11 w-full items-center gap-2 rounded-lg bg-control px-3 text-body-sm text-fg shadow-button
         hover:bg-control-hover active:scale-[0.97] data-[state=open]:bg-control-hover
         focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-line-focus
         chevron: size-4 text-fg-subtle, turns over while open: group-data-[state=open]:rotate-180 duration-150 ease-tactile
menu (select, dropdown): rounded-parent-2xl bg-floating p-2 shadow-menu
         origin-(--radix-select-content-transform-origin) animate-menu-in data-[state=closed]:animate-menu-out
         (150ms in, 120ms out, from scale .97; reduced motion: motion-reduce:animate-menu-fade-in, fade only)
item:    flex items-center gap-2 rounded-concentric-2 p-2 text-body-sm text-fg-muted not-first:mt-1
         highlighted: bg-hover text-fg       chosen: bg-selected text-fg, no tick; a highlight stays a step below chosen
other floating layers (popover, combobox): rounded-parent-2xl bg-floating p-2 shadow-md
group label: px-2 py-1 text-overline-xs text-fg-subtle`,
  },
  {
    name: "Checkbox, Radio, Switch",
    code: `checkbox: size-4 rounded-xs bg-surface shadow-xs ring-1 ring-inset ring-line-strong
          checked: bg-primary ring-primary, white 1.6px check stroke
radio:    size-4 rounded-full (same states), checked: bg-primary with a size-2 white dot
switch:   track h-6 w-10 rounded-full bg-track p-1 → checked bg-switch-on (the primary, or a mid grey in dark mode when the primary is near-white, since the thumb is always white)
          thumb size-4 rounded-full bg-white shadow-sm, translate-x-4 when checked
all:      focus-visible:shadow-focus-primary; disabled: bg-track no ring/shadow`,
  },
  {
    name: "Accordion",
    notes: "Radix Accordion. Use type=\"multiple\" for settings panels, type=\"single\" collapsible for FAQs.",
    code: `item:    border-b border-line (none on the last item)
trigger: flex flex-1 items-center justify-between gap-2 py-4 text-ui-sm text-fg
         chevron ChevronDownIcon size-5 text-fg-subtle, rotates 180° when open
         row actions (e.g. Reset) sit beside the trigger, never inside it
content: pb-5, height animates open/closed (200ms ease-out-expo)`,
  },
  {
    name: "Tile group",
    notes: "Single-choice tiles (plans, layouts, swatches, options). Radix RadioGroup underneath, so arrow keys move the selection.",
    code: `group:   grid gap-2 (set columns per use)
tile:    flex flex-col items-center justify-center gap-2 rounded-parent-lg p-2 text-ui-xs text-fg-muted
         ring-1 ring-inset ring-line hover:ring-line-strong hover:text-fg (no gray fill)
selected: bg-raised text-fg shadow-sm ring-[rgb(0_0_0/0.5)] dark:ring-[rgb(255_255_255/0.5)] dark:shadow-control
inner content hugging the tile edge: rounded-concentric-2`,
  },
  {
    name: "Card",
    code: `page:    min-h-screen bg-canvas, cards laid out with gap-6 (24px)
card:    rounded-2xl bg-surface shadow-sm
header:  flex items-start gap-4 p-5
         icon: size-10 rounded-full ring-1 ring-inset ring-line text-fg-muted [&_svg]:size-5
         title: text-ui-md text-fg   description: text-body-sm text-fg-muted
divider: h-px bg-line (full-bleed between sections)
content: p-5        footer: flex items-center gap-3 px-5 py-4 (actions right-aligned)`,
  },
  {
    name: "Dialog",
    code: `overlay: fixed inset-0 bg-overlay backdrop-blur-[6px]
content: max-w-[440px] rounded-3xl bg-floating shadow-lg, enters with fade + 4px rise (160ms, ease-out-expo)
layout:  header (as Card header, title in text-ui-md) / body with border-t / footer with border-t, buttons right-aligned
close:   absolute top-4 right-4 size-6 rounded-md text-fg-muted hover:bg-hover`,
  },
  {
    name: "Tabs",
    code: `segmented: list rounded-parent-lg bg-tray p-1 gap-1; trigger h-7 flex-1 rounded-concentric-1 text-ui-sm text-fg-muted
           active: bg-raised text-fg shadow-sm
line:      list flex gap-6 border-b border-line; trigger h-12 text-ui-sm text-fg-muted
           active: text-fg with a 2px bg-primary bar on the bottom edge, icon turns text-primary`,
  },
  {
    name: "Badge & status",
    code: `badge:   inline-flex h-5 items-center gap-1 rounded-full px-2 text-ui-xs tabular-nums, in every size and at every radius
         soft (default): bg-{state}-subtle text-{state}-fg shadow-badge (its edge is drawn from its own text color)
         neutral soft: bg-control text-fg-muted shadow-button (never a grey fill)
         tint: bg-{state}-line text-{state}-fg     solid: bg-{state} text-white
         outline: bg-transparent ring-1 ring-inset ring-{state}-line text-{state}
status pill (tables): h-6 rounded-full bg-control px-2 text-ui-xs text-fg-muted shadow-button + size-2 dot in bg-{state}`,
  },
  {
    name: "Alert, Tooltip, Avatar",
    code: `alert:   flex items-start gap-3 rounded-xl p-4 bg-{state}-subtle, Ri*Fill icon size-5 text-{state},
         title text-ui-sm text-fg, body text-body-sm text-fg-muted
tooltip: rounded-md bg-inverse px-2 py-1 text-body-xs text-fg-inverse shadow-md
avatar:  rounded-full, sizes 24/32/40/48/64; fallback initials on bg-{state}-line text-{state}-fg
         groups overlap -space-x-2 with ring-2 ring-line-inverse`,
  },
];
