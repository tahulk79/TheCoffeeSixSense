# Phase 1: playable brewing and tasting loop

## Scope

Phase 1 is a local-first learning game. It runs without a backend, login, real brewing equipment, remote analytics or credentials. It does not predict extraction or assess objective cup quality. Cloud sync and wider release/analytics work are outside this phase.

The reference recipes are game targets. A player selects one of three beans, edits dose/water/temperature/grind and chooses pulse, steady or fast pouring. The reference button and ratio display help new players start. Three explicit actions simulate bloom, second pour and final pour; their cumulative water always finishes at the selected volume. These steps are not a real-time brewing timer. Technique affects the game score separately from personal sensory notes.

After pouring, the game shows simulated balance and one suggested next experiment. Players choose hypothetical notes or actual real-cup impressions; all six intensity ratings and the personal enjoyment rating are optional and start blank. Enjoyment is the sixth-sense metaphor and never changes simulation scores. Save confirmation awards practice XP once and offers replay or a fresh recipe. Cancelling an unsaved brew requires confirmation.

Both Vietnamese (default) and English cover the entire interface. Switching languages retains the current recipe, pour step and unsaved tasting notes. Language preference and saved history survive reloads when browser storage is available.

## Persistence and progression

The journal keeps the existing `c6s.sessions.v1` storage key and legacy records. Old records without a journal mode are clearly labeled unspecified; new fields are not invented. Comparison distinguishes hypothetical and real-cup modes. Exports include parameters, pouring technique, ratings, notes and discoveries.

Four sequential quests and four practice badges derive from saved history, so existing sessions count. A controlled experiment changes exactly one numeric recipe field or pouring technique between consecutive same-bean sessions and records a discovery.

A failed storage write retains the draft, gives no XP and permits retry or draft download. Malformed stored data is never silently overwritten: saving is disabled and the original bytes are available as a recovery download. Journals are local to the browser and origin; export before moving devices or clearing storage. Drafts are not retained across page reloads; use draft download if you need to leave before saving.

## Validation

Run from the repository root with Node 22 or later:

```sh
npm ci --no-audit --no-fund
node scripts/build-standalone.mjs --write
npm test
npm run build
```

The standalone parity test rejects a stale Pages artifact. Pages must use **Settings → Pages → Source: GitHub Actions**, not branch-root publishing. The manual `pages.yml` workflow deploys `docs/`. Production VPS deployment is a separate workflow and is not part of this release.

Browser regression checks are saved in `scripts/smoke-browser.mjs`. Start `npm run dev -- --port 5173 --strictPort` in a separate terminal. Install Playwright outside the checkout if needed and point `PLAYWRIGHT_MODULE` at its `index.mjs`; `CHROMIUM_PATH` defaults to `/usr/bin/chromium`. Then run:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/smoke-browser.mjs
```

These checks exercise both Vite and the standalone artifact at 360, 768 and 1440 pixels: recipe validation, all three pours, bilingual switching mid-brew and mid-review, blank optional ratings, save/replay, comparison, JSON downloads, failed-write recovery, cancellation, legacy journals, malformed-data preservation, page errors and horizontal overflow.
