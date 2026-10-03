# F06: Easy, Medium and Hard presets

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F05; F07 uses the same difficulty definitions for cycle advancement.

## Intended behavior and decisions

Agreed: difficulty classes affect both the starting conditions and progression
speed. Easy should let ordinary players explore seasons; Medium is meaningfully
harder; Hard should be extremely challenging. Starting difficulty is chosen before
a run. F07 will advance difficulty between complete seasonal cycles.
Proposed: store explicit validated preset definitions with a rules version. Editing
any competitive setting makes the run Custom while retaining its starting
difficulty reference. Choose exactly which fields are competitive before coding.
No fixed survival time can be guaranteed; tune against real play.

## Implementation steps

1. Propose a compact table of initial squirrels/trees, throw timing, progression, hawk response, and player-relevant values.
2. Agree the table and success criteria with the owner; retain skin-specific dimensions across all presets.
3. Create one source of truth for validated preset data rather than branching rules throughout the game.
4. Add setup selection and a current-difficulty HUD label; freeze the selected run configuration at Start.
5. Track starting and current/highest difficulty separately for later cycles and score records.
6. Mark edits as Custom and ensure reverting/restoring a preset has explicit, tested semantics.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Rule tests: preset validation, difficulty/ramp ordering, configuration snapshot
immutability, and Custom classification after changes.
Browser: each preset starts with the correct values and visible label; switching
settings does not mutate definitions or active runs.
Phone: compare repeated Easy/Medium/Hard starts and report whether their intended
difficulty differences are obvious; do not turn approximate balance into a flaky test.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement F06 after the owner approves a concrete preset table. Centralize Easy/Medium/Hard starting and progression parameters, freeze run settings at Start, label current difficulty, and preserve starting/highest difficulty metadata for cycles. Make custom edits explicit without implementing global categories. Test configuration behavior and compare game feel across presets.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/06-difficulties.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
