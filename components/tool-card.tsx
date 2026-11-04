import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  tool: Tool;
  isPinned: boolean;
  onTogglePin: () => void;
  variant?: "hero" | "wide" | "default";
};

export function ToolCard({
  tool,
  isPinned,
  onTogglePin,
  variant = "default",
}: ToolCardProps) {
  const isHeroCard = variant === "hero";
  const Icon = tool.icon;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-2 overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-0.75 hover:border-brand hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        isHeroCard
          ? "bg-brand-hero border border-transparent p-6 text-white sm:col-span-2 sm:row-span-2"
          : "glass p-4.5",
        variant === "wide" && "sm:col-span-2",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-pressed={isPinned}
        aria-label={`ปักหมุด ${tool.name}`}
        onClick={onTogglePin}
        className={cn(
          "absolute top-3 right-3 size-8.5 cursor-pointer rounded-lg aria-pressed:text-amber-400 [&_svg]:size-5 aria-pressed:[&_svg]:fill-current",
          isHeroCard
            ? "text-white/70 hover:bg-white/10 hover:text-white"
            : "text-ink-3 hover:bg-tint hover:text-ink-3",
        )}
      >
        <Star aria-hidden="true" />
      </Button>
      <div
        className={cn(
          "grid place-items-center rounded-xl",
          isHeroCard ? "size-13 bg-white/15 text-white" : "size-11 bg-tint text-brand",
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className={cn("mt-1 font-semibold", isHeroCard ? "text-[22px]" : "text-base")}>
        {tool.name}
      </h3>
      <p className={cn("text-sm", isHeroCard ? "text-white/85" : "text-ink-2")}>
        {tool.description}
      </p>
      {isHeroCard && tool.usage && (
        <dl className="mt-2 flex gap-5 text-xs text-white/75">
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
      <div className="mt-auto flex items-center justify-end pt-1 text-sm">
        <button
          type="button"
          disabled
          aria-label={`เปิด ${tool.name}`}
          title="เครื่องมือนี้ยังไม่เปิดให้ใช้งาน"
          className={cn(
            "inline-flex cursor-not-allowed items-center gap-1 font-medium transition-[gap] duration-200 group-hover:gap-2 motion-reduce:transition-none",
            isHeroCard ? "text-white" : "text-brand",
          )}
        >
          เปิดใช้งาน <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
