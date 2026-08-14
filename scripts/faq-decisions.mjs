/**
 * Lists the FAQ answers that are written but not published, and exactly what
 * has to be decided before each can go live.
 *
 *     npm run faq:decisions
 *
 * Reads the Markdown frontmatter directly rather than going through Astro, so
 * it runs in a second without a build.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'src/content/faqs');

const field = (front, name) => {
  const match = front.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  if (!match) return null;
  let value = match[1].trim();
  if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
};

const files = (await readdir(DIR)).filter((f) => f.endsWith('.md'));
const pending = [];
let published = 0;

for (const file of files) {
  const raw = await readFile(path.join(DIR, file), 'utf8');
  const front = raw.split('---')[1] ?? '';
  if (field(front, 'published') === 'true') {
    published += 1;
    continue;
  }
  pending.push({
    slug: file.replace(/\.md$/, ''),
    question: field(front, 'question') ?? file,
    phase: field(front, 'phase') ?? '',
    note: field(front, 'decisionNote') ?? 'No note recorded.',
  });
}

const byPhase = new Map();
for (const item of pending) {
  if (!byPhase.has(item.phase)) byPhase.set(item.phase, []);
  byPhase.get(item.phase).push(item);
}

const wrap = (text, indent = 5) => {
  const width = 78 - indent;
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else {
      line += ` ${word}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.map((l) => ' '.repeat(indent) + l).join('\n');
};

console.log(`\nGMZ FAQ — answers waiting on a decision\n${'='.repeat(50)}`);
console.log(`${published} live, ${pending.length} held back.\n`);

for (const [phase, items] of byPhase) {
  console.log(`\n${phase.toUpperCase()}`);
  console.log('-'.repeat(50));
  for (const item of items) {
    console.log(`\n  ${item.question}`);
    console.log(`  src/content/faqs/${item.slug}.md`);
    console.log(wrap(item.note));
  }
}

console.log(
  `\n${'='.repeat(50)}\n` +
    `To publish one: decide it, correct the answer if needed, then set\n` +
    `published: true in that file. Everything already reads correctly in\n` +
    `npm run dev, where held-back answers show with their note attached.\n`,
);
