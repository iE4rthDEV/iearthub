"use client";

import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function applyNextTheme() {
  const page = document.documentElement;
  const nextTheme = page.dataset.theme === "dark" ? "light" : "dark";
  page.dataset.theme = nextTheme;

  try {
    localStorage.setItem("hub.theme", JSON.stringify(nextTheme));
  } catch {
    // The theme can still change when the browser blocks storage.
  }
}

function toggleTheme() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !document.startViewTransition) {
    applyNextTheme();
    return;
  }

  const transition = document.startViewTransition(applyNextTheme);
  // A second toggle can skip the current animation.
  void transition.ready.catch(() => {});
}

export function Navbar() {
  return (
    <header className="mt-3 xl:sticky xl:top-3 xl:z-20">
      <nav
        className="glass flex h-14 items-center gap-2 rounded-xl bg-solid/95 pr-2 pl-3.5"
        aria-label="หลัก"
      >
        <Link
          href="/"
          aria-label="iEartHub หน้าแรก"
          className="mr-auto flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight"
        >
          <Image src="/icon.svg" width={36} height={36} alt="" unoptimized />
          <span>iEart<span className="text-brand">Hub</span></span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="สลับธีมสว่าง/มืด"
          onClick={toggleTheme}
          className="size-10 cursor-pointer rounded-lg text-ink-2 hover:bg-tint hover:text-brand [&_svg]:size-5"
        >
          <Moon className="dark:hidden" aria-hidden="true" />
          <Sun className="hidden dark:block" aria-hidden="true" />
        </Button>
      </nav>
    </header>
  );
}
