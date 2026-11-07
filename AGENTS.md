## Project Overview

iEartHub is a Thai-first web hub for personal tools. The home page lets users search, filter by category, and pin favorites. The browser saves favorites in `localStorage`. The site uses a single light theme.

## Tech Stack

- Next.js 16 with App Router, React 19, and TypeScript.
- Tailwind CSS 4 through PostCSS, shadcn/ui, and daisyUI 5.
- Radix UI (select, tooltip) behind the shadcn/ui primitives.
- CodeMirror 6 for the JSON editor and `jsonrepair` for the Repair button.
- npm for dependencies, ESLint for linting, and Lucide for icons.

### Main Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install from the lockfile for a fresh setup. |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Check the project with ESLint. |
| `npm run build` | Type-check and create a production build. |
| `npm run start` | Serve the production build after `npm run build`. |

There is no test runner: a change is verified when `npm run lint` and `npm run build` both pass.

Use the existing dependencies for routine verification. Run an install only if the dependency state is broken, `node_modules` is missing, `package.json` or `package-lock.json` changed, or an npm command fails because dependencies are unavailable. Use `npm ci` for a clean install from an existing lockfile and `npm install` when the task requires updating dependencies or the lockfile.

## Structure

All source code lives in `src/`; the `@/` import alias points at it.

- `src/app/` contains App Router pages, the root layout, metadata, the app icon, and global styles. Tool pages live at `src/app/tools/<id>/page.tsx`.
- `src/components/layout/` contains the navbar and footer.
- `src/components/sections/` contains the home page sections: the tool hub and tool cards.
- `src/components/tools/<id>/` contains one tool's own components. The JSON tool has `json-formatter.tsx` (the page component), `json-editor.tsx` (CodeMirror), `json-tree-view.tsx`, `json-status-badge.tsx`, and `json-toolbar-buttons.tsx`.
- `src/components/ui/` contains the local shadcn/ui primitives.
- `src/data/` contains the catalog: `tools.ts` (the tools) and `categories.ts` (the categories and the `Category` type).
- `src/types/` contains TypeScript types used by more than one file (`tool.ts` has `Tool`, `json.ts` has `JsonEditorHandle`). A component's props type and other single-file types stay in that component's file.
- `src/lib/` contains `utils.ts` (the shared class-name helper). A tool's pure helpers (no React or DOM) live in `src/lib/<id>-tools.ts`.

## Architecture Notes

- **Theme.** The site uses light mode only. `src/app/globals.css` sets `color-scheme: light` on `:root`; there is no theme switcher or saved theme setting.
- **Design tokens.** CSS variables defined on `:root` in `src/app/globals.css` are exposed both as Tailwind colors (`text-ink-2`, `bg-tint`, ...) and as shadcn's names (`primary`, `border`, `ring`, ...). Custom utilities: `glass`, `bg-aurora`, `bg-brand-hero`.
- **Pinned section.** The pin limit equals the number of `pinnedCardVariants` in `src/components/sections/tool-hub.tsx` (one bento slot per pin), so raising it means adding a variant. Pinned tools are listed in catalog order (the order of `tools` in `src/data/tools.ts`, not the order they were pinned) and mapped to the variants for the bento layout. Saved ids of tools that left the catalog are ignored, so they never use a pin slot.
- **Categories.** The `Category` type is derived from the `categories` array in `src/data/categories.ts`, so adding a category means editing that array only.
- **Tool pages.** A catalog entry in `src/data/tools.ts` with `href` renders as an openable card; an entry without it shows "เร็วๆ นี้". A page renders only its own content, inside the same wrapper classes as the home page container in `src/components/sections/tool-hub.tsx`; the root layout already provides `<Navbar />` and `<Footer />`. A tool page is a Server Component that reads its name, description, and icon from the catalog, then renders the tool's client component; Lucide icons cannot be passed as props into a client component.
- **JSON editor.** `json-editor.tsx` lists its CodeMirror extensions itself instead of using `basicSetup`, so the fold gutter can use a Lucide chevron marker; keep that list in sync with `basicSetup` when changing it. The editor stays mounted in tree mode so its undo history is kept, and the empty-state hint is CodeMirror's `placeholder()`, not an overlay.
- **Status badge.** `json-status-badge.tsx` shows "กำลังตรวจสอบ…" until the text has stayed unchanged for `STATUS_SETTLE_DELAY_MS` in `json-formatter.tsx`; only the badge waits, the buttons use the validation result immediately.
- **Repair.** `repairJson` in `src/lib/json-tools.ts` tries `jsonrepair` on the text as it is, then with adjacent top-level values separated, then on the JSON block cut out of surrounding text. Several pasted values become one array.

## Agent Behavioral Rules

- Respond in Thai by default. Use another language only when the user explicitly requests it. Keep the tone casual and direct, like a senior developer talking with a junior teammate.
- **Minimal file reads** — Read only what is strictly necessary for the current task, including any Next.js guide required by the Next.js rules at the end of this file.
- **Plan before coding** — Summarize the implementation plan first, naming each file it needs and why. Do not create, modify, or delete any repo file (code, config such as `.gitignore`, or docs) until the plan is confirmed — except a low-risk change (see **Low-risk** below).
  - **Low-risk:** a change that does not alter behavior at all — e.g. renaming a variable, formatting, removing dead code confirmed unused, or changing user-facing text with no effect on logic or data — and touches only a single file. State the plan, then proceed without waiting for approval. If unsure whether a change qualifies, or it turns out riskier partway through, stop and wait for approval.
  - **Once confirmed** (or once a low-risk plan is stated), carry the plan through to its last step in the same run. End a turn only when the plan is done or a required stop applies (anywhere in this rule, or a confirmation step in your own agent instructions) — not with just a status update or a "continue?" question.
  - **Stop and ask** when you cannot continue without the user, or when the work needs more than the plan covers (another file, a different approach, wider scope); propose a revised plan.
  - **Always stop and ask first, even inside a confirmed plan,** before: deleting anything git cannot restore (untracked or ignored files you did not create in this run, such as `.env*`); changing anything outside this repo, except your own scratch files. Skip this stop when the user's current request names that exact action.
  - **Work found outside the plan:** leave it untouched.
  - **Final response:** in this order, what needs the user's decision, what changed, and what was found (including work outside the plan); mark anything not verified.
- Do not edit generated output or dependency directories such as `.next/` and `node_modules/` unless the user explicitly asks. Let the project's commands generate their own output.
- Treat file changes you did not make as the user's work. Preserve those changes unless the user authorizes reverting them.
- Write code a junior full-stack developer can follow. Use descriptive names, straightforward React state and event handlers, and components grouped by responsibility. Preserve TypeScript checks, browser storage fallbacks, and accessibility.

## UI and Styling Rules

- Use Tailwind utilities and the existing theme tokens in `src/app/globals.css`.
- **Component library.** Reuse a primitive already in `src/components/ui/` before adding a new one. Otherwise pick by behavior: shadcn/ui for controls that need JavaScript or keyboard behavior (select, dialog, popover, tabs); daisyUI for CSS-only pieces (footer, kbd, badge, divider). If an element fits neither, ask the user.
  - **daisyUI** is configured in the `@plugin "daisyui"` block of `src/app/globals.css` (prefix `daisy-`, no themes). Enable a component by adding its name to that block's `include` list before using its class.
  - **Tooltips.** Use `Tooltip` from `src/components/ui/tooltip.tsx` instead of the `title` attribute. A natively `disabled` button ignores the pointer, so wrap it in a `<span>` that receives the hover, or use `aria-disabled`.
  - **Animations.** `tw-animate-css` is not installed; a custom animation is a `--animate-*` variable plus `@keyframes` in the `@theme` block of `src/app/globals.css` (see `badge-in`), and should carry `motion-reduce:animate-none` where it is used.
  - **New shadcn/ui primitive:** `src/app/globals.css` has no `popover` color tokens and `tw-animate-css` is not installed, so map `bg-popover` / `text-popover-foreground` to `bg-white` / `text-ink` and drop `animate-*` classes from the shadcn template.
- Check UI changes manually in the browser via `npm run dev`: on narrow and wide screens, and with keyboard navigation where applicable. The navbar is sticky at the `xl` breakpoint (1280px) and above.
- Keep scrolling lightweight. Avoid applying backdrop blur to repeated cards or using a fixed background attachment on the page.
- Write Tailwind v4 canonical classes, such as `shrink-0`, `bg-linear-to-r`, and spacing-scale values like `size-8.5` when they produce the same CSS as an arbitrary value. The editor flags other forms with `suggestCanonicalClasses` warnings that agents cannot see, so check every class you edit against this yourself. Keep an arbitrary value when no canonical class produces the same CSS.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
