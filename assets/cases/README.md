# Case-study images

Place **de-identified, consented clinical images** for the case slides in this folder.

Recommended filenames:

- `case-01-dfu.jpg` — plantar diabetic foot ulcer
- `case-02-vlu.jpg` — venous leg ulcer
- `case-03-limb-threat.jpg` — ischaemic / limb-threatening diabetic foot

Optional supporting images can use names such as:

- `case-01-offloading.jpg`
- `case-01-xray.jpg`
- `case-02-compression.jpg`
- `case-03-doppler.jpg`

## How to insert an image

Search `index.html` for `CASE1_IMAGE_SLOT`, `CASE2_IMAGE_SLOT`, or `CASE3_IMAGE_SLOT`.
Replace the corresponding `<div class="placeholder-photo">...</div>` with an image, for example:

```html
<img
  class="case-image"
  src="assets/cases/case-01-dfu.jpg"
  alt="De-identified plantar diabetic foot ulcer case photograph"
>
```

Keep filenames lowercase and avoid spaces. Use relative paths as above so the deck works correctly on project GitHub Pages URLs.
