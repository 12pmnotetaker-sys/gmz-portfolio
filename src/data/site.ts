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

  /** First year of trading. Drives the "since" line and the About facts. */
  founded: 1994,

  address: {
    mailing: 'P.O. Box 3718, Redwood City, CA 94064',
    /** Split form, for the footer and contact panel which stack the lines. */
    mailingLines: ['P.O. Box 3718', 'Redwood City, CA 94064'],
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

  /** Office hours. The contact panel stacks these, the footer runs them inline. */
  hours: {
    days: 'Monday to Friday',
    daysShort: 'Mon–Fri',
    time: '8am – 4pm',
  },

  /** California State License Board number. Confirmed 2026-07-25. */
  license: {
    label: 'CSLB License',
    number: '636636',
    display: 'CSLB License #636636',
  },

  /**
   * Who draws the plans. Stated on every project page and in the About
   * facts, because "in house" is a differentiator clients ask about.
   */
  drawings: 'In house',

  /**
   * The region as GMZ describes it in prose. `serviceArea` below is the
   * town-by-town claim; this is the shorthand the design uses in headings.
   */
  serviceRegion: 'The Peninsula',

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

  /**
   * Professional bodies GMZ belongs to. Each is a claim; drop the entry
   * rather than let a lapsed membership keep rendering.
   */
  memberships: [
    {
      name: 'Association of Professional Landscape Designers',
      abbr: 'APLD',
      /** Logo under src/assets/brand/. Alt text is the full name above. */
      logo: 'apld-logo.png',
    },
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

/** The second number the contact page offers as an alternative. */
export const secondaryPhone: Phone = company.phones[1];

/**
 * Derived display strings. These exist so the license number and the founding
 * year each keep exactly one home: change the value above and every rendering
 * of it follows.
 */
export const licenseShort = `CSLB #${company.license.number}`;
/** "the Peninsula", for use mid-sentence where the capital would read oddly. */
export const serviceRegionInline = company.serviceRegion.replace(/^The\b/, 'the');
export const hoursInline = `${company.hours.daysShort} ${company.hours.time}`;
export const foundedLine = `since ${company.founded}`;

export const site = {
  /**
   * The production origin. Overridden at build time by SITE_URL; see
   * astro.config.mjs.
   *
   * It is gmzlandscape.com, with no "ing". The scaffold assumed
   * gmzlandscaping.com, which GMZ does not own and never has; the live Wix
   * site has been on gmzlandscape.com throughout. Confirmed 2026-08-17.
   */
  url: 'https://www.gmzlandscape.com',
  title: `${company.name} — ${company.tagline}`,
  titleTemplate: `%s | ${company.name}`,
  description: company.summary,
  locale: 'en_US',
  /** Path under /public. Replace once the final logo asset lands. */
  ogImage: '/og-default.jpg',
} as const;

/**
 * The private-portfolio veil.
 *
 * This is a courtesy screen, NOT access control. The code ships in the client
 * bundle and every page stays directly fetchable by URL, so treat it as a
 * "please don't browse this casually" sign rather than a lock. Anything that
 * genuinely must not be public does not belong in this repo at all. See the
 * "Private portfolio" section of README.md.
 */
export const gate = {
  enabled: true,
  /** Compared case-insensitively after trimming. */
  code: 'GMZ26',
  /** localStorage key holding the unlocked flag. */
  storageKey: 'gmz-portfolio-unlocked',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary navigation, in the order the design sets it. "Answers" is the
 * customer-question library kept from the public scaffold; everything else
 * comes straight from the portfolio design.
 */
export const primaryNav: NavItem[] = [
  { label: 'The Work', href: '/' },
  { label: 'Walkthroughs', href: '/walkthroughs' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Answers', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];
