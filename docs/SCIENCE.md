# Evidence boundaries and source review

Status: 2026-10-23. No empirical calibration dataset, trained model or validated sensory predictor is bundled with this application. Simulated sessions must never be relabeled as real-brew observations.

## What the app can establish

| Claim/calculation | Basis | Scope and limit |
| --- | --- | --- |
| A filtered beverage's apparent extraction yield (%) is beverage mass (g) × TDS (%) / dry dose (g) | Mass-fraction calculation | Requires appropriate measured TDS, beverage and dose. This does not measure quality, distinguish compounds or establish flavor. Minerals/measurement procedure can affect interpretation. |
| A missing TDS cannot provide measured extraction yield | Missing-input rule | The app leaves this result unavailable rather than fabricating it. Estimated or unclassified inputs remain labeled accordingly. |
| Game water/material accounting balances | Software invariants and tests | Does not show that retention, flow, kinetics or coefficients match a physical brewer. |
| Game acidity/bitterness | Fictional lot attributes | No longer inferred from temperature, time or extraction. Not real sensory measurements. |
| Game strength bands and guest acceptance | Game design | Not a brewing control chart or trained preference predictor. |
| Real sensory ratings | User reports before analysis is opened | Not independently verified, not certified blind tasting. Liking is distinct from intensity; body is distinct from strength. |

## Primary-source register: NOT reviewed

Original retrieval of Scientific Reports and WCR was blocked by the managed network (HTTP 403/CONNECT denial). A supported network permission request was granted, but retrieval remained blocked. No alternate credential, proxy bypass or copied dataset was used. Therefore, no coefficients or quantitative sensory claims have been attributed to these references.

| Candidate | Link | Potential purpose after review | Current status |
| --- | --- | --- | --- |
| Scientific Reports article identifier s41598-020-73341-4 | https://www.nature.com/articles/s41598-020-73341-4 | Examine experimental design and temperature/sensory relationships | Original not retrieved; title, methods, quantitative conclusions and reuse rights not verified in this task |
| WCR Sensory Lexicon | https://worldcoffeeresearch.org/resources/sensory-lexicon | Review sensory vocabulary and references | Original not retrieved; no descriptors/reference recipes copied |
| SCA research directory | https://sca.coffee/research | Locate current research, including brewing-control work | Directory candidate, not itself a reviewed paper or evidence for coefficients |

Before promoting a source: record exact bibliographic metadata, DOI, access/review date, study method, roast/lots, equipment, sample size, TDS/yield ranges, controls, outcomes, uncertainty, exclusions and data/license terms. Distinguish association from controlled effects. Retain a claim-to-source table; do not turn a brewing chart into a universal taste or quality score. If data are not reusable, cite findings without importing the dataset.

## Version and storage boundaries

- `counter-assumptions-v3`: uncalibrated game model; `kind: game_simulation`, no validated confidence, fixed fictional acidity/bitterness. Earlier counter records retain their original version and values.
- `pourover-observation-v1`: separate self-reported actual-brew collection protocol, not a verification certificate.
- `real-analysis-v1` / `apparent-ey-v1`: arithmetic from user inputs, no flavor prediction or scientific quality score.
- `c6s.real-brews.v1`: actual observations only; separate from `c6s.cafe.v1` and legacy `c6s.sessions.v1`. Unknown values are null, not zeros or typical recipe defaults.

The record stores units and provenance per numerical field, instrument descriptions when supplied, actual-brew attestation, lot/roast, brewer/grinder identity, real-second pouring milestones, series/repeat/taster codes, self-reported prior-prediction exposure and whether a simulation result was shown during this visit. An unanswered tasting has null sensory timestamps and cannot be labeled tasting evidence. A browser-visit flag cannot prove that someone has never seen a prediction elsewhere.

No data is uploaded, no analytics or ML training runs, and no empirical records are preloaded. Users can export JSON, including incomplete records, for later review. Corrupt storage is protected and recoverable; a failed write retains the form and reveals no calculation. Drafts are in memory until saved/downloaded; reload discards unsaved entries.

## Next validation work

Use [the pilot protocol](REAL-BREW-PROTOCOL.md). It establishes a collection workflow, not statistical sufficiency. Keep observed data separate from model development data. Later validation must hold out complete lots, people or series as appropriate, and compare with simple baselines. Measurements and ordinal self-reports need different error models; repeated brews are not independent new tasters. No confidence intervals or probabilities should be presented until their calibration has been evaluated.
