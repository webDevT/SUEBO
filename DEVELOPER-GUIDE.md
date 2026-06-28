# SUEBO Website — Developer Guide

Technical reference for maintaining and extending the SUEBO Informatik AG static website.

For **client-facing content editing** (JSON only), see [`app/data/CONTENT-EDITING-GUIDE.md`](app/data/CONTENT-EDITING-GUIDE.md).

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Build | Gulp 4 |
| HTML assembly | `gulp-file-include` (`@@include`) |
| Content | JSON files + custom `{{token}}` renderer |
| Styles | Sass (compressed → `*.min.css`) |
| JS | jQuery, Slick Carousel, custom `main.js` |
| Fonts | Inter, Manrope, Poppins (`@fontsource`) |
| Dev server | `live-server` on `app/temp/` (port 3000) |
| Production output | `docs/` folder |

---

## Project structure

```
SUEBO/
├── app/
│   ├── src/                    # HTML page sources (46 pages)
│   ├── includes/               # Shared HTML fragments
│   ├── data/                   # JSON content (site, pages, blocks)
│   ├── sass/                   # SCSS source
│   ├── css/                    # Compiled CSS (generated)
│   ├── js/                     # main.js, libs.min.js, search-index.json
│   ├── img/                    # Images (PNG/WebP/SVG)
│   ├── fonts/                  # Self-hosted font files (generated)
│   ├── static/                 # Copied as-is to temp/docs (PDFs, qi/, etc.)
│   └── temp/                   # Dev build output — DO NOT EDIT
├── docs/                       # Production build output — deploy this
├── gulpfile.js                 # Build pipeline
├── build-search-index.js       # Generates client-side search index
├── copy-images.js              # Dev image copy to temp
├── copy-images-prod.js         # Prod image copy to docs
├── convert-images.js           # PNG/JPG → WebP (production build)
└── package.json
```

### Edit vs generated

| Path | Role |
|------|------|
| `app/src/*.html` | Page templates — layout + `{{tokens}}` |
| `app/includes/*.html` | Reusable fragments (header, footer, sliders) |
| `app/data/**/*.json` | All editable text content |
| `app/sass/**/*.scss` | Styles and theme overrides |
| `app/js/main.js` | Header, mega menu, theme toggle, search |
| `app/temp/` | **Generated** — dev preview |
| `app/css/*.min.css` | **Generated** — from Sass |
| `docs/` | **Generated** — production deploy |

---

## Build pipeline

### Development (`npm run dev`)

```
app/src/*.html
  → gulp-file-include (@@include from app/)
  → replaceContentTokens ({{…}} from app/data/)
  → app/temp/*.html

app/sass → app/css/*.min.css → copied to app/temp/
app/js, app/img, app/fonts, app/static → app/temp/
live-server serves app/temp/ on :3000
```

**Watched paths** (auto-rebuild on save):

- `app/sass/**/*.scss`
- `app/src/*.html`
- `app/includes/**/*.html`
- `app/data/**/*.json`
- `app/js/*.js`, `app/css/**`, `app/img/**`, `app/static/**`

### Production (`npm run build`)

1. Cleans `docs/`
2. Rebuilds `app/js/search-index.json`
3. Converts images to WebP (`convert-images.js`)
4. Copies fonts from `node_modules`
5. Outputs HTML to **`docs/`** (not `app/temp/`)
6. Copies CSS, JS, fonts, images, `app/static/`, `.htaccess`

Deploy the **`docs/`** folder to the web server.

### Other commands

```bash
npm run dev          # Development server + watch
npm run build        # Production build → docs/
npm run clean        # Delete docs/
gulp html            # Process HTML only → app/temp/
gulp sass            # Compile SCSS only
gulp buildSearchIndex
npm run convert-images
```

---

## HTML includes (`@@include`)

Uses [gulp-file-include](https://www.npmjs.com/package/gulp-file-include) with prefix `@@` and `basepath: 'app/'`.

### Basic page skeleton

```html
@@include('includes/header.html')

<main id="main-content">
  <!-- page content -->
</main>

@@include('includes/footer.html')
```

### Available includes

| File | Purpose | Used on |
|------|---------|---------|
| `includes/header.html` | `<head>`, preheader, nav, mega menu, mobile panel | All pages |
| `includes/footer.html` | Footer contacts, offices, legal links | All pages |
| `includes/usp.html` | Quick-Check USP banner | index, cybersecurity, legal pages, … |
| `includes/warum-suebo.html` | “Why SUEBO” section | index, unternehmen, cybersecurity, … |
| `includes/slider-section-cybersecurity.html` | Related services slider | Cybersecurity service pages |
| `includes/slider-section-cybersecurity-loesungen.html` | Lösungen slider (offensive) | Penetrationtests, phishing, … |
| `includes/slider-section-compliance-riskmanagement.html` | Compliance slider | Audit, gap analyse, firewall, … |
| `includes/slider-section-consulting.html` | Consulting slider | Consulting service pages |
| `includes/slider-section-loesungen.html` | Lösungen slider | Lösungen service pages |

Includes can contain `{{tokens}}` — they are resolved in the same pass as page templates.

---

## JSON content system

Content is loaded from `app/data/` at build time by `loadContentData()` in `gulpfile.js`.

### File layout

```
app/data/
├── site.json                         # Global: company, SEO, contacts, offices
├── pages/
│   ├── index.json                    # One file per page (matches HTML filename)
│   ├── karriere.json
│   └── cybersecurity-strategie.json
└── blocks/
    ├── usp.json
    ├── why-suebo.json
    ├── navigation/
    │   ├── header.json
    │   └── footer.json
    └── sliders/
        ├── cybersecurity.json
        └── …
```

### Token naming

File paths are converted to **camelCase** keys:

| File | Token prefix |
|------|--------------|
| `pages/karriere.json` | `pages.karriere` |
| `pages/cybersecurity-strategie.json` | `pages.cybersecurityStrategie` |
| `blocks/navigation/header.json` | `blocks.navigation.header` |
| `blocks/why-suebo.json` | `blocks.whySuebo` |

**Rule:** `my-page-name.json` → `myPageName`

### Token syntax in HTML

**Single value:**

```html
<h1>{{pages.karriere.hero.title}}</h1>
<a href="tel:{{contacts.phones.central.href}}">{{contacts.phones.central.label}}</a>
```

**Loop over array:**

```html
{{#each pages.karriere.vacancies}}
<li>
  <h3>{{title}}</h3>
  <p>{{description}}</p>
  <a href="{{apply.href}}">{{apply.label}}</a>
</li>
{{/each}}
```

Inside `{{#each}}`, fields refer to the **current item** (e.g. `{{title}}`, not `{{pages.karriere.vacancies.0.title}}`).

### Adding a new content field

1. Add the key to the relevant JSON file (e.g. `pages/my-page.json`)
2. Reference it in `app/src/my-page.html` as `{{pages.myPage.newField}}`
3. Save — Gulp rebuilds on JSON/HTML change

If a token is missing, the build throws: `Missing content token: …`

---

## Adding a new page

1. **Create HTML** — `app/src/my-new-page.html`:

```html
@@include('includes/header.html')

<main id="main-content">
  <section class="hero hero--secondary">
    <div class="container">
      <h1>{{pages.myNewPage.hero.title}}</h1>
      <p>{{pages.myNewPage.hero.description}}</p>
    </div>
  </section>
</main>

@@include('includes/footer.html')
```

2. **Create JSON** — `app/data/pages/my-new-page.json`:

```json
{
  "hero": {
    "title": "Page title",
    "description": "Intro text"
  }
}
```

Token prefix: `pages.myNewPage` (camelCase from filename).

3. **Add navigation link** — edit `app/data/blocks/navigation/header.json` (and footer if needed).

4. **Run** `npm run dev` — page appears at `app/temp/my-new-page.html`.

5. Optionally add a slider include before the footer, matching similar pages.

6. For production: `npm run build` — output in `docs/my-new-page.html`.

The search index (`build-search-index.js`) picks up new pages automatically from `app/src/*.html`.

---

## Sass and themes

Entry point: `app/sass/style.scss`

| Partial | Purpose |
|---------|---------|
| `_tokens.scss` | CSS custom properties (colours, theme tokens) |
| `_vars.scss` | Sass variables |
| `_themes.scss` | Light theme overrides (`[data-theme="light"]`) |
| `_index-light.scss` | Homepage-specific light theme styles |
| `_header.scss` | Header, mega menu, mobile nav |
| `_footer.scss` | Footer |
| `_theme-toggle.scss` | Theme switcher UI |
| `_buttons.scss`, `_breadcrumb.scss`, `_usp.scss` | Components |

### Dark / light mode

- Default: **dark** (`:root` / no attribute)
- Light: `data-theme="light"` on `<html>`
- Toggle logic: `app/js/main.js` — persists choice in `localStorage` (`suebo-theme`)
- Labels for toggle: `blocks.navigation.header.actions.themeDark` / `themeLight`

When adding light-theme styles, prefer `[data-theme="light"]` overrides in `_themes.scss` rather than duplicating dark rules.

---

## Assets

### Images

- Source: `app/img/`
- Dev copy: `copy-images.js` → `app/temp/img/`
- Prod: WebP conversion + `copy-images-prod.js` → `docs/img/`
- Use `<picture>` with WebP + PNG fallback in HTML

### PDFs and static files

- `app/static/docs/` — service PDFs
- `app/static/qi/` — QI certificate pages
- Copied unchanged to `app/temp/` (dev) and `docs/` (prod)

### Fonts

Copied from `node_modules/@fontsource/*` into `app/fonts/` on build. Declared in `_fonts.scss`.

---

## Client vs developer responsibilities

| Task | Who | Where |
|------|-----|-------|
| Change page text, contacts, menu labels | Client | `app/data/**/*.json` |
| Change layout, add sections, new pages | Developer | `app/src/`, `app/includes/` |
| Change design / colours | Developer | `app/sass/` |
| Change header behaviour, search, theme | Developer | `app/js/main.js` |
| Deploy | Developer / ops | Upload `docs/` after `npm run build` |

---

## Troubleshooting

### Build fails with `Missing content token`

A `{{…}}` in HTML references a JSON path that does not exist. Check spelling and camelCase (e.g. `cybersecurityStrategie`, not `cybersecurity-strategie`).

### Build fails with JSON parse error

Validate the edited JSON file at [jsonlint.com](https://jsonlint.com). Common issues: trailing comma, missing quotes.

### Changes not visible in browser

- Ensure `npm run dev` is running
- Hard-refresh the browser (Ctrl+Shift+R)
- Confirm you edited source files (`app/src/`, `app/data/`), not `app/temp/`

### Mega menu background icon not visible (light theme)

Use `background-image` in theme overrides — not `background` shorthand — so `background-color` is not reset. See `_themes.scss` / `_header.scss`.

### Search does not find a new page

Run `gulp buildSearchIndex` or restart `npm run dev`. Index is built from H1 text in rendered HTML.

---

## Related files

| File | Description |
|------|-------------|
| [`README.md`](README.md) | Quick start |
| [`app/data/CONTENT-EDITING-GUIDE.md`](app/data/CONTENT-EDITING-GUIDE.md) | Client content guide |
| [`gulpfile.js`](gulpfile.js) | Full build configuration |
| [`build-search-index.js`](build-search-index.js) | Site search index generator |

---

*Last updated: June 2026*
