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
  ['about', 'about-portrait-magnolia.png', 'tall', 'Liliana, design and drawings'],
  ['about', 'about-portrait-garden.jpg', 'tall', 'A garden in flower'],
  ['about', 'about-ranunculus.jpg', 'tall', 'Ranunculus under the shade frames'],

  // ---- Brand ---------------------------------------------------------
  ['brand', 'apld-logo.png', 'logo', 'APLD member logo'],

  // ---- Menlo Oaks: conceptual, drawings only -------------------------
  ['portfolio/menlo-oaks', 'menlo-oaks-p3.png', 'wide', 'Patio'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p5.png', 'wide', 'Outdoor kitchen'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p4.png', 'wide', 'Play area'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p7.png', 'wide', 'Side yard'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p2.png', 'wide', 'Site plan'],
  ['portfolio/menlo-oaks', 'menlo-oaks-p6.png', 'wide', 'Lawn alternative'],

  // ---- Marlowe: two options drawn, one built -------------------------
  ['portfolio/marlowe', 'marlowe-hero.jpg', 'card', 'Index card image'],
  ['portfolio/marlowe', 'marlowe-design-courtyard.jpg', 'wide', 'Design, the courtyard'],
  ['portfolio/marlowe', 'marlowe-design-lounge.jpg', 'wide', 'Design, the lounge'],
  ['portfolio/marlowe', 'marlowe-design-oaks.jpg', 'wide', 'Design, under the oaks'],
  ['portfolio/marlowe', 'marlowe-alt-a-dining.png', 'alt', 'Option A, dining under the sail'],
  ['portfolio/marlowe', 'marlowe-alt-a-courtyard.png', 'alt', 'Option A, the courtyard'],
  ['portfolio/marlowe', 'marlowe-alt-a-path.png', 'alt', 'Option A, the path through'],
  ['portfolio/marlowe', 'marlowe-alt-a-entry.png', 'alt', 'Option A, at the doors'],
  ['portfolio/marlowe', 'marlowe-alt-c-overall.png', 'alt', 'Option C, the courtyard'],
  ['portfolio/marlowe', 'marlowe-alt-c-firetable.png', 'alt', 'Option C, the fire table'],
  ['portfolio/marlowe', 'marlowe-alt-c-lounge.png', 'alt', 'Option C, the sunken lounge'],
  ['portfolio/marlowe', 'marlowe-alt-c-dining.png', 'alt', 'Option C, dining by the mantel'],
  ['portfolio/marlowe', 'marlowe-alt-c-fireplace.png', 'alt', 'Option C, the mantel wall'],
  ['portfolio/marlowe', 'marlowe-built-entry.jpg', 'card', 'Built, the entry'],
  ['portfolio/marlowe', 'marlowe-entry-full.jpg', 'full', 'Built, the entry (large)'],
  ['portfolio/marlowe', 'marlowe-built-courtyard.jpg', 'card', 'Built, the courtyard'],
  ['portfolio/marlowe', 'marlowe-built-courtyard2.jpg', 'card', 'Built, across the gravel'],
  ['portfolio/marlowe', 'marlowe-courtyard2-full.jpg', 'full', 'Built, across the gravel (large)'],
  ['portfolio/marlowe', 'marlowe-kitchen-built.jpg', 'card', 'Built, the outdoor kitchen'],
  ['portfolio/marlowe', 'marlowe-kitchen-built-full.jpg', 'full', 'Built, the kitchen (large)'],
  ['portfolio/marlowe', 'marlowe-pots.jpg', 'card', 'Built, pots by the pergola'],
  ['portfolio/marlowe', 'marlowe-pots-full.jpg', 'full', 'Built, pots by the pergola (large)'],
  ['portfolio/marlowe', 'marlowe-built-lounge.jpg', 'card', 'Built, the lounge'],
  ['portfolio/marlowe', 'marlowe-built-dining2.jpg', 'card', 'Built, dining'],
  ['portfolio/marlowe', 'marlowe-dining2-full.jpg', 'full', 'Built, dining (large)'],
  ['portfolio/marlowe', 'marlowe-oaks-built-v2.jpg', 'card', 'Built, under the oaks'],
  ['portfolio/marlowe', 'marlowe-oaks-built-full.jpg', 'full', 'Built, under the oaks (large)'],
  ['portfolio/marlowe', 'marlowe-fountain-wide.jpg', 'card', 'Built, the fountain'],
  ['portfolio/marlowe', 'marlowe-before-courtyard.jpg', 'wide', 'Compare, courtyard before'],
  ['portfolio/marlowe', 'marlowe-oaks-before.jpg', 'wide', 'Compare, under the oaks before'],

  // ---- Viewridge: six retaining walls, built -------------------------
  ['portfolio/viewridge', 'viewridge-aerial.jpg', 'card', 'Built, from above'],
  ['portfolio/viewridge', 'viewridge-aerial-full.jpg', 'full', 'Built, from above (large)'],
  ['portfolio/viewridge', 'viewridge-steps.jpg', 'card', 'Built, the steps'],
  ['portfolio/viewridge', 'viewridge-steps-full.jpg', 'full', 'Built, the steps (large)'],
  ['portfolio/viewridge', 'viewridge-backyard.jpg', 'wide', 'Drawing, backyard view'],
  ['portfolio/viewridge', 'viewridge-massing-1.jpg', 'wide', 'Drawing, massing study 1'],
  ['portfolio/viewridge', 'viewridge-massing-2.jpg', 'wide', 'Drawing, top view'],
  ['portfolio/viewridge', 'viewridge-massing-3.jpg', 'wide', 'Drawing, massing study 3'],
  ['portfolio/viewridge', 'viewridge-planting.jpg', 'wide', 'Drawing, planting rendering'],
  ['portfolio/viewridge', 'viewridge-side-before.jpg', 'wide', 'Still, the side run before'],

  // ---- Fox Hill: stone stairs, built ---------------------------------
  ['portfolio/fox-hill', 'foxhill-stair.jpg', 'card', 'Built, the stairs'],
  ['portfolio/fox-hill', 'foxhill-stair-full.jpg', 'full', 'Built, the stairs (large)'],
  ['portfolio/fox-hill', 'foxhill-stair-lit.jpg', 'card', 'Built, the stairs at dusk'],
  ['portfolio/fox-hill', 'foxhill-stair-lit-full.jpg', 'full', 'Built, the stairs at dusk (large)'],
  ['portfolio/fox-hill', 'foxhill-lawn.jpg', 'card', 'Built, the rear lawn'],
  ['portfolio/fox-hill', 'foxhill-lawn-full.jpg', 'full', 'Built, the rear lawn (large)'],
  ['portfolio/fox-hill', 'foxhill-dahlias.jpg', 'card', 'Built, the cutting garden'],
  ['portfolio/fox-hill', 'foxhill-dahlias-full.jpg', 'full', 'Built, the cutting garden (large)'],
  ['portfolio/fox-hill', 'foxhill-lamp.jpg', 'card', 'Built, the lamp bed'],
  ['portfolio/fox-hill', 'foxhill-lamp-full.jpg', 'full', 'Built, the lamp bed (large)'],
  ['portfolio/fox-hill', 'foxhill-stump.jpg', 'card', 'Built, the rock garden'],
  ['portfolio/fox-hill', 'foxhill-stump-full.jpg', 'full', 'Built, the rock garden (large)'],
  ['portfolio/fox-hill', 'foxhill-pots.jpg', 'card', 'Built, pots at the door'],
  ['portfolio/fox-hill', 'foxhill-pots-full.jpg', 'full', 'Built, pots at the door (large)'],
  ['portfolio/fox-hill', 'foxhill-top.jpg', 'wide', 'Drawing, top view'],
  ['portfolio/fox-hill', 'foxhill-stair-before-wide.jpg', 'wide', 'Compare, the stair before'],
  ['portfolio/fox-hill', 'foxhill-stair-after-wide.jpg', 'wide', 'Compare, the stair after'],

  // ---- Hamilton: yard rebuild, built ---------------------------------
  ['portfolio/hamilton', 'hamilton-after-1.jpg', 'card', 'Built, the back yard'],
  ['portfolio/hamilton', 'hamilton-after-2.jpg', 'card', 'Built, the side yard'],
  ['portfolio/hamilton', 'hamilton-before-1.jpg', 'wide', 'Compare, the back yard before'],
  ['portfolio/hamilton', 'hamilton-before-2.jpg', 'wide', 'Compare, the side yard before'],

  // ---- Castle Lane: concept only -------------------------------------
  ['portfolio/castle-lane', 'castle-ln-1.png', 'wide', 'Drawing, front yard'],
  ['portfolio/castle-lane', 'castle-ln-2.png', 'wide', 'Drawing, side yard'],
  ['portfolio/castle-lane', 'castle-ln-3.png', 'wide', 'Drawing, backyard'],
  ['portfolio/castle-lane', 'castle-ln-4.png', 'wide', 'Drawing, site plan'],

  // ---- Los Charros: dry hillside, built ------------------------------
  ['portfolio/los-charros', 'loscharros-slope-after.png', 'card', 'Built, the bank after'],
  ['portfolio/los-charros', 'loscharros-before.png', 'card', 'Built, the bank before'],
  ['portfolio/los-charros', 'loscharros-creek.jpg', 'tall', 'Photograph, the dry creek'],
  ['portfolio/los-charros', 'loscharros-after.jpg', 'tall', 'Photograph, grasses and boulders'],
  ['portfolio/los-charros', 'loscharros-planting-day.png', 'tall', 'Photograph, planting day'],
  ['portfolio/los-charros', 'loscharros-render.jpg', 'wide', 'Drawing, the render'],
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
  const png = file.toLowerCase().endsWith('.png');
  const buffer = await sharp(svg)
    [png ? 'png' : 'jpeg'](png ? { compressionLevel: 9 } : { quality: 72 })
    .toBuffer();

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

const doc = `# Assets still needed

Every image below is currently a generated placeholder. The filenames are the
ones the Claude Design project uses, so a real photograph can be copied from
that project straight into the folder named here, keeping its name, and it will
be picked up with no other change.

Do not delete a placeholder without putting the real file in its place: every
path is validated at build time, so \`npm run build\` fails on a missing image
rather than shipping a broken one.

\`npm run placeholders\` is safe to re-run at any point. It only writes files
that are not already there, so it never overwrites a real photograph.

Total: **${MANIFEST.length} images** and **${VIDEOS.length} videos**.

## Images

Paths are relative to \`src/assets/\`. Ratio is how the design crops the slot,
so a replacement close to that shape needs no art direction.

${[...byDir.entries()]
  .map(
    ([dir, items]) =>
      `### \`${dir}/\` (${items.length})\n\n` +
      `| File | Ratio | Slot |\n| --- | --- | --- |\n` +
      items.map((i) => `| \`${i.file}\` | ${RATIO_LABEL[i.shape]} | ${i.label} |`).join('\n'),
  )
  .join('\n\n')}

## Videos

These go in \`public/media/\`. They are not placeholdered: a project whose
footage is missing renders the design's own "to come" panel, which is honest
about the gap rather than showing an empty frame.

To wire one up, drop the file in \`public/media/\` and change \`pending: true\`
to \`file: <name>\` on that clip in the project's Markdown file.

| File | Clip |
| --- | --- |
${VIDEOS.map(([f, l]) => `| \`${f}\` | ${l} |`).join('\n')}

## Google Drive embeds

Four walkthroughs play from Google Drive because GMZ has no local copy of the
footage. They are referenced by file id in the project Markdown, under
\`walkthrough.drive\` and on individual clips.

These depend on the Drive files staying link-shared. Nothing at build time can
check that, so if a walkthrough goes blank on the live site, check the sharing
on the Drive file first. Replacing them with local mp4s under \`public/media/\`
removes that dependency and is worth doing when the files are to hand.

## The logo

\`src/assets/brand/gmz-logo.svg\` is a generated wordmark, not the real mark.
The design draws the green tree-badge logo from Google Drive. Replacing this
one file updates the header, the mobile menu, the footer and the unlock veil,
because all four read the same asset.

\`public/favicon.svg\` and \`public/og-default.jpg\` are also placeholders.
`;

await writeFile(path.join(ROOT, 'ASSETS.md'), doc);

console.log(`placeholders: ${written} written, ${kept} already real`);
console.log(`ASSETS.md: ${MANIFEST.length} images, ${VIDEOS.length} videos listed`);
