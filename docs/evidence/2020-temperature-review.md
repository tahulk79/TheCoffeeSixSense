# Review of supplied coffee sources — 2026-10-23

## Provenance and audit

Seven files were supplied by the user: the full 2020 paper, its supplementary PDF, S1/S5 CSV transcriptions, WCR Lexicon v2, an SCAE chart/worksheet, and SCA Standard 310-2021. They were read locally; their bytes have not been independently compared against publisher downloads. The [audit manifest](2020-temperature-audit.json) records hashes, sizes and CSV checks. No source PDF or complete lexicon/chart has been republished in this repository.

Reproduce the table audit with `python3 scripts/audit-coffee-evidence.py --input-dir /path/to/supplied-files --write` (requires `pdftotext`). All 351 S1 cells and 294 S5 numeric cells, including significance letters, match the supplied PDF tables after whitespace normalization. The CSVs reproduce unusual letters in the original (for example Berry's TDS row); they have not been silently corrected or reinterpreted.

## Batali, Ristenpart and Guinard (2020)

Mackenzie E. Batali, William D. Ristenpart, and Jean-Xavier Guinard. *Brew temperature, at fixed brew strength and extraction, has little impact on the sensory profile of drip brew coffee.* Scientific Reports **10**, 16450. DOI: https://doi.org/10.1038/s41598-020-73341-4.

Reviewed: abstract, study design, principal results, biochemical limitations, methods, Eq.1 and license, with supplementary tables S1/S5 checked cell by cell and S4 inspected. The source files contain 14 article pages and 11 supplementary pages. Page citations below refer to printed article/supplement page numbers. Article p.14 specifies CC BY 4.0 with attribution, change disclosure and third-party-material qualifications. This review summarizes findings in original wording; it does not reproduce third-party charts or sensory reference recipes.

### Design and scope

- Article p.11: one mixed, wet-washed Honduras Arabica lot from Marcala, roasted and combined to control batch variation; not a cross-origin/roast study.
- Curtis G4 commercial batch drip brewer with flat-bottom filter basket; 3075 g input water, dose/grind/pulsing adjusted to achieve TDS/PE targets. Not a 12 g hand-pour model. Grinder settings belong to a Mahlkönig Guatemala Lab Grinder.
- 27 target combinations: 3 temperatures (87/90/93°C), 3 TDS levels (1.00/1.25/1.50%) and 3 PE levels (16/20/24%). Measured values and standard deviations in S1 differ from nominal targets.
- 12 trained panelists, blind randomized sample order, triplicate sensory evaluation; serving temperature 65±1°C. A 15 cm line scale was converted to 0–100 (article pp.11–12), not the app's ordinal 1–5 scale.
- S1, supplement p.5: 6:12–11:00 total brewing durations include a three-minute drip-out. Do not apply those times to a small V60 or the game's ×6 clock.

### Claims supported within this experiment

- Article pp.3/5, Table 2: temperature's multivariate main effect has p=0.11; TDS and PE each p<0.001. At matched TDS/PE and serving temperature, brew temperature made much less overall sensory difference within 87–93°C. This is not proof of exact equivalence, nor a claim that temperature never matters.
- Article p.5: Nutty flavor had a temperature effect in univariate analysis, and some temperature interactions were reported. Do not summarize this as “no attribute changes with temperature.”
- Article p.5 and S5: bitterness, astringency and viscous mouthfeel increase with TDS in the reported study; Sour increases with TDS and tends to decrease with PE. The paper does not support the universal rule “greater extraction means more bitter.”
- S5 examples, marginal means on 0–100: Bitter at TDS 1.00/1.25/1.50% = 35.26/41.68/43.59; Sour = 33.25/41.10/46.33. Sour at PE 16/20/24% = 44.52/39.41/36.74. These are descriptive means averaged over other factors, not predictions for arbitrary coffee.
- Article p.12, Eq.1: PE (%) = TDS (%) × beverage mass / dry grounds mass. Supports the app's arithmetic given suitable measured inputs; does not validate its fictional kinetic parameters.
- Article p.9 explicitly states no chemical analysis was performed. Mechanistic compound explanations in the discussion are hypotheses/references, not measured biochemical validation of this dataset.

### What the supplied CSVs cannot establish

S1 contains 27 condition summaries with means/SD, not all brew replicates. S5 contains 31 attributes' marginal means at each TDS, PE and temperature level, plus selected Fisher LSD values/letters. There is no 27-condition-by-attribute joint response matrix or individual panel dataset in these CSVs. Joining marginal means onto all S1 rows would manufacture observations and erase interactions/covariance. Do not expand means into fake panelists or derive per-cup probabilities, new confidence intervals or validation accuracy from them.

The paper itself reports 270 brews, while Figure 2's caption says n=9 per target for 27 target types (27×9=243). Do not silently reconcile this or infer exact independent sample counts from summary tables; obtain raw data or author clarification for replicate-level analysis. Existing published p-values are reported as published, not reproduced by this app.

## WCR Sensory Lexicon

The supplied document is **Second Edition, Version 2.0 (2017)**. It is a descriptive vocabulary with calibrated reference intensities, not a preference/quality ranking and not a brewing-to-flavor equation. Its reference scale is 0–15; correct use involves references and trained evaluation. The app's casual ordinal 1–5 ratings and the paper's 0–100 line ratings cannot be pooled or linearly converted merely by rescaling their endpoints.

The file states all rights reserved. No complete entries, proprietary recipes, PDF pages or branding are copied into the public game. We summarize its role and cite the document; more extensive reproduction requires suitable permission.

## SCAE chart

The file named `3_SCA_Brewing_Control_Chart.pdf` is a two-page **Speciality Coffee Association of Europe** worksheet/chart, with no edition date visible. Its plotted “SCAE Ideal” rectangle is approximately TDS **1.20–1.45%**, PE **18–22%**, confirmed visually on p.2. This differs from the historical 1.15–1.35% central TDS region discussed in the 2020 article. Neither is a universal taste-quality classifier. The worksheet's operation/water/dwell time conventions must not be treated as identical to every other protocol.

## SCA 310-2021

The file named `3_SCA_Gold_Cup_Standard.pdf` is actually **SCA Standard 310-2021, Home Coffee Brewers: Specifications and Test Methods**, copyright 2022. It is an equipment test standard, not a general Gold Cup preference study.

Printed pp.5–6: 55 g/kg test ratio, target brew strength **1.15–1.55%**, and **slurry temperature 90–96°C once 33% of the water has been sprayed**, maintained thereafter. Slurry temperature is not a kettle setpoint; these values must not replace the paper's experimental temperatures or become game “correct answers.” Its operating-time definition is equipment-test-specific. The cover filename does not determine the document's identity or version. The file's reproduction clause requires consent/attribution; its full PDF is not redistributed here.

## Application changes justified now

1. Mark the supplied sources as read, with document identity and provenance, while retaining “game model uncalibrated.”
2. Explain conditional temperature evidence and keep concentration/extraction/sensory/preference separate.
3. Do not fit the game’s arbitrary flow/retention/kinetic coefficients to S5 or install a universal chemical flavor predictor.
4. Capture serving temperature and holding time as optional, provenance-labeled real observations; retain missing values for existing records.
5. Identify the app's sensory scale explicitly. Keep study summaries, game simulations and user observations separate.
6. Next: obtain replicate-level joint data and additional lots/roasts/hand-brewing measurements before fitting or independently validating an empirical predictor.
