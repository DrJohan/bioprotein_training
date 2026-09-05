# Klinik Inocare — Bioprotein in Advanced Wound Management

Reveal.js doctor-training presentation prepared for deployment on **GitHub Pages**.

## Repository structure

```text
.
├── index.html
├── .nojekyll
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── assets/
│   └── cases/
│       ├── README.md
│       └── .gitkeep
└── README.md
```

The presentation is a static site. **No Node.js, npm build, Jekyll, or bundler is required.**
Reveal.js 5.1.0 is pinned via jsDelivr CDN in `index.html`.

## Deploy to GitHub Pages

1. Create a new GitHub repository, or use an existing empty repository.
2. Upload/commit all files in this package to the **root of the `main` branch**.
3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. Open **Actions** and run **Deploy Reveal.js deck to GitHub Pages**, or push another commit to `main`.
6. When the workflow completes, the deployment URL will appear in the workflow summary and under **Settings → Pages**.

For a normal project repository, the URL will generally be:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

All local assets use relative paths, so the deck is compatible with project-site subpaths.

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

- `→` / `←` — navigate slides
- `S` — speaker notes view
- `Esc` — slide overview
- `F` — fullscreen
- `B` — black screen

To print/export, append `?print-pdf` to the presentation URL and print from the browser.

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
