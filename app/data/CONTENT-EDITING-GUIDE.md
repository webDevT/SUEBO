# Guide: Editing Text on the SUEBO Website

This guide explains how to update **text, contact details, and menu items** yourself — **without HTML or programming knowledge**.

All editable content lives in **JSON files** inside the `app/data/` folder.

---

## Quick reference

| What you want to change | File |
|-------------------------|------|
| Company name, copyright, SEO text | `app/data/site.json` |
| Phone, email, office addresses | `app/data/site.json` |
| Navigation (header, mega menu) | `app/data/blocks/navigation/header.json` |
| Footer text | `app/data/blocks/navigation/footer.json` |
| Content of a specific page | `app/data/pages/<page-name>.json` |
| Reusable blocks (USP, sliders, …) | `app/data/blocks/` |

After you save a JSON file, the website is updated automatically on the next build.

---

## Important: What you can edit — and what you cannot

### ✅ Safe to edit

- All files in `app/data/` (`.json`)
- PDF files in `app/static/docs/` or `app/img/` (when JSON links point to them)

### ❌ Do not edit (developer only)

| Folder / file | Reason |
|---------------|--------|
| `app/temp/` | Auto-generated — changes are lost on the next build |
| `app/src/` | HTML templates with layout and structure |
| `app/includes/` | Header/footer templates |
| `app/sass/`, `app/css/` | Design and styling |
| `app/js/` | JavaScript functionality |

---

## JSON basics

JSON is a structured text format. Follow these rules:

1. **Quotes** — always wrap text in double quotes: `"My text"`
2. **Commas** — put a comma between properties, **not** after the last item in a list
3. **Curly braces** `{ }` — for objects (e.g. `"hero": { "title": "..." }`)
4. **Square brackets** `[ ]` — for lists (e.g. job openings, buttons)
5. **No trailing comma** on the last line before `}` or `]`

### Example — correct

```json
{
  "hero": {
    "title": "Shape tomorrow's digital security",
    "description": "We are looking for people who take responsibility."
  }
}
```

### Example — incorrect (missing comma)

```json
{
  "hero": {
    "title": "Title"
    "description": "Text"
  }
}
```

### Validate JSON

Before saving, validate your file with an online tool such as [jsonlint.com](https://jsonlint.com). Invalid JSON causes a **build error** — the site will not update.

---

## `site.json` — global data

File: **`app/data/site.json`**

Contains information that appears on **many pages**:

| Section | Example fields | Where it appears |
|---------|----------------|------------------|
| `company` | `name`, `copyright` | Footer, page title |
| `seo` | `description` | Meta description (Google) |
| `contacts.emails` | `info`, `security` | Header, footer, contact |
| `contacts.phones` | `central`, `cyberSecurity`, … | Header, footer, mega menu |
| `offices` | `zug`, `bern`, `solothurn` | Footer addresses |

### Example: change a phone number

```json
"central": {
  "label": "+41 31 589 65 65",
  "href": "+41315896565"
}
```

- **`label`** — text shown on the website
- **`href`** — number used for `tel:` links (no spaces or special characters)

### Example: change an email

```json
"emails": {
  "info": "info@suebo.ch"
}
```

---

## Page content — `app/data/pages/`

Each page has its own JSON file. The **filename** matches the HTML page:

| HTML page | JSON file |
|-----------|-----------|
| `karriere.html` | `pages/karriere.json` |
| `cybersecurity-strategie.html` | `pages/cybersecurity-strategie.json` |
| `index.html` | `pages/index.json` |
| `kontakte.html` | `pages/kontakte.json` |

### Common fields in a page JSON

Structure may vary slightly per page. Common sections:

| Field | Meaning |
|-------|---------|
| `hero.title` | Main heading (H1) at the top of the page |
| `hero.description` | Intro text below the heading |
| `hero.breadcrumbCurrent` | Current breadcrumb label |
| `hero.buttons` | Buttons with `label` and `href` |
| `breadcrumbs.items` | Navigation path (Home → …) |
| `pageText` | Additional text blocks on the page |
| `vacancies` | Job listings (careers page only) |
| `advantages.items` | Benefit cards on service pages |
| `bannerSections` | Banners at the bottom of the page |

### Example: careers page (`pages/karriere.json`)

**Change the hero title:**

```json
"hero": {
  "title": "Shape tomorrow's digital security",
  "description": "Not a number in the system — an expert on the team."
}
```

**Add a new job opening** — insert a new entry in `vacancies`:

```json
"vacancies": [
  {
    "title": "Information Security Manager / Consultant (60–100%)",
    "location": "Bern / Hybrid",
    "category": "Information Security / Consulting",
    "description": "Job description …",
    "apply": {
      "href": "mailto:hr@suebo.ch",
      "label": "Apply now →"
    },
    "details": {
      "href": "img/job-description.pdf",
      "label": "DETAILS (PDF)"
    }
  }
]
```

To show **multiple jobs**, add more `{ ... }` blocks to the list — separated by commas.

### Example: homepage (`pages/index.json`)

```json
"hero": {
  "title": "Security and strategy for your\n\t\t\t\t<span>digital future</span>",
  "description": "Your Swiss partner for information security …"
}
```

---

## HTML inside text

Some fields allow **simple HTML**:

| Character / tag | Effect |
|-----------------|--------|
| `<br>` or `\n` | Line break |
| `<span>…</span>` | Highlight (e.g. coloured letters) |
| `<a href="…">` | Link (rare in JSON) |

**Example** (homepage):

```json
"title": "Security and strategy for your\n<span>digital future</span>"
```

Only change the **visible text** — leave HTML tags as they are unless you know what they do.

---

## Navigation & footer

### Header / mega menu

File: **`app/data/blocks/navigation/header.json`**

| Section | Content |
|---------|---------|
| `actions` | Buttons: search, menu, theme toggle |
| `top` | Main navigation (Cybersecurity, Consulting, …) |
| `mega` | Submenus with columns, links, and descriptions |

**Rename a menu item:**

```json
"cybersecurity": {
  "label": "Cybersecurity",
  "href": "cybersecurity.html"
}
```

Change only `label` — update `href` only if the target page changes.

### Footer

File: **`app/data/blocks/navigation/footer.json`**

Contains contact headings, direct-link labels, and legal links (Impressum, Datenschutz, …).

---

## Other content blocks (`app/data/blocks/`)

| File | Used for |
|------|----------|
| `blocks/usp.json` | USP banner (Quick-Check offer) |
| `blocks/why-suebo.json` | “Why SUEBO” section |
| `blocks/sliders/*.json` | Slider content on overview pages |

---

## Rebuilding the website

After JSON changes, the site must be rebuilt.

### Local (development)

In the project folder, run in the terminal:

```bash
npm run dev
```

- Starts the development server
- **Reloads automatically** when you save a JSON file
- Preview is usually at `http://localhost:3000` (or the port shown in the console)

### Production build (for server upload)

```bash
npm run build
```

Output goes to **`app/temp/`** — upload these files to the web server.

> **Note:** If `npm run build` fails with a JSON error, check the file you last edited with [jsonlint.com](https://jsonlint.com).

---

## Full mapping: page ↔ JSON file

| Web page | JSON file |
|----------|-----------|
| `index.html` | `pages/index.json` |
| `karriere.html` | `pages/karriere.json` |
| `kontakte.html` | `pages/kontakte.json` |
| `ueber-uns.html` | `pages/ueber-uns.json` |
| `referenzen.html` | `pages/referenzen.json` |
| `unternehmen.html` | `pages/unternehmen.json` |
| `cybersecurity.html` | `pages/cybersecurity.json` |
| `it-business-consulting.html` | `pages/it-business-consulting.json` |
| `losungen-services.html` | `pages/losungen-services.json` |
| `impressum.html` | `pages/impressum.json` |
| `datenschutz.html` | `pages/datenschutz.json` |
| `rechtliches.html` | `pages/rechtliches.json` |
| All `cybersecurity-*.html` | `pages/cybersecurity-*.json` |
| All `consulting-*.html` | `pages/consulting-*.json` |
| All `loesungen-*.html` | `pages/loesungen-*.json` |

**Rule:** The JSON filename is **identical** to the HTML filename (`.json` instead of `.html`).

---

## Common tasks — step by step

### Change a phone number site-wide

1. Open `app/data/site.json`
2. Under `contacts.phones`, update the number (`label` + `href`)
3. Save → run `npm run dev` or `npm run build`

### Change text on a service page

1. Find the page name (e.g. `cybersecurity-strategie.html`)
2. Open `app/data/pages/cybersecurity-strategie.json`
3. Edit `hero.title`, `hero.description`, or other fields
4. Save and run the build

### Rename a header menu item

1. Open `app/data/blocks/navigation/header.json`
2. Under `top` or `mega`, change the entry's `label`
3. Save and run the build

### Change a PDF link on a job listing

1. Upload the new PDF to `app/img/` or `app/static/docs/`
2. In `pages/karriere.json`, update `details.href` for the relevant entry
3. Save and run the build

---

## Developer-only changes

- Creating new pages
- Layout, images, colours, font sizes
- Adding new text fields or sections
- Changing JSON structure (new keys)
- Files in `app/src/` or `app/includes/`

If you cannot find a text in the JSON files, contact your developer.

---

## Pre-launch checklist

- [ ] JSON validated with [jsonlint.com](https://jsonlint.com)
- [ ] `npm run build` completed without errors
- [ ] Affected pages checked in the browser (desktop + mobile)
- [ ] Links and phone numbers tested
- [ ] For PDF links: file exists and opens correctly

---

*Last updated: June 2026 — SUEBO Informatik AG Website*
