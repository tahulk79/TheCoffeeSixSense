# Personal beans: GitHub Pages only

## No VPS or API key

Packaging text is recognized on the player's device using Tesseract.js 6.0.1, its pinned 6.0.0 WebAssembly core and English/Vietnamese fast language data. All runtime assets come from the same GitHub Pages site. Photos, recognized text and journal entries are not sent to an OCR/AI service. Recognition is lazy: only choosing “Read packaging text” loads the reader. The first use downloads several MB and can take longer on a phone; it can be cancelled.

This is local OCR with conservative label parsing, not cloud vision or a language model. It reads printed text but cannot reliably understand every unstructured bag layout. Only explicit labeled lines (e.g. `Roaster:`, `Origin:`, `Tên sản phẩm:`, `Ngày rang:`) populate fields. Unlabeled text remains available for manual review. Missing, conflicting or ambiguous fields stay blank. Roast dates require unambiguous ISO dates. No origin, roast level or quality is inferred from a bean photograph.

## Player flow

Add up to four packaging photos and two bean photos (JPEG/PNG/WebP, 10 MB maximum input). Images are resized to at most 1280 pixels and re-encoded to JPEG without input EXIF metadata. Preview/remove photos before reading. Bean photos are visual journal records and are never passed to the reader.

Review recognized text, evidence and uncertainty hints; fill unknown fields manually. Existing manual entries are never overwritten. Confirm details before saving. Printed tasting notes remain distinct from the player's own impressions. Profiles, images and recognized text are stored in IndexedDB and can be exported together. The main journal stores a metadata snapshot for each personal-bean session, so renaming a bag does not rename old entries.

Personal beans have no invented target score. Use a starting recipe, save a baseline and change one setting to compare impressions. Existing starter beans retain their game simulation. Manual entry remains available if OCR cannot read a photo, assets fail to load or the browser lacks WebAssembly/Worker support. Failed reading or saving retains form inputs and photos. Unsaved forms do not survive page reloads; save/export before clearing data or moving devices. Import/sync is outside this extension.

## Reproducible assets and Pages deployment

```sh
npm ci --no-audit --no-fund
npm run build:pages
npm test
npm run build
```

`prepare:ocr` copies pinned runtime bundles and licenses from locked npm dependencies into ignored `public/ocr/engine/`. It verifies the checked-in language files against their SHA-256 manifest. Their upstream Git blob IDs and commit are recorded in `public/ocr/lang/SOURCES.json`. The standalone generator copies those assets into ignored `docs/ocr/`. Vite copies them to `dist/ocr/`.

The Pages workflow installs frozen dependencies and builds the standalone site before uploading `docs/`. Keep Pages Source set to GitHub Actions. No API endpoint config, paid service, provider credential or VPS workflow is used for this feature. Apache-2.0 licenses and bundled dependency notices ship with the reader.

## Validation

`npm test` checks explicit Vietnamese/English labels, uncertainty, conflicting fields, no guessing from unlabeled text, preserving manual entries, safe profile data, snapshots and language checksums.

With the dev server on port 5173, run:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/smoke-beans.mjs
```

This exercises the real browser OCR engine with a rendered label (no mocked reader or AI API), field extraction, blank missing fields, review, IndexedDB save/reload, personal brewing and export on Vite and the standalone page. It records browser-context requests to reject external HTTP calls. Clear printed test labels validate engine integration; real photos still vary with lighting, focus, fonts and layout and always require user review.
