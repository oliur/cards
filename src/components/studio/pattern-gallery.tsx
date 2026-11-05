"use client";

import * as React from "react";
import { ArrowRightIcon, ChartColumnIcon, CheckIcon, CircleDotIcon, CopyIcon, FolderIcon, HouseIcon, InboxIcon, MicIcon, PauseIcon, PlaneIcon, PlayIcon, RepeatIcon, SearchIcon, SettingsIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon, SquareIcon, StarIcon, UsersIcon } from "lucide-react";
import { AppleIcon, GooglePlayIcon } from "@/components/ui/brand-icons";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDivider, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/misc";
import { Slider } from "@/components/ui/slider";
import { SegmentedList, SegmentedTrigger, Tabs } from "@/components/ui/tabs";
import { Tile, TileGroup } from "@/components/ui/tile-group";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { GradientId } from "@/lib/gradients";
import { cn } from "@/lib/utils";

/** A second set of patterns: two charts across the full width, then a masonry of smaller cards. */
export function PatternGallery() {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueCard />
        <AnalyticsCard />
      </div>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
        <BlogCard />
        <PlanPickerCard />
        <StorageCard />
        <MusicCard />
        <FlightCard />
        <AppDownloadCard />
        <DeliveryCard />
        <SidebarCard />
        <MarketCard />
        <RecorderCard />
      </div>
    </div>
  );
}

/* ---------- Revenue: one series of bars, one axis ---------- */

type RevenueRange = "7d" | "30d" | "12m";

const revenue: Record<RevenueRange, { total: string; delta: string; up: boolean; max: number; bars: { label: string; value: number }[] }> = {
  "7d": {
    total: "$12,840",
    delta: "+4.2%",
    up: true,
    max: 3,
    bars: [
      { label: "Mon", value: 1.6 },
      { label: "Tue", value: 1.9 },
      { label: "Wed", value: 2.2 },
      { label: "Thu", value: 1.7 },
      { label: "Fri", value: 2.4 },
      { label: "Sat", value: 1.3 },
      { label: "Sun", value: 0.8 },
    ],
  },
  "30d": {
    total: "$48,290",
    delta: "+12.4%",
    up: true,
    max: 15,
    bars: [
      { label: "Wk 1", value: 9.8 },
      { label: "Wk 2", value: 11.2 },
      { label: "Wk 3", value: 13.1 },
      { label: "Wk 4", value: 14.2 },
    ],
  },
  "12m": {
    total: "$512,600",
    delta: "−1.8%",
    up: false,
    max: 60,
    bars: [
      { label: "Jan", value: 32 },
      { label: "Feb", value: 36 },
      { label: "Mar", value: 41 },
      { label: "Apr", value: 38 },
      { label: "May", value: 44 },
      { label: "Jun", value: 47 },
      { label: "Jul", value: 43 },
      { label: "Aug", value: 49 },
      { label: "Sep", value: 54 },
      { label: "Oct", value: 51 },
      { label: "Nov", value: 39 },
      { label: "Dec", value: 39 },
    ],
  },
};

const formatThousands = (v: number) => `$${Number.isInteger(v) ? v : v.toFixed(1)}k`;

export function RevenueCard() {
  const [range, setRange] = React.useState<RevenueRange>("12m");
  const [hovered, setHovered] = React.useState<number | null>(null);
  const data = revenue[range];
  const active = hovered ?? data.bars.length - 1;
  const ticks = [1, 2 / 3, 1 / 3, 0];
  const summary = `Revenue by period, ${data.bars.map((b) => `${b.label} ${formatThousands(b.value)}`).join(", ")}.`;

  return (
    <Card className="flex min-w-0 flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-ui-sm text-fg-muted">Revenue</div>
          <div className="flex items-center gap-2">
            <span className="text-ui-xl text-fg">{data.total}</span>
            <Badge status={data.up ? "success" : "danger"} size="small">{data.delta}</Badge>
          </div>
        </div>
        <Tabs
          value={range}
          onValueChange={(v) => {
            setRange(v as RevenueRange);
            setHovered(null);
          }}
        >
          <SegmentedList className="w-auto">
            <SegmentedTrigger value="7d">7D</SegmentedTrigger>
            <SegmentedTrigger value="30d">30D</SegmentedTrigger>
            <SegmentedTrigger value="12m">12M</SegmentedTrigger>
          </SegmentedList>
        </Tabs>
      </div>

      <div className="mt-6 flex flex-1 gap-3">
        <div aria-hidden className="relative h-48 w-8 shrink-0 text-body-xs text-fg-subtle">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - t) * 100}%` }}>
              {formatThousands(Math.round(data.max * t * 10) / 10)}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div role="img" aria-label={summary} className="relative h-48" onPointerLeave={() => setHovered(null)}>
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 h-px bg-line" style={{ top: `${(1 - t) * 100}%` }} />
            ))}
            <div className="absolute inset-0 flex gap-1">
              {data.bars.map((b, i) => (
                <div key={b.label} data-bar className="relative flex h-full min-w-0 flex-1 items-end justify-center" onPointerEnter={() => setHovered(i)}>
                  <div
                    className={cn("w-full max-w-10 rounded-t-xs transition-colors duration-200", i === active ? "bg-primary" : "bg-track-strong")}
                    style={{ height: `${(b.value / data.max) * 100}%` }}
                  />
                  {hovered === i && (
                    <div
                      data-tooltip
                      className={cn(
                        "pointer-events-none absolute z-10 rounded-lg bg-floating px-3 py-2 whitespace-nowrap shadow-md",
                        i < 2 ? "left-0" : i > data.bars.length - 3 ? "right-0" : "left-1/2 -translate-x-1/2",
                      )}
                      style={{ bottom: `calc(${(b.value / data.max) * 100}% + 8px)` }}
                    >
                      <div className="text-body-xs text-fg-muted">{b.label}</div>
                      <div className="text-ui-sm text-fg">{formatThousands(b.value)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden className="mt-2 flex gap-1 text-body-xs text-fg-subtle">
            {data.bars.map((b, i) => (
              <span key={b.label} className={cn("min-w-0 flex-1 text-center", data.bars.length > 7 && i % 2 === 1 && "invisible")}>{b.label}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Analytics: this period against the last, on one axis ---------- */

const visitors = {
  labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13", "Mar 14"],
  current: [3.2, 3.8, 3.5, 4.4, 4.9, 4.2, 5.1, 5.6, 5.2, 6.1, 5.8, 6.6, 7.1, 6.8],
  previous: [2.8, 3.1, 3.4, 3.2, 3.7, 3.9, 3.6, 4.1, 4.4, 4.2, 4.6, 4.5, 4.9, 5.1],
  max: 8,
};

const toPoints = (values: number[]) =>
  values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / visitors.max) * 100}`).join(" ");

export function AnalyticsCard() {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const count = visitors.labels.length;
  const ticks = [8, 6, 4, 2, 0];
  const summary = `Daily visitors for ${visitors.labels[0]} to ${visitors.labels[count - 1]}, rising from ${visitors.current[0]}k to ${visitors.current[count - 1]}k. The previous period rose from ${visitors.previous[0]}k to ${visitors.previous[count - 1]}k.`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHovered(Math.round(ratio * (count - 1)));
  };

  const x = hovered === null ? 0 : (hovered / (count - 1)) * 100;

  return (
    <Card className="flex min-w-0 flex-col p-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Visitors", value: "68.4k" },
          { label: "Bounce rate", value: "32%" },
          { label: "Avg. session", value: "4m 12s" },
        ].map((s) => (
          <div key={s.label} className="min-w-0 space-y-1">
            <div className="truncate text-ui-sm text-fg-muted">{s.label}</div>
            <div className="truncate text-ui-lg text-fg">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-body-xs text-fg-muted">
        <span className="flex items-center gap-2"><span className="h-0.5 w-4 rounded-full bg-primary" /> This period</span>
        <span className="flex items-center gap-2"><span className="w-4 border-t-2 border-dashed border-fg-subtle" /> Previous period</span>
      </div>

      <div className="mt-4 flex flex-1 gap-3">
        <div aria-hidden className="relative h-40 w-6 shrink-0 text-body-xs text-fg-subtle">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - t / visitors.max) * 100}%` }}>{t}k</span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div
            role="img"
            aria-label={summary}
            data-analytics-plot
            className="relative h-40 touch-pan-y"
            onPointerMove={onMove}
            onPointerLeave={() => setHovered(null)}
          >
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 h-px bg-line" style={{ top: `${(1 - t / visitors.max) * 100}%` }} />
            ))}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
              <polyline points={toPoints(visitors.previous)} fill="none" stroke="var(--fg-subtle)" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              <polyline points={toPoints(visitors.current)} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {hovered !== null && (
              <>
                <div className="absolute inset-y-0 w-px bg-line-strong" style={{ left: `${x}%` }} />
                {[
                  { value: visitors.previous[hovered], color: "bg-fg-subtle" },
                  { value: visitors.current[hovered], color: "bg-primary" },
                ].map((d) => (
                  <span
                    key={d.color}
                    className={cn("absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface", d.color)}
                    style={{ left: `${x}%`, top: `${(1 - d.value / visitors.max) * 100}%` }}
                  />
                ))}
                <div
                  data-tooltip
                  className={cn("pointer-events-none absolute top-0 z-10 rounded-lg bg-floating px-3 py-2 whitespace-nowrap shadow-md", x > 55 ? "-translate-x-full" : "")}
                  style={{ left: x > 55 ? `calc(${x}% - 8px)` : `calc(${x}% + 8px)` }}
                >
                  <div className="text-body-xs text-fg-muted">{visitors.labels[hovered]}</div>
                  <div className="text-ui-sm text-fg">{visitors.current[hovered]}k this period</div>
                  <div className="text-body-xs text-fg-muted">{visitors.previous[hovered]}k previous</div>
                </div>
              </>
            )}
          </div>
          <div aria-hidden className="mt-2 flex justify-between text-body-xs text-fg-subtle">
            <span>{visitors.labels[0]}</span>
            <span>{visitors.labels[7]}</span>
            <span>{visitors.labels[count - 1]}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Blog post ---------- */

export function BlogCard() {
  return (
    <Card className="overflow-hidden">
      <ImagePlaceholder gradient="first-light" className="aspect-video" />
      <div className="space-y-3 p-5">
        <Badge status="highlight">Design</Badge>
        <h3 className="text-heading-6 text-fg">Why every corner should come from one number</h3>
        <p className="text-body-sm text-fg-muted">A single base radius keeps a whole interface in step, from the smallest badge up to the largest dialog.</p>
        <div className="flex items-center gap-3 pt-1">
          <Avatar size="32" color="purple">MK</Avatar>
          <div className="min-w-0">
            <div className="truncate text-ui-sm text-fg">Milo Kovac</div>
            <div className="truncate text-body-xs text-fg-muted">Mar 12 · 6 min read</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- App download ---------- */

export function AppDownloadCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <ImagePlaceholder gradient="midnight" className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-white">
          <MicIcon className="size-8" />
        </ImagePlaceholder>
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-ui-lg text-fg">Murmur</h3>
          <div className="flex items-center gap-1 text-body-xs text-fg-muted">
            <StarIcon fill="currentColor" className="size-4 text-caution" /> 4.8 · Productivity
          </div>
        </div>
      </div>
      <p className="mt-4 text-body-sm text-fg-muted">Capture a thought before it slips away. Speak, and it lands in your notes as tidy text.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="neutral" size="small" className="px-2"><AppleIcon /> App Store</Button>
        <Button variant="neutral" mode="outline" size="small" className="px-2"><GooglePlayIcon /> Google Play</Button>
      </div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-line text-center">
        {[
          { value: "4.8", label: "Rating" },
          { value: "2M+", label: "Downloads" },
          { value: "48 MB", label: "Size" },
        ].map((s) => (
          <div key={s.label} className="px-1">
            <div className="text-ui-sm text-fg">{s.value}</div>
            <div className="text-body-xs text-fg-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Music player ---------- */

const tracks: { title: string; artist: string; length: number; gradient: GradientId }[] = [
  { title: "Slow Tide", artist: "Harbour Lights", length: 214, gradient: "dusk" },
  { title: "Paper Skies", artist: "Nova Ames", length: 187, gradient: "midnight" },
  { title: "Long Way Round", artist: "The Quiet Hours", length: 243, gradient: "clear-sky" },
];

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function MusicCard() {
  const [index, setIndex] = React.useState(0);
  const [position, setPosition] = React.useState(58);
  const [playing, setPlaying] = React.useState(false);
  const [shuffle, setShuffle] = React.useState(false);
  const [repeat, setRepeat] = React.useState(false);
  const track = tracks[index];

  React.useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setPosition((p) => Math.min(p + 1, track.length)), 1000);
    return () => clearInterval(timer);
  }, [playing, track.length]);

  const skip = (by: number) => {
    setIndex((i) => (i + by + tracks.length) % tracks.length);
    setPosition(0);
  };

  return (
    <Card className="space-y-4 p-4">
      <ImagePlaceholder gradient={track.gradient} className="aspect-[4/3] rounded-xl" />
      <div className="px-1">
        <h3 className="truncate text-ui-md text-fg">{track.title}</h3>
        <p className="truncate text-body-sm text-fg-muted">{track.artist}</p>
      </div>
      <div className="space-y-2 px-1">
        <Slider value={[position]} max={track.length} step={1} onValueChange={([v]) => setPosition(v)} aria-label="Seek" />
        <div className="flex justify-between font-mono text-body-xs text-fg-subtle">
          <span>{formatTime(position)}</span>
          <span>{formatTime(track.length)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Button variant={shuffle ? "primary" : "neutral"} mode="ghost" size="small" iconOnly aria-label="Shuffle" aria-pressed={shuffle} onClick={() => setShuffle((s) => !s)}><ShuffleIcon /></Button>
        <Button variant="neutral" mode="ghost" size="small" iconOnly aria-label="Previous track" onClick={() => skip(-1)}><SkipBackIcon fill="currentColor" /></Button>
        <Button iconOnly aria-label={playing ? "Pause" : "Play"} data-music-play onClick={() => setPlaying((p) => !p)}>
          {playing ? <PauseIcon fill="currentColor" /> : <PlayIcon fill="currentColor" />}
        </Button>
        <Button variant="neutral" mode="ghost" size="small" iconOnly aria-label="Next track" onClick={() => skip(1)}><SkipForwardIcon fill="currentColor" /></Button>
        <Button variant={repeat ? "primary" : "neutral"} mode="ghost" size="small" iconOnly aria-label="Repeat" aria-pressed={repeat} onClick={() => setRepeat((r) => !r)}><RepeatIcon /></Button>
      </div>
    </Card>
  );
}

/* ---------- Plan picker ---------- */

const plans = [
  { id: "yearly", name: "Yearly", note: "14-day free trial", price: "$8/mo", billed: "$96 per year" },
  { id: "monthly", name: "Monthly", note: "7-day free trial", price: "$12/mo", billed: "Billed monthly" },
];

export function PlanPickerCard() {
  const [plan, setPlan] = React.useState("yearly");
  return (
    <Card className="space-y-4 p-5">
      <h3 className="text-ui-md text-fg">Choose your plan</h3>
      <TileGroup value={plan} onValueChange={setPlan} aria-label="Billing plan">
        {plans.map((p) => (
          <Tile key={p.id} value={p.id} className="group/tile flex-row justify-start gap-3 p-4 text-left">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-field ring-1 ring-inset ring-line-strong group-data-[state=checked]/tile:bg-primary group-data-[state=checked]/tile:ring-primary">
              <span className="size-2 rounded-full bg-primary-foreground opacity-0 group-data-[state=checked]/tile:opacity-100" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-ui-sm text-fg">{p.name}</span>
              <span className="block text-body-xs text-fg-muted">{p.note}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-ui-sm text-fg">{p.price}</span>
              <span className="block text-body-xs text-fg-muted">{p.billed}</span>
            </span>
          </Tile>
        ))}
      </TileGroup>
      <Button className="w-full pr-3 has-[>svg:first-child]:pl-4">Start free trial <ArrowRightIcon /></Button>
      <p className="text-center text-body-xs text-fg-subtle">Cancel any time. No charge until your trial ends.</p>
    </Card>
  );
}

/* ---------- Storage ---------- */

const storage = [
  { label: "Documents", size: "28 GB", share: 28, color: "bg-chart-1" },
  { label: "Photos", size: "19 GB", share: 19, color: "bg-chart-3" },
  { label: "Other", size: "9 GB", share: 9, color: "bg-chart-4" },
];

export function StorageCard() {
  return (
    <Card>
      <CardHeader icon={<FolderIcon />} title="Storage" description="56 GB of 100 GB used" />
      <CardDivider />
      <CardContent className="space-y-4">
        <div role="img" aria-label="Storage used: Documents 28 GB, Photos 19 GB, Other 9 GB, 44 GB free." className="flex h-2 overflow-hidden rounded-full bg-track">
          {storage.map((s) => (
            <span key={s.label} className={cn("h-full border-r-2 border-surface", s.color)} style={{ width: `${s.share}%` }} />
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-2 text-body-xs text-fg-muted">
          {storage.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span className={cn("size-2 shrink-0 rounded-full", s.color)} />
              <span className="truncate">{s.label}, {s.size}</span>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-track" />
            <span className="truncate">Free, 44 GB</span>
          </li>
        </ul>
      </CardContent>
      <CardDivider />
      <CardContent className="space-y-3">
        <div className="text-ui-sm text-fg">Who has access</div>
        <div className="flex items-center justify-between gap-3">
          <AvatarGroup className="-space-x-1">
            <Avatar size="32" color="blue">AL</Avatar>
            <Avatar size="32" color="purple">MK</Avatar>
            <Avatar size="32" color="orange">JS</Avatar>
            <Avatar size="32" color="green">RW</Avatar>
          </AvatarGroup>
          <Button variant="neutral" mode="outline" size="xsmall">Edit access</Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- Voice recorder ---------- */

const waveform = [
  30, 52, 44, 70, 38, 60, 86, 48, 34, 58, 76, 92, 64, 40, 28, 54, 80, 68, 36, 50,
  72, 96, 60, 42, 30, 62, 84, 56, 38, 46, 74, 66, 34, 24, 48, 70, 52, 32, 44, 28,
];
const RECORDING_SECONDS = 96;

export function RecorderCard() {
  const [position, setPosition] = React.useState(38);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setPosition((p) => (p >= RECORDING_SECONDS ? 0 : p + 1)), 1000);
    return () => clearInterval(timer);
  }, [playing]);

  const progress = position / RECORDING_SECONDS;

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-ui-md text-fg">Standup notes</h3>
        <span className="font-mono text-body-sm text-fg-muted">{formatTime(position)}</span>
      </div>
      <div role="img" aria-label={`Voice recording waveform, ${formatTime(position)} of ${formatTime(RECORDING_SECONDS)} played.`} className="relative flex h-16 items-center gap-1">
        {waveform.map((h, i) => (
          <span
            key={i}
            className={cn("min-w-0 flex-1 rounded-full transition-colors", i / waveform.length < progress ? "bg-primary" : "bg-track-strong")}
            style={{ height: `${h}%` }}
          />
        ))}
        <span className="absolute inset-y-0 w-0.5 rounded-full bg-fg" style={{ left: `${progress * 100}%` }} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button iconOnly size="small" aria-label={playing ? "Pause recording" : "Play recording"} onClick={() => setPlaying((p) => !p)}>
            {playing ? <PauseIcon fill="currentColor" /> : <PlayIcon fill="currentColor" />}
          </Button>
          <Button variant="neutral" mode="outline" iconOnly size="small" aria-label="Stop" onClick={() => { setPlaying(false); setPosition(0); }}><SquareIcon /></Button>
        </div>
        <Button variant="danger" mode="soft" size="small"><CircleDotIcon /> Record</Button>
      </div>
    </Card>
  );
}

/* ---------- Market overview ---------- */

const markets = [
  { label: "Market cap", value: "$3.08T", delta: "+1.2%", up: true, points: [12, 14, 13, 16, 15, 18, 17, 20, 22, 21, 24] },
  { label: "Volume", value: "$153B", delta: "−4.8%", up: false, points: [24, 22, 25, 20, 21, 17, 19, 15, 16, 13, 12] },
  { label: "Dominance", value: "60.1%", delta: "+0.3%", up: true, points: [16, 15, 17, 16, 18, 17, 19, 18, 19, 20, 20] },
];

const SENTIMENT_TICKS = 32;
const SENTIMENT_SCORE = 72;

function Sparkline({ points, label }: { points: number[]; label: string }) {
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  const path = points.map((p, i) => `${(i / (points.length - 1)) * 100},${90 - ((p - lo) / (hi - lo)) * 80}`).join(" ");
  return (
    <svg role="img" aria-label={label} viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-16 shrink-0 overflow-visible">
      <polyline points={path} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function MarketCard() {
  const highlighted = Math.round((SENTIMENT_SCORE / 100) * (SENTIMENT_TICKS - 1));
  return (
    <Card className="p-5">
      <h3 className="text-ui-md text-fg">Market overview</h3>
      <ul className="mt-3 divide-y divide-line">
        {markets.map((m) => (
          <li key={m.label} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-body-xs text-fg-muted">{m.label}</div>
              <div className="flex items-center gap-2">
                <span className="text-ui-sm text-fg">{m.value}</span>
                <Badge status={m.up ? "success" : "danger"} size="small">{m.delta}</Badge>
              </div>
            </div>
            <Sparkline points={m.points} label={`${m.label} trend, ${m.up ? "rising" : "falling"}`} />
          </li>
        ))}
      </ul>
      <div className="mt-2 space-y-2 border-t border-line pt-4">
        <div className="flex items-center justify-between">
          <span className="text-ui-sm text-fg">Sentiment</span>
          <span className="text-body-sm text-fg-muted">Greed, {SENTIMENT_SCORE}</span>
        </div>
        <div role="img" aria-label={`Sentiment score ${SENTIMENT_SCORE} out of 100, greed.`} className="flex h-6 items-center justify-between">
          {Array.from({ length: SENTIMENT_TICKS }, (_, i) => (
            <span key={i} className={cn("w-0.5 rounded-full", i === highlighted ? "h-6 bg-primary" : "h-3 bg-track-strong")} />
          ))}
        </div>
        <div aria-hidden className="flex justify-between text-body-xs text-fg-subtle">
          <span>Fear</span>
          <span>Greed</span>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Flight ticket ---------- */

export function FlightCard() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-body-sm text-fg-muted">UL 204</span>
        <StatusBadge status="success">On time</StatusBadge>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-heading-4 text-fg">YYZ</div>
          <div className="text-body-xs text-fg-muted">Toronto</div>
        </div>
        <div className="text-right">
          <div className="text-heading-4 text-fg">LAX</div>
          <div className="text-body-xs text-fg-muted">Los Angeles</div>
        </div>
      </div>
      <div role="img" aria-label="Flight is 62% of the way to Los Angeles." className="relative mt-4 flex h-6 items-center">
        <span className="h-0.5 w-full rounded-full bg-track" />
        <span className="absolute inset-y-0 left-0 my-auto h-0.5 rounded-full bg-primary" style={{ width: "62%" }} />
        <span className="absolute flex size-6 -translate-x-1/2 items-center justify-center rounded-full bg-surface text-primary" style={{ left: "62%" }}>
          <PlaneIcon className="size-4 rotate-45" />
        </span>
      </div>
      <div className="mt-2 flex justify-between text-body-xs text-fg-muted">
        <span>Departed 11:12</span>
        <span>Arrives 16:34</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
        {[
          { label: "Gate", value: "B12" },
          { label: "Seat", value: "14A" },
          { label: "Altitude", value: "36,850 ft" },
        ].map((d) => (
          <div key={d.label} className="min-w-0">
            <div className="text-body-xs text-fg-muted">{d.label}</div>
            <div className="truncate text-ui-sm text-fg">{d.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Delivery tracking ---------- */

const PACKAGE_NUMBER = "4902 8680 1608";
const deliverySteps = [
  { label: "Ordered", detail: "Mar 10, 09:24" },
  { label: "Shipped", detail: "Mar 11, 14:02" },
  { label: "Out for delivery", detail: "Today, 07:48" },
  { label: "Delivered", detail: "Expected by 18:00" },
];
const CURRENT_STEP = 2;

export function DeliveryCard() {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(PACKAGE_NUMBER).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Card className="p-5">
      <h3 className="text-ui-md text-fg">Out for delivery</h3>
      <div className="mt-1 flex items-center gap-1">
        <span className="font-mono text-body-xs text-fg-muted">{PACKAGE_NUMBER}</span>
        <Button variant="neutral" mode="ghost" size="xxsmall" iconOnly aria-label={copied ? "Copied" : "Copy package number"} onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <ol className="mt-4">
        {deliverySteps.map((s, i) => {
          const done = i < CURRENT_STEP;
          const current = i === CURRENT_STEP;
          return (
            <li key={s.label} aria-current={current ? "step" : undefined} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    done && "bg-primary text-primary-foreground",
                    current && "ring-2 ring-inset ring-primary",
                    !done && !current && "ring-1 ring-inset ring-line-strong",
                  )}
                >
                  {done && <CheckIcon className="size-4" />}
                  {current && <span className="size-2 rounded-full bg-primary" />}
                </span>
                {i < deliverySteps.length - 1 && <span className={cn("min-h-4 w-0.5 flex-1", done ? "bg-primary" : "bg-track")} />}
              </div>
              <div className={cn("min-w-0", i < deliverySteps.length - 1 && "pb-4")}>
                <div className={cn("text-ui-sm", done || current ? "text-fg" : "text-fg-muted")}>{s.label}</div>
                <div className="text-body-xs text-fg-muted">{s.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ---------- App sidebar ---------- */

const sidebarItems = [
  { label: "Home", icon: HouseIcon },
  { label: "Inbox", icon: InboxIcon, count: 12 },
  { label: "Analytics", icon: ChartColumnIcon },
  { label: "Team", icon: UsersIcon, count: 4 },
  { label: "Settings", icon: SettingsIcon },
];

export function SidebarCard() {
  const [active, setActive] = React.useState("Inbox");
  return (
    <Card className="space-y-3 p-3">
      <Input size="small" placeholder="Search" aria-label="Search" leading={<SearchIcon />} trailing={<Kbd>⌘K</Kbd>} />
      <nav aria-label="Example app" className="space-y-1">
        {sidebarItems.map(({ label, icon: Icon, count }) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => setActive(label)}
              className={cn(
                "flex h-9 w-full items-center gap-3 rounded-md px-3 text-left text-ui-sm outline-none transition duration-200 ease-out focus-visible:shadow-focus",
                isActive ? "bg-hover text-fg" : "text-fg-muted hover:bg-hover hover:text-fg",
              )}
            >
              <Icon className={cn("size-5 shrink-0", isActive ? "text-fg-muted" : "text-fg-subtle")} />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {count !== undefined && <Badge size="small">{count}</Badge>}
            </button>
          );
        })}
      </nav>
    </Card>
  );
}
