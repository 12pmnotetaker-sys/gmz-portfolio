import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Query helpers for the FAQ collection.
 *
 * Pages call these instead of calling getCollection directly, so the rule
 * about what is publishable lives in one place: an answer that states a policy
 * nobody has settled never ships.
 *
 * The project, service and testimonial helpers that used to live here went
 * with their collections when the portfolio design landed. Projects are now
 * queried through src/data/portfolio.ts.
 */

/** True in `astro dev`, false in a production build. */
const isDev = import.meta.env.DEV;

/* ---------------------------------------------------------------------- */
/* FAQs                                                                    */
/* ---------------------------------------------------------------------- */

export type Faq = CollectionEntry<'faqs'>;

/** The eight stages, in the order a customer meets them. */
export const FAQ_PHASE_META: { key: string; label: string; lede: string }[] = [
  {
    key: 'getting-started',
    label: 'Getting started',
    lede: 'Before you have spoken to anyone.',
  },
  {
    key: 'planning-budget',
    label: 'Your concept and planning budget',
    lede: 'The first numbers, and why they are a range.',
  },
  {
    key: 'design',
    label: 'The design',
    lede: 'What you are buying, and what it does for the price.',
  },
  {
    key: 'firm-price',
    label: 'Your firm price',
    lede: 'The number you can commit to, and what sits behind it.',
  },
  {
    key: 'building',
    label: 'Building it',
    lede: 'What the weeks on site actually look like.',
  },
  {
    key: 'after',
    label: 'After the build',
    lede: 'Handover, warranty, and the first year.',
  },
  {
    key: 'maintenance',
    label: 'Maintenance',
    lede: 'The standing service, and what a visit does and does not cover.',
  },
  {
    key: 'bridge',
    label: 'Between the two',
    lede: 'Where a finished garden becomes a maintained one.',
  },
];

export const FAQ_PHASE_LABELS: Record<string, string> = Object.fromEntries(
  FAQ_PHASE_META.map((p) => [p.key, p.label]),
);

/** Reads a label out of a lookup, falling back to the raw slug. */
export const labelFor = (map: Record<string, string>, key: string): string => map[key] ?? key;

/** The four recurring objections, each with the plain explanation that leads it. */
export const SORE_POINT_META: { key: string; title: string; lede: string }[] = [
  {
    key: 'range-vs-price',
    title: 'Why it is a range and not a price',
    lede:
      'The most common question we get, and the one worth answering properly. A landscape price is ' +
      'built from a measured site and chosen materials. Until both exist, an honest number is a ' +
      'range, and a firm-looking number is a guess wearing a suit. The range narrows as the work ' +
      'gets defined, and you see every fee before it is charged.',
  },
  {
    key: 'design-fee',
    title: 'Why design is paid, and what it does not do',
    lede:
      'Design is its own step with its own agreement, and it is priced as a share of the ' +
      'construction cost. It is not folded into the build and it is not credited against it. That ' +
      'surprises people, so it is stated here rather than at signing: what you are buying is the ' +
      'plan itself, which is a thing you own and can build from.',
  },
  {
    key: 'change-orders',
    title: 'Changes, and what is under the ground',
    lede:
      'Almost every dispute on a landscape job starts with something nobody wrote down. The ' +
      'defence is not a padded price. It is a named exclusion, a written change order before any ' +
      'extra work starts, and being told what was found the day it is found.',
  },
  {
    key: 'timeline',
    title: 'How long it takes, and how long your yard is a site',
    lede:
      'Two different questions. One is how far out the schedule runs, the other is how many weeks ' +
      'there is a crew in your garden. Weather moves hardscape and planting, and a new garden is ' +
      'not finished on the last day: it is finished a season later.',
  },
];

const faqOrder = (a: Faq, b: Faq) =>
  a.data.order - b.data.order || a.data.question.localeCompare(b.data.question);

/**
 * Publishable FAQs, in phase order then entry order.
 *
 * An entry stays out of production until `published: true`. The 25 answers
 * that depend on a policy Xavier has not settled are held back by that gate,
 * so the site never states a warranty term or a lead time he has not agreed
 * to. They are all visible in `npm run dev` with their decision note attached.
 */
export async function getFaqs(): Promise<Faq[]> {
  const faqs = await getCollection('faqs', (f) => isDev || f.data.published);
  const phaseIndex = new Map(FAQ_PHASE_META.map((p, i) => [p.key, i]));
  return faqs.sort(
    (a, b) =>
      (phaseIndex.get(a.data.phase) ?? 99) - (phaseIndex.get(b.data.phase) ?? 99) || faqOrder(a, b),
  );
}

/** Publishable FAQs grouped by phase, empty phases dropped. */
export async function getFaqsByPhase(): Promise<
  { key: string; label: string; lede: string; faqs: Faq[] }[]
> {
  const faqs = await getFaqs();
  return FAQ_PHASE_META.map((phase) => ({
    ...phase,
    faqs: faqs.filter((f) => f.data.phase === phase.key),
  })).filter((group) => group.faqs.length > 0);
}

/** Publishable FAQs grouped by sore point, for the objection-led page. */
export async function getFaqsBySorePoint(): Promise<
  { key: string; title: string; lede: string; faqs: Faq[] }[]
> {
  const faqs = await getFaqs();
  return SORE_POINT_META.map((point) => ({
    ...point,
    faqs: faqs.filter((f) => f.data.sorePoint === point.key),
  })).filter((group) => group.faqs.length > 0);
}

/** Everything not already pulled up into a sore-point section. */
export async function getRemainingFaqsByPhase(): Promise<
  { key: string; label: string; faqs: Faq[] }[]
> {
  const faqs = await getFaqs();
  const rest = faqs.filter((f) => !f.data.sorePoint);
  return FAQ_PHASE_META.map(({ key, label }) => ({
    key,
    label,
    faqs: rest.filter((f) => f.data.phase === key),
  })).filter((group) => group.faqs.length > 0);
}

/** FAQs for one service line, plus the ones that apply to both. */
export async function getFaqsForServiceLine(line: string): Promise<Faq[]> {
  const faqs = await getFaqs();
  return faqs.filter((f) => f.data.serviceLine === line || f.data.serviceLine === 'both');
}

/**
 * Entries waiting on a decision. Used by `npm run faq:decisions` and shown in
 * the dev server so the list of what is owed stays visible rather than
 * quietly forgotten.
 */
export async function getFaqsAwaitingDecision(): Promise<Faq[]> {
  const faqs = await getCollection('faqs', (f) => f.data.needsDecision && !f.data.published);
  return faqs.sort(faqOrder);
}
