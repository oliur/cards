"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;

const stockSizes = { default: "medium", sm: "small" } as const;

function SelectTrigger({ className, children, size: sizeProp = "medium", ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "medium" | "small" | "xsmall" | "default" | "sm" }) {
  const size = sizeProp in stockSizes ? stockSizes[sizeProp as keyof typeof stockSizes] : sizeProp;
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "group flex w-full items-center gap-2 bg-control text-left text-body-sm text-fg shadow-button outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-line-focus",
        "transition-[color,background-color,box-shadow,scale] duration-150 ease-tactile [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:[stroke-width:2.25]",
        "hover:bg-control-hover active:scale-[0.97] disabled:active:scale-100 data-[state=open]:bg-control-hover",
        "data-placeholder:text-fg-subtle [&>span]:flex [&>span]:flex-1 [&>span]:items-center [&>span]:gap-2 [&>span]:truncate",
        size === "medium" && "h-9 rounded-lg pr-3 pl-3 max-md:h-11",
        size === "small" && "h-8 rounded-md pr-2 pl-3",
        size === "xsmall" && "h-7 rounded-md pr-2 pl-2",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4! text-fg-subtle transition-[color,rotate] duration-150 ease-tactile group-data-[state=open]:rotate-180 group-hover:text-fg-muted" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={8}
        className={cn(
          "z-50 max-h-[min(var(--radix-select-content-available-height),320px)] w-(--radix-select-trigger-width) min-w-40 overflow-y-auto",
          "origin-(--radix-select-content-transform-origin) rounded-parent-2xl bg-floating p-2 shadow-menu",
          "animate-menu-in data-[state=closed]:animate-menu-out motion-reduce:animate-menu-fade-in motion-reduce:data-[state=closed]:animate-menu-fade-out",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-concentric-2 p-2 text-body-sm text-fg-muted outline-none select-none transition-colors duration-150 ease-tactile not-first:mt-1",
        // The chosen item carries no tick: its stronger fill and full-ink text say it, and stay a step past a highlight.
        "data-highlighted:bg-hover data-highlighted:text-fg data-[state=checked]:bg-selected data-[state=checked]:text-fg data-disabled:pointer-events-none data-disabled:text-fg-disabled",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cn("px-2 py-1 text-overline-xs text-fg-subtle", className)} {...props} />;
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn("pointer-events-none -mx-2 my-2 h-px bg-line", className)} {...props} />;
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn("flex cursor-default items-center justify-center py-1 text-fg-subtle [&_svg]:size-4", className)} {...props}>
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn("flex cursor-default items-center justify-center py-1 text-fg-subtle [&_svg]:size-4", className)} {...props}>
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectValue,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
