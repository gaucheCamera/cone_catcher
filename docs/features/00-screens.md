# F00: Screens, settings, pause and reset

Status: awaiting-phone-test. Implementation PR: [#3](https://github.com/gaucheCamera/cone_catcher/pull/3).
Dependencies: F02's two-skin carousel is delivered together with this screen flow,
as approved by the owner on 2026-10-03.

## Assessment and approved scope (2026-10-03)

Assessed main: 18654891cca17d7b83db9fddf139946905b3deda. On that main, F00 and F02
are unimplemented. That code has four character buttons above the canvas, settings
in a collapsible details element, pause/resume, and Restart that immediately starts
a new run. The screen transition code does not centrally clear held input.
No open PRs were returned. The owner chose F00 as the next feature.

The owner approved the screen flow and tests below on 2026-10-03, with F02 included:

- Deliver F02's two-skin arrow/flick carousel in the startup overlay in this PR,
  preserving current collision geometry. See 02-characters.md for its evidence.
- Setup offers Start and Settings. Defer Podium until F08 supplies local rankings.
- Settings are editable only before a run; returning from settings goes to setup.
  Preserve existing validation and apply the settings to the next run.
- Pause leaves the frozen scene visible with Resume and Reset available.
- Reset from playing, paused, or game over abandons the run and returns to setup.
  Game-over Play again also returns to setup. Retain settings and selected character.
- Verify setup/settings do not advance time, pause/resume preserves the run,
  every reset route clears input, and repeated starts do not create duplicate loops.
  Run these checks at both existing viewport sizes under /cone_catcher/.
- Owner phone test before merge: long-press movement, pause, release, and resume;
  verify movement stops until fresh input. Long-press corner controls and check no
  selected text; reset from play and pause, edit settings, and start again. Confirm
  controls are visible and there is no accidental movement or spontaneous restart.

## Intended behavior and decisions

Agreed: settings have their own screen, selection overlays the initial playfield,
pause/reset sit faintly in a corner, and reset returns to character selection.
Approved for this delivery: setup offers Start and Settings; settings apply to the
next run. Podium waits for F08 rather than providing a nonfunctional button.
Pause keeps the scene visible. Opening setup screens never advances the simulation.
A reset abandons the run and is not a game-over score submission.
Use faint styling but large, readable, accessible controls.

Implemented screen flow: setup -> settings -> setup; setup -> playing;
playing <-> paused; playing -> game over. Reset from playing, paused, or game over,
and game-over Play again, return to setup without starting. Settings and skin are
retained. Losing window focus or hiding the page automatically pauses an active run.
Settings validation runs when leaving settings, allowing numbers to be typed normally.
All transitions cancel the prior animation loop and clear held movement/drag targets.
Screen controls have at least 44px touch targets and block long-press text selection.
Touch activation on release avoids suppressed or duplicate clicks after a flick.
The canvas height now reserves space for movement controls on a laptop viewport.
Movement remains the existing hold-buttons/drag behavior; F04 jumping is deferred.

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

- Commit / PR: implementation 4c4da9c9f070f5dd9008ad66763ffd935b58a2e2,
  [draft PR #3](https://github.com/gaucheCamera/cone_catcher/pull/3), combined F00/F02.
- Automated checks: pnpm test passed on 2026-10-03, covering script parsing,
  setup/settings frozen time, setting validation, one loop on repeated Start,
  selection locking, pause/resume, clearing held movement, reset from playing/
  paused/game over, game-over Play again, and focus-loss pause. Browser checks run
  at 1280x800 and 390x844 under /cone_catcher/. git diff --check passed.
- Local visual review: original game served with the preview server; reviewed setup,
  settings, playing, and paused screenshots at both sizes. Movement controls fit
  below the playfield; corner targets are visible and at least 44px tall.
- GitHub baseline: Game smoke test and Pages deployment succeeded on assessed main.
  Active Protect main ruleset requires PRs and Game smoke test; see WORKFLOW.md.
- GitHub feature check: [Game smoke test passed](https://github.com/gaucheCamera/cone_catcher/actions/runs/37149726718)
  for implementation commit 4c4da9c on 2026-10-03. Subsequent documentation updates
  run the same required check; its current result is visible on PR #3.
- Owner phone preview: on 2026-10-03 the owner confirmed the candidate displays
  and can be played in Firefox on Android. The phone's diagnostic request identified
  Firefox 156 on Android 12 and reported Game ready without a JavaScript error.
  Initial Wi-Fi access timed out while Windows blocked Node on the Public profile;
  the owner changed the network/firewall settings. A subsequent blank-page report
  cleared using a temporary diagnostic preview with uncached responses; the exact
  cause of that blank page is not established. No gameplay code changed during this
  troubleshooting. The temporary diagnostic strip is not part of the shipped game.
- Owner acceptance tests: still pending for settings, pause/resume with held input,
  all reset routes, long presses, and game-over flow. Phone access alone does not
  mark these checks passed. Use the checklist in README.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: owner selected F00 first and approved including F02 in the same PR.
  Settings and selected skin persist through reset; podium is deferred until F08.
