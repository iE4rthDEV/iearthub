import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { BentoCard } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/tool";

type PinnedToolCardProps = {
  tool: Tool;
  variant: "hero" | "wide" | "default";
  pinnedToolCount: number;
  onTogglePin: () => void;
};

export function PinnedToolCard({ tool, variant, pinnedToolCount, onTogglePin }: PinnedToolCardProps) {
  const isHeroCard = variant === "hero";
  const Icon = tool.icon;
  const openLabelClassName = cn(
    "inline-flex min-h-11 items-center gap-1 text-sm font-medium transition-[gap] duration-200 group-hover:gap-2 motion-reduce:transition-none",
    isHeroCard ? "text-white" : "text-brand",
  );

  return (
    <BentoCard
      name={tool.name}
      description={tool.description}
      Icon={Icon}
      featured={isHeroCard}
      cardLink={tool.href ? (
        <Link
          href={tool.href}
          aria-label={`เปิดใช้งาน ${tool.name}`}
          className={cn(
            "absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:-outline-offset-2",
            isHeroCard ? "focus-visible:outline-white" : "focus-visible:outline-brand",
          )}
        />
      ) : undefined}
      className={cn(
        isHeroCard && pinnedToolCount > 1 && "lg:col-span-2",
        isHeroCard && pinnedToolCount > 2 && "lg:row-span-2",
        variant === "wide" && pinnedToolCount > 3 && "lg:col-span-2",
      )}
      background={
        <>
          {!isHeroCard && (
            <SpotlightCard
              theme="light"
              spotlightColor="var(--brand)"
              intensity={0.5}
              borderGlow={0.8}
              spotlightSize={200}
              flare={false}
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={
                {
                  "--spotlight-card-surface": "transparent",
                  "--spotlight-card-shadow": "none",
                  "--spotlight-card-border": "transparent",
                } as CSSProperties
              }
            />
          )}
          <Icon className={cn("absolute -top-6 -right-6 size-48 -rotate-12", isHeroCard ? "text-white/10" : "text-brand/5")} />
        </>
      }
      cta={tool.href ? (
        <span aria-hidden="true" className={cn(openLabelClassName, "ml-auto")}>
          เปิดใช้งาน <ArrowRight className="size-4" />
        </span>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-auto cursor-not-allowed">
              <Button type="button" disabled variant="link" aria-label={`เปิดใช้งาน ${tool.name}`} className={cn(openLabelClassName, "cursor-not-allowed px-0 has-[>svg]:px-0")}>
                เปิดใช้งาน <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>เครื่องมือนี้ยังไม่เปิดให้ใช้งาน</TooltipContent>
        </Tooltip>
      )}
      action={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-pressed="true"
          aria-label={`ปักหมุด ${tool.name}`}
          onClick={onTogglePin}
          className={cn(
            "absolute top-2 right-2 z-20 size-11 rounded-lg text-amber-400 [&_svg]:size-5 [&_svg]:fill-current sm:top-3 sm:right-3",
            isHeroCard ? "hover:bg-white/10 hover:text-amber-400" : "hover:bg-tint hover:text-amber-400",
          )}
        >
          <Star aria-hidden="true" />
        </Button>
      }
    >
      {!tool.href && <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-medium", isHeroCard ? "bg-white/15 text-white" : "bg-tint text-ink-3")}>เร็วๆ นี้</span>}
      {isHeroCard && tool.usage && (
        <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/75">
          <div className="flex flex-col">
            <dt>ครั้งที่ใช้</dt>
            <dd className="order-first font-display text-xl font-bold text-white">{tool.usage.count}</dd>
          </div>
          <div className="flex flex-col">
            <dt>คะแนน</dt>
            <dd className="order-first font-display text-xl font-bold text-white">{tool.usage.rating}</dd>
          </div>
        </dl>
      )}
    </BentoCard>
  );
}
