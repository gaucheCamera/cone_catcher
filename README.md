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

Preview this branch with `pnpm preview` and open
http://127.0.0.1:4173/cone_catcher/. Stop the server with Ctrl+C.
The preview serves only the game and uses the same URL prefix as GitHub Pages.

Optional Wi-Fi preview, only when requested: use `pnpm preview --host 0.0.0.0` on the laptop,
connect the phone to the same Wi-Fi, and open
`http://<laptop-Wi-Fi-IPv4-address>:4173/cone_catcher/` on the phone. Find that
address in Windows Wi-Fi properties (or `ipconfig`); 0.0.0.0 is a listening address,
not the phone URL. Windows may require allowing Node on the private network.
This is a candidate preview; the public Pages game changes only after merge.

F00/F02 phone test before merge:
1. Flick between Character 1 and Character 2, tap arrows, and try a vertical swipe.
   Check selection wraps, vertical swipes do not select, and taps after flicks work once.
2. Open Settings, edit a value, return, and start with each character.
   Check the preview and selected skin agree; settings cannot be edited during a run.
3. Hold movement, pause with another finger, release movement, and resume.
   Time must freeze; the player must wait for fresh input after resume.
4. Long-press corner controls; check no text selection and usable targets.
   Reset while playing and paused, and use Reset or Play again after losing.
   Each route must return to selection with settings/skin retained and no automatic start.
5. Start again, play, and switch away from the browser and back; the run should pause.
   Confirm the character remains visible above the movement buttons. Also check the
   existing baby-hare ear behavior described below.

F01 phone test before merge: play for one minute, restarting if needed. Observe
short horizontal, vertical and diagonal squirrel scampers with pauses, brown/red
fur, and left/right facing changes. Slow climbing should be broken up frequently
by scampers and cover more of the tree. Check they stay in their own foliage without
sudden jumps, with wider horizontal steps near the base and constrained steps near
the top. Check that the motion feels comfortable. Pause/resume to check
movement freezes, then reset and start again. Squirrel movement has no Settings controls.

Install dependencies with `pnpm install --frozen-lockfile`, then run `pnpm test`.

F03 local preview and post-merge phone test: wait 8 seconds for a small grey/brown mushroom,
walk through it with each skin, and watch its short rotating flight to the base
of the leaves. The nearest squirrel should show an ellipsis, keep moving, and
stop throwing for 5 seconds by default (adjustable from 5 to 60 in Settings).
Check normal throwing returns, pause in flight and resume, then reset. Set
Mushrooms emergence to 0 to disable it; use 2 seconds for easier preview observation
and restore 8 seconds afterward. Future seasonal integration permits autumn only;
this functionality preview currently enables mushrooms from run start.

Numeric settings are plain text fields with a decimal keypad on phones. The first
tap/focus selects the value for replacement; there are no increment/decrement
arrows. Ranges appear beneath fields and are applied only on leaving Settings.
Empty/invalid entries retain their previous value, and decimal commas are accepted.
For F03, the owner chose on 2026-10-04 to skip Wi-Fi phone preview and test on
GitHub Pages after merge. Leave the firewall unchanged. Real Android Firefox
verification remains pending; desktop phone dimensions are simulated.

The test checks the inline JavaScript and starts the game in Microsoft Edge at
desktop and phone widths. It serves the page under `/cone_catcher/` to catch
broken absolute paths. Edge must be installed locally. The `Game smoke test`
GitHub Actions job installs Edge on its own runner and runs on pull requests.

Before merging a gameplay change, also try it on a real phone and check the
deployed GitHub Pages game after merge. For the baby hare ear fix, set Baby hare
to 50%, start a run, let a hare land without catching it, and check that both
ears remain visible while it runs away. Repeat on a desktop browser and phone.

The active main ruleset requires PRs and a passing `Game smoke test` on an
up-to-date branch. See docs/WORKFLOW.md for the verified protection details.
