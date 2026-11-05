"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("inline-flex items-center gap-px text-ui-sm text-fg has-[[data-optional]]:gap-1", className)}
      {...props}
    />
  );
}

function LabelHint({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-optional className={cn("text-body-sm text-fg-muted", className)} {...props} />;
}

function FieldMessage({ className, hasError, ...props }: React.ComponentProps<"p"> & { hasError?: boolean }) {
  return (
    <p
      data-slot="field-message"
      className={cn(
        "flex items-center gap-1 text-body-xs text-fg-muted [&_svg]:size-4 [&_svg]:shrink-0",
        hasError && "text-danger",
        className,
      )}
      {...props}
    />
  );
}

export { Label, LabelHint, FieldMessage };
