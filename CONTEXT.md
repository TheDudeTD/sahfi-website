# CONTEXT — SAHFI website & EPK

Project context for developers and AI assistants. The artist-facing guide is [EDITING.md](EDITING.md); hosting is in [DEPLOY.md](DEPLOY.md).

## What this is
A single-page website for **SAHFI** (Benjamin Rifatbegović), a music producer and DJ from Sarajevo. It includes a full **Electronic Press Kit (EPK)**: featured tracks (Spotify), live sets and music videos (YouTube), bio, venues played, gallery, contact, and a downloadable PDF press kit.

- **Static site.** It has no backend, no database, and no admin panel. Content lives in plain files in `content/`, and editing those files and pushing to GitHub redeploys the site.
- **Hosting:** Cloudflare Pages (free plan) on the artist's own domain.
- **Visual reference:** [r3hab.com](https://www.r3hab.com/). The palette is monochrome (black/white/greys), with bold condensed uppercase headings, full-bleed imagery, and a centred wordmark header.
- **Content source:** the original data came from the artist's RecordUnion EPK (https://epk.recordunion.com/sahfi) plus links supplied by the owner.

## Stack
| Concern | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Framework / build | React Router 8 (framework mode) on Vite 8, `ssr: false` + `prerender: ["/"]` → static HTML that hydrates into a SPA |
| Styling | Tailwind CSS v4; tokens in `app/styles/app.css` (`@theme`) |
| Fonts | Barlow Condensed (display) + Inter (body) via `@fontsource` (self-hosted). The PDF uses Barlow/Barlow Condensed TTFs from `scripts/fonts/` (OFL). |
| Content validation | Zod (`app/lib/schema.ts`). Invalid content fails the build. |
| Images | `vite-imagetools` → responsive WebP (`app/lib/images.ts`) |
| PDF | `@react-pdf/renderer` + `sharp`, run by `scripts/build-epk.tsx` before the Vite build |
| Embeds | Spotify iframe player; `react-lite-youtube-embed` (click-to-load) |
| Lightbox | `yet-another-react-lightbox` |
| Icons | `simple-icons` (brand SVG paths) |

## Commands
```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # generate EPK PDF → build static site into build/client
npm run preview    # serve build/client locally
npm run epk        # only regenerate public/sahfi-epk.pdf
npm run check      # typecheck + content validation
```
Node ≥ 22 (`.nvmrc`).

## Folder map
```
content/                  ← ALL editable content (see EDITING.md)
  artist.json             name, tagline, genres, location, email, heroImage, pressPhoto, seo
  tracks.json             [{ title, spotifyUrl }]
  videos.json             { liveSets: [{ title, url }], featured: [{ title, url }] }
  about.md                bio (markdown; first paragraph is styled as the lead)
  venues.json             ["S One Sky Bar", ...]  → "Played At"
  socials.json            [{ platform, url }]  (platform ∈ SOCIAL_PLATFORMS in schema.ts)
  sections.json           order + visibility of page sections
  gallery/                photos, sorted by file name (01.jpg, 02.jpg, ...)
  hero/                   hero image(s); the one used is artist.json → heroImage
app/
  root.tsx                <html> shell, fonts, error boundary
  routes.ts               single route
  routes/home.tsx         loader (build-time) + page: Header, Hero, sections, Footer
  config/sections.tsx     SECTION REGISTRY: id → label + component
  config/site.ts          constants (EPK PDF path)
  lib/schema.ts           zod schemas + types + parseContent() (pure; shared with scripts)
  lib/content.server.ts   imports content/ via Vite, validates; build-time only
  lib/images.ts           import.meta.glob for gallery/hero → responsive WebP
  lib/embeds.ts           Spotify/YouTube URL parsing
  components/
    layout/               Header, NavDropdown (desktop), MobileMenu (<lg), Footer
    sections/             Hero, FeaturedTracks, VideoSection (used twice), About,
                          PlayedAt, Gallery, DownloadEpk, Contact
    ui/                   Container, Section, SectionHeading, Button, Reveal,
                          SpotifyEmbed, YouTubeEmbed, SocialIcon, SocialLinks
    pdf/EpkDocument.tsx   the PDF layout (react-pdf)
scripts/
  build-epk.tsx           renders EpkDocument → public/sahfi-epk.pdf
  load-content.ts         Node content loader (+ checks referenced images exist)
  validate-content.ts     `npm run check`
  fonts/                  TTFs for the PDF
public/                   favicon, robots.txt, sitemap.xml, _headers, _redirects
```

## How the page is assembled
1. `routes/home.tsx` → `loader()` runs **at build time only** (prerender). It returns validated content plus the bio rendered as HTML, so zod and marked never ship to the browser.
2. `getActiveSections()` (in `config/sections.tsx`) takes `content/sections.json`, drops disabled sections and sections whose data is empty (e.g. no tracks), and keeps the order.
3. The page renders `<Hero>`, then each active section via `sectionRegistry[id].render(...)`.
4. The header's **EPK dropdown** and the **mobile menu** are generated from the same active list, plus a "Download EPK" link to the PDF. The in-page `download` band is excluded from the dropdown because the PDF link replaces it.

## Common changes
- **Reorder or hide a section:** edit `content/sections.json`.
- **Rename a section heading or nav label:** `label` in `app/config/sections.tsx`.
- **Swap a section's design:** write a new component and point that registry entry's `render` at it. Props are typed per section, so nothing else changes.
- **Add a new section:**
  1. Add the id to `SECTION_IDS` in `app/lib/schema.ts`. If it needs data, add a schema and a content file, and load it in `content.server.ts` + `scripts/load-content.ts`.
  2. Create `app/components/sections/MySection.tsx`. Use `<Section id title>` from `ui/` for consistent spacing, heading, and reveal animation.
  3. Add a registry entry in `app/config/sections.tsx`.
  4. Add `{ "id": "...", "enabled": true }` to `content/sections.json`.
  5. If it belongs in the PDF, extend `components/pdf/EpkDocument.tsx`.
- **Add a social platform:** add it to `SOCIAL_PLATFORMS` (schema.ts), then add icon + label in `ui/SocialIcon.tsx` and a label in `pdf/EpkDocument.tsx`.
- **Colours/fonts:** `@theme` block in `app/styles/app.css`. The PDF has its own palette constant `C` in `EpkDocument.tsx`.

## Design tokens
`--color-bg #000`, `--color-surface #0d0d0d`, `--color-line #262626`, `--color-fg #fff`, `--color-muted #a3a3a3`, `--color-subtle #6b6b6b`, `--font-display` (Barlow Condensed), `--font-sans` (Inter), `--header-height 4.5rem`. Utilities: `font-display-tight` (condensed uppercase heading style) and `prose-bio` (markdown bio typography).

## Responsiveness
Mobile-first Tailwind. Breakpoints: `sm` 640, `md` 768, `lg` 1024 (desktop nav appears), `xl` 1280 (header social icons). Verified at 375 / 768 / 1024 / 1440 with no horizontal overflow. The Spotify player is compact (152px) below `md` and full (352px) above it.

## Conventions
- One component per file, named export, typed props interface above it.
- Sections receive only the data they need; they never import content directly. The exception is gallery images, which come from `lib/images.ts`.
- All anchors are `#<section-id>`. `section[id]` has `scroll-margin-top: var(--header-height)`.
- Accessibility: skip link, `aria-expanded`/`aria-controls` on menus, Esc closes menus, `prefers-reduced-motion` respected, alt text on images.

## Content still to confirm (TODO)
- [ ] `artist.json → genres`: currently a guess based on the bio (House, Tech House, Melodic, Nu Disco). Confirm with the artist.
- [ ] `artist.json → seo.siteUrl`: currently `https://sahfi.com`. Set it to the real domain, and update `public/robots.txt` + `public/sitemap.xml` to match.
- [ ] The bio is copied verbatim from RecordUnion. Check that it's current.
- [ ] Hero image is `content/hero/featured.jpg` (only 1440px wide). A higher-resolution landscape photo would look sharper on large screens.
- [ ] Extra socials (Spotify artist page, TikTok, etc.) if wanted.
