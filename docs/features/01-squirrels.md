# F01: Erratic squirrel movement and colours

Status: in-progress (phone feedback revision). Implementation PR: [#4](https://github.com/gaucheCamera/cone_catcher/pull/4).
Dependencies: follows merged F00/F02 (PR #3); no new gameplay dependency.

## Intended behavior and decisions

Agreed: squirrels make short erratic horizontal, vertical, and diagonal movements
within their own tree, looking left/right as they move. Facing need not control
throw direction. Fur ranges from brown to red; remove grey and black fur.
Owner-approved on 2026-10-03: 12–24px travel bursts at 40px/second, with irregular
0.3–0.9-second pauses. Keep movement out of Settings, overriding the earlier
proposal to expose tuning there. Named constants hold these defaults in code.
After the first phone preview, the owner approved alternating these scampers
with complete slow vertical journeys of 60–120px at 18px/second. Each journey
approaches the trunk smoothly before travelling up/down, then rests before the
next scamper. Scampers do not interrupt a journey. Initial motion is a scamper.
Use a position envelope based on each tree's visible shape, with no teleporting
across its trunk. Facing follows horizontal travel and remains unchanged during
purely vertical travel; a small eye makes orientation clearer.
Leave throw timing, projectile targeting, recruitment, and hawk rules unchanged.

## Implementation steps

1. Track tree-relative two-dimensional positions, destinations, facing, and rest time.
2. Choose horizontal, vertical, or diagonal destinations inside the nine drawn
   foliage triangles, allowing a 13px horizontal margin for the sprite.
3. Reject routes that cross narrow branch gaps; check foliage edges as well as
   regular samples along the route. Clamp travel to its destination to avoid overshoot.
4. Share sPos between rendering, throws, and hawk interception. Keep the existing
   post-throw pause and throw timer separate from the new movement rests.
5. Alternate each completed scamper with a longer vertical journey. Approach the
   trunk at the journey speed to pass narrow foliage gaps without jumping.
6. Replace grey/black entries with tan/chestnut among five brown-to-red colours.

Near an edge, clipping can shorten a burst below 12px. If no valid route is found
in eight attempts, the squirrel rests again. This avoids jumps through foliage
gaps. No controls or settings were added. Tree-relative positions follow the
existing tree/ground layout; this feature does not redesign scene resizing.

Owner phone feedback on 2026-10-03: the candidate works, but motion stays in a
small area and feels repetitive. The owner requested consideration of longer
vertical travel or the original slow up/down motion interacting with scampers.
The owner selected alternating complete journeys and scampers rather than
interrupting journeys. The revision above implements that choice; repeat the
phone observation before treating F01 as accepted.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Rule tests with controlled randomness: every destination and movement step stays
inside the agreed tree envelope; diagonal motion happens; facing changes without
altering throw targets; no overshoot at small/large time steps.
Browser: start/pause/reset remain valid. Visually inspect every palette entry.
Phone: start a run and observe squirrels across several trees for one minute
(restart if needed). Confirm short scampers with pauses, horizontal/vertical/
diagonal motion, visible facing changes, brown/red fur, no tree escapes or sudden
trunk jumps, and comfortable motion. Watch for longer slow vertical journeys
alternating with the scampers, covering more of each tree. Pause/resume to check movement freezes;
reset and start again to check the existing screen flow. Report anything distracting.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Review or continue F01 only: bounded erratic 2D squirrel motion and brown-to-red fur. The owner approved 12–24px bursts at 40px/second with 0.3–0.9-second pauses, alternating with complete 60–120px vertical journeys at 18px/second. Smoothly approach the trunk before a journey; scampers do not interrupt it. Movement stays out of Settings. Keep facing independent of projectile aiming. Ensure drawing, throw origins, and hawk interception use the same squirrel position. Preserve all other game rules and provide the one-minute phone observation test.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/01-squirrels.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: [#4](https://github.com/gaucheCamera/cone_catcher/pull/4), implementation
  d0f19e25e8f5446f6c10e3709bd1d0f7c10ddbea on feature/f01-squirrels,
  based on merged main a167f286. The uploaded tree matches tested local commit
  6e76c37 exactly; the local implementation branch is preserved.
- Automated checks: `pnpm test` passed on 2026-10-03 (both existing top-level
  checks, at 1280x800 and 390x844 under /cone_catcher/). Controlled randomness
  exercises 1,200 updates per tree across three trees at each viewport, with
  varied time steps: canopy/destination bounds, continuous speed-limited motion,
  all direction types, facing, rest, and large-step overshoot. Additional checks
  cover tree-relative coordinates, independent aiming, shared drawing/throw/hawk
  positions, and continuing throws during movement rests. Existing F00/F02
  browser flow and collision checks still pass. GitHub's
  [Game smoke test](https://github.com/gaucheCamera/cone_catcher/actions/runs/37152876723)
  passed on implementation commit d0f19e25; current branch checks remain visible on PR #4.
  The alternating-journey revision also passes locally, with checks for at least
  100px vertical coverage per tree, multiple completed journeys/scampers, slower
  journey speed, 60–120px journey targets, and exact arrival without overshoot.
  Its GitHub check is pending upload.
- Visual review: actual running game inspected at desktop/phone sizes, and all
  five palette entries inspected enlarged using the game's renderer. No browser errors.
- Owner phone test: candidate displayed and worked; movement feel needs revision
  as recorded above. Final acceptance remains pending a revised preview.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: movement excluded from Settings; completed vertical journeys added
  after owner phone feedback, alternating with scampers at the owner's request.
