import { converter, formatHex, interpolate, wcagContrast, parse } from "culori";
import { cssFamily, defaultConfig, densityUnit, radiusStops, resolveHeadingWeight, textScale, type Mode, type ThemeConfig, type NeutralName } from "./config";

const toOklch = converter("oklch");

/** `amount` of the way from one color to another: hover states move a fill toward its own text color. */
const mix = (from: string, to: string, amount: number) => formatHex(interpolate([from, to], "rgb")(amount)).toUpperCase();

export const scaleSteps = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof scaleSteps)[number];
export type Scale = Record<Step, string>;

// Neutral ramps from the Tailwind CSS v4 default palette (MIT), converted from
// oklch to hex, with pure white prepended as step 0. "gray" uses Tailwind's
// `neutral` family so it stays perfectly hue-free.
const fixedNeutrals: Record<Exclude<NeutralName, "tinted">, string[]> = {
  gray: ["#FFFFFF", "#FAFAFA", "#F5F5F5", "#E5E5E5", "#D4D4D4", "#A1A1A1", "#737373", "#525252", "#404040", "#262626", "#171717", "#0A0A0A"],
  slate: ["#FFFFFF", "#F8FAFC", "#F1F5F9", "#E2E8F0", "#CAD5E2", "#90A1B9", "#62748E", "#45556C", "#314158", "#1D293D", "#0F172B", "#020618"],
  zinc: ["#FFFFFF", "#FAFAFA", "#F4F4F5", "#E4E4E7", "#D4D4D8", "#9F9FA9", "#71717B", "#52525C", "#3F3F46", "#27272A", "#18181B", "#09090B"],
  stone: ["#FFFFFF", "#FAFAF9", "#F5F5F4", "#E7E5E4", "#D6D3D1", "#A6A09B", "#79716B", "#57534D", "#44403B", "#292524", "#1C1917", "#0C0A09"],
};

const toScale = (values: string[]): Scale =>
  Object.fromEntries(scaleSteps.map((s, i) => [s, values[i]])) as Scale;

/** A neutral scale that carries a whisper of the primary hue. */
function tintedNeutral(primary: string): Scale {
  const hue = toOklch(parse(primary))?.h ?? 260;
  const lightness = [1, 0.982, 0.97, 0.935, 0.87, 0.72, 0.58, 0.47, 0.33, 0.27, 0.21, 0.17];
  const chroma = [0, 0.004, 0.006, 0.01, 0.014, 0.02, 0.022, 0.024, 0.02, 0.018, 0.016, 0.014];
  return toScale(lightness.map((l, i) => formatHex({ mode: "oklch", l, c: chroma[i], h: hue }).toUpperCase()));
}

/** The primary a mode is built from, before any automatic adjustment. */
export const primaryBase = (config: ThemeConfig, mode: Mode) =>
  mode === "dark" ? (config.primaryDark ?? config.primary) : config.primary;

export function neutralScale(config: ThemeConfig, mode: Mode = "light"): Scale {
  return config.neutral === "tinted" ? tintedNeutral(primaryBase(config, mode)) : toScale(fixedNeutrals[config.neutral]);
}

/** The primary a mode actually renders with. Only a derived dark primary is adjusted; a chosen one is used as is. */
export function primaryFor(config: ThemeConfig, mode: Mode) {
  const primary = formatHex(parse(primaryBase(config, mode))!).toUpperCase();
  if (mode === "light" || config.primaryDark) return primary;
  // A very dark primary (e.g. ink) disappears on dark surfaces: flip it to near-white.
  const n = neutralScale(config, mode);
  return wcagContrast(primary, n[950]) < 2.4 ? shift(n[0], -0.04) : primary;
}

/** 50–950 ramp where 500 is exactly the chosen color. */
export function primaryScale(primary: string): Record<Exclude<Step, 0>, string> {
  const base = toOklch(parse(primary))!;
  const h = base.h ?? 0;
  const c = base.c;
  const L = base.l;
  const light = [0.975, 0.945, 0.9, 0.83, 0.74]; // 50–400
  const dark = [0.82, 0.66, 0.52, 0.42, 0.34]; // 600–950 as multipliers of L
  const out: Partial<Record<Step, string>> = {};
  [50, 100, 200, 300, 400].forEach((s, i) => {
    const l = Math.max(light[i], L + (1 - L) * (1 - i / 5) * 0.2);
    out[s as Step] = formatHex({ mode: "oklch", l, c: c * (0.12 + i * 0.2), h }).toUpperCase();
  });
  out[500] = formatHex(parse(primary)!).toUpperCase();
  [600, 700, 800, 900, 950].forEach((s, i) => {
    out[s as Step] = formatHex({ mode: "oklch", l: L * dark[i], c: c * (0.95 - i * 0.12), h }).toUpperCase();
  });
  return out as Record<Exclude<Step, 0>, string>;
}

const shift = (hex: string, dl: number) => {
  const c = toOklch(parse(hex))!;
  return formatHex({ ...c, l: Math.min(1, Math.max(0, c.l + dl)) }).toUpperCase();
};

/** How far the dark-mode levels above the page start from the neutral 900 step, in oklch lightness. */
const DARK_LEVEL_BASE = 0.03;

/** Opacity of white used for dark-mode borders: `line` and the edge of raised surfaces. */
const DARK_LINE_ALPHA = 0.07;

/** The solid colour white at opacity `a` produces on top of `hex`. */
const overlayWhite = (hex: string, a: number) => {
  const { r, g, b } = converter("rgb")(parse(hex)!);
  return formatHex({ mode: "rgb", r: r + (1 - r) * a, g: g + (1 - g) * a, b: b + (1 - b) * a }).toUpperCase();
};

const alpha = (hex: string, a: number) => {
  const c = parse(hex)!;
  const { r, g, b } = converter("rgb")(c);
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${a})`;
};

/**
 * State color ramps, taken from the Tailwind CSS v4 default palette (MIT) and
 * converted from oklch to hex. Per family: base = the color itself (500, or 400
 * for caution), fg = strong text on the subtle tint (900), line = border (200),
 * subtle = tinted background (50).
 */
export const stateColors = {
  danger: { fg: "#82181A", base: "#FB2C36", line: "#FFC9C9", subtle: "#FEF2F2" }, // red
  warning: { fg: "#7E2A0C", base: "#FF6900", line: "#FFD6A7", subtle: "#FFF7ED" }, // orange
  success: { fg: "#0D542B", base: "#00C950", line: "#B9F8CF", subtle: "#F0FDF4" }, // green
  info: { fg: "#1C398E", base: "#2B7FFF", line: "#BEDBFF", subtle: "#EFF6FF" }, // blue
  highlight: { fg: "#4D179A", base: "#8E51FF", line: "#DDD6FF", subtle: "#F5F3FF" }, // violet
  caution: { fg: "#7B3306", base: "#FFB900", line: "#FEE685", subtle: "#FFFBEB" }, // amber
} as const;
export type StateName = keyof typeof stateColors | "neutral";

/** Semantic token → value, for one mode. */
export type TokenMap = Record<string, string>;

export function semanticTokens(config: ThemeConfig, mode: "light" | "dark"): TokenMap {
  const n = neutralScale(config, mode);
  const light = mode === "light";
  const pick = (lightStep: Step, darkStep: Step) => n[light ? lightStep : darkStep];

  const primary = primaryFor(config, mode);
  const onPrimary = wcagContrast(primary, "#FFFFFF") >= 3 ? "#FFFFFF" : n[950];
  const L = toOklch(parse(primary))!.l;
  const hoverDir = light ? (L < 0.3 ? 1 : -1) : L > 0.85 ? -1 : 1;

  const t: TokenMap = {
    // backgrounds. Light: canvas grey, cards white, wells a touch darker.
    // Dark: lightness = elevation. The canvas is a dark grey (never black) and each level up is
    // one shade lighter; wells and trays sit between the canvas and the card they're recessed into.
    "canvas": light ? n[100] : n[900],
    "inverse": pick(950, 0),
    "inverse-hover": mix(pick(950, 0), pick(0, 950), 0.07),
    "track-strong": pick(300, 600),
    "track": pick(200, 700),
    "subtle": light ? n[50] : shift(n[900], DARK_LEVEL_BASE + 0.01),
    // The well behind segmented tabs: clearly darker than the card in both modes, so the raised tab stands out.
    "tray": light ? n[200] : n[900],
    "surface": light ? n[0] : shift(n[900], DARK_LEVEL_BASE + 0.03),
    // higher levels: still white in light mode, progressively lighter in dark mode
    "raised": light ? n[0] : shift(n[900], DARK_LEVEL_BASE + 0.06),
    "floating": light ? n[0] : shift(n[900], DARK_LEVEL_BASE + 0.09),
    // text fields: white in light mode; in dark mode a borderless well, darker than the card it's cut into.
    "field": light ? n[0] : shift(n[900], DARK_LEVEL_BASE),
    // controls that sit on a card (select triggers, outline and raised buttons): white in light mode,
    // a shade lighter than the card in dark mode.
    "control": light ? n[0] : shift(n[900], DARK_LEVEL_BASE + 0.06),
    "control-hover": light ? n[50] : shift(n[900], DARK_LEVEL_BASE + 0.09),
    "field-line": light ? n[200] : "transparent",
    // table header row: a faint well on white cards in light mode, a step lighter than the card in dark mode
    "table-head": light ? n[50] : shift(n[900], DARK_LEVEL_BASE + 0.06),
    // hover tint works on every level: darkens in light mode, lightens in dark mode
    "hover": light ? alpha(n[950], 0.04) : alpha(n[0], 0.06),
    // the chosen item in a menu: one step past hover, so a highlight never matches it
    "selected": light ? alpha(n[950], 0.08) : alpha(n[0], 0.12),
    // text
    "fg": pick(950, 0),
    "fg-muted": pick(600, 400),
    "fg-subtle": pick(400, 500),
    "fg-disabled": pick(300, 600),
    "fg-inverse": pick(0, 950),
    // strokes — translucent white in dark mode so they read the same on every surface
    "line-focus": pick(950, 0),
    "line-strong": light ? n[300] : alpha(n[0], 0.18),
    "line": light ? n[200] : alpha(n[0], DARK_LINE_ALPHA),
    "line-inverse": light ? n[0] : shift(n[900], DARK_LEVEL_BASE + 0.03), // matches the card surface
    // primary
    "primary": primary,
    // hover moves toward the primary's own text color, so it works on a fill of any lightness
    "primary-hover": mix(primary, onPrimary, 0.07),
    // pressed moves away from the background; near-black primaries lighten instead
    "primary-active": shift(primary, hoverDir * 0.14),
    "primary-foreground": onPrimary,
    // the "on" track of a switch. Its thumb is always white, so a near-white dark-mode primary
    // can't fill it: it falls back to a grey that's still clearly lighter than the off track.
    "switch-on": !light && L > 0.85 ? n[500] : primary,
    "switch-on-hover": !light && L > 0.85 ? shift(n[500], 0.07) : shift(primary, hoverDir * 0.07),
    "primary-subtle-stronger": alpha(primary, 0.24),
    "primary-subtle-strong": alpha(primary, 0.16),
    "primary-subtle": alpha(primary, 0.1),
    // static
    "black": "#0A0A0A",
    "white": "#FFFFFF",
    // the neutral state family is derived from the neutral ramp
    "neutral-fg": pick(800, 200),
    "neutral": n[500],
    "neutral-line": pick(200, 700),
    "neutral-subtle": light ? n[100] : alpha(n[0], 0.1), // translucent so it shows on every dark level, like the other state tints
    // overlays
    "overlay": light ? alpha(n[950], 0.24) : alpha("#000000", 0.6),
  };

  for (const [name, c] of Object.entries(stateColors)) {
    t[name] = c.base;
    t[`${name}-fg`] = light ? c.fg : c.line;
    t[`${name}-line`] = light ? c.line : alpha(c.base, 0.24);
    t[`${name}-subtle`] = light ? c.subtle : alpha(c.base, 0.16);
  }

  Object.assign(t, shadowTokens(config, mode, t));

  // shadcn/ui bridge, so any shadcn component dropped in inherits the system.
  // Each name keeps shadcn's meaning: `background` is what stock components paint themselves with
  // (outline buttons, dialogs, active tabs), so it's the white surface; the grey page is `canvas`.
  // `muted` is a recessed tray and `accent` is the hover tint for borderless items.
  Object.assign(t, {
    background: t["canvas"],
    foreground: t["fg"],
    card: t["surface"],
    "card-foreground": t["fg"],
    popover: t["floating"],
    "popover-foreground": t["fg"],
    secondary: t["subtle"],
    "secondary-foreground": t["fg"],
    "muted-foreground": t["fg-muted"],
    muted: t["subtle"],
    accent: t["hover"],
    "accent-foreground": t["fg"],
    destructive: t["danger"],
    "destructive-foreground": t["white"],
    border: t["line"],
    input: t["line"],
    ring: t["primary"],
    "chart-1": t["info"],
    "chart-2": t["success"],
    "chart-3": t["warning"],
    "chart-4": t["highlight"],
    "chart-5": t["danger"],
    sidebar: t["surface"],
    "sidebar-foreground": t["fg"],
    "sidebar-primary": t["primary"],
    "sidebar-primary-foreground": t["primary-foreground"],
    "sidebar-accent": t["hover"],
    "sidebar-accent-foreground": t["fg"],
    "sidebar-border": t["line"],
    "sidebar-ring": t["primary"],
  });

  return t;
}

/** Elevation ladder, scaled from the one card shadow the user edits. */
export const shadowLevels = [
  { name: "xs", k: 0.5, use: "Resting inputs" },
  { name: "sm", k: 1, use: "Cards — the shadow you edit" },
  { name: "md", k: 4, use: "Popovers, tooltips, toasts" },
  { name: "lg", k: 8, use: "Dialogs and sheets" },
] as const;

export function shadowValue(config: ThemeConfig, mode: "light" | "dark", k: number) {
  const { y, blur, spread, opacity, opacityDark, color } = config.shadow;
  const base = color === "primary" ? primaryBase(config, mode) : "#000000";
  const a = Math.min(0.8, ((mode === "dark" ? opacityDark : opacity) / 100) * (1 + 0.25 * (k - 1)));
  const px = (v: number) => `${Math.round(v * k * 2) / 2}px`;
  if (a <= 0 || (y === 0 && blur === 0 && spread <= 0)) return "0 0 0 0 #0000";
  return `0 ${px(y)} ${px(blur)} ${px(spread)} ${alpha(base, Number(a.toFixed(3)))}`;
}

function shadowTokens(config: ThemeConfig, mode: "light" | "dark", surfaces: TokenMap): TokenMap {
  const t: TokenMap = {};
  for (const l of shadowLevels) t[`ds-shadow-${l.name}`] = shadowValue(config, mode, l.k);
  // Text fields have no border in dark mode: an inner shadow makes them read as wells cut into the card.
  t["ds-shadow-field"] = mode === "light" ? t["ds-shadow-xs"] : `inset ${shadowValue(config, mode, 1)}`;
  // Controls that still carry a border get a subtle drop shadow in dark mode, without the light edge cards carry.
  t["ds-shadow-control"] = mode === "light" ? t["ds-shadow-xs"] : shadowValue(config, mode, 1);
  Object.assign(t, tactileShadows(config, mode, surfaces));
  if (mode === "light") {
    // Dialogs keep a hairline in light mode, so they still read when shadows are set flat.
    t["ds-shadow-lg"] += ", 0 0 0 1px rgb(14 18 27 / 0.04)";
    return t;
  }
  // Shadows barely register on dark backgrounds, so dark-mode surfaces carry a light edge. It sits
  // outside the element, over the darker page, so a translucent white would come out dimmer than the
  // `line` dividers inside it. Solving it against the element's own surface makes the two identical.
  // It goes first so the drop shadow doesn't paint over it.
  const edges = { sm: surfaces["surface"], md: surfaces["floating"], lg: surfaces["floating"] };
  for (const [level, surface] of Object.entries(edges)) {
    t[`ds-shadow-${level}`] = `0 0 0 1px ${overlayWhite(surface, DARK_LINE_ALPHA)}, ${t[`ds-shadow-${level}`]}`;
  }
  return t;
}

/**
 * Buttons, badges and menus: crisp edges and tight drops, fixed rather than scaled from the card shadow.
 * Light: a translucent ring and a 1px drop in the neutral ink, so they darken whatever is beneath.
 * Dark: a solid 0.5px outline a few steps above the fill and a black drop, because a light shadow reads as a glow.
 */
function tactileShadows(config: ThemeConfig, mode: "light" | "dark", surfaces: TokenMap): TokenMap {
  const n = neutralScale(config, mode);
  if (mode === "light") {
    const ink = n[950];
    const ring = `0 0 0 1px ${alpha(ink, 0.08)}`;
    const drop = `0 1px 2px 0 ${alpha(ink, 0.12)}`;
    // A solid button: a lit line along its top edge, a ring in its own fill, and a tight drop plus a short one.
    const solid = (fill: string) => `inset 0 1px 0 0 rgb(255 255 255 / 0.16), 0 0 0 1px ${fill}, 0 1px 2px 0 ${alpha(ink, 0.24)}, 0 3px 6px -2px ${alpha(ink, 0.2)}`;
    return {
      "ds-shadow-button": `${ring}, ${drop}`,
      "ds-shadow-primary": solid(surfaces["primary"]),
      "ds-shadow-inverse": solid(surfaces["inverse"]),
      "ds-shadow-danger": solid(surfaces["danger"]),
      "ds-shadow-badge": "0 0 0 1px color-mix(in srgb, currentColor 14%, transparent), 0 1px 2px 0 color-mix(in srgb, currentColor 16%, transparent)",
      "ds-shadow-menu": `${ring}, ${drop}, 0 4px 8px -4px ${alpha(ink, 0.16)}`,
    };
  }
  const drop = "0 1px 2px 0 rgb(0 0 0 / 0.5)";
  const edge = shift(n[900], DARK_LEVEL_BASE + 0.15);
  return {
    "ds-shadow-button": `0 0 0 0.5px ${edge}, ${drop}`,
    "ds-shadow-primary": `0 0 0 0.5px ${surfaces["primary"]}, ${drop}`,
    "ds-shadow-inverse": `0 0 0 0.5px ${surfaces["inverse"]}, ${drop}`,
    "ds-shadow-danger": `0 0 0 0.5px ${surfaces["danger"]}, ${drop}`,
    "ds-shadow-badge": `0 0 0 0.5px color-mix(in srgb, currentColor 34%, #000), ${drop}`,
    "ds-shadow-menu": `0 0 0 0.5px ${edge}, ${drop}, 0 4px 8px -4px rgb(0 0 0 / 0.5)`,
  };
}

export function radiusScale(r: number) {
  const s = (m: number) => `${Math.round(r * m)}px`;
  return { xs: s(0.4), sm: s(0.6), md: s(0.8), lg: s(1), xl: s(1.2), "2xl": s(1.6), "3xl": s(2.4) };
}

export function staticTokens(config: ThemeConfig): TokenMap {
  const n = neutralScale(config);
  const p = primaryScale(config.primary);
  const t: TokenMap = {};
  for (const s of scaleSteps) t[`neutral-${s}`] = n[s];
  for (const [s, v] of Object.entries(p)) t[`primary-${s}`] = v;
  const fallback = (name: string, kind: "sans" | "mono" | "serif") =>
    `"${cssFamily(name)}", ${/^Inter /.test(name) ? '"Inter", ' : ""}${kind === "mono" ? "ui-monospace, monospace" : kind === "serif" ? "ui-serif, Georgia, serif" : "ui-sans-serif, system-ui, sans-serif"}`;
  t["ds-font-sans"] = fallback(config.fontSans, "sans");
  t["ds-font-display"] = fallback(config.fontDisplay, /Serif|Fraunces|Newsreader|Playfair/.test(config.fontDisplay) ? "serif" : "sans");
  t["ds-font-mono"] = fallback(config.fontMono, "mono");
  t["ds-heading-weight"] = String(resolveHeadingWeight(config));
  t["ds-spacing"] = `${densityUnit(config.density)}px`;
  t["ds-font-scale"] = String(textScale(config.density));
  const radii = radiusScale(config.radius);
  for (const [k, v] of Object.entries(radii)) t[`ds-radius-${k}`] = v;
  // buttons: medium follows rounded-lg, compact sizes rounded-md — unless they're pills
  t["ds-radius-button"] = config.buttonShape === "pill" ? "9999px" : radii.lg;
  t["ds-radius-button-sm"] = config.buttonShape === "pill" ? "9999px" : radii.md;
  return t;
}

const block = (selector: string, tokens: TokenMap) =>
  `${selector} {\n${Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n")}\n}`;

/** The full runtime stylesheet: raw palette + semantic tokens for both modes. */
/**
 * Studio chrome (the customizer sidebar and its popovers) is pinned to the default
 * design, at radius stop 4, so it stays stable while people edit; it only follows light/dark mode.
 */
export const CHROME_CLASS = "ds-chrome";

const chromeConfig: ThemeConfig = { ...defaultConfig, radius: radiusStops[3] }; // radius stop 4

export function generateChromeCss() {
  const light = { ...staticTokens(chromeConfig), ...semanticTokens(chromeConfig, "light") };
  return [
    block(`.${CHROME_CLASS}`, light).replace(/\n}$/, "\n  font-family: var(--ds-font-sans);\n  color: var(--fg);\n}"),
    block(`.dark .${CHROME_CLASS}`, semanticTokens(chromeConfig, "dark")),
  ].join("\n\n");
}

export function generateThemeCss(config: ThemeConfig) {
  return [
    block(":root", { ...staticTokens(config), ...semanticTokens(config, "light") }),
    block(".dark", { ...primaryRamp(config.primaryDark), ...semanticTokens(config, "dark") }),
  ].join("\n\n");
}

/** Raw primary-50…950 steps for a dark primary that was chosen separately. */
export function primaryRamp(primary: string | null): TokenMap {
  if (!primary) return {};
  return Object.fromEntries(Object.entries(primaryScale(primary)).map(([s, v]) => [`primary-${s}`, v]));
}
