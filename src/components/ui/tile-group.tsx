"use client";

import * as React from "react";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * A single-choice group of tiles (plans, layouts, swatches, options).
 * Hover darkens the border only (like form fields). Selected tiles rise a level: raised + the
 * system shadow + a 1px border: black/50% in light mode, white/50% in dark mode. In dark mode the
 * border replaces the light edge cards carry, so a selected tile never has two outlines.
 */
function TileGroup({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return <RadioPrimitive.Root data-slot="tile-group" className={cn("grid gap-2", className)} {...props} />;
}

function Tile({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Item>) {
  return (
    <RadioPrimitive.Item
      data-slot="tile"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-parent-lg p-2 text-ui-xs text-fg-muted outline-none",
        "ring-1 ring-inset ring-line transition duration-200 ease-out",
        "hover:ring-line-strong hover:text-fg focus-visible:shadow-focus",
        "data-[state=checked]:bg-raised data-[state=checked]:text-fg data-[state=checked]:shadow-sm",
        "data-[state=checked]:ring-[rgb(0_0_0/0.5)] dark:data-[state=checked]:ring-[rgb(255_255_255/0.5)] dark:data-[state=checked]:shadow-control",
        "data-[state=checked]:focus-visible:shadow-focus dark:data-[state=checked]:focus-visible:shadow-focus",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { TileGroup, Tile };
