# Development and verification workflow

Status: approved by the owner on 2026-10-03. GitHub enforcement remains pending.

## Before work

1. Read AGENTS.md, ROADMAP.md, and the selected feature document.
2. Inspect the working tree and current branch; preserve all existing work.
3. Fetch main, inspect open PRs, and create a focused branch from current main.
4. Check repository-local author identity and the GitHub account before committing
   or pushing. Use gaucheCamera; never alter global credentials or identity.
5. Confirm unresolved behavior, proposed tuning values, acceptance criteria, and
   tests with the owner. Do not ask again about decisions already recorded as agreed.

## Existing commands

- Install the locked dependencies: `pnpm install --frozen-lockfile`.
- Run the existing checks: `pnpm test`.
- Edge is required locally. CI installs it with
  `node node_modules/playwright/cli.js install --with-deps msedge`.

Currently package.json runs only tests/game-smoke.test.cjs. If adding separate rule
test files, update the test command deliberately so they actually run in CI.
Keep Node's built-in test runner and the existing Playwright dependency.
No new framework, coverage threshold, screenshot service, or large browser matrix
is required by this plan.

## Approved baseline

The existing Game smoke test job runs on PRs and pushes to main. It checks script
parsing and starts, pauses, and resumes the game at 1280x800 and 390x844 under the
/cone_catcher/ prefix, checking browser errors and horizontal overflow.

Make this one check required for PRs into main, with changes entering via PR.
On 2026-10-03 the GitHub branch endpoint reported main as unprotected. This
documentation PR does not change GitHub settings. Verify and configure the rule
before the first gameplay merge under this workflow. Do not require a second
reviewer account in a solo-owner project; the owner's review is still expected.

Extend the existing suite only where behavior changes justify it:
- Browser flow: setup, settings, pause/resume, reset, game over, and podium.
- Rule tests: movement bounds, distraction, difficulty, seasons, score storage.
- Serve actual modules/images under the Pages prefix when the project gains them;
  the current fixture serves only index.html.
- Use controlled clocks and random values for rule tests, not slow real-time runs.
- Preserve the hare-ear fix through visual review when rendering changes.

## PR and deployment

Before pushing, run agreed tests and `git diff --check`. Open a focused PR with the
problem, result, test evidence, limitations, and exact manual test. Inspect its diff
and automated checks. Fix failures. Update the roadmap and feature evidence.

For gameplay, the owner tests on a real portrait phone before merge: input feel,
long press, swipes, visibility, and the affected mechanic. A phone-sized desktop
browser is not evidence of real touch behavior. Agree an accessible candidate
preview if needed; do not merge just to provide a preview.

Merge only on explicit instruction. After merge, verify the Pages deployment and
actually load/play the deployed /cone_catcher/ game, including its assets and
affected flow. Deployment success alone does not prove gameplay works.

## Status and evidence

Use planned, awaiting-design, in-progress, awaiting-phone-test, ready-for-review,
or merged. Record commit, PR, automated results, phone feedback, and deployment
verification separately. Feature completion must be backed by code and evidence.
