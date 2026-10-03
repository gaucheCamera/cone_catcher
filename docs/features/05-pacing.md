# F05: Slower progression and population-based hawks

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: Foundation for F06; coordinate with later F07 season pressure.

## Intended behavior and decisions

Agreed: slow the early difficulty ramp and make hawk frequency depend nonlinearly
on squirrel population instead of only time. Hawks currently remove squirrels.
Preserve that role unless separately redesigned.
Proposed: keep an initial grace period, then evaluate a configurable bounded
population response at a regular interval, with diminishing increases as squirrel
count rises. Protect the last squirrel. Exact curve and parameters need review.
Address throw rate, projectile gravity, targeting spread, recruitment speed, and
population feedback together; changing only one slider may not solve the problem.

## Implementation steps

1. Inventory every elapsed-time and population-dependent rule and record current defaults.
2. Explain the proposed curve with example low/medium/high squirrel counts; agree grace period, bounds, and pacing targets.
3. Extract small difficulty calculation functions so clocks and randomness can be controlled in tests.
4. Implement the chosen bounded hawk response without changing its targeting/removal role.
5. Adjust agreed baseline tuning and expose the important parameters in settings with clear units.
6. Play several runs and record duration/population observations; distinguish evidence from a guaranteed survival time.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Rule tests: hawk chance is finite, bounded, monotonic where intended, nonlinear,
and respects grace period/protect-last; no active-hawk duplication. Difficulty
changes smoothly and reaches documented limits.
Regression: recruitment and score calculations retain agreed behavior.
Phone: several runs on proposed defaults, reporting time survived, perceived
early pressure, and whether hawks noticeably control crowding.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement F05 only after presenting the full current difficulty inventory and obtaining agreement on the numerical curve/defaults. Slow the early ramp and make squirrel-removing hawks respond nonlinearly to population. Test bounds, grace period, protect-last, and existing recruitment/scoring behavior. Report playtesting observations rather than claiming a guaranteed one-minute survival.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/05-pacing.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
