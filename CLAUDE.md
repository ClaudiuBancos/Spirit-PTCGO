<!-- BEGIN synced global CLAUDE.md -->
> **Synced copy, don't edit here.** This block is copied automatically from the owner's global
> [`C:\Users\Claud\.claude\CLAUDE.md`](file:///C:/Users/Claud/.claude/CLAUDE.md) so cloud sessions get the same preferences.
> Keep it up to date with that file: change preferences there, and
> `claude-remote-control/scripts/sync-global-claude-md.js` copies them into every repo.
> Where the project instructions after this block disagree with it, the project instructions win.

# Personal preferences

- Try to avoid unnecessary explanatory text in the content / UI of apps we build
- Prefer Node.js over Python.
- Git: when you finish a change, commit it unless I say not to. Commit directly to the current branch; don't create feature branches or PRs unless I ask. Do not push to GitHub unless I ask.
- Maintain an ARCHITECTURE.md file that holds a high-level map of the code files.
- When I say "What might we do next?" or "What next?" or similar, please look through the project's TODO file and briefly propose a handful of options for which tasks we might proceed with next.
- Using bash to project code files has a history of going poorly for us - just edit files directly.
- When you make helpful tools for yourself, save them to the repo in a nice out of the way spot to potentially reuse later.

- TODO files: keep the project's to-do list in `TODO.md` at the repo root, in this format (indent sub-items with tabs):

```markdown
# To Do

A shared list. Either of us can add, edit, reorder, or check things off.
Use `- [ ]` for open items and `- [x]` for done ones (move done items to the Done section at the bottom).
ARCHITECTURE.md maps the code; this file just tracks the work.

## Heading 1
- [ ] Task 1
	- [ ] Step 1
		- [ ] Sub-step or extra info 1
		- [ ] Sub-step or extra info 2

## Heading 2
- [ ] Task 1
- [ ] Task 2

## Maybe Someday
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Done
- [x] Completed task 1
- [x] Completed task 2
```

## Browsers and Testing
- Prefer using headless Chrome to do your testing. (I'd rather you use your own browser, but there have been issues with that, so just go headless Chrome. If that doesn't work try headless Edge.)
- My Chrome lives in C:\Program Files (x86)\Google\Chrome\Application
- Feel free to stop the server processes of any chat that isn't actively running, so that you can use the browser as needed.
- When generating random numbers for testing purposes, give each purpose its own seeded generator. (To avoid issues where changing one feature that uses random numbers breaks the tests or screenshots for other features.)
<!-- END synced global CLAUDE.md -->
