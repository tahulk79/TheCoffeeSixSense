# The Coffee Six Sense

**Brew → Taste → Compare → Discover → Improve**

A web-first specialty coffee learning game where players practice brewing, evaluate sensory qualities, compare past sessions, and record personal discoveries. The “sixth sense” is the player's subjective emotional uplift, represented as a game metaphor rather than a scientific claim.

## MVP gameplay
1. **Brew:** choose one of three starter beans and adjust dose, grind, water, temperature and pouring technique.
2. **Taste:** record aroma, acidity, sweetness, bitterness, body, aftertaste and personal impressions. Clearly distinguish simulated feedback from real-world sensory ratings.
3. **Compare:** review previous brews side by side, including settings and scores.
4. **Discover:** write hypotheses about what made a cup better or worse, preserving them in a personal Coffee Memory journal.
5. **Improve:** retry a brew using learned insights and earn progression rewards.

## MVP requirements
- Responsive web experience for desktop, iPad and mobile.
- Vietnamese and English localization.
- Local-first persistent session history and exportable journal data.
- Simple onboarding and replayable pour-over loop.
- Basic event tracking architecture, without launching advertising.

## Delivery plan
- **Phase 0:** audit and import existing prototype v0.1 code.
- **Phase 1:** complete end-to-end brewing and tasting loop.
- **Phase 2:** session history, comparisons, discoveries and progression.
- **Phase 3:** accessibility, mobile QA, analytics instrumentation and MVP release.
- **After MVP:** consider backend sync, domain, social accounts and marketing test.

## Constraints
- AI-assisted development; target AI/tool budget around USD 300.
- Web MVP first; native apps later.
- Initial marketing test budget USD 3,000, deferred until MVP is ready.
- No game-specific domain, social/advertising accounts or campaigns before MVP.

## Brew quests

The coffee journey includes four quests: save all three starter beans, record three discoveries, change exactly one setting between consecutive brews of the same bean and record the result, then save three brews of one bean with a simulated balance of at least 90. Quests unlock in order; existing saved history counts. Simulation goals are game mechanics, not objective taste measurements.

After changing frontend modules or styles, regenerate the GitHub Pages artifact with `node scripts/build-standalone.mjs --write`. Run `npm test` and `npm run build`; tests reject a stale `docs/index.html`. Pages publishes this self-contained artifact through the manual Pages workflow.

## Status
The repository contains a playable Vite frontend with brew simulation, personal tasting reviews, local session history, comparison, discoveries and JSON export. Vietnamese localization and progression remain planned. The original standalone preview is in `docs/index.html`.

Production deployment preparation targets **https://cf.ta79.com** on Ubuntu/Nginx. See [the deployment runbook](docs/DEPLOYMENT.md) for local verification, DNS, HTTPS bootstrap, restricted SSH deployment, approval gates and rollback. Production has not been provisioned or deployed by this change.
