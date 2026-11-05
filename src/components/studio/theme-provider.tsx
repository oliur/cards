"use client";

import * as React from "react";
import {
  decodeConfig,
  defaultConfig,
  configId,
  encodeConfig,
  fontStylesheets,
  sanitizeConfig,
  type ThemeConfig,
} from "@/design-system/config";
import { generateThemeCss } from "@/design-system/tokens";

type Ctx = {
  config: ThemeConfig;
  update: (patch: Partial<ThemeConfig>) => void;
  reset: () => void;
  shareUrl: () => string;
  installCommand: () => string;
  skillCommand: () => string;
};

const ThemeContext = React.createContext<Ctx | null>(null);
const STORAGE_KEY = "cards:theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<ThemeConfig>(defaultConfig);
  const [ready, setReady] = React.useState(false);

  // Restore: share link (#t=…) wins over local storage.
  React.useEffect(() => {
    const fromHash = decodeConfig(new URLSearchParams(window.location.hash.slice(1)).get("t"));
    let stored: ThemeConfig | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      stored = raw ? sanitizeConfig(JSON.parse(raw)) : null;
    } catch {}
    const initial = fromHash ?? stored;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from browser-only storage
    if (initial) setConfig(initial);
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    document.documentElement.classList.toggle("dark", config.mode === "dark");
  }, [config, ready]);

  const value = React.useMemo<Ctx>(
    () => ({
      config,
      update: (patch) => setConfig((c) => ({ ...c, ...patch })),
      reset: () => setConfig({ ...defaultConfig, mode: config.mode }), // back to Inter, #335CFF, 10px
      shareUrl: () => `${window.location.origin}${window.location.pathname}#t=${encodeConfig(config)}`,
      installCommand: () => `npx shadcn@latest add ${window.location.origin}/r/${configId(config)}.json`,
      skillCommand: () => `mkdir -p .claude/skills/cards && curl -fsSL ${window.location.origin}/skill/${configId(config)}.md -o .claude/skills/cards/SKILL.md`,
    }),
    [config],
  );

  const css = React.useMemo(() => generateThemeCss(config), [config]);

  return (
    <ThemeContext.Provider value={value}>
      {/* Later in the document than the SSR defaults, so these win. */}
      <style id="ds-theme">{css}</style>
      {fontStylesheets(config).map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
