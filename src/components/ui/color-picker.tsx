"use client";

import * as React from "react";
import { Popover as PopoverPrimitive, Slider as SliderPrimitive } from "radix-ui";
import { ChevronDownIcon } from "lucide-react";
import { converter, formatHex } from "culori";
import { cn } from "@/lib/utils";

type Hsv = { h: number; s: number; v: number };

const toHsvColor = converter("hsv");
const hexToHsv = (hex: string): Hsv => {
  const c = toHsvColor(hex);
  return { h: c?.h ?? 0, s: c?.s ?? 0, v: c?.v ?? 0 };
};
const hsvToHex = ({ h, s, v }: Hsv) => formatHex({ mode: "hsv", h, s, v }).toUpperCase();
const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Saturation/brightness area + hue slider + hex field.
 * Keeps HSV internally so the hue doesn't reset when you drag into grey.
 */
function ColorPicker({ value, onChange, className }: { value: string; onChange: (hex: string) => void; className?: string }) {
  const [hsv, setHsv] = React.useState(() => hexToHsv(value));
  const [synced, setSynced] = React.useState(value);
  if (value !== synced) {
    setSynced(value);
    if (hsvToHex(hsv) !== value.toUpperCase()) setHsv(hexToHsv(value));
  }

  const emit = (next: Hsv) => {
    setHsv(next);
    const hex = hsvToHex(next);
    setSynced(hex);
    onChange(hex);
  };

  const areaRef = React.useRef<HTMLDivElement>(null);
  const fromPointer = (e: React.PointerEvent) => {
    const rect = areaRef.current!.getBoundingClientRect();
    emit({ ...hsv, s: clamp((e.clientX - rect.left) / rect.width), v: clamp(1 - (e.clientY - rect.top) / rect.height) });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
    if (!d) return;
    e.preventDefault();
    emit({ ...hsv, s: clamp(hsv.s + d[0]), v: clamp(hsv.v + d[1]) });
  };

  const [draft, setDraft] = React.useState(value);
  const [draftFor, setDraftFor] = React.useState(value);
  if (draftFor !== value) {
    setDraftFor(value);
    setDraft(value);
  }
  const commitDraft = () => {
    const hex = draft.startsWith("#") ? draft : `#${draft}`;
    if (/^#[0-9a-f]{6}$/i.test(hex)) emit(hexToHsv(hex.toUpperCase()));
    else setDraft(value);
  };

  const hueColor = hsvToHex({ h: hsv.h, s: 1, v: 1 });

  return (
    <div data-slot="color-picker" className={cn("space-y-3", className)}>
      <div
        ref={areaRef}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuenow={Math.round(hsv.s * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && fromPointer(e)}
        onKeyDown={onKey}
        className="relative h-40 w-full cursor-crosshair touch-none rounded-concentric-3 outline-none ring-1 ring-inset ring-black/[0.06] dark:ring-white/[0.06] focus-visible:shadow-focus-primary"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${hueColor}`,
        }}
      >
        <span
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white shadow-[0_0_0_1px_rgb(0_0_0/0.2),0_2px_4px_rgb(0_0_0/0.2)]"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: value }}
        />
      </div>

      <SliderPrimitive.Root
        min={0}
        max={360}
        step={1}
        value={[hsv.h]}
        onValueChange={([h]) => emit({ ...hsv, h })}
        aria-label="Hue"
        className="relative flex h-4 w-full touch-none items-center select-none"
      >
        <SliderPrimitive.Track
          className="relative h-3 w-full rounded-full ring-1 ring-inset ring-black/[0.06] dark:ring-white/[0.06]"
          style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
        />
        <SliderPrimitive.Thumb
          className="block size-4 rounded-full ring-2 ring-white shadow-[0_0_0_1px_rgb(0_0_0/0.2),0_2px_4px_rgb(0_0_0/0.2)] outline-none focus-visible:shadow-focus-primary"
          style={{ background: hueColor }}
        />
      </SliderPrimitive.Root>

      <div className="flex h-8 items-center gap-2 rounded-concentric-3 bg-field px-2 shadow-field ring-1 ring-inset ring-field-line transition focus-within:shadow-focus focus-within:ring-line-focus">
        <span className="size-4 shrink-0 rounded-xs ring-1 ring-inset ring-black/[0.08] dark:ring-white/[0.1]" style={{ background: value }} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => e.key === "Enter" && commitDraft()}
          aria-label="Hex color"
          spellCheck={false}
          className="w-full bg-transparent font-mono text-body-sm text-fg uppercase outline-none"
        />
      </div>
    </div>
  );
}

/** A select-like field showing the swatch + hex; the picker opens in a popover. */
function ColorField({ value, onChange, className, contentClassName, "aria-label": ariaLabel = "Color" }: {
  value: string;
  onChange: (hex: string) => void;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
}) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          "group flex h-9 w-full items-center gap-2 rounded-md bg-control pr-2 pl-2 text-left shadow-control outline-none",
          "ring-1 ring-inset ring-line transition duration-200 ease-out",
          "hover:ring-line-strong focus-visible:shadow-focus focus-visible:ring-line-focus",
          "data-[state=open]:shadow-focus data-[state=open]:ring-line-focus",
          className,
        )}
      >
        <span className="size-5 shrink-0 rounded-xs ring-1 ring-inset ring-black/[0.08] dark:ring-white/[0.1]" style={{ background: value }} />
        <span className="flex-1 font-mono text-body-sm text-fg uppercase">{value}</span>
        <ChevronDownIcon className="size-5 text-fg-subtle transition group-data-[state=open]:rotate-180" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className={cn("z-50 w-(--radix-popover-trigger-width) min-w-64 animate-in rounded-parent-2xl bg-floating p-3 shadow-md outline-none", contentClassName)}
        >
          <ColorPicker value={value} onChange={onChange} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { ColorPicker, ColorField };
