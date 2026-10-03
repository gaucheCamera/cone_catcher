# F09: Account-free global podium

Status: planned / awaiting detailed design review. Implementation PR: none.
Dependencies: F08 and an explicit hosting choice. No service has been provisioned.

## Intended behavior and decisions

Agreed: anyone can play and manually submit after game over using a display name;
no GitHub or other player account. Honest scores are on trust. Default sorting is
total points; allow the recorded alternative statistics and difficulty information.
Recommend a dedicated podium page hosted on GitHub Pages and linked from README.
Hosting proposal: one Cloudflare Worker (a hosted request handler) and one D1
database. GitHub retains all source, tests, configuration, docs, and artwork;
D1 holds live scores. The game and local scores still work when the service is down.
The owner needs a Cloudflare account, players do not. No laptop process or custom
domain is required. Provider selection/deployment is not yet approved.
Open: standard-only global eligibility, run-vs-player ranking, name limits/ties,
and score retention. Names are labels, not verified identities. Do not combine
people by name. Browser IDs, if used, do not prove identity or prevent cheating.

## Implementation steps

1. Confirm provider and unresolved ranking rules; document costs, ownership, deployment, and outage behavior before provisioning.
2. Keep service code in this repository in a small server directory with an explicit schema/migration and local test command.
3. Implement only submit-score and list-scores operations plus basic deployment health if needed.
4. Validate shape, finite/nonnegative statistics, size limits, and supported sort fields; use parameterized database queries and bounded indexed results.
5. Deduplicate retries by run ID, add modest flood protection, and render display names as text; do not build anti-cheat or mandatory player authentication.
6. Allow the game origin to call the service; CORS is a browser access rule, not protection against forged scores. Keep database access/administrative secrets off the client.
7. Add explicit submit, progress, success, failure, and retry states after game over. Save locally first and never resend automatically without agreed behavior.
8. Build the public podium page with default points sort, alternative sorts, difficulty/rules version metadata, and a README link.
9. Deploy only after provider approval and owner account setup, then verify from a phone/browser with no signed-in GitHub account; document export and simple owner removal of unwanted entries.

## Acceptance criteria and verification

The agreed behavior above must hold; the following checks provide evidence.

Service tests: valid anonymous submission, malformed input, safe display names,
retry deduplication, bounded allowed sorts, and database failures. Browser tests
use a fake service for success/failure so PR checks never write production scores.
Test that local play/storage survives service timeout. Verify actual deployed
submission and listing separately using a clearly identified removable test run.
Phone: finish a run signed out of GitHub, enter a display name, submit, open the
public link, sort by another metric, and test one failed-network retry.

Run `pnpm test` and `git diff --check`. Keep one required Game smoke test job;
add focused rule checks to its command only where necessary. Verify deployment
separately after an explicitly authorized merge.

## Implementation prompt

Copy the following prompt into the implementing agent with this repository open.

```text
Implement only the approved stage of F09 after confirming the hosting decision and ranking rules. Build account-free manual post-game score submission and a public sortable podium, retaining GitHub Pages for the game. Trust reported gameplay; no anti-cheat or player accounts. Keep basic input safety, duplicate prevention, and flood controls small. Never embed repository/database secrets in the client. Test locally with isolated data, keep production untouched by PR tests, and obtain deployment authorization only after the service is concrete and reviewable.

Read AGENTS.md, docs/ROADMAP.md, docs/WORKFLOW.md, and docs/features/09-global-podium.md; inspect current main, tests, and open PRs before deciding what remains. Separate agreed requirements from proposed defaults, and resolve only outstanding behavior decisions with the owner before substantial implementation. Work on a focused branch from current main; preserve existing work. Verify the repository-local Git identity and gaucheCamera GitHub account before committing/pushing, without changing global credentials. Do not spawn parallel agents without agreement. Preserve GitHub Pages /cone_catcher/ paths and desktop/portrait-phone play. Use the existing Node test runner and Playwright; run pnpm test and ensure any new tests are actually included by package.json. Add only meaningful behavior/regression tests. Provide a specific real-phone test and let the owner try gameplay before merge. Update this plan and ROADMAP with actual status, PR, test evidence, and limitations; do not mark deployment or phone checks passed without evidence. Open and review a focused PR, wait for its automated checks, fix failures, and stop before merging. Never force-push, publish/reuse the local refactor branch automatically, or implement unrelated roadmap features.
```

## Delivery evidence

- Commit / PR: not started.
- Automated checks: not run for this feature.
- Owner phone test: pending implementation.
- Deployed Pages check: pending authorized merge/deployment.
- Amendments: update here when a decision or implementation detail changes.

## What the proposed service looks like

A player loads the existing GitHub Pages game. After a run they choose Submit,
enter a display name, and send the small run record to the Worker over HTTPS.
The Worker saves it in D1 and acknowledges success. The podium page asks the same
Worker for an ordered set of records. Cloudflare runs the code and database,
independently of the owner's laptop.

Suggested operations are POST /scores and GET /scores?sort=points. These are
proposed service paths, not deployed URLs. No player account, password, GitHub
access, or email address is needed. Optional owner moderation can initially use
the hosting dashboard rather than a new admin application.

All source and database migrations stay reviewable in GitHub. Live records are
stored in D1, not committed individually to the repository. A README link is enough;
an automatically generated README snapshot can wait. Use one provider for both
the request handler and storage.

As checked on 2026-10-03, the Workers free plan includes 100,000 requests/day;
D1 includes 5 million rows read/day, 100,000 rows written/day, and 5 GB total
storage, subject to additional platform limits. This is likely sufficient for a
small community leaderboard with bounded indexed queries, but traffic is unknown.
A row read is not the same as a podium visit; avoid scanning the whole table.
Recheck current terms before provisioning. Start on the free tier, handle quota
errors, and do not enable paid upgrades without the owner's agreement.

Owner setup consists of creating a Cloudflare account, approving the GitHub
connection or scoped deployment credentials, and authorizing creation of the
Worker/database. Players require none of those accounts. Ongoing work is checking
usage/errors occasionally, maintaining deployment configuration, exporting data
when needed, and removing unwanted entries if the owner chooses.

Alternatives: Supabase could serve this role but adds a different database/API
permission model to learn. GitHub-only issue submissions require GitHub accounts;
manual exports require owner processing. Neither matches frictionless anonymous
submission as well as the proposed small service.

Sources:

- [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Worker pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [Worker GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
