# F01: Erratic squirrel movement and colours

Status: ready-for-review. Implementation PR: [#4](https://github.com/gaucheCamera/cone_catcher/pull/4).
Dependencies: follows merged F00/F02 (PR #3); no new gameplay dependency.

## Intended behavior and decisions

Agreed: squirrels make short erratic horizontal, vertical, and diagonal movements
within their own tree, looking left/right as they move. Facing need not control
throw direction. Fur ranges from brown to red; remove grey and black fur.
Initial owner-approved tuning on 2026-10-03 was 12–24px bursts at 40px/second.
After phone playtesting, the owner requested faster, slightly longer scampers:
current tuning is 14–28px at 50px/second, with irregular 0.3–0.9-second pauses.
Keep movement out of Settings, overriding the earlier
proposal to expose tuning there. Named constants hold these defaults in code.
Final design selection after phone feedback: combine slow climbing toward a
height 60–120px away at 18px/second with a short scamper interrupting each
1–2 seconds of climbing. Retain the height goal through the scamper and its pause,
then resume climbing. Smoothly approach the trunk at 40px/second before each
climbing leg to pass narrow branches. Initial motion is a scamper; reaching a
height also starts a pause before choosing another goal.
After the combined preview, the owner requested wider horizontal scampers
linearly related to height. Multiply the horizontal component by 1 at the top,
2 halfway down, and 3 at the base: nominal 14–28px horizontal steps grow to
42–84px at the base. Foliage bounds can shorten them; vertical scamper distance
and movement speeds stay unchanged. Diagonal steps use the same horizontal scaling.
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
5. Retain the climbing height goal across scamper interruptions and rests.
   Approach the trunk at scamper speed to pass narrow foliage gaps without jumping.
6. Scale horizontal scamper distance linearly with tree-relative height, preserving bounds.
7. Replace grey/black entries with tan/chestnut among five brown-to-red colours.

Near an edge, clipping can shorten a burst below 12px. If no valid route is found
in eight attempts, the squirrel rests again. This avoids jumps through foliage
gaps. No controls or settings were added. Tree-relative positions follow the
existing tree/ground layout; this feature does not redesign scene resizing.

Owner phone feedback on 2026-10-03: the candidate works, but motion stays in a
small area and feels repetitive. The owner requested consideration of longer
vertical travel or the original slow up/down motion interacting with scampers.
The owner initially selected alternating complete journeys and scampers.
Second phone observation: those vertical journeys lasted too long. The owner
then selected combining climbing and scampers instead of shortening complete
journeys. The combined revision above implements that choice.
Third phone observation: combined motion was "pretty good"; the owner requested
more horizontal range toward the base and constraint toward the top. That final
range adjustment implements that request.
The next observation requested faster and slightly longer scampers, resulting in
the 50px/second, 14–28px tuning above. Slow climbing and trunk approach speeds remain unchanged.
The owner then requested still wider horizontal scampers; increase the linear
base multiplier from 2x to 3x while keeping the top at 1x and enforcing foliage bounds.
Final phone observation on 2026-10-03: the owner confirmed "Ready for review"
after trying the combined movement, faster/longer scampers and 3x base range.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Rule tests with controlled randomness: every destination and movement step stays
inside the agreed tree envelope; diagonal motion happens; facing changes without
altering throw targets; no overshoot at small/large time steps.
Browser: start/pause/reset remain valid. Visually inspect every palette entry.
Phone: start a run and observe squirrels across several trees for one minute
(restart if needed). Confirm short scampers with pauses, horizontal/vertical/
diagonal motion, visible facing changes, brown/red fur, no tree escapes or sudden
trunk jumps, and comfortable motion. Watch for slow climbing broken up frequently
by scampers, covering more of each tree. Horizontal steps should be wider near
the base and constrained near the top. Pause/resume to check movement freezes;
reset and start again to check the existing screen flow. Report anything distracting.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Review or continue F01 only: bounded erratic 2D squirrel motion and brown-to-red fur. Current owner-directed phone tuning uses 14–28px bursts at 50px/second with 0.3–0.9-second pauses, combined with slow climbing toward a height 60–120px away at 18px/second. Interrupt each 1–2 seconds of climbing with a scamper, retaining the height goal afterward. Smoothly approach the trunk at 40px/second before climbing legs. Scale horizontal scamper distance linearly from 1x near the top to 3x near the base, constrained by foliage. Movement stays out of Settings. Keep facing independent of projectile aiming. Ensure drawing, throw origins, and hawk interception use the same squirrel position. Preserve all other game rules and provide the one-minute phone observation test.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/01-squirrels.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: [#4](https://github.com/gaucheCamera/cone_catcher/pull/4), first candidate
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
  [Its GitHub check](https://github.com/gaucheCamera/cone_catcher/actions/runs/37153300799)
  passed on revision cb214fae0cc7e5cea4fa30ce4300d110cd4ebf3d.
  The combined revision passes locally with coverage, speed and boundary checks,
  plus interruption/resumption of the same height goal and 1–2-second climbing legs.
  [Its GitHub check](https://github.com/gaucheCamera/cone_catcher/actions/runs/37153690736)
  passed on combined revision a65a9ccf46d9dad6c5ba0188c584d77b9e47dfb4.
  The final range adjustment passes locally, including controlled-randomness
  checks of horizontal ranges at the top, middle and base. Facing follows even
  tiny horizontal movement. An exact speed check verifies 50px/second scampers;
  climbing/trunk approach speed bounds remain covered. Current branch CI is visible on PR #4.
  [The faster/range-scaled version's GitHub check](https://github.com/gaucheCamera/cone_catcher/actions/runs/37154038656)
  passed on f604c3682728e842508ab5677291070e77749d3f. The subsequent 3x base-range
  adjustment passes locally, including clipping at the foliage edge; see PR #4 for current CI.
- Visual review: actual running game inspected at desktop/phone sizes, and all
  five palette entries inspected enlarged using the game's renderer. No browser errors.
- Owner phone test: accepted on 2026-10-03. The owner confirmed "Ready for review"
  after the final preview with combined climbing, 50px/second scampers and 3x
  horizontal scaling toward the base. Earlier observations shaped the design
  recorded above. Individual pause/reset steps were not separately logged;
  automated regression checks cover them and the phone checklist remains available.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: movement excluded from Settings. Owner phone feedback led from
  local scampers to alternating journeys, then combined climbing and scampers
  with wider horizontal movement toward the base.
