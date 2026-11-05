/**
 * The customizable surface of the design system.
 * Everything the studio lets people tweak lives in `ThemeConfig`;
 * everything else (spacing grid, type scale, state colors) is fixed by the system.
 */

export type NeutralName = "gray" | "slate" | "zinc" | "stone" | "tinted";
export type Mode = "light" | "dark";

export type ThemeConfig = {
  primary: string; // hex
  primaryDark: string | null; // hex for dark mode; null derives it from `primary`
  neutral: NeutralName;
  fontSans: string;
  fontDisplay: string;
  fontMono: string;
  headingWeight: number;
  radius: number; // px, the "base" radius used by buttons & inputs — always one of `radiusStops`
  buttonShape: ButtonShape; // buttons follow the radius, or are pills
  density: Density; // scales the spacing unit (paddings, margins, gaps, control heights) and the type scale with it
  shadow: ShadowConfig; // the card shadow; the rest of the elevation ladder scales from it
  mode: Mode;
};

/** The numbered radius stops offered in the studio (stop 1 = square … stop 7 = roundest). */
export const radiusStops = [0, 4, 6, 8, 10, 12, 16] as const;
export const radiusStopNumber = (px: number) => radiusStops.indexOf(px as (typeof radiusStops)[number]) + 1;

export type ButtonShape = "match" | "pill";

/**
 * Density presets. Each sets the spacing unit every Tailwind step multiplies, plus a gentler
 * matching type scale, so space and text always grow and shrink together.
 */
export const densities = [
  { id: "compact", label: "Compact", hint: "Dense data UIs", unit: 3, text: 0.875 },
  { id: "default", label: "Default", hint: "Balanced", unit: 4, text: 1 },
  { id: "relaxed", label: "Relaxed", hint: "More breathing room", unit: 4.5, text: 1.0625 },
  { id: "spacious", label: "Spacious", hint: "Marketing & content", unit: 5, text: 1.125 },
] as const;
export type Density = (typeof densities)[number]["id"];
const densityById = (d: Density) => densities.find((x) => x.id === d)!;
export const densityUnit = (d: Density) => densityById(d).unit;
export const textScale = (d: Density) => densityById(d).text;

export type ShadowConfig = {
  y: number; // px
  blur: number; // px
  spread: number; // px
  opacity: number; // 0–100, light mode
  opacityDark: number; // 0–100, dark mode: dark backgrounds need a much stronger shadow to register
  color: "neutral" | "primary";
};

// 0px 1px 2px rgba(0, 0, 0, 0.1)
export const defaultShadow: ShadowConfig = { y: 1, blur: 2, spread: 0, opacity: 10, opacityDark: 30, color: "neutral" };

export const defaultConfig: ThemeConfig = {
  primary: "#000000",
  primaryDark: null,
  neutral: "gray",
  fontSans: "Inter Variable",
  fontDisplay: "Inter Display",
  fontMono: "DM Mono",
  headingWeight: 500,
  radius: 8, // radius stop 4
  buttonShape: "match",
  density: "default",
  shadow: defaultShadow,
  mode: "light",
};

export type FontDef = {
  name: string;
  category: "sans" | "display" | "serif" | "mono";
  weights: number[];
  /** CSS family name when it differs from the display name. */
  css?: string;
  /** Where the font files come from (default: Google Fonts). */
  source?: "google" | "rsms";
};

export const RSMS_INTER_CSS = "https://rsms.me/inter/inter.css";

export const fonts: FontDef[] = [
  { name: "Inter Variable", category: "sans", weights: [400, 500, 600, 700], css: "InterVariable", source: "rsms" },
  { name: "Inter Display", category: "display", weights: [400, 500, 600, 700], css: "InterDisplay", source: "rsms" },
  { name: "Inter", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Geist", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Inter Tight", category: "sans", weights: [400, 500, 600, 700] },
  { name: "DM Sans", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Manrope", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Plus Jakarta Sans", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Figtree", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Outfit", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Instrument Sans", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Onest", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Space Grotesk", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Bricolage Grotesque", category: "sans", weights: [400, 500, 600, 700] },
  { name: "IBM Plex Sans", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Public Sans", category: "sans", weights: [400, 500, 600, 700] },
  { name: "Instrument Serif", category: "serif", weights: [400] },
  { name: "Fraunces", category: "serif", weights: [400, 500, 600, 700] },
  { name: "Newsreader", category: "serif", weights: [400, 500, 600, 700] },
  { name: "Playfair Display", category: "serif", weights: [400, 500, 600, 700] },
  { name: "JetBrains Mono", category: "mono", weights: [400, 500, 600] },
  { name: "IBM Plex Mono", category: "mono", weights: [400, 500, 600] },
  { name: "Fira Code", category: "mono", weights: [400, 500, 600] },
  { name: "DM Mono", category: "mono", weights: [400, 500] },
];

export const fontByName = (name: string) =>
  fonts.find((f) => f.name === name) ?? fonts[0];

/** Clamp a heading weight to one the display font actually ships. */
export function resolveHeadingWeight(config: ThemeConfig) {
  const { weights } = fontByName(config.fontDisplay);
  return weights.reduce((best, w) =>
    Math.abs(w - config.headingWeight) < Math.abs(best - config.headingWeight) ? w : best,
  );
}

/** Stylesheets needed to load the configured fonts (Google Fonts and/or rsms.me for Inter). */
export function fontStylesheets(config: ThemeConfig): string[] {
  const defs = Array.from(new Set([config.fontSans, config.fontDisplay, config.fontMono])).map(fontByName);
  const google = defs.filter((d) => (d.source ?? "google") === "google");
  const hrefs: string[] = [];
  if (defs.some((d) => d.source === "rsms")) hrefs.push(RSMS_INTER_CSS);
  if (google.length) {
    const families = google.map((d) => `family=${d.name.replace(/ /g, "+")}:wght@${d.weights.join(";")}`);
    hrefs.push(`https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`);
  }
  return hrefs;
}

export const cssFamily = (name: string) => fontByName(name).css ?? name;

/* ---------- (de)serialisation for share links ---------- */

export function encodeConfig(config: ThemeConfig) {
  return btoa(JSON.stringify(config));
}

export function decodeConfig(raw: string | null | undefined): ThemeConfig | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(atob(raw));
    return sanitizeConfig(parsed);
  } catch {
    return null;
  }
}

/** URL-path-safe version of encodeConfig, for /r/<id>.json and /skill/<id>.md. */
export function configId(config: ThemeConfig) {
  return encodeConfig(config).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Reads an id from configId, or the name of the default system. */
export function configFromId(id: string): ThemeConfig | null {
  if (id === "cards") return defaultConfig;
  return decodeConfig(id.replace(/-/g, "+").replace(/_/g, "/"));
}

export function sanitizeConfig(input: unknown): ThemeConfig {
  const c = (input ?? {}) as Partial<ThemeConfig>;
  const isHex = (v: unknown): v is string => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
  const isFont = (v: unknown): v is string => typeof v === "string" && fonts.some((f) => f.name === v);
  return {
    primary: isHex(c.primary) ? c.primary : defaultConfig.primary,
    primaryDark: isHex(c.primaryDark) ? c.primaryDark : null,
    neutral: (["gray", "slate", "zinc", "stone", "tinted"] as const).includes(c.neutral as NeutralName)
      ? (c.neutral as NeutralName)
      : defaultConfig.neutral,
    fontSans: isFont(c.fontSans) ? c.fontSans : defaultConfig.fontSans,
    fontDisplay: isFont(c.fontDisplay) ? c.fontDisplay : defaultConfig.fontDisplay,
    fontMono: isFont(c.fontMono) ? c.fontMono : defaultConfig.fontMono,
    headingWeight: [400, 500, 600, 700].includes(c.headingWeight as number)
      ? (c.headingWeight as number)
      : defaultConfig.headingWeight,
    // snap anything else (old saved values, hand-edited links) to the nearest stop
    radius:
      typeof c.radius === "number"
        ? radiusStops.reduce((best, r) => (Math.abs(r - c.radius!) < Math.abs(best - c.radius!) ? r : best), radiusStops[0])
        : defaultConfig.radius,
    buttonShape: c.buttonShape === "pill" ? "pill" : "match",
    density: densities.some((d) => d.id === c.density) ? (c.density as Density) : defaultConfig.density,
    shadow: sanitizeShadow(c.shadow),
    mode: c.mode === "dark" ? "dark" : "light",
  };
}

function sanitizeShadow(input: unknown): ShadowConfig {
  const s = (input ?? {}) as Partial<ShadowConfig>;
  const num = (v: unknown, min: number, max: number, fallback: number) =>
    typeof v === "number" && v >= min && v <= max ? v : fallback;
  const opacity = num(s.opacity, 0, 40, defaultShadow.opacity);
  return {
    y: num(s.y, 0, 16, defaultShadow.y),
    blur: num(s.blur, 0, 32, defaultShadow.blur),
    spread: num(s.spread, -8, 8, defaultShadow.spread),
    opacity,
    // configs saved before this setting existed used three times the light opacity
    opacityDark: num(s.opacityDark, 0, 100, Math.min(100, opacity * 3)),
    color: s.color === "primary" ? "primary" : "neutral",
  };
}
