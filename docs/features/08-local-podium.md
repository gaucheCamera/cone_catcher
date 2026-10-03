# F08: Named local presets, run records and local podium

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F00 and F06; integrate F07 metadata once available.

## Intended behavior and decisions

Agreed: persistent local top five and all requested statistics. Feasible and
proposed: save custom settings under a chosen name and show those runs in the local
ranking with filters for the saved category. No player account or server is needed.
Each run records a settings snapshot and version; renaming/editing a preset cannot
rewrite history. Browser storage is device/browser-specific and may be cleared.
Record total points, separate cones collected/hares saved, peak concurrent squirrels,
tree statistic, active duration, skin ID, starting/highest difficulty, and rules version.
Proposed tree definition: peak trees including saplings, matching the current HUD.
Confirm retention: keeping only five runs by points cannot produce true top fives
by every other statistic. Proposed bounded history of 100 runs per category with
top five shown per selected sort, clearly described as retained-history rankings.
Agree limits and category behavior before coding.

## Implementation steps

1. Agree the record schema, tree definition, category edits, sorting, ties, and retention.
2. Separate cone and hare counters at catch events without changing the approved score formula.
3. Track population peaks when populations change; capture one immutable record on game over, excluding resets.
4. Implement validated, versioned browser storage with graceful handling of unavailable/full/corrupt storage.
5. Add named preset save/load/rename/delete controls to settings; preserve historical run snapshots.
6. Build a top-five view with category and sort selectors; render names as text and maintain stable tie order.
7. Add a result-screen hook for F09 manual submission while keeping local saving independent of network success.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Tests: persistence across reload; immutable snapshots after preset edits; duplicate
names handled predictably; separate hare/cone counts; accurate peak counts; stable
sorting and ties; bounded retention; corrupt/unavailable storage; reset is excluded.
Browser: save a named preset, finish a run, reload, and see its score/category.
Phone: create a preset, play, close/reopen the page, and inspect its ranking.
Document that clearing browser data removes local records.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement F08 after agreeing its open schema/retention decisions. Add named local custom presets, immutable run records, and a persistent local top-five view with category/statistic sorting. Split the current combined catch counter into accurate cone/hare metrics without silently changing points. Handle missing/corrupt storage and preserve historical settings. Do not add accounts or a server for this feature.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/08-local-podium.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.

Browser persistence reference:
[MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
Use project-specific storage keys: other GitHub Pages projects under the same
origin can share browser storage. Do not treat browser storage as secret or durable
cloud backup.
