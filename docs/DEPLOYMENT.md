# First production deployment: cf.ta79.com

## Current application and verification scope

The repository contains an English, client-only Vite application (`src/main.js`,
`src/style.css`, `index.html`) and an older standalone preview (`docs/index.html`).
It supports three beans, dose/water/temperature/grind settings, simulated scores,
six personal tasting ratings, notes/discoveries, localStorage history, two-session
comparison and JSON export. There is no backend, login, database, cloud sync,
Vietnamese translation or progression system yet. Only `dist/` is deployed.
Browser storage is origin-specific: data from Pages or localhost will not migrate
to this domain automatically. Export existing journals before changing origin.

Local commands (Node 22):

```sh
npm ci --no-audit --no-fund
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

Tests include the existing standalone feature/syntax assertions and release
activation/rollback/failure checks. `validate.yml` runs tests and build for PRs.
The Pages preview remains available by manual dispatch only.

## Approval boundary — do not run server commands yet

This PR prepares files only. It does not provision a VPS, alter DNS, obtain a
certificate, create secrets or deploy. Review and approve the PR and this runbook
before an administrator performs the following setup. Merging does not deploy.

Before first deployment, create a GitHub **production** environment. Configure
required reviewers, prevent self-review and disable administrator bypass where
supported; restrict deployment branches to `main`. Keep all deployment secrets
in that environment, not repository-wide. Confirm your GitHub plan supports these
protections for this private repository. If unavailable, treat that as a blocker
until an equivalent reviewed approval mechanism is established.

Deployment is `workflow_dispatch` only, on `main`, with an explicit
`approve_production=true` input. Build/tests run first; the deploy job waits for
environment approval before receiving credentials. Review the run's commit SHA
and artifact before approving. Protect `main` with PR review and the validate
check; restrict who can change workflows and environment protections.

## DNS (administrator, after approval)

Create `A cf.ta79.com -> <VPS_PUBLIC_IPV4>` (record name `cf` in the `ta79.com`
zone). Add an `AAAA` only if this VPS has working public IPv6 and Nginx/firewall
are configured for IPv6 too; the supplied templates listen on IPv4 only. Remove
stale/conflicting records. Check authoritative and public resolvers. If CAA is
restricted, permit `letsencrypt.org`. Do not assume any records already exist.
Use DNS-only mode during initial HTTP-01 issuance if a DNS provider offers proxying.

## One-time Ubuntu VPS setup (administrator, after approval)

Use an administrator's SSH account with sudo, never the CI identity. Confirm the
Ubuntu release is supported, reserve the domain's vhost, and inspect existing
Nginx configuration before changing it. Allow SSH on the actual port, inbound
TCP 80 and 443 in both provider and host firewalls. Preserve administrative SSH.
Install `nginx`, `certbot`, `openssh-server`, and CA certificates using Ubuntu's
package manager. No Node.js or GitHub repository credentials are needed on VPS.

Create the dedicated identity and directories:

```sh
sudo adduser --disabled-password --gecos '' coffee-deploy
sudo install -d -o root -g root -m 755 /srv/coffee-six-sense
sudo install -d -o coffee-deploy -g coffee-deploy -m 755 \
  /srv/coffee-six-sense/releases /srv/coffee-six-sense/incoming
sudo install -d -o coffee-deploy -g coffee-deploy -m 700 /home/coffee-deploy/.ssh
```

The deploy user needs to replace `current` in the parent directory, but must not
own the whole server. Grant an ACL on this one directory:

```sh
sudo apt-get install acl
sudo setfacl -m u:coffee-deploy:rwx /srv/coffee-six-sense
```

Do not give this account sudo or membership in privileged groups. Its only
application writes are this directory and its home. Nginx runs as `www-data`,
with read-only access through world-readable static release files. Keep Nginx,
TLS files, SSH settings and administrator scripts root-owned. Do not store
runtime secrets under the web root. This is a static public application.

Generate a dedicated SSH key on a trusted administrator workstation (never in
chat or source). Install only its public key in
`/home/coffee-deploy/.ssh/authorized_keys` with a `restrict` prefix to disable
forwarding, agent access and PTY. Set owner `coffee-deploy`, mode 600. Configure
password and keyboard-interactive authentication off for this account using an
sshd Match User block; validate with `sshd -t` before reloading. Keep SSH public
key authentication enabled. `restrict` allows the command/SFTP access needed by
CI; this is a dedicated unprivileged Unix account, not a command-only sandbox.
Optionally restrict source addresses if using runners with stable egress.

## HTTPS bootstrap (administrator, after approval and DNS propagation)

1. Create `/var/lib/letsencrypt/.well-known/acme-challenge` root-owned with mode
   755 and readable by Nginx. Install `deploy/nginx/cf.ta79.com.http.conf` as
   `/etc/nginx/sites-available/cf.ta79.com`; enable it via `sites-enabled`.
2. Run `sudo nginx -t` before `sudo systemctl reload nginx`. Check a temporary
   challenge file is reachable over public HTTP, then remove it. Other paths
   intentionally return 503 while setup is incomplete.
3. Request a certificate (Certbot prompts locally for the operator's email):

   ```sh
   sudo certbot certonly --webroot -w /var/lib/letsencrypt -d cf.ta79.com
   ```

4. Replace that vhost with `deploy/nginx/cf.ta79.com.conf`. The certificate must
   exist first. Run `sudo nginx -t`, then reload. Until the first release,
   application requests may return 404. Do not approve deployment until the
   certificate is valid and the HTTPS vhost is reachable.
5. Enable/verify `certbot.timer`. Install a root-owned executable renewal deploy
   hook in `/etc/letsencrypt/renewal-hooks/deploy/` which runs
   `nginx -t && systemctl reload nginx`. Verify `sudo certbot renew --dry-run` and
   test the hook separately. Monitor renewal failures and certificate expiry.

The ACME path stays on HTTP for renewal. No HSTS is set during bootstrap.
Do not expose port 5173 or 4173. Only Nginx serves the production build.

## GitHub environment Secrets

Set these in Settings → Environments → production → Environment secrets:

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | VPS IPv4 or SSH hostname, without a scheme or username |
| `DEPLOY_PORT` | Actual SSH port, e.g. `22` |
| `DEPLOY_SSH_KEY` | Dedicated private key matching the restricted public key; use a CI-compatible key |
| `DEPLOY_KNOWN_HOSTS` | Verified OpenSSH known_hosts entry for that host/port |

The username is fixed as `coffee-deploy`. Obtain the host-key fingerprint from
the VPS console or another independently trusted administrator channel. Verify
it before storing the known_hosts entry; do not blindly trust `ssh-keyscan`.
Nonstandard ports require `[host]:port` entries. Never disable host verification.
No passwords, private keys or API tokens belong in this repository or chat.
GitHub supplies `GITHUB_TOKEN` for checkout/artifacts; no PAT is required.

## Release and verification

After setup and explicit approval, merge the PR, dispatch **Approved production
release** on `main`, select the approval input, then have the required reviewer
approve the production job. Deployment uploads the tested build to
`/srv/coffee-six-sense/incoming/<sha>-<run>-<attempt>` and copies it into a new
`releases/<id>`. The script validates required files and release identity before
atomically replacing `current`. Nginx requires no reload for a release.

The workflow checks trusted public HTTPS and exact `health.txt` release identity,
then the homepage. If upload/activation fails, the old symlink remains. A failed
public health check after activation marks the workflow failed but does NOT
roll back automatically: inspect the active symlink and use the procedure below.
On the first release there is no previous release to restore. Verify the browser
brew → taste → save → compare → export flow and check Nginx logs after deployment.

## Rollback (explicit operator approval required)

List retained releases and inspect the current target over administrative SSH.
Choose a previously verified release ID. From a reviewed checkout run:

```sh
ssh -p <SSH_PORT> coffee-deploy@<SSH_HOST> \
  'bash -s -- rollback <PREVIOUS_RELEASE_ID>' < deploy/release.sh
```

Use the same pinned host verification and dedicated identity as deployment.
Confirm `https://cf.ta79.com/health.txt` equals the chosen ID and test the
homepage. No rebuild, sudo or Nginx reload is needed. Keep at least the current
and previous known-good release. Cleanup is manual after approval: never remove
the current release or a rollback candidate; monitor disk space in both incoming
and releases. A failed incomplete release may need administrator cleanup before
retrying that same ID; a fresh workflow attempt gets a new ID.

## Remaining first-deployment blockers

PR review/merge; verified VPS addresses/access and supported Ubuntu; protected
GitHub environment/reviewers and branch rules; four environment Secrets; approved
server provisioning; verified DNS; successful certificate issuance/renewal test;
and explicit approval of the deployment run. None are assumed completed here.
