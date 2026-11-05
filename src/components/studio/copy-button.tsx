"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function useCopy(timeout = 1600) {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    },
    [timeout],
  );
  return { copied, copy };
}

export function CopyButton({ text, label = "Copy", ...props }: { text: string | (() => string); label?: string } & Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const { copied, copy } = useCopy();
  return (
    <Button {...props} onClick={() => copy(typeof text === "function" ? text() : text)}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copied" : label}
    </Button>
  );
}
