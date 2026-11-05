import * as React from "react";
import { gradientCss, type GradientId } from "@/lib/gradients";

/** Stands in wherever an image would go. Decorative, so it is hidden from screen readers. */
function ImagePlaceholder({ gradient, style, ...props }: React.ComponentProps<"div"> & { gradient: GradientId }) {
  return <div aria-hidden data-slot="image-placeholder" style={{ backgroundImage: gradientCss(gradient), ...style }} {...props} />;
}

export { ImagePlaceholder };
