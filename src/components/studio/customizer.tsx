"use client";

import * as React from "react";
import { MoonIcon, RefreshCwIcon, SunIcon } from "lucide-react";
import { defaultShadow, densities, fontByName, fonts, radiusStops, type Density, type FontDef, type NeutralName, type ShadowConfig, type ThemeConfig } from "@/design-system/config";
import { CHROME_CLASS, neutralScale, primaryFor, semanticTokens, shadowValue } from "@/design-system/tokens";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ColorField } from "@/components/ui/color-picker";
import { Tile, TileGroup } from "@/components/ui/tile-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, SegmentedList, SegmentedTrigger } from "@/components/ui/tabs";
import { useTheme } from "./theme-provider";

const slug = (t: string) => t.toLowerCase().replace(/\s+/g, "-");

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <AccordionItem value={slug(title)} className="px-5">
      <AccordionTrigger action={action}>{title}</AccordionTrigger>
      <AccordionContent className="space-y-3">{children}</AccordionContent>
    </AccordionItem>
  );
}

export function Customizer() {
  const { config, update, reset } = useTheme();
  const displayWeights = fontByName(config.fontDisplay).weights;

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-5 py-4">
        <h2 className="text-ui-md text-fg">Customize</h2>
        <Button variant="neutral" mode="ghost" size="xxsmall" onClick={reset}>
          <RefreshCwIcon /> Reset
        </Button>
      </div>

      {/* Mode is always visible — it's a viewing choice, not a design setting to tuck away. */}
      <div className="space-y-3 border-b border-line px-5 py-4">
        <h3 className="text-ui-sm text-fg">Mode</h3>
        <Tabs value={config.mode} onValueChange={(v) => update({ mode: v as ThemeConfig["mode"] })}>
          <SegmentedList>
            <SegmentedTrigger value="light"><SunIcon /> Light</SegmentedTrigger>
            <SegmentedTrigger value="dark"><MoonIcon /> Dark</SegmentedTrigger>
          </SegmentedList>
        </Tabs>
      </div>

      <Accordion type="multiple" defaultValue={["typography", "primary-color"]}>

      <Section title="Typography">
        <div className="space-y-3">
          <FontSelect label="Interface" value={config.fontSans} onChange={(v) => update({ fontSans: v })} categories={["sans"]} />
          <FontSelect label="Headings" value={config.fontDisplay} onChange={(v) => update({ fontDisplay: v })} categories={["display", "sans", "serif"]} />
          <FontSelect label="Mono" value={config.fontMono} onChange={(v) => update({ fontMono: v })} categories={["mono"]} />
          <div className="space-y-2">
            <Label>Heading weight</Label>
            <Tabs value={String(config.headingWeight)} onValueChange={(v) => update({ headingWeight: Number(v) })}>
              <SegmentedList>
                {[400, 500, 600, 700].map((w) => (
                  <SegmentedTrigger key={w} value={String(w)} disabled={!displayWeights.includes(w)} className="disabled:opacity-40">
                    {w}
                  </SegmentedTrigger>
                ))}
              </SegmentedList>
            </Tabs>
          </div>
        </div>
      </Section>

      <Section
        title="Primary color"
        action={
          config.primaryDark && (
            <Button variant="neutral" mode="ghost" size="xxsmall" onClick={() => update({ primaryDark: null })}>
              Reset dark
            </Button>
          )
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Light</Label>
            <ColorField value={primaryFor(config, "light")} onChange={(primary) => update({ primary })} aria-label="Primary color in light mode" contentClassName={CHROME_CLASS} />
          </div>
          <div className="space-y-2">
            <Label>Dark</Label>
            <ColorField value={primaryFor(config, "dark")} onChange={(primaryDark) => update({ primaryDark })} aria-label="Primary color in dark mode" contentClassName={CHROME_CLASS} />
          </div>
        </div>
      </Section>

      <Section title="Neutrals">
        <TileGroup value={config.neutral} onValueChange={(v) => update({ neutral: v as NeutralName })} aria-label="Neutrals" className="grid-cols-5">
          {(["gray", "slate", "zinc", "stone", "tinted"] as NeutralName[]).map((n) => {
            const s = neutralScale({ ...config, neutral: n }, config.mode);
            return (
              // 1px of padding keeps the tile's outline visible around the swatch, so selection still shows.
              <Tile key={n} value={n} className="justify-start gap-1 p-px pb-1 capitalize">
                <span className="h-5 w-full rounded-t-[calc(var(--radius-parent)-1px)]" style={{ background: s[500] }} />
                {n}
              </Tile>
            );
          })}
        </TileGroup>
      </Section>

      <Section title="Radius">
        <TileGroup value={String(config.radius)} onValueChange={(v) => update({ radius: Number(v) })} aria-label="Radius" className="grid-cols-7 gap-1">
          {radiusStops.map((r, i) => (
            <Tile key={r} value={String(r)} aria-label={`Radius ${i + 1}`} className="group/tile h-14 rounded-parent-md">
              <span
                className="size-4 border-t-2 border-l-2 border-line-strong group-data-[state=checked]/tile:border-line-focus"
                style={{ borderTopLeftRadius: r }}
              />
              {i + 1}
            </Tile>
          ))}
        </TileGroup>
        <div className="space-y-2 pt-1">
          <Label>Buttons</Label>
          <Tabs value={config.buttonShape} onValueChange={(v) => update({ buttonShape: v as ThemeConfig["buttonShape"] })}>
            <SegmentedList>
              <SegmentedTrigger value="match">
                <span className="size-3 rounded-[3px] border-2 border-current" /> Match
              </SegmentedTrigger>
              <SegmentedTrigger value="pill">
                <span className="h-3 w-5 rounded-full border-2 border-current" /> Pill
              </SegmentedTrigger>
            </SegmentedList>
          </Tabs>
        </div>
      </Section>

      <Section title="Spacing">
        <TileGroup value={config.density} onValueChange={(v) => update({ density: v as Density })} aria-label="Spacing" className="grid-cols-1 gap-1">
          {densities.map((d) => (
            <Tile key={d.id} value={d.id} aria-label={d.label} className="group/tile h-10 flex-row justify-start gap-3 px-3 text-ui-sm">
              <span className="flex w-6 shrink-0 flex-col" style={{ gap: d.unit / 2 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-0.5 w-full rounded-full bg-line-strong group-data-[state=checked]/tile:bg-line-focus" />
                ))}
              </span>
              <span className="flex-1 text-left">{d.label}</span>
              <span className="text-body-xs text-fg-subtle">{d.hint}</span>
            </Tile>
          ))}
        </TileGroup>
      </Section>

      <ShadowSection />
      </Accordion>

    </div>
  );
}

function FontSelect({ label, value, onChange, categories }: { label: string; value: string; onChange: (v: string) => void; categories: FontDef["category"][] }) {
  const id = React.useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} size="small">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={CHROME_CLASS}>
          {categories.map((cat) => (
            <SelectGroup key={cat}>
              {categories.length > 1 && <SelectLabel>{cat}</SelectLabel>}
              {fonts
                .filter((f) => f.category === cat)
                .map((f) => (
                  <SelectItem key={f.name} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ShadowSection() {
  const { config, update } = useTheme();
  const shadow = config.shadow;
  const set = (patch: Partial<ShadowConfig>) => update({ shadow: { ...shadow, ...patch } });
  const themeTokens = semanticTokens(config, config.mode);
  const changed = (Object.keys(defaultShadow) as (keyof ShadowConfig)[]).some((k) => shadow[k] !== defaultShadow[k]);

  const controls: { key: "y" | "blur" | "spread" | "opacity" | "opacityDark"; label: string; min: number; max: number; unit: string }[] = [
    { key: "y", label: "Offset Y", min: 0, max: 16, unit: "px" },
    { key: "blur", label: "Blur", min: 0, max: 32, unit: "px" },
    { key: "spread", label: "Spread", min: -8, max: 8, unit: "px" },
    { key: "opacity", label: "Opacity", min: 0, max: 40, unit: "%" },
    { key: "opacityDark", label: "Dark opacity", min: 0, max: 100, unit: "%" },
  ];

  return (
    <Section
      title="Shadow"
      action={
        changed && (
          <Button variant="neutral" mode="ghost" size="xxsmall" onClick={() => set(defaultShadow)}>
            Reset
          </Button>
        )
      }
    >
      {/* live preview: a white card on the canvas, plus the floating level it scales to */}
      <div className="flex h-24 items-center justify-center gap-4 rounded-lg" style={{ background: themeTokens["canvas"] }}>
        {[
          { label: "Card", k: 1 },
          { label: "Popover", k: 4 },
        ].map((p) => (
          <div
            key={p.label}
            className="flex h-12 w-20 items-end rounded-lg p-2 text-ui-xs"
            style={{ background: themeTokens["surface"], color: themeTokens["fg-subtle"], boxShadow: themeTokens[`ds-shadow-${p.k === 1 ? "sm" : "md"}`] ?? shadowValue(config, config.mode, p.k) }}
          >
            {p.label}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {controls.map((c) => (
          <div key={c.key} className="flex h-5 items-center gap-3">
            <Label className="w-20 shrink-0 text-body-xs text-fg-muted">{c.label}</Label>
            <Slider min={c.min} max={c.max} step={1} value={[shadow[c.key]]} onValueChange={([v]) => set({ [c.key]: v })} aria-label={`Shadow ${c.label}`} />
            <span className="w-9 shrink-0 text-right font-mono text-body-xs text-fg">
              {shadow[c.key]}
              {c.unit}
            </span>
          </div>
        ))}
        <Tabs value={shadow.color} onValueChange={(v) => set({ color: v as ShadowConfig["color"] })}>
          <SegmentedList>
            <SegmentedTrigger value="neutral">Neutral</SegmentedTrigger>
            <SegmentedTrigger value="primary">Tinted</SegmentedTrigger>
          </SegmentedList>
        </Tabs>
      </div>
    </Section>
  );
}
