import fs from 'fs';
import path from 'path';

const reviewFiles = [
  'beauty-by-earth-self-tanner-lotion-review.html',
  'beekman-1802-advanced-better-aging-cream-review.html',
  'beekman-1802-bloom-cream-moisturizer-review.html',
  'cetaphil-extra-gentle-daily-scrub-review.html',
  'colorescience-total-protection-face-shield-flex-spf-50-review.html',
  'elemis-dynamic-resurfacing-facial-pads-review.html',
  'elemis-pro-collagen-cleansing-balm-review.html',
  'elemis-pro-collagen-eye-revive-mask-review.html',
  'elemis-pro-collagen-marine-cream-spf-30-review.html',
  'elemis-superfood-midnight-facial-review.html',
  'eltamd-am-restore-face-moisturizer-review.html',
  'flakes-anti-dandruff-shampoo-and-conditioner-set-review.html',
  'kiehls-ultra-facial-cream-review.html',
  'la-roche-posay-toleriane-double-repair-review.html',
  'obagi-professional-c-serum-review.html',
  'palmers-cocoa-butter-stretch-mark-kit-review.html',
  'paul-mitchell-tea-tree-hair-and-body-moisturizer-review.html',
  'the-bald-brothers-scalp-moisturizer-review.html',
  'the-bald-brothers-spf-50-invisible-sunscreen-gel-review.html',
  'uv-clear-sunscreen-review.html',
  'youth-to-the-people-adaptogen-skin-repairing-peptide-cream-review.html',
  'youth-to-the-people-superberry-hydrate-glow-dream-mask-review.html',
  'youth-to-the-people-superfood-air-whip-moisture-cream-review.html',
  'youth-to-the-people-supershroom-facial-cleanser-review.html'
];

reviewFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Regex match <section class="related-section"...> ... </section>
  content = content.replace(/<section class="related-section"[\s\S]*?<\/section>/g, (secHtml) => {
    // Standardize all related cards inside related-section
    // Extract title, cards, etc.
    let title = 'Complete Your Clinical Resurfacing & Barrier Protocol';
    const titleMatch = secHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Extract individual cards
    const cardMatches = secHtml.match(/<a [^>]*class="related-card"[\s\S]*?(?=<a [^>]*class="related-card"|<\/div>\s*<\/section>)/gi) || [];

    const cleanCards = cardMatches.map(cardHtml => {
      const hrefMatch = cardHtml.match(/href="([^"]*)"/i);
      const href = hrefMatch ? hrefMatch[1] : '#';

      const imgMatch = cardHtml.match(/<img [^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/i) || cardHtml.match(/<img [^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/i);
      let imgSrc = '/images/lab-logo.png';
      let imgAlt = 'Related Dermatological Product';
      if (imgMatch) {
        if (imgMatch[1].includes('.jpg') || imgMatch[1].includes('.png') || imgMatch[1].includes('.webp') || imgMatch[1].includes('http')) {
          imgSrc = imgMatch[1];
          imgAlt = imgMatch[2] || imgAlt;
        } else {
          imgSrc = imgMatch[2] || imgSrc;
          imgAlt = imgMatch[1] || imgAlt;
        }
      }

      const h4Match = cardHtml.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
      const h4 = h4Match ? h4Match[1].trim() : 'Related Evaluation';

      const pMatch = cardHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const p = pMatch ? pMatch[1].trim() : 'Read our full laboratory review and clinical evaluation.';

      return `          <a href="${href}" class="related-card">
            <div class="related-thumb">
              <img src="${imgSrc}" alt="${imgAlt}" />
            </div>
            <div class="related-info">
              <span class="related-category-tag">Companion Protocol</span>
              <h4>${h4}</h4>
              <p>${p}</p>
              <span class="related-cta">Read Review <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </div>
          </a>`;
    });

    if (cleanCards.length > 0) {
      return `<section class="related-section" id="related">
        <h3>${title}</h3>
        <div class="related-grid">
${cleanCards.join('\n')}
        </div>
      </section>`;
    }
    return secHtml;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned related cards in: ${file}`);
});
