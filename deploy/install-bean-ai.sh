#!/usr/bin/env bash
# Run from a reviewed repository checkout on the approved VPS as an administrator.
set -euo pipefail
[[ "$(id -u)" == 0 ]] || { echo 'Run with sudo as a VPS administrator.' >&2; exit 1; }
[[ -x /usr/bin/node ]] || { echo 'Install supported Node.js 22+ at /usr/bin/node first.' >&2; exit 1; }
/usr/bin/node -e 'if (Number(process.versions.node.split(".")[0]) < 22) process.exit(1)'
for file in server/index.mjs server/bean-scan.mjs src/bean-model.js deploy/coffee-bean-ai.service; do test -f "$file"; done
if ! id coffee-ai >/dev/null 2>&1; then useradd --system --home-dir /var/lib/coffee-bean-ai --shell /usr/sbin/nologin coffee-ai; fi
install -d -m 755 /opt/coffee-bean-ai/server /opt/coffee-bean-ai/src
install -m 644 server/*.mjs /opt/coffee-bean-ai/server/
install -m 644 src/bean-model.js /opt/coffee-bean-ai/src/
install -d -o coffee-ai -g coffee-ai -m 700 /var/lib/coffee-bean-ai
if [[ ! -e /etc/coffee-bean-ai.env ]]; then
  (umask 077; cat > /etc/coffee-bean-ai.env <<'CONFIG'
COFFEE_AI_KEY=
COFFEE_AI_MODEL=gpt-4.1-mini
COFFEE_ALLOWED_ORIGINS=https://tahulk79.github.io
COFFEE_DAILY_SCAN_LIMIT=25
COFFEE_IP_SCAN_LIMIT=5
COFFEE_QUOTA_FILE=/var/lib/coffee-bean-ai/quota.json
CONFIG
  )
fi
install -m 644 deploy/coffee-bean-ai.service /etc/systemd/system/coffee-bean-ai.service
systemctl daemon-reload
printf '%s\n' 'Files installed. Enter the API key securely in /etc/coffee-bean-ai.env, then enable/start coffee-bean-ai. Existing environment files and Nginx config were preserved.'
