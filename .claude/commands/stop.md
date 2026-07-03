End the current work session: summarize what was done, save notes for the next session, and commit any uncommitted work.

Steps to follow every time /stop is invoked:

1. **Commit any open work**
   - Run `git status`. If there are staged or unstaged changes, commit them with message: `wip: session end — <brief description>`.
   - Push: `git push origin design-test`.

2. **Write session summary**
   - Update `.claude/session-notes.md`:
     - Set **Current position** → Phase and last completed task → next task to start.
     - Prepend a new entry to **Session history** in this format:

```
### Session — <today's date>
**Completed:**
- [x] Phase X.Y — <task name>
- [x] Phase X.Z — <task name>

**Stopped at:** Phase X.Y — <next task not yet started>

**Notes:** <any decisions made, blockers, or things to remember>
```

3. **Commit the notes**
   - `git add .claude/session-notes.md ROADMAP.md`
   - `git commit -m "chore: session notes <date>"`
   - `git push origin design-test`

4. **Report to the user**
   - Print a short summary: what was finished today, what phase/task is next, and any important notes.
