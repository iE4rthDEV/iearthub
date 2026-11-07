import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** A pulsing placeholder block. Set its size and shape with className. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-tint motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
