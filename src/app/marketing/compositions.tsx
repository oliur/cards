"use client";

import * as React from "react";
import { ArrowUpRightIcon, BellIcon, BookOpenIcon, CheckIcon, CopyIcon, PlusIcon, SearchIcon, SparklesIcon, TerminalIcon, Trash2Icon } from "lucide-react";
import { defaultConfig, fontStylesheets, type ThemeConfig } from "@/design-system/config";
import { generateThemeCss } from "@/design-system/tokens";
import { GoogleIcon } from "@/components/ui/brand-icons";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDivider, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Divider, Progress } from "@/components/ui/misc";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SegmentedList, SegmentedTrigger, Tabs } from "@/components/ui/tabs";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import {
  AppDownloadCard,
  BlogCard,
  DeliveryCard,
  FlightCard,
  MarketCard,
  MusicCard,
  PlanPickerCard,
  RecorderCard,
  StorageCard,
} from "@/components/studio/pattern-gallery";
import { cn } from "@/lib/utils";

const SIZE = 1200;

/* ---------- frame ---------- */

/** One 1200px square. `stage` is the design width in CSS px; it is zoomed up to fill the square, so UI reads at X's small sizes. */
function Canvas({ n, stage, dark, className, children }: { n: number; stage: number; dark?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <section data-shot={n} className={cn("relative size-[1200px] shrink-0 overflow-hidden", dark && "dark")}>
      <div className={cn("absolute top-0 left-0 overflow-hidden bg-canvas font-sans text-fg", className)} style={{ width: stage, height: stage, zoom: SIZE / stage }}>
        {children}
      </div>
    </section>
  );
}

/** Tokens for one config, scoped to a class so several themes can sit side by side. */
function ScopedTheme({ id, config }: { id: string; config: ThemeConfig }) {
  const css = generateThemeCss(config).replace(/^:root \{/, `.${id} {`).replace(/\n\.dark \{/, `\n.dark .${id}, .${id}.dark {`);
  return (
    <>
      <style>{css}</style>
      {fontStylesheets(config).map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
    </>
  );
}

/* ---------- small cards built from the site's patterns ---------- */

function SignInCard({ className }: { className?: string }) {
  return (
    <Card className={cn("p-8", className)}>
      <div className="mb-6 space-y-1 text-center">
        <h3 className="text-heading-5 text-fg">Welcome back</h3>
        <p className="text-body-sm text-fg-muted">Sign in to your account.</p>
      </div>
      <div className="space-y-4">
        <Button variant="neutral" mode="outline" className="w-full"><GoogleIcon /> Continue with Google</Button>
        <Divider label="or" />
        <div className="space-y-2"><Label>Email</Label><Input placeholder="you@company.com" /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" defaultValue="cardscards" /></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Checkbox defaultChecked /><Label className="text-body-sm">Keep me signed in</Label></div>
          <span className="text-ui-sm text-fg-muted underline decoration-line-strong underline-offset-4">Forgot?</span>
        </div>
        <Button className="w-full">Sign in</Button>
      </div>
    </Card>
  );
}

function NotificationsCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader icon={<BellIcon />} title="Notifications" description="Choose what you hear about." />
      <CardDivider />
      <CardContent className="space-y-4">
        {[
          { t: "Product updates", d: "News about features and improvements.", on: true },
          { t: "Billing", d: "Invoices and payment reminders.", on: true },
          { t: "Mentions", d: "When someone @mentions you.", on: false },
        ].map((n) => (
          <div key={n.t} className="flex items-start justify-between gap-4">
            <div>
              <div className="text-ui-sm text-fg">{n.t}</div>
              <div className="text-body-xs text-fg-muted">{n.d}</div>
            </div>
            <Switch defaultChecked={n.on} aria-label={n.t} />
          </div>
        ))}
      </CardContent>
      <CardDivider />
      <CardFooter className="justify-end">
        <Button variant="neutral" mode="outline" size="small">Cancel</Button>
        <Button size="small">Save changes</Button>
      </CardFooter>
    </Card>
  );
}

function StatCard({ label, value, delta, up = true, className }: { label: string; value: string; delta: string; up?: boolean; className?: string }) {
  return (
    <Card className={cn("space-y-3 p-4", className)}>
      <div className="flex items-center justify-between text-ui-xs text-fg-muted">
        {label}
        <ArrowUpRightIcon className="size-4 text-fg-subtle" />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-ui-xl text-fg">{value}</span>
        <Badge status={up ? "success" : "danger"} size="small">{delta}</Badge>
      </div>
    </Card>
  );
}

function InviteCard({ className }: { className?: string }) {
  return (
    <Card className={cn("space-y-4 p-5", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-heading-6 text-fg">Invite your team</h3>
          <p className="text-body-sm text-fg-muted">Ship the same system, together.</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Input placeholder="name@company.com" wrapperClassName="flex-1" />
        <Button><PlusIcon /> Invite</Button>
      </div>
      <div className="flex items-center justify-between">
        <AvatarGroup>
          <Avatar size="32" color="blue">A</Avatar>
          <Avatar size="32" color="purple">M</Avatar>
          <Avatar size="32" color="orange">J</Avatar>
        </AvatarGroup>
        <StatusBadge status="success">3 active</StatusBadge>
      </div>
    </Card>
  );
}

function SkillDialog({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden shadow-lg", className)}>
      <CardHeader icon={<CopyIcon />} title="Use your design system" description="Paste the prompt into any AI builder, add it as a skill, or install the components." />
      <div className="border-t border-line p-5 pt-4">
        <Tabs value="skill">
          <SegmentedList className="mb-4 w-auto">
            <SegmentedTrigger value="prompt"><SparklesIcon /> AI prompt</SegmentedTrigger>
            <SegmentedTrigger value="skill"><BookOpenIcon /> Skill</SegmentedTrigger>
            <SegmentedTrigger value="install"><TerminalIcon /> Install</SegmentedTrigger>
          </SegmentedList>
        </Tabs>
        <pre className="rounded-xl bg-subtle p-4 font-mono text-body-xs whitespace-pre text-fg-muted ring-1 ring-inset ring-line">
          <span className="text-fg-subtle">$ </span>{`mkdir -p .claude/skills/cards && \\
  curl -fsSL …/skill/cards.md \\
  -o .claude/skills/cards/SKILL.md`}
        </pre>
        <ul className="mt-4 space-y-2 text-body-sm text-fg-muted">
          {["Your colors, fonts and radius, as rules", "Loads whenever your agent touches UI", "Works with Claude Code, Codex and Cursor"].map((t) => (
            <li key={t} className="flex items-center gap-2"><CheckIcon className="size-4 text-success" /> {t}</li>
          ))}
        </ul>
      </div>
      <CardDivider />
      <CardFooter className="justify-end">
        <Button variant="neutral" mode="outline" size="small">Share link</Button>
        <Button size="small"><CopyIcon /> Copy command</Button>
      </CardFooter>
    </Card>
  );
}

/* ---------- the ten images ---------- */

// 1. One card, centered.
function One() {
  return (
    <Canvas n={1} stage={640}>
      <div className="absolute inset-0 flex items-center justify-center">
        <SignInCard className="w-96 shadow-lg" />
      </div>
    </Canvas>
  );
}

// 2. A row of cards running off both sides.
function Row() {
  return (
    <Canvas n={2} stage={800} className="bg-linear-to-b from-canvas to-subtle">
      <div className="absolute top-1/2 -left-32 flex -translate-y-1/2 items-center gap-6">
        <div className="w-72 shrink-0"><MusicCard /></div>
        <div className="w-80 shrink-0"><PlanPickerCard /></div>
        <div className="w-80 shrink-0"><StorageCard /></div>
        <div className="w-80 shrink-0"><FlightCard /></div>
      </div>
    </Canvas>
  );
}

// 3. A column of cards running off the top and bottom, in dark mode.
function Column() {
  return (
    <Canvas n={3} stage={800} dark>
      <div className="absolute -top-40 left-16 flex w-[340px] flex-col gap-6">
        <MarketCard />
        <InviteCard />
        <MusicCard />
      </div>
      <div className="absolute -top-8 left-[424px] flex w-[340px] flex-col gap-6">
        <DeliveryCard />
        <NotificationsCard />
        <StorageCard />
      </div>
    </Canvas>
  );
}

// 4. Cards of every size, all over the canvas and off every edge.
function Scatter() {
  const cols = [
    { y: "-top-32", cards: [<BlogCard key="a" />, <StatCard key="b" label="Revenue" value="$48,290" delta="+12.4%" />, <RecorderCard key="c" />] },
    { y: "-top-8", cards: [<PlanPickerCard key="a" />, <MarketCard key="b" />, <InviteCard key="c" />] },
    { y: "-top-48", cards: [<MusicCard key="a" />, <NotificationsCard key="b" />, <StatCard key="c" label="Churn" value="1.8%" delta="−0.4%" up={false} />, <AppDownloadCard key="d" />] },
    { y: "-top-20", cards: [<StorageCard key="a" />, <FlightCard key="b" />, <DeliveryCard key="c" />] },
  ];
  return (
    <Canvas n={4} stage={960}>
      <div className="absolute -left-36 flex gap-6">
        {cols.map((c, i) => (
          <div key={i} className={cn("relative flex w-72 shrink-0 flex-col gap-6", c.y)}>{c.cards}</div>
        ))}
      </div>
    </Canvas>
  );
}

// 5. The same card fanned out in three brands.
const fanThemes: { id: string; config: ThemeConfig; rotate: string; z: string }[] = [
  { id: "mk-fan-a", config: { ...defaultConfig, primary: "#2D7EFF", radius: 16, fontSans: "Geist", fontDisplay: "Geist" }, rotate: "-rotate-[8deg] -translate-x-48 translate-y-4", z: "z-0" },
  { id: "mk-fan-b", config: { ...defaultConfig, primary: "#E8590C", radius: 4, fontSans: "IBM Plex Sans", fontDisplay: "IBM Plex Sans", neutral: "stone" }, rotate: "rotate-[8deg] translate-x-48 translate-y-4", z: "z-0" },
  { id: "mk-fan-c", config: defaultConfig, rotate: "", z: "z-10" },
];
function Fan() {
  return (
    <Canvas n={5} stage={800}>
      <ImagePlaceholder gradient="first-light" className="absolute inset-0" />
      {fanThemes.map((t) => <ScopedTheme key={t.id} id={t.id} config={t.config} />)}
      <div className="absolute inset-0 flex items-center justify-center">
        {fanThemes.map((t) => (
          <div key={t.id} className={cn(t.id, "absolute w-80 font-sans text-fg", t.rotate, t.z)}>
            <PlanPickerCard />
          </div>
        ))}
      </div>
    </Canvas>
  );
}

// 6. The headline in a card, surrounded by the system.
function Headline() {
  return (
    <Canvas n={6} stage={800}>
      <div className="absolute -top-32 -left-32 w-72"><StorageCard /></div>
      <div className="absolute -top-48 -right-32 w-72"><MusicCard /></div>
      <div className="absolute -bottom-48 -left-32 w-72"><NotificationsCard /></div>
      <div className="absolute -right-32 -bottom-32 w-72"><MarketCard /></div>
      <div className="absolute top-12 left-64 w-56"><StatCard label="Active users" value="2,814" delta="+3.1%" /></div>
      <div className="absolute bottom-12 left-72 w-56"><StatCard label="Revenue" value="$48,290" delta="+12.4%" /></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <SignInCard className="w-96 shadow-lg" />
      </div>
    </Canvas>
  );
}

// 7. One card, split down the middle: light and dark.
function Split() {
  const layer = (dark: boolean) => (
    <div className={cn("absolute inset-0 bg-canvas text-fg", dark && "dark")} style={dark ? { clipPath: "inset(0 0 0 50%)" } : undefined}>
      <div className="absolute inset-0 bg-canvas" />
      <div className="absolute inset-0 flex items-center justify-center">
        <NotificationsCard className="w-[440px] shadow-lg" />
      </div>
    </div>
  );
  return (
    <Canvas n={7} stage={640}>
      {layer(false)}
      {layer(true)}
    </Canvas>
  );
}

// 8. The same card in four systems, one per quarter.
const quarters: { id: string; config: ThemeConfig }[] = [
  { id: "mk-q-a", config: defaultConfig },
  { id: "mk-q-b", config: { ...defaultConfig, primary: "#2D7EFF", radius: 16, fontSans: "Geist", fontDisplay: "Geist", neutral: "slate" } },
  { id: "mk-q-c", config: { ...defaultConfig, primary: "#E8590C", radius: 4, fontSans: "IBM Plex Sans", fontDisplay: "IBM Plex Sans", neutral: "stone" } },
  { id: "mk-q-d", config: { ...defaultConfig, primary: "#15803D", radius: 12, fontSans: "DM Sans", fontDisplay: "Fraunces", neutral: "zinc" } },
];
function Quarters() {
  return (
    <Canvas n={8} stage={800} className="grid grid-cols-2 grid-rows-2">
      {quarters.map((q) => <ScopedTheme key={q.id} id={q.id} config={q.config} />)}
      {quarters.map((q, i) => (
        <div key={q.id} className={cn(q.id, "flex flex-col items-center justify-center gap-4 bg-canvas font-sans text-fg", (i === 1 || i === 2) && "bg-subtle")}>
          <InviteCard className="w-80 shadow-md" />
        </div>
      ))}
    </Canvas>
  );
}

// 9. The skill dialog: hand the system to your agent.
function Skill() {
  return (
    <Canvas n={9} stage={800} dark>
      <div className="absolute inset-x-12 top-1/2 -translate-y-1/2">
        <SkillDialog />
      </div>
    </Canvas>
  );
}

// 10. Every control, laid out like a sheet of parts.
function Parts() {
  const tile = (label: string, node: React.ReactNode, wide?: boolean) => (
    <Card key={label} className={cn("flex h-36 flex-col justify-between p-4", wide && "col-span-2")}>
      <span className="text-ui-xs text-fg-subtle">{label}</span>
      <div className="flex flex-1 items-center justify-center">{node}</div>
    </Card>
  );
  return (
    <Canvas n={10} stage={800}>
      <div className="absolute top-1/2 -left-16 grid w-[928px] -translate-y-1/2 grid-cols-4 gap-4">
        {tile("Button", <Button><CopyIcon /> Copy prompt</Button>)}
        {tile("Raised", <Button variant="neutral" mode="raised"><TerminalIcon /> Install</Button>)}
        {tile("Danger", <Button variant="danger"><Trash2Icon /> Delete</Button>)}
        {tile("Icon", <div className="flex gap-2"><Button iconOnly aria-label="Add"><PlusIcon /></Button><Button variant="neutral" mode="raised" iconOnly aria-label="Search"><SearchIcon /></Button></div>)}
        {tile("Badges", <div className="flex flex-wrap justify-center gap-2"><Badge status="success">Paid</Badge><Badge status="warning">Due</Badge><Badge status="danger">Failed</Badge><Badge status="highlight">New</Badge></div>, true)}
        {tile("Status", <div className="flex gap-2"><StatusBadge status="success">Active</StatusBadge><StatusBadge status="caution">Invited</StatusBadge></div>)}
        {tile("Switch", <div className="flex gap-3"><Switch defaultChecked aria-label="On" /><Switch aria-label="Off" /></div>)}
        {tile("Input", <Input placeholder="you@company.com" wrapperClassName="w-full" />)}
        {tile("Select", <Select value="team"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="team">Team plan</SelectItem></SelectContent></Select>)}
        {tile("Segmented", <Tabs value="m"><SegmentedList className="w-auto"><SegmentedTrigger value="w">Week</SegmentedTrigger><SegmentedTrigger value="m">Month</SegmentedTrigger><SegmentedTrigger value="y">Year</SegmentedTrigger></SegmentedList></Tabs>, true)}
        {tile("Checkbox", <div className="flex items-center gap-2"><Checkbox defaultChecked /><Label className="text-body-sm">Remember me</Label></div>)}
        {tile("Slider", <Slider defaultValue={[64]} className="w-full" />)}
        {tile("Progress", <div className="w-full space-y-2"><Progress value={72} /><div className="text-body-xs text-fg-muted">72% complete</div></div>)}
        {tile("Avatars", <AvatarGroup><Avatar size="40" color="blue">AL</Avatar><Avatar size="40" color="purple">MK</Avatar><Avatar size="40" color="orange">JS</Avatar><Avatar size="40" color="green">RW</Avatar></AvatarGroup>)}
      </div>
    </Canvas>
  );
}

export function Compositions() {
  return (
    <div className="absolute top-0 left-0 z-[100] flex w-[1200px] flex-col gap-8 bg-neutral-950 p-0">
      <One />
      <Row />
      <Column />
      <Scatter />
      <Fan />
      <Headline />
      <Split />
      <Quarters />
      <Skill />
      <Parts />
    </div>
  );
}
