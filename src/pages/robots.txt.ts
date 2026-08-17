import type { APIRoute } from 'astro';

/**
 * The portfolio is private, so nothing here is offered to a crawler.
 *
 * This is the half of the privacy story that actually works: the unlock veil
 * is client-side and a crawler would read straight past it, whereas a
 * disallow plus the `noindex` that BaseLayout sets on every gated page keeps
 * these pages out of search results.
 *
 * If pages are made public later (`gated={false}` in BaseLayout), allow them
 * by path here and add the sitemap integration back to astro.config.mjs.
 */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
