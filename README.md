# A Cut Above Lawn Care — acutabovelawncareinc.ca

Static Next.js 16 marketing site for A Cut Above Lawn Care Inc. (Burlington, ON).
Content is authored in `content/`; images live in `public/images/`. The build is
fully prerendered (32 routes) with no runtime CMS or database.

## Stack

- Next.js 16 (App Router, React 19)
- TypeScript (strict, `noUncheckedIndexedAccess`)
- Tailwind CSS 4 (CSS-first `@theme` config)
- MDX content (`next-mdx-remote`)
- Server Actions + Resend for the contact form
- Vitest (unit) + Playwright (E2E)

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (SSG) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | oxlint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests (starts server on port 3100) |
| `npm run content:images` | Dedupe WP media into `public/images/source/` |
| `npm run content:extract` | Re-extract MDX from `wordpress-export/latest/` |
| `npm run content:redirects` | Regenerate legacy URL redirects |

## Content workflow

Most content is hand-edited in `content/`:

- `content/services/<slug>.mdx`: long-form copy per service
- `content/services/_meta.ts`: service title/blurb/image/category/order
- `content/pages/about.mdx`, `content/pages/service-areas.mdx`
- `content/site.ts`: phone, email, service areas, hours

Re-running the migration scripts is rarely needed; they exist for re-importing
should the source WordPress export change.

## Environment

| Var | Required for | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Contact form email delivery | Without it, the form returns a "please call us" error. |
| `CONTACT_TO_EMAIL` | Contact form delivery target | Defaults to `info@acutabovelawncareinc.ca`. |
| `NEXT_PUBLIC_SITE_URL` | Sitemap, robots, OG canonical | Defaults to the production URL. |

See `.env.example` for the template.

## Deployment

Vercel-native. Connect this repository, set the three env vars above on the
production environment, and push to the deploy branch.
