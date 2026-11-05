"use client";

import * as React from "react";
import { densities, radiusStopNumber, radiusStops } from "@/design-system/config";
import { typeScale } from "@/design-system/prompt";
import { neutralScale, primaryBase, primaryScale, radiusScale, semanticTokens, shadowLevels, shadowValue, stateColors } from "@/design-system/tokens";

// Literal class names so Tailwind generates them.
const shadowClasses = { xs: "shadow-xs", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg" } as const;
import { useCopy } from "./copy-button";
import { DocSection, SubHeading } from "./section";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

function Swatch({ name, value, className }: { name: string; value: string; className?: string }) {
  const { copied, copy } = useCopy(1000);
  return (
    <button onClick={() => copy(name)} className={cn("group text-left outline-none", className)} title={`Copy ${name}`}>
      <div className="h-14 rounded-lg ring-1 ring-inset ring-black/[0.06] transition group-hover:scale-[1.03] dark:ring-white/[0.06]" style={{ background: value }} />
      <div className="mt-2 truncate text-ui-xs text-fg">{copied ? "Copied" : name}</div>
      <div className="truncate font-mono text-[11px] text-fg-subtle">{value.startsWith("#") ? value : "alpha"}</div>
    </button>
  );
}

export function Colors() {
  const { config } = useTheme();
  const n = neutralScale(config, config.mode);
  const p = primaryScale(primaryBase(config, config.mode));
  const t = semanticTokens(config, config.mode);

  const groups: { title: string; hint: string; tokens: string[] }[] = [
    { title: "Background", hint: "bg-{token}", tokens: ["canvas", "subtle", "tray", "surface", "raised", "floating", "field", "control", "control-hover", "selected", "track", "track-strong", "inverse-hover", "inverse"] },
    { title: "Text", hint: "text-{token}", tokens: ["fg", "fg-muted", "fg-subtle", "fg-disabled", "fg-inverse"] },
    { title: "Line", hint: "ring-{token} / border-{token}", tokens: ["line-focus", "line-strong", "line", "line-inverse"] },
    { title: "Primary", hint: "bg-primary*", tokens: ["primary", "primary-hover", "primary-active", "primary-subtle-stronger", "primary-subtle-strong", "primary-subtle"] },
  ];

  return (
    <DocSection id="colors" title="Color">
      <div className="space-y-6">
        <div className="rounded-2xl bg-surface shadow-sm p-6">
          <SubHeading hint="Click a swatch to copy its token">Semantic tokens</SubHeading>
          <div className="space-y-6">
            {groups.map((g) => (
              <div key={g.title} className="grid gap-4 md:grid-cols-[140px_1fr]">
                <div>
                  <div className="text-ui-sm text-fg">{g.title}</div>
                  <div className="font-mono text-body-xs text-fg-subtle">{g.hint}</div>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {g.tokens.map((k) => <Swatch key={k} name={k} value={t[k]} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface shadow-sm p-6">
          <SubHeading hint="Raw ramps — avoid in components">Palettes</SubHeading>
          <div className="space-y-3">
            {[
              { name: `neutral · ${config.neutral}`, steps: Object.entries(n) },
              { name: "primary", steps: Object.entries(p) },
            ].map((ramp) => (
              <div key={ramp.name} className="grid items-center gap-3 md:grid-cols-[140px_1fr]">
                <div className="text-ui-sm text-fg capitalize">{ramp.name}</div>
                <div className="flex overflow-hidden rounded-lg ring-1 ring-inset ring-line">
                  {ramp.steps
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([step, hex]) => (
                      <div key={step} className="group relative h-12 flex-1" style={{ background: hex }}>
                        <span className={cn("absolute bottom-1 left-2 font-mono text-[10px] opacity-70", Number(step) >= 500 ? "text-white" : "text-black")}>{step}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface shadow-sm p-6">
          <SubHeading hint="{state}-fg · base · {state}-line · {state}-subtle">State colors</SubHeading>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Object.keys(stateColors), "neutral"].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex overflow-hidden rounded-md">
                  {[s + "-fg", s, s + "-line", s + "-subtle"].map((v) => (
                    <div key={v} className="size-8" style={{ background: t[v] }} />
                  ))}
                </div>
                <span className="text-ui-sm text-fg capitalize">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DocSection>
  );
}

// Literal class names so Tailwind generates them.
const typeClasses = [
  "text-heading-1", "text-heading-2", "text-heading-3", "text-heading-4", "text-heading-5", "text-heading-6",
  "text-ui-xl", "text-ui-lg", "text-ui-md", "text-ui-sm", "text-ui-xs",
  "text-body-xl", "text-body-lg", "text-body-md", "text-body-sm", "text-body-xs",
  "text-overline-md", "text-overline-sm", "text-overline-xs", "text-overline-2xs",
];

export function Typography() {
  const { config } = useTheme();
  const sample: Record<string, string> = {
    heading: "Design with intent",
    ui: "Workspace settings",
    body: "Calm surfaces and precise type let the content lead.",
    overline: "Section eyebrow",
  };
  return (
    <DocSection id="typography" title="Typography">
      <div className="divide-y divide-line rounded-2xl bg-surface shadow-sm">
        {typeScale.map((s) => (
          <div key={s.token} className="grid items-center gap-2 px-5 py-4 md:grid-cols-[180px_1fr_200px]">
            <div>
              <div className="font-mono text-body-xs text-fg">text-{s.token}</div>
              <div className="font-mono text-[11px] text-fg-subtle">{s.size}/{s.line}</div>
            </div>
            <div className={cn(typeClasses.find((c) => c === `text-${s.token}`), "text-fg")}>{sample[s.token.split("-")[0]]}</div>
            <div className="text-body-xs text-fg-muted md:text-right">{s.use}</div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

export function Shape() {
  const { config } = useTheme();
  const r = radiusScale(config.radius);
  return (
    <DocSection id="shape" title="Radius & elevation">
      <div className="grid gap-4 rounded-2xl bg-surface shadow-sm p-6 sm:grid-cols-4 lg:grid-cols-7">
        {(Object.entries(r) as [string, string][]).map(([k, v]) => (
          <div key={k} className="space-y-2">
            <div className="aspect-square bg-primary-subtle ring-1 ring-inset ring-primary-subtle-stronger" style={{ borderRadius: v }} />
            <div className="text-ui-xs text-fg">rounded-{k}</div>
            <div className="font-mono text-[11px] text-fg-subtle">{v}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shadowLevels.map((l) => (
          <div key={l.name} className={cn("space-y-2 rounded-2xl bg-surface p-4", shadowClasses[l.name])}>
            <div className="font-mono text-body-xs text-fg">shadow-{l.name}</div>
            <div className="text-body-xs text-fg-muted">{l.use}</div>
            <div className="font-mono text-[11px] break-all text-fg-subtle">{shadowValue(config, config.mode, l.k)}</div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

export function Spacing() {
  const { config } = useTheme();
  const unit = densities.find((d) => d.id === config.density)!.unit;
  const steps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
  const usage = [
    { range: "2", px: `${2 * unit}px`, use: "Icon ↔ label, inside controls" },
    { range: "3 – 4", px: `${3 * unit}–${4 * unit}px`, use: "Control padding, between a label and its field" },
    { range: "4 – 6", px: `${4 * unit}–${6 * unit}px`, use: "Between fields and related items, gap between cards" },
    { range: "5 – 6", px: `${5 * unit}–${6 * unit}px`, use: "Card padding" },
    { range: "8 – 12", px: `${8 * unit}–${12 * unit}px`, use: "Between page sections" },
  ];
  return (
    <DocSection id="spacing" title="Spacing">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3 rounded-2xl bg-surface p-6 shadow-sm">
          {steps.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-12 font-mono text-body-xs text-fg">{s}</span>
              <span className="w-12 font-mono text-body-xs text-fg-subtle">{s * unit}px</span>
              <span className="h-4 rounded-xs bg-primary-subtle-strong ring-1 ring-inset ring-primary-subtle-stronger" style={{ width: s * unit }} />
            </div>
          ))}
        </div>
        <div className="divide-y divide-line rounded-2xl bg-surface shadow-sm">
          {usage.map((u) => (
            <div key={u.range} className="space-y-1 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-ui-sm text-fg">{u.range}</span>
                <span className="font-mono text-body-xs text-fg-subtle">{u.px}</span>
              </div>
              <p className="text-body-xs text-fg-muted">{u.use}</p>
            </div>
          ))}
        </div>
      </div>
    </DocSection>
  );
}
