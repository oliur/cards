"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Switch({ className, size = "default", ...props }: React.ComponentProps<typeof SwitchPrimitive.Root> & { size?: "default" | "sm" }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "group/switch peer inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-track p-1 outline-none transition duration-200 ease-out",
        "hover:bg-track-strong focus-visible:shadow-focus-primary",
        "data-[state=checked]:bg-switch-on data-[state=checked]:hover:bg-switch-on-hover",
        "disabled:pointer-events-none disabled:bg-subtle disabled:ring-1 disabled:ring-inset disabled:ring-line",
        size === "sm" && "h-5 w-8",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-white shadow-sm dark:shadow-xs",
          "transition-transform duration-200 ease-out data-[state=checked]:translate-x-4",
          size === "sm" && "size-3 data-[state=checked]:translate-x-3",
          "group-disabled/switch:bg-track group-disabled/switch:shadow-none",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
