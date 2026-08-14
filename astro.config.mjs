// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical production origin. Used for absolute URLs in the sitemap,
// canonical link tags and Open Graph tags. Update this once the real domain
// is live; nothing else in the repo hardcodes an origin.
const SITE = process.env.SITE_URL ?? 'https://www.gmzlandscaping.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    // Project photography is the whole point of this site, so keep the
    // optimizer on and let Astro emit responsive AVIF/WebP at build time.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: {
    format: 'directory',
  },
});
