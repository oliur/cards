"use client";

import * as React from "react";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return <RadioPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

function RadioItem({ className, ...props }: React.ComponentProps<typeof RadioPrimitive.Item>) {
  return (
    <RadioPrimitive.Item
      data-slot="radio"
      className={cn(
        "peer grid size-4 shrink-0 place-items-center rounded-full bg-surface shadow-xs outline-none",
        "ring-1 ring-inset ring-line-strong transition duration-200 ease-out",
        "hover:ring-line-focus/40 focus-visible:shadow-focus-primary",
        "data-[state=checked]:bg-primary data-[state=checked]:ring-primary",
        "disabled:pointer-events-none disabled:bg-track disabled:shadow-none disabled:ring-transparent",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="size-2 rounded-full bg-primary-foreground" />
    </RadioPrimitive.Item>
  );
}

const RadioGroupItem = RadioItem;

export { RadioGroup, RadioItem, RadioGroupItem };
