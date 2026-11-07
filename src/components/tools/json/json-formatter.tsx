"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardCheck,
  Code,
  Copy,
  Eraser,
  FileJson,
  ListTree,
  Minimize2,
  Redo2,
  ShieldCheck,
  Undo2,
  WandSparkles,
  Wrench,
} from "lucide-react";

import { JsonEditor } from "@/components/tools/json/json-editor";
import { JsonStatusBadge } from "@/components/tools/json/json-status-badge";
import { IconButton, ViewModeButton } from "@/components/tools/json/json-toolbar-buttons";
import { JsonTreeView } from "@/components/tools/json/json-tree-view";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  countKeys,
  formatByteSize,
  getByteSize,
  repairJson,
  validateJson,
} from "@/lib/json-tools";
import { cn } from "@/lib/utils";
import type { JsonEditorHandle } from "@/types/json";

const SAMPLE_JSON =
  '{"name":"iEartHub","version":1,"tags":["tools","thai"],"owner":{"name":"iEarth","active":true},"features":[{"id":"json","title":"JSON Formatter"},{"id":"qr","title":"สร้าง QR Code"}],"note":null}';

const STATUS_SETTLE_DELAY_MS = 400;

type ViewMode = "text" | "tree";

type Notice = { text: string; tone: "success" | "error" };

const kbdClassName =
  "daisy-kbd h-5.5 min-w-0 rounded-md border border-line bg-white px-2 font-display text-xs text-ink-3";

const actionButtonClassName =
  "h-8 min-w-0 rounded-full px-2 text-xs has-[>svg]:px-2 sm:h-10 sm:px-4 sm:text-sm sm:has-[>svg]:px-5 [&_svg]:hidden sm:[&_svg]:block";
const clearButtonClassName =
  "bg-destructive/10 text-destructive hover:bg-destructive/15 h-8 min-w-0 rounded-full px-2 text-xs has-[>svg]:px-2 sm:h-10 sm:px-4 sm:text-sm sm:has-[>svg]:px-5";

export function JsonFormatter() {
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  const [history, setHistory] = useState({ canUndo: false, canRedo: false });
  const [isCopied, setIsCopied] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const editorRef = useRef<JsonEditorHandle>(null);

  // Validate a step behind the typing, so pasting a large JSON does not make the editor lag.
  const deferredContent = useDeferredValue(content);
  // The badge shows "กำลังตรวจสอบ…" until the text has stayed unchanged for a moment. Only the badge waits;
  // the buttons keep using the validation result right away, so they never flicker while typing.
  const [settledContent, setSettledContent] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSettledContent(content), STATUS_SETTLE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [content]);
  const isChecking = content !== "" && (content !== settledContent || content !== deferredContent);
  const validation = useMemo(() => validateJson(deferredContent), [deferredContent]);
  const stats = useMemo(() => {
    if (deferredContent === "") return null;
    return {
      keyCount: validation.status === "valid" ? countKeys(validation.value) : null,
      lineCount: deferredContent.split("\n").length,
      byteSize: formatByteSize(getByteSize(deferredContent)),
    };
  }, [deferredContent, validation]);

  const isEmpty = content.trim() === "";
  const isValid = validation.status === "valid";
  const isInvalid = validation.status === "invalid";

  // The tree needs valid JSON. If the JSON becomes invalid (or empty) while the tree is open,
  // show the text editor instead so the user can fix it.
  const visibleView: ViewMode = viewMode === "tree" && isValid ? "tree" : "text";

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Parses the current text right now (not the deferred value), so buttons always act on what is on screen.
  function parseCurrentContent(): { ok: true; value: unknown } | { ok: false } {
    try {
      return { ok: true, value: JSON.parse(content) };
    } catch {
      return { ok: false };
    }
  }

  function handleFormat() {
    const result = parseCurrentContent();
    if (result.ok) editorRef.current?.replaceContent(JSON.stringify(result.value, null, 2));
  }

  function handleMinify() {
    const result = parseCurrentContent();
    if (result.ok) editorRef.current?.replaceContent(JSON.stringify(result.value));
  }

  function handleRepair() {
    const repairedText = repairJson(content);
    if (repairedText === null) {
      setNotice({ text: "ซ่อมไม่ได้ JSON เสียหายเกินไป", tone: "error" });
      return;
    }
    editorRef.current?.replaceContent(repairedText);
    setNotice({ text: "ซ่อมแล้ว กด Ctrl+Z ถ้าอยากย้อนกลับ", tone: "success" });
  }

  function handleClear() {
    editorRef.current?.replaceContent("");
    editorRef.current?.focus();
  }

  function handleLoadSample() {
    editorRef.current?.replaceContent(SAMPLE_JSON);
    editorRef.current?.focus();
  }

  function handleGoToError() {
    if (validation.status !== "invalid" || !validation.position) return;
    setViewMode("text");
    editorRef.current?.goTo(validation.position.offset);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
    } catch {
      // The Clipboard API can be blocked, e.g. on a non-HTTPS page.
      setNotice({ text: "คัดลอกไม่สำเร็จ browser ไม่อนุญาต", tone: "error" });
    }
  }

  return (
    <section
      aria-labelledby="json-editor-label"
      className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-glass"
    >
      {/* Wrappers use display: contents so all four items share one layout. Mobile: 2x2 grid with the badge and view toggle swapped; md+: one row (title, badge, then toggle and actions on the right). */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-line p-3 sm:p-4 md:flex md:gap-3">
        <div className="contents">
          <h2 id="json-editor-label" className="order-1 font-display text-2xl leading-tight font-semibold md:order-1">
            JSON
          </h2>
          <div
            role="group"
            aria-label="มุมมอง"
            className="order-4 flex items-center gap-0.5 justify-self-start rounded-full bg-tint p-0.5 sm:gap-1 sm:p-1 md:order-5"
          >
            <ViewModeButton isActive={visibleView === "text"} onClick={() => setViewMode("text")}>
              <Code className="size-3.5 sm:size-4" aria-hidden="true" />
              <span>Text</span>
            </ViewModeButton>
            <ViewModeButton
              isActive={visibleView === "tree"}
              onClick={() => setViewMode("tree")}
              disabled={!isValid}
              disabledReason="ใช้ได้เมื่อ JSON ถูกต้อง"
            >
              <ListTree className="size-3.5 sm:size-4" aria-hidden="true" />
              <span>Tree</span>
            </ViewModeButton>
          </div>
        </div>

        <div className="contents">
          <div className="order-2 flex min-w-0 items-center justify-self-end translate-y-px md:order-2">
            <JsonStatusBadge validation={validation} onGoToError={handleGoToError} isChecking={isChecking} />
          </div>

          <div className="order-3 flex items-center gap-1.5 sm:justify-self-end sm:gap-2 md:order-3 md:ml-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={handleLoadSample}
              aria-label="ใส่ตัวอย่าง"
              className="size-8 gap-1.5 rounded-full px-0 text-ink-2 sm:h-10 sm:w-auto sm:px-3 sm:text-sm"
            >
              <FileJson className="size-3.5 sm:size-4" aria-hidden="true" />
              <span className="hidden sm:inline">ตัวอย่าง</span>
            </Button>

            <div className="flex items-center">
              <IconButton label="ย้อนกลับ (Ctrl+Z)" onClick={() => editorRef.current?.undo()} disabled={!history.canUndo}>
                <Undo2 className="size-3.5 sm:size-4" aria-hidden="true" />
              </IconButton>
              <IconButton label="ทำซ้ำ (Ctrl+Y)" onClick={() => editorRef.current?.redo()} disabled={!history.canRedo}>
                <Redo2 className="size-3.5 sm:size-4" aria-hidden="true" />
              </IconButton>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  disabled={isEmpty}
                  aria-label={isCopied ? "คัดลอกแล้ว" : "คัดลอก"}
                  className={`size-8 rounded-full text-ink-2 transition-all duration-200 active:scale-90 sm:size-10 ${
                    isCopied ? "scale-105 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700" : ""
                  }`}
                >
                  {isCopied ? <ClipboardCheck className="size-3.5 sm:size-4" aria-hidden="true" /> : <Copy className="size-3.5 sm:size-4" aria-hidden="true" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isCopied ? "คัดลอกแล้ว" : "คัดลอก"}</TooltipContent>
            </Tooltip>
          </div>

          <div aria-hidden="true" className="hidden h-6 w-px bg-line md:order-4 md:block" />
        </div>
      </div>

      {/* Body: the editor stays mounted in tree mode so its undo history is kept. */}
      {/* pb-4 keeps the scrollbars above the resize handle in the bottom-right corner. */}
      <div className="relative h-[clamp(12rem,55dvh,40rem)] min-h-48 min-w-0 resize-y overflow-hidden pb-4 sm:min-h-60">
        <div className={cn("h-full min-w-0", visibleView !== "text" && "hidden")}>
          <JsonEditor
            ref={editorRef}
            ariaLabelledBy="json-editor-label"
            onChange={setContent}
            onHistoryChange={setHistory}
            onFormatShortcut={handleFormat}
          />
        </div>

        {visibleView === "tree" && validation.status === "valid" && (
          <div className="h-full min-w-0 overflow-auto overscroll-contain p-3 sm:p-4">
            <JsonTreeView value={validation.value} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-1.5 border-t border-line bg-solid p-5 sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={handleFormat}
              disabled={!isValid}
              aria-keyshortcuts="Control+Enter Meta+Enter"
              className={actionButtonClassName}
            >
              <WandSparkles aria-hidden="true" /> Format
            </Button>
          </TooltipTrigger>
          <TooltipContent>Format (Ctrl+Enter)</TooltipContent>
        </Tooltip>
        <Button type="button" variant="soft" onClick={handleMinify} disabled={!isValid} className={actionButtonClassName}>
          <Minimize2 aria-hidden="true" /> Minify
        </Button>
        <Button type="button" variant="soft" onClick={handleRepair} disabled={!isInvalid} className={actionButtonClassName}>
          <Wrench aria-hidden="true" /> Repair
        </Button>
        <Button
          type="button"
          variant="soft"
          onClick={handleClear}
          disabled={isEmpty}
          aria-label="ล้าง"
          className={clearButtonClassName}
        >
          <Eraser aria-hidden="true" /> <span className="hidden sm:inline">ล้าง</span>
        </Button>
        <div className="col-span-4 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 pt-1 text-xs wrap-anywhere text-ink-3 sm:w-full md:ml-auto md:w-auto md:flex-1 md:justify-end md:pt-0">
          {notice ? (
            <span role="status" className={notice.tone === "error" ? "text-destructive" : "text-emerald-700"}>
              {notice.text}
            </span>
          ) : (
            <span className="hidden lg:inline">
              {stats
                ? [
                    stats.keyCount !== null && `${stats.keyCount.toLocaleString()} keys`,
                    `${stats.lineCount.toLocaleString()} บรรทัด`,
                    stats.byteSize,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : "ยังไม่มีข้อมูล"}
            </span>
          )}
          <span className="hidden items-center gap-1 border-l border-line pl-3 xl:inline-flex" aria-hidden="true">
            <kbd className={kbdClassName}>Ctrl</kbd>+<kbd className={kbdClassName}>Enter</kbd> Format
          </span>
          <span className="inline-flex items-center gap-1 lg:border-l lg:border-line lg:pl-3">
            <ShieldCheck className="size-4" aria-hidden="true" /> ประมวลผลในเครื่อง
          </span>
        </div>
      </div>
    </section>
  );
}
