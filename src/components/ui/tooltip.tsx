"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({ className, sideOffset = 6, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 animate-in rounded-md bg-inverse px-2 py-1 text-body-xs text-fg-inverse shadow-md",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

type ShorthandProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
};

/**
 * Cards shorthand: `<Tooltip content="Save">{trigger}</Tooltip>` (needs a TooltipProvider above).
 * Stock shadcn composition: `<Tooltip><TooltipTrigger/><TooltipContent/></Tooltip>` (provides its own provider).
 */
function Tooltip(props: ShorthandProps | React.ComponentProps<typeof TooltipPrimitive.Root>) {
  if ("content" in props) {
    const { children, content, side = "top", className } = props;
    return (
      <TooltipPrimitive.Root delayDuration={150}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipContent side={side} className={className}>
          {content}
        </TooltipContent>
      </TooltipPrimitive.Root>
    );
  }
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipPrimitive.Provider>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
