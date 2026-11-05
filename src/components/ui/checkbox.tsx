"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer grid size-4 shrink-0 place-items-center rounded-xs bg-surface shadow-xs outline-none",
        "ring-1 ring-inset ring-line-strong transition duration-200 ease-out",
        "hover:ring-line-focus/40 focus-visible:shadow-focus-primary",
        "data-[state=checked]:bg-primary data-[state=checked]:ring-primary data-[state=checked]:hover:bg-primary-hover",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:ring-primary",
        "disabled:pointer-events-none disabled:bg-track disabled:shadow-none disabled:ring-transparent",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-primary-foreground">
        {props.checked === "indeterminate" ? (
          <svg viewBox="0 0 10 2" className="w-2" fill="none"><path d="M1 1h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        ) : (
          <svg viewBox="0 0 10 8" className="w-3" fill="none"><path d="M1 4.2 3.6 6.8 9 1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
