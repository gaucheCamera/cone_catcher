# Working on Cone Catcher

Read [docs/ROADMAP.md](docs/ROADMAP.md) and the relevant feature plan before changing code.
Reconcile the documents with current main, open PRs, and tests. A plan is not proof
that a feature is implemented. Refresh stale implementation details; bring changes
to agreed gameplay behavior back to the owner.

## Collaboration

- Explain plans and results in plain language and involve the owner in game feel.
- Agree on intended behavior, acceptance criteria, and tests before substantial changes.
- Once agreed, deliver implementation, meaningful tests, and a reviewable PR.
- Give concise progress updates. Let the owner try gameplay changes before merge.
- Do not start parallel agents without the owner's request or agreement.
- Keep changes focused and implementations simple. Comment game rules and
  surprising calculations, not obvious code. Avoid tests that duplicate implementation.

## Git and GitHub

- Inspect the working tree and branch first; preserve existing work.
- Start focused branches from up-to-date main. Never commit directly to main.
- Before the first commit or push in a session, verify repository-local Git author
  identity and the intended GitHub account: gaucheCamera.
- Never change Git credentials or global Git identity. Let the owner resolve
  account problems; the work GitHub account must remain unaffected.
- Run agreed checks before pushing, open a focused PR, review its diff and checks,
  and fix failures before presenting it for merge.
- Never force-push, discard existing work, or merge without explicit instruction.
- Update the relevant feature status, evidence, limitations, and PR link in the
  same PR. Record phone verification separately from automated verification.
- The approved baseline is one required Game smoke test check, focused rule tests
  as needed, owner phone testing before gameplay merges, and a deployed Pages check
  after merge. Verify actual GitHub protection; a document does not enforce it.

## Project constraints

- Keep the game playable on desktop and phones at /cone_catcher/ on GitHub Pages,
  independently of the owner's laptop. Design gameplay for portrait orientation.
- Do not use Shiny. Prefer small plain JavaScript modules over a framework rewrite.
- The local-only branch refactor/components-and-checks, commit 4dcaeed, has author
  CristianNa. The workflow is now agreed, but review that branch only for ideas
  when useful; never publish, merge, cherry-pick, or reuse it automatically.
- Android Codex Remote access is deferred and does not block laptop development.
- Keep two playable skins labelled Character 1 and Character 2 with compact
  arrow/flick selection. Each skin retains collision geometry matching its size.
- Preserve visible ears on baby hares running on the ground.
- Touch controls must not select text on long press or hide the player under a finger.
- New mechanics need adjustable settings and agreement on controls, defaults, and
  interactions before implementation. The roadmap is not blanket authorization.
- Community artwork must have a documented integration path and attribution.

## Verification

Use the commands in README and [docs/WORKFLOW.md](docs/WORKFLOW.md); inspect
package.json before adding or changing them. Test affected rules and a running
local game, at desktop and phone viewport sizes. Serve assets under /cone_catcher/.
Provide a concrete real-phone test for each gameplay PR and wait for owner feedback
before merge. Distinguish local results, GitHub checks, and the actual deployment.
