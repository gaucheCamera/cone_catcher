# Development and verification workflow

Status: approved by the owner on 2026-10-03. GitHub enforcement verified on 2026-10-03.

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
- Preview the candidate locally: `pnpm preview`, then open
  http://127.0.0.1:4173/cone_catcher/. See README for phone preview instructions.
- Edge is required locally. CI installs it with
  `node node_modules/playwright/cli.js install --with-deps msedge`.

Currently package.json runs only tests/game-smoke.test.cjs. If adding separate rule
test files, update the test command deliberately so they actually run in CI.
Keep Node's built-in test runner and the existing Playwright dependency.
No new framework, coverage threshold, screenshot service, or large browser matrix
is required by this plan.

## Approved baseline

The existing Game smoke test job runs on PRs and pushes to main. The F00/F02
candidate extends it to check script parsing, screen transitions, frozen time,
clean reset/restart input, character navigation/locking, touch activation, and
skin collision edges at 1280x800 and 390x844 under /cone_catcher/. It also checks
browser errors, horizontal overflow, and movement control visibility. Test-only
rule access is inserted by the fixture and is not shipped in index.html. The
fixture uses the same HTTP server as pnpm preview.

Make this one check required for PRs into main, with changes entering via PR.
The initial assessment reported main as unprotected. The F00 assessment on
2026-10-03 verified the active [Protect main ruleset](https://github.com/gaucheCamera/cone_catcher/rules/24427686):
PRs are required, Game smoke test must pass with the branch up to date, and deletion
and force pushes are blocked. No bypass actors or mandatory approving reviewer
accounts are configured. The owner's gameplay review is still expected.

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

For F03, the owner requested on 2026-10-04 that local/Codex and real-phone Wi-Fi
previews happen before any commit or PR. Incorporate preview feedback first.
The owner declined the unexpected Windows Node.js firewall prompt. Explain and
obtain explicit approval before any system/network allowance; never bypass the
declined prompt. A phone-sized Codex viewport is only simulated layout evidence.

For gameplay, the owner tests on a real portrait phone before merge: input feel,
long press, swipes, visibility, and the affected mechanic. A phone-sized desktop
browser is not evidence of real touch behavior. Agree an accessible candidate
preview if needed; do not merge just to provide a preview.

F03 exception agreed on 2026-10-04: the owner chose to skip Wi-Fi phone preview
and test on GitHub Pages after merge. Leave the firewall unchanged. Finish local
desktop and phone-size checks, prepare the PR, and obtain explicit merge
authorization as usual. Record the real-phone result after deployment.

Merge only on explicit instruction. After merge, verify the Pages deployment and
actually load/play the deployed /cone_catcher/ game, including its assets and
affected flow. Deployment success alone does not prove gameplay works.

## Status and evidence

Use planned, awaiting-design, in-progress, awaiting-phone-test, ready-for-review,
or merged. Record commit, PR, automated results, phone feedback, and deployment
verification separately. Feature completion must be backed by code and evidence.
