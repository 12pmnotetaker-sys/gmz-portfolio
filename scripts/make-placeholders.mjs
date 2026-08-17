/**
 * Generates the placeholder photographs that stand in for real project
 * photography until it lands. Run with `node scripts/make-placeholders.mjs`.
 *
 * These exist so the image pipeline is exercised end to end: swapping in a
 * real photo is a file replace, not a wiring job. Delete a placeholder as
 * soon as the real photo for that slot exists.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.join(process.cwd(), 'src/assets/projects');
const HERO_OUT = path.join(process.cwd(), 'src/assets/hero');

// Muted greens and stone tones, so a placeholder never reads as a real photo
// but also never fights the brand palette on screen.
const PLATES = [
  { file: 'placeholder-hardscape.jpg', from: '#4A5D4E', to: '#8C8577', label: 'HARDSCAPE' },
  { file: 'placeholder-planting.jpg', from: '#2E7D32', to: '#7FA06B', label: 'PLANTING' },
  { file: 'placeholder-courtyard.jpg', from: '#1B5E20', to: '#6E7F63', label: 'COURTYARD' },
  { file: 'placeholder-lawn.jpg', from: '#3E6B41', to: '#A8AE94', label: 'LAWN' },
  { file: 'placeholder-fence.jpg', from: '#5A5145', to: '#9C9484', label: 'FENCE' },
  { file: 'placeholder-detail.jpg', from: '#37474F', to: '#8A9A9E', label: 'DETAIL' },
];

const W = 2000;
const H = 1333;

const plate = ({ from, to, label }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="64" letter-spacing="14"
        fill="#FFFFFF" fill-opacity="0.72">${label}</text>
  <text x="50%" y="calc(50% + 72px)" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6"
        fill="#FFFFFF" fill-opacity="0.5">PLACEHOLDER — REPLACE WITH PROJECT PHOTO</text>
</svg>`;

await mkdir(OUT, { recursive: true });

for (const spec of PLATES) {
  const buffer = await sharp(Buffer.from(plate(spec)))
    .jpeg({ quality: 78 })
    .toBuffer();
  await writeFile(path.join(OUT, spec.file), buffer);
  console.log(`wrote ${spec.file} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

console.log(`\n${PLATES.length} placeholders written to src/assets/projects/`);

/**
 * The homepage hero plate.
 *
 * Wider and darker than the project plates because it sits full bleed behind
 * the opening of the page and has to sit on the navy ground without fighting
 * it. Deliberately abstract: bands of grade rather than anything that could
 * be mistaken for a photograph of a real GMZ job. It is marked as pending on
 * its face for the same reason.
 *
 * Replace `src/assets/hero/placeholder-hero.jpg` with a real photograph and
 * delete this block. Nothing else has to change: the homepage imports that
 * one path.
 */
const HERO_W = 2400;
const HERO_H = 1350;

/*
 * Read as a site section: light above, planting mass, the finished grade
 * line, then terrace and base courses going down.
 *
 * The interest deliberately sits in the TOP half. The page lays a scrim over
 * the foot of this image so the overlay type has something to sit on, so
 * anything subtle down there is thrown away. Bright at the top, dissolving
 * downward, is what survives the treatment.
 */
const BANDS = [
  { y: 0.0, h: 0.3, from: '#0C4F57', to: '#18756B' },
  { y: 0.3, h: 0.2, from: '#12724A', to: '#1E9B57' },
  { y: 0.5, h: 0.16, from: '#0F6440', to: '#18854B' },
  { y: 0.66, h: 0.14, from: '#0C4634', to: '#115A3E' },
  { y: 0.8, h: 0.2, from: '#083032', to: '#0A3A39' },
];

const GRADE_Y = HERO_H * 0.5;

const ticks = Array.from({ length: 48 }, (_, i) => {
  const x = (i / 48) * HERO_W;
  const tall = i % 6 === 0;
  return `<rect x="${x.toFixed(1)}" y="${(GRADE_Y - (tall ? 34 : 18)).toFixed(1)}" width="2" height="${tall ? 34 : 18}" fill="#8FE9B4" fill-opacity="${tall ? 0.85 : 0.45}"/>`;
}).join('');

const heroPlate = `
<svg xmlns="http://www.w3.org/2000/svg" width="${HERO_W}" height="${HERO_H}">
  <defs>
    ${BANDS.map(
      (b, i) => `<linearGradient id="b${i}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${b.from}"/><stop offset="100%" stop-color="${b.to}"/>
    </linearGradient>`,
    ).join('')}
    <radialGradient id="glow" cx="0.74" cy="0.16" r="0.7">
      <stop offset="0%" stop-color="#B8F5D0" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#B8F5D0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="foot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#002B37" stop-opacity="0"/>
      <stop offset="100%" stop-color="#002B37" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  ${BANDS.map(
    (b, i) =>
      `<rect x="0" y="${(b.y * HERO_H).toFixed(1)}" width="${HERO_W}" height="${(b.h * HERO_H).toFixed(1)}" fill="url(#b${i})"/>`,
  ).join('')}
  <rect width="${HERO_W}" height="${HERO_H}" fill="url(#glow)"/>

  <!-- Vertical survey stations, the same plan-sheet language the site uses. -->
  ${Array.from({ length: 7 }, (_, i) => {
    const x = ((i + 1) / 8) * HERO_W;
    return `<rect x="${x.toFixed(1)}" y="0" width="1" height="${HERO_H}" fill="#DFF7E8" fill-opacity="0.07"/>`;
  }).join('')}

  <line x1="0" y1="${GRADE_Y.toFixed(1)}" x2="${HERO_W}" y2="${GRADE_Y.toFixed(1)}"
        stroke="#8FE9B4" stroke-opacity="0.9" stroke-width="3"/>
  ${ticks}
  <rect x="0" y="${(HERO_H * 0.8).toFixed(1)}" width="${HERO_W}" height="${(HERO_H * 0.2).toFixed(1)}" fill="url(#foot)"/>
  <!-- Dead centre on the grade line: the one point that survives a centre
       crop at any hero aspect ratio, from a wide desktop band to a narrow
       phone. A placeholder nobody can see is a placeholder that ships by
       accident. -->
  <text x="${HERO_W / 2}" y="${(GRADE_Y - 34).toFixed(1)}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="32" letter-spacing="10"
        fill="#FFFFFF" fill-opacity="0.68">PHOTOGRAPHY PENDING</text>
</svg>`;

await mkdir(HERO_OUT, { recursive: true });
const heroBuffer = await sharp(Buffer.from(heroPlate)).jpeg({ quality: 82 }).toBuffer();
await writeFile(path.join(HERO_OUT, 'placeholder-hero.jpg'), heroBuffer);
console.log(
  `wrote placeholder-hero.jpg (${(heroBuffer.length / 1024).toFixed(0)} KB) to src/assets/hero/`,
);
