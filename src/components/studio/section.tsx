import * as React from "react";
import { cn } from "@/lib/utils";

export function DocSection({ id, title, description, children, className }: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-8 space-y-8 py-12", className)}>
      <header className="max-w-2xl space-y-2">
        <h2 className="text-heading-5 text-fg">{title}</h2>
        {description && <p className="text-body-md text-fg-muted">{description}</p>}
      </header>
      {children}
    </section>
  );
}

export function SubHeading({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h3 className="text-ui-md text-fg">{children}</h3>
      {hint && <span className="text-body-xs text-fg-subtle">{hint}</span>}
    </div>
  );
}

export function Specimen({ label, children, className, bodyClassName }: { label?: string; children: React.ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-surface shadow-sm", className)}>
      {label && (
        <div className="border-b border-line px-6 py-3 text-ui-xs text-fg-muted">{label}</div>
      )}
      <div className={cn("p-6", bodyClassName)}>{children}</div>
    </div>
  );
}
