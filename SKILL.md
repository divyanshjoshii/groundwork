---
name: groundwork
description: Set up and maintain a project's context files (rules, overview, architecture, standards, progress, change log, handoffs) through a guided interview that first ingests any external brief, such as hackathon rules, a problem statement, a client brief or an assignment spec. Use when starting a project, when a project has no CLAUDE.md, when the user asks for project rules or agent context, or to sync, review or revisit those notes as work progresses.
argument-hint: "[sync | review | rules | brief]; omit to set up a new project or review an existing one"
---

# Groundwork

Give a project a memory: a small always-read rules file, a set of notes read only when relevant, and a chain of session handoffs.

If you arrived here automatically rather than by the user typing `/groundwork`, say what you are about to do and get a yes before writing anything.

## Pick a mode

| Argument | Mode | When |
|---|---|---|
| none, no `CLAUDE.md` present | **setup** | First time in a project |
| none, `CLAUDE.md` **and** `docs/` present | **review** | Check the notes against reality |
| none, `CLAUDE.md` present but no `docs/` | **setup** | Someone else's `CLAUDE.md`; see below |
| `sync` | **sync** | Update progress and change log after work |
| `rules` | **rules** | Revisit only the rules |
| `brief` | **brief** | Add or re-read an external brief later |
| `review` | **review** | Force a drift check |

A `CLAUDE.md` with no `docs/` beside it was written by something other than groundwork: the user by hand, another tool, or a template. Run setup, but say what you found first and show a diff before touching that file. Review mode on notes that do not exist reports every single one as drift, which is noise rather than information.

## Mode: setup

Read `setup.md` in this skill's directory and follow it from step 1.

## Mode: brief

Add or refresh an external brief on a project that already has groundwork. Run step 2 of `setup.md`, write or update `docs/brief.md`, then update the non-negotiable rules in `CLAUDE.md`, including any AI disclosure the brief requires, and report what changed. Leave every other file alone.

## Mode: sync

Fast, no interview.

1. Find the newest entry date with `grep -oE '^## [0-9]{4}-[0-9]{2}-[0-9]{2}' docs/changes.md | sort | tail -1`, which holds even when entries are out of order or some headings carry no date. Then establish what actually happened: `git log --oneline --since=<that date>`, plus this session.
2. Read `docs/progress.md` and rewrite only its **Now** and **Next** sections.
3. **Append** a dated entry to `docs/changes.md` with `cat >>`: decisions and their reasons, not a diff. Appending this way skips reading a file that only ever grows. Never rewrite history in this file.
4. If `docs/brief.md` has a requirements checklist, tick off anything now satisfied.
5. If something contradicts `architecture.md` or `standards.md`, say so and offer to update.

Report in two or three lines. Do not narrate.

## Mode: review

Drift check. Compare each note against the repository and report only mismatches:

- `architecture.md` against actual dependencies and folder structure. When `graphify-out/` exists, run `node "<this skill's base directory>/map.mjs"` first and compare its communities and core symbols with the Shape section.
- `standards.md` against how code is actually written now
- `progress.md` against recent commits
- `overview.md` against the README
- `brief.md` checklist against what is actually built: **flag any unmet mandated requirement first**

Present findings as a short list with a suggested fix for each. Change nothing without approval.

## Mode: rules

Re-run round 3 of `setup.md` only. Show the current rules, ask what changed, rewrite that section of `CLAUDE.md`, leave every other file alone. Never drop a non-negotiable that came from the brief without saying so explicitly.

## Hard rules versus soft rules

Keep this distinction visible to the user; it is the part people get wrong.

| | Lives in | Reliability |
|---|---|---|
| **Soft:** preferences, conventions | `CLAUDE.md` | Read every session and followed, but can slip under load |
| **Hard:** must never happen | A hook or a deny rule | Absolute; blocks the action before it runs |

"Prefer small functions" is soft. "Never push without asking" is hard. It belongs in a hook, because it is the one you cannot afford to have slip. Step 5 of `setup.md` routes each hard rule to the right block.

## When a companion is missing

Every companion below is optional. Groundwork's core, the interview and the files, works with none of them installed.

Degrade quietly. A missing skill or tool is not a problem to raise, and never interrupt an interview to suggest an install.

| Missing | Do |
|---|---|
| `humanizer` | Write the prose plainly and mention it once, at the end |
| `domain-modeling` | Write `architecture.md` directly from the interview |
| `handoff` | Note in `CLAUDE.md` that handoffs go in `docs/handoffs/`, and leave the folder |
| `git-guardrails-claude-code` | Record hard rules in `CLAUDE.md` and say plainly that they are written down, not enforced |
| `pdf` / `docx` | Ask the user to paste the brief's text instead |
| `ship` | Skip the makeover offer, and mention once that `/ship docs` exists |
| Graphify | `map.mjs` says so; read the code directly |

## Delegate rather than reimplement

- Architecture and decision records → invoke `domain-modeling`
- Writing handoffs → invoke `handoff`
- Blocking dangerous git commands → invoke `git-guardrails-claude-code`
- Conventions for agent-facing markdown → invoke `writing-for-agents`
- PDF or Word briefs → invoke `pdf` or `docx`
- The docs makeover on an existing project → invoke `ship` with `docs`
