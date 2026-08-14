import { defineCollection, reference, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content schemas for the GMZ portfolio.
 *
 * These are deliberately strict. A build that fails because a project is
 * missing a hero image or names a service line that does not exist is doing
 * its job: the alternative is a live page with a broken photo on it.
 *
 * PUBLIC CONTENT ONLY. Never add cost, margin, burdened-rate, crew-day or
 * overhead fields to these schemas. Contract value belongs in the estimating
 * system, not on a marketing site. `budgetBand` below is the one concession,
 * and it is a coarse range shown only when `showBudgetBand` is true.
 */

/** The two service lines GMZ sells. Anything else is a scope, not a line. */
export const SERVICE_LINES = ['design-build', 'maintenance'] as const;

/** Trades a project can involve. Drives the filter chips on /work. */
export const DISCIPLINES = [
  'hardscape',
  'planting',
  'irrigation',
  'drainage',
  'fencing',
  'lighting',
  'lawn',
  'grading',
  'concrete',
  'masonry',
] as const;

const seo = z
  .object({
    /** Overrides the page title. Defaults to the entry title. */
    title: z.string().optional(),
    /** Overrides the meta description. Defaults to the entry summary. */
    description: z.string().max(200).optional(),
    /** Set true to keep a page out of the sitemap and add noindex. */
    noindex: z.boolean().default(false),
  })
  .default({});

/**
 * A photo with the alt text required alongside it. Alt is not optional:
 * a portfolio that is mostly photographs is unusable without it.
 *
 * `src` goes through Astro's `image()` helper, so paths resolve relative to
 * the Markdown file and the file must exist at build time. That is
 * deliberate: a typo'd photo path fails the build instead of shipping a
 * broken image to a client.
 */
const photoSchema = (image: SchemaContext['image']) =>
  z.object({
    src: image(),
    alt: z.string().min(1, 'Every photo needs alt text describing what is shown.'),
    caption: z.string().optional(),
    /** Marks a before/after pair member so the gallery can group them. */
    phase: z.enum(['before', 'during', 'after']).optional(),
  });

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One or two sentences for cards and the project header. */
      summary: z.string().max(300),
      /**
       * Town only, never a street address. Client privacy: the estimating
       * system knows where the job is; the website says "Atherton, CA".
       */
      location: z.string(),
      /** Completion date. Drives default ordering, newest first. */
      completed: z.coerce.date(),
      serviceLine: z.enum(SERVICE_LINES),
      disciplines: z.array(z.enum(DISCIPLINES)).min(1),
      /** Card and social image. Lives in src/assets/projects/. */
      hero: photoSchema(image),
      gallery: z.array(photoSchema(image)).default([]),
      /** Pull-quote from the client, if one has been given in writing. */
      testimonial: reference('testimonials').optional(),
      /** Show on the homepage. Keep this to a handful. */
      featured: z.boolean().default(false),
      /** Sort weight within featured items; lower sorts first. */
      order: z.number().default(0),
      /**
       * Coarse range only, e.g. "$50k–$100k". Never a contract value, and
       * never shown unless showBudgetBand is explicitly true.
       */
      budgetBand: z.string().optional(),
      showBudgetBand: z.boolean().default(false),
      /** Rough build duration in plain words, e.g. "six weeks". */
      duration: z.string().optional(),
      /** Hidden from listings but still buildable, for work in progress. */
      draft: z.boolean().default(false),
      seo,
    }),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(300),
    serviceLine: z.enum(SERVICE_LINES),
    /** Icon key resolved by the Icon component. */
    icon: z.string().default('leaf'),
    /** Bullets for the service card and detail page. */
    highlights: z.array(z.string()).default([]),
    /** Nav and listing order; lower sorts first. */
    order: z.number().default(0),
    featured: z.boolean().default(false),
    /** Projects that show this service off. */
    relatedProjects: z.array(reference('projects')).default([]),
    draft: z.boolean().default(false),
    seo,
  }),
});

const testimonials = defineCollection({
  loader: glob({ base: './src/content/testimonials', pattern: '**/*.md' }),
  schema: z.object({
    /** Client name as they have agreed to be credited. */
    author: z.string(),
    /** Town, matching the project's location field. */
    location: z.string().optional(),
    /** The quote itself. The file body holds the long form, if any. */
    quote: z.string(),
    /**
     * Only publish quotes the client has given permission to publish.
     * Leave false and the entry stays out of every listing.
     */
    approved: z.boolean().default(false),
    project: reference('projects').optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

/** The eight stages a customer moves through, in order. Drives FAQ grouping. */
export const FAQ_PHASES = [
  'getting-started',
  'planning-budget',
  'design',
  'firm-price',
  'building',
  'after',
  'maintenance',
  'bridge',
] as const;

/**
 * The four things that come up on nearly every job. An entry tagged with one
 * gets led with rather than buried, because these are where deals are lost.
 */
export const SORE_POINTS = ['range-vs-price', 'design-fee', 'change-orders', 'timeline'] as const;

const faqs = defineCollection({
  loader: glob({ base: './src/content/faqs', pattern: '**/*.md' }),
  schema: z.object({
    /** In the client's own words, the way they would actually ask it. */
    question: z.string(),
    /** Three to six words, for compact navigation. */
    short: z.string(),
    phase: z.enum(FAQ_PHASES),
    serviceLine: z.enum([...SERVICE_LINES, 'both']),
    sorePoint: z.enum(SORE_POINTS).optional(),
    /** Sort weight within a phase; lower sorts first. */
    order: z.number().default(0),
    /**
     * Nothing renders in production until this is true. An answer that states
     * a policy nobody has decided is worse than no answer, because a client
     * will hold GMZ to whatever the website said. Same gate as a testimonial.
     */
    published: z.boolean().default(false),
    /** True when the answer depends on a decision that has not been made. */
    needsDecision: z.boolean().default(false),
    /** Exactly what has to be confirmed before this can be published. */
    decisionNote: z.string().optional(),
  }),
});

export const collections = { projects, services, testimonials, faqs };
