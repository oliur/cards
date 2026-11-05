import { ChevronDownIcon } from "lucide-react";
import { systemName } from "@/design-system/guidelines";

/** The first screen: the wordmark on a gradient that fades into the page below. */
export function OpeningHeader() {
  return (
    <section aria-label={systemName} className="relative z-40 h-svh bg-linear-to-b from-neutral-800 to-canvas">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <p className="text-heading-1 text-fg sm:text-[96px] sm:leading-[96px]">{systemName}</p>
      </div>

      <a
        href="#studio"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md px-2 py-1 text-ui-sm text-fg-muted outline-none transition hover:text-fg focus-visible:shadow-focus"
      >
        Scroll <ChevronDownIcon aria-hidden className="size-4" />
      </a>
    </section>
  );
}
