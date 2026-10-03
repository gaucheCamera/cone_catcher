# cone_catcher

The game is a single `index.html` page served by GitHub Pages at `/cone_catcher/`.

## Roadmap and contributing

Start with [the roadmap and current status](docs/ROADMAP.md), which links to a
separate implementation plan and agent prompt for each proposed feature.
[AGENTS.md](AGENTS.md) records project constraints, and
[the workflow](docs/WORKFLOW.md) records the agreed checks and review process.
These documents distinguish approved behavior, open design choices, and delivered
work. Update them with the relevant implementation PR and verification evidence.

## Development checks

Install dependencies with `pnpm install --frozen-lockfile`, then run `pnpm test`.
The test checks the inline JavaScript and starts the game in Microsoft Edge at
desktop and phone widths. It serves the page under `/cone_catcher/` to catch
broken absolute paths. Edge must be installed locally. The `Game smoke test`
GitHub Actions job installs Edge on its own runner and runs on pull requests.

Before merging a gameplay change, also try it on a real phone and check the
deployed GitHub Pages game after merge. For the baby hare ear fix, set Baby hare
to 50%, start a run, let a hare land without catching it, and check that both
ears remain visible while it runs away. Repeat on a desktop browser and phone.

The repository owner can mark `Game smoke test` as a required status check in
the `main` branch protection or ruleset settings after its first PR run.
