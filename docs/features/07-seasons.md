# F07: Seasonal effects and progressive cycles

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F03, F04, F06. Deliver in small coherent PRs, each with owner review.

## Intended behavior and decisions

Agreed: 60 seconds per season by default, adjustable in settings. Spring ->
summer -> autumn -> winter. Easy winter advances to Medium spring; Medium winter
to Hard spring; Hard winter lasts indefinitely. Starting Medium/Hard skips earlier
cycles. Preserve score, total play time, and the existing population.
Summer: sun moves across the sky and the player moves somewhat slower.
Autumn: autumn colours and intermittent wind drifting airborne cones.
Winter: winter colours, intermittent wind, slippery momentum, and no mushrooms.
Show season and current difficulty. Paused/background time must not skip seasons.
Proposed: wind affects cones only, not hares/mushrooms; movement penalties never
change hitbox size. Reset seasonal ramp time at a new difficulty while preserving
total run time. Numerical effects and transition smoothing need approval.

## Implementation steps

1. Agree season timeline, wind envelope, heat speed multiplier, ice acceleration/friction, and transition behavior.
2. First PR: implement/test a pure season/difficulty clock and HUD using active simulation time; include exact boundary cases.
3. Second PR: add spring/summer/autumn palette and sun transitions plus agreed heat effect.
4. Third PR: add time-based intermittent wind with adjustable frequency/strength/duration, affecting airborne cones only.
5. Fourth PR: add winter palette, slippery movement, mushroom suppression, and infinite Hard winter.
6. Apply difficulty transitions without calling the new-run reset; preserve entities, score, and total time while updating intended parameters.
7. Exercise long runs with accelerated test clocks; document population/performance limits before introducing gameplay-affecting caps.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Boundary tests just before/at/after each season and difficulty change, including
large time steps, pause/resume, starting Medium/Hard, custom duration, and infinite
Hard winter. Preserve score/population and avoid retroactive score recalculation
if scoring rates ever differ between presets.
Physics tests: heat changes speed, wind affects only airborne cones, ice responds
consistently across time steps, and winter disables mushrooms.
Phone: use a temporary short local season duration to inspect transitions, then
standard timing for balance; test ice stop/reversal and jump landing. Custom
accelerated runs must not be presented as standard global scores.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement only the next agreed substep of F07, not the whole season system in one PR. Follow the approved cycle: 60-second seasons by default, Easy to Medium to Hard each restarting at spring, and infinite Hard winter. Preserve run/population/score state; distinguish total and stage clocks. Test exact transitions with a controlled clock. Add heat, gusts, ice, and winter mushroom rules only in their agreed substeps, retaining skin-specific hitboxes.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/07-seasons.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
