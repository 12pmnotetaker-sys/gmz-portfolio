/**
 * Generates the favicon and the Open Graph card from the GMZ mark.
 * Run with `npm run brand`.
 *
 * Both are derived rather than hand-drawn, so replacing
 * `src/assets/brand/gmz-logo.png` and re-running this is all it takes to keep
 * the tab icon and the social preview in step with the logo.
 *
 * The mark is white artwork on transparent, so both outputs put it on the
 * brand teal. Never place it on a light ground.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { company } from '../src/data/site.ts';

const ROOT = process.cwd();
const MARK = path.join(ROOT, 'src/assets/brand/gmz-logo.png');

const TEAL = '#002B37';
const AMBER = '#F6A400';

/* ---- Favicon ---------------------------------------------------------- */
/* A tab icon is ~16px in practice, so the mark is given a generous margin and
   nothing else competes with it. */

const FAVICON = 256;
const faviconMark = await sharp(MARK)
  .resize({ height: Math.round(FAVICON * 0.74), fit: 'inside' })
  .toBuffer();

await sharp({
  create: { width: FAVICON, height: FAVICON, channels: 4, background: TEAL },
})
  .composite([{ input: faviconMark, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(ROOT, 'public/favicon.png'));

/* ---- Open Graph card -------------------------------------------------- */
/* 1200x630 is the size every platform crops from. The mark carries the name,
   so the type only has to add the tagline and the licence line. */

const OG_W = 1200;
const OG_H = 630;
const ogMark = await sharp(MARK).resize({ height: 340, fit: 'inside' }).toBuffer();

const ogText = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
  <text x="470" y="286" font-family="Gabarito" font-size="62" font-weight="800"
        letter-spacing="-1.5" fill="#ffffff">${company.name}</text>
  <rect x="470" y="312" width="72" height="6" fill="${AMBER}"/>
  <text x="470" y="382" font-family="Gabarito" font-size="34" font-weight="500"
        fill="#ffffff" fill-opacity="0.88">${company.tagline}</text>
</svg>`);

await sharp({
  create: { width: OG_W, height: OG_H, channels: 4, background: TEAL },
})
  .composite([
    { input: ogMark, left: 110, top: Math.round((OG_H - 340) / 2) },
    { input: ogText, top: 0, left: 0 },
    // The amber rule the design puts under everything.
    {
      input: await sharp({
        create: { width: OG_W, height: 10, channels: 4, background: AMBER },
      })
        .png()
        .toBuffer(),
      top: OG_H - 10,
      left: 0,
    },
  ])
  .jpeg({ quality: 88 })
  .toFile(path.join(ROOT, 'public/og-default.jpg'));

console.log('wrote public/favicon.png and public/og-default.jpg');
