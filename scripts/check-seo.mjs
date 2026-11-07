import { readFile, access } from 'node:fs/promises';

const root = process.cwd();
const index = await readFile(`${root}/dist/index.html`, 'utf8');
const robots = await readFile(`${root}/dist/robots.txt`, 'utf8');
const isPreview = process.env.VERCEL_ENV === 'preview';
const hasCanonical = /<link rel="canonical" href="https:\/\//.test(index);
const hasSchema = /<script type="application\/ld\+json">/.test(index);
let sitemapExists = false;
try { await access(`${root}/dist/sitemap.xml`); sitemapExists = true; } catch {}

const checks = [
  ['Static event content is pre-rendered', /<div id="root"><div class="site-root" data-prerendered="true">/.test(index)],
  ['A single descriptive page title exists', /<title>BuildHer Bharat 2026 \| Girls-Only Hackathon in India \| Shenfinity<\/title>/.test(index)],
  ['Meta description exists', /<meta name="description" content="[^"]{70,180}">/.test(index)],
  ['Social preview metadata exists', /property="og:image"/.test(index) && /name="twitter:card"/.test(index)],
  ['Branded favicon exists', /rel="icon"/.test(index)],
  ['Preview is noindex and robots-readable', isPreview ? /<meta name="robots" content="noindex, nofollow">/.test(index) && /Allow: \//.test(robots) : true],
  ['Production allows crawling', !isPreview ? /Allow: \//.test(robots) : true],
  ['Canonical URL emitted for a domain-configured build', hasCanonical || isPreview],
  ['Structured data emitted for a domain-configured build', hasSchema || isPreview],
  ['Sitemap generated only for a domain-configured production build', isPreview ? !sitemapExists : (hasCanonical ? sitemapExists : !sitemapExists)],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}`);
  if (!passed) failed = true;
}
if (failed) process.exitCode = 1;
