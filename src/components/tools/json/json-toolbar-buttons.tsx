import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ViewModeButtonProps = {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  /** Tooltip explaining why the button is disabled. */
  disabledReason?: string;
  children: ReactNode;
};

export function ViewModeButton({ isActive, onClick, disabled, disabledReason, children }: ViewModeButtonProps) {
  const button = (
    <Button
      type="button"
      size="default"
      variant="ghost"
      aria-pressed={isActive}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Shorter than the other header buttons: the pill's padding (p-0.5 / sm:p-1) makes its total height match them.
        "h-7 gap-1 rounded-full px-2 text-xs has-[>svg]:px-2 hover:bg-white/70 sm:h-8 sm:gap-2 sm:px-4 sm:text-sm sm:has-[>svg]:px-3",
        isActive && "bg-white text-brand shadow-xs hover:bg-white hover:text-brand",
      )}
    >
      {children}
    </Button>
  );

  if (!disabled || !disabledReason) return button;

  // A disabled button ignores the pointer, so the span receives the hover for the tooltip.
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{button}</span>
      </TooltipTrigger>
      <TooltipContent>{disabledReason}</TooltipContent>
    </Tooltip>
  );
}

type IconButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
};

export function IconButton({ label, onClick, disabled, children }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className="size-8 rounded-full text-ink-2 sm:size-10"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
