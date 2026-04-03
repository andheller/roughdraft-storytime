# Roughdraft Storytime

Static SvelteKit story library with build-time content generation.

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm content:generate
```

## Content Model

All authored content lives under `src/content/books`.

- `series.json` defines a series
- `story.json` defines story metadata and chapter order
- chapter markdown files hold story content
- optional `narration/*.txt` files add narration text
- optional `/static/audio/.../audio-manifest.json` files add audio metadata

The app generates:

- a lightweight content index for the homepage and route discovery
- per-story modules for full chapter content
- bookshelf metadata derived from the content tree

## Deployment

The site now builds as a fully static output with `@sveltejs/adapter-static`.

GitHub Actions workflow:

- `.github/workflows/deploy-static.yml`

It builds the site and deploys `build/` to Cloudflare Pages using:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The Cloudflare Pages project name is `rough-draft-storytime`.
