"use client";

import * as React from "react";
import { BookOpenIcon, CopyIcon, LinkIcon, SparklesIcon, TerminalIcon } from "lucide-react";
import { fontStylesheets } from "@/design-system/config";
import { generatePrompt } from "@/design-system/prompt";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, SegmentedList, SegmentedTrigger } from "@/components/ui/tabs";
import { CopyButton, useCopy } from "./copy-button";
import { useTheme } from "./theme-provider";

type Tab = "prompt" | "skill" | "install";

export function PromptDialog({ children, defaultTab = "prompt" }: { children: React.ReactNode; defaultTab?: Tab }) {
  const { config, shareUrl, installCommand, skillCommand } = useTheme();
  // Stays on "prompt" until opened: the commands read window, which doesn't exist on the server.
  const [tab, setTab] = React.useState<string>("prompt");
  const prompt = React.useMemo(() => generatePrompt(config), [config]);
  const share = useCopy();
  const fontLinks = React.useMemo(() => fontStylesheets(config).map((href) => `<link rel="stylesheet" href="${href}" />`).join("\n"), [config]);
  const command = tab === "install" ? installCommand() : tab === "skill" ? skillCommand() : "";
  const text = tab === "prompt" ? prompt : command;
  const copyLabel = tab === "prompt" ? "Copy prompt" : "Copy command";

  return (
    <Dialog onOpenChange={(open) => open && setTab(defaultTab)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[720px]">
        <DialogHeader
          icon={<CopyIcon />}
          title="Use your design system"
          description="Paste the prompt into any AI builder, add it to your agent as a skill, or install the components. All carry your colors, fonts and radius."
        />
        <div className="border-t border-line p-5 pt-4">
          <Tabs value={tab} onValueChange={setTab}>
            <SegmentedList className="mb-3 w-auto">
              <SegmentedTrigger value="prompt"><SparklesIcon /> AI prompt</SegmentedTrigger>
              <SegmentedTrigger value="skill"><BookOpenIcon /> Skill</SegmentedTrigger>
              <SegmentedTrigger value="install"><TerminalIcon /> Install</SegmentedTrigger>
            </SegmentedList>
            <TabsContent value="skill">
              <div className="h-[50vh] space-y-4 overflow-auto">
                <p className="text-body-sm text-fg-muted">Run this in your project to add the system as an agent skill. It uses the settings you have now.</p>
                <pre className="overflow-x-auto rounded-xl bg-subtle p-4 font-mono text-[12px] leading-[1.6] whitespace-pre-wrap break-all text-fg-muted ring-1 ring-inset ring-line">{command}</pre>
                <ul className="list-disc space-y-2 pl-5 text-body-sm text-fg-muted">
                  <li>Saves the same rules as the prompt to <code className="font-mono">.claude/skills/cards/SKILL.md</code>.</li>
                  <li>Your agent loads it whenever it works on UI, so you don&apos;t have to paste the prompt each time.</li>
                  <li>For Codex, Cursor and other agents, save it to <code className="font-mono">.agents/skills/cards/SKILL.md</code> instead.</li>
                  <li>Run it again after changing your settings to update it.</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="install">
              <div className="h-[50vh] space-y-4 overflow-auto">
                <p className="text-body-sm text-fg-muted">Run this in a shadcn/ui project. It uses the settings you have now.</p>
                <pre className="overflow-x-auto rounded-xl bg-subtle p-4 font-mono text-[12px] leading-[1.6] whitespace-pre-wrap break-all text-fg-muted ring-1 ring-inset ring-line">{command}</pre>
                <ul className="list-disc space-y-2 pl-5 text-body-sm text-fg-muted">
                  <li>Adds your tokens, type, shadows and fonts to your global CSS.</li>
                  <li>Adds the Cards components, which also accept stock shadcn props.</li>
                  <li>Asks before replacing a component you already have, so commit your work first.</li>
                  <li>Needs a shadcn/ui project using Radix. To start one, run <code className="font-mono">npx shadcn@latest init --base radix</code> first.</li>
                </ul>
                <div className="space-y-2">
                  <p className="text-body-sm text-fg-muted">Then add your fonts to the document head:</p>
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-xl bg-subtle p-4 pr-24 font-mono text-[12px] leading-[1.6] whitespace-pre-wrap break-all text-fg-muted ring-1 ring-inset ring-line">{fontLinks}</pre>
                    <CopyButton size="xxsmall" text={fontLinks} label="Copy" className="absolute top-2 right-2" />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="prompt">
              <pre className="h-[50vh] overflow-auto rounded-xl bg-subtle p-4 font-mono text-[12px] leading-[1.6] whitespace-pre-wrap text-fg-muted ring-1 ring-inset ring-line">
                {prompt}
              </pre>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="justify-between">
          <span className="text-body-xs text-fg-subtle">
            {tab === "prompt" && `${text.split("\n").length.toLocaleString()} lines · ${(text.length / 1000).toFixed(1)}k characters`}
          </span>
          <div className="flex gap-3">
            <Button variant="neutral" mode="outline" size="small" onClick={() => share.copy(shareUrl())}>
              <LinkIcon /> {share.copied ? "Link copied" : "Share link"}
            </Button>
            <CopyButton size="small" text={text} label={copyLabel} />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
