"use client";

import * as React from "react";
import { CalendarIcon, DownloadIcon, InfoIcon, LayoutGridIcon, ListChecksIcon, LockIcon, MailIcon, PlusIcon, SearchIcon, SettingsIcon, Share2Icon, Trash2Icon, UserIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { FieldMessage, Label, LabelHint } from "@/components/ui/label";
import { Kbd, Progress } from "@/components/ui/misc";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SegmentedList, SegmentedTrigger, TabList, TabTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Tile, TileGroup } from "@/components/ui/tile-group";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DocSection, Specimen } from "./section";

const variants = ["primary", "neutral", "danger"] as const;
const modes = ["solid", "outline", "soft", "ghost"] as const;

export function ComponentsShowcase() {
  return (
    <DocSection id="components" title="Components">
      <div className="space-y-6">
        <Specimen label="Button — variant × mode">
          <div className="-m-2 space-y-3 overflow-x-auto p-2">
            {variants.map((v) => (
              <div key={v} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-ui-xs text-fg-subtle capitalize">{v}</span>
                {modes.map((m) => (
                  <Button key={m} variant={v} mode={m} size="small" className="capitalize">
                    {v === "danger" ? <Trash2Icon /> : <PlusIcon />}
                    {m}
                  </Button>
                ))}
              </div>
            ))}
            {variants.map((v, i) => (
              <div key={v} className={cn("flex items-center gap-3", i === 0 && "pt-3")}>
                <span className="w-20 shrink-0 text-ui-xs text-fg-subtle">Flat {v}</span>
                {modes.filter((m) => m !== "ghost").map((m) => (
                  <Button key={m} variant={v} mode={m} size="small" flat className="capitalize">
                    {v === "danger" ? <Trash2Icon /> : <PlusIcon />}
                    {m}
                  </Button>
                ))}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <span className="w-20 shrink-0 text-ui-xs text-fg-subtle">Sizes</span>
              <Button size="medium">Medium</Button>
              <Button size="small">Small</Button>
              <Button size="xsmall">X-small</Button>
              <Button size="xxsmall">2X-small</Button>
              <Button variant="neutral" mode="outline" iconOnly aria-label="Settings"><SettingsIcon /></Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <span className="w-20 shrink-0 text-ui-xs text-fg-subtle">On canvas</span>
              <div className="flex items-center gap-3 rounded-lg bg-canvas p-3">
                <Button variant="neutral" mode="raised" size="small"><PlusIcon /> Raised</Button>
                <Button variant="neutral" mode="outline" size="small"><PlusIcon /> Outline</Button>
              </div>
              <span className="text-body-xs text-fg-subtle">The white button keeps its edge on the grey page and on white cards.</span>
            </div>
          </div>
        </Specimen>

        <div className="grid gap-6 lg:grid-cols-2">
          <Specimen label="Input & textarea">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" placeholder="hello@example.com" leading={<MailIcon />} />
                <FieldMessage><InfoIcon /> We&apos;ll never share it.</FieldMessage>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw">Password <LabelHint>(min. 8 characters)</LabelHint></Label>
                <Input id="pw" type="password" defaultValue="hunter" hasError leading={<LockIcon />} />
                <FieldMessage hasError><InfoIcon /> Password is too short.</FieldMessage>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio <LabelHint>(optional)</LabelHint></Label>
                <Textarea id="bio" placeholder="A few words about you…" />
              </div>
            </div>
          </Specimen>

          <Specimen label="Select, search & sizes">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue="editor">
                  <SelectTrigger><UserIcon className="text-fg-subtle" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Search…" leading={<SearchIcon />} trailing={<Kbd>⌘K</Kbd>} />
              <div className="flex gap-3">
                <Input size="small" placeholder="Small" />
                <Input size="xsmall" placeholder="X-small" />
              </div>
              <Input disabled placeholder="Disabled" />
            </div>
          </Specimen>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Specimen label="Checkbox">
            <div className="space-y-3">
              {[
                { id: "c1", label: "Email notifications", checked: true },
                { id: "c2", label: "Push notifications", checked: false },
                { id: "c3", label: "Select all", checked: "indeterminate" as const },
              ].map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <Checkbox id={c.id} defaultChecked={c.checked} />
                  <Label htmlFor={c.id} className="text-body-sm">{c.label}</Label>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Checkbox id="c4" disabled />
                <Label htmlFor="c4" className="text-body-sm text-fg-disabled">Disabled</Label>
              </div>
            </div>
          </Specimen>
          <Specimen label="Radio">
            <RadioGroup defaultValue="monthly">
              {["monthly", "yearly", "lifetime"].map((v) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioItem value={v} id={`r-${v}`} />
                  <Label htmlFor={`r-${v}`} className="text-body-sm capitalize">{v}</Label>
                </div>
              ))}
            </RadioGroup>
          </Specimen>
          <Specimen label="Switch">
            <div className="space-y-3">
              {[
                { id: "s1", label: "Two-factor auth", on: true },
                { id: "s2", label: "Public profile", on: false },
              ].map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <Label htmlFor={s.id} className="text-body-sm">{s.label}</Label>
                  <Switch id={s.id} defaultChecked={s.on} />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <Label className="text-body-sm text-fg-disabled">Disabled</Label>
                <Switch disabled />
              </div>
            </div>
          </Specimen>
        </div>

          <Specimen label="Badge & status">
            <div className="-m-2 space-y-4 overflow-x-auto p-2">
              {(["soft", "tint", "solid", "outline"] as const).map((v) => (
                <div key={v} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-14 text-ui-xs text-fg-subtle capitalize">{v}</span>
                  {(["neutral", "primary", "success", "warning", "danger", "highlight"] as const).map((s) => (
                    <Badge key={s} variant={v} status={s} className="capitalize">{s}</Badge>
                  ))}
                </div>
              ))}
              <div className="flex gap-2 pt-1 whitespace-nowrap">
                <StatusBadge status="success">Active</StatusBadge>
                <StatusBadge status="caution">Pending</StatusBadge>
                <StatusBadge status="danger">Failed</StatusBadge>
                <StatusBadge status="neutral">Draft</StatusBadge>
              </div>
            </div>
          </Specimen>

        <Specimen label="Accordion">
          <Accordion type="single" collapsible defaultValue="a" className="max-w-xl">
            {[
              { v: "a", q: "Can I use my own colors?", a: "Yes — pick any primary color and the whole ramp, hover states and focus rings are generated from it." },
              { v: "b", q: "Does it support dark mode?", a: "Every token has a dark value. Surfaces get lighter the higher they sit, and strokes become translucent." },
              { v: "c", q: "How do I apply it to my project?", a: "Copy the prompt and paste it into your AI tool or rules file — it carries every token and rule." },
            ].map((f) => (
              <AccordionItem key={f.v} value={f.v}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent className="text-body-sm text-fg-muted">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Specimen>

        <Specimen label="Tile group">
          <TileGroup defaultValue="pro" aria-label="Plan" className="max-w-xl grid-cols-3 gap-3">
            {[
              { v: "starter", name: "Starter", price: "$0" },
              { v: "pro", name: "Pro", price: "$24" },
              { v: "team", name: "Team", price: "$64" },
            ].map((p) => (
              <Tile key={p.v} value={p.v} className="items-start gap-1 p-4 text-left">
                <span className="text-ui-sm">{p.name}</span>
                <span className="text-body-xs text-fg-subtle">{p.price} / month</span>
              </Tile>
            ))}
          </TileGroup>
        </Specimen>

        <Specimen label="Tabs">
          <div className="space-y-6">
            <Tabs defaultValue="grid">
              <SegmentedList className="max-w-sm">
                <SegmentedTrigger value="grid"><LayoutGridIcon /> Grid</SegmentedTrigger>
                <SegmentedTrigger value="list"><ListChecksIcon /> List</SegmentedTrigger>
                <SegmentedTrigger value="calendar"><CalendarIcon /> Calendar</SegmentedTrigger>
              </SegmentedList>
            </Tabs>
            <Tabs defaultValue="overview">
              <TabList>
                <TabTrigger value="overview">Overview</TabTrigger>
                <TabTrigger value="members">Members</TabTrigger>
                <TabTrigger value="billing">Billing</TabTrigger>
                <TabTrigger value="settings">Settings</TabTrigger>
              </TabList>
              {["overview", "members", "billing", "settings"].map((v) => (
                <TabsContent key={v} value={v} className="pt-4 text-body-sm text-fg-muted">
                  The <span className="text-fg capitalize">{v}</span> panel. Line tabs navigate between sibling views; segmented controls switch the presentation of one view.
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Specimen>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <Specimen label="Avatar, tooltip & progress">
            <div className="space-y-5">
              <div className="flex items-end gap-3">
                <Avatar size="64" color="blue">AL</Avatar>
                <Avatar size="48" color="purple">MK</Avatar>
                <Avatar size="40" color="orange">JS</Avatar>
                <Avatar size="32" color="green">RW</Avatar>
                <Avatar size="24" color="red">EP</Avatar>
                <AvatarGroup className="ml-auto">
                  {["blue", "yellow", "green", "purple"].map((c, i) => (
                    <Avatar key={c} size="32" color={c as "blue"}>{"ABCD"[i]}</Avatar>
                  ))}
                </AvatarGroup>
              </div>
              <div className="flex gap-2">
                {[
                  { icon: <Share2Icon />, tip: "Share" },
                  { icon: <DownloadIcon />, tip: "Download" },
                  { icon: <SettingsIcon />, tip: "Settings" },
                ].map((b) => (
                  <Tooltip key={b.tip} content={b.tip}>
                    <Button variant="neutral" mode="outline" size="small" iconOnly aria-label={b.tip}>{b.icon}</Button>
                  </Tooltip>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-ui-xs"><span className="text-fg-muted">Storage</span><span className="text-fg">68%</span></div>
                <Progress value={68} />
              </div>
            </div>
          </Specimen>
          <Specimen label="Dialog" className="flex flex-col lg:w-72" bodyClassName="flex flex-1 items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="danger" mode="outline"><Trash2Icon /> Click me</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader icon={<Trash2Icon />} title="Delete project?" description="This permanently removes the project and its 24 files." />
                <DialogBody>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Type <span className="font-mono">cards</span> to confirm</Label>
                    <Input id="confirm" placeholder="cards" />
                  </div>
                </DialogBody>
                <DialogFooter>
                  <DialogClose asChild><Button variant="neutral" mode="outline" size="small">Cancel</Button></DialogClose>
                  <DialogClose asChild><Button variant="danger" size="small">Delete</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Specimen>
        </div>

        <Specimen label="Alert">
          <div className="space-y-3">
            <Alert status="info" title="New version available">Update to get the latest improvements.</Alert>
            <Alert status="success" variant="outline" title="Changes saved" onDismiss={() => {}}>Your profile was updated.</Alert>
            <Alert status="danger" variant="solid" title="Payment failed. Please update your card." />
          </div>
        </Specimen>
      </div>
    </DocSection>
  );
}
