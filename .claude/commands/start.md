Read `ROADMAP.md` and `.claude/session-notes.md`, then resume the project from where the last session left off.

Steps to follow every time /start is invoked:

1. **Read context**
   - Read `ROADMAP.md` — identify all phases and tasks; find the first task marked `[ ]` or `[~]`.
   - Read `.claude/session-notes.md` — understand what was completed last session and any notes left.
   - Announce to the user: current phase, next task, and a one-sentence recap of where things stand.

2. **Work through tasks in order**
   - Always work on `design-test` branch. Never touch `main`. Never git pull. Never open a GitHub PR.
   - After completing **each individual task**:
     a. Stage the relevant files (`git add <specific files>`).
     b. Commit with a clear message: `feat: [phase X.Y] <task description>`.
     c. Push: `git push origin design-test`.
     d. Mark the task `[x]` in `ROADMAP.md` and commit that update too.
   - After completing **all tasks in a phase**:
     a. Commit with message: `feat: complete Phase X — <phase name>`.
     b. Push: `git push origin design-test`.
     c. Announce phase completion to the user.

3. **Stay in scope**
   - This is a design-only build (TZ §0). No functionality, no backend, no data logic.
   - Every page renders the Coming Soon component — no real content.
   - Dropdowns use shadcn DropdownMenu built-in open/close only — no custom handlers.

4. **Continue until the user calls /stop or the roadmap is fully complete.**
