// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { canonicalPath } from './src/data/canonical.ts';

// The canonical production origin. Used for absolute URLs in the sitemap,
// canonical link tags and Open Graph tags. Update this once the real domain
// is live; nothing else in the repo hardcodes an origin.
const SITE = process.env.SITE_URL ?? 'https://www.gmzlandscaping.com';

/**
 * Routes that set `noindex` in their page metadata. Keep this in step with
 * them, so the sitemap and the meta tag never disagree.
 */
const NOINDEX = ['/straight-answers'];

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Pages that set `noindex` must not appear here too. Listing a page in
      // the sitemap while telling crawlers to ignore it is a contradictory
      // signal, and /straight-answers deliberately carries the same content
      // as /faq: it is the link to hand someone, not the page that should
      // win a search.
      filter: (page) => !NOINDEX.some((path) => canonicalPath(new URL(page).pathname) === path),

      // `build.format: 'directory'` makes Astro hand the sitemap `/about/`,
      // while the canonical tag on that page claims `/about`. Offering a URL
      // the page itself disavows is a contradictory signal, so both forms come
      // from canonicalPath and cannot drift apart.
      serialize: (item) => {
        const url = new URL(item.url);
        url.pathname = canonicalPath(url.pathname);
        return { ...item, url: url.href };
      },
    }),
  ],
  image: {
    // Project photography is the whole point of this site, so keep the
    // optimizer on and let Astro emit responsive AVIF/WebP at build time.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: {
    format: 'directory',
  },
});
