import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-2xl bg-surface shadow-sm", className)}
      {...props}
    />
  );
}

function CardHeader({ className, icon, title, description, action, children, ...props }: Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  if (title === undefined && icon === undefined && description === undefined && action === undefined) {
    return (
      <div
        data-slot="card-header"
        className={cn("grid auto-rows-min items-start gap-x-4 gap-y-1 px-5 pt-5 has-data-[slot=card-action]:grid-cols-[1fr_auto]", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
  return (
    <div data-slot="card-header" className={cn("flex items-start gap-4 p-5", className)} {...props}>
      {icon && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-fg-muted ring-1 ring-inset ring-line [&_svg]:size-5">
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        {title && <div className="text-ui-md text-fg">{title}</div>}
        {description && <div className="text-body-sm text-fg-muted">{description}</div>}
        {children}
      </div>
      {action}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("text-ui-md text-fg", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-body-sm text-fg-muted", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardDivider({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="separator" className={cn("h-px w-full bg-line", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-5", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center gap-3 px-5 py-4", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardDivider, CardContent, CardFooter };
