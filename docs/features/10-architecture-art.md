# F10: Maintainable systems and community artwork

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: Apply incrementally as other features need boundaries; a focused artwork-contract PR can follow.

## Intended behavior and decisions

Agreed: readable, well-annotated code with relatively isolated future changes,
plus a straightforward path for community artwork. Preserve a small static game.
Proposed boundaries: configuration, run state/clock, input, simulation rules,
rendering, and score storage/service access. Split only where an actual feature
benefits; do not introduce a framework, generic entity system, or plugin engine.
Rendering must consume game state without owning score/physics rules.
Character art metadata must preserve each skin's own dimensions/collision geometry.

## Implementation steps

1. Map the existing single-script dependencies and extract the smallest needed pure rule/configuration boundary.
2. Keep behavior-preserving extraction separate from tuning when practical; verify before and after.
3. Adjust the smoke server to serve imported scripts and assets under /cone_catcher/ before moving code.
4. Document coordinate conventions, update time units, state ownership, and where settings feed each rule.
5. Define a small artwork manifest for asset paths, frame sizes, anchors, animation states, facing, and skin-specific collision metadata; preserve canvas fallbacks.
6. Add a contributor guide for attribution/license evidence and a concrete asset-replacement example; do not upload unsolicited third-party artwork.
7. Review future feature prompts against the new paths and update stale references.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Reuse existing tests for extraction and add only tests for genuine rule seams.
Browser checks catch missing modules/assets under /cone_catcher/ and exercise both
skins. Visually inspect ground-running hare ears, animation anchors, scaling, and
fallback art. Document required artwork fields and test missing/invalid assets
without making every future asset require gameplay refactoring.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Work on only the agreed F10 boundary or artwork-contract step. Inspect current feature work, extract the smallest useful module, and keep gameplay unchanged unless separately approved. Preserve static GitHub Pages hosting, skin-specific geometry, and visible hare ears. Keep rendering separate from rules, add concise explanatory comments, and document a practical community-art manifest/attribution workflow. Do not reuse the unpublished refactor branch automatically or add a large framework.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/10-architecture-art.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
