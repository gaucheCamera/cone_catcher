# F01: Erratic squirrel movement and colours

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: No new gameplay dependency. First proposed feature implementation.

## Intended behavior and decisions

Agreed: squirrels make short erratic horizontal, vertical, and diagonal movements
within their own tree, looking left/right as they move. Facing need not control
throw direction. Fur ranges from brown to red; remove grey and black fur.
Proposed for playtesting: short travel bursts with irregular pauses, a position
envelope based on each tree's visible shape, and no teleporting across its trunk.
Movement speed and pause frequency should be tunable in settings.
Leave throw timing, projectile targeting, recruitment, and hawk rules unchanged.

## Implementation steps

1. Inspect sBounds, sPos, updateSquirrel, drawSquirrelAt, and hawk-carried rendering.
2. Agree movement speed, travel distance, pauses, and tree boundary interpretation using a small prototype.
3. Track a tree-relative two-dimensional position, destination, and facing; choose bounded destinations with controlled randomness.
4. Use elapsed update time for movement and guard overshoot; keep position valid as the scene resizes.
5. Use the same resulting position for drawing, throws, and hawk interception; retain independent throw targeting.
6. Replace grey/black fur entries with distinguishable brown/red variants and expose the agreed movement tuning.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Rule tests with controlled randomness: every destination and movement step stays
inside the agreed tree envelope; diagonal motion happens; facing changes without
altering throw targets; no overshoot at small/large time steps.
Browser: start/pause/reset remain valid. Visually inspect every palette entry.
Phone: observe squirrels across several trees for a minute; confirm short erratic
movement, visible facing changes, no tree escapes, and comfortable motion.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement F01 only: bounded erratic 2D squirrel motion and brown-to-red fur. Agree the proposed movement tuning first; keep facing independent of projectile aiming. Ensure drawing, throw origins, and hawk interception use the same squirrel position. Add focused boundary/regression tests using controlled randomness, preserve all other game rules, and provide a phone observation test.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/01-squirrels.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
