#!/usr/bin/env node
/**
 * Render a self-contained HTML document in docs/ to a print-ready PDF.
 *
 * The documents in docs/ are internal working papers, not site pages, so they
 * are not part of the Astro build and nothing here touches src/. Each one is a
 * single file with its CSS inline and its own paged-media layout, which is why
 * a browser print is the whole toolchain: no page-layout dependency to install
 * and the HTML stays the editable source.
 *
 *   node scripts/render-pdf.mjs docs/pipeline-and-pricing.html [out.pdf]
 *
 * Chromium is expected on PATH or at CHROME_BIN. On a machine without one,
 * open the HTML and print to PDF; the layout is authored for US Letter with
 * zero page margins, so "print backgrounds on, margins none, scale 100%".
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const CANDIDATES = [
  process.env.CHROME_BIN,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].filter(Boolean);

const [input, output] = process.argv.slice(2);

if (!input) {
  console.error('usage: node scripts/render-pdf.mjs <input.html> [output.pdf]');
  process.exit(1);
}

const src = resolve(input);
if (!existsSync(src)) {
  console.error(`no such file: ${input}`);
  process.exit(1);
}

const out = resolve(output ?? src.replace(/\.html?$/i, '.pdf'));

const chrome = CANDIDATES.find((path) => existsSync(path));
if (!chrome) {
  console.error('No Chromium found. Set CHROME_BIN, or print the HTML by hand:');
  console.error('  US Letter, margins none, background graphics on, scale 100%.');
  process.exit(1);
}

// Chromium writes --print-to-pdf relative to its own cwd and clobbers nothing
// on failure, so render into a scratch dir and move the finished file into
// place. That way a failed run leaves the previous PDF intact.
const scratch = mkdtempSync(join(tmpdir(), 'gmz-pdf-'));
const staged = join(scratch, basename(out));

try {
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      '--generate-pdf-document-outline',
      `--print-to-pdf=${staged}`,
      `file://${src}`,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );

  if (!existsSync(staged)) throw new Error('Chromium produced no PDF');
  copyFileSync(staged, out);
  console.log(`wrote ${out.replace(`${process.cwd()}/`, '')}`);
} catch (error) {
  console.error(`render failed: ${error.message}`);
  if (error.stderr?.length) console.error(error.stderr.toString().trim());
  process.exit(1);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
