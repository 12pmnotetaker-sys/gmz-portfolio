/**
 * Generates the placeholder images that stand in for the real portfolio
 * photography until it lands. Run with `npm run placeholders`.
 *
 * The manifest below is the complete list of images the portfolio design
 * ("GMZ Portfolio.dc.html") references, with the exact filenames the design
 * uses. That is deliberate: a real photo can be copied straight out of the
 * Claude Design project into the matching folder here, with no renaming.
 *
 * An existing file is never overwritten. Once the real photo is in place this
 * script leaves it alone, so it is safe to re-run at any time. It also writes
 * ASSETS.md, which is the drop-in checklist for whoever is replacing them.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();

/**
 * Shapes match how the design crops each slot, so a placeholder page lays out
 * at the same proportions the real photographs will.
 */
const SHAPES = {
  card: { w: 1800, h: 1200 }, // 3:2   index card, hero, "Finished" grid
  full: { w: 2400, h: 1600 }, // 3:2   the larger crop the lightbox loads
  wide: { w: 1920, h: 1080 }, // 16:9  drawings, compare pairs, video stills
  tall: { w: 1200, h: 1500 }, // 4:5   the "Photographs" grid, portraits
  alt: { w: 1600, h: 1200 }, // 4:3   alternate-scheme grids
  logo: { w: 480, h: 140 },
};

/**
 * dir is relative to src/assets. Keep the design's filenames exactly.
 */
const MANIFEST = [
  // ---- About page ----------------------------------------------------
  ['about', 'about-portrait-magnolia.webp', 'tall', 'Liliana, design and drawings'],
  ['about', 'about-portrait-garden.webp', 'tall', 'A garden in flower'],
  ['about', 'about-ranunculus.webp', 'tall', 'Ranunculus under the shade frames'],

  // ---- Brand ---------------------------------------------------------
  ['brand', 'apld-logo.webp', 'logo', 'APLD member logo'],

  // ---- Menlo Oaks: conceptual, drawings only -------------------------
  ['portfolio/menlo-oaks', 'menlo-oaks-p3.webp', 'wide', 'Patio'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p5.webp', 'wide', 'Outdoor kitchen'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p4.webp', 'wide', 'Play area'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p7.webp', 'wide', 'Side yard'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p2.webp', 'wide', 'Site plan'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p6.webp', 'wide', 'Lawn alternative'],

  // ---- Marlowe: two options drawn, one built -------------------------
  ['portfolio/marlowe', 'marlowe-hero.webp', 'card', 'Index card image'],
  ['portfolio/marlowe', 'marlowe-design-courtyard.webp', 'wide', 'Design, the courtyard'],
  ['portfolio/marlowe', 'marlowe-design-lounge.webp', 'wide', 'Design, the lounge'],
  ['portfolio/marlowe', 'marlowe-design-oaks.webp', 'wide', 'Design, under the oaks'],
  ['portfolio/marlowe', 'marlowe-alt-a-dining.webp', 'alt', 'Option A, dining under the sail'],
  ['portfolio/marlowe', 'marlowe-alt-a-courtyard.webp', 'alt', 'Option A, the courtyard'],
  ['portfolio/marlowe', 'marlowe-alt-a-path.webp', 'alt', 'Option A, the path through'],
  ['portfolio/marlowe', 'marlowe-alt-a-entry.webp', 'alt', 'Option A, at the doors'],
  ['portfolio/marlowe', 'marlowe-alt-c-overall.webp', 'alt', 'Option C, the courtyard'],
  ['portfolio/marlowe', 'marlowe-alt-c-firetable.webp', 'alt', 'Option C, the fire table'],
  ['portfolio/marlowe', 'marlowe-alt-c-lounge.webp', 'alt', 'Option C, the sunken lounge'],
  ['portfolio/marlowe', 'marlowe-alt-c-dining.webp', 'alt', 'Option C, dining by the mantel'],
  ['portfolio/marlowe', 'marlowe-alt-c-fireplace.webp', 'alt', 'Option C, the mantel wall'],
  ['portfolio/marlowe', 'marlowe-built-entry.webp', 'card', 'Built, the entry'],
  ['portfolio/marlowe', 'marlowe-entry-full.webp', 'full', 'Built, the entry (large)'],
  ['portfolio/marlowe', 'marlowe-built-courtyard.webp', 'card', 'Built, the courtyard'],
  ['portfolio/marlowe', 'marlowe-built-courtyard2.webp', 'card', 'Built, across the gravel'],
  ['portfolio/marlowe', 'marlowe-courtyard2-full.webp', 'full', 'Built, across the gravel (large)'],
  ['portfolio/marlowe', 'marlowe-kitchen-built.webp', 'card', 'Built, the outdoor kitchen'],
  ['portfolio/marlowe', 'marlowe-kitchen-built-full.webp', 'full', 'Built, the kitchen (large)'],
  ['portfolio/marlowe', 'marlowe-pots.webp', 'card', 'Built, pots by the pergola'],
  ['portfolio/marlowe', 'marlowe-pots-full.webp', 'full', 'Built, pots by the pergola (large)'],
  ['portfolio/marlowe', 'marlowe-built-lounge.webp', 'card', 'Built, the lounge'],
  ['portfolio/marlowe', 'marlowe-built-dining2.webp', 'card', 'Built, dining'],
  ['portfolio/marlowe', 'marlowe-dining2-full.webp', 'full', 'Built, dining (large)'],
  ['portfolio/marlowe', 'marlowe-oaks-built-v2.webp', 'card', 'Built, under the oaks'],
  ['portfolio/marlowe', 'marlowe-oaks-built-full.webp', 'full', 'Built, under the oaks (large)'],
  ['portfolio/marlowe', 'marlowe-fountain-wide.webp', 'card', 'Built, the fountain'],
  ['portfolio/marlowe', 'marlowe-before-courtyard.webp', 'wide', 'Compare, courtyard before'],
  ['portfolio/marlowe', 'marlowe-oaks-before.webp', 'wide', 'Compare, under the oaks before'],

  // ---- Viewridge: six retaining walls, built -------------------------
  ['portfolio/viewridge', 'viewridge-aerial.webp', 'card', 'Built, from above'],
  ['portfolio/viewridge', 'viewridge-aerial-full.webp', 'full', 'Built, from above (large)'],
  ['portfolio/viewridge', 'viewridge-steps.webp', 'card', 'Built, the steps'],
  ['portfolio/viewridge', 'viewridge-steps-full.webp', 'full', 'Built, the steps (large)'],
  ['portfolio/viewridge', 'viewridge-backyard.webp', 'wide', 'Drawing, backyard view'],
  ['portfolio/viewridge', 'viewridge-massing-1.webp', 'wide', 'Drawing, massing study 1'],
  ['portfolio/viewridge', 'viewridge-massing-2.webp', 'wide', 'Drawing, top view'],
  ['portfolio/viewridge', 'viewridge-massing-3.webp', 'wide', 'Drawing, massing study 3'],
  ['portfolio/viewridge', 'viewridge-planting.webp', 'wide', 'Drawing, planting rendering'],
  ['portfolio/viewridge', 'viewridge-side-before.webp', 'wide', 'Still, the side run before'],

  // ---- Fox Hill: stone stairs, built ---------------------------------
  ['portfolio/fox-hill', 'foxhill-stair.webp', 'card', 'Built, the stairs'],
  ['portfolio/fox-hill', 'foxhill-stair-full.webp', 'full', 'Built, the stairs (large)'],
  ['portfolio/fox-hill', 'foxhill-stair-lit.webp', 'card', 'Built, the stairs at dusk'],
  [
    'portfolio/fox-hill',
    'foxhill-stair-lit-full.webp',
    'full',
    'Built, the stairs at dusk (large)',
  ],
  ['portfolio/fox-hill', 'foxhill-lawn.webp', 'card', 'Built, the rear lawn'],
  ['portfolio/fox-hill', 'foxhill-lawn-full.webp', 'full', 'Built, the rear lawn (large)'],
  ['portfolio/fox-hill', 'foxhill-dahlias.webp', 'card', 'Built, the cutting garden'],
  ['portfolio/fox-hill', 'foxhill-dahlias-full.webp', 'full', 'Built, the cutting garden (large)'],
  ['portfolio/fox-hill', 'foxhill-lamp.webp', 'card', 'Built, the lamp bed'],
  ['portfolio/fox-hill', 'foxhill-lamp-full.webp', 'full', 'Built, the lamp bed (large)'],
  ['portfolio/fox-hill', 'foxhill-stump.webp', 'card', 'Built, the rock garden'],
  ['portfolio/fox-hill', 'foxhill-stump-full.webp', 'full', 'Built, the rock garden (large)'],
  ['portfolio/fox-hill', 'foxhill-pots.webp', 'card', 'Built, pots at the door'],
  ['portfolio/fox-hill', 'foxhill-pots-full.webp', 'full', 'Built, pots at the door (large)'],
  ['portfolio/fox-hill', 'foxhill-top.webp', 'wide', 'Drawing, top view'],
  ['portfolio/fox-hill', 'foxhill-stair-before-wide.webp', 'wide', 'Compare, the stair before'],
  ['portfolio/fox-hill', 'foxhill-stair-after-wide.webp', 'wide', 'Compare, the stair after'],

  // ---- Hamilton: yard rebuild, built ---------------------------------
  ['portfolio/hamilton', 'hamilton-after-1.webp', 'card', 'Built, the back yard'],
  ['portfolio/hamilton', 'hamilton-after-2.webp', 'card', 'Built, the side yard'],
  ['portfolio/hamilton', 'hamilton-before-1.webp', 'wide', 'Compare, the back yard before'],
  ['portfolio/hamilton', 'hamilton-before-2.webp', 'wide', 'Compare, the side yard before'],

  // ---- Castle Lane: concept only -------------------------------------
  ['portfolio/castle-lane', 'castle-ln-1.webp', 'wide', 'Drawing, front yard'],
  ['portfolio/castle-lane', 'castle-ln-2.webp', 'wide', 'Drawing, side yard'],
  ['portfolio/castle-lane', 'castle-ln-3.webp', 'wide', 'Drawing, backyard'],
  ['portfolio/castle-lane', 'castle-ln-4.webp', 'wide', 'Drawing, site plan'],

  // ---- Los Charros: dry hillside, built ------------------------------
  ['portfolio/los-charros', 'loscharros-slope-after.webp', 'card', 'Built, the bank after'],
  ['portfolio/los-charros', 'loscharros-before.webp', 'card', 'Built, the bank before'],
  ['portfolio/los-charros', 'loscharros-creek.webp', 'tall', 'Photograph, the dry creek'],
  ['portfolio/los-charros', 'loscharros-after.webp', 'tall', 'Photograph, grasses and boulders'],
  ['portfolio/los-charros', 'loscharros-planting-day.webp', 'tall', 'Photograph, planting day'],
  ['portfolio/los-charros', 'loscharros-render.webp', 'wide', 'Drawing, the render'],
];

/**
 * The videos the design plays from a local file. These are not generated:
 * there is nothing sensible to put in a placeholder mp4, so a project whose
 * footage is missing renders the design's own "to come" panel instead. Listed
 * here so ASSETS.md stays a complete account of what is outstanding.
 */
const VIDEOS = [
  ['marlowe-front-1.mp4', 'Marlowe, the front yard'],
  ['marlowe-front-2.mp4', 'Marlowe, the front beds'],
  ['marlowe-front-3.mp4', 'Marlowe, the entry walk'],
  ['viewridge-side-after.mp4', 'Viewridge, the side run after'],
  ['viewridge-b2-before.mp4', 'Viewridge, the upper terrace before'],
  ['viewridge-b2-after.mp4', 'Viewridge, the upper terrace after'],
  ['hamilton-walkthrough.mp4', 'Hamilton, the finished yard'],
  ['loscharros-walkthrough.mp4', 'Los Charros, the finished slope'],
  ['viewridge-walkthrough.mp4', 'Viewridge, the whole garden'],
  ['marlowe-garden-before.mp4', 'Marlowe, the garden before'],
  ['marlowe-garden-after.mp4', 'Marlowe, the garden after'],
  ['planting-garden-management.mp4', 'Planting and garden management'],
  ['garden-walkthrough.mp4', 'A finished garden, walked on completion'],
];

/**
 * Teal and amber, so a placeholder never reads as a real photograph but also
 * never fights the brand palette on screen.
 */
const plate = ({ w, h }, file, label) => {
  const base = Math.min(w, h);
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#002B37"/>
      <stop offset="100%" stop-color="#0F4A52"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect x="0" y="${h - Math.round(base * 0.02)}" width="${w}" height="${Math.round(base * 0.02)}" fill="#F6A400"/>
  <text x="50%" y="44%" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(base * 0.055)}"
        font-weight="bold" fill="#FFFFFF" fill-opacity="0.9">${label}</text>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(base * 0.03)}"
        fill="#F6A400" fill-opacity="0.95">${file}</text>
  <text x="50%" y="63%" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(base * 0.023)}"
        letter-spacing="${Math.round(base * 0.006)}"
        fill="#FFFFFF" fill-opacity="0.55">PLACEHOLDER, REPLACE WITH REAL PHOTO</text>
</svg>`;
};

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

let written = 0;
let kept = 0;

for (const [dir, file, shape, label] of MANIFEST) {
  const outDir = path.join(ROOT, 'src/assets', dir);
  const outFile = path.join(outDir, file);
  await mkdir(outDir, { recursive: true });

  if (await exists(outFile)) {
    kept += 1;
    continue;
  }

  const spec = SHAPES[shape];
  const svg = Buffer.from(plate(spec, file, label));
  const format = path.extname(file).slice(1).toLowerCase();
  const options = { webp: { quality: 72 }, png: { compressionLevel: 9 }, jpeg: { quality: 72 } };
  const encoder = format === 'jpg' ? 'jpeg' : format;
  const buffer = await sharp(svg)[encoder](options[encoder]).toBuffer();

  await writeFile(outFile, buffer);
  written += 1;
}

// The GMZ mark. The design draws it from Google Drive; the repo needs a real
// asset. Until the SVG logo lands this is a wordmark in the brand colours.
const logoPath = path.join(ROOT, 'src/assets/brand/gmz-logo.svg');
if (!(await exists(logoPath))) {
  await mkdir(path.dirname(logoPath), { recursive: true });
  await writeFile(
    logoPath,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 96" role="img">
  <title>GMZ Landscaping</title>
  <rect width="300" height="96" fill="none"/>
  <text x="0" y="46" font-family="Helvetica, Arial, sans-serif" font-size="42"
        font-weight="bold" letter-spacing="2" fill="#FFFFFF">GMZ</text>
  <rect x="0" y="56" width="58" height="4" fill="#F6A400"/>
  <text x="0" y="84" font-family="Helvetica, Arial, sans-serif" font-size="17"
        letter-spacing="3" fill="#FFFFFF" fill-opacity="0.9">LANDSCAPING</text>
</svg>
`,
  );
  written += 1;
}

// ---- ASSETS.md ---------------------------------------------------------

const byDir = new Map();
for (const [dir, file, shape, label] of MANIFEST) {
  if (!byDir.has(dir)) byDir.set(dir, []);
  byDir.get(dir).push({ file, shape, label });
}

const RATIO_LABEL = {
  card: '3:2',
  full: '3:2 (large)',
  wide: '16:9',
  tall: '4:5',
  alt: '4:3',
  logo: 'wide logo',
};

const presentVideos = VIDEOS.filter(([f]) => existsSync(path.join(ROOT, 'public/media', f)));
const missingVideos = VIDEOS.filter(([f]) => !existsSync(path.join(ROOT, 'public/media', f)));
const outstanding = MANIFEST.length - kept;

const doc = `# Assets

Status of every photograph and clip the portfolio design references. Regenerate
this file with \`npm run placeholders\`.

| | Present | Outstanding |
| --- | --- | --- |
| Images | ${kept} | ${outstanding} |
| Video | ${presentVideos.length} | ${missingVideos.length} |

${
  outstanding === 0 && missingVideos.length === 0
    ? `**All photography and video is real.** No placeholders remain. The\nfilenames below are the ones the Claude Design project uses, so a replacement\nphotograph keeps its name and needs no other change.`
    : `The filenames below are the ones the Claude Design project uses, so a real\nphotograph can be copied straight into the folder named here, keeping its name,\nand it will be picked up with no other change.`
}

Every path is validated at build time, so \`npm run build\` fails on a missing
image rather than shipping a broken one. \`npm run placeholders\` only writes
files that are not already there, so it can never overwrite a real photograph.

## Images

Paths are relative to \`src/assets/\`. Ratio is how the design crops the slot,
so a replacement close to that shape needs no art direction.

${[...byDir.entries()]
  .map(
    ([dir, items]) =>
      `### \`${dir}/\` (${items.length})\n\n` +
      `| File | Ratio | Slot | |\n| --- | --- | --- | --- |\n` +
      items
        .map((i) => {
          const here = existsSync(path.join(ROOT, 'src/assets', dir, i.file));
          return `| \`${i.file}\` | ${RATIO_LABEL[i.shape]} | ${i.label} | ${here ? 'real' : '**placeholder**'} |`;
        })
        .join('\n'),
  )
  .join('\n\n')}

## Video

These live in \`public/media/\` and are referenced from a project's Markdown as
\`file: <name>\`. The path is checked at build time, the same as an image.

A clip that is not yet in the repo is marked \`pending: true\` instead, which
renders the design's own "to come" panel rather than an empty frame.

| File | Clip | |
| --- | --- | --- |
${VIDEOS.map(([f, l]) => `| \`${f}\` | ${l} | ${existsSync(path.join(ROOT, 'public/media', f)) ? 'present' : '**outstanding**'} |`).join('\n')}

## Google Drive embeds

None. Every walkthrough is a local file in \`public/media/\`, listed above.

Six of them played from Google Drive until 2026-08-17. That meant those films
worked only while the Drive files stayed link-shared, and nothing at build time
could catch it if sharing was switched off. The schema still accepts \`drive:\`
for footage GMZ has no local copy of, but nothing on the site uses it now.

## Still generated

- \`src/assets/brand/gmz-logo.svg\` is a wordmark, not the real GMZ mark. The
  design draws the green tree-badge logo from Google Drive. Replacing this one
  file updates the header, the mobile menu, the footer and the unlock veil,
  because all four read the same asset.
- \`public/favicon.svg\` and \`public/og-default.jpg\`.
`;

await writeFile(path.join(ROOT, 'ASSETS.md'), doc);

console.log(`images: ${kept} real, ${written} placeholder(s) written`);
console.log(`video: ${presentVideos.length} of ${VIDEOS.length} present`);
