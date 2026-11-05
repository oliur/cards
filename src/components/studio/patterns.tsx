"use client";

import * as React from "react";
import { ArrowUpRightIcon, BellIcon, CreditCardIcon, EllipsisVerticalIcon, UsersIcon } from "lucide-react";
import { GoogleIcon } from "@/components/ui/brand-icons";
import { Avatar } from "@/components/ui/avatar";
import { Badge, StatusBadge, type Status } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDivider, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Divider } from "@/components/ui/misc";
import { Switch } from "@/components/ui/switch";
import { PatternGallery } from "./pattern-gallery";
import { DocSection } from "./section";

const members: { name: string; email: string; role: string; status: Status; label: string; color: "blue" | "purple" | "orange" | "green" }[] = [
  { name: "Ava Laurent", email: "ava@example.com", role: "Owner", status: "success", label: "Active", color: "blue" },
  { name: "Milo Kovac", email: "milo@example.com", role: "Admin", status: "success", label: "Active", color: "purple" },
  { name: "Jun Sato", email: "jun@example.com", role: "Editor", status: "caution", label: "Invited", color: "orange" },
  { name: "Rae Wilson", email: "rae@example.com", role: "Viewer", status: "neutral", label: "Inactive", color: "green" },
];

export function Patterns() {
  return (
    <DocSection id="patterns" title="Patterns">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="self-start p-8">
          <div aria-hidden className="mx-auto mb-6 size-12 rounded-full bg-track" />
          <div className="mb-6 space-y-1 text-center">
            <h3 className="text-heading-5 text-fg">Welcome back</h3>
            <p className="text-body-sm text-fg-muted">Sign in to continue to Cards.</p>
          </div>
          <div className="space-y-4">
            <Button variant="neutral" mode="outline" className="w-full"><GoogleIcon /> Continue with Google</Button>
            <Divider label="or" />
            <div className="space-y-2"><Label htmlFor="p-email">Email</Label><Input id="p-email" placeholder="you@company.com" /></div>
            <div className="space-y-2"><Label htmlFor="p-pass">Password</Label><Input id="p-pass" type="password" placeholder="••••••••" /></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Checkbox id="p-keep" defaultChecked /><Label htmlFor="p-keep" className="text-body-sm">Keep me signed in</Label></div>
              <a href="#" className="text-ui-sm text-fg-muted underline decoration-line-strong underline-offset-4 hover:text-fg">Forgot?</a>
            </div>
            <Button className="w-full">Sign in</Button>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Revenue", value: "$48,290", delta: "+12.4%", up: true },
              { label: "Active users", value: "2,814", delta: "+3.1%", up: true },
              { label: "Churn", value: "1.8%", delta: "−0.4%", up: false },
            ].map((s) => (
              <Card key={s.label} className="space-y-3 p-4">
                <div className="flex items-center justify-between text-ui-xs text-fg-muted">
                  {s.label}
                  <ArrowUpRightIcon className="size-4 text-fg-subtle" />
                </div>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <span className="text-ui-xl text-fg">{s.value}</span>
                  <Badge status={s.up ? "success" : "danger"} variant="soft" size="small">{s.delta}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader
              icon={<UsersIcon />}
              title="Team members"
              description="Manage who has access to this workspace."
              action={<Button size="xsmall">Invite</Button>}
            />
            <CardDivider />
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-table-head text-ui-xs text-fg-muted">
                    <th className="px-5 py-2 font-[inherit]">Member</th>
                    <th className="px-5 py-2 font-[inherit]">Role</th>
                    <th className="px-5 py-2 font-[inherit]">Status</th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {members.map((m) => (
                    <tr key={m.email} className="transition hover:bg-hover">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar size="32" color={m.color}>{m.name.split(" ").map((x) => x[0]).join("")}</Avatar>
                          <div>
                            <div className="text-ui-sm text-fg">{m.name}</div>
                            <div className="text-body-xs text-fg-muted">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-body-sm text-fg-muted">{m.role}</td>
                      <td className="px-5 py-3"><StatusBadge status={m.status}>{m.label}</StatusBadge></td>
                      <td className="px-3"><Button variant="neutral" mode="ghost" size="xxsmall" iconOnly aria-label="More"><EllipsisVerticalIcon /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
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
            <CardFooter className="justify-between">
              <span className="flex items-center gap-2 text-body-xs text-fg-subtle"><CreditCardIcon className="size-4" /> Pro plan · renews May 2</span>
              <div className="flex gap-3">
                <Button variant="neutral" mode="outline" size="small">Cancel</Button>
                <Button size="small">Save changes</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <PatternGallery />
    </DocSection>
  );
}
