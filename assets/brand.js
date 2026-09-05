// Shared slide frame. Keep source content and presenter notes editable in index.html.
const clinicAddress = 'G06 & G07 VUE Residence Service Suite 102, Jalan Pahang, 53300 Kuala Lumpur';
const deckSlides = [...document.querySelectorAll('.slides > section')];
deckSlides.forEach((slide, index) => {
  const marker = slide.querySelector(':scope > .slide-marker, :scope > .section-number');
  const isDark = slide.classList.contains('dark-slide');
  const label = marker?.textContent || 'Doctor Training Workshop';
  if (slide.querySelector(':scope > .big-message')) slide.classList.add('section-divider');
  marker?.remove();
  const content = document.createElement('div');
  content.className = 'slide-content';
  [...slide.childNodes].filter(node => !(node.nodeType === 1 && node.matches('aside.notes')))
    .forEach(node => content.append(node));
  slide.prepend(content);
  const header = document.createElement('header');
  header.className = 'slide-header';
  const category = document.createElement('span');
  category.className = 'slide-label';
  category.textContent = label;
  const logo = document.createElement('img');
  logo.className = 'brand-logo';
  logo.src = `assets/brand/inocare-${isDark ? 'white' : 'dark'}.png`;
  logo.alt = 'Klinik Inocare — Wound Care & Wellness Centre';
  logo.width = 184;
  logo.height = 47;
  header.append(category, logo);
  const footer = document.createElement('footer');
  footer.className = 'slide-footer';
  const address = document.createElement('address');
  address.textContent = clinicAddress;
  const count = document.createElement('span');
  count.className = 'page-count';
  count.textContent = `${String(index + 1).padStart(2, '0')} / ${deckSlides.length}`;
  footer.append(address, count);
  slide.append(header, footer);
});
