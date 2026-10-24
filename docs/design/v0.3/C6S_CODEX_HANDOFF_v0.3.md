# CODEX HANDOFF — The Coffee Six Sense v0.3 (The First Pour)

## Repository and deployment
- Canonical repository: `tahulk79/TheCoffeeSixSense`.
- Hosting: **GitHub Pages** (not VPS, not SSH/Nginx).
- User reports that GitHub Pages builds and serves the site. Inspect repository and its actual Pages configuration before changing anything. Do not assume a URL or deployment branch.
- Product: The Coffee Six Sense; slogan **Discover Your Sixth Taste**; philosophy **From Coffee to Consciousness**.

## Objective
Implement and integrate **v0.3 The First Pour** into the EXISTING GitHub repository and its GitHub Pages deployment, without deleting current features or changing the deployment architecture unnecessarily. A reference prototype is provided as `TheCoffeeSixSense_v0.3_The_First_Pour.zip` and a master GDD as `TheCoffeeSixSense_Game_Design_Master_GDD.md`. Treat them as reference artifacts, not an instruction to overwrite a more advanced live application.

## Non-negotiable workflow
1. Inspect repo: framework, build commands, Pages deployment workflow, branch, existing UI/features/tests. Report baseline and any differences with reference prototype.
2. Review the supplied prototype code and GDD; merge relevant functionality into current architecture. If reference files are not accessible from Codex, explicitly state this and implement from requirements below; do not claim you imported them.
3. Work on a feature branch, create PR, run tests/build, document changes. Do not auto-merge or publish without owner approval unless existing repo policy explicitly permits it.
4. Preserve current URL routing and GitHub Pages base path. No VPS/SSH secrets or workflows.

## MVP gameplay — v0.3
- Mobile/iPad-first responsive, touch friendly, EN/VI.
- Choose three representative beans: Ethiopia Washed, Colombia Honey, Brazil Natural.
- Configure grind size, water temperature, coffee-to-water ratio, and brew time.
- Interactive pour-over in **three stages**: (1) bloom, (2) main pour, (3) final pour. Show poured water amount and progress with clear, usable touch controls. Validate against the target total water; allow reset/restart.
- A deterministic, explicitly **illustrative educational scoring model**; never imply actual TDS/extraction or sensory scores are scientifically measured.
- Six sensory axes: aroma, acidity, sweetness, bitterness, body, aftertaste. **Sixth Taste** is a metaphorical discovery, not a sixth scientifically established basic taste.
- Coffee Memory: save brew recipe, notes, optional subjective real-world taste rating; compare two entries, export JSON, delete records. For guest mode use localStorage, with clear privacy/data-loss explanation.
- Accessible controls and useful feedback for incorrect inputs; graceful behavior on Safari iPad and narrow mobile viewports.

## Art direction (design target, not a full 3D requirement)
**Cozy Specialty Coffee — 2.5D / isometric-inspired**: warm espresso brown, cream, forest green, copper; specialty coffee brewing station, clean legible UI, subtle steam/water/bloom motion. Reference inspirations: Coffee Caravan (cozy staging), Coffee Talk (warm storytelling atmosphere), Cuppology (hands-on brewing). Build lightweight CSS/SVG/Canvas art as appropriate; avoid costly 3D engines and copied copyrighted artwork/assets.

## Scope and priorities
- P0: fun tactile three-stage pour-over, coherent score/result, save/compare Coffee Memory, mobile performance, working GitHub Pages build.
- P1 (only if P0 complete): A/B brewing comparison, taste radar, improved visual effects.
- Future backlog, NOT for this PR: Coffee DNA personalization, Coffee Challenges, Coffee World management, Sixth Realm, multiplayer, monetization.

## Acceptance criteria
- Existing site and previously working features are not broken.
- All three pour stages can be completed with tap controls; visible stage transitions and progress; total water is bounded.
- Same inputs produce same simulation results; saved entries persist after refresh and can be compared/exported/deleted.
- UI usable on iPad Safari and 320px mobile; EN/VI text renders correctly; keyboard-accessible controls.
- Static site builds successfully with repository's existing commands and is deployable via existing GitHub Pages workflow.
- PR contains screenshots or screen recording (desktop and mobile), test commands/results, feature summary, known limitations and exact Pages preview/production URL when verified.
- Never claim real browser/device testing unless actually performed; otherwise label it unverified.

## Deliverables
A feature branch + Pull Request; working code, tests and README; GitHub Pages compatibility verified; concise changelog and remaining blockers. Ask the owner for approval before merge/deploy if required by repository policy.
