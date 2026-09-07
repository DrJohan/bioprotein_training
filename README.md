# Klinik Inocare — Bioprotein in Advanced Wound Management

Reveal.js doctor-training presentation prepared for deployment on **GitHub Pages**.

## Repository structure

```text
.
├── index.html
├── .nojekyll
├── assets/
│   ├── brand.css
│   ├── brand.js
│   ├── brand/
│   ├── fonts/
│   └── cases/README.md
├── robots.txt
└── README.md
```

The presentation is a static site. **No Node.js, npm build, Jekyll, or bundler is required.**
Reveal.js 5.1.0 is pinned via jsDelivr CDN in `index.html`.

## Deploy to GitHub Pages

1. Create a new GitHub repository, or use an existing empty repository.
2. Upload/commit all files in this package to the **root of the `main` branch**.
3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment → Source**, select **Deploy from a branch**.
5. Choose **main** and **/ (root)**, then save. Updates pushed to `main` deploy automatically.
6. When deployment completes, the URL will appear under **Settings → Pages**.

For a normal project repository, the URL will generally be:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

All local assets use relative paths, so the deck is compatible with project-site subpaths.

## Klinik Inocare branding

Every slide uses the approved logo at the top right, the clinic address in the footer, and a page count. The shared layout is in `assets/brand.css`; the repeated slide frame and address are in `assets/brand.js`. The dark closing slide uses the approved white logo variant.

DM Sans and Inter are bundled locally, with their licences in `assets/fonts/`. Light slides use `assets/brand/inocare-colour-transparent.png`, a transparent-background version of the supplied colour logo. The original white-background image is retained as `assets/brand/inocare-colour.jpg`. The reversed white closing-slide logo is from the approved brand kit. Address source: [Klinik Inocare contact page](https://klinikinocare.com/contact-us/).

Phosphor outline icons are bundled in `assets/icons/` with their MIT licence and source information. Slides 11–12 use published photographs of real foot examinations, with visible credits and full provenance in `assets/photos/README.md`. Detailed assessment prompts from the replaced illustrations remain in the speaker notes.

The layout has fixed header and footer areas. Presenter notes remain in the original `aside.notes` elements, and branding repeats in Reveal.js PDF printing. Local PDF backups belong in `output/pdf/`, which is excluded from Git.

## Local preview

From the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Reveal.js presenter controls

- **Menu button (bottom left)** or `M` — open tools, a searchable list of all 57 slides, and a shortcut guide.
- `T` — open/close the chalkboard.
- `C` — draw directly on the current slide.
- `E` — eraser; choose a colour or use `X` / `Y` to return to the pen.
- `Delete` — clear the current drawing; `Backspace` — clear all drawings after confirmation.
- `D` — download drawing data as `chalkboard.json`.
- `→` / `←` — navigate slides
- `S` — speaker notes view
- `Esc` — close the menu or finish drawing; otherwise open/close slide overview
- `F` — fullscreen
- `B` — black screen
- `G` — jump to a slide number; `Home` / `End` — first/last slide.
- `?` / `F1` — Reveal.js keyboard help.

Drawing supports mouse, stylus and touch. The toolbar provides five colours, an eraser, clear and Done buttons. Drawings persist across slide changes and refreshes within the same browser tab, using session storage. Download a copy before closing the tab. The downloaded JSON can be supplied as the Chalkboard plugin's `src` for a future session.

Choose **Menu → Print / Save PDF** to open print view in the same tab, then use its Print / Save PDF button. The menu and drawing toolbar are excluded from printed output. The Chalkboard plugin adds recorded chalkboard pages after their corresponding slide; annotations drawn directly on slides are not included in that export. The print-view Back to slides button returns to the presentation.

The menu and toolbar are local assets in `assets/presenter.js` and `assets/presenter.css`; the MIT-licensed Chalkboard plugin is pinned and bundled in `assets/vendor/chalkboard/`. Phosphor icons are bundled in `assets/icons/presenter.svg`. No build step is required.

## Adding the real case-study photographs later

Put the de-identified images under `assets/cases/` and follow `assets/cases/README.md`.
The current case slides contain searchable markers:

- `CASE1_IMAGE_SLOT`
- `CASE2_IMAGE_SLOT`
- `CASE3_IMAGE_SLOT`

This makes replacing the placeholders straightforward without changing the slide layout.

## Clinical governance

Before live delivery, verify product-specific procedural details against the **latest manufacturer IFU, authorised training material, current Malaysian registration/intended purpose, and Klinik Inocare SOP**. Do not add patient-identifiable photographs to a public GitHub repository.

## Notes on GitHub Pages

`.nojekyll` is deliberately included because this is a plain static Reveal.js site and does not require Jekyll processing.

The package also includes `robots.txt` plus a `noindex,nofollow` meta tag to discourage search indexing. **This is not a privacy or access-control mechanism.** Remove those lines only if you intentionally want the deck indexed publicly.

If you later configure a custom domain, set it in **Settings → Pages**. A repository `CNAME` file by itself does not configure the Pages custom domain.
