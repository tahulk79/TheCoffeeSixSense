#!/usr/bin/env bash
# Run as coffee-deploy. No sudo, services, deletion, or server configuration.
set -euo pipefail
base=/srv/coffee-six-sense
operation=${1:-}
release=${2:-}
[[ "$release" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]] || { echo 'Invalid release ID' >&2; exit 1; }
target="$base/releases/$release"
case "$operation" in
  activate)
    [[ ! -e "$target" ]] || { echo 'Release already exists' >&2; exit 1; }
    mkdir "$target"
    # Copy a staged, trusted CI build; never extract arbitrary tar paths.
    cp -R "$base/incoming/$release/." "$target/"
    find "$target" -type d -exec chmod 755 {} +
    find "$target" -type f -exec chmod 644 {} +
    ;;
  rollback)
    [[ -d "$target" ]] || { echo 'Release missing' >&2; exit 1; }
    ;;
  *) echo 'Usage: release.sh activate|rollback RELEASE_ID' >&2; exit 1 ;;
esac
[[ -s "$target/index.html" && -d "$target/assets" && -s "$target/health.txt" ]] || { echo 'Incomplete release' >&2; exit 1; }
[[ "$(cat "$target/health.txt")" == "$release" ]] || { echo 'Release identity mismatch' >&2; exit 1; }
# Rename the symlink on the same filesystem for an atomic switch.
link="$base/.current-$release-$$"
trap 'rm -f "$link"' EXIT
ln -s "$target" "$link"
mv -Tf "$link" "$base/current"
echo "Activated $release"
