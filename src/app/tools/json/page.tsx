import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { JsonFormatter } from "@/components/tools/json/json-formatter";
import { tools } from "@/data/tools";

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
    <div className="page-container">
      <main className="pt-4 pb-6 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-14">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-ink-2 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> กลับหน้าหลัก
        </Link>

        <header className="mt-3 mb-5 flex items-start gap-3 sm:mt-4 sm:mb-6 sm:items-center sm:gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-tint text-brand sm:size-13">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight wrap-anywhere sm:text-3xl">{jsonTool.name}</h1>
            <p className="mt-1 hidden text-sm text-ink-2 sm:text-base md:block">{jsonTool.description}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-ink-3 md:hidden">
              <ShieldCheck className="size-4 shrink-0" aria-hidden="true" /> ประมวลผลในเครื่อง
            </p>
          </div>
        </header>

        <JsonFormatter />
      </main>
    </div>
  );
}
