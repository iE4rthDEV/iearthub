## Project Overview

iEartHub is a Thai-first web hub for personal tools. The home page lets users search, filter by category, and pin favorites. The browser saves the selected theme and favorites in `localStorage`.

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

Use the existing dependencies for routine verification. Run an install only if the dependency state is broken, `node_modules` is missing, `package.json` or `package-lock.json` changed, or an npm command fails because dependencies are unavailable. Use `npm ci` for a clean install from an existing lockfile and `npm install` when the task requires updating dependencies or the lockfile.

## Structure

- `app/` contains App Router pages, the root layout, metadata, the app icon, and global styles.
- `components/` contains the header, footer, tool hub, and tool cards.
- `components/ui/` contains the local shadcn/ui primitives.
- `lib/tools.ts` contains the catalog data and types. `lib/utils.ts` contains the shared class-name helper.

## Working Rules

- Respond in Thai by default. Use another language only when the user explicitly requests it. Keep the tone casual and direct, like a senior developer talking with a junior teammate.
- Before editing code, share the intended approach in chat. Give a short plan for behavior changes, UI changes, or edits across multiple files.
- Before opening additional files for an edit, tell the user which files you need to read and why. Read only the files required for the task, including any Next.js guide required by the Next.js rules at the end of this file.
- Do not edit generated output or dependency directories such as `.next/` and `node_modules/` unless the user explicitly asks. Let the project's commands generate their own output.
- Treat file changes you did not make as the user's work. Preserve those changes unless the user authorizes reverting them.
- Write code a junior full-stack developer can follow. Use descriptive names, straightforward React state and event handlers, and components grouped by responsibility. Preserve TypeScript checks, browser storage fallbacks, and accessibility.

## UI and Styling Rules

- Use Tailwind utilities and the existing theme tokens in `app/globals.css`. Reuse local shadcn/ui primitives for inputs and buttons and the configured, prefixed daisyUI classes for the footer and keyboard shortcut badge.
- Check UI changes in light and dark mode, on narrow and wide screens, and with keyboard navigation where applicable. The header is sticky at the `xl` breakpoint (1280px) and above.
- Keep scrolling lightweight. Avoid applying backdrop blur to repeated cards or using a fixed background attachment on the page.
- After editing Tailwind classes, run the Tailwind CSS Language Server with `suggestCanonicalClasses` enabled on the affected files. Apply canonical replacements that preserve the intended styling and rerun the check. Keep custom values where a replacement changes the intended CSS behavior and report any remaining diagnostics.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
