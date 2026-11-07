# BuildHer Bharat 2026 — React Website

A responsive React + Vite website for BuildHer Bharat 2026 by Shenfinity.

## Run locally
1. Extract the ZIP.
2. Open this project folder in VS Code.
3. Open Terminal in VS Code and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build
```bash
npm run build
npm run preview
```

## UI improvements in this version
- Replaced the circular orbital hero graphic with a clear event snapshot.
- Removed 10 unfilled mentor cards, 5 unfilled judge cards and dummy coordinator cards.
- Combined mentor and jury details into one factual section until confirmed profiles are ready.
- Shortened the main navigation and removed the generic looping institution ticker.
- Removed the repetitive Rules section and added useful submission/evaluation guidance to the FAQ.
- Reduced decorative glow, gradient and motion effects; improved readability and spacing.
- Kept the event poster, registration QR, sponsor information, three-round guide, sponsorship PDF, team groups, social links and soundtrack.

## Soundtrack
The site includes `public/assets/buildher-anthem.mp3` — **Kar Har Maidan Fateh**.
Press the floating Play button to start; browsers block autoplay by default.

## Credits
Coded by **Abhinav — CodeWithAbhinav**.
All rights reserved by **Shenfinity**.


## Latest UI polish
- Custom desktop cursor with hover expansion and click ripple feedback.
- Larger typography: 60px+ desktop section headings and larger body, button, navigation and card text.
- Touch devices retain native touch/pointer behavior; reduced-motion preferences are respected.


## Loader update
- Rebuilt the branded preloader with animated logo/orbits and a visible percentage bar.
- Progress updates as eager page images and web fonts finish loading.
- The loader waits for page interaction setup and uses a bounded safety timeout on slow or failed networks.
- The BuildHer Bharat logo is preloaded for a quicker first paint.


## Team update
- Added Bhavishka Jangid as a coordinator with her supplied profile photo and LinkedIn link.


## Coordinator update
- Added Prachi Yadav as a coordinator with her supplied profile photo and LinkedIn profile.
- The coordinator cards display Bhavishka Jangid and Prachi Yadav side by side on desktop and stack on smaller screens.


## Round 1 Rules & Guidelines
- Added the official 3-page Round 1 Rules & Guidelines PDF to the Round 1 timeline.
- Added direct download and in-browser preview links beside the Round 1 PPT template.
- The resource description covers eligibility, accepted formats, 6–7 slide structure, originality, evaluation, 15% social media bonus and selection stages.


## Round 2 Guide
- Added the official four-page Round 2 Mentoring & Prototype Presentation guide inside the Round 2 timeline card.
- Includes a direct download and in-browser preview.
- The guide describes mentor meeting preparation, prototype demonstration, suggested presentation flow, meeting conduct, do/avoid guidance, mentor feedback and team checklist.


## Round 3 Grand Finale Guide
- Added the official four-page Round 3 Rules & Guidelines PDF inside the Round 3 timeline card.
- Added direct download and in-browser preview links.
- Highlights required live deployment, a complete feature-explaining demo video, final pitch and live demo readiness, backup materials, jury flow and the finalist checklist.


## SEO & Google Search setup

### What the production build now does
- Pre-renders the complete event page into `dist/index.html`, so the main event copy, headings, sponsor names, round details and resource links are present in the initial HTML before JavaScript runs.
- Generates the canonical URL, absolute Open Graph/Twitter image URLs and JSON-LD (`Organization`, `WebSite`, and `Event`) at build time.
- Generates an absolute-URL `sitemap.xml` and adds it to `robots.txt` when a production site URL is available.
- Automatically marks Vercel Preview deployments `noindex` and disallows crawling there, while the production build remains indexable.
- Includes a branded favicon, Apple touch icon, web manifest, social preview image, descriptive image alt text, image dimensions and lazy loading for below-the-fold images.
- Adds Vercel cache and security headers through `vercel.json`.
- Keeps the optional soundtrack unloaded until the visitor starts playback.

### Deploy to Vercel
1. Push this project folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Select **Vite** as the Framework Preset. Use:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `dist`
4. In Vercel Project Settings → Environment Variables, enable **Automatically expose System Environment Variables**. The build uses `VERCEL_PROJECT_PRODUCTION_URL` to generate the production canonical URL and sitemap.
5. When you connect a custom domain, add `SITE_URL` as an Environment Variable for the Production environment, e.g. `https://www.yourdomain.com` (no trailing slash), then redeploy. This overrides the Vercel-generated domain for canonical and sitemap URLs.
6. After the production deployment, check:
   - `https://YOUR-DOMAIN/`
   - `https://YOUR-DOMAIN/robots.txt`
   - `https://YOUR-DOMAIN/sitemap.xml`

### Submit the site to Google
1. Open Google Search Console: https://search.google.com/search-console
2. Add and verify your Domain property. Use the DNS TXT record Google gives you.
3. Submit the sitemap URL: `https://YOUR-DOMAIN/sitemap.xml`.
4. Use URL Inspection on the homepage and request indexing after the live URL is accessible.
5. Test the page with the Rich Results Test and inspect mobile performance with PageSpeed Insights.

### Important
SEO setup improves crawlability, indexability, metadata and sharing previews, but it cannot guarantee a Google ranking or a particular position. Google chooses whether and when to crawl, index and display pages. Publish useful updates, earn legitimate links/mentions from partners and participating colleges, and monitor Search Console over time.


## Vercel build permission fix
The Vercel build command intentionally calls Vite through Node instead of the executable shim:
```bash
node ./node_modules/vite/bin/vite.js build && node scripts/prerender-seo.mjs
```
This avoids `sh: node_modules/.bin/vite: Permission denied` when the `.bin` shim's executable permission is incorrect.

The project also includes a narrowly scoped npm install-script approval for the `esbuild@0.25.12` version shown in the deployment log:
```json
"allowScripts": {
  "esbuild@0.25.12": true
}
```
This allows esbuild's postinstall validation to run under npm versions that enforce the `allowScripts` policy. If the resolved esbuild version changes, review the new version and update the approval accordingly.

### After replacing the project on GitHub
1. Commit and push the updated project.
2. In Vercel → Project → Deployments, open the latest failed deployment.
3. Select **Redeploy** and leave **Use existing Build Cache** unchecked so Vercel reinstalls dependencies cleanly.
4. Confirm the Build Command is `npm run build`, Output Directory is `dist`, and the Root Directory points to this project.
5. The `Unknown env config "cache-dir"` message in the supplied log is a warning, not the command that stopped the build. The fatal line was the `.bin/vite: Permission denied` error.

To check the SEO output after a successful production build:
```bash
npm run seo:check
```
