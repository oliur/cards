import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// The white button: raised off whatever it sits on by a fine ring and a crisp drop, not a border or a grey fill.
const secondary = "bg-control text-fg shadow-button not-disabled:[&_svg]:text-fg-subtle hover:bg-control-hover";

// A faded light button still glows like a live one in dark mode, so it goes solid grey instead.
const solidDisabledDark = "dark:disabled:bg-control dark:disabled:text-fg-disabled dark:disabled:opacity-100 dark:disabled:shadow-none";

const buttonBase = cva(
  [
    "group relative inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-line-focus",
    "transition-[color,background-color,box-shadow,filter,scale] duration-150 ease-tactile",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:[stroke-width:2.25]",
    "disabled:pointer-events-none disabled:opacity-60 disabled:active:scale-100",
  ],
  {
    variants: {
      variant: { primary: "", neutral: "", danger: "", link: "" },
      mode: { solid: "", outline: "", soft: "", ghost: "", raised: secondary },
      size: {
        medium: "h-9 gap-1 rounded-button px-4 text-ui-sm has-[>svg:first-child]:pl-3 max-md:h-11",
        small: "h-8 gap-1 rounded-button-sm px-4 text-ui-sm has-[>svg:first-child]:pl-3",
        xsmall: "h-7 gap-1 rounded-button-sm px-2 text-ui-sm",
        xxsmall: "h-6 gap-1 rounded-button-sm px-2 text-ui-sm",
      },
      // The squeeze gets deeper as the target gets smaller.
      flat: { true: "", false: "" },
      iconOnly: { true: "px-0 not-disabled:[&_svg]:text-fg-muted has-[>svg:first-child]:pl-0 active:scale-[0.94] disabled:opacity-40", false: "active:scale-[0.97]" },
    },
    compoundVariants: [
      // primary
      { variant: "primary", mode: "solid", class: cn("bg-primary text-primary-foreground shadow-primary hover:bg-primary-hover", solidDisabledDark) },
      { variant: "primary", mode: ["outline", "soft"], class: "bg-control text-primary shadow-button hover:bg-control-hover" },
      { variant: "primary", mode: "ghost", class: "bg-transparent text-primary hover:bg-primary-subtle" },
      // neutral
      { variant: "neutral", mode: "solid", class: cn("bg-inverse text-fg-inverse shadow-inverse hover:bg-inverse-hover", solidDisabledDark) },
      { variant: "neutral", mode: ["outline", "soft"], class: secondary },
      { variant: "neutral", mode: "ghost", class: "bg-transparent text-fg-muted hover:bg-hover hover:text-fg" },
      // danger: solid is the final confirm, outline the softer trigger that opens it
      { variant: "danger", mode: "solid", class: "bg-danger text-white shadow-danger hover:brightness-95" },
      { variant: "danger", mode: "outline", class: "bg-control text-danger-fg shadow-button hover:bg-danger-subtle" },
      { variant: "danger", mode: "soft", class: "bg-danger-subtle text-danger-fg ring-[0.5px] ring-danger-line hover:bg-danger-line" },
      { variant: "danger", mode: "ghost", class: "bg-transparent text-danger hover:bg-danger-subtle" },
      // text link
      { variant: "link", class: "bg-transparent text-primary underline-offset-4 hover:underline" },
      // icon-only squares
      { iconOnly: true, size: "medium", class: "w-9 max-md:w-11" },
      { iconOnly: true, size: "small", class: "w-8" },
      { iconOnly: true, size: "xsmall", class: "w-7" },
      { iconOnly: true, size: "xxsmall", class: "w-6" },
      // flat: no shadow and no squeeze. White buttons take a plain 1px line for their edge instead.
      { flat: true, class: "shadow-none active:scale-100" },
      { flat: true, mode: "raised", class: "ring-1 ring-inset ring-line hover:ring-line-strong" },
      { flat: true, variant: ["primary", "neutral"], mode: ["outline", "soft"], class: "ring-1 ring-inset ring-line hover:ring-line-strong" },
      { flat: true, variant: "danger", mode: "outline", class: "ring-1 ring-inset ring-line hover:ring-line-strong" },
    ],
    defaultVariants: { variant: "primary", mode: "solid", size: "medium", iconOnly: false, flat: false },
  },
);

type BaseProps = VariantProps<typeof buttonBase>;
type StockVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type StockSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
type ButtonVariantOptions = {
  variant?: BaseProps["variant"] | StockVariant;
  mode?: BaseProps["mode"];
  size?: BaseProps["size"] | StockSize;
  iconOnly?: boolean | null;
  flat?: boolean | null;
  className?: string;
};

const stockVariants: Record<StockVariant, { variant: NonNullable<BaseProps["variant"]>; mode?: BaseProps["mode"] }> = {
  default: { variant: "primary", mode: "solid" },
  destructive: { variant: "danger", mode: "solid" },
  outline: { variant: "neutral", mode: "outline" },
  secondary: { variant: "neutral", mode: "soft" },
  ghost: { variant: "neutral", mode: "ghost" },
  link: { variant: "link" },
};

const stockSizes: Record<StockSize, { size: NonNullable<BaseProps["size"]>; iconOnly?: boolean }> = {
  default: { size: "medium" },
  lg: { size: "medium" },
  sm: { size: "small" },
  xs: { size: "xxsmall" },
  icon: { size: "medium", iconOnly: true },
  "icon-lg": { size: "medium", iconOnly: true },
  "icon-sm": { size: "small", iconOnly: true },
  "icon-xs": { size: "xxsmall", iconOnly: true },
};

function resolveButton({ variant, mode, size, iconOnly, flat }: ButtonVariantOptions) {
  const v = variant && variant in stockVariants ? stockVariants[variant as StockVariant] : undefined;
  const s = size && size in stockSizes ? stockSizes[size as StockSize] : undefined;
  return {
    variant: v ? v.variant : (variant as BaseProps["variant"]),
    mode: mode ?? v?.mode,
    size: s ? s.size : (size as BaseProps["size"]),
    iconOnly: iconOnly ?? s?.iconOnly,
    flat,
  };
}

/** Accepts the Cards API (variant/mode/size/iconOnly/flat) and the stock shadcn one (default, destructive, outline, secondary, ghost, link; default, xs, sm, lg, icon*). */
function buttonVariants({ variant, mode, size, iconOnly, flat, className }: ButtonVariantOptions = {}) {
  return buttonBase({ ...resolveButton({ variant, mode, size, iconOnly, flat }), class: className });
}

type ButtonProps = React.ComponentProps<"button"> &
  Omit<ButtonVariantOptions, "className"> & { asChild?: boolean };

function Button({ className, variant, mode, size, iconOnly, flat, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, mode, size, iconOnly, flat }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
