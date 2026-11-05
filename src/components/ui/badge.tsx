import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type Status = "neutral" | "primary" | "success" | "warning" | "danger" | "info" | "highlight" | "caution";

const tones: Record<Status, Record<"solid" | "tint" | "soft" | "outline", string>> = {
  neutral: { solid: "bg-neutral text-white", tint: "bg-neutral-line text-neutral-fg", soft: "bg-control text-fg-muted shadow-button", outline: "text-neutral ring-neutral-line" },
  primary: { solid: "bg-primary text-primary-foreground", tint: "bg-primary-subtle-strong text-primary", soft: "bg-primary-subtle text-primary shadow-badge", outline: "text-primary ring-primary-subtle-stronger" },
  success: { solid: "bg-success text-white", tint: "bg-success-line text-success-fg", soft: "bg-success-subtle text-success-fg shadow-badge", outline: "text-success ring-success-line" },
  warning: { solid: "bg-warning text-white", tint: "bg-warning-line text-warning-fg", soft: "bg-warning-subtle text-warning-fg shadow-badge", outline: "text-warning ring-warning-line" },
  danger: { solid: "bg-danger text-white", tint: "bg-danger-line text-danger-fg", soft: "bg-danger-subtle text-danger-fg shadow-badge", outline: "text-danger ring-danger-line" },
  info: { solid: "bg-info text-white", tint: "bg-info-line text-info-fg", soft: "bg-info-subtle text-info-fg shadow-badge", outline: "text-info ring-info-line" },
  highlight: { solid: "bg-highlight text-white", tint: "bg-highlight-line text-highlight-fg", soft: "bg-highlight-subtle text-highlight-fg shadow-badge", outline: "text-highlight ring-highlight-line" },
  caution: { solid: "bg-caution text-white", tint: "bg-caution-line text-caution-fg", soft: "bg-caution-subtle text-caution-fg shadow-badge", outline: "text-caution ring-caution-line" },
};

const badgeBase = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap tabular-nums transition duration-200 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        small: "h-4 gap-1 px-2 text-overline-2xs [&_svg]:size-3",
        medium: "h-5 gap-1 px-2 text-ui-xs [&_svg]:size-3",
      },
      variant: { solid: "", tint: "", soft: "", outline: "bg-transparent ring-1 ring-inset" },
    },
    defaultVariants: { size: "medium", variant: "soft" },
  },
);

type CardsVariant = "solid" | "tint" | "soft" | "outline";
type StockVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

const stockVariants: Record<StockVariant, { variant: CardsVariant; status: Status; extra?: string }> = {
  default: { variant: "solid", status: "primary" },
  secondary: { variant: "soft", status: "neutral" },
  destructive: { variant: "solid", status: "danger" },
  outline: { variant: "outline", status: "neutral" },
  ghost: { variant: "soft", status: "neutral", extra: "bg-transparent shadow-none" },
  link: { variant: "soft", status: "primary", extra: "bg-transparent shadow-none underline-offset-4 hover:underline" },
};

function resolveBadge(variant: CardsVariant | StockVariant | null | undefined, status: Status | undefined) {
  const stock = variant && variant in stockVariants && variant !== "outline" ? stockVariants[variant as StockVariant] : undefined;
  if (variant === "outline") return { variant: "outline" as const, status: status ?? "neutral", extra: undefined };
  if (stock) return { variant: stock.variant, status: status ?? stock.status, extra: stock.extra };
  return { variant: (variant as CardsVariant | null | undefined) ?? "soft", status: status ?? "neutral", extra: undefined };
}

type BadgeVariantOptions = {
  size?: VariantProps<typeof badgeBase>["size"];
  variant?: CardsVariant | StockVariant | null;
  status?: Status;
  className?: string;
};

/** Accepts the Cards variants (solid, tint, soft, outline + status) and the stock shadcn ones (default, secondary, destructive, outline, ghost, link). */
function badgeVariants({ size, variant, status, className }: BadgeVariantOptions = {}) {
  const r = resolveBadge(variant, status);
  return cn(badgeBase({ size, variant: r.variant }), tones[r.status][r.variant], r.extra, className);
}

function Badge({
  className,
  size,
  variant,
  status,
  dot,
  asChild,
  children,
  ...props
}: React.ComponentProps<"span"> & Omit<BadgeVariantOptions, "className"> & { dot?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp data-slot="badge" data-variant={variant} className={badgeVariants({ size, variant, status, className })} {...props}>
      {asChild ? children : (
        <>
          {dot && <span className="size-1 rounded-full bg-current" />}
          {children}
        </>
      )}
    </Comp>
  );
}

/** Sentence-case status pill used in tables and lists. */
function StatusBadge({ className, status = "neutral", ...props }: React.ComponentProps<"span"> & { status?: Status }) {
  const dot: Record<Status, string> = {
    neutral: "bg-neutral", primary: "bg-primary", success: "bg-success", warning: "bg-warning",
    danger: "bg-danger", info: "bg-info", highlight: "bg-highlight", caution: "bg-caution",
  };
  return (
    <span
      data-slot="status-badge"
      className={cn("inline-flex h-6 items-center gap-2 rounded-full bg-control px-2 text-ui-xs text-fg-muted tabular-nums shadow-button", className)}
      {...props}
    >
      <span className={cn("size-2 rounded-full", dot[status])} />
      {props.children}
    </span>
  );
}

export { Badge, badgeVariants, StatusBadge, type Status };
