# Daily café discoveries — v0.5.1

## Player experience

“What’s at the café today?” introduces a small piece of café culture each local
day: bean → tool → recipe. Each card has original owner dialogue, a short fact,
an original inline SVG icon, a small observation prompt and a trial action.
Dialogue describes a fictional café; it is not a claim about real inventory,
farmers, harvests or a verified lot. Category facts are introductory editorial
content, not conclusions drawn from the uploaded temperature study.

The first edition contains **12 authored entries**, four in each category:

| Bean stories | Tool introductions | Recipe ideas (coffee / input water) |
|---|---|---|
| Vietnam Arabica · Washed | V60 | 12 g / 180 ml · nominal 1:15 |
| Guatemala · Washed | Gooseneck kettle | 15 g / 240 ml · nominal 1:16 |
| Costa Rica · Honey | Scale | 20 g / 300 ml · nominal 1:15 |
| Ethiopia · Natural | Grinder settings | 15 g / 255 ml · nominal 1:17 |

These are illustrative profiles and starting recipes, not calibrated predictions,
universal brewing recommendations or endorsements of actual bags/equipment.
Facts distinguish process names from guaranteed flavor, scale grams from game ml,
water input from beverage output, and game grind numbers from real particle size.

## Daily selection and notebook

Use the device’s local Gregorian calendar date, with an epoch of 2026-10-24.
Calendar-day arithmetic uses UTC representations of those local date components,
so daylight saving transitions do not introduce fractional-day offsets. Every
visit within a local day selects the same card. At local midnight or when the
page regains focus/visibility, only the discovery host updates; current recipes
and station nodes are not reset. A timezone/device-clock change may change the
selected day. This is a recommendation schedule, not a server-verified competition.

The 12-entry cycle repeats explicitly. Do not advertise infinite daily content.
All entries can be browsed immediately in Café notebook; missing a day costs
nothing. No login, streak, countdown reward, notification, tracking or backend.
The tomorrow teaser names the next category. Archived previews are labeled as
notebook content and do not pretend to be today’s date.

“Save discovery” is an explicit personal bookmark, not inferred reading or
learning. Key `c6s.daily-discovery.v1` contains a version and saved entry IDs.
Unknown future IDs survive edits/export. Duplicate/malformed stores are protected
with a raw recovery download. Quota failure does not display a false saved state
or block trials. Saved notebooks can be exported as JSON. Browser clearing can
lose the local notebook, as explained in the UI.

## Connected trials and compatibility

Bean cards load four new illustrative profiles into First Pour, with no invented
benchmark: their game score is explicitly null/unavailable, not zero or 100.
They can be brewed, saved, reloaded, used in A/B, exported and compared with
unrated taste fields kept separate. A generic illustrative starting recipe does
not imply an empirically optimal recipe for that origin/process.

The three existing scored game archetypes keep their targets and score rule
`first-pour-0.3.1`; old memories need no migration. `firstPourPreset` now supplies
valid starting settings for both kinds of profile. Added IDs require this build
or newer; an older build on rollback may treat a mixed store as recovery-only
rather than overwrite unfamiliar records.

Tools keep the current recipe and focus a relevant setting when appropriate.
Recipe cards preserve the current bean/other settings and change only featured
dose/ratio. Bean cards load their own illustrative starting configuration. The
trial is labeled as coming from the notebook and remains game practice.

Switching from an active pour or dirty/unsaved result opens an accessible native
dialog. Keep/Escape preserves the cup/draft; confirmed replacement keeps existing
memories and loads the suggestion. RAF is paused while deciding. A related fix
copies feedback when capturing drafts, so editing a saved cup no longer aliases
its in-memory saved record before an explicit save. The regression verifies that
unsaved note edits trigger protection.

The discovery feature does **not** claim to solve the v0.5 review’s fixed-flow
mechanics or long-term retention limits. It adds curated curiosity and a route
into practice. The first-shift story, scientific actual-brew collector, source
caveats, photos/OCR, old counter, stable controls and original music remain.

## Verification

- `npm test`: 79 checks, including local-day stability, category rotation, full
  12-day cycle, DST calendar arithmetic, bilingual content and valid trials,
  unknown benchmark handling, null-score memory round trips and notebook recovery.
- Additional daily tests under `TZ=America/New_York` and `TZ=Asia/Ho_Chi_Minh`.
- `npm run build:pages`, `npm run build`: generated artifact and Vite build.
- `smoke-daily-discovery.mjs`: 320/390/820/1440 px, all 12 trial actions, same-day
  save/reload, preserved bean on tool/recipe suggestions, new unscored A/B cups,
  pause/cancel/replace of an active pour and unsaved note, VI/EN, JSON export;
  actual browser midnight transitions in Vietnam/New York without resetting a
  configured recipe; quota/corrupt notebook protection.
- Existing eight-case layout/scroll/node-identity matrix, v0.4 discovery and
  focused first-shift/recovery regressions; old counter, actual-brew and music
  checks. Original unit coverage still tests water bounds on all seven profiles.

Screenshots use synthetic test sessions. Actual Safari/iPad hardware and human
curiosity/return behavior remain unverified. Public URL and manual GitHub Pages
workflow are unchanged; no VPS, jobs or service credentials are needed.

## Review captures

| Width | Bean introduction | Tool introduction | Recipe introduction |
|---|---|---|---|
| 320 px | [Bean](review/daily-discovery/320-bean.png) | [Tool](review/daily-discovery/320-tool.png) | [Recipe](review/daily-discovery/320-recipe.png) |
| 1440 px | [Bean](review/daily-discovery/1440-bean.png) | [Tool](review/daily-discovery/1440-tool.png) | [Recipe](review/daily-discovery/1440-recipe.png) |
