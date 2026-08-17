// @ts-check
import { defineConfig } from 'astro/config';

// The canonical production origin. Used for canonical link tags and Open Graph
// tags. Update this once the real domain is live; nothing else in the repo
// hardcodes an origin.
const SITE = process.env.SITE_URL ?? 'https://www.gmzlandscape.com';

/**
 * No sitemap integration.
 *
 * Every page sits behind the unlock veil and carries `noindex` (see
 * BaseLayout.astro), and robots.txt disallows the whole site. Publishing a
 * sitemap alongside that would be a contradictory signal: it exists to invite
 * crawlers to pages we are asking them to skip.
 *
 * If pages are made public later by setting `gated={false}` on them, add
 * `@astrojs/sitemap` back and filter it to exactly those paths.
 */
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  image: {
    // Project photography is the whole point of this site, so keep the
    // optimizer on and let Astro emit responsive AVIF/WebP at build time.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: {
    format: 'directory',
  },
});
