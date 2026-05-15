# Required GitHub Secrets

Configure these under **Settings → Secrets and variables → Actions** on the GitHub repo.

| Secret | Used by | How to get it |
| --- | --- | --- |
| `CODECOV_TOKEN` | `ci.yml` (coverage upload) | https://app.codecov.io/ → add repo → upload token |
| `SNYK_TOKEN` | `security.yml` | https://app.snyk.io/account → Auth token |
| `SONAR_TOKEN` | `sonarcloud.yml` | https://sonarcloud.io/account/security |
| `DISCORD_WEBHOOK_URL` | `discord-notify.yml` | Discord server → channel settings → Integrations → Webhooks |

`GITHUB_TOKEN` is provided automatically by GitHub; no setup needed.

## Optional Vercel secrets (only if using Vercel actions)
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## Notes
- All secrets are optional — workflows degrade gracefully when missing. The Discord notifier prints "DISCORD_WEBHOOK_URL not set; skipping" rather than failing.
- Snyk and SonarCloud also skip on fork PRs to avoid leaking tokens to untrusted code.
