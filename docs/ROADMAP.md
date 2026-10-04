# Cone Catcher roadmap and agent handoff

Last assessed: 2026-10-04. This is a living plan, not a list of implemented features.
The owner approved this documentation structure and the lightweight test baseline.
Detailed feature tuning and the leaderboard provider remain subject to review.

## Start here

Read [AGENTS.md](../AGENTS.md), [WORKFLOW.md](WORKFLOW.md), and the selected feature
plan below. Each feature file contains behavior, implementation steps, acceptance
checks, a phone test, and a prompt that can be copied into a capable coding agent.
Refresh that prompt against current main immediately before execution.

Keep this document and the relevant feature file current in each implementation PR.
Do not overwrite agreed behavior as an incidental documentation edit. Mark a
proposed change and seek owner agreement. Do not execute the entire roadmap at once.

## Repository assessment

- Assessed remote main: ac956152c79c9769311ec1a088f9360bcfa8ed02, merging
  [PR #5](https://github.com/gaucheCamera/cone_catcher/pull/5), F03 after F00/F02/F01.
- The game is plain HTML/CSS/JavaScript in index.html, with canvas-drawn artwork.
  Rendering, settings, simulation, input, and state transitions share one script.
- Two characters exist on main: Jack and Cristian labelled Character 1 and Character 2.
  They have different dimensions; the owner explicitly requires skin-specific hitboxes.
- Main squirrels combine slow climbing and bounded 2D scampers, with independent
  facing and brown-to-red fur. F01 is merged.
- Hawks remove squirrels. Population-based hawks are a balancing mechanism.
- Difficulty currently changes throw intervals, cone gravity, and targeting with
  elapsed time; tree recruitment also increases pressure. Tuning must address all.
- Code review corrected the earlier assessment: caught counts cones only;
  hare rescues are not separately counted. Future run records must add a separate
  hares-saved statistic without accidentally changing scoring.
- Current score is survival points plus catch points and an additional hare bonus.
- Reset returns to character setup. Settings have a dedicated screen; runs can pause/resume.
- Main includes F03 mushrooms, rotating flights, adjustable squirrel distraction,
  and easier numeric settings. Persistent rankings, custom preset libraries,
  jumping, and seasons remain planned.
- pnpm test passes at desktop (1280x800) and phone (390x844) sizes under
  /cone_catcher/, including F01 and local F03 rule checks. GitHub smoke and
  Pages deployment passed on assessed main. Actual deployed setup, skin selection,
  settings/back, start, pause/resume, and reset passed at both sizes on 2026-10-04,
  without browser/asset errors; an initial mobile connection reset cleared on retry.
- F03 started on feature/f03-mushrooms-preview from fetched origin/main 5de7afbe;
  existing branches and the owner's untracked opening_prompt.md were preserved.
- Main protection is now verified: the active Protect main ruleset requires PRs
  and the Game smoke test with an up-to-date branch. See WORKFLOW.md for details.
- The unpublished refactoring branch was not inspected or reused.
- PR #5 merged on 2026-10-04. The owner reports that deployment is working,
  with a requested follow-up to select the squirrel of the nearest tree instead
  of the squirrel nearest the flight endpoint. Agree target timing and empty-tree
  behavior before implementation. Device-specific phone acceptance is not inferred.

## Agreed product decisions

- Portrait game, playable on PC and mobile and hosted at /cone_catcher/.
- Two skins, their own appropriately sized hitboxes, compact arrow/flick selection
  over the game at startup.
- Dedicated settings screen. Faint corner pause/reset controls with usable touch
  targets. Reset returns to setup/character selection.
- Ground split into left/right control regions; upward swipe gives a small jump
  sufficient to clear a mushroom. Exact gesture tuning awaits a prototype.
- Mushrooms are smaller than the player, grey/brown, emerge at a configurable rate,
  and launch generally upward with some random sideways movement, a small arc/loop
  and rotation in flight (owner clarification on 2026-10-04).
  Preview feedback limits flight height to the base of the leaves and sets
  distraction to 5 seconds minimum/default, adjustable in Settings.
  At flight completion the nearest squirrel is distracted and stops throwing cones
  temporarily while continuing to move. Future availability is autumn only,
  with an 8-second emergence interval. F03 enables them from run start for
  functionality previews; the season clock is deferred to F07.
- Squirrels move erratically within their own tree and look left/right independently
  of their throw targeting. Their fur is brown through red, not grey/black.
  Initial F01 defaults were 12–24px bursts at 40px/second. After phone feedback,
  the owner requested faster/longer scampers: current tuning is 14–28px at
  50px/second, with 0.3–0.9-second pauses.
  After phone feedback, combine climbing toward a height 60–120px away at
  18px/second with scampers interrupting each 1–2 seconds of climbing, retaining
  the height goal afterward. Approach the trunk at 40px/second before climbing legs.
  Horizontal scamper distance scales linearly from 1x at the top to 3x at the base,
  within foliage bounds, following further owner phone feedback.
  The owner explicitly excluded squirrel movement from Settings.
- Slower difficulty progression. Easy should make reaching seasons realistic;
  Medium is harder; Hard is exceptionally difficult. Actual balance needs playtesting.
- Seasons default to 60 seconds each. Spring -> summer -> autumn -> winter.
  Summer has a moving sun and slower player movement; autumn has occasional gusts;
  winter combines gusts and slippery ground, with no mushrooms.
- After Easy winter, begin Medium spring; after Medium winter, begin Hard spring.
  Preserve score, elapsed time, and population across these transitions.
  Hard winter continues until the player loses. Starting Medium/Hard skips earlier cycles.
- Display current season/difficulty; record starting and highest difficulty reached.
- Local top five persists in the same browser. Named local custom presets are feasible
  and proposed for the local-ranking feature; global custom categories remain deferred.
- Manual global submission after game over using a display name, without a player
  account. Honest play is on trust; do not build replay verification or anti-cheat.
- Record total points, hares saved, peak concurrent squirrels, trees, duration, and
  cones collected. Default ranking is total points with selectable other sorts.
  Peak tree count including saplings is proposed; confirm before implementation.
- Community artwork and future mechanics should integrate through small documented
  interfaces. Preserve ground-running hare ears.

At default timing, an Easy start enters Medium at 4 minutes, Hard at 8 minutes,
and Hard winter at 11 minutes. A typical one-minute loss is a balance target, not
an end condition; only skilled players will see the whole sequence.

## Feature plans and status

F00 and F02 merged together in [PR #3](https://github.com/gaucheCamera/cone_catcher/pull/3).
The owner confirmed satisfaction using Firefox on an Android phone. Local checks,
GitHub smoke, Pages deployment, and actual deployed browser flow passed; the plans
record handset and deployed evidence separately.

F01's first candidate passed local checks and the owner phone preview worked,
but the owner found its movement range too small/repetitive. Alternating complete
vertical journeys then felt too long. The owner selected combined climbing with
frequent scamper interruptions and found that version "pretty good". The requested
final adjustments widen horizontal movement toward the base while constraining
the top, and increase scamper speed/distance. They pass locally; the owner tried
the final phone preview and confirmed "Ready for review" on 2026-10-03.
Local automated and visual checks passed; [PR #4](https://github.com/gaucheCamera/cone_catcher/pull/4)
merged on 2026-10-03. Main CI, Pages deployment and actual deployed browser flow
were verified on 2026-10-04.

F03 began on 2026-10-04. Rotating mushroom flights, squirrel distraction and easier
settings fields passed local preview and automated checks. PR #5 merged, and the
owner reports that the deployment is working except for the targeting preference.
An independent desktop Pages check passed after a transient connection reset;
the F03 plan records its scope. Wi-Fi phone preview was waived and the firewall
was left unchanged. Other features remain planned.

| ID | Feature and prompt | Dependencies / recommended sequencing |
| --- | --- | --- |
| F00 | [Screens, settings, pause and reset](features/00-screens.md) | Merged and deployment checked; PR #3 |
| F02 | [Two skins and carousel](features/02-characters.md) | Merged and deployment checked; PR #3 |
| F01 | [Squirrel motion and colours](features/01-squirrels.md) | Merged and deployment checked; PR #4 |
| F03 | [Mushrooms and distraction](features/03-mushrooms.md) | Merged in PR #5; owner deployment feedback received; tree-targeting follow-up awaits agreement; autumn hook used later by F07 |
| F04 | [Portrait ground controls and jumping](features/04-controls.md) | F00, F02, F03 for real mushroom-clearance tests |
| F05 | [Difficulty pacing and hawk balance](features/05-pacing.md) | Before F06; preserve existing game rules |
| F06 | [Difficulty presets](features/06-difficulties.md) | F05 |
| F07 | [Seasons and difficulty cycles](features/07-seasons.md) | F03, F04, F06; split into small PRs |
| F08 | [Local presets, run records and podium](features/08-local-podium.md) | F00, F06; F07 completes cycle metadata |
| F09 | [Account-free global podium](features/09-global-podium.md) | F08 plus approved hosting choice |
| F10 | [Maintainability and artwork integration](features/10-architecture-art.md) | Incremental alongside features; no wholesale rewrite |

The numbering preserves the owner's feature priorities where possible. F00 was
added later but precedes controls/settings work. Agree any change in implementation order.

## Open decisions

- Approve numerical defaults and interactions immediately before each feature.
- Confirm jump gesture behavior, including holding movement through a swipe.
- Agree F03's tree-targeting follow-up and confirm the Android Firefox checklist.
- Confirm tree statistic definition and local top-five retention across alternate sorts.
- Confirm global eligibility: recommended standard presets only, local named custom
  categories. The owner approved account-free submission, not this restriction explicitly.
- Decide whether global records represent submitted runs or one best run per browser.
  Display names are not unique identities; never merge two people just by matching names.
- Approve a host for global scores. See [the global plan](features/09-global-podium.md).
  Cloudflare Worker + D1 is recommended, not provisioned or approved yet.

## Immediate next step

Agree the small F03 tree-targeting follow-up before implementation. Test a competing
squirrel in another tree and a target removed during flight, retain pause/reset
coverage, and preview the revised behavior before merge. Then agree F04 portrait
ground controls and jumping. Leave the firewall unchanged. Connect autumn-only
mushroom emergence in F07.
