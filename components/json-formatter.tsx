"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  ClipboardCheck,
  Code,
  Copy,
  Eraser,
  ListTree,
  Minimize2,
  Redo2,
  ShieldCheck,
  Undo2,
  WandSparkles,
  Wrench,
} from "lucide-react";

import { JsonEditor, type JsonEditorHandle } from "@/components/json-editor";
import { JsonTreeView } from "@/components/json-tree-view";
import { Button } from "@/components/ui/button";
import {
  countKeys,
  formatByteSize,
  getByteSize,
  repairJson,
  validateJson,
  type JsonValidation,
} from "@/lib/json-tools";
import { cn } from "@/lib/utils";

const SAMPLE_JSON =
  '{"name":"iEartHub","version":1,"tags":["tools","thai"],"owner":{"name":"iEarth","active":true},"features":[{"id":"json","title":"JSON Formatter"},{"id":"qr","title":"สร้าง QR Code"}],"note":null}';

type ViewMode = "text" | "tree";

type Notice = { text: string; tone: "success" | "error" };

const kbdClassName =
  "daisy-kbd h-5.5 min-w-0 rounded-md border border-line bg-white px-2 font-display text-xs text-ink-3";

const actionButtonClassName =
  "h-8 min-w-0 rounded-full px-2 text-xs has-[>svg]:px-2 sm:h-10 sm:px-4 sm:text-sm sm:has-[>svg]:px-3 [&_svg]:hidden sm:[&_svg]:block";

export function JsonFormatter() {
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  const [history, setHistory] = useState({ canUndo: false, canRedo: false });
  const [isCopied, setIsCopied] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const editorRef = useRef<JsonEditorHandle>(null);

  // Validate a step behind the typing, so pasting a large JSON does not make the editor lag.
  const deferredContent = useDeferredValue(content);
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
      <div className="flex items-start justify-between gap-2 border-b border-line px-3 py-3 sm:px-4 md:items-center md:gap-3">
        <div className="flex min-w-0 flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
          <h2 id="json-editor-label" className="font-display text-2xl leading-tight font-semibold">
            JSON
          </h2>
          <div className="flex min-w-0 items-center">
            <StatusBadge validation={validation} onGoToError={handleGoToError} />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 md:flex-row md:items-center md:gap-2">
          <div role="group" aria-label="มุมมอง" className="flex items-center gap-0.5 rounded-full bg-tint p-0.5 sm:gap-1 sm:p-1">
            <ViewModeButton isActive={visibleView === "text"} onClick={() => setViewMode("text")} title="Text">
              <Code className="size-3.5 sm:size-4" aria-hidden="true" />
              <span>Text</span>
            </ViewModeButton>
            <ViewModeButton
              isActive={visibleView === "tree"}
              onClick={() => setViewMode("tree")}
              disabled={!isValid}
              title={isValid ? "Tree" : "ใช้ได้เมื่อ JSON ถูกต้อง"}
            >
              <ListTree className="size-3.5 sm:size-4" aria-hidden="true" />
              <span>Tree</span>
            </ViewModeButton>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center border-line md:border-l md:pl-2">
              <IconButton label="ย้อนกลับ (Ctrl+Z)" onClick={() => editorRef.current?.undo()} disabled={!history.canUndo}>
                <Undo2 className="size-3.5 sm:size-4" aria-hidden="true" />
              </IconButton>
              <IconButton label="ทำซ้ำ (Ctrl+Y)" onClick={() => editorRef.current?.redo()} disabled={!history.canRedo}>
                <Redo2 className="size-3.5 sm:size-4" aria-hidden="true" />
              </IconButton>
            </div>

            <Button
              type="button"
              variant="soft"
              size="icon"
              onClick={handleCopy}
              disabled={isEmpty}
              title={isCopied ? "คัดลอกแล้ว" : "คัดลอก"}
              className="size-8 rounded-full sm:h-10 sm:w-auto sm:px-3"
            >
              {isCopied ? <ClipboardCheck className="size-3.5 sm:size-4" aria-hidden="true" /> : <Copy className="size-3.5 sm:size-4" aria-hidden="true" />}
              <span className="sr-only sm:not-sr-only">{isCopied ? "คัดลอกแล้ว" : "คัดลอก"}</span>
            </Button>
          </div>
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

        {visibleView === "text" && content === "" && (
          // Shown over the empty editor; only the button inside catches clicks.
          <div className="pointer-events-none absolute top-3 right-3 left-9 font-mono text-base leading-[1.6] text-ink-3">
            วาง JSON ที่นี่ หรือ{" "}
            <button
              type="button"
              onClick={handleLoadSample}
              className="pointer-events-auto relative rounded-sm align-baseline font-medium text-brand underline-offset-4 after:absolute after:inset-x-0 after:-inset-y-1 hover:underline focus-visible:outline-2 focus-visible:outline-brand"
            >
              ใส่ตัวอย่าง
            </button>
          </div>
        )}

        {visibleView === "tree" && validation.status === "valid" && (
          <div className="h-full min-w-0 overflow-auto overscroll-contain p-3 sm:p-4">
            <JsonTreeView value={validation.value} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 border-t border-line bg-solid px-3 py-3 sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:px-4">
        <Button
          type="button"
          onClick={handleFormat}
          disabled={!isValid}
          aria-keyshortcuts="Control+Enter Meta+Enter"
          title="Format (Ctrl+Enter)"
          className={actionButtonClassName}
        >
          <WandSparkles aria-hidden="true" /> Format
        </Button>
        <Button type="button" variant="soft" onClick={handleMinify} disabled={!isValid} className={actionButtonClassName}>
          <Minimize2 aria-hidden="true" /> Minify
        </Button>
        <Button type="button" variant="soft" onClick={handleRepair} disabled={!isInvalid} className={actionButtonClassName}>
          <Wrench aria-hidden="true" /> Repair
        </Button>
        <Button type="button" variant="soft" onClick={handleClear} disabled={isEmpty} className={actionButtonClassName}>
          <Eraser aria-hidden="true" /> ล้าง
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

type StatusBadgeProps = {
  validation: JsonValidation;
  onGoToError: () => void;
};

function StatusBadge({ validation, onGoToError }: StatusBadgeProps) {
  const badgeClassName = "inline-flex min-w-0 max-w-full items-center gap-1 rounded-2xl px-2 py-1 text-left text-xs font-medium whitespace-normal wrap-anywhere sm:gap-1.5 sm:px-3 [&_svg]:shrink-0";

  return (
    <span role="status" className="inline-flex min-w-0 max-w-full align-middle">
      {validation.status === "empty" && (
        <span className={cn(badgeClassName, "bg-tint text-ink-3")}>
          <CircleDashed className="size-3.5" aria-hidden="true" /> ยังไม่มีข้อมูล
        </span>
      )}

      {validation.status === "valid" && (
        <span className={cn(badgeClassName, "bg-emerald-100 text-emerald-800")}>
          <CircleCheck className="size-3.5" aria-hidden="true" /> JSON ถูกต้อง
        </span>
      )}

      {validation.status === "invalid" && validation.position && (
        <button
          type="button"
          onClick={onGoToError}
          title={`${validation.rawMessage}\n(กดเพื่อไปที่จุดผิด)`}
          className={cn(
            badgeClassName,
            "min-h-8 cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:outline-2 focus-visible:outline-destructive sm:min-h-11",
          )}
        >
          <CircleAlert className="size-3.5" aria-hidden="true" />
          <span>
            JSON ไม่ถูกต้อง
            <span className="sr-only sm:not-sr-only"> · บรรทัด {validation.position.line} คอลัมน์ {validation.position.column}</span>
          </span>
        </button>
      )}

      {validation.status === "invalid" && !validation.position && (
        <span title={validation.rawMessage} className={cn(badgeClassName, "bg-destructive/10 text-destructive")}>
          <CircleAlert className="size-3.5" aria-hidden="true" /> JSON ไม่ถูกต้อง
        </span>
      )}
    </span>
  );
}

type ViewModeButtonProps = {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
};

function ViewModeButton({ isActive, onClick, disabled, title, children }: ViewModeButtonProps) {
  return (
    <Button
      type="button"
      size="default"
      variant="ghost"
      aria-pressed={isActive}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 gap-1 rounded-full px-2 text-xs has-[>svg]:px-2 hover:bg-white/70 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm sm:has-[>svg]:px-3",
        isActive && "bg-white text-brand shadow-xs hover:bg-white",
      )}
    >
      {children}
    </Button>
  );
}

type IconButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
};

function IconButton({ label, onClick, disabled, children }: IconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="size-8 text-ink-2 sm:size-10"
    >
      {children}
    </Button>
  );
}
