import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, WandSparklesIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: CircleCheckIcon,
  danger: CircleAlertIcon,
  warning: TriangleAlertIcon,
  info: InfoIcon,
  highlight: WandSparklesIcon,
};

const alertVariants = cva("flex w-full items-start gap-3 rounded-xl p-4 text-body-sm [&>svg]:size-5 [&>svg]:shrink-0", {
  variants: {
    variant: { solid: "text-white", soft: "text-fg", outline: "bg-floating text-fg shadow-md" },
    status: { success: "", danger: "", warning: "", info: "", highlight: "" },
  },
  compoundVariants: [
    { variant: "solid", status: "success", class: "bg-success" },
    { variant: "solid", status: "danger", class: "bg-danger" },
    { variant: "solid", status: "warning", class: "bg-warning" },
    { variant: "solid", status: "info", class: "bg-info" },
    { variant: "solid", status: "highlight", class: "bg-highlight" },
    { variant: "soft", status: "success", class: "bg-success-subtle [&>svg]:text-success" },
    { variant: "soft", status: "danger", class: "bg-danger-subtle [&>svg]:text-danger" },
    { variant: "soft", status: "warning", class: "bg-warning-subtle [&>svg]:text-warning" },
    { variant: "soft", status: "info", class: "bg-info-subtle [&>svg]:text-info" },
    { variant: "soft", status: "highlight", class: "bg-highlight-subtle [&>svg]:text-highlight" },
    { variant: "outline", status: "success", class: "[&>svg]:text-success" },
    { variant: "outline", status: "danger", class: "[&>svg]:text-danger" },
    { variant: "outline", status: "warning", class: "[&>svg]:text-warning" },
    { variant: "outline", status: "info", class: "[&>svg]:text-info" },
    { variant: "outline", status: "highlight", class: "[&>svg]:text-highlight" },
  ],
  defaultVariants: { variant: "soft", status: "info" },
});

type Variant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;
type Status = NonNullable<VariantProps<typeof alertVariants>["status"]>;

const stockVariants = {
  default: { variant: "soft", status: "info" },
  destructive: { variant: "soft", status: "danger" },
} as const satisfies Record<string, { variant: Variant; status: Status }>;

function isComposed(children: React.ReactNode) {
  return React.Children.toArray(children).some((c) => React.isValidElement(c) && (c.type === AlertTitle || c.type === AlertDescription));
}

function Alert({
  className,
  variant,
  status,
  title,
  children,
  onDismiss,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  variant?: Variant | keyof typeof stockVariants | null;
  status?: Status | null;
  title?: React.ReactNode;
  onDismiss?: () => void;
}) {
  const stock = variant && variant in stockVariants ? stockVariants[variant as keyof typeof stockVariants] : undefined;
  const resolvedVariant = (stock ? stock.variant : variant) as Variant | null | undefined;
  const resolvedStatus = status ?? stock?.status ?? "info";
  const Icon = icons[resolvedStatus];
  const composed = title === undefined && isComposed(children);
  const dismiss = onDismiss && (
    <button
      onClick={onDismiss}
      aria-label="Dismiss"
      className={cn("-m-1 rounded-sm p-1 opacity-60 transition hover:opacity-100 [&_svg]:size-4", composed && "absolute top-4 right-4")}
    >
      <XIcon />
    </button>
  );
  if (composed) {
    return (
      <div
        role="alert"
        data-slot="alert"
        data-variant={resolvedVariant ?? "soft"}
        className={cn(
          alertVariants({ variant: resolvedVariant, status: resolvedStatus }),
          "group/alert relative grid grid-cols-1 gap-y-1 has-[>svg]:grid-cols-[auto_1fr]",
          className,
        )}
        {...props}
      >
        {children}
        {dismiss}
      </div>
    );
  }
  return (
    <div role="alert" data-slot="alert" data-variant={resolvedVariant ?? "soft"} className={cn(alertVariants({ variant: resolvedVariant, status: resolvedStatus }), className)} {...props}>
      <Icon />
      <div className="flex-1 space-y-1">
        {title && <div className="text-ui-sm">{title}</div>}
        {children && <div className={cn("text-body-sm", resolvedVariant === "solid" ? "opacity-90" : "text-fg-muted")}>{children}</div>}
      </div>
      {dismiss}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-1 text-ui-sm group-has-[>svg]/alert:col-start-2", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-1 grid justify-items-start gap-1 text-body-sm text-fg-muted group-has-[>svg]/alert:col-start-2 group-data-[variant=solid]/alert:text-white/90",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
