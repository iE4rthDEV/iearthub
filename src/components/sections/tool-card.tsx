import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Tool } from "@/types/tool";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  tool: Tool;
  isPinned: boolean;
  /** True when the pin limit is reached and this card is not pinned, so it cannot be pinned. */
  isPinDisabled?: boolean;
  onTogglePin: () => void;
  variant?: "hero" | "wide" | "default";
  /** The pinned grid's count controls card spans; catalog cards leave this at zero. */
  pinnedToolCount?: number;
};

export function ToolCard({
  tool,
  isPinned,
  isPinDisabled = false,
  onTogglePin,
  variant = "default",
  pinnedToolCount = 0,
}: ToolCardProps) {
  const isHeroCard = variant === "hero";
  const isReady = Boolean(tool.href);
  const Icon = tool.icon;
  const openLabelClassName = cn(
    "inline-flex items-center gap-1 font-medium transition-[gap] duration-200 group-hover:gap-2 motion-reduce:transition-none",
    isHeroCard ? "text-white" : "text-brand",
  );

  return (
    <article
      className={cn(
        "group relative flex min-w-0 flex-col gap-2 overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.75 hover:border-brand hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        isHeroCard
          ? "bg-brand-hero border border-transparent p-5 text-white sm:p-6"
          : "glass isolate p-4 sm:p-5",
        isHeroCard && pinnedToolCount > 1 && "lg:col-span-2",
        isHeroCard && pinnedToolCount > 2 && "lg:row-span-2",
        variant === "wide" && pinnedToolCount > 3 && "lg:col-span-2",
      )}
    >
      {/* Decoration only: it follows the pointer from the window, so it can sit behind the content (-z-10 inside the isolated card). */}
      {/* The card keeps its own surface and border, so the spotlight's surface, shadow and static border are turned off. */}
      {!isHeroCard && (
        <SpotlightCard
          aria-hidden="true"
          theme="light"
          spotlightColor="var(--brand)"
          intensity={0.5}
          borderGlow={0.8}
          spotlightSize={200}
          flare={false}
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          style={
            {
              "--spotlight-card-surface": "transparent",
              "--spotlight-card-shadow": "none",
              "--spotlight-card-border": "transparent",
            } as CSSProperties
          }
        />
      )}
      <div
        className={cn(
          "grid place-items-center rounded-xl",
          isHeroCard ? "size-13 bg-white/15 text-white" : "size-11 bg-tint text-brand",
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className={cn("mt-1 font-semibold wrap-anywhere", isHeroCard ? "text-xl sm:text-2xl" : "text-base")}>
        {tool.name}
      </h3>
      <p className={cn("text-sm wrap-anywhere", isHeroCard ? "text-white/85" : "text-ink-2")}>
        {tool.description}
      </p>
      {isHeroCard && tool.usage && (
        <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/75">
          <div className="flex flex-col">
            <dt>ครั้งที่ใช้</dt>
            <dd className="order-first font-display text-[22px] font-bold text-white">{tool.usage.count}</dd>
          </div>
          <div className="flex flex-col">
            <dt>คะแนน</dt>
            <dd className="order-first font-display text-[22px] font-bold text-white">{tool.usage.rating}</dd>
          </div>
        </dl>
      )}
      <div className="mt-auto flex min-h-11 flex-wrap items-center justify-between gap-2 pt-1 text-sm">
        {!isReady && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              isHeroCard ? "bg-white/15 text-white" : "bg-tint text-ink-3",
            )}
          >
            เร็วๆ นี้
          </span>
        )}
        {tool.href ? (
          // The ::after overlay stretches the link over the whole card, so clicking anywhere opens the tool.
          // The pin button sits above it with z-10, so it stays clickable.
          <Link
            href={tool.href}
            aria-label={`เปิดใช้งาน ${tool.name}`}
            className={cn(
              openLabelClassName,
              "ml-auto rounded-sm after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2",
              isHeroCard ? "focus-visible:outline-white" : "focus-visible:outline-brand",
            )}
          >
            เปิดใช้งาน <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          // A disabled button ignores the pointer, so the span receives the hover for the tooltip.
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-auto">
                <button
                  type="button"
                  disabled
                  aria-label={`เปิดใช้งาน ${tool.name}`}
                  className={cn(openLabelClassName, "cursor-not-allowed")}
                >
                  เปิดใช้งาน <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </span>
            </TooltipTrigger>
            <TooltipContent>เครื่องมือนี้ยังไม่เปิดให้ใช้งาน</TooltipContent>
          </Tooltip>
        )}
      </div>
      {/* Placed last in the DOM so Tab reaches the open link before the pin button; absolute keeps it top-right. */}
      {/* aria-disabled instead of disabled: Button's disabled style blocks the mouse, so the tooltip would never show. */}
      <Tooltip open={isPinDisabled ? undefined : false}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-pressed={isPinned}
            aria-disabled={isPinDisabled}
            aria-label={`ปักหมุด ${tool.name}`}
            onClick={isPinDisabled ? undefined : onTogglePin}
            className={cn(
              "absolute top-2 right-2 z-10 size-11 cursor-pointer rounded-lg aria-pressed:text-amber-400 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent [&_svg]:size-5 aria-pressed:[&_svg]:fill-current sm:top-3 sm:right-3",
              isHeroCard
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-ink-3 hover:bg-tint hover:text-ink-3",
            )}
          >
            <Star aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>ปักหมุดครบแล้ว เอาอันอื่นออกก่อน</TooltipContent>
      </Tooltip>
    </article>
  );
}
