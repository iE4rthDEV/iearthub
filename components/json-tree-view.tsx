"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { isPlainObject } from "@/lib/json-tools";
import { cn } from "@/lib/utils";

// Nodes up to this depth start expanded (0 = root, 1 = its children).
const DEFAULT_EXPANDED_DEPTH = 2;

type JsonTreeViewProps = {
  value: unknown;
};

export function JsonTreeView({ value }: JsonTreeViewProps) {
  return (
    <ul className="font-mono text-sm leading-7" aria-label="JSON แบบ tree">
      <JsonTreeNode name={null} value={value} depth={0} />
    </ul>
  );
}

type JsonTreeNodeProps = {
  /** Object key (string), array index (number), or null for the root. */
  name: string | number | null;
  value: unknown;
  depth: number;
};

function JsonTreeNode({ name, value, depth }: JsonTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < DEFAULT_EXPANDED_DEPTH);
  const isArray = Array.isArray(value);
  const isContainer = isArray || isPlainObject(value);

  const label = name !== null && (
    <>
      <span className={typeof name === "number" ? "text-ink-3" : "text-brand"}>
        {typeof name === "number" ? name : JSON.stringify(name)}
      </span>
      <span className="text-ink-3">: </span>
    </>
  );

  if (!isContainer) {
    // Leaf value: indent by the chevron width so it lines up with sibling containers.
    return (
      <li className="pl-5 break-all">
        {label}
        <JsonPrimitive value={value} />
      </li>
    );
  }

  const entries: [string | number, unknown][] = isArray
    ? value.map((item, index) => [index, item])
    : Object.entries(value as Record<string, unknown>);
  const [openBracket, closeBracket] = isArray ? ["[", "]"] : ["{", "}"];
  const showChildren = isExpanded && entries.length > 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        disabled={entries.length === 0}
        className="flex w-full items-center rounded-md text-left hover:bg-tint focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-default disabled:hover:bg-transparent"
      >
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-ink-3 transition-transform motion-reduce:transition-none",
            isExpanded && "rotate-90",
            entries.length === 0 && "invisible",
          )}
          aria-hidden="true"
        />
        <span className="ml-1">
          {label}
          <span className="text-ink-3">
            {openBracket}
            {!showChildren && (
              <span className="mx-0.5 rounded border border-line bg-white px-1 text-xs">{entries.length}</span>
            )}
            {!showChildren && closeBracket}
          </span>
        </span>
      </button>

      {showChildren && (
        <>
          <ul className="ml-2 border-l border-line pl-3">
            {entries.map(([childName, childValue]) => (
              <JsonTreeNode key={childName} name={childName} value={childValue} depth={depth + 1} />
            ))}
          </ul>
          <span className="pl-5 text-ink-3">{closeBracket}</span>
        </>
      )}
    </li>
  );
}

function JsonPrimitive({ value }: { value: unknown }) {
  if (typeof value === "string") {
    return <span className="text-emerald-700">{JSON.stringify(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className="text-amber-700">{value}</span>;
  }
  // true, false, or null
  return <span className="text-violet-700">{String(value)}</span>;
}
