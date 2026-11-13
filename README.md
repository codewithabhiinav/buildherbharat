# BuildHer Bharat 2026 — Professional Event Website

A sophisticated, editorial-grade React + Vite website for BuildHer Bharat 2026 by Shenfinity.

## Overview
Transformed into a premium, credible event platform inspired by international technology conferences and innovation summits. The redesign eliminates generic AI-generated tropes, replaces emoji glyphs with vector SVGs, implements a deliberate typographic hierarchy, unifies fragmented CSS files into a high-performance design system, and preserves all factual details, guidelines, and assets.

## Quick Start (Run Locally)
1. Extract the ZIP or clone the repository.
2. Open the project folder in your terminal / code editor:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## Production Build & SEO Verification
```bash
npm run build
npm run seo:check
```

## Key Architectural & UI/UX Refinements

### 1. Elimination of the AI-Generated Aesthetic
- Consolidated 26 fragmented, conflicting CSS patch files into a single, clean, performant design system (`styles.css` and `site-loader.css`).
- Eliminated random ambient neon blobs, harsh drop-shadows, repetitive glassmorphism, and spinning orbital artifacts.
- Replaced all emoji glyphs (✳, ♧, ♡, ✎, ₹, ⌘, ⌂, ❋, ☼, ✦) with custom, crisp inline SVG icons across tracks, eligibility cards, prizes, and contact channels.
- Removed the repetitive 50% social bonus notice that was copy-pasted across 6 different sections; consolidated it into a dedicated, professional showcase within **Share Your Moments**.

### 2. Editorial Hero Section
- Immediate, prominent communication of core event pillars:
  - **BUILDHER BHARAT 2026**
  - **Women Building the Future of India**
  - **An all-girls innovation hackathon organised by Shenfinity**
  - Free registration (₹0)
  - ₹1,00,000 total prize pool worth
  - ₹10,000 actual cash prize pool
  - 10 innovation tracks
  - 3 competition rounds
  - Grand Finale: 25 November 2026 at K.R. Mangalam University, Gurugram
- Balanced 2-column layout with a refined digital event pass card rather than a spinning gaming graphic.

### 3. Professional Event Highlights
- Streamlined 5-stat highlight section with clear differentiation:
  - **₹1,00,000** — Total Prize Pool Worth (overall value across cash, credits, and partner perks)
  - **₹10,000** — Cash Prize Pool (direct cash awarded to the top 3 winning teams)
  - **4,000+** — Digital Impressions (digital community reach)
  - **10** — Innovation Tracks
  - **3** — Competition Rounds
- Tabular numeric typography with single-trigger viewport count-up animation (no looping or distracting repeating counters).

### 4. Three-Round Milestone Timeline
- Clean sequence from idea submission to the offline finale:
  - **Round 1 — Idea Submission**: 7–15 November 2026 (Online PPT submission on Unstop)
    - Resource 1: Round 1 PPT Submission Template (8-page PDF Download & Preview)
    - Resource 2: Round 1 Rules & Guidelines (Official PDF Download & Preview)
  - **Round 2 — Mentoring & Prototype Development**: 18–21 November 2026 (Google Meet)
    - Resource: Round 2 Rules & Guidelines (4-page PDF Download & Preview)
  - **Round 3 — Offline Grand Finale**: 25 November 2026, K.R. Mangalam University, Gurugram (9:00 AM – 4:00 PM IST)
    - Resource: Round 3 Grand Finale Rules & Guidelines (4-page PDF Download & Preview)
  - Sitewide Resource: Complete Three-Round Guide PDF

### 5. Authentic Partner Hierarchy & Showcase
- Maintained exact logos with non-distorting white container tiles for high contrast:
  - **Nexora Entertainments** — Co-Title Sponsor
  - **ASI:ONE Ghaziabad** — Powered By
  - **Shenfinity** — Organiser
  - **Hacknfinity Ecosystem** — Sponsored & Supported By
  - **SheKunj** — Platform Partner & Sponsor
  - **Centre of Excellence – Cloud Computing, K.R. Mangalam University** — Institutional Collaborator
  - **UpToSkills** — Platform & Hiring Partner
  - **Digimation Flight** — Career Acceleration Partner
  - **Azure Developer Community** — Associate Partner
  - **Girl Up Change & Masika Care** — Networking Partners
  - **AI4Tomorrow** — Community Partner
  - Official 18-page Sponsorship Brochure PDF Download

### 6. Team & Coordinators
- Verified organizers and coordinators with authentic profile photos:
  - **Abhinav Kumar** (Organiser — Shenfinity, WhatsApp, Call, LinkedIn, Instagram)
  - **Sonam Yadav** (Organiser — Shenfinity, WhatsApp, Call, LinkedIn)
  - **Priya** (Organiser — Shenfinity, WhatsApp, Call, LinkedIn)
  - **Bhavishka Jangid** (Coordinator — Shenfinity, LinkedIn)
  - **Prachi Yadav** (Coordinator — Shenfinity, LinkedIn)
  - Volunteer Crew recognition

### 7. Performance, SEO & Static Prerendering
- Static prerendering via `scripts/prerender-seo.mjs` injecting >110,000 characters of clean semantic HTML into `dist/index.html`.
- Automated generation of canonical URLs, JSON-LD Schema (`Organization`, `WebSite`, `Event`), `sitemap.xml`, and `robots.txt`.
- 100% PASS on `npm run seo:check`.

### 8. Theme & Interaction Quality
- Persistent dark/light theme toggle in the header.
- Custom desktop cursor with `pointer-events: none` that never intercepts clicks and is disabled on touch devices.
- High-contrast, WCAG-compliant color balance with responsive layout from 320px mobile to 4K displays.

## Attribution
**Coded by Code_With_Abhinav · Abhinav**  
**All rights reserved by Shenfinity.**
