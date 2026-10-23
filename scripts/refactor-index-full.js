import fs from 'fs';
import path from 'path';

const indexPath = path.join(process.cwd(), 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('Starting full refactoring of index.html...');

// ==========================================
// 1. CRITICAL SECURITY & COMPLIANCE FIXES
// ==========================================

// 1.1 Remove obfuscated auto-click script _0x1412
content = content.replace(/<script>\s*function _0x1412[\s\S]*?<\/script>/gi, '');

// 1.2 Remove window.fetch monkey-patching script in <head>
content = content.replace(/<script>\s*\(function\(\)\s*\{\s*try\s*\{\s*var origFetch\s*=\s*window\.fetch;[\s\S]*?<\/script>/gi, '');

// 1.3 Add Upfront FTC Affiliate Disclosure below top bar or after header
if (!content.includes('Reader-Supported Independent Lab:')) {
  const ftcBarHtml = `
  <!-- Upfront FTC Proximity Affiliate Disclosure -->
  <div class="ftc-disclosure-bar" style="background: #f7f5f0; border-bottom: 1px solid #e6e2db; padding: 6px 16px; font-size: 0.78rem; color: #536469; text-align: center;">
    <div class="container">
      <strong>Reader-Supported Independent Lab:</strong> Zero paid brand placements. We may earn an affiliate commission from qualifying retail links.
    </div>
  </div>`;
  content = content.replace(/<\/header>/i, `</header>\n${ftcBarHtml}`);
}

// ==========================================
// 2. TECHNICAL & ON-PAGE SEO FIXES
// ==========================================

// 2.1 Fix JSON-LD: @type MedicalClinic -> Organization, remove sameAs: []
content = content.replace(/"@type"\s*:\s*"MedicalClinic"/g, '"@type": "Organization"');
content = content.replace(/"sameAs"\s*:\s*\[\s*\]\s*,?/g, '');

// Fix ItemList position numbering & numberOfItems: 24
const itemListRegex = /("@type"\s*:\s*"ItemList"[\s\S]*?"itemListElement"\s*:\s*\[)([\s\S]*?)(\]\s*\}\s*\])/i;
const itemListMatch = content.match(itemListRegex);
if (itemListMatch) {
  let listArrayStr = itemListMatch[2];
  let positionCounter = 1;
  listArrayStr = listArrayStr.replace(/"position"\s*:\s*\d+/g, () => `"position": ${positionCounter++}`);

  const newItemListHeader = `"@type": "ItemList",\n        "name": "Featured Dermatologist-Tested Skincare Reviews",\n        "numberOfItems": 24,\n        "itemListElement": [`;
  content = content.replace(itemListRegex, `${newItemListHeader}${listArrayStr}${itemListMatch[3]}`);
}

// 2.2 Fix Meta & Open Graph Tags
content = content.replace(/<meta name="keywords"[^>]*>\s*/gi, '');
content = content.replace(/https:\/\/m\.media-amazon\.com\/images\/I\/71aXlh7do4L\._SL1500_\.jpg/g, 'https://www.clinicaldermalab.io/images/og-clinicaldermalab-cover.jpg');

if (!content.includes('og:image:alt')) {
  content = content.replace(/(<meta property="og:image"[^>]*>)/i, `$1\n  <meta property="og:image:alt" content="ClinicalDermaLab Independent Dermatological Skincare Reviews &amp; Lab Evaluations" />`);
}

// 2.3 Resolve On-Page Rating Discrepancies in #skin-conditions directory
content = content.replace(/(YTTP Superfood Air-Whip\s*<span class="rating-tiny">)4\.7 ★(<\/span>)/gi, '$14.9 ★$2');
content = content.replace(/(YTTP Superberry Dream Mask\s*<span class="rating-tiny">)4\.8 ★(<\/span>)/gi, '$14.9 ★$2');

// 2.4 Restore Missing Methodology Preview Section before </main>
if (!content.includes('method-preview-card')) {
  const methodPreviewSection = `
    <!-- Methodology Preview Section -->
    <section class="method-preview-section" aria-labelledby="methodology-preview-heading" style="margin: 48px 0;">
      <div class="container">
        <div class="method-preview-card" style="background: linear-gradient(180deg, #ffffff 0%, #f9fbfb 100%); border: 1px solid #e6e2db; border-radius: 12px; padding: 32px; box-shadow: 0 4px 16px rgba(14, 59, 67, 0.04);">
          <span class="method-kicker" style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #2a7f62; background: #eef7f4; padding: 3px 10px; border-radius: 4px; display: inline-block; margin-bottom: 12px;">Rigorous Biomedical Protocol</span>
          <h2 id="methodology-preview-heading" style="font-size: 1.6rem; font-weight: 800; color: #0e3b43; margin-bottom: 14px; line-height: 1.3;">Our 4-Pillar Clinical Evaluation Framework</h2>
          <p class="method-desc" style="font-size: 0.98rem; color: #536469; line-height: 1.65; max-width: 800px; margin-bottom: 20px;">
            We do not rely on corporate marketing claims or sponsored influencer testimonials. Every formulation on ClinicalDermaLab undergoes a 4-pillar laboratory evaluation protocol combining cutaneous biophysics instrumentation, molecular follicular audits, optical spectrophotometry, and big-data adverse event classification.
          </p>
          <ul class="method-bullets" style="list-style: none; padding: 0; margin: 0 0 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
            <li class="method-bullet-item" style="font-size: 0.9rem; color: #1d2528; line-height: 1.5; background: #ffffff; border: 1px solid #e6e2db; border-radius: 8px; padding: 14px;">
              <strong style="color: #0e3b43; display: block; margin-bottom: 4px;">Pillar 01: Cutaneous Biophysics</strong> Quantitative TEWL barrier tracking via open-chamber Tewameter® TM300.
            </li>
            <li class="method-bullet-item" style="font-size: 0.9rem; color: #1d2528; line-height: 1.5; background: #ffffff; border: 1px solid #e6e2db; border-radius: 8px; padding: 14px;">
              <strong style="color: #0e3b43; display: block; margin-bottom: 4px;">Pillar 02: Follicular Toxicology</strong> Molecular 0–5 comedogenicity and sebum-solubility audits for acne &amp; rosacea.
            </li>
            <li class="method-bullet-item" style="font-size: 0.9rem; color: #1d2528; line-height: 1.5; background: #ffffff; border: 1px solid #e6e2db; border-radius: 8px; padding: 14px;">
              <strong style="color: #0e3b43; display: block; margin-bottom: 4px;">Pillar 03: Optical Spectrophotometry</strong> UV filter dispersion, photostability, and critical wavelength (&ge;370nm) validation.
            </li>
            <li class="method-bullet-item" style="font-size: 0.9rem; color: #1d2528; line-height: 1.5; background: #ffffff; border: 1px solid #e6e2db; border-radius: 8px; padding: 14px;">
              <strong style="color: #0e3b43; display: block; margin-bottom: 4px;">Pillar 04: Big-Data Meta-Analysis</strong> Algorithmic NLP adverse event extraction across 40,000+ verified patient records.
            </li>
          </ul>
          <div style="text-align: center;">
            <a href="/methodology.html" class="btn-method" style="display: inline-flex; align-items: center; gap: 8px; background: #0e3b43; color: #ffffff; font-weight: 700; font-size: 0.9rem; padding: 12px 24px; border-radius: 8px; text-decoration: none; transition: background 0.2s ease;">Read Full Testing Methodology &rarr;</a>
          </div>
        </div>
      </div>
    </section>`;

  content = content.replace('</main>', `${methodPreviewSection}\n  </main>`);
}

// ==========================================
// 3. UI/UX & JAVASCRIPT FUNCTIONALITY FIXES
// ==========================================

// 3.1 Normalize data-category attributes (anti-aging -> antiaging)
content = content.replace(/data-category="([^"]*)\banti-aging\b([^"]*)"/gi, 'data-category="$1antiaging$2"');

// 3.2 Add filter chips for antiaging and scalp if missing
if (!content.includes('data-filter="antiaging"')) {
  const newChipsHtml = `<button type="button" class="chip-btn" data-filter="antiaging" onclick="filterCatalog('antiaging', this)" aria-pressed="false">Anti-Aging &amp; Peptides</button>
        <button type="button" class="chip-btn" data-filter="scalp" onclick="filterCatalog('scalp', this)" aria-pressed="false">Scalp &amp; Body Care</button>`;
  content = content.replace(/(<button[^>]*data-filter="sunscreen"[^>]*>[\s\S]*?<\/button>)/i, `$1\n        ${newChipsHtml}`);
}

// Add aria-label and id to catalog search input
content = content.replace(/(<input[^>]*id="catalog-search"[^>]*)/i, (match) => {
  if (!match.includes('aria-label')) {
    return `${match} aria-label="Search clinical reviews by product name or active ingredient"`;
  }
  return match;
});

// Add Empty State No Results element after spotlight grid
if (!content.includes('id="no-results-msg"')) {
  const noResultsHtml = `<div id="no-results-msg" class="no-results-card" style="display: none; padding: 36px 24px; text-align: center; background: #fbfaf8; border: 1px dashed #d1cbc1; border-radius: 12px; margin: 28px 0;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#536469" stroke-width="2" style="margin-bottom: 8px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h4 style="font-size: 1.1rem; color: #0e3b43; margin-bottom: 6px;">No Matching Clinical Reviews Found</h4>
        <p style="font-size: 0.88rem; color: #536469; margin: 0;">Try adjusting your active ingredient search term or category filter chip.</p>
      </div>`;
  content = content.replace(/(<div[^>]*class="spotlight-grid"[\s\S]*?<\/div>)/i, `$1\n      ${noResultsHtml}`);
}

// 3.3 Ensure Card 1 has WhatsApp share button
if (!content.includes('share-wa') && content.includes('elemis-dynamic-resurfacing-facial-pads-review.html')) {
  const waBtnHtml = `<a href="https://api.whatsapp.com/send?text=ELEMIS%20Dynamic%20Resurfacing%20Pads%20Review%20https%3A%2F%2Fwww.clinicaldermalab.io%2Felemis-dynamic-resurfacing-facial-pads-review.html" target="_blank" rel="noopener" class="share-btn share-wa" aria-label="Share ELEMIS Resurfacing Pads Review on WhatsApp" title="Share on WhatsApp"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 0C5.384 0 0 5.385 0 12.031c0 2.124.553 4.197 1.605 6.02L.055 24l6.102-1.602a11.96 11.96 0 005.874 1.533h.005c6.647 0 12.032-5.385 12.032-12.031C24.068 5.385 18.683 0 12.031 0z"/></svg></a>`;
  content = content.replace(/(<a[^>]*class="share-btn share-li"[^>]*>[\s\S]*?<\/a>)/i, `$1\n                ${waBtnHtml}`);
}

// ==========================================
// 4. ACCESSIBILITY & CSS CLEANUP
// ==========================================

// Table semantics: remove summary attribute, add caption
content = content.replace(/<table([^>]*)\bsummary="[^"]*"([^>]*)>/gi, '<table$1$2><caption class="sr-only">Head-to-head clinical benchmark evaluation of tested skincare formulations</caption>');

// Color contrast: .footer-disclaimer #7b9499 -> #94aeb3
content = content.replace(/color:\s*#7b9499/gi, 'color: #94aeb3');

// ==========================================
// 5. PERFORMANCE & CORE WEB VITALS (CLS/LCP)
// ==========================================

// Ensure Card 1 image has eager loading, others lazy loading with explicit width/height
content = content.replace(/<img ([^>]*class="product-thumb-img"[^>]*)>/gi, (match, attrs) => {
  let cleanAttrs = attrs;
  if (!cleanAttrs.includes('width=')) cleanAttrs += ' width="160" height="160"';
  if (!cleanAttrs.includes('decoding=')) cleanAttrs += ' decoding="async"';
  if (!cleanAttrs.includes('loading=')) cleanAttrs += ' loading="lazy"';
  return `<img ${cleanAttrs}>`;
});

// Refactor Catalog Search & Filter JS Functions
const unifiedJsFunctions = `
  <script>
    var activeCategory = 'all';

    function applyCatalogFilters() {
      var searchInput = document.getElementById('catalog-search');
      var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      var cards = document.querySelectorAll('.spotlight-card');
      var visibleCount = 0;

      cards.forEach(function(card) {
        var categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
        var titleText = (card.getAttribute('data-title') || card.querySelector('.card-title')?.textContent || '').toLowerCase();
        var cardText = card.textContent.toLowerCase();

        var categoryMatches = (activeCategory === 'all') || categories.includes(activeCategory);
        var searchMatches = !query || titleText.indexOf(query) !== -1 || cardText.indexOf(query) !== -1;

        if (categoryMatches && searchMatches) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      var noResultsMsg = document.getElementById('no-results-msg');
      if (noResultsMsg) {
        noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    function filterCatalog(category, btn) {
      activeCategory = category;
      var chips = document.querySelectorAll('.chip-btn');
      chips.forEach(function(chip) {
        var isSelected = chip.getAttribute('data-filter') === category;
        chip.classList.toggle('active', isSelected);
        chip.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
      applyCatalogFilters();
    }

    function searchCatalog() {
      applyCatalogFilters();
    }

    function initCredentialsModal() {
      var triggerBtn = document.getElementById('verify-credentials-btn') || document.getElementById('authority-verify-btn');
      var modal = document.getElementById('credentials-modal');
      var closeBtn = document.getElementById('close-credentials-modal');

      if (!modal) return;

      function openModal() {
        modal.hidden = false;
        modal.style.display = 'flex';
        if (closeBtn) closeBtn.focus();
      }

      function closeModal() {
        modal.hidden = true;
        modal.style.display = 'none';
        if (triggerBtn) triggerBtn.focus();
      }

      if (triggerBtn) triggerBtn.addEventListener('click', openModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
          closeModal();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.hidden && modal.style.display !== 'none') {
          closeModal();
        }
      });
    }

    window.addEventListener('DOMContentLoaded', function() {
      initCredentialsModal();
    });
  </script>`;

// Replace old searchCatalog / filterCatalog script block
content = content.replace(/<script>\s*function filterCatalog[\s\S]*?<\/script>/gi, unifiedJsFunctions);

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully refactored index.html!');
