"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ToolCard } from "@/components/sections/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { categories, type Category } from "@/data/categories";
import { tools } from "@/data/tools";
import { cn } from "@/lib/utils";

const favoritesKey = "hub.favs";
const defaultFavoriteIds = ["sum", "qr", "json", "bg"];
const pinnedCardVariants = ["hero", "wide", "default", "default"] as const;
const maxPinnedTools = pinnedCardVariants.length;
const catalogToolIds = new Set(tools.map((tool) => tool.id));

// Placeholder for a pinned card while the saved pins are read; spans match the full pinned layout.
function PinnedCardSkeleton({ variant }: { variant: (typeof pinnedCardVariants)[number] }) {
  return (
    <div
      className={cn(
        "glass flex min-w-0 flex-col gap-2 rounded-2xl p-4 sm:p-5",
        variant === "hero" && "lg:col-span-2 lg:row-span-2",
        variant === "wide" && "lg:col-span-2",
      )}
    >
      <Skeleton className="size-11 rounded-xl" />
      <Skeleton className="mt-1 h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-auto h-5 w-24 self-end" />
    </div>
  );
}

export function ToolHub() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchText, setSearchText] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(defaultFavoriteIds);
  const [isFavoritesLoaded, setIsFavoritesLoaded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedIds: unknown = JSON.parse(localStorage.getItem(favoritesKey) ?? "null");
      if (Array.isArray(savedIds) && savedIds.every((id) => typeof id === "string")) {
        // Read after the first render because localStorage only exists in the browser.
        // Keep only tools that still exist, then cap at the pin limit (old data may hold more than that).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFavoriteIds(savedIds.filter((id) => catalogToolIds.has(id)).slice(0, maxPinnedTools));
      }
    } catch {
      // Fall back to the default pins if storage is unavailable or malformed.
    }
    // Whatever the result, the pins are final now, so the skeleton can go away.
    setIsFavoritesLoaded(true);
  }, []);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.isComposing ||
        document.activeElement === searchInputRef.current
      ) {
        return;
      }

      event.preventDefault();
      searchInputRef.current?.focus();
    }

    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);

  // Count only tools that exist in the catalog, so ids of removed tools never use up a pin slot.
  const pinnedTools = tools.filter((tool) => favoriteIds.includes(tool.id));
  const isPinLimitReached = pinnedTools.length >= maxPinnedTools;
  const hasFullPinnedLayout = pinnedTools.length === maxPinnedTools;

  function toggleFavorite(toolId: string) {
    const isPinned = favoriteIds.includes(toolId);
    if (!isPinned && isPinLimitReached) return;

    const nextFavoriteIds = isPinned
      ? favoriteIds.filter((id) => id !== toolId)
      : [...favoriteIds, toolId];

    setFavoriteIds(nextFavoriteIds);
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(nextFavoriteIds));
    } catch {
      // Pins still work until the page reloads when storage is blocked.
    }
  }

  const trimmedSearch = searchText.trim();
  const searchQuery = trimmedSearch.toLowerCase();
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const searchableText = `${tool.name} ${tool.description}`.toLowerCase();
    return matchesCategory && searchableText.includes(searchQuery);
  });
  const showPinnedTools = selectedCategory === "all" && !searchQuery && pinnedTools.length > 0;
  const toolsHeading = searchQuery ? `ผลการค้นหา (${filteredTools.length})` : "เครื่องมือทั้งหมด";

  return (
    <div id="top" className="page-container">
      <main className="pb-6 sm:pb-10 lg:pb-14">
        <section className="pt-8 pb-6 text-center sm:pt-12 sm:pb-8 lg:pt-16" aria-labelledby="hero-title">
          <h1 id="hero-title" className="mt-2 mb-3 text-[clamp(1.5rem,5vw,3.25rem)] leading-snug font-bold tracking-tight wrap-anywhere sm:mt-4">
            เครื่องมือของ iEarthDev<br />
            <span className="bg-[linear-gradient(90deg,#0052FF_13%,#0B1738_89%)] bg-clip-text text-transparent">
              รวมไว้ในที่เดียว
            </span>
          </h1>
          <p className="mx-auto mb-2 font-display text-sm font-semibold tracking-wide text-brand capitalize">
            your tool hearth
          </p>
          <p className="mx-auto mb-6 max-w-130 text-sm text-ink-2 sm:mb-7 sm:text-base">
            กล่องเครื่องมือประจำวัน เปิดได้ทุกที่ที่มีเรา
          </p>

          <div
            role="search"
            className="glass mx-auto flex w-full max-w-160 items-center gap-2.5 rounded-xl px-3 py-1.5 text-ink-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-ring sm:px-4"
          >
            <Search className="size-5 shrink-0" aria-hidden="true" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="ค้นหาเครื่องมือ…"
              aria-label="ค้นหาเครื่องมือ"
              aria-keyshortcuts="/"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-base text-ink shadow-none placeholder:text-ink-3 focus-visible:ring-0 md:text-base"
            />
            <kbd className="daisy-kbd hidden h-5.5 min-w-0 rounded-md border border-line bg-solid px-2 font-display text-xs text-ink-3 sm:inline-flex">/</kbd>
          </div>

          <div role="group" aria-label="หมวดหมู่" className="mx-auto mt-5 flex max-w-240 flex-wrap justify-center gap-2 sm:mt-7">
            {categories.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                type="button"
                variant="ghost"
                aria-pressed={selectedCategory === id}
                onClick={() => setSelectedCategory(id)}
                className="glass h-auto min-h-11 max-w-full cursor-pointer gap-1.5 rounded-2xl px-3 py-2 font-normal whitespace-normal text-ink-2 has-[>svg]:px-3 hover:border-brand/35 hover:bg-brand/10 hover:text-brand aria-pressed:border-transparent aria-pressed:bg-brand aria-pressed:text-brand-contrast aria-pressed:hover:border-transparent aria-pressed:hover:bg-brand aria-pressed:hover:text-brand-contrast sm:px-3.5 sm:has-[>svg]:px-3.5"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        {!isFavoritesLoaded && selectedCategory === "all" && !searchQuery && (
          <section aria-labelledby="pinned-title" aria-busy="true" className="mb-8 sm:mb-10 lg:mb-12">
            <div className="mt-2 mb-3">
              <h2 id="pinned-title" className="text-lg font-bold">ปักหมุด</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:auto-rows-[minmax(11rem,auto)] lg:grid-cols-4 lg:gap-5 2xl:gap-6">
              {pinnedCardVariants.map((variant, index) => (
                <PinnedCardSkeleton key={index} variant={variant} />
              ))}
            </div>
          </section>
        )}

        {showPinnedTools && isFavoritesLoaded && (
          <section aria-labelledby="pinned-title" className="mb-8 sm:mb-10 lg:mb-12">
            <div className="mt-2 mb-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3">
              <h2 id="pinned-title" className="text-lg font-bold">ปักหมุด</h2>
              <p className="text-xs text-ink-3 sm:text-sm">
                ปักหมุดแล้ว {pinnedTools.length}/{maxPinnedTools} · กดดาวเพื่อปักหมุดเครื่องมือ
              </p>
            </div>
            <div className={cn(
              "grid grid-cols-1 gap-3 sm:gap-4 lg:gap-5 2xl:gap-6",
              pinnedTools.length > 1 && "sm:grid-cols-2",
              pinnedTools.length > 1 && "lg:grid-cols-3",
              pinnedTools.length > 2 && "lg:auto-rows-[minmax(11rem,auto)]",
              hasFullPinnedLayout && "lg:grid-cols-4",
            )}>
              {pinnedTools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  variant={pinnedCardVariants[index]}
                  pinnedToolCount={pinnedTools.length}
                  isPinned
                  onTogglePin={() => toggleFavorite(tool.id)}
                />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="tools-title">
          <h2 id="tools-title" className="mt-2 mb-3 scroll-mt-24 text-lg font-bold" aria-live="polite">
            {toolsHeading}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 2xl:gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isPinned={favoriteIds.includes(tool.id)}
                isPinDisabled={isPinLimitReached && !favoriteIds.includes(tool.id)}
                onTogglePin={() => toggleFavorite(tool.id)}
              />
            ))}
            {filteredTools.length === 0 && (
              <p className="glass col-span-full rounded-2xl px-4 py-8 text-center wrap-anywhere text-ink-3 sm:p-10">
                ไม่พบเครื่องมือที่ตรงกับ “{trimmedSearch}”
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
