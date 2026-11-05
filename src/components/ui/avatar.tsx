"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva("relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full", {
  variants: {
    size: {
      "64": "size-16 text-heading-6",
      "48": "size-12 text-ui-lg",
      "40": "size-10 text-ui-md",
      "32": "size-8 text-ui-sm",
      "24": "size-6 text-ui-xs",
    },
    color: {
      gray: "bg-muted text-fg-muted",
      blue: "bg-info-line text-info-fg",
      orange: "bg-warning-line text-warning-fg",
      green: "bg-success-line text-success-fg",
      purple: "bg-highlight-line text-highlight-fg",
      yellow: "bg-caution-line text-caution-fg",
      red: "bg-danger-line text-danger-fg",
    },
  },
  defaultVariants: { size: "40", color: "gray" },
});

const stockSizes = { default: "32", sm: "24", lg: "40" } as const;

function isComposed(children: React.ReactNode) {
  return React.Children.toArray(children).some((c) => React.isValidElement(c) && (c.type === AvatarImage || c.type === AvatarFallback));
}

function Avatar({
  className,
  size,
  color,
  src,
  alt,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  Omit<VariantProps<typeof avatarVariants>, "size"> & { size?: VariantProps<typeof avatarVariants>["size"] | keyof typeof stockSizes; src?: string; alt?: string }) {
  const resolvedSize = size && size in stockSizes ? stockSizes[size as keyof typeof stockSizes] : (size as VariantProps<typeof avatarVariants>["size"]);
  return (
    <AvatarPrimitive.Root data-slot="avatar" className={cn(avatarVariants({ size: resolvedSize, color }), className)} {...props}>
      {src && <AvatarPrimitive.Image src={src} alt={alt} className="size-full object-cover" />}
      {isComposed(children) ? children : <AvatarPrimitive.Fallback className="[font-family:inherit]">{children}</AvatarPrimitive.Fallback>}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full object-cover", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center [font-family:inherit]", className)}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn("absolute right-0 bottom-0 z-10 inline-flex size-3 select-none items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-line-inverse [&>svg]:size-2", className)}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex -space-x-2 *:ring-2 *:ring-line-inverse", className)} {...props} />;
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn("relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-ui-sm text-fg-muted ring-2 ring-line-inverse [&>svg]:size-4", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount };
