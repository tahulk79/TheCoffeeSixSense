# Personal beans and packaging extraction (Phase 1 extension)

## Player flow

“My beans” supports up to four packaging photos and two bean photos per bag, using camera capture or uploads (JPEG/PNG/WebP, up to 10 MB per input). Images are resized to at most 1280 pixels and re-encoded to JPEG in-browser, without carrying the input EXIF metadata. Review and remove images before scanning. A separate bean photo is a visual journal only; it is never sent for label extraction or used to infer roast, origin or quality.

AI proposes product name, roaster, country/region, variety, process, roast level/date, printed tasting notes, and an explicitly printed brew guide. Missing fields stay empty; uncertain readings are marked and evidence text is shown. AI does not overwrite nonempty manual fields. A player must review/confirm before saving. Printed tasting notes are separate from their own taste impressions.

Profiles and compressed images use IndexedDB rather than the small localStorage journal. Both remain local to the browser. Export profiles with photos separately from journal JSON. Image import from those exports and cross-device syncing are not part of this extension. Personal-bean sessions keep a metadata snapshot, so renaming a bag does not rename old sessions. They use no invented target score: save a baseline, change one setting, compare impressions. Existing starter beans retain their simulation mechanics.

## Current activation boundary

`public/bean-ai.json` and generated `docs/bean-ai.json` ship with an empty endpoint. The interface explicitly says AI is not connected; photo upload, manual entry and personal brewing still work. No API key belongs in these public files. Only activate the endpoint after a real extraction through the VPS succeeds. Mocked tests verify integration contracts, not provider credentials or production readiness.

## VPS service (administrator)

The service uses Node.js 22+ and its built-in HTTP/fetch APIs; it has no npm runtime dependencies. After reviewing the change and checking the VPS operating system, install supported Node.js at `/usr/bin/node` if needed. In a reviewed checkout:

```sh
sudo bash deploy/install-bean-ai.sh
sudoedit /etc/coffee-bean-ai.env
```

Set `COFFEE_AI_KEY` securely in that root-owned mode-600 file. Never send it in chat, commit it, embed it in Pages, or print the file. The service uses the OpenAI Responses API with `gpt-4.1-mini` by default and `store:false`; provider handling remains subject to the provider's policies. `COFFEE_ALLOWED_ORIGINS` must list exact trusted page origins (for Pages: `https://tahulk79.github.io`, no repository path).

The install script preserves an existing environment file and does not alter Nginx or start a paid service. It creates an unprivileged `coffee-ai` account and a systemd unit; run `bash -n deploy/install-bean-ai.sh` before use. Then:

```sh
sudo systemctl enable --now coffee-bean-ai
curl --fail http://127.0.0.1:8787/health
```

Health reports whether a key is configured, not whether provider authorization works. Include `deploy/nginx/bean-ai-location.conf` inside the existing HTTPS vhost for `cf.ta79.com`, preserving other sites and certificate settings. Run `sudo nginx -t` before reload. Do not expose port 8787 publicly. This service must be installed by an administrator, not by granting sudo to `coffee-deploy`.

The service allows four bounded inline JPEG images, enforces provider timeout and strict structured output, rejects remote-image URLs, and returns generic provider errors without logging photos/keys. Origin restrictions are CORS policy, not authentication. Persisted limits default to 25 scans globally/day and five/client/day, including failed provider attempts; quota storage failure fails closed. Set stricter limits for a small pilot. These quotas bound usage but do not prevent unauthorized clients from exhausting availability; add authenticated user access before broader public use. TLS, Nginx access control, monitoring and the API account's spending settings are administrator responsibilities.

Verify one approved non-sensitive packaging image through the API with the expected Origin, review actual extracted values, and check absent fields remain null/blank. Do not paste a photo data URL or credentials into shared logs. Only after that succeeds set the public JSON endpoint to `https://cf.ta79.com/api/bean-scan`, regenerate the standalone artifact and deploy Pages. Do not treat local mocks or `/health` as a successful production AI scan.

## Validation

`npm test` exercises normalization, absent/uncertain fields, manual-field preservation, dates, safe profile data, custom-bean journal compatibility, provider request/schema, CORS, quota failures and sanitized errors. Browser checks cover both Vite and standalone, real IndexedDB persistence, photos, editing, snapshot history, exporting and personal brewing. AI success/error cases are mocked until the VPS and a usable provider credential are configured.
