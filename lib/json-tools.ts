import { jsonrepair } from "jsonrepair";

export type IndentOption = "2" | "4" | "tab";

export type JsonErrorPosition = { line: number; column: number; offset: number };

export type JsonValidation =
  | { status: "empty" }
  | { status: "valid"; value: unknown }
  | {
      status: "invalid";
      rawMessage: string;
      // Present only when the browser's error message tells us where the error is.
      position?: JsonErrorPosition;
    };

export function toIndentValue(indent: IndentOption): string | number {
  return indent === "tab" ? "\t" : Number(indent);
}

function offsetToLineColumn(text: string, offset: number): JsonErrorPosition {
  const linesBeforeError = text.slice(0, offset).split("\n");
  const line = linesBeforeError.length;
  const column = linesBeforeError[linesBeforeError.length - 1].length + 1;
  return { line, column, offset };
}

function lineColumnToOffset(text: string, line: number, column: number) {
  const lines = text.split("\n");
  let offset = 0;
  for (let index = 0; index < line - 1 && index < lines.length; index++) {
    offset += lines[index].length + 1; // +1 for the "\n"
  }
  return Math.min(offset + column - 1, text.length);
}

// Each browser words JSON.parse errors differently, so we try the known formats:
// - Chrome/Edge (new): "... at position 15 (line 2 column 5)"
// - Firefox:          "... at line 2 column 5 of the JSON data"
// - Chrome/Edge (old): "... in JSON at position 15"
// - Chrome/Edge:       "Unexpected end of JSON input" (the error is at the very end)
// Safari often gives no position at all, so the result is undefined.
function findErrorPosition(text: string, message: string): JsonErrorPosition | undefined {
  const lineColumnMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColumnMatch) {
    const line = Number(lineColumnMatch[1]);
    const column = Number(lineColumnMatch[2]);
    return { line, column, offset: lineColumnToOffset(text, line, column) };
  }

  const positionMatch = message.match(/position (\d+)/i);
  if (positionMatch) {
    return offsetToLineColumn(text, Number(positionMatch[1]));
  }

  if (/end of JSON input/i.test(message)) {
    return offsetToLineColumn(text, text.length);
  }

  return undefined;
}

export function validateJson(text: string): JsonValidation {
  if (text.trim() === "") {
    return { status: "empty" };
  }

  try {
    return { status: "valid", value: JSON.parse(text) };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : String(error);
    return { status: "invalid", rawMessage, position: findErrorPosition(text, rawMessage) };
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Counts keys in every nested object, e.g. {"a":{"b":1}} has 2 keys.
export function countKeys(value: unknown): number {
  if (Array.isArray(value)) {
    return value.reduce((total: number, item) => total + countKeys(item), 0);
  }
  if (isPlainObject(value)) {
    return Object.values(value).reduce(
      (total: number, childValue) => total + 1 + countKeys(childValue),
      0,
    );
  }
  return 0;
}

// Fixes common mistakes such as trailing commas, single quotes, or missing quotes around keys.
export function repairJson(text: string): string | null {
  try {
    return jsonrepair(text);
  } catch {
    return null;
  }
}

export function formatByteSize(byteCount: number) {
  if (byteCount < 1024) return `${byteCount} B`;
  if (byteCount < 1024 * 1024) return `${(byteCount / 1024).toFixed(1)} KB`;
  return `${(byteCount / (1024 * 1024)).toFixed(1)} MB`;
}

// UTF-8 bytes, so one Thai character counts as 3 B.
export function getByteSize(text: string) {
  return new TextEncoder().encode(text).length;
}
