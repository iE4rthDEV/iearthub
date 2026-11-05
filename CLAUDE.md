# CLAUDE.md — iearthub

This file gives Claude Code session-behavior rules for this repo. Project facts (project overview, architecture, tech stack, commands, conventions, etc.) live in `AGENTS.md` — do not duplicate them here.

## Mandatory session startup

@AGENTS.md

Before your first response in this repo, confirm the import above loaded:

1. **`AGENTS.md`** is the project's source of truth. Its `## Agent Behavioral Rules` section must be in your context; if it is not, read `AGENTS.md` and tell the user the import did not load. If the file is missing or unreadable, tell the user immediately and ask how to proceed.
2. **`../PREFERENCES.local.md`** (imported by `../CLAUDE.md`, when both exist): if its content is in your context, apply it from your first response. If it is not and the file exists, read and apply it; if it exists but cannot be read, tell the user immediately. With no such file, use the tone in `AGENTS.md`'s Agent Behavioral Rules.

If this file enters your context after you have already acted in this repo without running these checks (e.g. a session started from the parent folder), run them now and tell the user which actions in this repo ran before them.

## Rules stay mandatory all session

Every mandatory step in this file (session startup above, memory write confirmation, delegation approval) stays mandatory for the whole session until the user says otherwise.

## Claude Code specific notes

### Commit and PR attribution

Write commit messages and pull request descriptions without attribution lines: leave out the `Co-Authored-By` trailer and the "Generated with Claude Code" line.

### Memory write workflow

- **Before proactively saving, updating, or deleting a memory**, ask the user via the `AskUserQuestion` tool with fixed option labels, identical every turn: "บันทึกไว้ (Recommended)" / "ไม่บันทึก", or for a deletion "ลบ (Recommended)" / "ไม่ลบ". Each option's description may vary to say what specifically will be saved, updated, or deleted.
- **Wait for the user's answer** before writing or deleting the memory file or its `MEMORY.md` entry.
- **Skip this confirmation** when the user explicitly asks in that turn to remember, save, store, update, forget, or delete something — perform the memory write directly.

### Delegation needs approval

Do the work yourself, in this same context, by default. Delegate only when the user asks for it, or after you ask and the user says yes. The test is by effect, not tool name: anything that sends real work to run outside this context counts as delegation and is covered here — including future tools not named below. When asking, say what you want to delegate, to which tool, and why, then wait for the answer; a yes covers only that one piece of work.

1. **Covered today:** the Agent tool (any `subagent_type`, including read-only ones like Explore), the Workflow tool, `mcp__ccd_session__start_session` with `initiation` `"user_asked"`, and `mcp__ccd_session__hand_off_to_session`. This holds even when a skill's own instructions (including a skill the user invoked by name) or the harness's defaults say to delegate; invoking a skill is not a request to delegate.
2. **User asks:** when the user explicitly signals, in that specific request, intent to split/delegate work (e.g. "แบ่งงานหลาย agent หน่อย", "ให้ subagent ช่วย", "spawn agent ให้ทำ X"), delegate without asking. The literal word "subagent" isn't required, but intent must be unambiguous. Covers only that one request.
3. **Background-running skills:** a skill that runs in the background reveals itself only after invocation (the call returns just an agent's name; the result arrives later). When that happens, tell the user right away that it started without approval and ask whether to use its result, and use it only after they say yes; a plain go-ahead (e.g. "ใช้ผลลัพธ์นั้นได้") is enough. Invoking that skill again needs its own approval.
