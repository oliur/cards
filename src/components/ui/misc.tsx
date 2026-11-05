import * as React from "react";
import { cn } from "@/lib/utils";

function Divider({ className, label, ...props }: React.ComponentProps<"div"> & { label?: React.ReactNode }) {
  if (!label) return <div role="separator" className={cn("h-px w-full bg-line", className)} {...props} />;
  return (
    <div role="separator" className={cn("flex items-center gap-3 text-overline-2xs text-fg-subtle", className)} {...props}>
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-xs bg-surface px-1 font-sans text-ui-xs text-fg-subtle ring-1 ring-inset ring-line", className)}
      {...props}
    />
  );
}

function Progress({ value, className, status = "primary" }: { value: number; className?: string; status?: "primary" | "success" | "warning" | "danger" }) {
  const fill = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-danger" }[status];
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className={cn("h-2 w-full overflow-hidden rounded-full bg-track", className)}>
      <div className={cn("h-full rounded-full transition-all duration-300", fill)} style={{ width: `${value}%` }} />
    </div>
  );
}

export { Divider, Kbd, Progress };
