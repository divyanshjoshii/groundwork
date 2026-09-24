# Templates

Fill every `<angle bracket>` from the interview and the brief. Delete sections that do not apply rather than leaving placeholder text. Where nothing was established, write `_Not yet defined._` — never invent content to fill a gap.

---

## CLAUDE.md

Loaded into **every** session. Keep it under about 60 lines. Rules and pointers only — no explanation, no history, no architecture.

```markdown
# <Project name>

<One sentence: what this is.>

## Non-negotiable — from <source>

<Only when there is an external brief. These cannot be traded away.
Delete this whole section when there is no brief.>

- <Mandated stack or platform>
- <Constraint that disqualifies if broken>
- Deadline: <date>

Full brief: `docs/brief.md`

## Ask me first

- <Action that needs explicit permission>

## Always

- <Standing expectation>

## Never

- <Prohibited action>

## Project notes

Read these when relevant — not every session.

| File | Read it when |
|---|---|
| `docs/brief.md` | checking what was actually required |
| `docs/overview.md` | you need to know what this project is for |
| `docs/architecture.md` | before structural or dependency changes |
| `docs/standards.md` | before writing or reviewing code |
| `docs/progress.md` | resuming work or starting a multi-step task |
| `docs/changes.md` | you need the history behind a decision |
| `graphify-out/GRAPH_REPORT.md` | exploring unfamiliar code (only when the map exists) |

<Keep the graphify-out row only when setup ran map.mjs.>

## Writing

README, docs and pull request descriptions go through the `humanizer` skill
before they land. Commit messages follow the short check in the `ship` skill.
Voice is defined in `docs/standards.md`.

Rules files and config stay terse. They are reference, not prose.

## Sessions

- Read `docs/progress.md` when resuming work or starting a multi-step task, and the newest file in `docs/handoffs/` only when continuing the previous session's task.
- Handoffs go in `docs/handoffs/`, named `YYYY-MM-DD-HHMM-topic.md`. Never overwrite an existing one.
- Progress and the change log are updated when work is committed through `ship`, or with `/groundwork sync`.
```

---

## docs/brief.md

Only when there is an external brief. This is the **authority** on what was asked for — record it faithfully and do not blend it with your own interpretation. Interpretation belongs in `overview.md`.

```markdown
# Brief

**Source:** <URL or file path>
**Retrieved:** <date>
**Type:** <hackathon | client brief | assignment | problem statement>

## Deliverables

- <What must exist at the end>

## Mandated technology

| Requirement | Stated as |
|---|---|
| <Tech> | <required / forbidden / encouraged> |

## Hard constraints

- <Rule that disqualifies if broken>

## AI use

- Allowed: <yes | no | with limits: which>
- Disclosure: <not required | required, in the words the brief asks for>

## Judging criteria

| Criterion | Weight |
|---|---|
| <Criterion> | <%> |

## Dates

| Milestone | Date |
|---|---|
| <Milestone> | <date> |

## Submission

- <Format: repo, demo video, deployed URL, write-up>

## Requirements checklist

Tick these off during `sync`. Unmet mandated items are reported first at `review`.

- [ ] <Requirement>

## Ambiguities to raise

- <Unclear point the user should confirm with the organizers>
```

---

## docs/overview.md

```markdown
# Overview

## What this is

<Two or three sentences.>

## Who it is for

<Users, and what they are trying to do.>

## Done looks like

<Concrete definition of the first milestone.>

## Explicitly out of scope

<What this project is deliberately not doing. Prevents scope creep and
stops a future session helpfully building something unwanted.>
```

---

## docs/architecture.md

```markdown
# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| <Layer> | <Choice> | <Reason, or "mandated by brief"> |

## Shape

<How the pieces fit. A short paragraph or a list of directories and their jobs.>

## Decisions

### <Date> — <Decision>

**Chose:** <what>
**Because:** <why>
**Rejected:** <alternative, and what ruled it out>

<The rejected line is the most valuable part of this file. It stops a
future session re-proposing something already ruled out.>
```

---

## docs/standards.md

```markdown
# Standards

## Conventions

- <How code should be written here>

## Avoid

- <What the user dislikes, in concrete terms>

## Testing

<What is required before work counts as done, versus what is aspirational.>

## Library docs

<Include only when Context7 is installed.>

Check library APIs with Context7 before writing against them. Do not rely on
recalled API shapes — they go stale.

## Commits and branches

`ship` reads this section.

- Flow: <branch + pull request | direct to the default branch>
- Branch names: `<type>/<short-name>`, with type one of feat, fix, docs, chore, refactor
- Merging: the user merges pull requests on GitHub; <Squash and merge | other method and why>
- Commits: <every commit shown and approved first | other>
- AI attribution: none in commits or pull requests<, except the disclosure in `docs/brief.md`>

## Prose

Applies to **human-facing** text only: README, commit messages, PR descriptions,
docs, changelog. Agent-facing files stay terse and are exempt.

- Voice: <how it should read>
- Avoid: <words, constructions, or tone the user dislikes>

Invoke the `humanizer` skill when drafting or reviewing any of the above.

## Security

Repository is <public | private>.

- Secrets live in: <env vars, vault — never in code>
- Never log: <personal data, tokens, request bodies>
- Validate input at: <the boundary where this happens>
- New dependencies: <need approval, or not>
- Regulated data: <payments, health, GDPR — or none>

Run `/security-review` before a commit or pull request.
```

---

## docs/progress.md

The only file that describes **now**. Keep it current; `sync` rewrites Now and Next.

```markdown
# Progress

_Updated: <date>_

## Now

<What is actively being worked on. One or two lines.>

## Next

1. <Concrete next step>

## Done

- <Completed milestone>

## Blocked

- <What is stuck, and on what>
```

---

## docs/changes.md

Append-only. Never rewrite an existing entry — this is the decision history.

```markdown
# Change register

## <YYYY-MM-DD>

- <What changed and why. The reason matters more than the diff — the diff
  is already in git.>
```
