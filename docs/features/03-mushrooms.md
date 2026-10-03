# F03: Ground mushrooms and squirrel distraction

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F00 for settings; F07 later uses the winter gate. F04 adds avoidance by jumping.

## Intended behavior and decisions

Agreed: small grey/brown mushrooms occasionally emerge from the ground. Player
contact launches one generally upward, with a little random sideways motion and
a small arc/loop. At flight completion it disappears and the nearest squirrel,
or one in the nearest tree, stops throwing cones for a time. No mushrooms in winter.
Emergence rate is adjustable.
Proposed defaults for review: average one emergence every 8 seconds, 0 to disable,
maximum three grounded mushrooms, flight lasting 0.8 seconds, distraction 3 seconds.
Select the nearest active squirrel to the flight endpoint at completion; if none
exists, just disappear. Proposed repeat hits refresh rather than add durations.
Proposed winter entry removes grounded/in-flight mushrooms without new distractions.
Confirm these proposed rules before coding.

## Implementation steps

1. Agree emergence, flight shape, targeting, repeat-hit, and winter-transition rules.
2. Represent grounded and airborne mushroom states separately; bound spawn locations to playable ground.
3. Use skin-specific body overlap to launch each mushroom once; later jumping changes vertical overlap.
4. Animate time-based flight and resolve the nearest valid target at its endpoint.
5. Give squirrels a separate distraction timer; their existing short animation pause does not stop throws and must not be reused blindly.
6. Add settings validation and a season-permission hook with spring as the current default; clean all mushrooms on reset.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Controlled rule tests: spawn rate 0 disables emergence; one contact launches once;
flight completion distracts the nearest remaining target; missing/removed targets
are safe; distraction blocks throws and resumes without a burst; reset cleans up.
Winter gate blocks emergence and applies the agreed transition rule.
Phone: trigger a mushroom, watch its flight and a visibly distracted squirrel;
verify colour/scale. After F04, jump over one; after F07, verify winter absence.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement F03 only after confirming its proposed tuning and unresolved interactions. Add grounded mushrooms, one-shot contact launches, upward randomized short flight, and endpoint-triggered squirrel distraction. Distinguish distraction from existing animation pauses. Add an explicit winter gate without implementing seasons prematurely. Test timing, missing targets, reset, and duplicate contacts; use skin-specific collision geometry.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/03-mushrooms.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.
