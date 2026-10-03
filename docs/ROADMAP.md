# Cone Catcher roadmap and agent handoff

Last assessed: 2026-10-03. This is a living plan, not a list of implemented features.
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

- Assessed remote main: 18654891cca17d7b83db9fddf139946905b3deda, merging
  [PR #2](https://github.com/gaucheCamera/cone_catcher/pull/2), the roadmap documentation.
  No open PRs were returned during the F00 assessment on 2026-10-03.
- The game is plain HTML/CSS/JavaScript in index.html, with canvas-drawn artwork.
  Rendering, settings, simulation, input, and state transitions share one script.
- Four characters exist on assessed main. The F00/F02 candidate keeps Jack and
  Cristian as Character 1 and Character 2 and removes Susanna and Lucy.
  They have different dimensions; the owner explicitly requires skin-specific hitboxes.
- Squirrels currently move vertically with side changes; the palette includes grey/black.
- Hawks remove squirrels. Population-based hawks are a balancing mechanism.
- Difficulty currently changes throw intervals, cone gravity, and targeting with
  elapsed time; tree recruitment also increases pressure. Tuning must address all.
- Code review corrected the earlier assessment: caught counts cones only;
  hare rescues are not separately counted. Future run records must add a separate
  hares-saved statistic without accidentally changing scoring.
- Current score is survival points plus catch points and an additional hare bonus.
- Restart currently starts immediately. Settings use a details element.
- There is no persistent ranking, custom preset library, mushroom, jump, or season system.
- pnpm test passed both checks during the F00 assessment at desktop (1280x800)
  and phone (390x844) widths under /cone_catcher/. GitHub smoke and Pages deployment
  passed on assessed main. A deployed gameplay session was not verified here.
- The F00 session began on the clean, merged documentation branch. origin/main
  was fetched and feature/f00-screens was created from it; local main was not rewritten.
- Main protection is now verified: the active Protect main ruleset requires PRs
  and the Game smoke test with an up-to-date branch. See WORKFLOW.md for details.
- The unpublished refactoring branch was not inspected or reused.

## Agreed product decisions

- Portrait game, playable on PC and mobile and hosted at /cone_catcher/.
- Two skins, their own appropriately sized hitboxes, compact arrow/flick selection
  over the game at startup.
- Dedicated settings screen. Faint corner pause/reset controls with usable touch
  targets. Reset returns to setup/character selection.
- Ground split into left/right control regions; upward swipe gives a small jump
  sufficient to clear a mushroom. Exact gesture tuning awaits a prototype.
- Mushrooms are smaller than the player, grey/brown, emerge at a configurable rate,
  and launch generally upward with some random sideways movement and a small arc/loop.
  At flight completion the nearest squirrel is distracted and stops throwing cones
  temporarily. No mushrooms in winter.
- Squirrels move erratically within their own tree and look left/right independently
  of their throw targeting. Their fur is brown through red, not grey/black.
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

F00 and F02 are implemented together in the candidate feature/f00-screens branch,
as approved by the owner on 2026-10-03, and await real-phone testing. They are not
merged or deployed. [Draft PR #3](https://github.com/gaucheCamera/cone_catcher/pull/3)
contains both features. Local checks and GitHub Game smoke test passed for the
implementation commit; both plans link the evidence and track phone/deployment
verification separately. Current branch checks are visible on that PR.
The owner confirmed that the candidate displays and can be played in Firefox on
an Android phone using the local diagnostic preview. The complete F00/F02 phone
acceptance checklist remains pending; this confirmation is not deployment evidence.
Other features remain planned / awaiting detailed design approval.

| ID | Feature and prompt | Dependencies / recommended sequencing |
| --- | --- | --- |
| F00 | [Screens, settings, pause and reset](features/00-screens.md) | Awaiting phone test; combined with F02 in PR #3 |
| F02 | [Two skins and carousel](features/02-characters.md) | Awaiting phone test; integrated with F00 in PR #3 |
| F01 | [Squirrel motion and colours](features/01-squirrels.md) | Planned; follows the F00/F02 delivery |
| F03 | [Mushrooms and distraction](features/03-mushrooms.md) | F00; season hook used later by F07 |
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
- Decide repeated mushroom-hit stacking and disappearance behavior when winter begins.
- Confirm tree statistic definition and local top-five retention across alternate sorts.
- Confirm global eligibility: recommended standard presets only, local named custom
  categories. The owner approved account-free submission, not this restriction explicitly.
- Decide whether global records represent submitted runs or one best run per browser.
  Display names are not unique identities; never merge two people just by matching names.
- Approve a host for global scores. See [the global plan](features/09-global-podium.md).
  Cloudflare Worker + D1 is recommended, not provisioned or approved yet.
- Owner phone verification of F00/F02. Scope and behavior are approved;
  required GitHub checks are verified.

## Immediate next step

Review the combined F00/F02 PR and run the documented real-phone tests against its
candidate preview. Merge only on explicit owner instruction after that feedback
and passing required checks. Then verify the deployed /cone_catcher/ game separately.
F01 remains a future design/implementation step.
