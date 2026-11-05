## Project Overview

iEartHub is a Thai-first web hub for personal tools. The home page lets users search, filter by category, and pin favorites. The browser saves favorites in `localStorage`. The site uses a single light theme.

## Tech Stack

- Next.js 16 with App Router, React 19, and TypeScript.
- Tailwind CSS 4 through PostCSS, shadcn/ui, and daisyUI 5.
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

- `app/` contains App Router pages, the root layout, metadata, the app icon, and global styles.
- `components/` contains the header, footer, tool hub, and tool cards.
- `components/ui/` contains the local shadcn/ui primitives.
- `lib/tools.ts` contains the catalog data and types. `lib/utils.ts` contains the shared class-name helper.

## Architecture Notes

- **Theme.** The site uses light mode only. `app/globals.css` sets `color-scheme: light` on `:root`; there is no theme switcher or saved theme setting.
- **Design tokens.** CSS variables defined on `:root` in `app/globals.css` are exposed both as Tailwind colors (`text-ink-2`, `bg-tint`, ...) and as shadcn's names (`primary`, `border`, `ring`, ...). Custom utilities: `glass`, `bg-aurora`, `bg-brand-hero`.
- **Pinned section.** Only the first 4 pinned tools in catalog order (the order of `tools` in `lib/tools.ts`, not the order they were pinned) are shown, mapped to `pinnedCardVariants` for the bento layout.
- **Categories.** The `Category` type is derived from the `categories` array in `lib/tools.ts`, so adding a category means editing that array only.

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

- Use Tailwind utilities and the existing theme tokens in `app/globals.css`. Reuse local shadcn/ui primitives for inputs and buttons. daisyUI runs with `themes: false` and only the `footer` and `kbd` components, so use `daisy-footer` / `daisy-kbd` for the footer and keyboard shortcut badge.
- Check UI changes manually in the browser via `npm run dev`: on narrow and wide screens, and with keyboard navigation where applicable. The header is sticky at the `xl` breakpoint (1280px) and above.
- Keep scrolling lightweight. Avoid applying backdrop blur to repeated cards or using a fixed background attachment on the page.
- Write Tailwind v4 canonical classes, such as `shrink-0`, `bg-linear-to-r`, and spacing-scale values like `max-w-290` when they produce the same CSS as an arbitrary value. The editor flags other forms with `suggestCanonicalClasses` warnings that agents cannot see, so check every class you edit against this yourself. Keep an arbitrary value when no canonical class produces the same CSS.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
