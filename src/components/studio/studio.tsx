"use client";

import * as React from "react";
import Link from "next/link";
import { Popover } from "radix-ui";
import { ArrowUpRightIcon, BookOpenIcon, CopyIcon, MenuIcon, SlidersHorizontalIcon, TerminalIcon, XIcon } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { CHROME_CLASS } from "@/design-system/tokens";
import { repoUrl, systemName } from "@/design-system/guidelines";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ComponentsShowcase } from "./components-showcase";
import { Credits } from "./credits";
import { Customizer } from "./customizer";
import { Colors, Shape, Spacing, Typography } from "./foundations";
import { Patterns } from "./patterns";
import { PromptDialog } from "./prompt-dialog";
import { ThemeProvider } from "./theme-provider";

const nav = [
  { href: "/#colors", label: "Color" },
  { href: "/#typography", label: "Typography" },
  { href: "/#spacing", label: "Spacing" },
  { href: "/#shape", label: "Radius & elevation" },
  { href: "/#components", label: "Components" },
  { href: "/#patterns", label: "Patterns" },
];

/** Shared chrome for every page: theme, header, customizer sidebar and credits. */
export function StudioShell({ children, stars }: { children: React.ReactNode; stars: number }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Shell stars={stars}>{children}</Shell>
      </TooltipProvider>
    </ThemeProvider>
  );
}

/** Homepage content. */
export function HomeSections() {
  return (
    <>
      <Hero />
      <div>
        <Colors />
        <Typography />
        <Spacing />
        <Shape />
        <ComponentsShowcase />
        <Patterns />
      </div>
    </>
  );
}

const starCount = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

const navLinkClass = "rounded-md px-3 py-2 whitespace-nowrap text-ui-sm text-fg-muted outline-none transition hover:bg-hover hover:text-fg focus-visible:shadow-focus";

/** The nav links in a dropdown, for tablets and small laptops. Phones have no nav. */
function MobileNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="neutral" mode="ghost" iconOnly className="max-sm:hidden xl:hidden" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <XIcon /> : <MenuIcon />}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          // Returning focus to the trigger would scroll back up, away from the section just picked.
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="z-50 w-56 origin-(--radix-popover-content-transform-origin) animate-menu-in rounded-parent-2xl bg-floating p-2 shadow-menu data-[state=closed]:animate-menu-out motion-reduce:animate-menu-fade-in motion-reduce:data-[state=closed]:animate-menu-fade-out"
        >
          <nav aria-label="Main" className="flex flex-col gap-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={navLinkClass} onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
          </nav>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Shell({ children, stars }: { children: React.ReactNode; stars: number }) {
  const [panelOpen, setPanelOpen] = React.useState(false);
  return (
    <div className="min-h-screen">
      <div id="studio">
        {/* Studio chrome: keeps default spacing and type size so it always lines up with the sidebar. */}
        <header className="relative z-40" style={{ "--ds-spacing": "4px", "--ds-font-scale": "1" } as React.CSSProperties}>
          <div className="flex h-16 items-center gap-6 px-6">
            <Link href="/" className="text-ui-md text-fg">
              {systemName}
            </Link>
            <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className={navLinkClass}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="neutral" mode="raised" className="xl:hidden" aria-label="Customize" onClick={() => setPanelOpen((o) => !o)}>
                <SlidersHorizontalIcon /> <span className="max-sm:hidden">Customize</span>
              </Button>
              <Button variant="neutral" mode="ghost" iconOnly={stars === 0} asChild>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={stars > 0 ? `${systemName} on GitHub, ${stars.toLocaleString("en-US")} stars` : `${systemName} on GitHub`}
                  title="View on GitHub"
                >
                  <GithubIcon />
                  {stars > 0 && <span className="tabular-nums">{starCount.format(stars)}</span>}
                </a>
              </Button>
              <PromptDialog>
                <Button className="max-sm:hidden"><CopyIcon /> Copy prompt</Button>
              </PromptDialog>
              <MobileNav />
            </div>
          </div>
        </header>

        <div className="flex">
          <aside
            className={cn(
              CHROME_CLASS,
              "fixed top-16 left-4 z-30 max-h-[calc(100vh-5rem)] w-[300px] shrink-0 scroll-pt-16 scroll-pb-4 overflow-y-auto rounded-2xl bg-surface shadow-sm transition-transform duration-300",
              "xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:ml-4 xl:self-start xl:translate-x-0",
              panelOpen ? "translate-x-0 shadow-lg" : "-translate-x-[calc(100%+1rem)]",
            )}
          >
            <Customizer />
          </aside>
          <main className="min-w-0 flex-1">
            <div className="mx-auto max-w-[1080px] px-6 lg:px-10">
              {children}
              <Credits />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Fixed colors, so the promo looks the same under any theme. The glow is three cards wide and repeats every card width,
// so sliding it by one repeat loops without a seam, and its blurred ends never reach the card. Moving it with a transform keeps the blur from repainting.
const courseBrand = "#2D7EFF";
const courseGlowColors = `${courseBrand}, #38B6FF, #0FB5A4`;
const courseGlow = `linear-gradient(to right in oklab, ${courseGlowColors}, ${courseGlowColors}, ${courseGlowColors}, ${courseBrand})`;

// The UI Design Course mark, traced from its 500px artwork so it stays crisp at any size.
function CourseLogo({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 500 500" shapeRendering="crispEdges" className={className}>
      <rect width="500" height="500" fill="#1E1E1E" />
      <path
        fill="#ECECEC"
        d="M137 163h25v150h-25zM162 313h50v25h-50zM212 163h25v150h-25zM262 163h100v25H262zM299 188h25v125h-25zM262 313h100v25H262z"
      />
    </svg>
  );
}

function Hero() {
  return (
    <section className="space-y-6 pt-12 pb-8">
      <h1 className="max-w-3xl text-heading-2 text-fg">A systematic design language you can hand to any AI.</h1>
      <p className="max-w-2xl text-body-lg text-fg-muted">
        Tune the color, type and radius on the left. Every token, component and rule on this page updates live — and the prompt you copy carries all of it.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <PromptDialog>
          <Button><CopyIcon /> Copy prompt</Button>
        </PromptDialog>
        <PromptDialog defaultTab="skill">
          <Button variant="neutral" mode="raised"><BookOpenIcon /> Skill</Button>
        </PromptDialog>
        <PromptDialog defaultTab="install">
          <Button variant="neutral" mode="raised"><TerminalIcon /> Install</Button>
        </PromptDialog>
      </div>
      <a
        href="https://uidesigncourse.com/?utm_source=cards&utm_medium=referral&utm_campaign=promo_card"
        target="_blank"
        rel="noreferrer"
        className="group block max-w-2xl rounded-2xl outline-none focus-visible:shadow-focus"
      >
        <Card className="relative flex items-start gap-4 overflow-hidden p-5 transition group-hover:shadow-md">
          <span aria-hidden className="pointer-events-none absolute -top-7 -left-1/2 h-8 w-[300%] opacity-70 blur-xl motion-safe:animate-[course-glow_6s_linear_infinite]" style={{ backgroundImage: courseGlow }} />
          <CourseLogo className="relative size-16 shrink-0 rounded-xl" />
          <div className="relative flex-1 space-y-1">
            <div className="text-ui-md text-fg">Learn UI design for the AI era</div>
            <p className="text-body-sm text-fg-muted">
              AI can generate an interface in seconds, but it can&apos;t tell you if it&apos;s any good. Learn to direct it, spot what&apos;s off and fix it.
            </p>
          </div>
          <ArrowUpRightIcon aria-hidden className="relative size-5 shrink-0 text-fg-muted transition group-hover:text-fg" />
        </Card>
      </a>
    </section>
  );
}
