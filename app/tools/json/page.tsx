import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { JsonFormatter } from "@/components/json-formatter";
import { tools } from "@/lib/tools";

// Name, description, and icon come from the catalog, so the home card and this page always match.
const jsonTool = tools.find((tool) => tool.id === "json");

export const metadata: Metadata = {
  title: jsonTool?.name,
  description: jsonTool?.description,
};

export default function JsonFormatterPage() {
  if (!jsonTool) {
    notFound();
  }

  const Icon = jsonTool.icon;

  return (
    <div className="mx-auto w-full max-w-303 px-4">
      <main className="pt-8 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-ink-2 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> กลับหน้าหลัก
        </Link>

        <header className="mt-4 mb-6 flex items-center gap-4">
          <div className="grid size-13 shrink-0 place-items-center rounded-xl bg-tint text-brand">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{jsonTool.name}</h1>
            <p className="text-ink-2">{jsonTool.description}</p>
          </div>
        </header>

        <JsonFormatter />
      </main>
    </div>
  );
}
