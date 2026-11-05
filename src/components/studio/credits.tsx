import { ArrowUpRightIcon } from "lucide-react";
import { repoUrl, systemName } from "@/design-system/guidelines";

const groups: { title: string; items: { name: string; href: string; note: string }[] }[] = [
  {
    title: "Design foundations",
    items: [
      { name: "shadcn/ui", href: "https://ui.shadcn.com", note: "Component conventions and composition" },
      { name: "tactile-design", href: "https://github.com/kosta4a/tactile-design", note: "Button, badge and dropdown rules" },
    ],
  },
  {
    title: "Framework & styling",
    items: [
      { name: "Next.js", href: "https://nextjs.org", note: "App framework" },
      { name: "React", href: "https://react.dev", note: "UI library" },
      { name: "Tailwind CSS", href: "https://tailwindcss.com", note: "Styling and theme tokens" },
      { name: "class-variance-authority", href: "https://cva.style", note: "Component variants" },
      { name: "tailwind-merge", href: "https://github.com/dcastil/tailwind-merge", note: "Class merging" },
      { name: "clsx", href: "https://github.com/lukeed/clsx", note: "Class composition" },
    ],
  },
  {
    title: "Components & color",
    items: [
      { name: "Radix UI", href: "https://www.radix-ui.com", note: "Accessible primitives" },
      { name: "culori", href: "https://culorijs.org", note: "Color ramps and contrast" },
    ],
  },
  {
    title: "Icons & type",
    items: [
      { name: "Lucide", href: "https://lucide.dev", note: "Icon set" },
      { name: "Simple Icons", href: "https://simpleicons.org", note: "Brand logos" },
      { name: "Inter", href: "https://rsms.me/inter/", note: "By Rasmus Andersson" },
      { name: "DM Mono", href: "https://fonts.google.com/specimen/DM+Mono", note: "By Colophon Foundry" },
      { name: "Google Fonts", href: "https://fonts.google.com", note: "Optional typefaces" },
    ],
  },
];

const legalLinks = [
  { label: "MIT License", href: `${repoUrl}/blob/main/LICENSE` },
  { label: "Third-party notices", href: `${repoUrl}/blob/main/THIRD_PARTY_NOTICES.md` },
];

export function Credits() {
  return (
    <footer className="space-y-4 py-8">
      <h2 className="text-ui-xs text-fg-muted">Credits</h2>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g) => (
          <section key={g.title} className="min-w-0 space-y-2">
            <h3 className="text-body-xs text-fg-subtle">{g.title}</h3>
            <ul className="space-y-2 text-body-xs text-fg-muted">
              {g.items.map((i) => (
                <li key={i.name}>
                  <a
                    href={i.href}
                    target="_blank"
                    rel="noreferrer"
                    title={i.note}
                    className="rounded-xs outline-none hover:text-fg hover:underline hover:underline-offset-4 focus-visible:shadow-focus"
                  >
                    {i.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 text-body-xs text-fg-muted">
        {legalLinks.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xs outline-none hover:text-fg hover:underline hover:underline-offset-4 focus-visible:shadow-focus"
          >
            {l.label}
          </a>
        ))}
        <span>{systemName} is not affiliated with shadcn.</span>
        <span className="sm:ml-auto">
          Designed and built by Justin and{" "}
          <a
            href="https://oliur.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xs text-fg outline-none hover:underline hover:underline-offset-4 focus-visible:shadow-focus"
          >
            Oliur<ArrowUpRightIcon aria-hidden className="size-4" />
          </a>
        </span>
      </div>
    </footer>
  );
}
