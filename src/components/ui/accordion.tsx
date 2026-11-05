"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-line last:border-b-0", className)} {...props} />;
}

/** Header row: the trigger fills it; `action` sits beside it (never inside the button). */
function AccordionTrigger({ className, children, action, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { action?: React.ReactNode }) {
  return (
    <AccordionPrimitive.Header className="flex items-center gap-2">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-2 py-4 text-left text-ui-sm text-fg outline-none transition",
          "hover:text-fg focus-visible:shadow-focus [&_svg]:size-5",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="shrink-0 text-fg-subtle transition-transform duration-200 group-hover:text-fg-muted group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
      {action}
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="-mx-1 overflow-hidden px-1 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-5 text-body-sm text-fg-muted", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
