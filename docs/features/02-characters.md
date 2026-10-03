# F02: Two skins and compact character selection

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F00 can integrate this carousel into the complete screen flow.

## Intended behavior and decisions

Agreed: keep Jack as Character 1 and Cristian as Character 2. Remove the other
two choices. Show one selected character at a time with previous/next arrows and
horizontal flick navigation in an overlay at startup.
Each skin retains its own size and associated hitbox; do not normalize both
characters to the same collision dimensions. Selection is locked during play.
Proposed: wrap between two choices; retain the last choice when resetting.

## Implementation steps

1. Inspect character definitions and all uses of character dimensions in rendering, catching, and bonking.
2. Keep stable internal IDs for Jack/Cristian while changing visible names to Character 1/Character 2.
3. Build a one-at-a-time arrow carousel over the initial playfield, with accessible labels and keyboard operation.
4. Add horizontal flick selection on the selector only, separated from movement and jump gestures.
5. Preserve each skin's collision geometry, basket position, and body proportions; document the relationship.
6. Remove unused skin definitions only after confirming nothing else references them; integrate selection locking and reset retention.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Rule checks: each skin's catch/body geometry corresponds to its dimensions and
remains distinct; edge collision examples cover both.
Browser: exactly two visible choices through navigation; arrows wrap; labels,
keyboard controls, and selection locking work.
Phone: flick between both skins, start with each, reset, and verify the selector
does not move the player or begin a run inadvertently.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement F02 only: Character 1 (Jack) and Character 2 (Cristian) in a compact arrow/flick carousel over the setup playfield. The owner explicitly requires each skin's own size-associated hitbox. Do not equalize geometry or silently rebalance characters. Preserve selection locking, verify both skins' collisions, and integrate with current setup/reset behavior after inspecting F00's status.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/02-characters.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
