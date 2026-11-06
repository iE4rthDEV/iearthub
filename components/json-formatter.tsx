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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  countKeys,
  formatByteSize,
  getByteSize,
  repairJson,
  toIndentValue,
  validateJson,
  type IndentOption,
  type JsonValidation,
} from "@/lib/json-tools";
import { cn } from "@/lib/utils";

const indentOptions: { value: IndentOption; label: string }[] = [
  { value: "2", label: "ย่อหน้า 2 ช่อง" },
  { value: "4", label: "ย่อหน้า 4 ช่อง" },
  { value: "tab", label: "ย่อหน้าด้วย Tab" },
];

const SAMPLE_JSON =
  '{"name":"iEartHub","version":1,"tags":["tools","thai"],"owner":{"name":"iEarth","active":true},"features":[{"id":"json","title":"JSON Formatter"},{"id":"qr","title":"สร้าง QR Code"}],"note":null}';

type ViewMode = "text" | "tree";

type Notice = { text: string; tone: "success" | "error" };

const kbdClassName =
  "daisy-kbd h-5.5 min-w-0 rounded-md border border-line bg-white px-2 font-display text-xs text-ink-3";

export function JsonFormatter() {
  const [content, setContent] = useState("");
  const [indent, setIndent] = useState<IndentOption>("2");
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
    if (result.ok) editorRef.current?.replaceContent(JSON.stringify(result.value, null, toIndentValue(indent)));
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
      className="overflow-hidden rounded-2xl border border-line bg-white shadow-glass"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3">
        <h2 id="json-editor-label" className="font-display text-lg font-semibold">
          JSON
        </h2>
        <StatusBadge validation={validation} onGoToError={handleGoToError} />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div role="group" aria-label="มุมมอง" className="flex items-center gap-1 rounded-full bg-tint p-1">
            <ViewModeButton isActive={visibleView === "text"} onClick={() => setViewMode("text")}>
              <Code aria-hidden="true" /> Text
            </ViewModeButton>
            <ViewModeButton
              isActive={visibleView === "tree"}
              onClick={() => setViewMode("tree")}
              disabled={!isValid}
              title={isValid ? undefined : "ใช้ได้เมื่อ JSON ถูกต้อง"}
            >
              <ListTree aria-hidden="true" /> Tree
            </ViewModeButton>
          </div>

          <div className="flex items-center border-line sm:border-l sm:pl-2">
            <IconButton label="ย้อนกลับ (Ctrl+Z)" onClick={() => editorRef.current?.undo()} disabled={!history.canUndo}>
              <Undo2 aria-hidden="true" />
            </IconButton>
            <IconButton label="ทำซ้ำ (Ctrl+Y)" onClick={() => editorRef.current?.redo()} disabled={!history.canRedo}>
              <Redo2 aria-hidden="true" />
            </IconButton>
          </div>

          <Button type="button" variant="soft" onClick={handleCopy} disabled={isEmpty} className="rounded-full">
            {isCopied ? <ClipboardCheck aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {isCopied ? "คัดลอกแล้ว" : "คัดลอก"}
          </Button>
        </div>
      </div>

      {/* Body: the editor stays mounted in tree mode so its undo history is kept. */}
      {/* pb-4 keeps the scrollbars above the resize handle in the bottom-right corner. */}
      <div className="relative h-112 min-h-60 resize-y overflow-hidden pb-4">
        <div className={cn("h-full", visibleView !== "text" && "hidden")}>
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
          <div className="pointer-events-none absolute top-3 left-9 text-sm text-ink-3">
            วาง JSON ที่นี่ หรือ{" "}
            <button
              type="button"
              onClick={handleLoadSample}
              className="pointer-events-auto rounded-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-brand"
            >
              ใส่ตัวอย่าง
            </button>
          </div>
        )}

        {visibleView === "tree" && validation.status === "valid" && (
          <div className="h-full overflow-auto p-4">
            <JsonTreeView value={validation.value} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-solid px-4 py-3">
        <Button
          type="button"
          onClick={handleFormat}
          disabled={!isValid}
          aria-keyshortcuts="Control+Enter Meta+Enter"
          title="Format (Ctrl+Enter)"
          className="h-10 rounded-full px-5"
        >
          <WandSparkles aria-hidden="true" /> Format
        </Button>
        <Button type="button" variant="soft" onClick={handleMinify} disabled={!isValid} className="h-10 rounded-full">
          <Minimize2 aria-hidden="true" /> Minify
        </Button>
        <Button type="button" variant="soft" onClick={handleRepair} disabled={!isInvalid} className="h-10 rounded-full">
          <Wrench aria-hidden="true" /> Repair
        </Button>
        <Button type="button" variant="soft" onClick={handleClear} disabled={isEmpty} className="h-10 rounded-full">
          <Eraser aria-hidden="true" /> ล้าง
        </Button>
        <Select value={indent} onValueChange={(value) => setIndent(value as IndentOption)}>
          {/* The trigger width fits the longest option, and the menu below uses the same width so both line up. */}
          <SelectTrigger aria-label="ระยะย่อหน้า" className="w-40 rounded-full bg-white data-[size=default]:h-10">
            <SelectValue />
          </SelectTrigger>
          {/* rounded-2xl matches the card; items use rounded-xl (16px minus the 4px padding) so the corners stay parallel. */}
          <SelectContent className="w-(--radix-select-trigger-width) rounded-2xl">
            {indentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="rounded-xl">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
          {notice ? (
            <span role="status" className={notice.tone === "error" ? "text-destructive" : "text-emerald-700"}>
              {notice.text}
            </span>
          ) : (
            <span>
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
          <span className="hidden items-center gap-1 border-l border-line pl-3 lg:inline-flex" aria-hidden="true">
            <kbd className={kbdClassName}>Ctrl</kbd>+<kbd className={kbdClassName}>Enter</kbd> Format
          </span>
          <span className="hidden items-center gap-1 border-l border-line pl-3 sm:inline-flex">
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
  const badgeClassName = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium";

  return (
    <span role="status">
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
            "cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:outline-2 focus-visible:outline-destructive",
          )}
        >
          <CircleAlert className="size-3.5" aria-hidden="true" />
          JSON ไม่ถูกต้อง · บรรทัด {validation.position.line} คอลัมน์ {validation.position.column}
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
        "h-8 rounded-full px-4 hover:bg-white/70",
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
      className="text-ink-2"
    >
      {children}
    </Button>
  );
}
