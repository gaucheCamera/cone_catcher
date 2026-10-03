# F04: Portrait playfield, ground controls and jumping

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F00, F02, F03. F07 later extends horizontal movement with ice.

## Intended behavior and decisions

Agreed: portrait-only gameplay, fuller phone screen, taller ground with left/right
touch regions instead of arrow buttons, and an upward swipe for a small jump that
can clear a mushroom. Keep fingers below the character. Prevent text selection.
Proposed: hold a region to move, release to stop outside winter; upward swipe
triggers one jump while retaining horizontal input; no double jump. Preserve PC
keyboard control and propose Space/Up to jump. Gesture thresholds, ground height,
jump clearance, and speed require owner playtesting.
Fill the browser viewport and safe areas. Fullscreen/orientation requests are
optional enhancements; unsupported devices get a portrait layout/rotation prompt.

## Implementation steps

1. Agree a portrait mockup with ground height, corner controls, and HUD placement before changing gameplay.
2. Separate world coordinates from display sizing sufficiently to preserve collisions on viewport changes.
3. Use pointer capture for ground regions; handle release, cancel, focus loss, and multi-touch predictably.
4. Recognize one upward swipe per gesture without treating character-selector flicks as gameplay input.
5. Add vertical player position and velocity; move body, basket, collisions, and visuals together for both skins.
6. Test mushroom clearance, cone/hare catching while jumping, landing, screen edges, and later ice compatibility.
7. Use viewport-aware layout and safe areas; preserve desktop portrait play and keyboard access.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Rule tests: jump starts only when allowed, clears the agreed mushroom height,
lands correctly, and does not tunnel through relevant collisions; both skins work.
Browser: pointer release/cancel stops input; no overflow at both standard viewports;
setup gestures do not leak into play.
Real phone: hold left/right for several seconds, swipe while holding, release
outside a region, switch apps and return, jump over mushrooms with both skins.
Check no selection, scrolling, stuck movement, or finger obstruction.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement F04 after agreement on layout and gesture tuning. Build a portrait viewport-filling playfield with taller left/right ground regions, a small upward-swipe jump, and preserved desktop input. Keep skin-specific body/basket geometry aligned during jumps. Handle pointer cancellation and focus loss. Do not promise universal forced fullscreen/orientation. Provide the exact real-phone acceptance sequence before merge.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/04-controls.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.

Browser support references:
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
and [orientation locking](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock).
