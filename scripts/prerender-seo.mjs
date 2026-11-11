import { readFile, writeFile, rm } from 'node:fs/promises';
import { siteMarkup } from '../siteMarkup.js';
import { withAzureCommunityPartner } from '../azureCommunityPartner.js';

const root = process.cwd();
const dist = `${root}/dist`;
const indexPath = `${dist}/index.html`;
let html = await readFile(indexPath, 'utf8');

// Prefer an explicitly configured canonical domain; Vercel supplies the
// stable production domain when automatic system environment variables are enabled.
const canonicalInput = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '';

function normalizeSiteUrl(value) {
  if (!value) return '';
  const raw = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const parsed = new URL(raw);
  return `${parsed.protocol}//${parsed.host}`;
}

const siteUrl = normalizeSiteUrl(canonicalInput);
const isPreview = process.env.VERCEL_ENV === 'preview';

// Emit the entire event page into the initial HTML. This makes core content
// available to crawlers and visitors before the JavaScript bundle executes.
const rootToken = '<div id="root"></div>';
const prerenderedRoot = `<div id="root"><div class="site-root" data-prerendered="true">${withAzureCommunityPartner(siteMarkup)}</div></div>`;
if (html.includes(rootToken)) {
  html = html.replace(rootToken, prerenderedRoot);
} else if (!html.includes('data-prerendered="true"')) {
  throw new Error('Could not find the root mount in dist/index.html for SEO prerendering.');
}

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

if (isPreview) {
  // Do not let Vercel Preview deployments compete with the production URL.
  for (const bot of ['robots', 'googlebot', 'bingbot']) {
    const expression = new RegExp(`<meta\\s+name=["']${bot}["'][^>]*>`, 'i');
    html = html.replace(expression, `<meta name="${bot}" content="noindex, nofollow">`);
  }
} else {
  html = html.replace(
    /<meta\s+name=["']robots["'][^>]*>/i,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'
  );
}

if (siteUrl) {
  const canonical = `${siteUrl}/`;
  const ogImage = `${siteUrl}/assets/buildher-bharat-og.jpg`;
  const organizationId = `${siteUrl}/#shenfinity`;

  html = html.replace(
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${ogImage}">`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${ogImage}">`
  );

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        "name": "Shenfinity",
        "logo": `${siteUrl}/assets/logo-shenfinity.jpeg`,
        "sameAs": [
          "https://www.linkedin.com/company/shenfinity/",
          "https://www.instagram.com/shenfinity?vrfl=OGp4Z3Z4Z2c5aXdq"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": canonical,
        "name": "BuildHer Bharat",
        "alternateName": "BuildHer Bharat 2026",
        "inLanguage": "en-IN",
        "publisher": { "@id": organizationId }
      },
      {
        "@type": "Event",
        "@id": `${siteUrl}/#event`,
        "name": "BuildHer Bharat 2026",
        "description": "A free girls-only innovation hackathon in India, organised by Shenfinity. The programme includes online idea submission, online mentoring and prototype development, and an offline Grand Finale at K.R. Mangalam University, Gurugram.",
        "startDate": "2026-11-07",
        "endDate": "2026-11-25",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
        "image": [ogImage],
        "location": {
          "@type": "Place",
          "name": "K.R. Mangalam University",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sohna Road",
            "addressLocality": "Gurugram",
            "addressRegion": "Haryana",
            "postalCode": "122103",
            "addressCountry": "IN"
          }
        },
        "organizer": { "@id": organizationId },
        "offers": {
          "@type": "Offer",
          "url": "https://unstop.com/p/build-her-bharat-shenfinity-1766366",
          "price": 0,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        },
        "mainEntityOfPage": canonical
      }
    ]
  };

  const structuredDataTag = `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
  const headAdditions = [
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:url" content="${canonical}">`,
    structuredDataTag
  ].join('\n    ');
  // Inject directly before </head>; do not depend on an HTML comment surviving minification.
  html = html.replace('</head>', `    ${headAdditions}\n</head>`);
} else {
  // Never publish a guessed canonical or a sitemap containing a fake domain.
  console.warn('SEO: no SITE_URL or Vercel production domain found; canonical, JSON-LD and sitemap were skipped.');
}

await writeFile(indexPath, html, 'utf8');

const robotsPath = `${dist}/robots.txt`;
if (isPreview) {
  // Allow crawlers to fetch the page and read the noindex meta tag.
  await writeFile(robotsPath, 'User-agent: *\nAllow: /\n', 'utf8');
  await rm(`${dist}/sitemap.xml`, { force: true });
} else {
  const robots = siteUrl
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    : 'User-agent: *\nAllow: /\n';
  await writeFile(robotsPath, robots, 'utf8');

  if (siteUrl) {
    const today = new Date().toISOString().slice(0, 10);
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
      `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
      `  <url>\n` +
      `    <loc>${escapeXml(`${siteUrl}/`)}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <image:image><image:loc>${escapeXml(`${siteUrl}/assets/buildher-bharat-og.jpg`)}</image:loc>` +
      `<image:title>BuildHer Bharat 2026 girls-only innovation hackathon</image:title></image:image>\n` +
      `    <image:image><image:loc>${escapeXml(`${siteUrl}/assets/buildher-bharat-banner.png`)}</image:loc>` +
      `<image:title>BuildHer Bharat 2026 event poster</image:title></image:image>\n` +
      `  </url>\n</urlset>\n`;
    await writeFile(`${dist}/sitemap.xml`, sitemap, 'utf8');
  } else {
    await rm(`${dist}/sitemap.xml`, { force: true });
  }
}

console.log(`SEO prerender complete. Static page content: ${siteMarkup.length.toLocaleString('en-IN')} characters.`);
console.log(`Canonical base: ${siteUrl || '(not set)'}`);
console.log(`Deployment environment: ${process.env.VERCEL_ENV || 'local/custom'}`);
