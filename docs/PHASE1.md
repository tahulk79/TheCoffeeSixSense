# Phase 1: playable brewing and tasting loop

## Optional studio and earlier decision lessons

Phase 1 is a local-first learning game. It runs without a backend, login, real brewing equipment, remote analytics or credentials. It does not predict extraction or assess objective cup quality. Cloud sync and wider release/analytics work are outside this phase.

The reference recipes are game targets. A quick-start button lets a new player (including an existing journal owner who has never played the decision version) try the lesson without editing a form. Recipe controls remain available under optional customization. The first lesson uses a repeatable situation and contextual hints.

Three stages simulate bloom, second pour and finish. Each stage has a visible cue and two or three actions with tradeoffs: wet dry patches or leave an even bed undisturbed; pause at high water, feed low water, or address uneven flow; correct a tilted bed or preserve a level one. Actions show immediate explanations and can change the next cue. All actions still complete the planned cumulative volume; these are deliberately simplified game situations, not measured brewing physics or a real-time timer.

Starting approaches affect the situation, not a fixed points penalty. Any approach can achieve a clean run by responding to cues. New starter-bean scores combine the existing reference-recipe score with the decision penalties shown in a ledger; personal sensory notes never affect them. Personal beans retain a null target score and receive only observational game feedback. A three-decision report records what happened and why.

After pouring, the game shows simulated balance and one concrete retry goal. “Try one change” reuses the recipe and scenario: address the first missed decision, make one bounded parameter adjustment after a clean pour, or try a starting approach with a different cue sequence. If an earlier choice changes a downstream cue, the player must observe again rather than blindly follow the old suggestion. This is a short replay loop, not a multi-session Phase 2 journey. Players can save immediately or choose hypothetical notes/real-cup impressions; detailed sensory fields are collapsed, optional and start blank. Enjoyment is the sixth-sense metaphor and never changes simulation scores. Save confirmation awards practice XP once and offers replay or a fresh recipe. Cancelling an unsaved brew requires confirmation.

Both Vietnamese (default) and English cover the entire interface. Switching languages retains the current recipe, pour step and unsaved tasting notes. Language preference and saved history survive reloads when browser storage is available.

## Persistence and progression

The journal keeps the existing `c6s.sessions.v1` storage key and legacy records. Old records without a journal mode are clearly labeled unspecified; new fields are not invented. Comparison distinguishes hypothetical and real-cup modes. Exports include parameters, pouring technique, ratings, notes and discoveries.

Four sequential quests and four practice badges derive from saved history, so existing sessions count. A controlled experiment changes one independent recipe field, starting approach or pour decision in the same scenario, and records a discovery. Downstream responses to changed cues are consequences rather than additional independent changes. Legacy session pairs retain their earlier rules. The journal stores versioned pour runs; malformed runs are preserved as recovery data instead of overwritten. Comparison labels the earlier recipe-only and new decision score models, which are not directly equivalent.

A failed storage write retains the draft, gives no XP and permits retry or draft download. Malformed stored data is never silently overwritten: saving is disabled and the original bytes are available as a recovery download. Journals are local to the browser and origin; export before moving devices or clearing storage. Drafts are not retained across page reloads; use draft download if you need to leave before saving.

## Validation

Run from the repository root with Node 22 or later:

```sh
npm ci --no-audit --no-fund
npm run build:pages
npm test
npm run build
```

The standalone parity test rejects a stale Pages artifact. Pages must use **Settings → Pages → Source: GitHub Actions**, not branch-root publishing. The manual `pages.yml` workflow deploys `docs/`. Production VPS deployment is a separate workflow and is not part of this release.

Browser regression checks are saved in `scripts/smoke-browser.mjs`. Start `npm run dev -- --port 5173 --strictPort` in a separate terminal. Install Playwright outside the checkout if needed and point `PLAYWRIGHT_MODULE` at its `index.mjs`; `CHROMIUM_PATH` defaults to `/usr/bin/chromium`. Then run:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/smoke-browser.mjs
```

These checks exercise both Vite and the standalone artifact at 360, 768 and 1440 pixels: recipe validation, all three pours, bilingual switching mid-brew and mid-review, blank optional ratings, save/replay, comparison, JSON downloads, failed-write recovery, cancellation, legacy journals, malformed-data preservation, page errors and horizontal overflow.

## Personal beans extension

Phase 1 includes personal bag profiles with packaging/bean photos, manual metadata review and brewing without an invented reference score. Packaging OCR runs locally in the browser using assets bundled with GitHub Pages; no VPS or API key is needed. Explicit labels are proposed for review, and unknown information stays blank. See [BEAN-AI.md](BEAN-AI.md).

## Decision gameplay validation

`tests/pour-game.test.mjs` covers all nine scenario/approach combinations, state-dependent actions, consequences, recovery, immutable state, bounded goals, custom beans without target scores, malformed/legacy journals, controlled experiments and all reachable localized cue/action/effect strings.

Run the new gameplay browser regression with the dev server active:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/smoke-pour-game.mjs
```

It exercises quick start, deliberate mistakes and feedback, same-scenario retry, one-change goals, score explanation, language switching, rapid double-click protection, keyboard choices and persisted reports at 360/768/1440px on Vite and Pages. Existing journal/OCR smoke tests use the same visible-choice helper.

## Coffee counter revision: timing and causal feedback

The default counter game uses a fictional model, not a calibrated coffee predictor. Each starter lot has an explicit roast and fictional flavor profile; origins alone do not determine taste. Guests have reachable targets and their acceptance and retry advice share one verdict. A happy guest is not told that the cup requires correction; overflow can separately be described as wasted beverage.

The visible clock runs at an explicitly labeled 6× simulation speed. It starts with first water, separates active pouring from waiting/drawdown, and stops with drawdown. Hidden tabs pause it. Sticky mobile clocks remain visible while operating the controls. Timelines record the first water, each pour/pause and the finish. Comparison includes total/pour/wait/wet-contact time, pulse count, beverage yield and overflow, as well as coarse flavor bands.

A fixed 12 g dose and 180 ml input are disclosed. The toy model retains 24 ml in the grounds, conserves water across retention/filter/cup/overflow, and conserves extracted material across filter/cup/spillage. Temperature, lot parameters and wet contact affect a saturating dissolution calculation; waiting with a dry filter cannot create more extraction. Strength derives from material collected per beverage volume, not a direct penalty for overflow. Relative acidity/bitterness bands use the fictional lot and extraction zone, not a claim that hotter water always tastes less acidic. These calculations have not been calibrated to physical brews or taste panels. Clock speed is a game pacing choice, not a real recipe recommendation.

A drawn kettle, animated inlet, continued drawdown stream and overflow stream make water movement visible. Reduced-motion preferences stop stream animation while keeping state visible. Pointer, keyboard, one-tap toggle, blur and hidden-tab behavior remain supported. A small final-volume tolerance avoids a stuck 179 ml display.

Counter results carry model version 2 in the existing separate `c6s.cafe.v1` key (latest 30); earlier counter results are retained without recalculating them. Unfinished cups do not survive reload. Legacy journals/photos/OCR remain in the optional studio.

Validation: `npm test` covers clock boundaries, pulse events, water/material conservation, temperature/contact effects, dry waits, consistent advice, final-volume completion and reachable guest targets. `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/smoke-cafe.mjs` checks the generated Pages artifact on mobile and desktop, including visible clocks, pouring/drawdown, replay comparison/timeline, bilingual notes, reload and studio access. These checks validate behavior rather than real-world sensory accuracy or player retention.

## Scientific-boundary and actual-brew revision

The counter now records `counter-assumptions-v3`: unsupported extraction-to-acidity/bitterness coefficients were removed. Those two axes remain explicitly fictional lot attributes. Relative strength and internal dissolution bands remain uncalibrated game assumptions. A bilingual “Why? Evidence & limits” panel distinguishes definitions, assumptions and primary sources awaiting review; no confidence probabilities are fabricated.

A separate actual-brew form is accessible directly from the top of the page. It records real seconds and grams, per-field measured/estimated/unknown provenance, actual-brew attestation, optional tools/TDS/milestones and repeat/taster codes. Tasting is entered before opening calculations. Apparent extraction yield is only calculated when dose, beverage and TDS are present; estimated inputs remain estimates. No acidity/bitterness prediction or quality score is produced. Empty sensory responses stay unassessed. Local JSON export is separate from simulation and legacy journals, with recoverable storage failures.

See [SCIENCE.md](SCIENCE.md) for evidence status, the blocked original-source review and version/schema boundaries, and [REAL-BREW-PROTOCOL.md](REAL-BREW-PROTOCOL.md) for a pilot workflow. No actual experimental dataset has yet been collected or used to calibrate the model.

## Supplied-source review completed

The scientific paper/supplement, S1/S5 CSVs and WCR/SCAE/SCA documents supplied on 2026-10-23 have been reviewed. [Detailed findings](evidence/2020-temperature-review.md) replace the earlier pending-source status; this does not calibrate the game or create an ML predictor. Actual-brew forms now support optional serving temperature and holding time, and explicitly identify their casual 1–5 sensory scale. Existing records without those fields remain readable and exportable unchanged.
