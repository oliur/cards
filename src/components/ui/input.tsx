import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputWrapper = cva(
  [
    "group relative flex w-full items-center overflow-hidden bg-field text-fg shadow-field",
    "ring-1 ring-inset ring-field-line transition duration-200 ease-out",
    "hover:ring-line-strong",
    "focus-within:shadow-focus focus-within:ring-line-focus!",
    "has-[input:disabled]:pointer-events-none has-[input:disabled]:bg-subtle has-[input:disabled]:shadow-none has-[input:disabled]:ring-transparent",
    "[&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-fg-subtle focus-within:[&_svg]:text-fg-muted",
  ],
  {
    variants: {
      size: {
        medium: "h-9 gap-2 rounded-lg px-3 max-md:h-11",
        small: "h-8 gap-2 rounded-md px-3",
        xsmall: "h-7 gap-2 rounded-md px-2 [&_svg]:size-4",
      },
      hasError: {
        true: "ring-danger hover:ring-danger focus-within:shadow-focus-danger focus-within:ring-danger!",
      },
    },
    defaultVariants: { size: "medium" },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputWrapper> & {
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    wrapperClassName?: string;
  };

function Input({ className, wrapperClassName, size, hasError, leading, trailing, ...props }: InputProps) {
  const invalid = hasError ?? (props["aria-invalid"] === true || props["aria-invalid"] === "true" ? true : undefined);
  return (
    <div data-slot="input" className={cn(inputWrapper({ size, hasError: invalid }), wrapperClassName)}>
      {leading}
      <input
        className={cn(
          "h-full w-full min-w-0 bg-transparent text-body-sm text-fg outline-none",
          "placeholder:text-fg-subtle group-hover:placeholder:text-fg-muted disabled:text-fg-disabled disabled:placeholder:text-fg-disabled",
          className,
        )}
        {...props}
      />
      {trailing}
    </div>
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "block min-h-24 w-full resize-none rounded-xl bg-field px-3 py-3 text-body-sm text-fg shadow-field outline-none",
        "ring-1 ring-inset ring-field-line transition duration-200 ease-out placeholder:text-fg-subtle",
        "hover:ring-line-strong hover:placeholder:text-fg-muted focus:shadow-focus focus:ring-line-focus",
        "aria-invalid:ring-danger aria-invalid:hover:ring-danger aria-invalid:focus:shadow-focus-danger aria-invalid:focus:ring-danger",
        className,
      )}
      {...props}
    />
  );
}

export { Input, Textarea };
