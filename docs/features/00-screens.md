# F00: Screens, settings, pause and reset

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F02 supplies the two-skin carousel; this plan supplies the surrounding screen flow.

## Intended behavior and decisions

Agreed: settings have their own screen, selection overlays the initial playfield,
pause/reset sit faintly in a corner, and reset returns to character selection.
Proposed: setup offers Start, Settings, and Podium; settings apply to the next run.
Pause keeps the scene visible. Opening setup screens never advances the simulation.
A reset abandons the run and is not a game-over score submission.
Use faint styling but large, readable, accessible controls.

## Implementation steps

1. Inspect existing ready/playing/paused/over transitions and establish one explicit transition function with input cleanup.
2. Add setup/settings/paused/game-over screen states around the existing canvas; reuse F02 selection.
3. Move existing settings into their own screen and preserve their validation and run-time locking.
4. Make reset cancel animation/input, clear the run, and return to the character overlay without starting.
5. Keep pause/resume labels and enabled states consistent, including after a reset from pause.
6. Update the browser smoke flow and document screen transitions without adding a UI framework.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Browser checks: settings return to setup; Start begins one loop; pause freezes
game time; resume continues; reset from playing, paused, and game-over returns to
setup; starting again works without duplicate listeners. Check both viewports.
Phone: long-press corner controls, pause/resume, change screens, and reset; verify
no text selection, accidental movement, hidden controls, or spontaneous restart.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement the agreed screen flow for Cone Catcher: dedicated settings screen, startup character overlay, faint usable corner pause/reset controls, and reset returning to setup. Preserve setting validation and freeze simulation outside play. Coordinate with the two-skin selector and preserve skin-specific hitboxes. Verify reset from every run state and fresh input/animation state after restarting.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/00-screens.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
