"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { basicSetup } from "codemirror";
import { isolateHistory, redo, redoDepth, undo, undoDepth } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { linter, type Diagnostic } from "@codemirror/lint";
import { EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { tags } from "@lezer/highlight";

import { validateJson } from "@/lib/json-tools";

export type JsonEditorHandle = {
  /** Replaces the whole text as one undoable step. */
  replaceContent: (text: string) => void;
  undo: () => void;
  redo: () => void;
  goTo: (offset: number) => void;
  focus: () => void;
};

type JsonEditorProps = {
  ref?: Ref<JsonEditorHandle>;
  onChange: (text: string) => void;
  onHistoryChange: (history: { canUndo: boolean; canRedo: boolean }) => void;
  onFormatShortcut: () => void;
  ariaLabelledBy: string;
};

// Same colors as the tree view (Tailwind brand / emerald-700 / amber-700 / violet-700 / ink-3).
const jsonHighlightStyle = HighlightStyle.define([
  { tag: tags.propertyName, color: "var(--brand)" },
  { tag: tags.string, color: "#047857" },
  { tag: tags.number, color: "#b45309" },
  { tag: [tags.bool, tags.null], color: "#6d28d9" },
  { tag: [tags.brace, tags.squareBracket, tags.separator, tags.punctuation], color: "var(--ink-3)" },
]);

const editorTheme = EditorView.theme({
  "&": { height: "100%", minWidth: "0", fontSize: "16px", backgroundColor: "transparent" },
  "@media (min-width: 40rem) and (pointer: fine)": { "&": { fontSize: "14px" } },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    overflow: "auto",
    overscrollBehavior: "contain",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Noto Sans Thai Looped", monospace',
    lineHeight: "1.6",
  },
  ".cm-content": { padding: "12px 0", caretColor: "var(--brand)" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none", color: "var(--ink-3)" },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "rgb(0 82 255 / 0.04)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
    backgroundColor: "rgb(0 82 255 / 0.18) !important",
  },
  ".cm-panels": { backgroundColor: "var(--solid)", color: "var(--ink)", borderColor: "var(--line)" },
  ".cm-panels-bottom": { borderTop: "1px solid var(--line)" },
  ".cm-panel.cm-search": {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    paddingRight: "36px",
    fontFamily: "inherit",
  },
  ".cm-textfield": {
    maxWidth: "100%",
    minWidth: "0",
    boxSizing: "border-box",
    borderRadius: "6px",
    borderColor: "var(--line)",
    padding: "2px 6px",
    fontSize: "inherit",
  },
  ".cm-button": { borderRadius: "6px", backgroundImage: "none", backgroundColor: "white", borderColor: "var(--line)" },
});

// Thai labels for CodeMirror's built-in search panel (still opens with Ctrl+F) and lint messages.
const thaiPhrases = EditorState.phrases.of({
  Find: "ค้นหา",
  Replace: "แทนที่",
  next: "ถัดไป",
  previous: "ก่อนหน้า",
  all: "ทั้งหมด",
  "match case": "ตรงตัวพิมพ์",
  "by word": "ทั้งคำ",
  regexp: "regex",
  replace: "แทนที่",
  "replace all": "แทนที่ทั้งหมด",
  close: "ปิด",
  "Go to line": "ไปที่บรรทัด",
  go: "ไป",
  Diagnostics: "ข้อผิดพลาด",
});

const jsonErrorLinter = linter(
  (view): Diagnostic[] => {
    const text = view.state.doc.toString();
    const validation = validateJson(text);
    if (validation.status !== "invalid" || !validation.position) return [];

    const from = Math.min(validation.position.offset, text.length);
    return [{ from, to: Math.min(from + 1, text.length), severity: "error", message: validation.rawMessage }];
  },
  { delay: 300 },
);

export function JsonEditor({ ref, onChange, onHistoryChange, onFormatShortcut, ariaLabelledBy }: JsonEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // CodeMirror is created once, so it reads the latest callbacks through refs instead of stale props.
  const onChangeRef = useRef(onChange);
  const onHistoryChangeRef = useRef(onHistoryChange);
  const onFormatShortcutRef = useRef(onFormatShortcut);
  useEffect(() => {
    onChangeRef.current = onChange;
    onHistoryChangeRef.current = onHistoryChange;
    onFormatShortcutRef.current = onFormatShortcut;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: "",
        extensions: [
          basicSetup,
          json(),
          jsonErrorLinter,
          syntaxHighlighting(jsonHighlightStyle),
          editorTheme,
          thaiPhrases,
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ "aria-labelledby": ariaLabelledBy }),
          // Prec.highest so Ctrl/Cmd+Enter runs Format instead of the default "insert blank line".
          Prec.highest(
            keymap.of([
              {
                key: "Mod-Enter",
                run: () => {
                  onFormatShortcutRef.current();
                  return true;
                },
              },
            ]),
          ),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
            if (update.docChanged || update.transactions.length > 0) {
              onHistoryChangeRef.current({
                canUndo: undoDepth(update.state) > 0,
                canRedo: redoDepth(update.state) > 0,
              });
            }
          }),
        ],
      }),
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [ariaLabelledBy]);

  useImperativeHandle(ref, () => ({
    replaceContent(text) {
      const view = viewRef.current;
      if (!view) return;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text },
        // Keep each button action as its own undo step, even when clicked quickly one after another.
        annotations: isolateHistory.of("full"),
      });
    },
    undo() {
      if (viewRef.current) undo(viewRef.current);
    },
    redo() {
      if (viewRef.current) redo(viewRef.current);
    },
    goTo(offset) {
      const view = viewRef.current;
      if (!view) return;
      const documentLength = view.state.doc.length;
      const anchor = Math.min(offset, documentLength);
      view.dispatch({
        selection: { anchor, head: Math.min(anchor + 1, documentLength) },
        scrollIntoView: true,
      });
      view.focus();
    },
    focus() {
      viewRef.current?.focus();
    },
  }));

  return <div ref={containerRef} className="h-full min-w-0" />;
}
