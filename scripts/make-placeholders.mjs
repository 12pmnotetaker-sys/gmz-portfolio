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
