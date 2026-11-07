import { CircleAlert, CircleCheck, CircleDashed, LoaderCircle } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { JsonValidation } from "@/lib/json-tools";
import { cn } from "@/lib/utils";

type JsonStatusBadgeProps = {
  validation: JsonValidation;
  onGoToError: () => void;
  isChecking: boolean;
};

export function JsonStatusBadge({ validation, onGoToError, isChecking }: JsonStatusBadgeProps) {
  const badgeClassName = "inline-flex min-w-0 max-w-full items-center gap-1 rounded-2xl px-2 py-1 text-left text-xs font-medium whitespace-normal wrap-anywhere sm:gap-1.5 sm:px-3 [&_svg]:shrink-0";
  // The key remounts the inner span on every status change, which replays the entrance animation.
  const statusKey = isChecking ? "checking" : validation.status;

  return (
    <span role="status" className="inline-flex min-w-0 max-w-full align-middle">
      <span key={statusKey} className="inline-flex min-w-0 max-w-full animate-badge-in motion-reduce:animate-none">
        {isChecking && (
          <span className={cn(badgeClassName, "bg-tint text-brand")}>
            <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> กำลังตรวจสอบ…
          </span>
        )}

        {!isChecking && validation.status === "empty" && (
          <span className={cn(badgeClassName, "bg-tint text-ink-3")}>
            <CircleDashed className="size-3.5" aria-hidden="true" /> ยังไม่มีข้อมูล
          </span>
        )}

        {!isChecking && validation.status === "valid" && (
          <span className={cn(badgeClassName, "bg-emerald-100 text-emerald-800")}>
            <CircleCheck className="size-3.5" aria-hidden="true" /> JSON ถูกต้อง
          </span>
        )}

        {!isChecking && validation.status === "invalid" && validation.position && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onGoToError}
                className={cn(
                  badgeClassName,
                  // The ::after area keeps the 44px touch target while the badge itself stays as tall as the other statuses.
                  "relative cursor-pointer bg-destructive/10 text-destructive after:absolute after:-inset-x-1 after:-inset-y-2.5 hover:bg-destructive/15 focus-visible:outline-2 focus-visible:outline-destructive",
                )}
              >
                <CircleAlert className="size-3.5" aria-hidden="true" />
                <span>
                  JSON ไม่ถูกต้อง
                  <span className="sr-only sm:not-sr-only"> · บรรทัด {validation.position.line} คอลัมน์ {validation.position.column}</span>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre-line">{`${validation.rawMessage}\n(กดเพื่อไปที่จุดผิด)`}</TooltipContent>
          </Tooltip>
        )}

        {!isChecking && validation.status === "invalid" && !validation.position && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(badgeClassName, "bg-destructive/10 text-destructive")}>
                <CircleAlert className="size-3.5" aria-hidden="true" /> JSON ไม่ถูกต้อง
              </span>
            </TooltipTrigger>
            <TooltipContent>{validation.rawMessage}</TooltipContent>
          </Tooltip>
        )}
      </span>
    </span>
  );
}
