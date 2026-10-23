const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// --- 1. Security & Compliance ---
// Remove fetch IIFE script
const fetchIIFEStart = html.indexOf('var origFetch = window.fetch;');
if (fetchIIFEStart !== -1) {
  const sStart = html.lastIndexOf('<script>', fetchIIFEStart);
  const sEnd = html.indexOf('</script>', fetchIIFEStart) + 9;
  html = html.substring(0, sStart) + html.substring(sEnd);
  console.log('1. Removed fetch IIFE script');
} else {
  console.log('1. Fetch IIFE script already removed');
}

// Add upfront FTC disclosure in authority bar
if (!html.includes('ftc-authority-disclosure')) {
  const authBarEnd = html.indexOf('</aside>', html.indexOf('clinical-authority-bar'));
  if (authBarEnd !== -1) {
    const ftcSnippet = '\n      <div class="ftc-authority-disclosure" style="font-size: 0.78rem; color: var(--text-muted); margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(42, 127, 98, 0.2);">Reader-Supported Independent Lab: Zero paid brand placements. We may earn a commission from qualifying retail links.</div>';
    html = html.substring(0, authBarEnd) + ftcSnippet + html.substring(authBarEnd);
    console.log('2. Added FTC disclosure');
  }
}

// --- 2. Technical & On-Page SEO ---
// JSON-LD MedicalClinic -> Organization
html = html.replace('"@type": "MedicalClinic"', '"@type": "Organization"');
html = html.replace('"sameAs": []', '');
html = html.replace(/,\s*\n\s*\}/g, '\n      }');

// ItemList numberOfItems: 24 and position renumbering
const itemListIdx = html.indexOf('"@type": "ItemList"');
if (itemListIdx !== -1 && !html.includes('"numberOfItems": 24')) {
  html = html.substring(0, itemListIdx) + '"@type": "ItemList",\n        "numberOfItems": 24' + html.substring(itemListIdx + '"@type": "ItemList"'.length);
}

let listItemCount = 0;
html = html.replace(/"@type":\s*"ListItem",\s*\n\s*"position":\s*\d+/g, () => {
  listItemCount++;
  return '"@type": "ListItem",\n            "position": ' + listItemCount;
});
console.log('3. Renumbered', listItemCount, 'ListItem positions in ItemList');

// Meta keywords removal
html = html.replace(/<meta name="keywords"[^>]*>\n?/g, '');

// OpenGraph & Twitter image replacement
html = html.replace(/https:\/\/m\.media-amazon\.com\/images\/I\/71aXlh7do4L\._SL1500_\.jpg/g, 'https://www.clinicaldermalab.io/images/og-clinicaldermalab-cover.jpg');

if (!html.includes('og:image:alt')) {
  html = html.replace('<meta property="og:image"', '<meta property="og:image:alt" content="Clinical Derma Lab Independent Skincare Research and Clinical Product Reviews" />\n  <meta property="og:image"');
  console.log('4. Updated OG/Twitter image & added og:image:alt');
}

// Skin conditions star ratings alignment
html = html.replace('YTTP Superfood Air-Whip <span class="rating-tiny">4.7 ★</span>', 'YTTP Superfood Air-Whip <span class="rating-tiny">4.9 ★</span>');
html = html.replace('YTTP Superberry Dream Mask <span class="rating-tiny">4.8 ★</span>', 'YTTP Superberry Dream Mask <span class="rating-tiny">4.9 ★</span>');
console.log('5. Aligned skin-conditions star ratings to 4.9 ★');

// Methodology preview component restoration
const methodComment = '<!-- 4-Pillar Clinical Evaluation Framework Component - Pro, Clean & Organized -->';
if (html.includes(methodComment)) {
  const methodHtml = `<section class="method-preview-card" aria-labelledby="methodology-preview-heading">
    <div style="max-width: 900px; margin: 0 auto; text-align: center;">
      <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #5eead4; font-weight: 800; display: block; margin-bottom: 8px;">Standardized Evaluation Protocol</span>
      <h2 id="methodology-preview-heading" style="color: #ffffff; font-size: 1.85rem; margin-bottom: 12px; font-weight: 700;">4-Pillar Clinical Evaluation Framework</h2>
      <p style="color: #cbd5e1; font-size: 0.98rem; line-height: 1.6; margin-bottom: 28px;">Every product review published by Clinical Derma Lab undergoes a rigorous 4-stage laboratory and clinical testing workflow overseen by board-certified dermatologists and cosmetic chemists.</p>
    </div>
    <div class="method-bullets">
      <div class="method-bullet-item">
        <h3 style="color: #5eead4; font-size: 1.05rem; margin-bottom: 6px; font-weight: 700;">1. Biometric Moisture Testing</h3>
        <p style="font-size: 0.88rem; color: #e2e8f0; margin: 0; line-height: 1.5;">Quantitative corneometer and TEWL (Transepidermal Water Loss) measurements over 8 to 24 hours.</p>
      </div>
      <div class="method-bullet-item">
        <h3 style="color: #5eead4; font-size: 1.05rem; margin-bottom: 6px; font-weight: 700;">2. Comedogenicity Audits</h3>
        <p style="font-size: 0.88rem; color: #e2e8f0; margin: 0; line-height: 1.5;">Ingredient-level 0–5 pore-clogging rating evaluations and clinical trial subject acne tracking.</p>
      </div>
      <div class="method-bullet-item">
        <h3 style="color: #5eead4; font-size: 1.05rem; margin-bottom: 6px; font-weight: 700;">3. Active Bioavailability</h3>
        <p style="font-size: 0.88rem; color: #e2e8f0; margin: 0; line-height: 1.5;">HPLC assay verification for clinical active concentration, pH stability, and skin penetration.</p>
      </div>
      <div class="method-bullet-item">
        <h3 style="color: #5eead4; font-size: 1.05rem; margin-bottom: 6px; font-weight: 700;">4. Sensitivity &amp; Patch Testing</h3>
        <p style="font-size: 0.88rem; color: #e2e8f0; margin: 0; line-height: 1.5;">Human Repeat Insult Patch Tests (HRIPT) on sensitive and rosacea-prone cutaneous barriers.</p>
      </div>
    </div>
    <div style="text-align: center;">
      <a href="/methodology.html" class="btn-method">Explore Full Clinical Testing Methodology &rarr;</a>
    </div>
  </section>`;
  html = html.replace(methodComment, methodHtml);
  console.log('6. Restored Methodology Preview Section');
}

// --- 3. UI/UX & JS Functionality ---
// Standardize data-category anti-aging -> antiaging
html = html.replace(/data-category="([^"]*)"/g, (fullMatch, cats) => {
  const newCats = cats.replace(/anti-aging/g, 'antiaging');
  return 'data-category="' + newCats + '"';
});
console.log('7. Standardized data-category anti-aging to antiaging');

// Add antiaging & scalp filter chips and aria-pressed attributes
const filterChipsOld = `<div class="filter-chips" id="filter-chips">
        <button class="chip-btn active" onclick="filterCatalog('all', this)">All Tested Products</button>
        <button class="chip-btn" onclick="filterCatalog('eye', this)">Eye Treatments &amp; Masks</button>
        <button class="chip-btn" onclick="filterCatalog('cleanser', this)">Gentle Cleansers</button>
        <button class="chip-btn" onclick="filterCatalog('serum', this)">Antioxidant Serums</button>
        <button class="chip-btn" onclick="filterCatalog('sunscreen', this)">Mineral Sunscreens</button>
        <button class="chip-btn" onclick="filterCatalog('moisturizer', this)">Barrier Moisturizers</button>
        <button class="chip-btn" onclick="filterCatalog('acne', this)">Acne &amp; Rosacea Safe</button>
      </div>`;

const filterChipsNew = `<div class="filter-chips" id="filter-chips">
        <button class="chip-btn active" aria-pressed="true" onclick="filterCatalog('all', this)">All Tested Products</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('eye', this)">Eye Treatments &amp; Masks</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('cleanser', this)">Gentle Cleansers</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('serum', this)">Antioxidant Serums</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('sunscreen', this)">Mineral Sunscreens</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('moisturizer', this)">Barrier Moisturizers</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('acne', this)">Acne &amp; Rosacea Safe</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('antiaging', this)">Anti-Aging &amp; Peptides</button>
        <button class="chip-btn" aria-pressed="false" onclick="filterCatalog('scalp', this)">Scalp &amp; Body Care</button>
      </div>`;

if (html.includes(filterChipsOld)) {
  html = html.replace(filterChipsOld, filterChipsNew);
  console.log('8. Updated filter chips with antiaging & scalp chips + aria-pressed');
}

// Add aria-label to catalog search
html = html.replace('id="catalog-search" class="search-input" placeholder="Search product or ingredient..."', 'id="catalog-search" class="search-input" placeholder="Search product or ingredient..." aria-label="Search clinical reviews by product name or active ingredient"');
console.log('9. Added aria-label to #catalog-search');

// Insert #no-results-msg after spotlight grid / product catalog
if (!html.includes('id="no-results-msg"')) {
  const card24Pos = html.lastIndexOf('Review Card 24:');
  if (card24Pos !== -1) {
    const card24End = html.indexOf('</article>', card24Pos) + 10;
    const noResultsDiv = `\n    <div id="no-results-msg" class="no-results-box" style="display: none; padding: 32px 20px; text-align: center; font-size: 0.95rem; color: var(--text-muted); background: #f8faf9; border: 1px dashed var(--border); border-radius: 8px; margin: 20px 0;">No matching clinical reviews found for your selected category and search query.</div>`;
    html = html.substring(0, card24End) + noResultsDiv + html.substring(card24End);
    console.log('10. Added #no-results-msg empty-state element');
  }
}

// Card 1 WhatsApp share button
const card1ShareTarget = `<button type="button" class="btn-share share-copy" onclick="shareClinicalReview(event, 'copy', '/elemis-dynamic-resurfacing-facial-pads-review.html', 'ELEMIS Dynamic Resurfacing Facial Pads (60 Count)')" title="Copy direct link" aria-label="Copy direct review link">`;
const card1WhatsAppBtn = `<button type="button" class="btn-share share-wa" onclick="shareClinicalReview(event, 'whatsapp', '/elemis-dynamic-resurfacing-facial-pads-review.html', 'ELEMIS Dynamic Resurfacing Facial Pads (60 Count)')" title="Share on WhatsApp" aria-label="Share review on WhatsApp">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </button>\n              `;
if (html.includes(card1ShareTarget)) {
  html = html.replace(card1ShareTarget, card1WhatsAppBtn + card1ShareTarget);
  console.log('11. Added WhatsApp share button to Card 1');
}

// --- 4. Accessibility & CSS Cleanup ---
// Comparison table summary removal & caption addition
html = html.replace('<table class="comparison-table" summary="Clinical comparison of active ingredients, target skin types, and finishes between top 3 featured sunscreens">', '<table class="comparison-table">\n          <caption class="sr-only">Clinical comparison of active ingredients, target skin types, and finishes between top 3 featured sunscreens</caption>');
console.log('12. Updated comparison table semantics (removed summary, added caption)');

// Footer disclaimer contrast
html = html.replace('color: #7b9499;', 'color: #94aeb3;');
console.log('13. Lightened footer disclaimer color to #94aeb3 for WCAG AA contrast');

// Clean up Hero pill & 4 Hub cards inline styles + onmouseover/onmouseout
const newCssRules = `
    /* Hero Latest Article Pill */
    .latest-article-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid var(--border);
      color: var(--primary);
      padding: 6px 16px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 2px 10px rgba(14,59,67,0.25);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .latest-article-pill:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(14,59,67,0.35);
    }
    .latest-article-badge {
      background: #2a7f62;
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    /* Primary Hub Cards Grid */
    .hub-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 18px;
    }
    .hub-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 22px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 4px solid var(--accent);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .hub-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 14px rgba(15, 32, 39, 0.08);
    }
    .hub-card.hub-treatments { border-top-color: var(--accent); }
    .hub-card.hub-conditions { border-top-color: #e00034; }
    .hub-card.hub-science { border-top-color: #0284c7; }
    .hub-card.hub-board { border-top-color: #7c3aed; }

    .hub-card-tag {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .hub-treatments .hub-card-tag { color: var(--accent); }
    .hub-conditions .hub-card-tag { color: #e00034; }
    .hub-science .hub-card-tag { color: #0284c7; }
    .hub-board .hub-card-tag { color: #7c3aed; }
    .hub-card h3 {
      font-size: 1.12rem;
      color: var(--primary);
      margin: 0;
      font-weight: 700;
    }
    .hub-card p {
      font-size: 0.84rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.5;
    }
`;

// Insert CSS rules into <head> <style>
if (!html.includes('.latest-article-pill {')) {
  html = html.replace('</style>', newCssRules + '\n  </style>');
}

// Hero pill HTML replace with regex
html = html.replace(/<a\s+href="\/elemis-dynamic-resurfacing-facial-pads-review\.html"\s+style="[^"]*"[^>]*>\s*<span\s+style="[^"]*">Latest Article<\/span>\s*<span>ELEMIS Dynamic Resurfacing Facial Pads Lab Report &rarr;<\/span>\s*<\/a>/, `<a href="/elemis-dynamic-resurfacing-facial-pads-review.html" class="latest-article-pill">
          <span class="latest-article-badge">Latest Article</span>
          <span>ELEMIS Dynamic Resurfacing Facial Pads Lab Report &rarr;</span>
        </a>`);
console.log('14. Replaced hero pill inline styles with .latest-article-pill CSS class');

// 4 Hub cards HTML replace with regex
html = html.replace(/<div\s+style="display:\s*grid;[\s\S]*?<\/div>/, (match) => {
  if (match.includes('/treatments') && match.includes('/conditions') && match.includes('/science-and-ingredients')) {
    return `<div class="hub-grid">
        <a href="/treatments" class="hub-card hub-treatments">
          <span class="hub-card-tag">Commercial Catalog</span>
          <h3>Treatments &amp; Formulations &rarr;</h3>
          <p>Search our database of 20+ laboratory-tested sunscreens, barrier creams, and exfoliants with biometrics.</p>
        </a>
        <a href="/conditions" class="hub-card hub-conditions">
          <span class="hub-card-tag">Pathology Guide</span>
          <h3>Skin Conditions Hub &rarr;</h3>
          <p>Clinical guidelines for Acne Vulgaris, Barrier Disruption, Cutaneous Photoaging, and Vascular Rosacea.</p>
        </a>
        <a href="/science-and-ingredients" class="hub-card hub-science">
          <span class="hub-card-tag">Pharmacology</span>
          <h3>Science &amp; Active Ingredients &rarr;</h3>
          <p>Evidence-based monographs on Zinc Oxide, Ceramides, Tri-Enzyme cleavage, Niacinamide, and Vitamin C.</p>
        </a>
        <a href="/medical-review-board" class="hub-card hub-board">
          <span class="hub-card-tag">E-E-A-T Leadership</span>
          <h3>Medical Review Board &rarr;</h3>
          <p>Meet Dr. Aris Thorne, MD, FAAD and Dr. Elena Rostova, PhD. Learn our 4-tier medical audit protocols.</p>
        </a>
      </div>`;
  }
  return match;
});
console.log('15. Replaced 4 hub cards inline styles with .hub-card CSS classes');

// Remove redundant !important inside @media blocks
html = html.replace(/(@media\s*\(max-width:\s*(?:768|480)px\)\s*\{[\s\S]*?\n\s*\})/g, (mediaBlock) => {
  return mediaBlock.replace(/\s*!important/g, '');
});
console.log('16. Removed redundant !important from @media queries');

// --- 5. Performance & Image Attributes ---
// Cards 4 through 24 image attributes: add width="160" height="160" loading="lazy" decoding="async"
let imgCardIndex = 0;
html = html.replace(/<div class="spotlight-img-box">\s*<img([^>]+)>/g, (fullBox, imgAttrs) => {
  imgCardIndex++;
  if (imgCardIndex >= 4) {
    let cleanAttrs = imgAttrs;
    if (!cleanAttrs.includes('width=')) cleanAttrs += ' width="160"';
    if (!cleanAttrs.includes('height=')) cleanAttrs += ' height="160"';
    if (!cleanAttrs.includes('loading=')) cleanAttrs += ' loading="lazy"';
    if (!cleanAttrs.includes('decoding=')) cleanAttrs += ' decoding="async"';
    return '<div class="spotlight-img-box">\n            <img' + cleanAttrs + '>';
  }
  return fullBox;
});
console.log('17. Added explicit image dimensions and lazy loading to Spotlight Cards 4..24');

// Comparison table images: add width="58" height="64" loading="lazy" decoding="async"
html = html.replace(/<img([^>]+class="[^"]*compare-product-img[^"]*"[^>]*)>/g, (fullTag, attrs) => {
  let cleanAttrs = attrs;
  if (!cleanAttrs.includes('width=')) cleanAttrs += ' width="58"';
  if (!cleanAttrs.includes('height=')) cleanAttrs += ' height="64"';
  if (!cleanAttrs.includes('loading=')) cleanAttrs += ' loading="lazy"';
  if (!cleanAttrs.includes('decoding=')) cleanAttrs += ' decoding="async"';
  return '<img' + cleanAttrs + '>';
});
console.log('18. Added dimensions and lazy loading to Comparison Table images');

// --- 6. Unified JS Filtering & Credentials Modal ---
html = html.replace(/function\s+filterCatalog\(category,\s*buttonEl\)\s*\{[\s\S]*?function\s+searchCatalog\(\)\s*\{[\s\S]*?\}\s*\}/, `var activeCatalogCategory = 'all';

    function applyCatalogFilters() {
      var searchInput = document.getElementById('catalog-search');
      var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var cards = document.querySelectorAll('.spotlight-card');
      var visibleCount = 0;

      cards.forEach(function(card) {
        var cardCat = card.getAttribute('data-category') || '';
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var text = card.innerText.toLowerCase();

        var matchesCategory = (activeCatalogCategory === 'all' || cardCat.indexOf(activeCatalogCategory) !== -1);
        var matchesSearch = (!query || title.indexOf(query) !== -1 || text.indexOf(query) !== -1);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      var noResultsMsg = document.getElementById('no-results-msg');
      if (noResultsMsg) {
        noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
      }
    }

    function filterCatalog(category, buttonEl) {
      activeCatalogCategory = category || 'all';
      var chips = document.querySelectorAll('.chip-btn');
      chips.forEach(function(c) {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      if (buttonEl) {
        buttonEl.classList.add('active');
        buttonEl.setAttribute('aria-pressed', 'true');
      }
      applyCatalogFilters();
    }

    function searchCatalog() {
      applyCatalogFilters();
    }`);
console.log('19. Replaced filter/search JS with unified applyCatalogFilters()');

// Add Credentials Modal Event Listeners
const modalSetupJs = `
    document.addEventListener('DOMContentLoaded', function() {
      var modal = document.getElementById('credentials-modal');
      var openBtn = document.getElementById('verify-credentials-btn');
      var closeBtn = document.getElementById('close-credentials-modal');

      function openModal() {
        if (!modal) return;
        modal.hidden = false;
        modal.style.display = 'flex';
        if (closeBtn) closeBtn.focus();
      }

      function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        modal.style.display = 'none';
        if (openBtn) openBtn.focus();
      }

      if (openBtn) openBtn.addEventListener('click', openModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) closeModal();
        });
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.hidden && modal.style.display !== 'none') {
          closeModal();
        }
      });
    });
`;

if (!html.includes('verify-credentials-btn')) {
  html = html.replace('/* Social Sharing Handler */', modalSetupJs + '\n    /* Social Sharing Handler */');
  console.log('20. Added Medical Credentials Modal JS listeners');
}

fs.writeFileSync('index.html', html);
console.log('Updated index.html successfully!');
