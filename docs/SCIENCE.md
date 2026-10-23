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

## Primary-source register: supplied documents reviewed

The user supplied the paper, supplement, two CSV transcriptions, WCR Lexicon and SCAE/SCA documents. Their contents have now been reviewed; the earlier network restriction no longer blocks this document review. Publisher-download authenticity remains a separate unperformed check. See [the detailed review](evidence/2020-temperature-review.md) and [file hashes / table audit](evidence/2020-temperature-audit.json).

| Source identified from contents | Appropriate use | Limit |
| --- | --- | --- |
| Batali, Ristenpart & Guinard, Scientific Reports 10:16450 (2020), DOI 10.1038/s41598-020-73341-4 | Conditional evidence about temperature/TDS/PE and sensory profiles; Eq.1 for PE | One Honduras lot, batch drip, 87–93°C, matched TDS/PE, serving 65±1°C. Not biochemical validation, hand-pour calibration or a universal taste equation. |
| Supplement Tables S1/S5 and CSVs | 27 brewing-condition summaries and 31 marginal sensory attributes; all supplied cells checked against PDF | No per-brew raw data, individual ratings or full joint sensory response table. No automatic training/validation from marginal means. |
| WCR Sensory Lexicon v2.0, second edition 2017 | Descriptive vocabulary and reference-scale methodology | WCR 0–15 is not the app's 1–5 nor the paper's 0–100 scale. No quality ranking or brewing predictor. |
| SCAE worksheet/chart, date unspecified | Historical illustration: plotted central region TDS 1.20–1.45%, PE 18–22% | Not identical to the historical SCAA chart or modern equipment-test specifications; no universal preference claim. |
| SCA 310-2021, Home Coffee Brewers: Specifications and Test Methods, ©2022 | Equipment-test context and definitions | User filename says Gold Cup, but contents are an equipment standard: 55 g/kg, target TDS 1.15–1.55%, protocol-specific slurry 90–96°C. Not a kettle setpoint or general taste ranking. |

No full source PDFs/lexicon entries have been republished. Article CC BY 4.0 is acknowledged in the review; WCR/SCA reproduction restrictions remain distinct. Reviewed sources have **not** validated the game coefficients. The dataset's marginal means cannot be expanded into synthetic independent trials. Published p-values are cited with conditions, not rederived from summary tables.

## Version and storage boundaries

- `counter-assumptions-v3`: uncalibrated game model; `kind: game_simulation`, no validated confidence, fixed fictional acidity/bitterness. Earlier counter records retain their original version and values.
- `pourover-observation-v1`: separate self-reported actual-brew collection protocol, not a verification certificate.
- `real-analysis-v1` / `apparent-ey-v1`: arithmetic from user inputs, no flavor prediction or scientific quality score.
- `c6s.real-brews.v1`: actual observations only; separate from `c6s.cafe.v1` and legacy `c6s.sessions.v1`. Unknown values are null, not zeros or typical recipe defaults.

The record stores units and provenance per numerical field, instrument descriptions when supplied, optional serving temperature/holding time, actual-brew attestation, lot/roast, brewer/grinder identity, real-second pouring milestones, series/repeat/taster codes, self-reported prior-prediction exposure and whether a simulation result was shown during this visit. An unanswered tasting has null sensory timestamps and cannot be labeled tasting evidence. A browser-visit flag cannot prove that someone has never seen a prediction elsewhere.

No data is uploaded, no analytics or ML training runs, and no empirical records are preloaded. Users can export JSON, including incomplete records, for later review. Corrupt storage is protected and recoverable; a failed write retains the form and reveals no calculation. Drafts are in memory until saved/downloaded; reload discards unsaved entries.

## Next validation work

Use [the pilot protocol](REAL-BREW-PROTOCOL.md). It establishes a collection workflow, not statistical sufficiency. Keep observed data separate from model development data. Later validation must hold out complete lots, people or series as appropriate, and compare with simple baselines. Measurements and ordinal self-reports need different error models; repeated brews are not independent new tasters. No confidence intervals or probabilities should be presented until their calibration has been evaluated.

## Serving conditions and compatible schema extension

New actual records can include `servingTemperature` (°C) and `holdingSeconds` (real seconds from drawdown to tasting), with the same measured/estimated/unknown provenance. They are optional schema-1 additions. Earlier records lacking them still load/export unchanged; analysis treats absence as missing without inventing values. New records explicitly identify `sensoryScale: app_ordinal_1_5_v1`; older absent scale metadata is retained as absent. No WCR or study-scale conversion is performed.
