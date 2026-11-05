import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge that `text-ui-sm` is a font size, not a color,
// so `cn("text-ui-sm", "text-fg-muted")` keeps both.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6"] },
        { text: ["ui-xl", "ui-lg", "ui-md", "ui-sm", "ui-xs"] },
        { text: ["body-xl", "body-lg", "body-md", "body-sm", "body-xs"] },
        { text: ["overline-md", "overline-sm", "overline-xs", "overline-2xs"] },
      ],
      rounded: [{ rounded: ["button", "button-sm", (v: string) => /^(parent|concentric)-/.test(v)] }],
      shadow: [{ shadow: ["focus", "focus-primary", "focus-danger", "field", "control", "button", "primary", "inverse", "danger", "badge", "menu"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
