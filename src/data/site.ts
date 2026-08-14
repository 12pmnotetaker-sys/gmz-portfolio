/**
 * Single source of truth for every company fact on this site.
 *
 * Nothing in `src/` may hardcode a phone number, an address, a license number
 * or the tagline. Components read from here. This mirrors the rule the
 * estimating system learned the hard way: one fact with many homes drifts
 * apart, and correcting one copy leaves the others wrong.
 *
 * Everything in this file is PUBLIC. Cost, margin, overhead, burdened rates
 * and crew capacity are internal to GMZ and must never appear on the website.
 */

export interface Phone {
  /** Who answers. */
  name: string;
  /** Display form, e.g. "(650) 274-5188". */
  display: string;
  /** E.164 for `tel:` links, e.g. "+16502745188". */
  tel: string;
}

export const company = {
  /** Legal entity name, for footers, schema.org and legal lines. */
  legalName: 'GMZ Landscaping Inc.',
  /** Display name used in headings and nav. */
  name: 'GMZ Landscaping',
  /** Short form for the logo lockup. */
  shortName: 'GMZ',

  /**
   * Set by Xavier 2026-08-06: three services, not three trades. Do not revert
   * to "LANDSCAPE · HARDSCAPE · FENCING" without asking.
   */
  tagline: 'Design · Build · Maintenance',

  /** One-sentence description, used for meta descriptions and the hero. */
  summary:
    'A licensed landscape contractor serving the San Francisco Peninsula, designing, building and maintaining outdoor spaces.',

  address: {
    mailing: 'P.O. Box 3718, Redwood City, CA 94064',
    locality: 'Redwood City',
    region: 'CA',
    postalCode: '94064',
    country: 'US',
  },

  email: 'rglandscape1@yahoo.com',

  /**
   * Order matters. Where only one number fits (the footer, the compact
   * header) the site takes the first entry, so whoever is listed first is
   * who a client calls.
   */
  phones: [
    { name: 'Xavier', display: '(650) 274-5188', tel: '+16502745188' },
    { name: 'Lili', display: '(650) 283-6296', tel: '+16502836296' },
    { name: 'Rafael Jr.', display: '(650) 307-9993', tel: '+16503079993' },
  ] satisfies Phone[],

  /** California State License Board number. Confirmed 2026-07-25. */
  license: {
    label: 'CSLB License',
    number: '636636',
    display: 'CSLB License #636636',
  },

  /**
   * Towns GMZ actively works in. Used by the service-area section and the
   * areaServed field in structured data. Keep this honest; it is a claim.
   */
  serviceArea: [
    'Redwood City',
    'Atherton',
    'Menlo Park',
    'Palo Alto',
    'Woodside',
    'San Carlos',
    'Belmont',
    'Portola Valley',
    'Los Altos',
    'Hillsborough',
  ],

  /** Public social profiles. Leave a value empty to hide the link. */
  social: {
    instagram: '',
    facebook: '',
    yelp: '',
    google: '',
  },
} as const;

/** The number a visitor calls when only one fits. */
export const primaryPhone: Phone = company.phones[0];

export const site = {
  /** Overridden at build time by SITE_URL; see astro.config.mjs. */
  url: 'https://www.gmzlandscaping.com',
  title: `${company.name} — ${company.tagline}`,
  titleTemplate: `%s | ${company.name}`,
  description: company.summary,
  locale: 'en_US',
  /** Path under /public. Replace once the final logo asset lands. */
  ogImage: '/og-default.jpg',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Answers', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
