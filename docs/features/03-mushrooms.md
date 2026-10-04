# F03: Ground mushrooms and squirrel distraction

Status: ready-for-review; local checks complete, post-merge phone test pending.
Implementation PR: pending creation.
Dependencies: merged F00/F02/F01; F07 later connects autumn-only emergence. F04 adds jumping.

## Intended behavior and decisions

Owner direction on 2026-10-04: begin the functionality preview, rotate mushrooms
during flight, and preview here before making a commit or opening a PR.
On 2026-10-04 the owner chose to skip Wi-Fi phone preview, leave the firewall
unchanged, and test on Android Firefox through GitHub Pages after merge.
opening_prompt.md is the owner's reference file and must remain untouched/untracked.

Small grey/brown mushrooms emerge on the playable ground. Contact with either
skin launches a mushroom once, upward to the base of the nearest tree's leaves,
with a small sideways arc and one to one-and-a-half rotations over 0.8 seconds.
At completion it disappears and
the nearest remaining squirrel stops throwing for 5 seconds while continuing to
move. A small ellipsis above that squirrel identifies the distraction.

The functionality preview enables emergence from the start. The owner clarified
that future season integration must allow mushrooms only in autumn, not spring,
summer or winter. Autumn's emergence interval is 8 seconds. This replaces the
earlier all-seasons-except-winter plan; no season clock is implemented in F03.

Preview defaults carried forward from the proposed plan: three grounded mushrooms
maximum, 0.8-second flight, and repeat hits refresh rather than add durations.
Settings expose emergence seconds (0 disables it) and
distraction seconds. Owner preview feedback on 2026-10-04 sets the default and
minimum distraction to 5 seconds; the preview allows up to 60 seconds. The owner
also requested shorter flights near the bottom of the foliage. Numeric fields
now support direct replacement, select-all on first focus/tap, visible ranges,
deferred validation, previous-value fallback for blanks/invalid entries and decimal
commas. Flight shape, spin, size and indicator remain subject to preview feedback.
If there is no squirrel at completion, the mushroom simply
disappears. On leaving autumn, the future permission hook clears all mushrooms
without new distractions; existing distractions expire normally.

## Implementation steps

1. Represent grounded and airborne states separately, with bounded spawn locations and a grounded cap.
2. Use each skin's body geometry and swept horizontal contact so fast crossings cannot skip mushrooms.
3. Animate upward flight, sideways variation and rotation from elapsed flight time.
4. Resolve the nearest current squirrel at completion, safely handling hawk removals and empty populations.
5. Keep distraction separate from movement rests and animation pauses. Freeze a fresh throw interval during distraction to avoid queued throws on expiry.
6. Add validated settings, pause/reset behavior and the autumn permission hook without a season clock.
7. Run local checks, preview in Codex and incorporate feedback before committing/publishing. For this feature, perform the owner's phone test on Pages after an explicitly authorized merge.

## Acceptance criteria and verification

Controlled rule tests: emergence 0 disables spawning; the 8-second interval and
three-grounded cap hold; one contact launches once; flight rises and rotates;
completion distracts the nearest remaining target; missing/removed targets are
safe; repeat hits refresh; movement continues; throws resume after a normal
interval without a burst. Check both skins' contact edges and fast crossings.
Pause freezes emergence, flight, rotation and distraction; reset cleans up.
The future season hook enables only autumn and clears mushrooms safely on exit.

Post-merge phone test on GitHub Pages: start with each skin, wait 8 seconds for emergence, walk through a
mushroom and check its small grey/brown appearance, rotating upward flight, then
the nearest squirrel's ellipsis and temporary lack of throws. Check throwing
returns and movement continues. Pause in flight, wait, resume, then reset. In
Settings, set emergence to 0 and confirm no mushrooms appear for 16 seconds.
For easier observation, use a 2-second emergence interval and slower squirrel
throws, then restore 8 seconds for normal feel. After F04, jump over one; after
F07, verify autumn-only appearance. A desktop phone viewport is not real-phone evidence.

Run `pnpm test` and `git diff --check`. Keep the existing required Game smoke test;
new tests must be included by the test command. Preview locally before commit/PR,
review the PR before an authorized merge, then verify Pages and real-phone play.

## Implementation prompt

```text
Deliver the agreed F03 candidate for PR review. The owner requested rotating upward mushroom flight, 8-second emergence, and autumn-only appearance when seasons are implemented later. For now enable emergence from run start to test functionality. The local preview uses at most three grounded mushrooms, 0.8-second flight near the foliage base, at least 5 seconds of adjustable distraction refreshed by repeat hits, and nearest-current-squirrel targeting. Movement continues during distraction and an ellipsis marks it. Test both skins' contact edges, fast crossings, rotation, timing, removed targets, pause/reset and non-burst throw resumption. Preview in Codex and incorporate feedback before committing or opening a PR. The owner explicitly deferred the real-phone test to GitHub Pages after merge; leave the firewall unchanged. Preserve opening_prompt.md as the owner's untracked reference. Add only the permission hook; do not build seasons or jumping.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md and this plan. Inspect current main, working tree and PRs. Preserve existing work and use a focused branch from current main. Verify the repository-local author and gaucheCamera GitHub account before committing/pushing; never change global credentials or identity. Do not spawn parallel agents, reuse the local refactor branch, force-push, or merge without explicit authorization. Keep desktop/portrait-phone play and /cone_catcher/ paths. Use the existing Node test runner and Playwright, meaningful tests only. Update actual status, evidence and limitations with the implementation; never mark phone/deployment verification passed without evidence.
```

## Delivery evidence

- Commit / PR: feature/f03-mushrooms-preview from fetched main 5de7afbe; PR creation pending final checks.
- Automated checks: pnpm test passed on 2026-10-04 at desktop/phone sizes under /cone_catcher/, including F03 rules and pause/reset/Off checks. git diff --check passed.
- Local visual preview: ground mushrooms, contact and airborne rotation inspected in Codex; shortened-flight height verified by controlled tests. Revised Settings were inspected with default 5-second distraction and visible ranges. Temporary faster emergence/slower throws were used for observation, then the preview was reloaded to restore all defaults. No browser errors. Owner feedback on final feel remains pending.
- Owner phone test: explicitly deferred to post-merge GitHub Pages on 2026-10-04. Android Firefox could not reach the Wi-Fi preview after the owner declined the Windows firewall prompt. No firewall changes were made; do not pursue local phone access. Codex phone dimensions are simulated.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: owner added rotation, autumn-only future availability, at least 5 seconds of adjustable distraction, easier numeric fields and lower flight height near the foliage base. Latest direction waives Wi-Fi phone preview for this feature and moves the real-phone test to post-merge Pages.
