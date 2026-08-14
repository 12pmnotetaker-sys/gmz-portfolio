import type { APIRoute } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches the site
 * origin configured in astro.config.mjs, including on preview deploys.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap.href}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
