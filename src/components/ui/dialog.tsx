"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogPortal = DialogPrimitive.Portal;

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-overlay backdrop-blur-[6px] data-[state=open]:animate-[ds-fade_200ms_ease-out]", className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean; showCloseButton?: boolean }) {
  const closable = showClose ?? showCloseButton ?? true;
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-hidden",
          "rounded-3xl bg-floating shadow-lg outline-none data-[state=open]:animate-in",
          "[&>:not([data-slot])]:px-5 [&>:not([data-slot])]:pb-5",
          className,
        )}
        {...props}
      >
        {children}
        {closable && (
          <DialogPrimitive.Close
            aria-label="Close"
            data-slot="dialog-close"
            className="absolute top-4 right-4 flex size-6 items-center justify-center rounded-md text-fg-muted transition hover:bg-hover hover:text-fg [&_svg]:size-5"
          >
            <XIcon />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-ui-md text-fg", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-body-sm text-fg-muted", className)} {...props} />;
}

function DialogHeader({ className, icon, title, description, children, ...props }: Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}) {
  if (title === undefined && icon === undefined && description === undefined) {
    return (
      <div data-slot="dialog-header" className={cn("flex flex-col gap-1 p-5 pr-12", className)} {...props}>
        {children}
      </div>
    );
  }
  return (
    <div data-slot="dialog-header" className={cn("flex items-start gap-4 p-5 pr-12", className)} {...props}>
      {icon && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-fg-muted ring-1 ring-inset ring-line [&_svg]:size-5">
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <DialogPrimitive.Title className="text-ui-md text-fg">{title}</DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="text-body-sm text-fg-muted">{description}</DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        )}
        {children}
      </div>
    </div>
  );
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-t border-line p-5", className)} {...props} />;
}

function DialogFooter({ className, showCloseButton = false, children, ...props }: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  return (
    <div data-slot="dialog-footer" className={cn("flex items-center justify-end gap-3 border-t border-line px-5 py-4", className)} {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
};
