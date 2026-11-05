"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;
const TabsContent = TabsPrimitive.Content;

/** Segmented control: a quiet tray with a raised active pill. */
function SegmentedList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="segmented"
      className={cn("inline-flex w-full items-center gap-1 rounded-parent-lg bg-tray p-1", className)}
      {...props}
    />
  );
}

function SegmentedTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "flex h-7 flex-1 items-center justify-center gap-2 rounded-concentric-1 px-2 text-ui-sm whitespace-nowrap text-fg-muted outline-none transition duration-200 ease-out [&_svg]:size-4",
        "hover:text-fg focus-visible:text-fg",
        "data-[state=active]:bg-raised data-[state=active]:text-fg data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/** Line tabs: for page-level navigation between sibling views. */
function TabList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tab-list"
      className={cn("flex items-center gap-6 border-b border-line", className)}
      {...props}
    />
  );
}

function TabTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative -mb-px flex h-12 items-center gap-2 text-ui-sm whitespace-nowrap text-fg-muted outline-none transition duration-200 ease-out [&_svg]:size-5 [&_svg]:text-fg-subtle",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 after:transition",
        "hover:text-fg data-[state=active]:text-fg data-[state=active]:after:opacity-100 data-[state=active]:[&_svg]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

type TabsListVariant = "default" | "line";

const TabsListContext = React.createContext<TabsListVariant>("default");

/** Stock shadcn list: variant "default" is the segmented tray, "line" is the underlined page tabs. */
function TabsList({ className, variant = "default", ...props }: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: TabsListVariant }) {
  return (
    <TabsListContext.Provider value={variant}>
      {variant === "line" ? (
        <TabList className={cn("mb-2", className)} {...props} />
      ) : (
        <SegmentedList className={cn("mb-2 w-fit", className)} {...props} />
      )}
    </TabsListContext.Provider>
  );
}

function TabsTrigger(props: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsListContext);
  return variant === "line" ? <TabTrigger {...props} /> : <SegmentedTrigger {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, SegmentedList, SegmentedTrigger, TabList, TabTrigger };
