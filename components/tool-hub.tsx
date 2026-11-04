"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Navbar } from "@/components/navbar";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, tools, type Category } from "@/lib/tools";

const favoritesKey = "hub.favs";
const defaultFavoriteIds = ["sum", "qr", "json", "bg"];
const pinnedCardVariants = ["hero", "wide", "default", "default"] as const;

export function ToolHub() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchText, setSearchText] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(defaultFavoriteIds);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedIds: unknown = JSON.parse(localStorage.getItem(favoritesKey) ?? "null");
      if (Array.isArray(savedIds) && savedIds.every((id) => typeof id === "string")) {
        // Read after the first render because localStorage only exists in the browser.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFavoriteIds(savedIds);
      }
    } catch {
      // Fall back to the default pins if storage is unavailable or malformed.
    }
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

  function toggleFavorite(toolId: string) {
    const isPinned = favoriteIds.includes(toolId);
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
  const pinnedTools = tools
    .filter((tool) => favoriteIds.includes(tool.id))
    .slice(0, pinnedCardVariants.length);
  const showPinnedTools = selectedCategory === "all" && !searchQuery && pinnedTools.length > 0;
  const toolsHeading = searchQuery ? `ผลการค้นหา (${filteredTools.length})` : "เครื่องมือทั้งหมด";

  return (
    <div id="top" className="mx-auto w-full max-w-290 flex-1 px-4">
      <Navbar />

      <main>
        <section className="pt-16 pb-8 text-center" aria-labelledby="hero-title">
          <h1 id="hero-title" className="mt-4 mb-3 text-[clamp(30px,5.5vw,52px)] leading-tight font-bold tracking-tight">
            เครื่องมือของ iEarthDev<br />
            <span className="bg-[linear-gradient(90deg,#0052FF_13%,#0B1738_89%)] bg-clip-text text-transparent dark:bg-[linear-gradient(90deg,#5B95FF_13%,#DCE6FA_89%)]">
              รวมไว้ในที่เดียว
            </span>
          </h1>
          <p className="mx-auto mb-2 font-display text-sm font-semibold tracking-wide text-brand capitalize">
            your tool hearth
          </p>
          <p className="mx-auto mb-7 max-w-130 text-ink-2">
            กล่องเครื่องมือประจำวัน เปิดได้ทุกที่ที่มีเรา
          </p>

          <div
            role="search"
            className="glass mx-auto flex max-w-140 items-center gap-2.5 rounded-xl py-1.5 px-4 text-ink-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-ring"
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
              className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-base text-ink shadow-none placeholder:text-ink-3 focus-visible:ring-0 dark:bg-transparent md:text-base"
            />
            <kbd className="daisy-kbd h-5.5 min-w-0 rounded-md border border-line bg-solid px-2 font-display text-xs text-ink-3">/</kbd>
          </div>

          <div role="group" aria-label="หมวดหมู่" className="mt-7 mb-6 flex flex-wrap justify-center gap-2">
            {categories.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                type="button"
                variant="ghost"
                aria-pressed={selectedCategory === id}
                onClick={() => setSelectedCategory(id)}
                className="glass h-auto cursor-pointer gap-1.5 rounded-2xl px-3.5 py-1.5 font-normal text-ink-2 has-[>svg]:px-3.5 hover:bg-surface hover:text-brand aria-pressed:border-transparent aria-pressed:bg-brand aria-pressed:text-brand-contrast"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        {showPinnedTools && (
          <section aria-labelledby="pinned-title" className="mb-9">
            <div className="mt-2 mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
              <h2 id="pinned-title" className="text-lg font-bold">ใช้บ่อย</h2>
              <p className="text-[13px] text-ink-3">กดดาวเพื่อปักหมุดเครื่องมือ</p>
            </div>
            <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {pinnedTools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  variant={pinnedCardVariants[index]}
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-3.5">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isPinned={favoriteIds.includes(tool.id)}
                onTogglePin={() => toggleFavorite(tool.id)}
              />
            ))}
            {filteredTools.length === 0 && (
              <p className="glass col-span-full rounded-2xl p-10 text-center wrap-anywhere text-ink-3">
                ไม่พบเครื่องมือที่ตรงกับ “{trimmedSearch}”
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
