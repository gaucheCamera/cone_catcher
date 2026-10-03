# F02: Two skins and compact character selection

Status: awaiting-phone-test. Implementation PR: [#3](https://github.com/gaucheCamera/cone_catcher/pull/3).
Dependencies: integrated with F00 in the same PR, as approved on 2026-10-03.

## Intended behavior and decisions

Agreed: keep Jack as Character 1 and Cristian as Character 2. Remove the other
two choices. Show one selected character at a time with previous/next arrows and
horizontal flick navigation in an overlay at startup.
Each skin retains its own size and associated hitbox; do not normalize both
characters to the same collision dimensions. Selection is locked during play.
Approved on 2026-10-03: wrap between the two choices; retain the last choice when
resetting. Settings navigation also retains the selection.

Implemented: Jack and Cristian keep their internal IDs and appear as Character 1
and Character 2. Susanna and Lucy were removed. The startup overlay shows one
preview using the actual player renderer, with previous/next arrows, keyboard
left/right navigation when the selector is focused, and horizontal flick selection.
Flicks require at least 35px horizontally and 1.5 times the vertical displacement;
vertical gestures do not change selection. Phone gesture feel awaits owner testing.
Selection is locked outside setup. Jack remains 17x52 and Cristian 16x47 in game
coordinates. Body collisions use each skin's width and height; the 26x12 basket
keeps its original height-relative position. No collision rebalancing was applied.

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

- Commit / PR: implementation 4c4da9c9f070f5dd9008ad66763ffd935b58a2e2,
  [draft PR #3](https://github.com/gaucheCamera/cone_catcher/pull/3), combined F00/F02.
- Automated checks: pnpm test passed on 2026-10-03 at desktop and phone sizes.
  Checks cover two-choice wrapping by arrows and keyboard, horizontal mouse and
  simulated touch flicks, ignoring vertical gestures, touch taps after a flick,
  selection retention and locking, distinct body height/width edges, and actual
  catches/misses at each skin's basket edge. git diff --check passed.
- GitHub feature check: [Game smoke test passed](https://github.com/gaucheCamera/cone_catcher/actions/runs/37149726718)
  for implementation commit 4c4da9c on 2026-10-03. Current branch checks are on PR #3.
- Local visual review: both skins use the shared game renderer in the preview;
  startup overlay inspected at 1280x800 and 390x844. Original hare-ear drawing is unchanged.
- Owner phone test: pending. Flick both ways, try vertical scrolling, start with
  each skin, pause/resume, reset, and confirm the selector neither moves the player
  nor starts a run. Check prompt taps after flicks work once; long presses select
  no text. See README for candidate preview instructions.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: owner approved F02 together with F00, including wrapping and retention.
