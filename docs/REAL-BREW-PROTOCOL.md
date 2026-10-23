# Pilot protocol: actual pour-over observations

This is an initial collection procedure, not a validated experimental design or a recommended brewing recipe. It requires actual coffee and measurements; simulated game results do not count. Do not invent missing measurements.

1. Define one question, such as how changing water temperature under an otherwise fixed recipe changes measured TDS and reported taste for one specific lot.
2. Use one identified lot, brewer/filter, grinder and water. Record roast/date if known, grinder model and setting, dose, water mass, intended pouring sequence and measurement tools. Choose a baseline recipe you can repeat.
3. Choose a small number of conditions, varying only the selected factor. As a workflow pilot, three conditions with three repeated brews each is one possible nine-brew plan; this is not a sample-size calculation and cannot establish general coffee laws.
4. Prepare a randomized order in advance. Assign sample/series/repeat codes, document which factor changed, and avoid choosing only successful brews for export. If another person codes samples, document that arrangement; the app itself does not verify blinding.
5. Weigh coffee, water and collected beverage. Time from first water to drawdown, and separately log active pouring and cumulative-water milestones in real seconds. Mark each value measured, estimated or unclassified. Milliliters from the game are not grams measured on a scale.
6. Record serving temperature and time from drawdown to tasting when possible (both optional with provenance); the 2020 batch-drip study controlled serving at 65±1°C, not a mandatory app tasting temperature. Taste under comparable serving conditions and record intensity separately from liking, before viewing game predictions or derived calculations. Leave unassessed attributes blank. Record any prior exposure honestly; this does not retroactively make the trial blind.
7. If using a suitable refractometer, follow its manufacturer’s calibration, sampling and temperature procedure. Record the model, units, repeats and relevant conditions. Enter TDS as percent (1.3 means 1.3%, not 0.013). Do not replace missing TDS with a taste-based estimate. If no refractometer is available, collect flow/time/mass and sensory observations without measured extraction claims.
8. Save, inspect unit/provenance warnings and export the real-brew JSON. Keep the original file unchanged. Do not merge legacy hypothetical journals or game rounds into an empirical dataset.
9. Review completeness, repeated-brew variation, unit mistakes, instrument limitations and outliers before any modeling. Flag exclusions with reasons rather than silently deleting inconvenient results.
10. Reserve future independent lots/tasters/series for validation before fitting a model. A small pilot first tests the collection process. No pooled ML model, scientific confidence interval or flavor probability is justified by the pilot alone.

Useful first outputs are data completeness, repeated mass/time/TDS variability and paired observed differences. Study summaries, reusable published measurements and real observations must retain separate provenance. Statistical analysis can follow once the actual dataset and its dependencies are known.

The app uses a self-report ordinal 1–5 scale. Do not pool these ratings with WCR reference 0–15 intensities or the Batali et al. 2020 line-scale 0–100 values by simple rescaling. Published S1/S5 summaries remain a separate literature source, not extra user observations.
