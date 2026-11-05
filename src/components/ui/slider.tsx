"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Slider({ className, defaultValue, value, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = Array.isArray(value) ? value.length : Array.isArray(defaultValue) ? defaultValue.length : 1;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      className={cn("relative flex h-4 w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full overflow-hidden rounded-full bg-track">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <SliderPrimitive.Thumb key={i} className="block size-4 rounded-full bg-white shadow-sm outline-none transition focus-visible:shadow-focus-primary" />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
